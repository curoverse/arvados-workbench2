// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { ContextMenuActionSet } from "../context-menu-action-set";
import { ToggleFavoriteAction } from "../actions/favorite-action";
import { toggleFavorite } from "../../../store/favorites/favorites-actions";
import { dataExplorerActions } from "../../../store/data-explorer/data-explorer-action";
import { FAVORITE_PANEL_ID } from "../../../views/favorite-panel/favorite-panel";
import { RenameIcon, ShareIcon, MoveToIcon, CopyIcon, DetailsIcon, ProvenanceGraphIcon, AdvancedIcon, RemoveIcon } from "../../../components/icon/icon";
import { collectionUpdatorActions } from "../../../store/collections/updator/collection-updator-action";

export const collectionActionSet: ContextMenuActionSet = [[
    {
        icon: RenameIcon,
        name: "Edit collection",
        execute: (dispatch, resource) => {
            dispatch(collectionUpdatorActions.OPEN_COLLECTION_UPDATOR({ ownerUuid: resource.uuid }));
        }
    },
    {
        icon: ShareIcon,
        name: "Share",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        icon: MoveToIcon,
        name: "Move to",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        component: ToggleFavoriteAction,
        execute: (dispatch, resource) => {
            dispatch<any>(toggleFavorite(resource)).then(() => {
                dispatch<any>(dataExplorerActions.REQUEST_ITEMS({ id: FAVORITE_PANEL_ID }));
            });
        }
    },
    {
        icon: CopyIcon,
        name: "Copy to project",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        icon: DetailsIcon,
        name: "View details",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        icon: ProvenanceGraphIcon,
        name: "Provenance graph",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        icon: AdvancedIcon,
        name: "Advanced",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        icon: RemoveIcon,
        name: "Remove",
        execute: (dispatch, resource) => {
            // add code
        }
    }
]];
