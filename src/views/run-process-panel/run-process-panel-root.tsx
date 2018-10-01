// Copyright (C) The Arvados Authors. All rights reserved.
//
// SPDX-License-Identifier: AGPL-3.0

import * as React from 'react';
import { Stepper, Step, StepLabel, StepContent, Button } from '@material-ui/core';

export interface RunProcessPanelRootDataProps {
    currentStep: number;
}

export interface RunProcessPanelRootActionProps {
    onSetStep: (step: number) => void;
}

type RunProcessPanelRootProps = RunProcessPanelRootDataProps & RunProcessPanelRootActionProps;

export const RunProcessPanelRoot = ({ currentStep, onSetStep, ...props }: RunProcessPanelRootProps) =>
    <Stepper activeStep={currentStep} orientation="vertical" elevation={2}>
        <Step>
            <StepLabel>Choose a workflow</StepLabel>
            <StepContent>
                <Button variant="contained" color="primary" onClick={() => onSetStep(1)}>
                    Next
                </Button>
            </StepContent>
        </Step>
        <Step>
            <StepLabel>Select inputs</StepLabel>
            <StepContent>
                <Button color="primary" onClick={() => onSetStep(0)}>
                    Back
                </Button>
                <Button variant="contained" color="primary">
                    Run Process
                </Button>
            </StepContent>
        </Step>
    </Stepper>;