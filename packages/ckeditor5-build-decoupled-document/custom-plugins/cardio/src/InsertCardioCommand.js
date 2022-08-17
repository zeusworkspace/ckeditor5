import Command from '@ckeditor/ckeditor5-core/src/command';
import {addCustomEvents, makeCalculations} from '../../cardio-utils/src/CardioUtils';

export default class InsertCardioCommand extends Command {

	execute() {
		const editor = this.editor;
		editor.model.change(() => {
			const viewFragment = editor.data.processor.toView(createCardioTable(editor));
			const modelFragment = editor.data.toModel(viewFragment);
			editor.model.insertContent(modelFragment, editor.model.document.selection);
			makeCalculations('altura', editor);
		});
		addCustomEvents(editor);
	}

	refresh() {
		const editor = this.editor;
		const model = editor.model;
		const selection = model.document.selection;
		const allowedIn = model.schema.findAllowedParent(selection.getFirstPosition(), 'cardio');
		this.isEnabled = allowedIn !== null;
		addCustomEvents(editor);
	}
}

function createCardioTable(editor) {

	const patientGender = editor.config.get('patientGender');
	const patientAgeYears = parseInt(editor.config.get('patientAgeYears'));
	const patientAgeMonths = parseInt(editor.config.get('patientAgeMonths'));
	let references = {};

	if ( patientAgeYears > 15 ) {
		if ( patientGender === 'M' ) {
			references = {
				refsao: '31 - 37 mm',
				refjsn: '26 - 32 mm',
				refaa: '26 - 34 mm',
				refaesq: '30 - 40 mm',
				refdbvd: '25 - 41 mm',
				refdpvsvd: '20 - 30 mm',
				refddfve: '42 - 58 mm',
				refdsfve: '25 - 40 mm',
				refeds: '06 - 10 mm',
				refedppve: '06 - 10 mm',
				refvaesc: '16 - 34 ml/m²',
				refddfvesc: '22 - 30 mm/m²',
				refdsfvesc: '13 - 21 mm/m²',
				refvdf: '62 - 150 ml',
				refvsf: '21 - 61 ml',
				refvsfsc: '11 - 31 ml/m²',
				refvdfsc: '34 - 74 ml/m²',
				reffes: '52 - 72 %',
				reffet: '52 - 72 %',
				refpec: '25 - 43 %',
				refmvesc: '45 - 115 g/m²',
				refmve: '96 - 200 g',
				referpve: '0,24 - 0,42 mm',
			};
		} else {

			references = {
				refsao: '27 - 33 mm',
				refjsn: '23 - 29 mm',
				refaa: '23 - 31 mm',
				refaesq: '27 - 38 mm',
				refdbvd: '25 - 41 mm',
				refdpvsvd: '20 - 30 mm',
				refddfve: '38 - 52 mm',
				refdsfve: '22 - 35 mm',
				refeds: '06 - 09 mm',
				refedppve: '06 - 09 mm',
				refvaesc: '16 - 34 ml/m²',
				refddfvesc: '23 -31 mm/m²',
				refdsfvesc: '13 - 21 mm/m²',
				refvdf: '46 - 106 ml',
				refvsf: '14 - 42 ml',
				refvsfsc: '8 - 24 ml/m²',
				refvdfsc: '29 - 61 ml/m²',
				reffes: '54 - 74 %',
				reffet: '52 - 72 %',
				refpec: '27 - 45 %',
				refmvesc: '43 - 95 g/m²',
				refmve: '66 - 150 g',
				referpve: '0,22 - 0,42 mm',
			};
		}

	} else {

		if ( patientAgeYears < 1 ) {
			if ( patientAgeMonths <= 3 ) {
				references = {
					refddfve: '21,7 mm',
					refaesq: '15,7 mm',
					refeds: '4,2 mm',
					refedppve: '4,2 mm',
				};
			} else {
				references = {
					refddfve: '26,4 mm',
					refaesq: '19,2 mm',
					refeds: '4,6 mm',
					refedppve: '4,6 mm',
				};
			}
		} else if ( patientAgeYears <= 2 ) {

			references = {
				refddfve: '30,8 mm',
				refaesq: '21,2 mm',
				refeds: '5,6 mm',
				refedppve: '5,4 mm',
			};

		} else if ( patientAgeYears <= 5 ) {

			references = {
				refddfve: '35,9 mm',
				refaesq: '21,0 mm',
				refeds: '5,7 mm',
				refedppve: '6,1 mm',
			};

		} else if ( patientAgeYears <= 10 ) {

			references = {
				refddfve: '39,7 mm',
				refaesq: '23,4 mm',
				refeds: '7,0 mm',
				refedppve: '7,3 mm',
			};

		} else if ( patientAgeYears <= 15 ) {

			references = {
				refddfve: '46,3 mm',
				refaesq: '28,2 mm',
				refeds: '8,8 mm',
				refedppve: '8,8 mm',
			};

		}
	}

	let tabIndex = 0;
	const variables = editor.config.get('variables');
	const patientHeight = variables.find(item => (item.attr === 'patient_height'))?.value;
	const patientWeight = variables.find(item => (item.attr === 'patient_weight'))?.value;

	return '<table class="cardio-table">' +
		'<tbody class="cardio-tbody">' +

		'<tr class="cardio-row">' +
			'<td class="cardio-section-cell" colspan="8">Dados do Paciente</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-altura">' +

			'<td class="cardio-label-cell">Altura:</td>' +
			`<td class="cardio-input-cell" id="altura" tabindex="${++tabIndex}">${patientHeight ? parseInt(patientHeight) : ''}</td>` +
			'<td class="cardio-unit-cell">cm</td>' +
			'<td class="cardio-ref-input-cell"></td>' +

			'<td class="cardio-label-cell">Peso:</td>' +
			`<td class="cardio-input-cell" id="peso" tabindex="${++tabIndex}">${patientWeight ? parseInt(patientWeight) : ''}</td>` +
			'<td class="cardio-unit-cell">kg</td>' +
			'<td class="cardio-ref-input-cell"></td>' +

		'</tr>' +

		'<tr class="cardio-row" id="tr-sc">' +

			'<td class="cardio-label-cell">Superfície Corporal:</td>' +
			`<td class="cardio-auto-value-cell" id="sc">${(references['sc'] || '-')}</td>` +
			'<td class="cardio-unit-cell">m²</td>' +
			`<td class="cardio-ref-input-cell"></td>` +

			'<td class="cardio-label-cell">IMC:</td>' +
			`<td class="cardio-auto-value-cell" id="imc">${(references['imc'] || '-')}</td>` +
			'<td class="cardio-unit-cell">kg/m²</td>' +
			`<td class="cardio-ref-input-cell"></td>` +

		'</tr>' +

		'<tr class="cardio-row" id="tr-pa">' +

			'<td class="cardio-label-cell">Pressão Arterial:</td>' +
			`<td class="cardio-input-cell" id="pa" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mmHg</td>' +
			'<td class="cardio-ref-input-cell"></td>' +

			'<td class="cardio-label-cell">Frequência Cardíaca:</td>' +
			`<td class="cardio-input-cell" id="freqcard" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">bpm</td>' +
			'<td class="cardio-ref-input-cell"></td>' +

		'</tr>' +

		'<tr class="cardio-row">' +
			'<td class="cardio-section-cell" colspan="6">Parâmetros Estruturais e Funcionais</td>' +
			'<td class="cardio-section-cell" colspan="2">Referência</td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
			'<td class="cardio-section-cell" colspan="8">Aorta</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-sao">' +
			'<td class="cardio-label-cell" colspan="4">Raiz da Aorta (Seios Aórticos):</td>' +
			`<td class="cardio-input-cell" id="sao" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refsao">${(references['refsao'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-sao">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-aasc">' +
			'<td class="cardio-label-cell" colspan="4">Aorta Ascendente:</td>' +
			`<td class="cardio-input-cell" id="aasc" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refaa">${(references['refaa'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-aasc">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-jsn">' +
			'<td class="cardio-label-cell" colspan="4">Arco Aórtico (Aorta Transversa):</td>' +
			`<td class="cardio-input-cell" id="jsn" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refjsn">${(references['refjsn'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-jsn">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
			'<td class="cardio-section-cell" colspan="8">Átrio Esquerdo</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-aesq">' +
			'<td class="cardio-label-cell" colspan="4">Diâmetro Ântero-posterior:</td>' +
			`<td class="cardio-input-cell" id="aesq" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refaesq">${(references['refaesq'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-aesq">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-vae">' +
			'<td class="cardio-label-cell" colspan="4">Volume:</td>' +
			`<td class="cardio-input-cell" id="vae" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">ml</td>' +
			'<td class="cardio-ref-input-cell"></td>' +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vae">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
			'<td class="cardio-section-cell" colspan="8">Ventrículo Direito</td>' +
		'</tr>' +


		'<tr class="cardio-row" id="tr-dpvsvd">' +
			'<td class="cardio-label-cell" colspan="4">Diâmetro Proximal da Via de Saída:</td>' +
			`<td class="cardio-input-cell" id="dpvsvd" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refdpvsvd">${(references['refdpvsvd'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-dpvsvd">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-dbvd">' +
			'<td class="cardio-label-cell" colspan="4">Diâmetro Basal:</td>' +
			`<td class="cardio-input-cell" id="dbvd" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refdbvd">${(references['refdbvd'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-dbvd">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
			'<td class="cardio-section-cell" colspan="8">Ventrículo Esquerdo</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-ddfve">' +
			'<td class="cardio-label-cell" colspan="4">Diâmetro Diastólico Final:</td>' +
			`<td class="cardio-input-cell" id="ddfve" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refddfve">${(references['refddfve'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-ddfve">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-dsfve">' +
			'<td class="cardio-label-cell" colspan="4">Diâmetro Sistólico Final:</td>' +
			`<td class="cardio-input-cell" id="dsfve" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refdsfve">${(references['refdsfve'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-dsfve">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-eds">' +
			'<td class="cardio-label-cell" colspan="4">Espessura Diastólica - Septo:</td>' +
			`<td class="cardio-input-cell" id="eds" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refeds">${(references['refeds'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-eds">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-edppve">' +
			'<td class="cardio-label-cell" colspan="4">Espessura Diastólica - Parede Posterior:</td>' +
			`<td class="cardio-input-cell" id="edppve" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">mm</td>' +
			`<td class="cardio-ref-input-cell" id="refedppve">${(references['refedppve'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-edppve">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-vdf">' +
			'<td class="cardio-label-cell" colspan="4">Volume Diastólico Final:</td>' +
			`<td class="cardio-input-cell" id="vdf" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">ml</td>' +
			`<td class="cardio-ref-input-cell" id="refvdf">${(references['refvdf'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vdf">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-vsf">' +
			'<td class="cardio-label-cell" colspan="4">Volume Sistólico Final:</td>' +
			`<td class="cardio-input-cell" id="vsf" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">ml</td>' +
			`<td class="cardio-ref-input-cell" id="refvsf">${(references['refvsf'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vsf">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-pec">' +
			'<td class="cardio-label-cell" colspan="4">Percent. Encurt. Cavidade:</td>' +
			`<td class="cardio-auto-value-cell" id="pec">${(references['pec'] || '-')}</td>` +
			'<td class="cardio-unit-cell">%</</td>' +
			`<td class="cardio-ref-input-cell" id="refpec">${(references['refpec'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-pec">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-fet">' +
			'<td class="cardio-label-cell" colspan="4">Fração de Ejeção (Teicholz):</td>' +
			`<td class="cardio-auto-value-cell" id="fet">${(references['fet'] || '-')}</td>` +
			'<td class="cardio-unit-cell">%</</td>' +
			`<td class="cardio-ref-input-cell" id="reffet">${(references['reffet'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-fet">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-fes">' +
			'<td class="cardio-label-cell" colspan="4">Fração de Ejeção (Simpson):</td>' +
			`<td class="cardio-input-cell" id="fes" tabindex="${++tabIndex}"></td>` +
			'<td class="cardio-unit-cell">%</</td>' +
			`<td class="cardio-ref-input-cell" id="reffes">${(references['reffes'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-fes">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-mve">' +
			'<td class="cardio-label-cell" colspan="4">Massa Ventricular Esquerda:</td>' +
			`<td class="cardio-auto-value-cell" id="mve">${(references['mve'] || '-')}</td>` +
			'<td class="cardio-unit-cell">g</</td>' +
			`<td class="cardio-ref-input-cell" id="refmve">${(references['refmve'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-mve">x</button></div>' +
			'</td>' +
		'</tr>' +

		// '<tr class="cardio-row" id="tr-erpve">' +
		// 	'<td class="cardio-label-cell" colspan="4">Espessura Relativa das Paredes do VE:</td>' +
		// 	`<td class="cardio-auto-value-cell" id="erpve">${(references['erpve'] || '-')}</td>` +
		// 	'<td class="cardio-unit-cell">mm</</td>' +
		// 	`<td class="cardio-ref-input-cell" id="referpve">${(references['referpve'] || '-')}</td>` +
		// 	'<td class="cardio-cell">' +
		// 		'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-erpve">x</button></div>' +
		// 	'</td>' +
		// '</tr>' +

		// '<tr class="cardio-row">' +
		// 	'<td class="cardio-section-cell" colspan="8">Relações</td>' +
		// '</tr>' +

		'<tr class="cardio-row" id="tr-vaesc">' +
			'<td class="cardio-label-cell" colspan="4">Volume do AE / Superfície Corporal:</td>' +
			`<td class="cardio-auto-value-cell" id="vaesc">${(references['vaesc'] || '-')}</td>` +
			'<td class="cardio-unit-cell">ml/m²</td>' +
			`<td class="cardio-ref-input-cell" id="refvaesc">${(references['refvaesc'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vaesc">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-vdfsc">' +
			'<td class="cardio-label-cell" colspan="4">Volume Diastólico Final / SC:</td>' +
			`<td class="cardio-auto-value-cell" id="vdfsc">${(references['vdfsc'] || '-')}</td>` +
			'<td class="cardio-unit-cell">ml/m²</td>' +
			`<td class="cardio-ref-input-cell" id="refvdfsc">${(references['refvdfsc'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vdfsc">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-vsfsc">' +
			'<td class="cardio-label-cell" colspan="4">Volume Sistólico Final / SC:</td>' +
			`<td class="cardio-auto-value-cell" id="vsfsc">${(references['vsfsc'] || '-')}</td>` +
			'<td class="cardio-unit-cell">ml/m²</td>' +
			`<td class="cardio-ref-input-cell" id="refvsfsc">${(references['refvsfsc'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-vsfsc">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-ddfvesc">' +
			'<td class="cardio-label-cell" colspan="4">Diâmetro Diastólico Final do VE / SC:</td>' +
			`<td class="cardio-auto-value-cell" id="ddfvesc">${(references['ddfvesc'] || '-')}</td>` +
			'<td class="cardio-unit-cell">mm/m²</td>' +
			`<td class="cardio-ref-input-cell" id="refddfvesc">${(references['refddfvesc'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-ddfvesc">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-dsfvesc">' +
			'<td class="cardio-label-cell" colspan="4">Diâmetro Sistólico Final do VE / SC:</td>' +
			`<td class="cardio-auto-value-cell" id="dsfvesc">${(references['dsfvesc'] || '-')}</td>` +
			'<td class="cardio-unit-cell">mm/m²</td>' +
			`<td class="cardio-ref-input-cell" id="refdsfvesc">${(references['refdsfvesc'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-dsfvesc">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-mvesc">' +
			'<td class="cardio-label-cell" colspan="4">Massa do VE / Superfície Corporal:</td>' +
			`<td class="cardio-auto-value-cell" id="mvesc">${(references['mvesc'] || '-')}</td>` +
			'<td class="cardio-unit-cell">g/m²</</td>' +
			`<td class="cardio-ref-input-cell" id="refmvesc">${(references['refmvesc'] || '-')}</td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-mvesc">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-debcard">' +
			'<td class="cardio-label-cell" colspan="4">Débito Cardíaco:</td>' +
			`<td class="cardio-auto-value-cell" id="debcard">${(references['debcard'] || '-')}</td>` +
			'<td class="cardio-unit-cell">L/min</td>' +
			`<td class="cardio-ref-input-cell"></td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-debcard">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-indcard">' +
			'<td class="cardio-label-cell" colspan="4">Índice Cardíaco:</td>' +
			`<td class="cardio-auto-value-cell" id="indcard">${(references['indcard'] || '-')}</td>` +
			'<td class="cardio-unit-cell">L/min/m²</td>' +
			`<td class="cardio-ref-input-cell"></td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-indcard">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row" id="tr-rerp">' +
			'<td class="cardio-label-cell" colspan="4">Relação ERP e Massa VE i:</td>' +
			`<td class="cardio-auto-value-cell" id="rerp">${(references['rerp'] || '-')}</td>` +
			'<td class="cardio-unit-cell"></</td>' +
			`<td class="cardio-ref-input-cell"></td>` +
			'<td class="cardio-cell">' +
				'<div class="cardio-hidden"><button class="btn btn-xs btn-danger btn-remove" data-trid="tr-rerp">x</button></div>' +
			'</td>' +
		'</tr>' +

		'<tr class="cardio-row">' +
			'<td class="cardio-section-cell" colspan="8">' +
				'<div class="cardio-hidden">' +
					'<button class="btn btn-xs btn-block btn-danger btn-clean">Remover linhas não preenchidas</button>' +
				'</div>' +
			'</td>' +
		'</tr>' +

		'</tbody>' +
	'</table>';
}

