// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { ContextMenuActionSet } from "../context-menu-action-set";
import { ToggleFavoriteAction } from "../actions/favorite-action";
import { toggleFavorite } from "~/store/favorites/favorites-actions";
import {
    RenameIcon, ShareIcon, MoveToIcon, CopyIcon, DetailsIcon, ProvenanceGraphIcon,
    AdvancedIcon, RemoveIcon, ReRunProcessIcon, LogIcon
} from "~/components/icon/icon";
import { favoritePanelActions } from "~/store/favorite-panel/favorite-panel-action";

export const processActionSet: ContextMenuActionSet = [[
    {
        icon: RenameIcon,
        name: "Edit process",
        execute: (dispatch, resource) => {
            // add code
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
                dispatch<any>(favoritePanelActions.REQUEST_ITEMS());
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
        icon: ReRunProcessIcon,
        name: "Re-run process",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        name: "Inputs",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        name: "Outputs",
        execute: (dispatch, resource) => {
            // add code
        }
    },
    {
        name: "Command",
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
        icon: LogIcon,
        name: "Log",
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