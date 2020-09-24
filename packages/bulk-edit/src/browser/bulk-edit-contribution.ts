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
import { OpenHandler, OpenerOptions, OpenerService } from '@theia/core/lib/browser';
// CommonCommands, quickCommand, open,
import { CommandRegistry, CommandService, MenuModelRegistry, MenuPath } from '@theia/core/lib/common';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { BulkEditWidget } from './bulk-edit-widget';
import { BulkEditCommands } from './bulk-edit-commands';
// import { WorkspaceEdit } from '@theia/plugin-ext/src/plugin/types-impl';
import { MonacoBulkEditService } from '@theia/monaco/lib/browser/monaco-bulk-edit-service';
// import { WorkspaceEditDto, WorkspaceTextEditDto } from '@theia/plugin-ext/src/common';
// import { WorkspaceEdit } from '@theia/plugin-ext/src/plugin/types-impl';
// import { BulkEditContextMenu } from './bulk-edit-context-menu';
// import { BulkEditUri } from '../common/bulk-edit-uri';
// import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
// import { BulkEditChannelManager } from '../common/bulk-edit-channel';
// import { BulkEditCommands } from './bulk-edit-commands';

export const MENU_PATH: MenuPath = ['output_context_menu'];
export const TEXT_EDIT_GROUP = [...MENU_PATH, '0_text_edit_group'];

@injectable()
export class BulkEditContribution extends AbstractViewContribution<BulkEditWidget> implements OpenHandler {

    @inject(CommandService)
    protected readonly commandService: CommandService;

    @inject(OpenerService)
    protected readonly openerService: OpenerService;

    readonly id: string = `${BulkEditWidget.ID}-opener`;

    constructor(
        private readonly bulkEditService: MonacoBulkEditService,
    ) {
        super({
            widgetId: BulkEditWidget.ID,
            widgetName: 'Refactor Preview',
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: BulkEditCommands.TOGGLE_VIEW.id,
            toggleKeybinding: 'CtrlCmd+Shift+U'
        });
        this.bulkEditService.setPreviewHandler((edits: monaco.languages.WorkspaceEdit) => this._previewEdit(edits));
    }

    // @postConstruct()
    // protected init(): void {
    //     // this.bulkEditChannelManager.onChannelWasShown(({ name, preserveFocus }) =>
    //     //     open(this.openerService, BulkEditUri.create(name), { activate: !preserveFocus, reveal: true }));
    // }

    registerCommands(registry: CommandRegistry): void {
        super.registerCommands(registry);
        registry.registerCommand(BulkEditCommands.APPLY, {
            isEnabled: widget => this.withWidget(widget, () => true),
            isVisible: widget => this.withWidget(widget, () => true),
            execute: widget => this.withWidget(widget, () => true) // this.collapseAllProblems()
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

    canHandle(uri: URI): MaybePromise<number> {
        return 200; // BulkEditUri.is(uri) ? 200 : 0;
    }

    async open(uri?: URI, options?: OpenerOptions): Promise<BulkEditWidget> {
        // if (!BulkEditUri.is(uri)) {
        //     throw new Error(`Expected '${BulkEditUri.SCHEME}' URI scheme. Got: ${uri} instead.`);
        // }
        const widget = await this.openView(options);
        return widget;
    }

    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (bulkEdit: BulkEditWidget) => T): T | false {
        if (widget instanceof BulkEditWidget) {
            return cb(widget);
        }
        return false;
    }

    // async $tryApplyWorkspaceEdit(dto: WorkspaceEditDto): Promise<boolean> {
    //     const edits = this.toMonacoWorkspaceEdit(dto);
    //     try {
    //         const { success } = await this.bulkEditService.apply(edits);
    //         return success;
    //     } catch {
    //         return false;
    //     }
    // }

    // private toMonacoWorkspaceEdit(data: WorkspaceEditDto | undefined): monaco.languages.WorkspaceEdit {
    //     return {
    //         edits: (data && data.edits || []).map(edit => {
    //             if (WorkspaceTextEditDto.is(edit)) {
    //                 return { resource: monaco.Uri.revive(edit.resource), edit: edit.edit };
    //             } else {
    //                 return { newUri: monaco.Uri.revive(edit.newUri), oldUri: monaco.Uri.revive(edit.oldUri), options: edit.options };
    //             }
    //         })
    //     };
    // }

    private async _previewEdit(edits: monaco.languages.WorkspaceEdit): Promise<monaco.languages.WorkspaceEdit> {
        console.log('AAA _previewEdit1', edits);
        // get bulkeditpane

        // check if pane has input

        // setinput

        const widget = await this.open();
        console.log('AAA _previewEdit2', widget);
        return edits;
        //     // this._ctxEnabled.set(true);

        //     // const uxState = this._activeSession?.uxState ?? new UXState(this._panelService, this._editorGroupsService);
        //     // const view = await getBulkEditPane(this._viewsService);
        //     // if (!view) {
        //     //     // this._ctxEnabled.set(false);
        //     //     return edits;
        //     // }

        //     // // check for active preview session and let the user decide
        //     // if (view.hasInput()) {
        //     //     const choice = await this._dialogService.show(
        //     //         Severity.Info,
        //     //         localize('overlap', "Another refactoring is being previewed."),
        //     //         [localize('cancel', "Cancel"), localize('continue', "Continue")],
        //     //         { detail: localize('detail', "Press 'Continue' to discard the previous refactoring and continue with the current refactoring.") }
        //     //     );

        //     //     if (choice.choice === 0) {
        //     //         // this refactoring is being cancelled
        //     //         return [];
        //     //     }
        //     // }

        //     // // session
        //     // let session: PreviewSession;
        //     // if (this._activeSession) {
        //     //     this._activeSession.cts.dispose(true);
        //     //     session = new PreviewSession(uxState);
        //     // } else {
        //     //     session = new PreviewSession(uxState);
        //     // }
        //     // this._activeSession = session;

        //     // // the actual work...
        //     // try {

        //     //     return await view.setInput(edits, session.cts.token) ?? [];

        //     // } finally {
        //     //     // restore UX state
        //     //     if (this._activeSession === session) {
        //     //         await this._activeSession.uxState.restore();
        //     //         this._activeSession.cts.dispose();
        //     //         this._ctxEnabled.set(false);
        //     //         this._activeSession = undefined;
        //     //     }
        //     // }
    }

    // async getBulkEditPane(viewsService: IViewsService): Promise<BulkEditWidget | undefined> {
    //     const view = await viewsService.openView(BulkEditWidget.ID, true);
    //     if (view instanceof BulkEditWidget) {
    //         return view;
    //     }
    //     return undefined;
    // }
}
