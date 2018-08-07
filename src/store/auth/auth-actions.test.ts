// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import { authReducer, AuthState } from "./auth-reducer";
import { AuthAction, initAuth } from "./auth-action";
import {
    API_TOKEN_KEY,
    USER_EMAIL_KEY,
    USER_FIRST_NAME_KEY,
    USER_LAST_NAME_KEY,
    USER_OWNER_UUID_KEY,
    USER_UUID_KEY
} from "../../services/auth-service/auth-service";

import 'jest-localstorage-mock';
import { createServices } from "../../services/services";
import { configureStore, RootStore } from "../store";
import createBrowserHistory from "history/createBrowserHistory";

describe('auth-actions', () => {
    let reducer: (state: AuthState | undefined, action: AuthAction) => any;
    let store: RootStore;

    beforeEach(() => {
        store = configureStore(createBrowserHistory(), createServices("/arvados/v1"));
        localStorage.clear();
        reducer = authReducer(createServices("/arvados/v1"));
    });

    it('should initialise state with user and api token from local storage', () => {

        localStorage.setItem(API_TOKEN_KEY, "token");
        localStorage.setItem(USER_EMAIL_KEY, "test@test.com");
        localStorage.setItem(USER_FIRST_NAME_KEY, "John");
        localStorage.setItem(USER_LAST_NAME_KEY, "Doe");
        localStorage.setItem(USER_UUID_KEY, "uuid");
        localStorage.setItem(USER_OWNER_UUID_KEY, "ownerUuid");

        store.dispatch(initAuth());

        expect(store.getState().auth).toEqual({
            apiToken: "token",
            user: {
                email: "test@test.com",
                firstName: "John",
                lastName: "Doe",
                uuid: "uuid",
                ownerUuid: "ownerUuid"
            }
        });
    });

    // TODO: Add remaining action tests
    /*
    it('should fire external url to login', () => {
        const initialState = undefined;
        window.location.assign = jest.fn();
        reducer(initialState, authActions.LOGIN());
        expect(window.location.assign).toBeCalledWith(
            `/login?return_to=${window.location.protocol}//${window.location.host}/token`
        );
    });

    it('should fire external url to logout', () => {
        const initialState = undefined;
        window.location.assign = jest.fn();
        reducer(initialState, authActions.LOGOUT());
        expect(window.location.assign).toBeCalledWith(
            `/logout?return_to=${location.protocol}//${location.host}`
        );
    });
    */
});