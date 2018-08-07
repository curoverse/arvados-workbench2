// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { require } from './require';
import { maxLength } from './max-length';

export const TAG_KEY_VALIDATION = [require, maxLength(255)];
export const TAG_VALUE_VALIDATION = [require, maxLength(255)];