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

import { ContainerModule } from 'inversify';
import { BulkEditWidget, OUTPUT_WIDGET_KIND } from './bulk-edit-widget';
// import { CommandContribution } from '@theia/core/lib/common/command';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
// import { ResourceResolver } from '@theia/core/lib/common';
import { WidgetFactory, bindViewContribution, OpenHandler } from '@theia/core/lib/browser';
// import { BulkEditChannelManager } from '../common/bulk-edit-channel';
// import { bindbulk-editPreferences } from '../common/bulk-edit-preferences';
import { BulkEditToolbarContribution } from './bulk-edit-toolbar-contribution';
import { BulkEditContribution } from './bulk-edit-contribution';
// import { MenuContribution } from '@theia/core/src/common';
// import { MonacoEditorFactory } from '@theia/monaco/lib/browser/monaco-editor-provider';
// import { BulkEditContextMenuService } from './bulk-edit-context-menu';
// import { BulkEditEditorFactory } from './bulk-edit-editor-factory';
// import { MonacoEditorModelFactory } from '@theia/monaco/lib/browser/monaco-text-model-service';
// import { BulkEditEditorModelFactory } from './bulk-edit-editor-model-factory';

export default new ContainerModule(bind => {
    // bind(bulk-editChannelManager).toSelf().inSingletonScope();
    // bind(CommandContribution).toService(BulkEditContribution);
    // bind(MenuContribution).toService(BulkEditContribution);

    // bind(ResourceResolver).toService(bulk-editChannelManager);
    // bind(MonacoEditorFactory).to(bulk-editEditorFactory).inSingletonScope();
    // bind(MonacoEditorModelFactory).to(bulk-editEditorModelFactory).inSingletonScope();
    // bind(bulk-editContextMenuService).toSelf().inSingletonScope();

    // bindbulk-editPreferences(bind);

    bind(BulkEditWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: OUTPUT_WIDGET_KIND,
        createWidget: () => context.container.get<BulkEditWidget>(BulkEditWidget)
    }));
    bindViewContribution(bind, BulkEditContribution);
    bind(OpenHandler).to(BulkEditContribution).inSingletonScope();

    bind(BulkEditToolbarContribution).toSelf().inSingletonScope();
    bind(TabBarToolbarContribution).toService(BulkEditToolbarContribution);
});
