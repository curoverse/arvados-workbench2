// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { InjectedFormProps, formValueSelector } from 'redux-form';
import { Grid, withStyles, StyleRulesCallback, WithStyles, Button } from '@material-ui/core';
import { RootState } from '~/store/store';
import { 
    SEARCH_BAR_ADVANCE_FORM_NAME, 
    changeAdvanceFormProperty, 
    updateAdvanceFormProperties 
} from '~/store/search-bar/search-bar-actions';
import { PropertyValues } from '~/models/search-bar';
import { ArvadosTheme } from '~/common/custom-theme';
import { SearchBarKeyField, SearchBarValueField } from '~/views-components/form-fields/search-bar-form-fields';
import { Chips } from '~/components/chips/chips';

type CssRules = 'label' | 'button';

const styles: StyleRulesCallback<CssRules> = (theme: ArvadosTheme) => ({
    label: {
        color: theme.palette.grey["500"],
        fontSize: '0.8125rem',
        alignSelf: 'center'
    },
    button: {
        boxShadow: 'none'
    }
});

interface SearchBarAdvancedPropertiesViewDataProps {
    submitting: boolean;
    invalid: boolean;
    pristine: boolean;
    propertyValues: PropertyValues;
    fields: PropertyValues[];
}

interface SearchBarAdvancedPropertiesViewActionProps {
    setProps: () => void;
    addProp: (propertyValues: PropertyValues) => void;
    getAllFields: (propertyValues: PropertyValues[]) => PropertyValues[] | [];
}

type SearchBarAdvancedPropertiesViewProps = SearchBarAdvancedPropertiesViewDataProps 
    & SearchBarAdvancedPropertiesViewActionProps 
    & InjectedFormProps & WithStyles<CssRules>;

const selector = formValueSelector(SEARCH_BAR_ADVANCE_FORM_NAME);
const mapStateToProps = (state: RootState) => {
    return {
        propertyValues: selector(state, 'key', 'value')
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setProps: (propertyValues: PropertyValues[]) => {
        dispatch<any>(changeAdvanceFormProperty('properties', propertyValues));
    },
    addProp: (propertyValues: PropertyValues) => {
        dispatch<any>(updateAdvanceFormProperties(propertyValues));
        dispatch<any>(changeAdvanceFormProperty('key'));
        dispatch<any>(changeAdvanceFormProperty('value'));
    },
    getAllFields: (fields: any) => {
        return fields.getAll() || [];
    }
});

export const SearchBarAdvancedPropertiesView = connect(mapStateToProps, mapDispatchToProps)(
    withStyles(styles)(
        ({ classes, fields, propertyValues, setProps, addProp, getAllFields }: SearchBarAdvancedPropertiesViewProps) =>
            <Grid container item xs={12} spacing={16}>
                <Grid item xs={2} className={classes.label}>Properties</Grid>
                <Grid item xs={4}>
                    <SearchBarKeyField />
                </Grid>
                <Grid item xs={4}>
                    <SearchBarValueField />
                </Grid>
                <Grid container item xs={2} justify='flex-end' alignItems="center">
                    <Button className={classes.button} onClick={() => addProp(propertyValues)}
                        color="primary"
                        size='small'
                        variant="contained">
                        Add
                    </Button>
                </Grid>
                <Grid item xs={2} />
                <Grid container item xs={10} spacing={8}>
                    <Chips values={getAllFields(fields)} 
                        deletable
                        onChange={setProps} 
                        getLabel={(field: PropertyValues) => `${field.key}: ${field.value}`} />
                </Grid>
            </Grid>
    )
);