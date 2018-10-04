// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { isRequiredInput, StringCommandInputParameter } from '~/models/workflow';
import { Field } from 'redux-form';
import { require } from '~/validators/require';
import { GenericInputProps, GenericInput } from '~/views/run-process-panel/inputs/generic-input';
import { Input as MaterialInput } from '@material-ui/core';

export interface StringInputProps {
    input: StringCommandInputParameter;
}
export const StringInput = ({ input }: StringInputProps) =>
    <Field
        name={input.id}
        commandInput={input}
        component={StringInputComponent}
        validate={[
            isRequiredInput(input)
                ? require
                : () => undefined,
        ]} />;

const StringInputComponent = (props: GenericInputProps) =>
    <GenericInput
        component={Input}
        {...props} />;

const Input = (props: GenericInputProps) =>
    <MaterialInput fullWidth {...props.input} error={props.meta.touched && !!props.meta.error} />;