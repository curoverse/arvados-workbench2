// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { ContextMenuActionSet } from "../context-menu-action-set";
import { collectionPanelFilesAction } from "../../../store/collection-panel/collection-panel-files/collection-panel-files-actions";
import { openRemoveDialog } from "../../remove-dialog/remove-dialog";


export const collectionFilesActionSet: ContextMenuActionSet = [[{
    name: "Select all",
    execute: (dispatch) => {
        dispatch(collectionPanelFilesAction.SELECT_ALL_COLLECTION_FILES());
    }
},{
    name: "Unselect all",
    execute: (dispatch) => {
        dispatch(collectionPanelFilesAction.UNSELECT_ALL_COLLECTION_FILES());
    }
},{
    name: "Remove selected",
    execute: (dispatch, resource) => {
        dispatch(openRemoveDialog('selected files'));
    }
},{
    name: "Download selected",
    execute: (dispatch, resource) => {
        return;
    }
},{
    name: "Create a new collection with selected",
    execute: (dispatch, resource) => {
        return;
    }
}]];