// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { DataExplorerMiddlewareService, listResultsToDataExplorerItemsMeta, dataExplorerToListParams } from '../data-explorer/data-explorer-middleware-service';
import { ServiceRepository } from '~/services/services';
import { MiddlewareAPI, Dispatch } from 'redux';
import { RootState } from '~/store/store';
import { getDataExplorer, DataExplorer } from '~/store/data-explorer/data-explorer-reducer';
import { updateFavorites } from '~/store/favorites/favorites-actions';
import { updateResources } from '~/store/resources/resources-actions';
import { loadMissingProcessesInformation } from '~/store/project-panel/project-panel-middleware-service';
import { snackbarActions } from '~/store/snackbar/snackbar-actions';
import { sharedWithMePanelActions } from './shared-with-me-panel-actions';
import { ListResults } from '~/services/common-service/common-resource-service';
import { GroupContentsResource } from '~/services/groups-service/groups-service';
import { SortDirection } from '~/components/data-table/data-column';
import { OrderBuilder, OrderDirection } from '~/services/api/order-builder';
import { ProjectResource } from '~/models/project';
import { ProjectPanelColumnNames } from '~/views/project-panel/project-panel';
import { FilterBuilder } from '~/services/api/filter-builder';

export class SharedWithMeMiddlewareService extends DataExplorerMiddlewareService {
    constructor(private services: ServiceRepository, id: string) {
        super(id);
    }

    async requestItems(api: MiddlewareAPI<Dispatch, RootState>) {
        const state = api.getState();
        const dataExplorer = getDataExplorer(state.dataExplorer, this.getId());
        try {
            const response = await this.services.groupsService.shared(getParams(dataExplorer));
            api.dispatch<any>(updateFavorites(response.items.map(item => item.uuid)));
            api.dispatch(updateResources(response.items));
            await api.dispatch<any>(loadMissingProcessesInformation(response.items));
            api.dispatch(setItems(response));
        } catch (e) {
            api.dispatch(couldNotFetchSharedItems());
        }
    }
}

export const getParams = (dataExplorer: DataExplorer) => ({
    ...dataExplorerToListParams(dataExplorer),
    order: getOrder(dataExplorer),
    filters: getFilters(dataExplorer),
});

export const getFilters = (dataExplorer: DataExplorer) => {
    const filters = new FilterBuilder()
        .addILike("name", dataExplorer.searchValue)
        .getFilters();
    return `[${filters}]`;
};

export const getOrder = (dataExplorer: DataExplorer) => {
    const sortColumn = dataExplorer.columns.find(c => c.sortDirection !== SortDirection.NONE);
    const order = new OrderBuilder<ProjectResource>();
    if (sortColumn) {
        const sortDirection = sortColumn && sortColumn.sortDirection === SortDirection.ASC
            ? OrderDirection.ASC
            : OrderDirection.DESC;
        const columnName = sortColumn && sortColumn.name === ProjectPanelColumnNames.NAME ? "name" : "createdAt";
        return order
            .addOrder(sortDirection, columnName)
            .getOrder();
    } else {
        return order.getOrder();
    }
};

export const setItems = (listResults: ListResults<GroupContentsResource>) =>
    sharedWithMePanelActions.SET_ITEMS({
        ...listResultsToDataExplorerItemsMeta(listResults),
        items: listResults.items.map(resource => resource.uuid),
    });

const couldNotFetchSharedItems = () =>
    snackbarActions.OPEN_SNACKBAR({
        message: 'Could not fetch shared items.'
    });