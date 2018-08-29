// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from "react";
import { FormDialog } from '~/components/form-dialog/form-dialog';
import { CollectionNameField, CollectionDescriptionField, CollectionProjectPickerField } from '~/views-components/form-fields/collection-form-fields';
import { WithDialogProps } from '~/store/dialog/with-dialog';
import { InjectedFormProps } from 'redux-form';
import { CollectionPartialCopyFormData } from '~/store/collections/collection-partial-copy-actions';

type DialogCollectionPartialCopyProps = WithDialogProps<string> & InjectedFormProps<CollectionPartialCopyFormData>;

export const DialogCollectionPartialCopy = (props: DialogCollectionPartialCopyProps) =>
    <FormDialog
        dialogTitle='Create a collection'
        formFields={CollectionPartialCopyFields}
        submitLabel='Create a collection'
        {...props}
    />;

export const CollectionPartialCopyFields = () => <div style={{ display: 'flex' }}>
    <div>
        <CollectionNameField />
        <CollectionDescriptionField />
    </div>
    <CollectionProjectPickerField />
</div>;