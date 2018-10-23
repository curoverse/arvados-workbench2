// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { isRequiredInput, IntArrayCommandInputParameter } from '~/models/workflow';
import { Field } from 'redux-form';
import { ERROR_MESSAGE } from '~/validators/require';
import { GenericInputProps, GenericInput } from '~/views/run-process-panel/inputs/generic-input';
import { ChipsInput } from '~/components/chips-input/chips-input';
import { identity } from 'lodash';
import { createSelector } from 'reselect';
import { IntInput } from '~/components/int-input/int-input';

export interface IntArrayInputProps {
    input: IntArrayCommandInputParameter;
}
export const IntArrayInput = ({ input }: IntArrayInputProps) =>
    <Field
        name={input.id}
        commandInput={input}
        component={IntArrayInputComponent}
        validate={validationSelector(input)} />;


const validationSelector = createSelector(
    isRequiredInput,
    isRequired => isRequired
        ? [required]
        : undefined
);

const required = (value: string[]) =>
    value.length > 0
        ? undefined
        : ERROR_MESSAGE;

const IntArrayInputComponent = (props: GenericInputProps) =>
    <GenericInput
        component={InputComponent}
        {...props} />;

class InputComponent extends React.PureComponent<GenericInputProps>{
    render() {
        return <ChipsInput
            deletable
            orderable
            value={this.props.input.value}
            onChange={this.handleChange}
            createNewValue={value => parseInt(value, 10)}
            inputComponent={IntInput}
            inputProps={{
                error: this.props.meta.error,
            }} />;
    }

    handleChange = (values: {}[]) => {
        const { input, meta } = this.props;
        if (!meta.touched) {
            input.onBlur(values);
        }
        input.onChange(values);
    }
}