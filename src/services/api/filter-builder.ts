// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

export function joinFilters(filters0?: string, filters1?: string) {
    return [filters0, filters1].filter(s => s).join(",");
}

export class FilterBuilder {
    constructor(private filters = "") { }

    public addEqual(field: string, value?: string | boolean | null, resourcePrefix?: string) {
        return this.addCondition(field, "=", value, "", "", resourcePrefix);
    }

    public addDistinct(field: string, value?: string | boolean | null, resourcePrefix?: string){
        return this.addCondition(field, "!=", value, "", "", resourcePrefix);
    }

    public addLike(field: string, value?: string, resourcePrefix?: string) {
        return this.addCondition(field, "like", value, "%", "%", resourcePrefix);
    }

    public addILike(field: string, value?: string, resourcePrefix?: string) {
        return this.addCondition(field, "ilike", value, "%", "%", resourcePrefix);
    }

    public addIsA(field: string, value?: string | string[], resourcePrefix?: string) {
        return this.addCondition(field, "is_a", value, "", "", resourcePrefix);
    }

    public addIn(field: string, value?: string | string[], resourcePrefix?: string) {
        return this.addCondition(field, "in", value, "", "", resourcePrefix);
    }

    public addNotIn(field: string, value?: string | string[], resourcePrefix?: string) {
        return this.addCondition(field, "not in", value, "", "", resourcePrefix);
    }

    public addGt(field: string, value?: string, resourcePrefix?: string) {
        return this.addCondition(field, ">", value, "", "", resourcePrefix);
    }

    public addGte(field: string, value?: string, resourcePrefix?: string) {
        return this.addCondition(field, ">=", value, "", "", resourcePrefix);
    }

    public addLt(field: string, value?: string, resourcePrefix?: string) {
        return this.addCondition(field, "<", value, "", "", resourcePrefix);
    }

    public addLte(field: string, value?: string, resourcePrefix?: string) {
        return this.addCondition(field, "<=", value, "", "", resourcePrefix);
    }

    public addExists(value?: string, resourcePrefix?: string) {
        return this.addCondition("properties", "exists", value, "", "", resourcePrefix);
    }

    public addFullTextSearch(value: string) {
        const terms = value.trim().split(/(\s+)/);
        terms.forEach(term => {
            if (term !== " ") {
                this.addCondition("any", "ilike", term, "%", "%");
            }
        });
        return this;
    }

    public getFilters() {
        return this.filters;
    }

    private addCondition(field: string, cond: string, value?: string | string[] | boolean | null, prefix: string = "", postfix: string = "", resourcePrefix?: string) {
        if (value !== undefined) {
            if (typeof value === "string") {
                value = `"${prefix}${value}${postfix}"`;
            } else if (Array.isArray(value)) {
                value = `["${value.join(`","`)}"]`;
            } else if (value !== null) {
                value = value ? "true" : "false";
            }

            const resPrefix = resourcePrefix
                ? resourcePrefix + "."
                : "";

            this.filters += `${this.filters ? "," : ""}["${resPrefix}${field}","${cond}",${value}]`;
        }
        return this;
    }
}
