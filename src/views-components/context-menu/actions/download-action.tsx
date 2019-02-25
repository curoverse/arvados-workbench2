// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from "react";
import { ListItemIcon, ListItemText, ListItem } from "@material-ui/core";
import { DownloadIcon } from "../../../components/icon/icon";
import * as JSZip from "jszip";
import * as FileSaver from 'file-saver';
import axios from 'axios';

export const DownloadAction = (props: { href?: any, download?: any, onClick?: () => void, kind?: string, currentCollectionUuid?: string; }) => {
    const downloadProps = props.download ? { download: props.download } : {};

    const createZip = (fileUrls: string[], download: string[]) => {
        const zip = new JSZip();
        let id = 1;
        fileUrls.map((href: string) => {
            axios.get(href).then(response => response).then(({ data }: any) => {
                const splittedByDot = href.split('.');
                if (splittedByDot[splittedByDot.length - 1] !== 'json') {
                    if (fileUrls.length === id) {
                        zip.file(download[id-1], data);
                        zip.generateAsync({ type: 'blob' }).then((content) => {
                            FileSaver.saveAs(content, `download-${props.currentCollectionUuid}.zip`);
                        });
                    } else {
                        zip.file(download[id-1], data);
                        zip.generateAsync({ type: 'blob' });
                    }
                } else {
                    zip.file(download[id-1], JSON.stringify(data));
                    zip.generateAsync({ type: 'blob' });
                }
                id++;
            });
        });
    };

    return props.href || props.kind === 'files'
        ? <a
            style={{ textDecoration: 'none' }}
            href={props.kind === 'files' ? null : props.href}
            onClick={props.onClick}
            {...downloadProps}>
            <ListItem button onClick={() => props.kind === 'files' ? createZip(props.href, props.download) : undefined}>
                {props.kind !== 'files' ?
                    <ListItemIcon>
                        <DownloadIcon />
                    </ListItemIcon> : <span />}
                <ListItemText>
                    {props.kind === 'files' ? 'Download selected' : 'Download'}
                </ListItemText>
            </ListItem>
        </a>
        : null;
};