// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { Dispatch } from "redux";
import { bindDataExplorerActions } from '~/store/data-explorer/data-explorer-action';
import { RootState } from '~/store/store';
import { ServiceRepository } from "~/services/services";
import { navigateToUsers } from "~/store/navigation/navigation-action";
import { unionize, ofType, UnionOf } from "~/common/unionize";
import { dialogActions } from '~/store/dialog/dialog-actions';
import { startSubmit, reset, stopSubmit } from "redux-form";
import { getCommonResourceServiceError, CommonResourceServiceError } from "~/services/common-service/common-resource-service";
import { snackbarActions, SnackbarKind } from '~/store/snackbar/snackbar-actions';
import { UserResource } from "~/models/user";
import { getResource } from '~/store/resources/resources';

export const usersPanelActions = unionize({
    SET_USERS: ofType<any>(),
});

export type UsersActions = UnionOf<typeof usersPanelActions>;

export const USERS_PANEL_ID = 'usersPanel';
export const USER_ATTRIBUTES_DIALOG = 'userAttributesDialog';
export const USER_CREATE_FORM_NAME = 'repositoryCreateFormName';
export const USER_REMOVE_DIALOG = 'repositoryRemoveDialog';

export const openUserAttributes = (uuid: string) =>
    (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        const { resources } = getState();
        const data = getResource<UserResource>(uuid)(resources);
        dispatch(dialogActions.OPEN_DIALOG({ id: USER_ATTRIBUTES_DIALOG, data }));
    };

export const openUserCreateDialog = () =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        const userUuid = await services.authService.getUuid();
        const user = await services.userService.get(userUuid!);
        dispatch(reset(USER_CREATE_FORM_NAME));
        dispatch(dialogActions.OPEN_DIALOG({ id: USER_CREATE_FORM_NAME, data: { user } }));
    };

export const createUser = (user: UserResource) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        const userUuid = await services.authService.getUuid();
        const user = await services.userService.get(userUuid!);
        dispatch(startSubmit(USER_CREATE_FORM_NAME));
        try {
            // const newUser = await services.repositoriesService.create({ name: `${user.username}/${repository.name}` });
            dispatch(dialogActions.CLOSE_DIALOG({ id: USER_CREATE_FORM_NAME }));
            dispatch(reset(USER_CREATE_FORM_NAME));
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: "User has been successfully created.", hideDuration: 2000, kind: SnackbarKind.SUCCESS }));
            dispatch<any>(loadUsersData());
            // return newUser;
            return;
        } catch (e) {
            const error = getCommonResourceServiceError(e);
            if (error === CommonResourceServiceError.NAME_HAS_ALREADY_BEEN_TAKEN) {
                dispatch(stopSubmit(USER_CREATE_FORM_NAME, { name: 'User with the same name already exists.' }));
            }
            return undefined;
        }
    };

export const openRemoveUsersDialog = (uuid: string) =>
    (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        dispatch(dialogActions.OPEN_DIALOG({
            id: USER_REMOVE_DIALOG,
            data: {
                title: 'Remove user',
                text: 'Are you sure you want to remove this user?',
                confirmButtonLabel: 'Remove',
                uuid
            }
        }));
    };

export const removeUser = (uuid: string) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Removing ...' }));
        await services.userService.delete(uuid);
        dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Removed.', hideDuration: 2000, kind: SnackbarKind.SUCCESS }));
        dispatch<any>(loadUsersData());
    };

export const userBindedActions = bindDataExplorerActions(USERS_PANEL_ID);

export const openUsersPanel = () =>
    (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        dispatch<any>(navigateToUsers);
    };

export const loadUsersData = () =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        const users = await services.userService.list();
        dispatch(usersPanelActions.SET_USERS(users.items));
    };

export const loadUsersPanel = () =>
    (dispatch: Dispatch) => {
        dispatch(userBindedActions.REQUEST_ITEMS());
    };