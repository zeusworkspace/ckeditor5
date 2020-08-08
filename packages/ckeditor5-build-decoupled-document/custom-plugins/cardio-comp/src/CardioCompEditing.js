import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import {
    toWidget,
    toWidgetEditable,
} from '@ckeditor/ckeditor5-widget/src/utils';
import {makeCalculations} from '../../cardio-utils/src/CardioUtils';
import InsertLeftVentrDiastFuncCommand from './InsertLeftVentrDiastFuncCommand';
import InsertPulmArtAndVenCavCommand from './InsertPulmArtAndVenCavCommand';

export default class CardioCompEditing extends Plugin {

    static get requires() {
        return [Widget];
    }

    init() {
        this._defineSchema();
        this._defineConverters();
        this._initializeEditorEvents();
        this.editor.commands.add('insertLeftVentrDiastFunc', new InsertLeftVentrDiastFuncCommand(this.editor));
        this.editor.commands.add('insertPulmArtAndVenCav', new InsertPulmArtAndVenCavCommand(this.editor));
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('cardioComp', {
            isObject: true,
            allowWhere: '$block',
        });

        schema.register('cardioCompTBody', {
            allowIn: 'cardioComp',
            allowContentOf: '$block',
        });

        schema.register('cardioCompRow', {
            allowIn: 'cardioCompTBody',
            allowContentOf: '$block',
			allowAttributes: ['id'],
		});

		schema.register('cardioCompCell', {
			allowIn: 'cardioCompRow',
			allowContentOf: '$block',
		});

		schema.register('cardioCompHidden', {
			allowIn: 'cardioCompCell',
			allowContentOf: '$block',
		});

		schema.register('cardioCompBtnRemove', {
			allowIn: 'cardioCompHidden',
			allowContentOf: '$block',
			allowAttributes: ['data-trid'],
		});

        schema.register('cardioCompSectionCell', {
            allowIn: 'cardioCompRow',
            allowContentOf: '$block',
			allowAttributes: ['colspan']
        });

        schema.register('cardioCompLabelCell', {
            allowIn: 'cardioCompRow',
            allowContentOf: '$block',
        });

        schema.register('cardioCompInputCell', {
            // Cannot be split or left by the caret.
            isLimit: true,
            allowIn: 'cardioCompRow',
            allowAttributes: ['id', 'tabindex'],
            allowContentOf: '$block',
        });

        schema.register('cardioCompUnitCell', {
            allowIn: 'cardioCompRow',
            allowContentOf: '$block',
        });

        schema.register('cardioCompAutoValueCell', {
            allowIn: 'cardioCompRow',
            allowAttributes: ['id'],
            allowContentOf: '$block',
        });

        schema.register('cardioCompRefInputCell', {
        	isLimit: true,
            allowIn: 'cardioCompRow',
            allowAttributes: ['id'],
            allowContentOf: '$block',
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        /***
         * cardioCompTable
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioComp',
            view: {
                name: 'table',
                classes: 'cardio-comp-table',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioComp',
            view: (modelElement, viewWriter) => {
                const table = viewWriter.createContainerElement('table', {
                    class: 'cardio-comp-table',
                    style: 'width:100%; font-size:10pt;',
                });
                return toWidget(table, viewWriter, {label: 'cardioComp widget'});
            },
        });

        /***
         * cardioCompTBody
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompTBody',
            view: {
                name: 'tbody',
                classes: 'cardio-comp-tbody',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompTBody',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('tbody', {
                    class: 'cardio-comp-tbody',
                });
            },
        });

		/***
		 * cardioCompRow
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioCompRow', {
					id: viewElement.getAttribute('id'),
				});
			},
			view: {
				name: 'tr',
				classes: 'cardio-comp-row',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioCompRow',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('tr', {
					class: 'cardio-comp-row',
					id: modelElement.getAttribute('id'),
				});
			},
		});

		/***
		 * cardioCompCell
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioCompCell',
			view: {
				name: 'td',
				classes: 'cardio-comp-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioCompCell',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-comp-cell',
					style: 'text-align:center',
				});
			},
		});

		/***
		 * cardioCompHidden
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioCompHidden',
			view: {
				name: 'div',
				classes: 'cardio-comp-hidden',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioCompHidden',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('div', {
					class: 'cardio-comp-hidden',
				});
			},
		});

		/***
		 * cardioCompBtnRemove
		 ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioCompBtnRemove', {
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
			model: 'cardioCompBtnRemove',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('button', {
					'data-trid': modelElement.getAttribute('data-trid'),
					class: 'btn btn-xs btn-danger btn-remove',
					style: 'white-space:nowrap;',
				});
			},
		});

        /***
         * cardioCompSectionCell
         ***/
		conversion.for('upcast').elementToElement({
			converterPriority: 'highest',
			model: (viewElement, modelWriter) => {
				return modelWriter.createElement('cardioCompSectionCell', {
					colspan: viewElement.getAttribute('colspan'),
				});
			},
			view: {
				name: 'td',
				classes: 'cardio-comp-section-cell',
			},
		});
		conversion.for('downcast').elementToElement({
			converterPriority: 'highest',
			model: 'cardioCompSectionCell',
			view: (modelElement, viewWriter) => {
				return viewWriter.createContainerElement('td', {
					class: 'cardio-comp-section-cell',
					style: 'font-weight:bold; padding-top:8px; ',
					colspan: modelElement.getAttribute('colspan')
				});
			},
		});

        /***
         * cardioCompLabelCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompLabelCell',
            view: {
                name: 'td',
                classes: 'cardio-comp-label-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompLabelCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-comp-label-cell',
                    style: 'white-space:nowrap;',
                });
            },
        });

        /***
         * cardioCompInputCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioCompInputCell', {
                    id: viewElement.getAttribute('id'),
					tabindex: viewElement.getAttribute('tabindex')
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-comp-input-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompInputCell',
            view: (modelElement, viewWriter) => {
                const td = viewWriter.createEditableElement('td', {
                    id: modelElement.getAttribute('id'),
                    class: 'cardio-comp-input-cell',
					tabindex: modelElement.getAttribute('tabindex'),
                    style: 'border:1px solid black; padding:2px; width:120px; text-align:right; white-space:nowrap;',
                });
                return toWidgetEditable(td, viewWriter);
            },
        });

        /***
         * cardioCompUnitCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompUnitCell',
            view: {
                name: 'td',
                classes: 'cardio-comp-unit-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompUnitCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    class: 'cardio-comp-unit-cell',
                    style: 'padding-left:2px; width:80px; white-space:nowrap;',
                });
            },
        });

        /***
         * cardioCompAutoValueCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioCompAutoValueCell', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-comp-auto-value-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompAutoValueCell',
            view: (modelElement, viewWriter) => {
                return viewWriter.createContainerElement('td', {
                    id: modelElement.getAttribute('id'),
                    class: 'cardio-comp-auto-value-cell',
                    style: 'white-space:nowrap; text-align:right',
                });
            },
        });

        /***
         * cardioCompRefInputCell
         ***/
        conversion.for('upcast').elementToElement({
            converterPriority: 'highest',
            model: (viewElement, modelWriter) => {
                return modelWriter.createElement('cardioCompRefInputCell', {
                    id: viewElement.getAttribute('id'),
                });
            },
            view: {
                name: 'td',
                classes: 'cardio-comp-ref-input-cell',
            },
        });
        conversion.for('downcast').elementToElement({
            converterPriority: 'highest',
            model: 'cardioCompRefInputCell',
            view: (modelElement, viewWriter) => {
                const td = viewWriter.createEditableElement('td', {
                    id: modelElement.getAttribute('id'),
                    class: 'cardio-comp-ref-input-cell',
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
            if ( editableElement && editableElement.hasClass('cardio-comp-input-cell') ) {
                makeCalculations(editableElement.getAttribute('id'), editor);
            }
        });
    }
}

