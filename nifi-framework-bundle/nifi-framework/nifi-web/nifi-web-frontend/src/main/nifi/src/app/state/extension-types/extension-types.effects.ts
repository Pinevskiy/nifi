/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ExtensionTypesActions from './extension-types.actions';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { ExtensionTypesService } from '../../service/extension-types.service';
import * as ErrorActions from '../error/error.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ExtensionTypesEffects {
    constructor(
        private actions$: Actions,
        private extensionTypesService: ExtensionTypesService
    ) {}

    loadExtensionTypesForCanvas$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ExtensionTypesActions.loadExtensionTypesForCanvas),
            switchMap(() =>
                combineLatest([
                    this.extensionTypesService.getProcessorTypes(),
                    this.extensionTypesService.getControllerServiceTypes(),
                    this.extensionTypesService.getPrioritizers()
                ]).pipe(
                    map(([processorTypes, controllerServiceTypes, prioritizerTypes]) =>
                        ExtensionTypesActions.loadExtensionTypesForCanvasSuccess({
                            response: {
                                processorTypes: processorTypes.processorTypes,
                                controllerServiceTypes: controllerServiceTypes.controllerServiceTypes,
                                prioritizers: prioritizerTypes.prioritizerTypes
                            }
                        })
                    ),
                    catchError((error) => of(ExtensionTypesActions.extensionTypesApiError({ error })))
                )
            )
        )
    );

    loadExtensionTypesForSettings$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ExtensionTypesActions.loadExtensionTypesForSettings),
            switchMap(() =>
                combineLatest([
                    this.extensionTypesService.getControllerServiceTypes(),
                    this.extensionTypesService.getReportingTaskTypes(),
                    this.extensionTypesService.getRegistryClientTypes(),
                    this.extensionTypesService.getParameterProviderTypes(),
                    this.extensionTypesService.getFlowAnalysisRuleTypes()
                ]).pipe(
                    map(
                        ([
                            controllerServiceTypes,
                            reportingTaskTypes,
                            registryClientTypes,
                            parameterProviderTypes,
                            flowAnalysisRuleTypes
                        ]) =>
                            ExtensionTypesActions.loadExtensionTypesForSettingsSuccess({
                                response: {
                                    controllerServiceTypes: controllerServiceTypes.controllerServiceTypes,
                                    reportingTaskTypes: reportingTaskTypes.reportingTaskTypes,
                                    registryClientTypes: registryClientTypes.flowRegistryClientTypes,
                                    parameterProviderTypes: parameterProviderTypes.parameterProviderTypes,
                                    flowAnalysisRuleTypes: flowAnalysisRuleTypes.flowAnalysisRuleTypes
                                }
                            })
                    ),
                    catchError((error) => of(ExtensionTypesActions.extensionTypesApiError({ error })))
                )
            )
        )
    );

    loadExtensionTypesForPolicies$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ExtensionTypesActions.loadExtensionTypesForPolicies),
            switchMap(() =>
                combineLatest([
                    this.extensionTypesService.getProcessorTypes(),
                    this.extensionTypesService.getControllerServiceTypes(),
                    this.extensionTypesService.getReportingTaskTypes(),
                    this.extensionTypesService.getParameterProviderTypes(),
                    this.extensionTypesService.getFlowAnalysisRuleTypes()
                ]).pipe(
                    map(
                        ([
                            processorTypes,
                            controllerServiceTypes,
                            reportingTaskTypes,
                            parameterProviderTypes,
                            flowAnalysisRuleTypes
                        ]) =>
                            ExtensionTypesActions.loadExtensionTypesForPoliciesSuccess({
                                response: {
                                    processorTypes: processorTypes.processorTypes,
                                    controllerServiceTypes: controllerServiceTypes.controllerServiceTypes,
                                    reportingTaskTypes: reportingTaskTypes.reportingTaskTypes,
                                    parameterProviderTypes: parameterProviderTypes.parameterProviderTypes,
                                    flowAnalysisRuleTypes: flowAnalysisRuleTypes.flowAnalysisRuleTypes
                                }
                            })
                    ),
                    catchError((errorResponse: HttpErrorResponse) =>
                        of(ExtensionTypesActions.extensionTypesApiError({ error: errorResponse.error }))
                    )
                )
            )
        )
    );

    extensionTypesApiError$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ExtensionTypesActions.extensionTypesApiError),
            map((action) => action.error),
            switchMap((errorResponse: HttpErrorResponse) =>
                of(
                    ErrorActions.snackBarError({
                        error: `Failed to load extension types. You may not be able to create new Processors, Controller Services, Reporting Tasks, Parameter Providers, or Flow Analysis Rules. - [${
                            errorResponse.error || errorResponse.status
                        }]`
                    })
                )
            )
        )
    );
}
