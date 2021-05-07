/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

module.exports = function getRealImportPath( modulePath ) {
	return modulePath.replace( /^([^/]+)\//, '@ckeditor/ckeditor5-$1/src/' );
};
