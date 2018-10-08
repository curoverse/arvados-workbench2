// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from "react";
import { mount, configure } from "enzyme";
import { SearchBarView, DEFAULT_SEARCH_DEBOUNCE } from "./search-bar-view";

import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe("<SearchBar />", () => {

    jest.useFakeTimers();

    let onSearch: () => void;

    beforeEach(() => {
        onSearch = jest.fn();
    });

    describe("on submit", () => {
        it("calls onSearch with initial value passed via props", () => {
            const searchBar = mount(<SearchBarView value="initial value" onSearch={onSearch} currentView='' open={true} onSetView={jest.fn()} openView={jest.fn()} closeView={jest.fn()} />);
            searchBar.find("form").simulate("submit");
            expect(onSearch).toBeCalledWith("initial value");
        });

        it("calls onSearch with current value", () => {
            const searchBar = mount(<SearchBarView value="" onSearch={onSearch} currentView='' open={true} onSetView={jest.fn()} openView={jest.fn()} closeView={jest.fn()} />);
            searchBar.find("input").simulate("change", { target: { value: "current value" } });
            searchBar.find("form").simulate("submit");
            expect(onSearch).toBeCalledWith("current value");
        });

        it("calls onSearch with new value passed via props", () => {
            const searchBar = mount(<SearchBarView value="" onSearch={onSearch} currentView='' open={true} onSetView={jest.fn()} openView={jest.fn()} closeView={jest.fn()} />);
            searchBar.find("input").simulate("change", { target: { value: "current value" } });
            searchBar.setProps({ value: "new value" });
            searchBar.find("form").simulate("submit");
            expect(onSearch).toBeCalledWith("new value");
        });

        it("cancels timeout set on input value change", () => {
            const searchBar = mount(<SearchBarView value="" onSearch={onSearch} debounce={1000} currentView='' open={true} onSetView={jest.fn()} openView={jest.fn()} closeView={jest.fn()} />);
            searchBar.find("input").simulate("change", { target: { value: "current value" } });
            searchBar.find("form").simulate("submit");
            jest.advanceTimersByTime(1000);
            expect(onSearch).toHaveBeenCalledTimes(1);
            expect(onSearch).toBeCalledWith("current value");
        });

    });

    describe("on input value change", () => {
        it("calls onSearch after default timeout", () => {
            const searchBar = mount(<SearchBarView value="" onSearch={onSearch} currentView='' open={true} onSetView={jest.fn()} openView={jest.fn()} closeView={jest.fn()} />);
            searchBar.find("input").simulate("change", { target: { value: "current value" } });
            expect(onSearch).not.toBeCalled();
            jest.advanceTimersByTime(DEFAULT_SEARCH_DEBOUNCE);
            expect(onSearch).toBeCalledWith("current value");
        });

        it("calls onSearch after the time specified in props has passed", () => {
            const searchBar = mount(<SearchBarView value="" onSearch={onSearch} debounce={2000} currentView='' open={true} onSetView={jest.fn()} openView={jest.fn()} closeView={jest.fn()} />);
            searchBar.find("input").simulate("change", { target: { value: "current value" } });
            jest.advanceTimersByTime(1000);
            expect(onSearch).not.toBeCalled();
            jest.advanceTimersByTime(1000);
            expect(onSearch).toBeCalledWith("current value");
        });

        it("calls onSearch only once after no change happened during the specified time", () => {
            const searchBar = mount(<SearchBarView value="" onSearch={onSearch} debounce={1000} currentView='' open={true} onSetView={jest.fn()} openView={jest.fn()} closeView={jest.fn()} />);
            searchBar.find("input").simulate("change", { target: { value: "current value" } });
            jest.advanceTimersByTime(500);
            searchBar.find("input").simulate("change", { target: { value: "changed value" } });
            jest.advanceTimersByTime(1000);
            expect(onSearch).toHaveBeenCalledTimes(1);
        });

        it("calls onSearch again after the specified time has passed since previous call", () => {
            const searchBar = mount(<SearchBarView value="" onSearch={onSearch} debounce={1000} currentView='' open={true} onSetView={jest.fn()} openView={jest.fn()} closeView={jest.fn()} />);
            searchBar.find("input").simulate("change", { target: { value: "current value" } });
            jest.advanceTimersByTime(500);
            searchBar.find("input").simulate("change", { target: { value: "intermediate value" } });
            jest.advanceTimersByTime(1000);
            expect(onSearch).toBeCalledWith("intermediate value");
            searchBar.find("input").simulate("change", { target: { value: "latest value" } });
            jest.advanceTimersByTime(1000);
            expect(onSearch).toBeCalledWith("latest value");
            expect(onSearch).toHaveBeenCalledTimes(2);

        });
    });
});