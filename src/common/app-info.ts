// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

export const getBuildInfo = (): string => {
    const getBuildNumber = "BN-" + (process.env.REACT_APP_BUILD_NUMBER || "dev");
    const getGitCommit = "GIT-" + (process.env.REACT_APP_GIT_COMMIT || "latest").substr(0, 7);
    return getBuildNumber + " / " + getGitCommit;
};