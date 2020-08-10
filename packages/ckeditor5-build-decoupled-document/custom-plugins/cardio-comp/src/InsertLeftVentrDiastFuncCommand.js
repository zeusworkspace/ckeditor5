import Command from '@ckeditor/ckeditor5-core/src/command';
import {addCustomEvents} from '../../cardio-utils/src/CardioUtils';

export default class InsertLeftVentrDiastFuncCommand extends Command {

	execute() {
		const editor = this.editor;
		editor.model.change(() => {
			const viewFragment = editor.data.processor.toView(createCardioCompTable(editor));
			const modelFragment = editor.data.toModel(viewFragment);
			editor.model.insertContent(modelFragment, editor.model.document.selection);
		});
		addCustomEvents(editor);
	}

	refresh() {
		const editor = this.editor;
		const model = editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'cardioComp');
		this.isEnabled = allowedIn !== null;
		addCustomEvents(editor);
	}
}

function createCardioCompTable(editor) {

	const patientAgeYears = parseInt(editor.config.get('patientAgeYears'));
	let references;
	if ( patientAgeYears > 15 ) {
		references = {
			// reffmoe: '60 - 100 cm/s',
			// reffmoa: '30 - 70 cm/s',
			refes: '> 7 cm/s',
			refel: '> 10 cm/s',
			// refrea: '1,1 - 1,7',
			// refmree: '< 14',
			// reftdm: '180 +- 31 ms',
			refvit: '< 280 cm/s'
		};
	} else {
		references = {};
	}


    let tabIndex = 0;

    return '<table class="cardio-comp-table">' +
        '<tbody class="cardio-comp-tbody">' +

            '<tr class="cardio-comp-row">' +
                '<td class="cardio-comp-section-cell" colspan="3">Parâmetros: Função Diastólica do VE</td>' +
				'<td class="cardio-comp-section-cell" colspan="2">Referência</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-fmoe">' +
                '<td class="cardio-comp-label-cell">Fluxo Mitral Onda E:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="fmoe"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reffmoe">${(references['reffmoe'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<div class="cardio-comp-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-fmoe">x</button></div>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-fmoa">' +
                '<td class="cardio-comp-label-cell">Fluxo Mitral Onda A:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="fmoa"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reffmoa">${(references['reffmoa'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<div class="cardio-comp-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-fmoa">x</button></div>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-es">' +
                '<td class="cardio-comp-label-cell">e\' Septal:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="es"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refes">${(references['refes'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<div class="cardio-comp-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-es">x</button></div>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-el">' +
                '<td class="cardio-comp-label-cell">e\' Lateral:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="el"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refel">${(references['refel'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<div class="cardio-comp-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-el">x</button></div>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-rea">' +
                '<td class="cardio-comp-label-cell">Relação E/A:</td>' +
                `<td class="cardio-comp-auto-value-cell" id="rea">-</td>` +
                '<td class="cardio-comp-unit-cell"></td>' +
                `<td class="cardio-comp-ref-input-cell" id="refrea">${(references['refrea'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<div class="cardio-comp-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-rea">x</button></div>' +
				'</td>' +
            '</tr>' +

            '<tr class="cardio-comp-row" id="tr-mree">' +
                '<td class="cardio-comp-label-cell">Média Rel E/e\':</td>' +
                `<td class="cardio-comp-auto-value-cell" id="mree">-</td>` +
                '<td class="cardio-comp-unit-cell"></td>' +
                `<td class="cardio-comp-ref-input-cell" id="refmree">${(references['refmree'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<div class="cardio-comp-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-mree">x</button></div>' +
				'</td>' +
            '</tr>' +

           	'<tr class="cardio-comp-row" id="tr-tdm">' +
                '<td class="cardio-comp-label-cell">TD Mitral:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="tdm"></td>` +
                '<td class="cardio-comp-unit-cell">ms</td>' +
                `<td class="cardio-comp-ref-input-cell" id="reftdm">${(references['reftdm'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<div class="cardio-comp-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-tdm">x</button></div>' +
				'</td>' +
            '</tr>' +

			'<tr class="cardio-comp-row" id="tr-vit">' +
                '<td class="cardio-comp-label-cell">Veloc. Da Insuf. Tricúspide:</td>' +
                `<td class="cardio-comp-input-cell" tabindex="${++tabIndex}" id="vit"></td>` +
                '<td class="cardio-comp-unit-cell">cm/s</td>' +
                `<td class="cardio-comp-ref-input-cell" id="refvit">${(references['refvit'] || '-')}</td>` +
				'<td class="cardio-comp-cell">' +
					'<div class="cardio-comp-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vit">x</button></div>' +
				'</td>' +
            '</tr>' +

        '</tbody>' +
    '</table>';
}
