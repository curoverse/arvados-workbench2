// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { memoize } from 'lodash/fp';
import { BooleanCommandInputParameter } from '~/models/workflow';
import { Field } from 'redux-form';
import { Switch } from '@material-ui/core';
import { GenericInputProps, GenericInput } from './generic-input';

export interface BooleanInputProps {
    input: BooleanCommandInputParameter;
}
export const BooleanInput = ({ input }: BooleanInputProps) =>
    <Field
        name={input.id}
        commandInput={input}
        component={BooleanInputComponent}
        normalize={normalize}
    />;

const normalize = (_: any, prevValue: boolean) => !prevValue;

const BooleanInputComponent = (props: GenericInputProps) =>
    <GenericInput
        component={Input}
        {...props} />;

const Input = (props: GenericInputProps) =>
    <Switch
        color='primary'
        checked={props.input.value}
        onChange={handleChange(props.input.onChange, props.input.value)}
        disabled={props.commandInput.disabled} />;

const handleChange = memoize(
    (onChange: (value: string) => void, value: string) => () => onChange(value)
);
