// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { WebDAV } from "./webdav";

describe('WebDAV', () => {
    it('makes use of provided config', async () => {
        const { open, load, setRequestHeader, createRequest } = mockCreateRequest();
        const webdav = new WebDAV({ baseURL: 'http://foo.com/', headers: { Authorization: 'Basic' } }, createRequest);
        const promise = webdav.propfind('foo');
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('PROPFIND', 'http://foo.com/foo');
        expect(setRequestHeader).toHaveBeenCalledWith('Authorization', 'Basic');
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });

    it('allows to modify defaults after instantiation', async () => {
        const { open, load, setRequestHeader, createRequest } = mockCreateRequest();
        const webdav = new WebDAV(undefined, createRequest);
        webdav.defaults.baseURL = 'http://foo.com/';
        webdav.defaults.headers = { Authorization: 'Basic' };
        const promise = webdav.propfind('foo');
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('PROPFIND', 'http://foo.com/foo');
        expect(setRequestHeader).toHaveBeenCalledWith('Authorization', 'Basic');
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });

    it('PROPFIND', async () => {
        const { open, load, createRequest } = mockCreateRequest();
        const webdav = new WebDAV(undefined, createRequest);
        const promise = webdav.propfind('foo');
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('PROPFIND', 'foo');
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });

    it('PUT', async () => {
        const { open, send, load, progress, createRequest } = mockCreateRequest();
        const onProgress = jest.fn();
        const webdav = new WebDAV(undefined, createRequest);
        const promise = webdav.put('foo', 'Test data', { onProgress });
        progress();
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('PUT', 'foo');
        expect(send).toHaveBeenCalledWith('Test data');
        expect(onProgress).toHaveBeenCalled();
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });

    it('COPY', async () => {
        const { open, setRequestHeader, load, createRequest } = mockCreateRequest();
        const webdav = new WebDAV(undefined, createRequest);
        const promise = webdav.copy('foo', 'foo-copy');
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('COPY', 'foo');
        expect(setRequestHeader).toHaveBeenCalledWith('Destination', 'foo-copy');
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });

    it('COPY - adds baseURL to Destination header', async () => {
        const { open, setRequestHeader, load, createRequest } = mockCreateRequest();
        const webdav = new WebDAV(undefined, createRequest);
        webdav.defaults.baseURL = 'base/';
        const promise = webdav.copy('foo', 'foo-copy');
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('COPY', 'base/foo');
        expect(setRequestHeader).toHaveBeenCalledWith('Destination', 'base/foo-copy');
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });

    it('MOVE', async () => {
        const { open, setRequestHeader, load, createRequest } = mockCreateRequest();
        const webdav = new WebDAV(undefined, createRequest);
        const promise = webdav.move('foo', 'foo-copy');
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('MOVE', 'foo');
        expect(setRequestHeader).toHaveBeenCalledWith('Destination', 'foo-copy');
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });

    it('MOVE - adds baseURL to Destination header', async () => {
        const { open, setRequestHeader, load, createRequest } = mockCreateRequest();
        const webdav = new WebDAV(undefined, createRequest);
        webdav.defaults.baseURL = 'base/';
        const promise = webdav.move('foo', 'foo-moved');
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('MOVE', 'base/foo');
        expect(setRequestHeader).toHaveBeenCalledWith('Destination', 'base/foo-moved');
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });

    it('DELETE', async () => {
        const { open, load, createRequest } = mockCreateRequest();
        const webdav = new WebDAV(undefined, createRequest);
        const promise = webdav.delete('foo');
        load();
        const request = await promise;
        expect(open).toHaveBeenCalledWith('DELETE', 'foo');
        expect(request).toBeInstanceOf(XMLHttpRequest);
    });
});

const mockCreateRequest = () => {
    const send = jest.fn();
    const open = jest.fn();
    const setRequestHeader = jest.fn();
    const request = new XMLHttpRequest();
    request.send = send;
    request.open = open;
    request.setRequestHeader = setRequestHeader;
    const load = () => request.dispatchEvent(new Event('load'));
    const progress = () => request.dispatchEvent(new Event('progress'));
    return {
        send,
        open,
        load,
        progress,
        setRequestHeader,
        createRequest: () => request
    };
};