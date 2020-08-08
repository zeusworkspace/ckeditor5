import Command from '@ckeditor/ckeditor5-core/src/command';
import {stressHeader} from '../img/stressHeader';
import {addCustomEvents} from '../../cardio-utils/src/CardioUtils';

export default class InsertCardioStressCommand extends Command {

    execute() {
    	const editor = this.editor;

        editor.model.change( () => {
			const viewFragment = editor.data.processor.toView( createCardioStressTable() );
            const modelFragment = editor.data.toModel( viewFragment );
            editor.model.insertContent( modelFragment, editor.model.document.selection );
        } );
		addCustomEvents(editor);
    }

    refresh() {
        const editor = this.editor;
		const model = editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'cardioStress');
		this.isEnabled = allowedIn !== null;
		addCustomEvents(editor);
    }
}

function createCardioStressTable() {
	return '<div class="cardio-stress">' +

		// Header img
		`<img class="cardio-stress-img" src="${stressHeader()}" alt="header"/>` +

		// Repouso
		'<p class="cardio-stress-paragraph">' +
			'Repouso: Índice de Escore de contratilidade da Parede: <span class="cardio-stress-caption" id="rep">1,00 (Valor Normal)</span>' +
		'</p>'+
		renderStressInputTable('rep', 0) +

		// Pico do esforço
		'<p class="cardio-stress-paragraph">' +
			'Pico do Esforço: Índice de Escore de contratilidade da Parede: <span class="cardio-stress-caption" id="esf">1,00 (Valor Normal)</span>' +
		'</p>'+
		renderStressInputTable('esf', 100) +

		// Recuperação
		'<p class="cardio-stress-paragraph">' +
			'Recuperação: Índice de Escore de contratilidade da Parede: <span class="cardio-stress-caption" id="rec">1,00 (Valor Normal)</span>' +
		'</p>'+
		renderStressInputTable('rec', 200) +

		// Legenda
		'<p class="cardio-stress-legend">' +
			'<b>Índice de Contratilidade: </b>' +
			'<span>0-Não Visualizada, 1-Contrat. Normal, 2-Hipocinesia, 3-Acinesia, 4-Dicinesia</span>'  +
		'</p>' +
		'<p class="cardio-stress-legend">' +
			'<b>Escore de Contratilidade: </b>' +
			'<span>1-Valor Normal, >1 e <1,6-Disfunção Discreta, >1,6 e <2,0-Disfunção Moderada, >2,0-Disfunção Importante</span>'  +
		'</p>' +
	'</div>';
}

function renderStressInputTable(levelID, tabIndex){
	return '<div class="cardio-stress-input-content">' +
		'<div class="cardio-stress-input-column">' +
			'<table class="cardio-stress-input-table">'+
				'<tbody class="cardio-stress-input-tbody">'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">2</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-2 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">8</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-8 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">14</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-14 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">17</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-17 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow cardio-stress-cell-color">16</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-16 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow cardio-stress-cell-color">11</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-11 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow cardio-stress-cell-color">5</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-5 cardio-stress-cell">1</td>`+
					'</tr>'+
				'</tbody>' +
			'</table>'+
		'</div>' +
		'<div class="cardio-stress-input-column">' +
			'<table class="cardio-stress-input-table">'+
				'<tbody class="cardio-stress-input-tbody">'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">1</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-1 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">2</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-2 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green cardio-stress-cell-color">3</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-3 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green cardio-stress-cell-color">4</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-4 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow cardio-stress-cell-color">5</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-5 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow cardio-stress-cell-color">6</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-6 cardio-stress-cell">1</td>`+
					'</tr>'+
				'</tbody>' +
			'</table>'+
		'</div>' +
		'<div class="cardio-stress-input-column">' +
			'<table class="cardio-stress-input-table">'+
				'<tbody class="cardio-stress-input-tbody">'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green cardio-stress-cell-color">3</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-3 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green cardio-stress-cell-color">9</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-9 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">14</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-14 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">17</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-17 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow cardio-stress-cell-color">16</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-16 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow cardio-stress-cell-color">12</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-12 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-yellow cardio-stress-cell-color">6</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-6 cardio-stress-cell">1</td>`+
					'</tr>'+
				'</tbody>' +
			'</table>'+
		'</div>' +
		'<div class="cardio-stress-input-column">' +
			'<table class="cardio-stress-input-table">'+
				'<tbody class="cardio-stress-input-tbody">'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green cardio-stress-cell-color">4</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-4 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green cardio-stress-cell-color">10</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-10 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-green cardio-stress-cell-color">15</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-15 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">17</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-17 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">13</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-13 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">7</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-7 cardio-stress-cell">1</td>`+
					'</tr>'+
					'<tr class="cardio-stress-input-row">'+
						'<td class="cardio-stress-cell-red cardio-stress-cell-color">1</td>'+
						`<td tabindex="${++tabIndex}" class="cardio-stress-cell-${levelID} cardio-stress-cell-${levelID}-1 cardio-stress-cell">1</td>`+
					'</tr>'+
				'</tbody>' +
			'</table>'+
		'</div>' +
	'</div>';
}





