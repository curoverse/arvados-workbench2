// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

export class WebDAV {

    defaults: WebDAVDefaults = {
        baseURL: '',
        headers: {},
    };

    constructor(config?: Partial<WebDAVDefaults>, private createRequest = () => new XMLHttpRequest()) {
        if (config) {
            this.defaults = { ...this.defaults, ...config };
        }
    }

    propfind = (url: string, config: WebDAVRequestConfig = {}) =>
        this.request({
            ...config, url,
            method: 'PROPFIND'
        })

    put = (url: string, data?: any, config: WebDAVRequestConfig = {}) =>
        this.request({
            ...config, url,
            method: 'PUT',
            data,
        })

    copy = (url: string, destination: string, config: WebDAVRequestConfig = {}) =>
        this.request({
            ...config, url,
            method: 'COPY',
            headers: { ...config.headers, Destination: this.defaults.baseURL + destination }
        })

    move = (url: string, destination: string, config: WebDAVRequestConfig = {}) =>
        this.request({
            ...config, url,
            method: 'MOVE',
            headers: { ...config.headers, Destination: this.defaults.baseURL + destination }
        })

    delete = (url: string, config: WebDAVRequestConfig = {}) =>
        this.request({
            ...config, url,
            method: 'DELETE'
        })

    private request = (config: RequestConfig) => {
        return new Promise<XMLHttpRequest>((resolve, reject) => {
            const r = this.createRequest();
            r.open(config.method, this.defaults.baseURL + config.url);

            const headers = { ...this.defaults.headers, ...config.headers };
            Object
                .keys(headers)
                .forEach(key => r.setRequestHeader(key, headers[key]));

            if (config.onProgress) {
                r.addEventListener('progress', config.onProgress);
            }

            r.addEventListener('load', () => resolve(r));
            r.addEventListener('error', () => reject(r));

            r.send(config.data);
        });
    }
}
export interface WebDAVRequestConfig {
    headers?: {
        [key: string]: string;
    };
    onProgress?: (event: ProgressEvent) => void;
}

interface WebDAVDefaults {
    baseURL: string;
    headers: { [key: string]: string };
}

interface RequestConfig {
    method: string;
    url: string;
    headers?: { [key: string]: string };
    data?: any;
    onProgress?: (event: ProgressEvent) => void;
}