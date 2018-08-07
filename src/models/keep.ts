// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { Resource } from "./resource";

export interface KeepResource extends Resource {
    serviceHost: string;
    servicePort: number;
    serviceSslFlag: boolean;
    serviceType: string;
}