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

// import * as React from 'react';
import { inject, injectable } from 'inversify';
// import { Emitter } from '@theia/core/lib/common/event';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
// import { BulkEditWidget } from './BulkEdit-widget';
// import { bulkEditCommands } from './BulkEdit-commands';
import { BulkEditContribution } from './bulk-edit-contribution';
import { BulkEditCommands } from './bulk-edit-commands';
// import { bulkEditChannelManager } from '../common/BulkEdit-channel';

@injectable()
export class BulkEditToolbarContribution implements TabBarToolbarContribution {

    @inject(BulkEditContribution)
    protected readonly bulkEditContribution: BulkEditContribution;

    // @postConstruct()
    // protected init(): void {
    // }

    async registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): Promise<void> {
        toolbarRegistry.registerItem({
            id: BulkEditCommands.APPLY.id,
            command: BulkEditCommands.APPLY.id,
            tooltip: 'Apply Refactoring',
            priority: 0,
        });
        toolbarRegistry.registerItem({
            id: BulkEditCommands.DISCARD.id,
            command: BulkEditCommands.DISCARD.id,
            tooltip: 'Discard Refactoring',
            priority: 1,
        });
    }
}
