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
import * as FlowConfigurationActions from './flow-configuration.actions';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { FlowConfigurationService } from '../../service/flow-configuration.service';
import * as ErrorActions from '../error/error.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class FlowConfigurationEffects {
    constructor(
        private actions$: Actions,
        private flowConfigurationService: FlowConfigurationService
    ) {}

    loadFlowConfiguration$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FlowConfigurationActions.loadFlowConfiguration),
            switchMap(() => {
                return from(
                    this.flowConfigurationService.getFlowConfiguration().pipe(
                        map((response) =>
                            FlowConfigurationActions.loadFlowConfigurationSuccess({
                                response
                            })
                        ),
                        catchError((errorResponse: HttpErrorResponse) =>
                            of(
                                ErrorActions.snackBarError({
                                    error: `Failed to load Flow Configuration. - [${
                                        errorResponse.error || errorResponse.status
                                    }]`
                                })
                            )
                        )
                    )
                );
            })
        )
    );
}
