// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from "react";
import { Toolbar, IconButton, Tooltip, Grid } from "@material-ui/core";
import { DetailsIcon } from "~/components/icon/icon";
import { Breadcrumbs } from "~/views-components/breadcrumbs/breadcrumbs";
import { detailsPanelActions } from "~/store/details-panel/details-panel-action";
import { connect } from 'react-redux';

interface MainContentBarProps {
    onDetailsPanelToggle: () => void;
}

export const MainContentBar = connect(undefined, {
    onDetailsPanelToggle: detailsPanelActions.TOGGLE_DETAILS_PANEL
})((props: MainContentBarProps) =>
    <Toolbar>
        <Grid container>
            <Grid container item xs alignItems="center">
                <Breadcrumbs />
            </Grid>
            <Grid item>
                <IconButton color="inherit" onClick={props.onDetailsPanelToggle}>
                    <Tooltip title="Additional Info">
                        <DetailsIcon />
                    </Tooltip>
                </IconButton>
            </Grid>
        </Grid>
    </Toolbar>);