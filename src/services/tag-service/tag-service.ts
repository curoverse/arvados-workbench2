// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { LinkService } from "../link-service/link-service";
import { LinkClass } from "../../models/link";
import { FilterBuilder } from "../../common/api/filter-builder";
import { TagTailType, TagResource } from "../../models/tag";
import { OrderBuilder } from "../../common/api/order-builder";

export class TagService {

    constructor(private linkService: LinkService) { }

    create(uuid: string, data: { key: string; value: string } ) {
        return this.linkService
            .create({
                headUuid: uuid,
                tailUuid: TagTailType.COLLECTION,
                linkClass: LinkClass.TAG,
                name: '',
                properties: data
            })
            .then(tag => tag as TagResource );
    }

    list(uuid: string) {
        const filters = FilterBuilder
            .create()
            .addEqual("headUuid", uuid)
            .addEqual("tailUuid", TagTailType.COLLECTION)
            .addEqual("linkClass", LinkClass.TAG);

        const order = OrderBuilder
            .create<TagResource>()
            .addAsc('createdAt');

        return this.linkService
            .list({ filters, order })
            .then(results => {
                return results.items.map((tag => tag as TagResource ));
            });
    }

}