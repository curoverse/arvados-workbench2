// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { Dispatch } from "redux";
import { dialogActions } from "~/store/dialog/dialog-actions";
import { startSubmit, stopSubmit, initialize } from 'redux-form';
import { ServiceRepository } from '~/services/services';
import { RootState } from '~/store/store';
import { getCommonResourceServiceError, CommonResourceServiceError } from "~/common/api/common-resource-service";
import { snackbarActions } from '~/store/snackbar/snackbar-actions';
import { projectPanelActions } from '~/store/project-panel/project-panel-action';
import { getProjectList } from '~/store/project/project-action';
import { MoveToFormDialogData } from '~/store/move-to-dialog/move-to-dialog';
import { resetPickerProjectTree } from '~/store/project-tree-picker/project-tree-picker-actions';
import { findTreeItem } from '~/store/project/project-reducer';

export const PROJECT_MOVE_FORM_NAME = 'projectMoveFormName';

export const openMoveProjectDialog = (resource: { name: string, uuid: string }) =>
    (dispatch: Dispatch) => {
        dispatch<any>(resetPickerProjectTree());
        dispatch(initialize(PROJECT_MOVE_FORM_NAME, resource));
        dispatch(dialogActions.OPEN_DIALOG({ id: PROJECT_MOVE_FORM_NAME, data: {} }));
    };

export const moveProject = (resource: MoveToFormDialogData) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        dispatch(startSubmit(PROJECT_MOVE_FORM_NAME));
        try {
            const project = await services.projectService.get(resource.uuid);
            await services.projectService.update(resource.uuid, { ...project, ownerUuid: resource.ownerUuid });
            dispatch(projectPanelActions.REQUEST_ITEMS());
            dispatch<any>(getProjectList(project.ownerUuid));
            const { projects } = getState();
            if (findTreeItem(projects.items, resource.ownerUuid)) {
                dispatch<any>(getProjectList(resource.ownerUuid));
            }
            dispatch(dialogActions.CLOSE_DIALOG({ id: PROJECT_MOVE_FORM_NAME }));
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Project has been moved', hideDuration: 2000 }));
        } catch (e) {
            const error = getCommonResourceServiceError(e);
            if (error === CommonResourceServiceError.UNIQUE_VIOLATION) {
                dispatch(stopSubmit(PROJECT_MOVE_FORM_NAME, { ownerUuid: 'A project with the same name already exists in the target project.' }));
            } else if (error === CommonResourceServiceError.OWNERSHIP_CYCLE) {
                dispatch(stopSubmit(PROJECT_MOVE_FORM_NAME, { ownerUuid: 'Cannot move a project into itself.' }));
            } else {
                dispatch(dialogActions.CLOSE_DIALOG({ id: PROJECT_MOVE_FORM_NAME }));
                dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Could not move the project.', hideDuration: 2000 }));
            }
        }
    };