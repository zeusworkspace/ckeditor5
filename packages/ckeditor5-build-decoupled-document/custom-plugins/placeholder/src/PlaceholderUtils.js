// Add eventos
import ViewPosition from "@ckeditor/ckeditor5-engine/src/view/position";
import ViewTreeWalker from "@ckeditor/ckeditor5-engine/src/view/treewalker";

export function addCustomEvents(editor) {

	// Utiliza F6 para avançar variaveis
	editor.keystrokes.set('F6', (data, stop) => {
		stop();
		data.preventDefault();
		data.stopPropagation();
		nextPlaceholder(editor, true)
	});
}

export function nextPlaceholder(editor, fromStart){
	const ckView = editor.editing.view;
	const ckDocument = ckView.document;
	const currentNode = ckDocument.selection.getLastRange().end.parent;

	const position = new ViewPosition(currentNode.isEmpty || fromStart ? ckDocument.getRoot() : currentNode, 0);
	const walker = new ViewTreeWalker({
		startPosition: position
	});
	for (let element of walker) {
		if (element.type === 'elementStart') {
			const item = element.item;
			if (item.hasClass('placeholder') && item.hasAttribute('data-is-fixed') && !item.getAttribute('data-is-fixed') && !item.getAttribute('data-is-solved')) {
				const modelElement = editor.editing.mapper.toModelElement(item);
				editor.model.change(writer => {
					writer.setSelection(modelElement, 'in');
				});
				const domConverter = ckView.domConverter;
				domConverter.viewToDom(item, ckDocument).click();
				return true;
			}
		}
	}
	if(!fromStart){
		console.log('autosearch');
		nextPlaceholder(editor, true);
		return true;
	}
	return false;
}

/**
 * @return {boolean}
 */
export function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

