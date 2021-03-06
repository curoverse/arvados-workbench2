// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import React from 'react';
import { ProcessIcon } from 'components/icon/icon';
import { ProcessResource } from 'models/process';
import { formatDate } from 'common/formatters';
import { ResourceKind } from 'models/resource';
import { resourceLabel } from 'common/labels';
import { DetailsData } from "./details-data";
import { DetailsAttribute } from "components/details-attribute/details-attribute";
import { ResourceOwnerWithName } from '../data-explorer/renderers';

export class ProcessDetails extends DetailsData<ProcessResource> {

    getIcon(className?: string) {
        return <ProcessIcon className={className} />;
    }

    getDetails() {
        return <div>
            <DetailsAttribute label='Type' value={resourceLabel(ResourceKind.PROCESS)} />
            <DetailsAttribute label='Owner' linkToUuid={this.item.ownerUuid} value={this.item.ownerUuid}
                uuidEnhancer={(uuid: string) => <ResourceOwnerWithName uuid={uuid} />} />

            <DetailsAttribute label='Status' value={this.item.state} />
            <DetailsAttribute label='Last modified' value={formatDate(this.item.modifiedAt)} />

            <DetailsAttribute label='Started at' value={formatDate(this.item.createdAt)} />
            <DetailsAttribute label='Finished at' value={formatDate(this.item.expiresAt)} />

            <DetailsAttribute label='Outputs' value={this.item.outputPath} />
            <DetailsAttribute label='UUID' linkToUuid={this.item.uuid} value={this.item.uuid} />
            <DetailsAttribute label='Container UUID' value={this.item.containerUuid} />

            <DetailsAttribute label='Priority' value={this.item.priority} />
            <DetailsAttribute label='Runtime Constraints' value={JSON.stringify(this.item.runtimeConstraints)} />

            <DetailsAttribute label='Docker Image locator' linkToUuid={this.item.containerImage} value={this.item.containerImage} />
        </div>;
    }
}
