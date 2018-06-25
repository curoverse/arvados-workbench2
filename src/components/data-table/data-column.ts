// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { DataTableFilterItem } from "../data-table-filters/data-table-filters";

export interface DataColumn<T> {
    name: string;
    selected: boolean;
    configurable?: boolean;
    key?: React.Key;
    sortDirection?: SortDirection;
    filters?: DataTableFilterItem[];
    render: (item: T) => React.ReactElement<void>;
    renderHeader?: () => React.ReactElement<void> | null;
}

export type SortDirection = "asc" | "desc" | "none";

export const isColumnConfigurable = <T>(column: DataColumn<T>) => {
    return column.configurable === undefined || column.configurable;
};

export const toggleSortDirection = <T>(column: DataColumn<T>): DataColumn<T> => {
    return column.sortDirection
        ? column.sortDirection === "asc"
            ? { ...column, sortDirection: "desc" }
            : { ...column, sortDirection: "asc" }
        : column;
};

export const resetSortDirection = <T>(column: DataColumn<T>): DataColumn<T> => {
    return column.sortDirection ? { ...column, sortDirection: "none" } : column;
};
