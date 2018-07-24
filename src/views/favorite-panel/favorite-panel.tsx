// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { FavoritePanelItem } from './favorite-panel-item';
import { Grid, Typography, Button, StyleRulesCallback, WithStyles, withStyles } from '@material-ui/core';
import { formatDate, formatFileSize } from '../../common/formatters';
import { DataExplorer } from "../../views-components/data-explorer/data-explorer";
import { DispatchProp, connect } from 'react-redux';
import { DataColumns } from '../../components/data-table/data-table';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../store/store';
import { DataTableFilterItem } from '../../components/data-table-filters/data-table-filters';
import { ContainerRequestState } from '../../models/container-request';
import { SortDirection } from '../../components/data-table/data-column';
import { ResourceKind } from '../../models/resource';
import { resourceLabel } from '../../common/labels';
import { ProjectIcon, CollectionIcon, ProcessIcon, DefaultIcon } from '../../components/icon/icon';
import { ArvadosTheme } from '../../common/custom-theme';
import { FavoriteStar } from "../../views-components/favorite-star/favorite-star";

type CssRules = "toolbar" | "button";

const styles: StyleRulesCallback<CssRules> = (theme: ArvadosTheme) => ({
    toolbar: {
        paddingBottom: theme.spacing.unit * 3,
        textAlign: "right"
    },
    button: {
        marginLeft: theme.spacing.unit
    },
});

const renderName = (item: FavoritePanelItem) =>
    <Grid container alignItems="center" wrap="nowrap" spacing={16}>
        <Grid item>
            {renderIcon(item)}
        </Grid>
        <Grid item>
            <Typography color="primary">
                {item.name}
            </Typography>
        </Grid>
        <Grid item>
            <Typography variant="caption">
                <FavoriteStar resourceUuid={item.uuid} />
            </Typography>
        </Grid>
    </Grid>;


const renderIcon = (item: FavoritePanelItem) => {
    switch (item.kind) {
        case ResourceKind.Project:
            return <ProjectIcon />;
        case ResourceKind.Collection:
            return <CollectionIcon />;
        case ResourceKind.Process:
            return <ProcessIcon />;
        default:
            return <DefaultIcon />;
    }
};

const renderDate = (date: string) => {
    return <Typography noWrap>{formatDate(date)}</Typography>;
};

const renderFileSize = (fileSize?: number) =>
    <Typography noWrap>
        {formatFileSize(fileSize)}
    </Typography>;

const renderOwner = (owner: string) =>
    <Typography noWrap color="primary" >
        {owner}
    </Typography>;

const renderType = (type: string) =>
    <Typography noWrap>
        {resourceLabel(type)}
    </Typography>;

const renderStatus = (item: FavoritePanelItem) =>
    <Typography noWrap align="center" >
        {item.status || "-"}
    </Typography>;

export enum FavoritePanelColumnNames {
    NAME = "Name",
    STATUS = "Status",
    TYPE = "Type",
    OWNER = "Owner",
    FILE_SIZE = "File size",
    LAST_MODIFIED = "Last modified"
}

export interface FavoritePanelFilter extends DataTableFilterItem {
    type: ResourceKind | ContainerRequestState;
}

export const columns: DataColumns<FavoritePanelItem, FavoritePanelFilter> = [
    {
        name: FavoritePanelColumnNames.NAME,
        selected: true,
        sortDirection: SortDirection.Asc,
        render: renderName,
        width: "450px"
    },
    {
        name: "Status",
        selected: true,
        filters: [
            {
                name: ContainerRequestState.Committed,
                selected: true,
                type: ContainerRequestState.Committed
            },
            {
                name: ContainerRequestState.Final,
                selected: true,
                type: ContainerRequestState.Final
            },
            {
                name: ContainerRequestState.Uncommitted,
                selected: true,
                type: ContainerRequestState.Uncommitted
            }
        ],
        render: renderStatus,
        width: "75px"
    },
    {
        name: FavoritePanelColumnNames.TYPE,
        selected: true,
        filters: [
            {
                name: resourceLabel(ResourceKind.Collection),
                selected: true,
                type: ResourceKind.Collection
            },
            {
                name: resourceLabel(ResourceKind.Process),
                selected: true,
                type: ResourceKind.Process
            },
            {
                name: resourceLabel(ResourceKind.Project),
                selected: true,
                type: ResourceKind.Project
            }
        ],
        render: item => renderType(item.kind),
        width: "125px"
    },
    {
        name: FavoritePanelColumnNames.OWNER,
        selected: true,
        render: item => renderOwner(item.owner),
        width: "200px"
    },
    {
        name: FavoritePanelColumnNames.FILE_SIZE,
        selected: true,
        render: item => renderFileSize(item.fileSize),
        width: "50px"
    },
    {
        name: FavoritePanelColumnNames.LAST_MODIFIED,
        selected: true,
        sortDirection: SortDirection.None,
        render: item => renderDate(item.lastModified),
        width: "150px"
    }
];

export const FAVORITE_PANEL_ID = "favoritePanel";

interface FavoritePanelDataProps {
    currentItemId: string;
}

interface FavoritePanelActionProps {
    onItemClick: (item: FavoritePanelItem) => void;
    onContextMenu: (event: React.MouseEvent<HTMLElement>, item: FavoritePanelItem) => void;
    onDialogOpen: (ownerUuid: string) => void;
    onItemDoubleClick: (item: FavoritePanelItem) => void;
    onItemRouteChange: (itemId: string) => void;
}

type FavoritePanelProps = FavoritePanelDataProps & FavoritePanelActionProps & DispatchProp
                        & WithStyles<CssRules> & RouteComponentProps<{ id: string }>;

export const FavoritePanel = withStyles(styles)(
    connect((state: RootState) => ({ currentItemId: state.projects.currentItemId }))(
        class extends React.Component<FavoritePanelProps> {
            render() {
                return <DataExplorer
                    id={FAVORITE_PANEL_ID}
                    onRowClick={this.props.onItemClick}
                    onRowDoubleClick={this.props.onItemDoubleClick}
                    onContextMenu={this.props.onContextMenu}
                    extractKey={(item: FavoritePanelItem) => item.uuid} />
                ;
            }

            componentWillReceiveProps({ match, currentItemId, onItemRouteChange }: FavoritePanelProps) {
                if (match.params.id !== currentItemId) {
                    onItemRouteChange(match.params.id);
                }
            }
        }
    )
);