/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { SelectControl } from '@wordpress/components';

const options = [
	{ value: 'post-content', label: __( 'Writing' ) },
	{ value: 'preview', label: __( 'Preview' ) },
	{ value: 'full-site', label: __( 'Full Site Editing' ) },
	{ value: 'design', label: __( 'Design' ) },
	{ value: 'template', label: __( 'Template' ) },
	{ value: '---', label: __( '---' ) },
	{ value: 'header', label: __( 'Header' ) },
	{ value: 'sidebar', label: __( 'Sidebar' ) },
	{ value: 'footer', label: __( 'Footer' ) },
];

export default function ViewEditingModePicker() {
	const { post, blocks, settings, viewEditingMode } = useSelect( ( select ) => {
		const {
			getCurrentPost,
			getBlocksForSerialization,
			getEditorSettings,
			getViewEditingMode,
		} = select( 'core/editor' );
		return {
			post: getCurrentPost(),
			blocks: getBlocksForSerialization(),
			settings: getEditorSettings(),
			viewEditingMode: getViewEditingMode(),
		};
	}, [] );
	const { setupEditor, updateViewEditingMode } = useDispatch( 'core/editor' );

	const updateViewEditingModeCallback = useCallback( ( newViewEditingMode ) => {
		updateViewEditingMode( newViewEditingMode );

		let newBlocks = blocks;
		if ( viewEditingMode !== 'post-content' ) { // Leaving template mode.
			const postContentBlock = blocks.find(
				( block ) => block.name === 'core/post-content'
			);
			newBlocks = postContentBlock ? postContentBlock.innerBlocks : [];
		}
		setupEditor(
			post,
			{
				blocks: newBlocks,
			},
			settings.template,
			newViewEditingMode !== 'post-content' && settings.templatePost
		);
	}, [ post, blocks, settings.template, settings.templatePost, viewEditingMode ] );

	return (
		<SelectControl
			className="editor-view-editing-mode-picker"
			label={ __( 'View Editing Mode' ) }
			hideLabelFromVision
			options={ options }
			value={ viewEditingMode }
			onChange={ updateViewEditingModeCallback }
		/>
	);
}
