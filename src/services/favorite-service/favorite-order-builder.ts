// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { LinkResource } from "../../models/link";
import { GroupContentsResource, GroupContentsResourcePrefix } from "../groups-service/groups-service";
import { OrderBuilder } from "../../common/api/order-builder";

export class FavoriteOrderBuilder {

    static create(
        linkOrder = OrderBuilder.create<LinkResource>(), 
        contentOrder = OrderBuilder.create<GroupContentsResource>()) {
        return new FavoriteOrderBuilder(linkOrder, contentOrder);
    }

    private constructor(
        private linkOrder: OrderBuilder<LinkResource>,
        private contentOrder: OrderBuilder<GroupContentsResource>
    ) { }

    addAsc(attribute: "name") {
        const linkOrder = this.linkOrder.addAsc(attribute);
        const contentOrder = this.contentOrder
            .concat(OrderBuilder.create<GroupContentsResource>(GroupContentsResourcePrefix.Collection).addAsc(attribute))
            .concat(OrderBuilder.create<GroupContentsResource>(GroupContentsResourcePrefix.Process).addAsc(attribute))
            .concat(OrderBuilder.create<GroupContentsResource>(GroupContentsResourcePrefix.Project).addAsc(attribute));
        return FavoriteOrderBuilder.create(linkOrder, contentOrder);
    }

    addDesc(attribute: "name") {
        const linkOrder = this.linkOrder.addDesc(attribute);
        const contentOrder = this.contentOrder
            .concat(OrderBuilder.create<GroupContentsResource>(GroupContentsResourcePrefix.Collection).addDesc(attribute))
            .concat(OrderBuilder.create<GroupContentsResource>(GroupContentsResourcePrefix.Process).addDesc(attribute))
            .concat(OrderBuilder.create<GroupContentsResource>(GroupContentsResourcePrefix.Project).addDesc(attribute));
        return FavoriteOrderBuilder.create(linkOrder, contentOrder);
    }

    getLinkOrder() {
        return this.linkOrder;
    }

    getContentOrder() {
        return this.contentOrder;
    }

}