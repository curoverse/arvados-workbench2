// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

export const escapeRegExp = (st: string) =>
    st.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
