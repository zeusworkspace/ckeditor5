/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );
const chalk = require( 'chalk' );
const { tools } = require( '@ckeditor/ckeditor5-dev-utils' );

const DESTINATION_DOCS_PATH = 'docs/builds/guides/integration/features-html-output-overview.md';
const THIRD_PARTY_PACKAGES_LOCAL_DIR = 'scripts/docs/features-html-output/third-party-packages';

try {
	const { output, numberOfPackages } = createHtmlOutputMarkup();

	saveGeneratedOutput( output );

	console.log(
		`✨ ${ chalk.green( `The features HTML output page has been generated successfully for ${ numberOfPackages } packages.` ) }`
	);

	const shouldCommitChanges = process.argv.includes( '--commit' );

	if ( shouldCommitChanges ) {
		commitChanges();
	}
} catch ( error ) {
	console.log( `❌ ${ chalk.red( 'An error occurred during parsing a package metadata file.' ) }` );
	console.log( error );

	process.exit( 1 );
}

/**
 * Main parser function. Its purpose is to:
 * - read all package metadata files,
 * - parse and prepare the data for generating the features HTML output overview,
 * - use the parsed data to create tables for each package, that contains all plugins and their possible HTML output.
 *
 * Returns total number of parsed files.
 *
 * Each generated table contains 2 columns: "Plugin" and "HTML output". Each table cell in the "Plugin" column has a human-readable name of
 * the plugin (which is a link to the feature documentation) and the name of the class used to create the plugin (which is a link to the API
 * documentation). For each row in the "Plugin" column there is at least one row in the "HTML output" column. If given plugin does not
 * generate any output, the one and only row in the "HTML output" column contains the word "None". Each item from the `htmlOutput` property
 * from the package metadata file corresponds to a separate row in the "HTML output" column. It contains one or more preformatted paragraphs
 * describing the possible HTML output: HTML elements, their CSS classes, inline styles, other attributes and comments.
 *
 * ┏━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 * ┃    Plugin    ┃           HTML output          ┃
 * ┣━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
 * ┃ first plugin │ output #1 for the first plugin ┃
 * ┃              ├────────────────────────────────┨
 * ┃              ┄                                ┄
 * ┃              ├────────────────────────────────┨
 * ┃              │ output #N for the first plugin ┃
 * ┃──────────────┼────────────────────────────────┨
 * ┄              ┄                                ┄
 * ┃──────────────┼────────────────────────────────┨
 * ┃ last plugin  │ output #1 for the last plugin  ┃
 * ┃              ├────────────────────────────────┨
 * ┃              ┄                                ┄
 * ┃              ├────────────────────────────────┨
 * ┃              │ output #N for the last plugin  ┃
 * ┗━━━━━━━━━━━━━━┷━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 *
 * Generated table is preceded by the package name as a heading and the link to a source package metadata file on GitHub.
 *
 * @returns {Object} result
 * @returns {String} result.output Generated HTML markup.
 * @returns {Number} result.numberOfPackages Total number of package metadata files, that have been parsed.
 */
function createHtmlOutputMarkup() {
	const parsedFiles = parseFiles()
		.map( packageMetadata => {
			const outputRows = packageMetadata.plugins
				.map( plugin => {
					const numberOfRowsPerPlugin = plugin.htmlOutputMarkup.length;

					const pluginNameRowspan = numberOfRowsPerPlugin > 1 ?
						`rowspan="${ numberOfRowsPerPlugin }"` :
						'';

					return plugin.htmlOutputMarkup
						.map( ( htmlOutputMarkup, htmlOutputIndex ) => {
							const pluginNameCell = htmlOutputIndex === 0 ?
								`<td class="plugin" ${ pluginNameRowspan }>${ plugin.pluginNameMarkup }</td>` :
								'';

							return (
								'<tr>' +
									pluginNameCell +
									`<td class="html-output">${ htmlOutputMarkup }</td>` +
								'</tr>'
							);
						} )
						.join( '' );
				} )
				.join( '' );

			const {
				packageName,
				sourceFileMarkup,
				isExternalPackage,
				isThirdPartyPackage
			} = packageMetadata.package;

			const sourceFileLink = !isExternalPackage && !isThirdPartyPackage ?
				`<a href="https://github.com/ckeditor/ckeditor5/blob/master/packages/${ packageName }/ckeditor5-metadata.json">` +
					sourceFileMarkup +
				'</a>' :
				sourceFileMarkup;

			return (
				`<h3 id="${ packageName }"><code>${ packageName }</code></h3>` +
				`<p>Source file: ${ sourceFileLink }</p>` +
				'<table class="features-html-output">' +
					'<thead>' +
						'<tr>' +
							'<th class="plugin">Plugin</th>' +
							'<th class="html-output">HTML output</th>' +
						'</tr>' +
					'</thead>' +
					'<tbody>' +
						outputRows +
					'</tbody>' +
				'</table>'
			);
		} );

	return {
		output: parsedFiles.join( '' ),
		numberOfPackages: parsedFiles.length
	};
}

/**
 * Reads and parses all package metadata files, that match the glob pattern. The returned array is sorted alphabetically by package name.
 *
 * @returns {Array.<ParsedFile>}
 */
function parseFiles() {
	const globPattern = createGlobPattern();

	return glob.sync( globPattern )
		.map( readFile )
		.map( file => {
			try {
				return parseFile( file );
			} catch ( error ) {
				error.message = `Failed to parse ${ chalk.bold( file.path ) }\n${ error.message }`;

				throw error;
			}
		} )
		.sort( ( fileA, fileB ) => fileA.package.packageName.localeCompare( fileB.package.packageName ) );
}

/**
 * Reads config for third-party packages and returns a glob pattern, that includes all paths to the package metadata file for all packages:
 * CKEditor 5, Collaboration Features, Internal and the third-party ones. If third-party package installed locally in node_modules does not
 * contain the package metadata file, the fallback path to a locally maintained package metadata file is used instead.
 *
 * @returns {String}
 */
function createGlobPattern() {
	const thirdPartyPackagesConfig = JSON.parse( fs.readFileSync( `${ THIRD_PARTY_PACKAGES_LOCAL_DIR }/paths.json`, 'utf-8' ) );

	const paths = [
		'packages/*',
		'external/*/packages/*',
		...thirdPartyPackagesConfig.map( packageConfig => fs.existsSync( `${ packageConfig.path }/ckeditor5-metadata.json` ) ?
			packageConfig.path :
			packageConfig.fallbackPath
		)
	];

	return `{${ paths.join( ',' ) }}/ckeditor5-metadata.json`;
}

/**
 * Reads the package metadata file.
 *
 * @param {String} path File path relative to CWD.
 * @returns {File}
 */
function readFile( path ) {
	return {
		path,
		content: fs.readFileSync( path, 'utf-8' )
	};
}

/**
 * Parses the package metadata file.
 *
 * @param {File} file Contains file path and its content to parse.
 * @returns {ParsedFile}
 */
function parseFile( file ) {
	const metadata = JSON.parse( file.content );

	const packageName = path.basename( path.dirname( file.path ) );

	const isExternalPackage = file.path.startsWith( 'external/' );

	const isThirdPartyPackage = !file.path.startsWith( 'packages/' ) && !isExternalPackage;

	const sourceFileMarkup = isThirdPartyPackage ?
		createSourceFileMarkupForThirdPartyPackage( file.path ) :
		`<code>@ckeditor/${ packageName }/ckeditor5-metadata.json</code>`;

	const packageData = {
		packageName,
		sourceFileMarkup,
		isExternalPackage,
		isThirdPartyPackage
	};

	const plugins = createHtmlOutputMarkupForPackage( packageData, metadata.plugins );

	return {
		package: packageData,
		plugins
	};
}

/**
 * Creates HTML markup containing the path to the package metadata file for a third-party package. If the path to the package metadata file
 * does not lead to the node_modules folder (what means that the locally maintained package metadata file is used instead), function returns
 * an info that the source file has not been published yet.
 *
 * @param {String} filePath File path to the package metadata file.
 * @returns {String}
 */
function createSourceFileMarkupForThirdPartyPackage( filePath ) {
	const match = filePath.match( /node_modules\/(.*)/ );

	return match ?
		`<code>${ match[ 1 ] }</code>` :
		'<i>not published yet</i>';
}

/**
 * Parses all plugins from package metadata file and generates the HTML output markup for each plugin.
 *
 * @param {Package} packageData Package properties.
 * @param {Array.<Plugin>} plugins Plugins to parse.
 * @returns {Array.<ParsedPlugin>}
 */
function createHtmlOutputMarkupForPackage( packageData, plugins = [] ) {
	return plugins
		.map( plugin => {
			const pluginNameLink = createFeatureLink( packageData, plugin );

			const pluginClassNameLink = createApiLink( packageData, plugin );

			const htmlOutputMarkup = plugin.htmlOutput ?
				createHtmlOutputMarkupForPlugin( plugin.htmlOutput ) :
				[ '<p>None.</p>' ];

			return {
				pluginNameMarkup: `<p>${ pluginNameLink }</p><p>${ pluginClassNameLink }</p>`,
				htmlOutputMarkup
			};
		} );
}

/**
 * Creates link to the plugin's feature documentation. If the feature documentation is missing, just the plugin name is returned.
 *
 * @param {Package} packageData Package properties.
 * @param {Plugin} plugin Plugin definition.
 * @returns {String}
 */
function createFeatureLink( packageData, plugin ) {
	if ( !plugin.docs ) {
		return plugin.name;
	}

	const link = /http(s)?:/.test( plugin.docs ) ?
		plugin.docs :
		`../../../${ plugin.docs }`;

	const skipLinkValidation = packageData.isExternalPackage ? 'data-skip-validation' : '';

	return `<a href="${ link }" ${ skipLinkValidation }>${ plugin.name }</a>`;
}

/**
 * Creates link to the plugin's API documentation. If given package is a third-party one, just the plugin class name is returned.
 *
 * @param {Package} packageData Package properties.
 * @param {Plugin} plugin Plugin definition.
 * @returns {String}
 */
function createApiLink( packageData, plugin ) {
	const pluginClassName = `<code>${ plugin.className }</code>`;

	if ( packageData.isThirdPartyPackage ) {
		return pluginClassName;
	}

	const shortPackageName = packageData.packageName.replace( /^ckeditor5-/g, '' );

	const packagePath = plugin.path
		.replace( /(^src\/)|(\.js$)/g, '' )
		.replace( /\//g, '_' );

	const link = `../../../api/module_${ shortPackageName }_${ packagePath }-${ plugin.className }.html`;

	const skipLinkValidation = packageData.isExternalPackage ? 'data-skip-validation' : '';

	return `<a href="${ link }" ${ skipLinkValidation }>${ pluginClassName }</a>`;
}

/**
 * Prepares the HTML output to a format, that is ready to be displayed. The generated array of strings contains preformatted paragraphs with
 * applied visual formatting (i.e. <strong> or <code> tags).
 *
 * @param {HtmlOutput} htmlOutput
 * @returns {Array.<String>}
 */
function createHtmlOutputMarkupForPlugin( htmlOutput ) {
	const appendClasses = ( classes, separators ) => output => {
		if ( !classes ) {
			return output;
		}

		const parsedClasses = toArray( classes ).join( ' ' );

		return (
			output +
			separators.prefix +
			`<strong>class</strong>="${ parsedClasses }"` +
			separators.suffix
		);
	};

	const appendStyles = ( styles, separators ) => output => {
		if ( !styles ) {
			return output;
		}

		const parsedStyles = toArray( styles )
			.map( wrapBy( { suffix: ':*' } ) )
			.join( '; ' );

		return (
			output +
			separators.prefix +
			`<strong>style</strong>="${ parsedStyles }"` +
			separators.suffix
		);
	};

	const appendAttributes = ( attributes, separators ) => output => {
		if ( !attributes ) {
			return output;
		}

		const parsedAttributes = toArray( attributes )
			.map( wrapBy( { prefix: '<strong>', suffix: '</strong>' } ) )
			.map( wrapBy( { suffix: '="*"' } ) )
			.map( wrapBy( { prefix: separators.prefix, suffix: separators.suffix } ) )
			.join( '' );

		return output + parsedAttributes;
	};

	return htmlOutput
		.map( entry => {
			const isMultiAttributeElement = [
				entry.classes,
				entry.styles,
				...toArray( entry.attributes )
			].filter( i => !!i ).length > 1;

			const separators = {
				prefix: isMultiAttributeElement ? ' '.repeat( 4 ) : ' ',
				suffix: isMultiAttributeElement ? '<br>' : ''
			};

			const elements = entry.elements ?
				toArray( entry.elements )
					.map( wrapBy( { prefix: '<strong>', suffix: '</strong>' } ) )
					.map( wrapBy( { suffix: separators.suffix } ) )
					.map( appendClasses( entry.classes, separators ) )
					.map( appendStyles( entry.styles, separators ) )
					.map( appendAttributes( entry.attributes, separators ) )
					.map( wrapBy( { prefix: '&lt;', suffix: '&gt;' } ) )
					.map( wrapBy( { prefix: '<code>', suffix: '</code>' } ) )
					.join( '' ) :
				'';

			const others = entry.implements ?
				`<p>HTML element may contain classes, styles or attributes, that are created by other plugins, which alter the ${
					toArray( entry.implements )
						.map( wrapBy( { prefix: '&lt;', suffix: '&gt;' } ) )
						.map( wrapBy( { prefix: '<code>', suffix: '</code>' } ) )
						.join( ', ' )
				} element.</p>` :
				'';

			const comment = entry._comment ?
				`<p>${
					entry._comment
						.replace( '<', '&lt;' )
						.replace( '>', '&gt;' )
						.replace( /`(.*?)`/g, '<code>$1</code>' )
						.replace( /\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>' )
				}</p>` :
				'';

			return [ elements, others, comment ]
				.filter( item => !!item )
				.join( '' );
		} );
}

/**
 * Saves generated output in the destination file.
 *
 * @param {String} output Generated output to be saved in the destination file.
 */
function saveGeneratedOutput( output ) {
	output = beautify( output );

	output = fs
		.readFileSync( DESTINATION_DOCS_PATH, 'utf-8' )
		.replace( /(<!-- features-html-output-marker -->)[\s\S]*/, `$1\n${ output }` );

	fs.writeFileSync( DESTINATION_DOCS_PATH, output );
}

/**
 * Beautifies the input HTML string by adding new lines and then indenting some HTML elements. It does not validate the input HTML string,
 * so if it is invalid (i.e. has missing closing tags) then probably this function will fail.
 *
 * @param {String} input String containing HTML elements to beutify.
 * @returns {String}
 */
function beautify( input ) {
	const lines = input
		// Add new line before `<tag>` or `</tag>`, but only if it is not already preceded by a new line (negative lookbehind).
		.replace( /(?<!\n)<(\/)?(table|thead|tbody|tr|th|td|p)( .*?)?>/g, '\n<$1$2$3>' )
		// Add new line after `<tag>` or `</tag>`, but only if it is not already followed by a new line (negative lookahead).
		.replace( /<(\/)?(table|thead|tbody|tr|th|td|p)( .*?)?>(?!\n)/g, '<$1$2$3>\n' )
		// Remove whitespace before `>`, that may appear there after adding an empty attribute.
		.replace( /\s+>/g, '>' )
		// Divide input string into lines, which start with either an opening tag, a closing tag, or just a text.
		.split( '\n' );

	let indentCount = 0;

	return lines
		.map( ( line, index ) => {
			if ( isOpeningTag( line ) && hasClosingTagFor( line, lines.slice( index ) ) ) {
				return indentLine( line, indentCount++ );
			}

			if ( isClosingTag( line ) ) {
				return indentLine( line, --indentCount );
			}

			return indentLine( line, indentCount );
		} )
		.join( '\n' );
}

/**
 * Commits generated changes. If output file has not been changed, nothing is commited.
 */
function commitChanges() {
	const exec = command => tools.shExec( command, { verbosity: 'error' } );

	const hasChanges = exec( `git diff --name-only ${ DESTINATION_DOCS_PATH }` ).trim().length;

	if ( !hasChanges ) {
		console.log( 'ℹ️ Nothing to commit. The features HTML output overview guide is up to date.' );

		return;
	}

	const hasStagedChanges = exec( 'git diff --cached --name-only' ).trim().length;

	if ( hasStagedChanges ) {
		console.log( 'ℹ️ There are changes, that have been already staged for next commit. Commit or stash them first.' );

		return;
	}

	exec( `git add ${ DESTINATION_DOCS_PATH }` );
	exec( 'git commit -m "Docs (ckeditor5): Updated the features HTML output overview guide."' );

	console.log( 'ℹ️ Successfully commited generated changes.' );
}

/**
 * Checks, if an argument is an opening tag.
 *
 * @param {String} line String to check.
 * @returns {Boolean}
 */
function isOpeningTag( line ) {
	return line.startsWith( '<' ) && !isClosingTag( line );
}

/**
 * Checks, if an argument is a closing tag.
 *
 * @param {String} line String to check.
 * @returns {Boolean}
 */
function isClosingTag( line ) {
	return line.startsWith( '</' );
}

/**
 * Checks, if there is a closing tag for currently examined opening tag.
 *
 * @param {String} tag Currently examined opening tag.
 * @param {Array.<String>} lines Next lines to search for a closing tag.
 * @returns {Boolean}
 */
function hasClosingTagFor( tag, lines ) {
	const closingTag = tag.replace( /<([a-z]+).*>/, '</$1>' );

	return lines.some( line => line === closingTag );
}

/**
 * Indents a line by a specified number of characters.
 *
 * @param {String} line Line to indent.
 * @param {Number} indentCount Number of characters to use for indentation.
 * @param {String} [indentChar] Indentation character.
 * @returns {String}
 */
function indentLine( line, indentCount, indentChar = '\t' ) {
	return `${ indentChar.repeat( indentCount ) }${ line }`;
}

/**
 * Helper, which transforms any value to an array. If the provided value is already an array, it is returned unchanged.
 *
 * @param {*} data The value to transform to an array.
 * @returns {Array.<*>} An array created from data.
 */
function toArray( data ) {
	return Array.isArray( data ) ? data : [ data ];
}

/**
 * Helper (factory), which creates a function, that prepends and/or appends provided value by another value.
 *
 * @param {Object} options Options to define prefix and/or suffix.
 * @param {String} [options.prefix] A string to add as a prefix to provided value. Empty string by default.
 * @param {String} [options.suffix] A string to add as a suffix to provided value. Empty string by default.
 * @returns {Function}
 */
function wrapBy( { prefix = '', suffix = '' } = {} ) {
	return item => `${ prefix }${ item }${ suffix }`;
}

/**
 * @typedef {Object} HtmlOutput
 * @property {String|Array.<String>} elements HTML elements, that are created or altered by the plugin.
 * @property {String|Array.<String>} classes CSS class names, that may be applied to the HTML elements.
 * @property {String|Array.<String>} styles Inline CSS styles, that may be applied to the HTML elements.
 * @property {String|Array.<String>} attributes Other HTML attributes, that may be applied to the HTML elements.
 * @property {String} implements A name of an element or a pseudo-element, which classes, styles or attributes may be inherited from.
 * @property {String} _comment A human-readable description.
 */

/**
 * @typedef {Object} Plugin
 * @property {String} name Plugin name.
 * @property {String} className Plugin class name.
 * @property {String} docs An absolute or relative URL to the plugin's documentation.
 * @property {String} path A path to the file, relative to the metadata file, that exports the plugin.
 * @property {HtmlOutput} htmlOutput An array of objects, that defines all possible HTML elements which can be created by a given plugin.
 */

/**
 * @typedef {Object} ParsedPlugin
 * @property {String} pluginNameMarkup HTML markup containing plugin name.
 * @property {Array.<String>} htmlOutputMarkup Each item in this array contains a separate output definition. This output definition is
 * a string with all elements, classes, styles, attributes and comment combined together with applied visual formatting (i.e. working links,
 * visual emphasis, etc.) and ready to be displayed.
 */

/**
 * @typedef {Object} Package
 * @property {String} packageName Package name.
 * @property {String} sourceFileMarkup HTML markup containing the path to the package metadata file or info that the source file has not
 * been published yet.
 * @property {String} isExternalPackage Determines if a given package comes from a CKEditor 5 external project like Collaboration Features
 * or CKEditor 5 Internal. It is set to `false` for third-party packages.
 * @property {String} isThirdPartyPackage Determines whether a given package has been created outside the CKEditor 5 ecosystem.
 * A third-party package is not considered as the external one.
 */

/**
 * @typedef {Object} File
 * @property {String} path File path relative to CWD.
 * @property {String} content File content.
 */

/**
 * @typedef {Object} ParsedFile
 * @property {Package} package Package data.
 * @property {Array.<ParsedPlugin>} plugins An array of all parsed plugins.
 */
