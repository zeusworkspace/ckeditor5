import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertCardioStressCommand from './InsertCardioStressCommand';
import {
	toWidget,
	toWidgetEditable,
} from '@ckeditor/ckeditor5-widget/src/utils';
import {stressHeader} from '../img/stressHeader';
import {makeCalculations, makeStressCalculations, selectAllOnFocus} from '../../cardio-utils/src/CardioUtils';

export default class CardioStressEditing extends Plugin {

	static get requires() {
		return [Widget];
	}

	init() {
		this._defineSchema();
		this._defineConverters();
		this._initializeEditorEvents();
		this.editor.commands.add('insertCardioStress', new InsertCardioStressCommand(this.editor));
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register('cardioStress', {
			isObject: true,
			allowWhere: '$block',
		});

		schema.register('cardioStressImg', {
			allowIn: 'cardioStress',
			allowContentOf: '$block',
			allowAttributes: ['src'],
		});

		schema.register('cardioStressParagraph', {
			allowIn: 'cardioStress',
			allowContentOf: '$block',
			allowAttributes: ['src'],
		});

		schema.register('cardioStressCaption', {
			allowIn: 'cardioStressParagraph',
			allowContentOf: '$block',
			allowAttributes: ['id'],
		});

		schema.register('cardioStressLegend', {
			allowIn: 'cardioStress',
			allowContentOf: '$block',
		});

		schema.register('cardioStressInputContent', {
			allowIn: 'cardioStress',
			allowContentOf: '$block',
		});

		schema.register('cardioStressInputColumn', {
			allowIn: 'cardioStressInputContent',
			allowContentOf: '$block',
		});

		schema.register('cardioStressInputTable', {
			allowIn: 'cardioStressInputColumn',
			allowContentOf: '$block',
		});

		schema.register('cardioStressInputTbody', {
			allowIn: 'cardioStressInputTable',
			allowContentOf: '$block',
		});

		schema.register('cardioStressInputRow', {
			allowIn: 'cardioStressInputTbody',
			allowContentOf: '$block',
		});

		schema.register('cardioStressCellGreen', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block',
		});

		schema.register('cardioStressCellYellow', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block',
		});

		schema.register('cardioStressCellRed', {
			allowIn: 'cardioStressInputRow',
			allowContentOf: '$block',
		});

		schema.register('cardioStressCell', {
			allowIn: 'cardioStressInputRow',
			allowAttributes: ['classes', 'tabindex'],
			allowContentOf: '$block',
			isLimit: true,
		});
	}

	_defineConverters() {

		const editor = this.editor;
		const conversion = editor.conversion;

		/***
		 * cardioStress
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStress',
			view: {
				name: 'div',
				classes: 'cardio-stress',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStress',
			view: (modelElement, viewWriter) => {
				const table = viewWriter.createContainerElement('div', {
					class: 'cardio-stress',
					style: 'width:100%; font-size:10pt;',
				});
				return toWidget(table, viewWriter, {label: 'cardioStress widget'});
			},
		});

		/***
		 * cardioStressImg
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressImg',
			view: {
				name: 'img',
				src: stressHeader(),
				classes: 'cardio-stress-img',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressImg',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('img', {
					src: stressHeader(),
					class: 'cardio-stress-img',
					style: 'width:100%; margin-bottom:10px;',
				});
			},
		});

		/***
		 * cardioStressParagraph
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressParagraph',
			view: {
				name: 'p',
				classes: 'cardio-stress-paragraph',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressParagraph',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('p', {
					class: 'cardio-stress-paragraph',
					style: 'font-size:10pt; margin: 5px 0 !important;',
				});
			},
		});

		/***
		 * cardioStressCaption
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioStressCaption', {
					id: viewElement.getAttribute('id'),
				});
			},
			view: {
				name: 'span',
				classes: 'cardio-stress-caption',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressCaption',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('span', {
					id: modelElement.getAttribute('id'),
					class: 'cardio-stress-caption',
					style: 'font-weight:600;',
				});
			},
		});

		/***
		 * cardioStressInputContent
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputContent',
			view: {
				name: 'div',
				classes: 'cardio-stress-input-content',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputContent',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('div', {
					class: 'cardio-stress-input-content',
					style: 'width:100%; padding-bottom:10px;',
				});
			},
		});

		/***
		 * cardioStressInputColumn
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputColumn',
			view: {
				name: 'div',
				classes: 'cardio-stress-input-column',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputColumn',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('div', {
					class: 'cardio-stress-input-column',
					style: 'width:25%; float:left;',
				});
			},
		});

		/***
		 * cardioStressInputTable
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputTable',
			view: {
				name: 'table',
				classes: 'cardio-stress-input-table',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputTable',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('table', {
					class: 'cardio-stress-input-table',
					style: 'margin:0 auto; border-collapse:collapse;',
				});
			},
		});

		/***
		 * cardioStressInputTbody
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputTbody',
			view: {
				name: 'tbody',
				classes: 'cardio-stress-input-tbody',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputTbody',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('tbody', {
					class: 'cardio-stress-input-tbody',
				});
			},
		});

		/***
		 * cardioStressInputRow
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputRow',
			view: {
				name: 'tr',
				classes: 'cardio-stress-input-row',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressInputRow',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('tr', {
					class: 'cardio-stress-input-row',
				});
			},
		});

		/***
		 * cardioStressCellGreen
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressCellGreen',
			view: {
				name: 'td',
				classes: ['cardio-stress-cell-green', 'cardio-stress-cell-color'],
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressCellGreen',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-stress-cell-green cardio-stress-cell-color',
					style: 'text-align:center; background-color:#4e9900; border:1px solid lightgray; width:25px;',
				});
			},
		});

		/***
		 * cardioStressCellYellow
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressCellYellow',
			view: {
				name: 'td',
				classes: ['cardio-stress-cell-yellow', 'cardio-stress-cell-color'],
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressCellYellow',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-stress-cell-yellow cardio-stress-cell-color',
					style: 'text-align:center; background-color:#f7ba36; border:1px solid lightgray; width:25px;',
				});
			},
		});

		/***
		 * cardioStressCellRed
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressCellRed',
			view: {
				name: 'td',
				classes: ['cardio-stress-cell-red', 'cardio-stress-cell-color'],
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressCellRed',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-stress-cell-red cardio-stress-cell-color',
					style: 'text-align:center; background-color:#db323e; border:1px solid lightgray; width:25px;',
				});
			},
		});

		/***
		 * cardioStressCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioStressCell', {
					classes: Array.from(viewElement.getClassNames()),
					tabindex: viewElement.getAttribute('tabindex'),
				});
			},
			view: {
				name: 'td',
				classes: ['cardio-stress-cell'],
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressCell',
			view: (modelElement, viewWriter) => {
				const td = viewWriter.createEditableElement('td', {
					tabindex: modelElement.getAttribute('tabindex'),
					class: modelElement.getAttribute('classes').join(' '),
					style: 'text-align:center; border:1px solid lightgray; width:25px; height:20px;',
				});
				return toWidgetEditable(td, viewWriter);
			},
		});

		/***
		 * cardioStressLegend
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressLegend',
			view: {
				name: 'p',
				classes: 'cardio-stress-legend',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioStressLegend',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('p', {
					class: 'cardio-stress-legend',
					style: 'font-size: 7pt',
				});
			},
		});

	}

	_initializeEditorEvents() {
		const editor = this.editor;
		editor.model.document.on('change:data', (evt, batch) => {
			let editableElement = editor.editing.view.document.selection.editableElement;
			if ( editableElement ) {
				if ( editableElement.hasClass('cardio-stress-cell-rep') ) {
					makeStressCalculations(editor, editableElement, 'rep');
				} else if ( editableElement.hasClass('cardio-stress-cell-esf') ) {
					makeStressCalculations(editor, editableElement, 'esf');
				} else if ( editableElement.hasClass('cardio-stress-cell-rec') ) {
					makeStressCalculations(editor, editableElement, 'rec');
				}
			}
		});
	}
}

