// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { Dispatch } from "redux";
import { getCommonResourceServiceError, CommonResourceServiceError } from "~/common/api/common-resource-service";
import { ServiceRepository } from "~/services/services";
import { CollectionResource } from '~/models/collection';
import { RootState } from "~/store/store";
import { initialize, startSubmit, stopSubmit } from 'redux-form';
import { collectionPanelActions } from "~/store/collection-panel/collection-panel-action";
import { updateDetails } from "~/store/details-panel/details-panel-action";
import { dialogActions } from "~/store/dialog/dialog-actions";
import { dataExplorerActions } from "~/store/data-explorer/data-explorer-action";
import { snackbarActions } from "~/store/snackbar/snackbar-actions";
import { ContextMenuResource } from '~/store/context-menu/context-menu-reducer';
import { PROJECT_PANEL_ID } from "~/views/project-panel/project-panel";

export interface CollectionUpdateFormDialogData {
    uuid: string;
    name: string;
    description: string;
}

export const COLLECTION_FORM_NAME = 'collectionEditDialog';

export const openUpdater = (resource: ContextMenuResource) =>
    (dispatch: Dispatch) => {
        dispatch(initialize(COLLECTION_FORM_NAME, resource));
        dispatch(dialogActions.OPEN_DIALOG({ id: COLLECTION_FORM_NAME, data: {} }));
    };

export const editCollection = (data: CollectionUpdateFormDialogData) =>
    async (dispatch: Dispatch) => {
        await dispatch<any>(updateCollection(data));
        dispatch(snackbarActions.OPEN_SNACKBAR({
            message: "Collection has been successfully updated.",
            hideDuration: 2000
        }));
    };

export const updateCollection = (collection: Partial<CollectionResource>) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        const uuid = collection.uuid || '';
        dispatch(startSubmit(COLLECTION_FORM_NAME));
        try {
            const updatedCollection = await services.collectionService.update(uuid, collection);
            dispatch(collectionPanelActions.LOAD_COLLECTION_SUCCESS({ item: updatedCollection as CollectionResource }));
            dispatch<any>(updateDetails(updatedCollection));
            dispatch(dataExplorerActions.REQUEST_ITEMS({ id: PROJECT_PANEL_ID }));
            dispatch(dialogActions.CLOSE_DIALOG({ id: COLLECTION_FORM_NAME }));
        } catch(e) {
            const error = getCommonResourceServiceError(e);
            if (error === CommonResourceServiceError.UNIQUE_VIOLATION) {
                dispatch(stopSubmit(COLLECTION_FORM_NAME, { name: 'Collection with the same name already exists.' }));
            }
        }
    };