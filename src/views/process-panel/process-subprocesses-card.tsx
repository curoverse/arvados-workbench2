// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import {
    StyleRulesCallback, WithStyles, withStyles, Card,
    CardHeader, IconButton, CardContent, Typography, Tooltip
} from '@material-ui/core';
import { ArvadosTheme } from '~/common/custom-theme';
import { MoreOptionsIcon } from '~/components/icon/icon';
import { DetailsAttribute } from '~/components/details-attribute/details-attribute';
import { Process, getProcessStatus, getProcessRuntime } from '~/store/processes/process';
import { formatTime } from '~/common/formatters';
import { getProcessStatusColor } from '~/store/processes/process';

export type CssRules = 'label' | 'value' | 'title' | 'content' | 'action' | 'options' | 'status' | 'rightSideHeader' | 'titleHeader'| 'header';

const styles: StyleRulesCallback<CssRules> = (theme: ArvadosTheme) => ({
    label: {
        fontSize: '0.875rem',
    },
    value: {
        textTransform: 'none',
        fontSize: '0.875rem',
    },
    title: {
        overflow: 'hidden'
    },
    content: {
        paddingTop: theme.spacing.unit * 0.5,
        '&:last-child': {
            paddingBottom: 0
        }
    },
    action: {
        marginTop: 0
    },
    options: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
        color: theme.palette.common.white,
    },
    status: {
        paddingTop: theme.spacing.unit * 0.5,
        color: theme.palette.common.white,
    },
    rightSideHeader: {
        display: 'flex'
    },
    titleHeader: {
        color: theme.palette.common.white,
        fontWeight: 600
    },
    header: {
        paddingTop: 0,
        paddingBottom: 0,
    },
});

export interface SubprocessItemProps {
    title: string;
    status: string;
    runtime?: string;
}

export interface ProcessSubprocessesCardDataProps {
    onContextMenu: (event: React.MouseEvent<HTMLElement>) => void;
    subprocess: Process;
}

type ProcessSubprocessesCardProps = ProcessSubprocessesCardDataProps & WithStyles<CssRules>;

export const ProcessSubprocessesCard = withStyles(styles, { withTheme: true })(
    ({ classes, onContextMenu, subprocess, theme }: ProcessSubprocessesCardProps) => {
        return <Card>
            <CardHeader
                className={classes.header}
                style={{ backgroundColor: getProcessStatusColor(getProcessStatus(subprocess), theme as ArvadosTheme) }}
                classes={{ content: classes.title, action: classes.action }}
                action={
                    <div className={classes.rightSideHeader}>
                        <Typography noWrap variant="body2" className={classes.status}>
                            {getProcessStatus(subprocess)}
                        </Typography>
                        <IconButton
                            className={classes.options}
                            aria-label="More options"
                            onClick={onContextMenu}>
                            <MoreOptionsIcon />
                        </IconButton>
                    </div>
                }
                title={
                    <Tooltip title={subprocess.containerRequest.name}>
                        <Typography noWrap variant="body2" className={classes.titleHeader}>
                            {subprocess.containerRequest.name}
                        </Typography>
                    </Tooltip>
                } />
            <CardContent className={classes.content}>
                <DetailsAttribute classLabel={classes.label} classValue={classes.value}
                    label="Runtime" value={formatTime(getProcessRuntime(subprocess))} />
            </CardContent>
        </Card>;
    });