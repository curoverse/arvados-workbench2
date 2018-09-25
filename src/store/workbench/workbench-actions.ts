// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { Dispatch } from 'redux';
import { RootState } from "../store";
import { loadDetailsPanel } from '~/store/details-panel/details-panel-action';
import { loadCollectionPanel } from '~/store/collection-panel/collection-panel-action';
import { snackbarActions } from '../snackbar/snackbar-actions';
import { loadFavoritePanel } from '../favorite-panel/favorite-panel-action';
import { openProjectPanel, projectPanelActions } from '~/store/project-panel/project-panel-action';
import { activateSidePanelTreeItem, initSidePanelTree, SidePanelTreeCategory, loadSidePanelTreeProjects, getSidePanelTreeNodeAncestorsIds } from '../side-panel-tree/side-panel-tree-actions';
import { loadResource, updateResources } from '../resources/resources-actions';
import { favoritePanelActions } from '~/store/favorite-panel/favorite-panel-action';
import { projectPanelColumns } from '~/views/project-panel/project-panel';
import { favoritePanelColumns } from '~/views/favorite-panel/favorite-panel';
import { matchRootRoute } from '~/routes/routes';
import { setCollectionBreadcrumbs, setSidePanelBreadcrumbs, setProcessBreadcrumbs, setSharedWithMeBreadcrumbs, setTrashBreadcrumbs } from '../breadcrumbs/breadcrumbs-actions';
import { navigateToProject } from '../navigation/navigation-action';
import { MoveToFormDialogData } from '~/store/move-to-dialog/move-to-dialog';
import { ServiceRepository } from '~/services/services';
import { getResource } from '../resources/resources';
import { getProjectPanelCurrentUuid } from '../project-panel/project-panel-action';
import * as projectCreateActions from '~/store/projects/project-create-actions';
import * as projectMoveActions from '~/store/projects/project-move-actions';
import * as projectUpdateActions from '~/store/projects/project-update-actions';
import * as collectionCreateActions from '~/store/collections/collection-create-actions';
import * as collectionCopyActions from '~/store/collections/collection-copy-actions';
import * as collectionUpdateActions from '~/store/collections/collection-update-actions';
import * as collectionMoveActions from '~/store/collections/collection-move-actions';
import * as processesActions from '../processes/processes-actions';
import * as processMoveActions from '~/store/processes/process-move-actions';
import * as processUpdateActions from '~/store/processes/process-update-actions';
import * as processCopyActions from '~/store/processes/process-copy-actions';
import { trashPanelColumns } from "~/views/trash-panel/trash-panel";
import { loadTrashPanel, trashPanelActions } from "~/store/trash-panel/trash-panel-action";
import { initProcessLogsPanel } from '../process-logs-panel/process-logs-panel-actions';
import { loadProcessPanel } from '~/store/process-panel/process-panel-actions';
import { sharedWithMePanelActions } from '~/store/shared-with-me-panel/shared-with-me-panel-actions';
import { loadSharedWithMePanel } from '../shared-with-me-panel/shared-with-me-panel-actions';
import { CopyFormDialogData } from '~/store/copy-dialog/copy-dialog';
import { progressIndicatorActions } from '~/store/progress-indicator/progress-indicator-actions';
import { getProgressIndicator } from '../progress-indicator/progress-indicator-reducer';
import { ResourceKind, extractUuidKind } from '~/models/resource';
import { FilterBuilder } from '~/services/api/filter-builder';
import { ProjectResource } from '~/models/project';
import { CollectionResource } from '~/models/collection';

export const WORKBENCH_LOADING_SCREEN = 'workbenchLoadingScreen';

export const isWorkbenchLoading = (state: RootState) => {
    const progress = getProgressIndicator(WORKBENCH_LOADING_SCREEN)(state.progressIndicator);
    return progress ? progress.working : false;
};

const handleFirstTimeLoad = (action: any) =>
    async (dispatch: Dispatch<any>, getState: () => RootState) => {
        try {
            await dispatch(action);
        } finally {
            if (isWorkbenchLoading(getState())) {
                dispatch(progressIndicatorActions.STOP_WORKING(WORKBENCH_LOADING_SCREEN));
            }
        }
    };


export const loadWorkbench = () =>
    async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(progressIndicatorActions.START_WORKING(WORKBENCH_LOADING_SCREEN));
        const { auth, router } = getState();
        const { user } = auth;
        if (user) {
            const userResource = await dispatch<any>(loadResource(user.uuid));
            if (userResource) {
                dispatch(projectPanelActions.SET_COLUMNS({ columns: projectPanelColumns }));
                dispatch(favoritePanelActions.SET_COLUMNS({ columns: favoritePanelColumns }));
                dispatch(trashPanelActions.SET_COLUMNS({ columns: trashPanelColumns }));
                dispatch(sharedWithMePanelActions.SET_COLUMNS({ columns: projectPanelColumns }));
                dispatch<any>(initSidePanelTree());
                if (router.location) {
                    const match = matchRootRoute(router.location.pathname);
                    if (match) {
                        dispatch(navigateToProject(userResource.uuid));
                    }
                }
            } else {
                dispatch(userIsNotAuthenticated);
            }
        } else {
            dispatch(userIsNotAuthenticated);
        }
    };

export const loadFavorites = () =>
    handleFirstTimeLoad(
        (dispatch: Dispatch) => {
            dispatch<any>(activateSidePanelTreeItem(SidePanelTreeCategory.FAVORITES));
            dispatch<any>(loadFavoritePanel());
            dispatch<any>(setSidePanelBreadcrumbs(SidePanelTreeCategory.FAVORITES));
        });

export const loadTrash = () =>
    handleFirstTimeLoad(
        (dispatch: Dispatch) => {
            dispatch<any>(activateSidePanelTreeItem(SidePanelTreeCategory.TRASH));
            dispatch<any>(loadTrashPanel());
            dispatch<any>(setSidePanelBreadcrumbs(SidePanelTreeCategory.TRASH));
        });

export const loadProject = (uuid: string) =>
    handleFirstTimeLoad(
        async (dispatch: Dispatch<any>, getState: () => RootState, services: ServiceRepository) => {
            const userUuid = services.authService.getUuid();
            if (userUuid) {
                let project: ProjectResource | null = null;
                if (userUuid !== uuid) {
                    /**
                     * Use of /group/contents API is the only way to get trashed item
                     * A get method of a service will throw an exception with 404 status for resources that are trashed
                     */
                    const resource = await loadGroupContentsResource(uuid, userUuid, services);
                    if (resource) {
                        if (resource.kind === ResourceKind.PROJECT) {
                            project = resource;
                            if (project.isTrashed) {
                                dispatch<any>(setTrashBreadcrumbs(uuid));
                                dispatch(activateSidePanelTreeItem(SidePanelTreeCategory.TRASH));
                            } else {
                                await dispatch(activateSidePanelTreeItem(uuid));
                                dispatch<any>(setSidePanelBreadcrumbs(uuid));
                            }
                        }
                    } else {
                        /**
                         * If item is not accesible using loadGroupContentsResource,
                         * but it can be obtained using the get method of the service
                         * then it is shared with the user
                         */
                        project = await services.projectService.get(uuid);
                        if (project) {
                            dispatch<any>(setSharedWithMeBreadcrumbs(uuid));
                            dispatch(activateSidePanelTreeItem(SidePanelTreeCategory.SHARED_WITH_ME));
                        }
                    }
                    if (project) {
                        dispatch(updateResources([project]));
                    }
                } else {
                    await dispatch(activateSidePanelTreeItem(userUuid));
                    dispatch<any>(setSidePanelBreadcrumbs(userUuid));
                }
                if (project) {
                    dispatch(openProjectPanel(uuid));
                    dispatch(loadDetailsPanel(uuid));
                }
            }
        });

export const createProject = (data: projectCreateActions.ProjectCreateFormDialogData) =>
    async (dispatch: Dispatch) => {
        const newProject = await dispatch<any>(projectCreateActions.createProject(data));
        if (newProject) {
            dispatch(snackbarActions.OPEN_SNACKBAR({
                message: "Project has been successfully created.",
                hideDuration: 2000
            }));
            await dispatch<any>(loadSidePanelTreeProjects(newProject.ownerUuid));
            dispatch<any>(reloadProjectMatchingUuid([newProject.ownerUuid]));
        }
    };

export const moveProject = (data: MoveToFormDialogData) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        try {
            const oldProject = getResource(data.uuid)(getState().resources);
            const oldOwnerUuid = oldProject ? oldProject.ownerUuid : '';
            const movedProject = await dispatch<any>(projectMoveActions.moveProject(data));
            if (movedProject) {
                dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Project has been moved', hideDuration: 2000 }));
                if (oldProject) {
                    await dispatch<any>(loadSidePanelTreeProjects(oldProject.ownerUuid));
                }
                dispatch<any>(reloadProjectMatchingUuid([oldOwnerUuid, movedProject.ownerUuid, movedProject.uuid]));
            }
        } catch (e) {
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: e.message, hideDuration: 2000 }));
        }
    };

export const updateProject = (data: projectUpdateActions.ProjectUpdateFormDialogData) =>
    async (dispatch: Dispatch) => {
        const updatedProject = await dispatch<any>(projectUpdateActions.updateProject(data));
        if (updatedProject) {
            dispatch(snackbarActions.OPEN_SNACKBAR({
                message: "Project has been successfully updated.",
                hideDuration: 2000
            }));
            await dispatch<any>(loadSidePanelTreeProjects(updatedProject.ownerUuid));
            dispatch<any>(reloadProjectMatchingUuid([updatedProject.ownerUuid, updatedProject.uuid]));
        }
    };

export const loadCollection = (uuid: string) =>
    handleFirstTimeLoad(
        async (dispatch: Dispatch<any>, getState: () => RootState, services: ServiceRepository) => {
            const userUuid = services.authService.getUuid();
            if (userUuid) {
                let collection: CollectionResource | null = null;

                if (extractUuidKind(uuid) === ResourceKind.COLLECTION) {
                    /**
                     * Use of /group/contents API is the only way to get trashed item
                     * A get method of a service will throw an exception with 404 status for resources that are trashed
                     */
                    const resource = await loadGroupContentsResource(uuid, userUuid, services);
                    if (resource) {
                        if (resource.kind === ResourceKind.COLLECTION) {
                            collection = resource;
                            if (collection.isTrashed) {
                                dispatch(setTrashBreadcrumbs(''));
                                dispatch(activateSidePanelTreeItem(SidePanelTreeCategory.TRASH));
                            } else {
                                await dispatch(activateSidePanelTreeItem(collection.ownerUuid));
                                dispatch(setSidePanelBreadcrumbs(collection.ownerUuid));
                            }
                        }
                    } else {
                        /**
                         * If item is not accesible using loadGroupContentsResource,
                         * but it can be obtained using the get method of the service
                         * then it is shared with the user
                         */
                        collection = await services.collectionService.get(uuid);
                        if (collection) {
                            dispatch<any>(setSharedWithMeBreadcrumbs(collection.ownerUuid));
                            dispatch(activateSidePanelTreeItem(SidePanelTreeCategory.SHARED_WITH_ME));
                        }
                    }
                    if (collection) {
                        dispatch(updateResources([collection]));
                    }
                }
            }
        });

export const createCollection = (data: collectionCreateActions.CollectionCreateFormDialogData) =>
    async (dispatch: Dispatch) => {
        const collection = await dispatch<any>(collectionCreateActions.createCollection(data));
        if (collection) {
            dispatch(snackbarActions.OPEN_SNACKBAR({
                message: "Collection has been successfully created.",
                hideDuration: 2000
            }));
            dispatch<any>(updateResources([collection]));
            dispatch<any>(reloadProjectMatchingUuid([collection.ownerUuid]));
        }
    };

export const updateCollection = (data: collectionUpdateActions.CollectionUpdateFormDialogData) =>
    async (dispatch: Dispatch) => {
        const collection = await dispatch<any>(collectionUpdateActions.updateCollection(data));
        if (collection) {
            dispatch(snackbarActions.OPEN_SNACKBAR({
                message: "Collection has been successfully updated.",
                hideDuration: 2000
            }));
            dispatch<any>(updateResources([collection]));
            dispatch<any>(reloadProjectMatchingUuid([collection.ownerUuid]));
        }
    };

export const copyCollection = (data: CopyFormDialogData) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        try {
            const collection = await dispatch<any>(collectionCopyActions.copyCollection(data));
            dispatch<any>(updateResources([collection]));
            dispatch<any>(reloadProjectMatchingUuid([collection.ownerUuid]));
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Collection has been copied.', hideDuration: 2000 }));
        } catch (e) {
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: e.message, hideDuration: 2000 }));
        }
    };

export const moveCollection = (data: MoveToFormDialogData) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        try {
            const collection = await dispatch<any>(collectionMoveActions.moveCollection(data));
            dispatch<any>(updateResources([collection]));
            dispatch<any>(reloadProjectMatchingUuid([collection.ownerUuid]));
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Collection has been moved.', hideDuration: 2000 }));
        } catch (e) {
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: e.message, hideDuration: 2000 }));
        }
    };

export const loadProcess = (uuid: string) =>
    handleFirstTimeLoad(
        async (dispatch: Dispatch, getState: () => RootState) => {
            dispatch<any>(loadProcessPanel(uuid));
            const process = await dispatch<any>(processesActions.loadProcess(uuid));
            await dispatch<any>(activateSidePanelTreeItem(process.containerRequest.ownerUuid));
            dispatch<any>(setProcessBreadcrumbs(uuid));
            dispatch(loadDetailsPanel(uuid));
        });

export const updateProcess = (data: processUpdateActions.ProcessUpdateFormDialogData) =>
    async (dispatch: Dispatch) => {
        try {
            const process = await dispatch<any>(processUpdateActions.updateProcess(data));
            if (process) {
                dispatch(snackbarActions.OPEN_SNACKBAR({
                    message: "Process has been successfully updated.",
                    hideDuration: 2000
                }));
                dispatch<any>(updateResources([process]));
                dispatch<any>(reloadProjectMatchingUuid([process.ownerUuid]));
            }
        } catch (e) {
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: e.message, hideDuration: 2000 }));
        }
    };

export const moveProcess = (data: MoveToFormDialogData) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        try {
            const process = await dispatch<any>(processMoveActions.moveProcess(data));
            dispatch<any>(updateResources([process]));
            dispatch<any>(reloadProjectMatchingUuid([process.ownerUuid]));
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Process has been moved.', hideDuration: 2000 }));
        } catch (e) {
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: e.message, hideDuration: 2000 }));
        }
    };

export const copyProcess = (data: CopyFormDialogData) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        try {
            const process = await dispatch<any>(processCopyActions.copyProcess(data));
            dispatch<any>(updateResources([process]));
            dispatch<any>(reloadProjectMatchingUuid([process.ownerUuid]));
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: 'Process has been copied.', hideDuration: 2000 }));
        } catch (e) {
            dispatch(snackbarActions.OPEN_SNACKBAR({ message: e.message, hideDuration: 2000 }));
        }
    };

export const loadProcessLog = (uuid: string) =>
    handleFirstTimeLoad(
        async (dispatch: Dispatch) => {
            const process = await dispatch<any>(processesActions.loadProcess(uuid));
            dispatch<any>(setProcessBreadcrumbs(uuid));
            dispatch<any>(initProcessLogsPanel(uuid));
            await dispatch<any>(activateSidePanelTreeItem(process.containerRequest.ownerUuid));
        });

export const resourceIsNotLoaded = (uuid: string) =>
    snackbarActions.OPEN_SNACKBAR({
        message: `Resource identified by ${uuid} is not loaded.`
    });

export const userIsNotAuthenticated = snackbarActions.OPEN_SNACKBAR({
    message: 'User is not authenticated'
});

export const couldNotLoadUser = snackbarActions.OPEN_SNACKBAR({
    message: 'Could not load user'
});

export const reloadProjectMatchingUuid = (matchingUuids: string[]) =>
    async (dispatch: Dispatch, getState: () => RootState, services: ServiceRepository) => {
        const currentProjectPanelUuid = getProjectPanelCurrentUuid(getState());
        if (currentProjectPanelUuid && matchingUuids.some(uuid => uuid === currentProjectPanelUuid)) {
            dispatch<any>(loadProject(currentProjectPanelUuid));
        }
    };

export const loadSharedWithMe = handleFirstTimeLoad(async (dispatch: Dispatch) => {
    dispatch<any>(loadSharedWithMePanel());
    await dispatch<any>(activateSidePanelTreeItem(SidePanelTreeCategory.SHARED_WITH_ME));
    await dispatch<any>(setSidePanelBreadcrumbs(SidePanelTreeCategory.SHARED_WITH_ME));
});

const loadGroupContentsResource = async (uuid: string, ownerUuid: string, services: ServiceRepository) => {

    const filters = new FilterBuilder()
        .addEqual('uuid', uuid)
        .getFilters();

    const { items } = await services.groupsService.contents(ownerUuid, {
        filters,
        recursive: true,
        includeTrash: true,
    });

    return items.shift();

};
