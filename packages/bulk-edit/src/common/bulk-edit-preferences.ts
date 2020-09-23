/********************************************************************************
 * Copyright (c) 2020 SAP SE or an SAP affiliate company and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { interfaces } from 'inversify';
import {
    createPreferenceProxy,
    PreferenceProxy,
    PreferenceService,
    PreferenceContribution,
    PreferenceSchema
} from '@theia/core/lib/browser/preferences';

export const bulkEditConfigSchema: PreferenceSchema = {
    'type': 'object',
    'properties': {
        'bulk-edit.maxChannelHistory': {
            'type': 'number',
            'description': 'The maximum number of entries in an bulk-edit channel.',
            'default': 1000
        }
    }
};

export interface bulkEditConfiguration {
    'bulk-edit.maxChannelHistory': number
}

export const bulkEditPreferences = Symbol('bulkEditPreferences');
export type bulkEditPreferences = PreferenceProxy<bulkEditConfiguration>;

export function createbulkEditPreferences(preferences: PreferenceService): bulkEditPreferences {
    return createPreferenceProxy(preferences, bulkEditConfigSchema);
}

export function bindbulkEditPreferences(bind: interfaces.Bind): void {
    bind(bulkEditPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get<PreferenceService>(PreferenceService);
        return createbulkEditPreferences(preferences);
    });

    bind(PreferenceContribution).toConstantValue({ schema: bulkEditConfigSchema });
}
