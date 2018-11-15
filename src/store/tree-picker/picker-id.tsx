// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';

export const pickerId =
    (id: string) =>
        <P extends { pickerId: string }>(Component: React.ComponentType<P>) =>
            (props: P) =>
                <Component {...props} pickerId={id} />;
                