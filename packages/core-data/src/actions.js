/**
 * External dependencies
 */
import { castArray, merge, isEqual, find } from 'lodash';

/**
 * Internal dependencies
 */
import {
	receiveItems,
	receiveQueriedItems,
} from './queried-data';
import { getKindEntities, DEFAULT_ENTITY_KEY } from './entities';
import { select, apiFetch } from './controls';

/**
 * Returns an action object used in signalling that authors have been received.
 *
 * @param {string}       queryID Query ID.
 * @param {Array|Object} users   Users received.
 *
 * @return {Object} Action object.
 */
export function receiveUserQuery( queryID, users ) {
	return {
		type: 'RECEIVE_USER_QUERY',
		users: castArray( users ),
		queryID,
	};
}

/**
 * Returns an action used in signalling that the current user has been received.
 *
 * @param {Object} currentUser Current user object.
 *
 * @return {Object} Action object.
 */
export function receiveCurrentUser( currentUser ) {
	return {
		type: 'RECEIVE_CURRENT_USER',
		currentUser,
	};
}

/**
 * Returns an action object used in adding new entities.
 *
 * @param {Array} entities  Entities received.
 *
 * @return {Object} Action object.
 */
export function addEntities( entities ) {
	return {
		type: 'ADD_ENTITIES',
		entities,
	};
}

/**
 * Returns an action object used in signalling that entity records have been received.
 *
 * @param {string}       kind            Kind of the received entity.
 * @param {string}       name            Name of the received entity.
 * @param {Array|Object} records         Records received.
 * @param {?Object}      query           Query Object.
 * @param {?boolean}     invalidateCache Should invalidate query caches
 *
 * @return {Object} Action object.
 */
export function receiveEntityRecords( kind, name, records, query, invalidateCache = false ) {
	let action;
	if ( query ) {
		action = receiveQueriedItems( records, query );
	} else {
		action = receiveItems( records );
	}

	return {
		...action,
		kind,
		name,
		invalidateCache,
	};
}

/**
 * Returns an action object used in signalling that the index has been received.
 *
 * @param {Object} themeSupports Theme support for the current theme.
 *
 * @return {Object} Action object.
 */
export function receiveThemeSupports( themeSupports ) {
	return {
		type: 'RECEIVE_THEME_SUPPORTS',
		themeSupports,
	};
}

/**
 * Returns an action object used in signalling that the preview data for
 * a given URl has been received.
 *
 * @param {string}  url      URL to preview the embed for.
 * @param {Mixed}   preview  Preview data.
 *
 * @return {Object} Action object.
 */
export function receiveEmbedPreview( url, preview ) {
	return {
		type: 'RECEIVE_EMBED_PREVIEW',
		url,
		preview,
	};
}

/**
 * Returns an action object that triggers an
 * edit to an entity record.
 *
 * @param {string} kind           Kind of the edited entity record.
 * @param {string} name           Name of the edited entity record.
 * @param {number} recordId       Record ID of the edited entity record.
 * @param {Object} edits          The edits.
 *
 * @return {Object} Action object.
 */
export function* editEntityRecord( kind, name, recordId, edits ) {
	const { transientEdits = {}, mergedEdits = {} } = yield select( 'getEntity', kind, name );
	const record = yield select( 'getEntityRecord', kind, name, recordId );
	const editedRecord = yield select(
		'getEditedEntityRecord',
		kind,
		name,
		recordId
	);

	const edit = {
		kind,
		name,
		recordId,
		// Clear edits when they are equal to their persisted counterparts
		// so that the property is not considered dirty.
		edits: Object.keys( edits ).reduce( ( acc, key ) => {
			const value = mergedEdits[ key ] ?
				merge( record[ key ], edits[ key ] ) :
				edits[ key ];
			acc[ key ] = isEqual( record[ key ], value ) ? undefined : value;
			return acc;
		}, {} ),
		transientEdits,
	};
	return {
		type: 'EDIT_ENTITY_RECORD',
		...edit,
		meta: {
			undo: {
				...edit,
				// Send the current values for things like the first undo stack entry.
				edits: Object.keys( edits ).reduce( ( acc, key ) => {
					acc[ key ] = editedRecord[ key ];
					return acc;
				}, {} ),
			},
		},
	};
}

/**
 * Action triggered to undo the last edit to
 * an entity record, if any.
 */
export function* undo() {
	const undoEdit = yield select( 'getUndoEdit' );
	if ( ! undoEdit ) {
		return;
	}
	yield {
		type: 'EDIT_ENTITY_RECORD',
		...undoEdit,
		meta: {
			isUndo: true,
		},
	};
}

/**
 * Action triggered to redo the last undoed
 * edit to an entity record, if any.
 */
export function* redo() {
	const redoEdit = yield select( 'getRedoEdit' );
	if ( ! redoEdit ) {
		return;
	}
	yield {
		type: 'EDIT_ENTITY_RECORD',
		...redoEdit,
		meta: {
			isRedo: true,
		},
	};
}

/**
 * Action triggered to save an entity record.
 *
 * @param {string} kind    Kind of the received entity.
 * @param {string} name    Name of the received entity.
 * @param {Object} record  Record to be saved.
 */
export function* saveEntityRecord( kind, name, record ) {
	const entities = yield getKindEntities( kind );
	const entity = find( entities, { kind, name } );
	if ( ! entity ) {
		return;
	}
	const key = entity.key || DEFAULT_ENTITY_KEY;
	const recordId = record[ key ];

	yield { type: 'SAVE_ENTITY_RECORD_START', kind, name, recordId };
	let error;
	try {
		const updatedRecord = yield apiFetch( {
			path: `${ entity.baseURL }${ recordId ? '/' + recordId : '' }`,
			method: recordId ? 'PUT' : 'POST',
			data: record,
		} );
		yield receiveEntityRecords( kind, name, updatedRecord, undefined, true );
	} catch ( _error ) {
		error = _error;
	}
	yield { type: 'SAVE_ENTITY_RECORD_FINISH', kind, name, recordId, error };
}

/**
 * Action triggered to save an entity record's edits.
 *
 * @param {string} kind     Kind of the entity.
 * @param {string} name     Name of the entity.
 * @param {Object} recordId ID of the record.
 */
export function* saveEditedEntityRecord( kind, name, recordId ) {
	if ( ! ( yield select( 'hasEditsForEntityRecord', kind, name, recordId ) ) ) {
		return;
	}
	const edits = yield select(
		'getEntityRecordNonTransientEdits',
		kind,
		name,
		recordId
	);
	const record = { id: recordId, ...edits };
	yield* saveEntityRecord( kind, name, record );
}

/**
 * Returns an action object used in signalling that Upload permissions have been received.
 *
 * @param {boolean} hasUploadPermissions Does the user have permission to upload files?
 *
 * @return {Object} Action object.
 */
export function receiveUploadPermissions( hasUploadPermissions ) {
	return {
		type: 'RECEIVE_USER_PERMISSION',
		key: 'create/media',
		isAllowed: hasUploadPermissions,
	};
}

/**
 * Returns an action object used in signalling that the current user has
 * permission to perform an action on a REST resource.
 *
 * @param {string}  key       A key that represents the action and REST resource.
 * @param {boolean} isAllowed Whether or not the user can perform the action.
 *
 * @return {Object} Action object.
 */
export function receiveUserPermission( key, isAllowed ) {
	return {
		type: 'RECEIVE_USER_PERMISSION',
		key,
		isAllowed,
	};
}

/**
 * Returns an action object used in signalling that the autosaves for a
 * post have been received.
 *
 * @param {number}       postId    The id of the post that is parent to the autosave.
 * @param {Array|Object} autosaves An array of autosaves or singular autosave object.
 *
 * @return {Object} Action object.
 */
export function receiveAutosaves( postId, autosaves ) {
	return {
		type: 'RECEIVE_AUTOSAVES',
		postId,
		autosaves: castArray( autosaves ),
	};
}
