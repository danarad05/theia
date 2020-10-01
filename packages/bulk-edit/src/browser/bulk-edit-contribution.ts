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

import { injectable, inject } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { Widget } from '@theia/core/lib/browser/widgets/widget';
import { MaybePromise } from '@theia/core/lib/common/types';
import { OpenerOptions, OpenerService, FrontendApplication, FrontendApplicationContribution } from '@theia/core/lib/browser';
import { CommandRegistry, CommandService, MenuModelRegistry, MenuPath } from '@theia/core/lib/common';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { BulkEditCommands } from './bulk-edit-commands';
import { MonacoBulkEditService } from '@theia/monaco/lib/browser/monaco-bulk-edit-service';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/src/browser/shell/tab-bar-toolbar';
import { BulkEditTreeWidget, BULK_EDIT_TREE_WIDGET_ID } from './bulk-edit-tree';

export const MENU_PATH: MenuPath = ['output_context_menu'];
export const TEXT_EDIT_GROUP = [...MENU_PATH, '0_text_edit_group'];

@injectable()
export class BulkEditContribution extends AbstractViewContribution<BulkEditTreeWidget> implements FrontendApplicationContribution, TabBarToolbarContribution {
    _workspaceEdit: monaco.languages.WorkspaceEdit;

    @inject(CommandService)
    protected readonly commandService: CommandService;

    @inject(OpenerService)
    protected readonly openerService: OpenerService;

    readonly id: string = `${BULK_EDIT_TREE_WIDGET_ID}-opener`;

    constructor(
        private readonly bulkEditService: MonacoBulkEditService,
    ) {
        super({
            widgetId: BULK_EDIT_TREE_WIDGET_ID,
            widgetName: 'Refactor Preview',
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: BulkEditCommands.TOGGLE_VIEW.id,
            toggleKeybinding: 'CtrlCmd+Shift+U'
        });
        this.bulkEditService.setPreviewHandler((edits: monaco.languages.WorkspaceEdit) => this._previewEdit(edits));
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        console.log('AAA BulkEditContribution initializeLayout');
        await this.openView();
    }

    // @postConstruct()
    // protected init(): void {
    // }

    registerCommands(registry: CommandRegistry): void {
        super.registerCommands(registry);
        registry.registerCommand(BulkEditCommands.APPLY, {
            isEnabled: widget => this.withWidget(widget, () => true),
            isVisible: widget => this.withWidget(widget, () => true),
            execute: widget => this.withWidget(widget, () => this.applyBulkEdits()) // this.collapseAllProblems()
        });
        registry.registerCommand(BulkEditCommands.DISCARD, {
            isEnabled: widget => this.withWidget(widget, () => true),
            isVisible: widget => this.withWidget(widget, () => true),
            execute: widget => this.withWidget(widget, () => true) // this.collapseAllProblems()
        });
    }

    registerMenus(registry: MenuModelRegistry): void {
        console.log('AAA registerMenus1');
        super.registerMenus(registry);
        registry.registerMenuAction(TEXT_EDIT_GROUP, {
            commandId: 'aaaa',
            label: 'AAAAAVVV'
        });
        registry.registerMenuAction(TEXT_EDIT_GROUP, {
            commandId: 'asdads',
            label: 'Clear BulkEdit'
        });
        console.log('AAA registerMenus2');
    }

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

    canHandle(uri: URI): MaybePromise<number> {
        return 200; // BulkEditUri.is(uri) ? 200 : 0;
    }

    async open(uri?: URI, options?: OpenerOptions): Promise<BulkEditTreeWidget> {
        const widget = await this.openView({ activate: true });
        return widget;
    }

    applyBulkEdits(): void {
        if (this._workspaceEdit) {
            this.bulkEditService.apply(this._workspaceEdit);
        }
    }

    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (bulkEdit: BulkEditTreeWidget) => T): T | false {
        if (widget instanceof BulkEditTreeWidget) {
            return cb(widget);
        }
        return false;
    }

    private async _previewEdit(workspaceEdit: monaco.languages.WorkspaceEdit): Promise<monaco.languages.WorkspaceEdit> {
        console.log('AAA _previewEdit1', workspaceEdit);
        const widget = await this.open();

        if (widget) {
            this._workspaceEdit = workspaceEdit;
            await widget.initModel(workspaceEdit.edits);
        }

        console.log('AAA _previewEdit2', widget);
        return workspaceEdit;
    }
}
