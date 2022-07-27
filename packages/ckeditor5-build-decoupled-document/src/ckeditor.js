/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import DecoupledEditorBase from '@ckeditor/ckeditor5-editor-decoupled/src/decouplededitor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Font from '@ckeditor/ckeditor5-font/src/font';
import FontColor from '@ckeditor/ckeditor5-font/src/fontcolor';
import FontBackgroundColor from '@ckeditor/ckeditor5-font/src/fontbackgroundcolor';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import List from '@ckeditor/ckeditor5-list/src/list';
import ListStyle from '@ckeditor/ckeditor5-list/src/liststyle';
import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import PictureEditing from '@ckeditor/ckeditor5-image/src/pictureediting';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';

import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave';
import Link from '@ckeditor/ckeditor5-link/src/link';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import PageBreak from '@ckeditor/ckeditor5-page-break/src/pagebreak';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock';
import Blockquote from '@ckeditor/ckeditor5-block-quote/src/blockquote';

// Custom Plugins
import CustomFontSizeUI from '../custom-plugins/custom-font-ui/src/CustomFontSizeUI';
import CustomFontFamilyUI from '../custom-plugins/custom-font-ui/src/CustomFontFamilyUI';
import Cardio from '../custom-plugins/cardio-ui/src/CardioUI';
import CustomTable from '../custom-plugins/custom-table/src/CustomTable';
import Placeholder from '../custom-plugins/placeholder/src/Placeholder';

import '../css/custom.css';
import {nextPlaceholder} from '../custom-plugins/placeholder/src/PlaceholderUtils';
import FontSize from "@ckeditor/ckeditor5-font/src/fontsize";
import Subscript from "@ckeditor/ckeditor5-basic-styles/src/subscript";
import Superscript from "@ckeditor/ckeditor5-basic-styles/src/superscript";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import TodoList from "@ckeditor/ckeditor5-list/src/todolist";
import TableProperties from "@ckeditor/ckeditor5-table/src/tableproperties";
import TableCellProperties from "@ckeditor/ckeditor5-table/src/tablecellproperties";
import {SimpleUploadAdapter} from "@ckeditor/ckeditor5-upload";
import {Minimap} from '@ckeditor/ckeditor5-minimap';

export default class DecoupledEditor extends DecoupledEditorBase {
}

// Plugins to include in the build.
DecoupledEditor.builtinPlugins = [
    Essentials,
    Font,
    FontSize,
    FontColor,
    FontBackgroundColor,
    TextTransformation,
    Bold,
    Italic,
    Underline,
    Subscript,
    Superscript,
    Strikethrough,
    Alignment,
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    ImageResize,
    Indent,
    IndentBlock,
    Blockquote,
    HorizontalLine,
    PageBreak,
    List,
    ListProperties,
    TodoList,
    ListStyle,
    Paragraph,
    PasteFromOffice,
    PictureEditing,
    Table,
    TableToolbar,
    TableProperties,
    TableCellProperties,
    SimpleUploadAdapter,
    PageBreak,
    Autosave,
    Link,
    MediaEmbed,
    RemoveFormat,
    Cardio,
    CustomTable,
    Placeholder,
    CustomFontSizeUI,
    CustomFontFamilyUI,
    Minimap
];

// Editor configuration.
DecoupledEditor.defaultConfig = {
    toolbar: {
        items: [
            'undo',
            'redo',
            '|',
            'fontFamilyDropdown',
            '|',
            'fontSizeDropdown',
            '|',
            'fontColor',
            'fontBackgroundColor',
            'removeFormat',
            '|',
            'alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify',
            '|',
            'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            'Blockquote',
            '|',
            'imageUpload',
            'insertTable',
            'horizontalLine',
            'outdent',
            'indent',
            'pageBreak',
            'link',
            'mediaEmbed',
            '|',
            'cardio',
            'placeholder'
        ]
    },
    image: {
        upload: {
            types: ['png', 'jpg', 'jpeg']
        },
        toolbar: [
            'imageStyle:alignLeft',
            'imageStyle:alignCenter',
            'imageStyle:alignRight',
            'imageStyle:full'
        ],
        styles: [
            'alignLeft',
            'alignCenter',
            'alignRight',
            'full'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableProperties',
            'tableCellProperties'
        ]
    },
    fontSize: {
        options: [
            8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 36, 48
        ].map(val => ({
            model: val,
            title: val,
            view: {
                name: 'span',
                styles: {
                    'font-size': `${val}pt`
                }
            }
        }))
    },
    fontFamily: {
        options: [
            'Arial',
            'Courier New',
            'Georgia',
            'Lucida Sans Unicode',
            // 'Tahoma',
            // 'Times New Roman',
            'Trebuchet MS',
            'Verdana'
        ]
    },
    autosave: {
        save(editor) {
            if (editor.config.get('autosaveEnabled')) {
                return saveData(editor.getData());
            } else {
                return false;
            }
        }
    },
    // This value must be kept in sync with the language defined in webpack.config.js.
    language: 'pt-br'
};

// Criação da função "insertHtml" em todas as instâncias criadas do editor.
DecoupledEditor.prototype.insertHtml = function (html) {
    const editor = this;
    const viewFragment = this.data.processor.toView(html);
    const modelFragment = this.data.toModel(viewFragment);
    editor.model.change(writer => {
        const insertRange = editor.model.insertContent(modelFragment);
        if (insertRange?.end) {
            writer.setSelection(insertRange.end, 'after');
            editor.editing.view.focus();

            setTimeout(function () {
                // Abre opções de variaveis caso exista alguma no texto inserido
                if (!nextPlaceholder(editor, true)) {
                    // Caso atalho não possua variavel, rola para final do trecho inserido
                    const ev = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        keyCode: 13,
                        type: 'keydown',
                        which: 13
                    });
                    editor.editing.view.getDomRoot().dispatchEvent(ev);
                }
            }, 100);
        }
    });
};

let sidebarReloaded = false;

// Autosave
function saveData(data) {
    if (!workflowEditor.isReadOnly) {
        displayStatus();
        $('#customfilledform-filled_form_content').val(workflowEditor.getData());
        const form = $('#step-form');
        const circleLoader = $('.circle-loader');
        const checkMark = $('.checkmark');
        const autosaveAlert = $('.workflow-autosave');
        const autosaveText = autosaveAlert.children('span');

        return new Promise(resolve => {
            displayStatus();
            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                type: 'post',
                beforeSend: function () {
                    autosaveAlert.addClass('alert-warning');
                    autosaveText.text('Salvando...');
                    circleLoader.removeClass('hidden');
                },
                success(data) {
                    circleLoader.addClass('load-complete');
                    checkMark.show();
                    checkMark.fadeIn(500);
                    autosaveAlert.removeClass('alert-warning').addClass('alert-success');
                    autosaveText.text('Todas as alterações foram salvas');

                    const treatmentHealthProfessional = $('#treatment-health-professionals');
                    if (!sidebarReloaded) {
                        treatmentHealthProfessional.load(treatmentHealthProfessional.data('url'));
                    }
                    sidebarReloaded = true;
                }
            });
            resolve();
        });
    }
}

// Atualização do status de salvamento
function displayStatus() {
    const pendingActions = workflowEditor.plugins.get('PendingActions');
    const statusIndicator = $('.checkmark-wrapper');
    const circleLoader = $('.circle-loader');
    const checkMark = $('.checkmark');
    const autosaveAlert = $('.workflow-autosave');
    const autosaveText = autosaveAlert.children('span');

    pendingActions.off('change:hasAny');
    pendingActions.on('change:hasAny', (evt, propertyName, newValue) => {
        autosaveAlert.css('opacity', 1);
        if (newValue) {
            if (statusIndicator.is(':animated')) {
                statusIndicator.stop().show();
            }
            circleLoader.removeClass('load-complete');
            checkMark.fadeOut(500);
            autosaveAlert.removeClass('alert-success').addClass('alert-warning');
            autosaveText.text('Salvando...');
        }
    });
}
