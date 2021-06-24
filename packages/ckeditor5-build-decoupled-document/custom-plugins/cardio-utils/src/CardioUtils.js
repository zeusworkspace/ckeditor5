import ModelPosition from '@ckeditor/ckeditor5-engine/src/model/position';
import ModelTreeWalker from '@ckeditor/ckeditor5-engine/src/model/treewalker';
import {keyCodes} from '@ckeditor/ckeditor5-utils/src/keyboard';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';
import ViewTreeWalker from '@ckeditor/ckeditor5-engine/src/view/treewalker';

// Add eventos
export function addCustomEvents(editor) {

    // selectFirstEditableCell(editor);

    const ckDocument = editor.editing.view.document;

    // Seleciona conteudo da celula no focus
    ckDocument.on('selectionChangeDone', (evt, data) => {
        evt.stop();
        const editableElement = data.newSelection.editableElement;
        if (editableElement && editableElement.name === 'td' && editableElement.getAttribute('tabindex')) {
            editor.editing.view.change(writer => {
                writer.setSelection(editableElement, 'in');
            });
        }
    });

    // Corrije problema no arrastar para selecionar conteudo da celula
    ckDocument.on('drop', (evt, data) => {
        evt.stop();
        data.preventDefault();
        data.stopPropagation();
    });

    // Utiliza enter para avançar celulas
    ckDocument.on('keydown', (evt, data) => {
        evt.stop();
        if ((data.keyCode === keyCodes.enter || data.keyCode === keyCodes.arrowdown || data.keyCode === keyCodes.arrowup) && data.target.getAttribute('tabindex')) {
            data.preventDefault();
            data.stopPropagation();
            let current = ckDocument.selection.getFirstRange();
            let position = new ViewPosition(current.start.parent, 0);
            let walker = new ViewTreeWalker({
                startPosition: position,
                ignoreElementEnd: true,
                direction: (data.keyCode === keyCodes.arrowup ? 'backward' : 'forward')
            });
            for (let element of walker) {
                if (element.type === 'elementStart' && element.item.getAttribute('tabindex') && (data.target.getAttribute('tabindex') !== element.item.getAttribute('tabindex'))) {
                    editor.editing.view.change(writer => {
                        writer.setSelection(element.item, 'in');
                    });
                    return;
                }
            }
            if (data.keyCode !== keyCodes.arrowup)
                selectFirstEditableCell(editor);
        }
    });

    // Evento de remover linha
    ckDocument.on('click', (evt, data) => {
        const element = data.target;
        if (element && element.hasClass('btn-remove')) {
            evt.stop();
            removeCkElement(editor, getCkElementById(editor, element.getAttribute('data-trid')));
        }
    });
}

export function makeStressCalculations(editor, editableElement, elemID) {

    const cellClasses = Array.from(editableElement.getClassNames());

    setTimeout(function () {

        // Atualiza elementos de mesmo nro de ref.
        let textNode = editableElement.getChild(0);
        if (textNode) {
            const elementsToUpdate = getCkElementsByClass(editor, cellClasses[1]);
            for (let elem of elementsToUpdate) {
                setCkElement(editor, elem, textNode.data);
            }
        }

        // Calcula a média
        let sum = 0;
        const elementsToCalc = getCkElementsByClass(editor, cellClasses[0]);
        for (let elem of elementsToCalc) {
            textNode = elem.getChild(0);
            sum = sum + (textNode ? parseInt(textNode.data) : 0);
        }
        const cellsAvg = sum / elementsToCalc.length;
        const cellsAvgFormatted = cellsAvg.toFixed(2).toString().replace('.', ',');

        let result = '';
        if (cellsAvg === 1) {
            result = `${cellsAvgFormatted} (Valor normal)`;
        } else if (cellsAvg > 1 && cellsAvg <= 1.6) {
            result = `${cellsAvgFormatted} (Disfunção discreta)`;
        } else if (cellsAvg > 1.6 && cellsAvg <= 2) {
            result = `${cellsAvgFormatted} (Disfunção moderada)`;
        } else if (cellsAvg > 2) {
            result = `${cellsAvgFormatted} (Disfunção importante)`;
        }

        setCkElement(editor, getCkElementById(editor, elemID), result);
    }, 50);
}

// Efetua os cálculos de acordo com o elemento que foi alterado nos widgets Ecocardio e Ecocardio Complementar
export function makeCalculations(elementId, editor) {

    let values = [];
    let result = '-';

    // Superfície Corporal (m²)
    if (elementId === 'altura' || elementId === 'peso') {
        values = getFormattedValues(editor, 'altura', 'peso');
        if (checkNumeric(values)) {
            result = truncate(0.007184 * (Math.pow(values['altura'], 0.725)) * (Math.pow(values['peso'], 0.425)), 2).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'sc'), result);
        if (!isNaN(result)) {
            makeCalculations('sc', editor);
        }
    }

    // Volume do AE / Superfície Corporal
    if (elementId === 'vae' || elementId === 'cae' || elementId === 'sc') {
        values = getFormattedValues(editor, 'vae', 'sc');
        if (checkNumeric(values)) {
            result = truncate(values['vae'] / values['sc'], 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'vaesc'), result);
    }

    // Volume Diastólico Final
    if (elementId === 'ddfve') {
        values = getFormattedValues(editor, 'ddfve');
        if (checkNumeric(values)) {
            result = truncate(((7 * values['ddfve'] * values['ddfve'] * values['ddfve']) /
                (2.4 + (values['ddfve'] / 10))) / 1000, 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'vdf'), result);
    }

    // Volume Sistólico Final
    if (elementId === 'dsfve') {
        values = getFormattedValues(editor, 'dsfve');
        if (checkNumeric(values)) {
            result = truncate(((7 * values['dsfve'] * values['dsfve'] * values['dsfve']) /
                (2.4 + (values['dsfve'] / 10))) / 1000, 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'vsf'), result);
    }

    // Volume Diastólico Final / Superficie Corporal
    if (elementId === 'ddfve' || elementId === 'sc') {
        values = getFormattedValues(editor, 'ddfve', 'sc');
        if (checkNumeric(values)) {
            result = truncate((((7 * values['ddfve'] * values['ddfve'] * values['ddfve']) /
                (2.4 + (values['ddfve'] / 10))) / 1000) / values['sc'], 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'vdfsc'), result);
    }

    // Volume Diastólico Final / Superficie Corporal (caso seja alterado o campo Volume Diastólico Final)
    if (elementId === 'vdf') {
        values = getFormattedValues(editor, 'vdf', 'sc');
        if (checkNumeric(values)) {
            result = truncate(values['vdf'] / values['sc'], 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'vdfsc'), result);
    }

    // Volume Sistólico Final / Superfície Corporal
    if (elementId === 'dsfve' || elementId === 'sc' || elementId === 'vsf') {
        values = getFormattedValues(editor, 'dsfve', 'sc');
        if (checkNumeric(values)) {
            result = truncate((((7 * values['dsfve'] * values['dsfve'] * values['dsfve']) /
                (2.4 + (values['dsfve'] / 10))) / 1000) / values['sc'], 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'vsfsc'), result);
    }

    // Volume Sistólico Final / Superficie Corporal (caso seja alterado o campo Volume Sistólico Final)
    if (elementId === 'vsf') {
        values = getFormattedValues(editor, 'vsf', 'sc');
        if (checkNumeric(values)) {
            result = truncate(values['vsf'] / values['sc'], 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'vsfsc'), result);
    }

    // Diâmetro Diastólico Final do VE / SC
    if (elementId === 'ddfve' || elementId === 'sc') {
        values = getFormattedValues(editor, 'ddfve', 'sc');
        if (checkNumeric(values)) {
            result = truncate(values['ddfve'] / values['sc'], 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'ddfvesc'), result);
    }

    // Diâmetro Sistólico Final do VE / SC
    if (elementId === 'dsfve' || elementId === 'sc') {
        values = getFormattedValues(editor, 'dsfve', 'sc');
        if (checkNumeric(values)) {
            result = truncate(values['dsfve'] / values['sc'], 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'dsfvesc'), result);
    }

    // Fração de Ejeção (Teicholz)
    if (elementId === 'ddfve' || elementId === 'dsfve') {
        values = getFormattedValues(editor, 'ddfve', 'dsfve');
        if (checkNumeric(values)) {
            result = ((Math.pow(values['ddfve'], 2) - Math.pow(values['dsfve'], 2)) / Math.pow(values['ddfve'], 2));
            result = 100.0 * (result + (1 - result) * 0.15);
            result = Math.round(result);
            result = truncate(result, 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'fet'), result);
    }

    // Pecentual Encurtamento Cavidade
    if (elementId === 'vsf' || elementId === 'dsfve' || elementId === 'ddfve' || elementId === 'vdf') {
        values = getFormattedValues(editor, 'ddfve', 'dsfve');
        if (checkNumeric(values)) {
            result = truncate((values['ddfve'] - values['dsfve']) * (100 / values['ddfve']), 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'pec'), result);
    }

    // Massa do VE/superficie Corporal
    if (elementId === 'eds' || elementId === 'edppve' || elementId === 'sc' || elementId === 'ddfve') {
        values = getFormattedValues(editor, 'eds', 'edppve', 'ddfve', 'sc');
        if (checkNumeric(values)) {
            result = truncate(
                ((0.8 * (1.04 * (Math.pow(values['eds'] + values['edppve'] + values['ddfve'], 3) -
                    Math.pow(values['ddfve'], 3)) + 0.6)) / values['sc']) / 1000, 1,
            ).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'mvesc'), result);
    }

    // Massa Ventricular Esquerda
    if (elementId === 'edppve' || elementId === 'vsf' || elementId === 'ddfve') {
        values = getFormattedValues(editor, 'eds', 'edppve', 'ddfve');
        if (checkNumeric(values)) {
            result = truncate((
                (0.8 * (1.04 * (Math.pow(values['eds'] + values['edppve'] + values['ddfve'], 3) -
                    Math.pow(values['ddfve'], 3)) + 0.6))) / 1000, 1,
            ).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'mve'), result);
    }

    // Espessura Relativa das Paredes do VE
    if (elementId === 'edppve' || elementId === 'ddfve') {
        values = getFormattedValues(editor, 'edppve', 'ddfve');
        if (checkNumeric(values)) {
            result = truncate((2 * values['edppve']) / values['ddfve'], 2).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'erpve'), result);
        if (!isNaN(result)) {
            makeCalculations('erpve', editor);
        }
    }

    // Relação ERP e Massa VE i
    if (elementId === 'erpve' || elementId === 'mvesc' || elementId === 'eds') {
        let patientGender = editor.config.get('patientGender');
        values = getFormattedValues(editor, 'erpve', 'mvesc');
        if (checkNumeric(values)) {
            if (patientGender === 'M') {
                if (values['mvesc'] <= 115) {
                    if (values['erpve'] <= 0.42) {
                        result = 'Geometria normal';
                    } else if (values['erpve'] > 0.42) {
                        result = 'Remodelamento Concêntrico';
                    }
                } else {
                    if (values['erpve'] <= 0.42) {
                        result = 'Hipertrofia Excêntrica';
                    } else if (values['erpve'] > 0.42) {
                        result = 'Hipertrofia Concêntrica';
                    }
                }
            } else {
                if (values['mvesc'] <= 95) {
                    if (values['erpve'] <= 0.42) {
                        result = 'Geometria normal';
                    } else if (values['erpve'] > 0.42) {
                        result = 'Remodelamento Concêntrico';
                    }
                } else {
                    if (values['erpve'] <= 0.42) {
                        result = 'Hipertrofia Excêntrica';
                    } else if (values['erpve'] > 0.42) {
                        result = 'Hipertrofia Concêntrica';
                    }
                }
            }
        }
        setCkElement(editor, getCkElementById(editor, 'rerp'), result);
    }

    // CARDIO COMP

    // Relação E / A
    if (elementId === 'fmoe' || elementId === 'fmoa') {
        values = getFormattedValues(editor, 'fmoe', 'fmoa');
        if (checkNumeric(values)) {
            result = truncate(values['fmoe'] / values['fmoa'], 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'rea'), result);
    }

    // Média Rel E / e'
    if (elementId === 'fmoe' || elementId === 'es' || elementId === 'el') {
        values = getFormattedValues(editor, 'fmoe', 'es', 'el');
        if (checkNumeric(values)) {
            result = truncate(values['fmoe'] / ((values['es'] + values['el']) / 2), 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'mree'), result);
    }

    // Variação da Veia Cava Inferior
    if (elementId === 'vci' || elementId === 'vcie') {
        values = getFormattedValues(editor, 'vci', 'vcie');
        if (checkNumeric(values)) {
            result = (values['vci'] - values['vcie']) / values['vcie'];

            //Caso a divisão seja por 0, o resultado tende a infinito, então esse caso é tratado manualmente.
            if (result > 100)
                result = 100;
            result = truncate(result, 1).toString();
        }
        setCkElement(editor, getCkElementById(editor, 'vvci'), result);
    }
}

// Transforma o valor de determinado campo do CKEditor em um valor float válido
// Devem ser passados como argumentos todos os ids dos campos dos quais se quer os valores
function getFormattedValues() {
    const editor = arguments[0];
    let formattedValues = [];
    for (let i = 1; i < arguments.length; i++) {
        const tdElem = getCkElementById(editor, arguments[i]);
        const textElem = tdElem ? tdElem.getChild(0) : undefined;
        let value = textElem ? textElem.data : '';
        formattedValues[arguments[i]] = (value && value.match(/[a-z]/i)) ? '' : parseFloat(value.replace(',', '.'));
    }
    return formattedValues;
}

// Deixa todos os resultados com o numero de casas decimais especificado. Caso o resultado não seja numérico, retorna 0.
function truncate(numToBeTruncated, numOfDecimals) {
    let number = numToBeTruncated.toString();
    let pointIndex = number.indexOf('.');
    let truncatedNumber = +(number.slice(0,
        pointIndex > -1 ? ++numOfDecimals + pointIndex : undefined));

    if ($.isNumeric(truncatedNumber)) {
        return truncatedNumber;
    } else {
        return '-';
    }
}

// Checa se todos os argumentos passados são números(evita ter que ficar chamado isNumeric para todos os elementos manualmente)
function checkNumeric(values) {
    for (let i = 0; i < values.length; i++) {
        if (!$.isNumeric(values[i])) {
            return false;
        }
    }
    return true;
}

/**
 * Selects first editable item
 * @param editor CKEditor instance
 */
function selectFirstEditableCell(editor) {
    const position = new ViewPosition(editor.editing.view.document.getRoot(), [0]);
    if (position.parent.childCount) {
        const walker = new ViewTreeWalker({startPosition: position});
        for (let element of walker) {
            if (element.type === 'elementStart' && element.item.getAttribute('contenteditable') === 'true') {
                editor.editing.view.change(writer => {
                    writer.setSelection(element.item, 'in');
                });
                return;
            }
        }
    }
}

/**
 * Changes value of item
 * @param editor CKEditor instance
 * @param value string to set
 * @param item @ckeditor/ckeditor5-engine/src/model/item
 */
function setCkElement(editor, item, value) {
    if (item) {
        editor.model.change(writer => {
            const childElem = item.getChild(0);
            if (childElem && childElem.data === value) {
                return;
            }
            for (let child of item.getChildren()) {
                writer.remove(child);
            }
            if (!isNaN(value)) {
                value = value.replace('.', ',');
            }
            writer.insertText(value, item);
        });
    }
}

/**
 * Removes item from editor
 * @param editor CKEditor instance
 * @param item
 */
function removeCkElement(editor, item) {
    if (item) {
        editor.model.change(writer => {
            writer.remove(item);
        });
    }
}

/**
 * Gets item by ID
 * @param editor CKEditor instance
 * @param id string of element to set
 * @returns Item
 */
function getCkElementById(editor, id) {
    if (editor.model) {
        const position = new ModelPosition(editor.model.document.getRoot(), [0]);
        const walker = new ModelTreeWalker({startPosition: position});
        for (let element of walker) {
            if (element.type !== 'text' && element.item.getAttribute('id') === id) {
                return element.item;
            }
        }
    }
}

/**
 * Gets item by class
 * @param editor CKEditor instance
 * @param className string class of element to set
 * @returns {*}
 */
function getCkElementsByClass(editor, className) {
    if (editor.model) {
        const position = new ModelPosition(editor.model.document.getRoot(), [0]);
        const walker = new ModelTreeWalker({startPosition: position});
        let elements = [];
        for (let element of walker) {
            if (element.type !== 'text' && inArray(className, element.item.getAttribute('classes'))) {
                elements.push(element.item);
            }
        }
        return elements;
    }
}

function inArray(needle, haystack) {
    if (haystack) {
        const length = haystack.length;
        for (let i = 0; i < length; i++) {
            if (haystack[i] === needle)
                return true;
        }
    }
    return false;
}

