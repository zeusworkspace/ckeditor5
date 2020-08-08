import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import InsertCardioCommand from './InsertCardioCommand';
import {
	toWidget,
	toWidgetEditable,
} from '@ckeditor/ckeditor5-widget/src/utils';
import {makeCalculations} from '../../cardio-utils/src/CardioUtils';

export default class CardioEditing extends Plugin {

	static get requires() {
		return [Widget];
	}

	init() {
		this._defineSchema();
		this._defineConverters();
		this._initializeEditorEvents();
		this.editor.commands.add('insertCardio', new InsertCardioCommand(this.editor));
	}

	_defineSchema() {
		const schema = this.editor.model.schema;

		schema.register('cardio', {
			isObject: true,
			allowWhere: '$block',
		});

		schema.register('cardioTBody', {
			allowIn: 'cardio',
			allowContentOf: '$block',
		});

		schema.register('cardioRow', {
			allowIn: 'cardioTBody',
			allowContentOf: '$block',
			allowAttributes: ['id'],
		});

		schema.register('cardioCell', {
			allowIn: 'cardioRow',
			allowContentOf: '$block',
		});

		schema.register('cardioHidden', {
			allowIn: 'cardioCell',
			allowContentOf: '$block',
		});

		schema.register('cardioBtnRemove', {
			allowIn: 'cardioHidden',
			allowContentOf: '$block',
			allowAttributes: ['data-trid'],
		});

		schema.register('cardioSectionCell', {
			allowIn: 'cardioRow',
			allowContentOf: '$block',
			allowAttributes: ['colspan'],
		});

		schema.register('cardioLabelCell', {
			allowIn: 'cardioRow',
			allowContentOf: '$block',
		});

		schema.register('cardioInputCell', {
			// Cannot be split or left by the caret.
			isLimit: true,
			allowIn: 'cardioRow',
			allowAttributes: ['id', 'tabindex'],
			allowContentOf: '$block',
		});

		schema.register('cardioUnitCell', {
			allowIn: 'cardioRow',
			allowContentOf: '$block',
		});

		schema.register('cardioAutoValueCell', {
			allowIn: 'cardioRow',
			allowAttributes: ['id'],
			allowContentOf: '$block',
		});

		schema.register('cardioRefInputCell', {
			allowIn: 'cardioRow',
			isLimit: true,
			allowAttributes: ['id'],
			allowContentOf: '$block',
		});
	}

	_defineConverters() {
		const conversion = this.editor.conversion;

		/***
		 * cardioTable
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardio',
			view: {
				name: 'table',
				classes: 'cardio-table',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardio',
			view: (modelElement, viewWriter) => {
				const table = viewWriter.createContainerElement('table', {
					class: 'cardio-table',
					style: 'width:100%; font-size:10pt;',
				});
				return toWidget(table, viewWriter, {label: 'cardio widget'});
			},
		});

		/***
		 * cardioTBody
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioTBody',
			view: {
				name: 'tbody',
				classes: 'cardio-tbody',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioTBody',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('tbody', {
					class: 'cardio-tbody',
				});
			},
		});

		/***
		 * cardioRow
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioRow', {
					id: viewElement.getAttribute('id'),
				});
			},
			view: {
				name: 'tr',
				classes: 'cardio-row',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioRow',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('tr', {
					class: 'cardio-row',
					id: modelElement.getAttribute('id'),
				});
			},
		});

		/***
		 * cardioCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioCell',
			view: {
				name: 'td',
				classes: 'cardio-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioCell',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-cell',
					style: 'text-align:center',
				});
			},
		});

		/***
		 * cardioHidden
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioHidden',
			view: {
				name: 'div',
				classes: 'cardio-hidden',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioHidden',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('div', {
					class: 'cardio-hidden',
				});
			},
		});

		/***
		 * cardioBtnRemove
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioBtnRemove', {
					'data-trid': viewElement.getAttribute('data-trid'),
				});
			},
			view: {
				name: 'button',
				classes: 'btn-remove',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioBtnRemove',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('button', {
					'data-trid': modelElement.getAttribute('data-trid'),
					class: 'btn btn-xs btn-danger btn-remove',
					style: 'white-space:nowrap;',
				});
			},
		});

		/***
		 * cardioSectionCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioSectionCell', {
					'colspan': viewElement.getAttribute('colspan'),
				});
			},
			view: {
				name: 'td',
				classes: 'cardio-section-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioSectionCell',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-section-cell',
					style: 'font-weight:bold; padding-top:8px; ',
					colspan: modelElement.getAttribute('colspan')
				});
			},
		});

		/***
		 * cardioLabelCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioLabelCell',
			view: {
				name: 'td',
				classes: 'cardio-label-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioLabelCell',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-label-cell',
					style: 'white-space:nowrap;',
				});
			},
		});

		/***
		 * cardioInputCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioInputCell', {
					id: viewElement.getAttribute('id'),
					tabindex: viewElement.getAttribute('tabindex'),
				});
			},
			view: {
				name: 'td',
				classes: 'cardio-input-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioInputCell',
			view: (modelElement, viewWriter) => {
				const td = viewWriter.createEditableElement('td', {
					id: modelElement.getAttribute('id'),
					tabindex: modelElement.getAttribute('tabindex'),
					class: 'cardio-input-cell',
					style: 'border:1px solid black; padding:2px; width:120px; text-align:right; white-space:nowrap;',
				});
				return toWidgetEditable(td, viewWriter);
			},
		});

		/***
		 * cardioUnitCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioUnitCell',
			view: {
				name: 'td',
				classes: 'cardio-unit-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioUnitCell',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-unit-cell',
					style: 'padding-left:2px; width:80px; white-space:nowrap;',
				});
			},
		});

		/***
		 * cardioAutoValueCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioAutoValueCell', {
					id: viewElement.getAttribute('id'),
				});
			},
			view: {
				name: 'td',
				classes: 'cardio-auto-value-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioAutoValueCell',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					id: modelElement.getAttribute('id'),
					class: 'cardio-auto-value-cell',
					style: 'white-space:nowrap; text-align:right',
				});
			},
		});

		/***
		 * cardioRefInputCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioRefInputCell', {
					id: viewElement.getAttribute('id'),
				});
			},
			view: {
				name: 'td',
				classes: 'cardio-ref-input-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioRefInputCell',
			view: (modelElement, viewWriter) => {
				const id = modelElement.getAttribute('id');
				const td = viewWriter.createEditableElement('td', {
					id: id,
					class: 'cardio-ref-input-cell',
					style: 'padding:2px; width:80px; white-space:nowrap; text-align:left',
				});
				return toWidgetEditable(td, viewWriter);
			},
		});
	}

	_initializeEditorEvents() {
		const editor = this.editor;
		editor.model.document.on('change:data', (evt, batch) => {
			let editableElement = editor.editing.view.document.selection.editableElement;
			if ( editableElement && editableElement.hasClass('cardio-input-cell') ) {
				makeCalculations(editableElement.getAttribute('id'), editor);
			}
		});
	}
}

