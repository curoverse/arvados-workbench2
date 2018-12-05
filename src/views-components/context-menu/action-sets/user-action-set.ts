// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { ContextMenuActionSet } from "~/views-components/context-menu/context-menu-action-set";
import { AdvancedIcon, ProjectIcon, AttributesIcon, ShareIcon } from "~/components/icon/icon";
import { openAdvancedTabDialog } from '~/store/advanced-tab/advanced-tab';
import { openUserAttributes } from "~/store/users/users-actions";

export const userActionSet: ContextMenuActionSet = [[{
    name: "Attributes",
    icon: AttributesIcon,
    execute: (dispatch, { uuid }) => {
        dispatch<any>(openUserAttributes(uuid));
    }
}, {
    name: "Project",
    icon: ProjectIcon,
    execute: (dispatch, { uuid }) => {
        dispatch<any>(openAdvancedTabDialog(uuid));
    }
}, {
    name: "Advanced",
    icon: AdvancedIcon,
    execute: (dispatch, { uuid }) => {
        dispatch<any>(openAdvancedTabDialog(uuid));
    }
},
{
    name: "Manage",
    icon: ShareIcon,
    execute: (dispatch, { uuid }) => {
        dispatch<any>(openAdvancedTabDialog(uuid));
    }
}]];