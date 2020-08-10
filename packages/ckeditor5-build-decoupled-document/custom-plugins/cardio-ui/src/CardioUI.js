import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import {addListToDropdown, createDropdown} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Model from '@ckeditor/ckeditor5-ui/src/model';

import CardioEditing from '../../cardio/src/CardioEditing';
import CardioCompEditing from '../../cardio-comp/src/CardioCompEditing';
import CardioStressEditing from '../../cardio-stress/src/CardioStressEditing';

import cardioIcon from '../icon/cardio.svg';
import cardioCompIcon from '../icon/cardio-comp.svg';
import cardioStressIcon from '../icon/cardio-stress.svg';

export default class CardioUI extends Plugin {

    static get requires() {
        return [
            CardioEditing,
            CardioCompEditing,
            CardioStressEditing
        ];
    }

    init() {

        const editor = this.editor;
        const t = editor.t;

        // The "simpleBox" button must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add('cardio', locale => {

            const dropdownView = createDropdown(locale);

            // Drop menu para esquerda
            dropdownView.panelPosition = 'sw';

            dropdownView.buttonView.set({
                icon: cardioIcon,
                label: t('Cardio'),
            });

			// Utilizado para desabilitar widget no modo readOnly
			const command = editor.commands.get( 'insertCardio' );
			dropdownView.bind( 'isEnabled' ).to( command );

            // The collection of the list items.
            const items = new Collection();

            // Cardio button
            items.add({
                type: 'button',
                model: new Model({
                    icon: cardioIcon,
                    label: t('Ecocardio'),
                    withText: true,
                    action: 'insertCardio'
                }),
            });

            // CardioComp button
            items.add({
                type: 'button',
                model: new Model({
                    icon: cardioCompIcon,
                    label: t('Ecocardio - Função diastólica do VE'),
                    withText: true,
                    action: 'insertLeftVentrDiastFunc'
                }),
            });

            // CardioComp button
            items.add({
                type: 'button',
                model: new Model({
                    icon: cardioCompIcon,
                    label: t('Ecocardio - Artéria pulmonar e VC'),
                    withText: true,
                    action: 'insertPulmArtAndVenCav'
                }),
            });

            // CardioStress button
            items.add({
                type: 'button',
                model: new Model({
                    icon: cardioStressIcon,
                    label: t('Ecocardio com stress'),
                    withText: true,
                    action: 'insertCardioStress'
                }),
            });

            addListToDropdown(dropdownView, items);

            // Commands
            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute( evt.source.action );
            } );

            return dropdownView;
        });
    }
}
