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

import { injectable, inject, postConstruct } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { Widget } from '@theia/core/lib/browser/widgets/widget';
import { MaybePromise } from '@theia/core/lib/common/types';
import { OpenHandler, OpenerOptions, OpenerService } from '@theia/core/lib/browser';
// CommonCommands, quickCommand, open,
import { CommandRegistry, MenuModelRegistry, CommandService, MenuPath } from '@theia/core/lib/common';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import { BulkEditWidget } from './bulk-edit-widget';
// import { BulkEditContextMenu } from './bulk-edit-context-menu';
// import { BulkEditUri } from '../common/bulk-edit-uri';
// import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
// import { BulkEditChannelManager } from '../common/bulk-edit-channel';
// import { BulkEditCommands } from './bulk-edit-commands';

export const MENU_PATH: MenuPath = ['output_context_menu'];
export const TEXT_EDIT_GROUP = [...MENU_PATH, '0_text_edit_group'];

@injectable()
export class BulkEditContribution extends AbstractViewContribution<BulkEditWidget> implements OpenHandler {

    // @inject(ClipboardService)
    // protected readonly clipboardService: ClipboardService;

    @inject(CommandService)
    protected readonly commandService: CommandService;

    // @inject(BulkEditChannelManager)
    // protected readonly bulkEditChannelManager: BulkEditChannelManager;

    @inject(OpenerService)
    protected readonly openerService: OpenerService;

    readonly id: string = `${BulkEditWidget.ID}-opener`;

    constructor() {
        super({
            widgetId: BulkEditWidget.ID,
            widgetName: 'BulkEdit',
            defaultWidgetOptions: {
                area: 'bottom'
            },
            toggleCommandId: 'bulk-edit:toggle',
            toggleKeybinding: 'CtrlCmd+Shift+U'
        });
    }

    @postConstruct()
    protected init(): void {
        // this.bulkEditChannelManager.onChannelWasShown(({ name, preserveFocus }) =>
        //     open(this.openerService, BulkEditUri.create(name), { activate: !preserveFocus, reveal: true }));
    }

    registerCommands(registry: CommandRegistry): void {
        super.registerCommands(registry);
        // registry.registerCommand(BulkEditCommands.CLEAR__WIDGET, {
        //     isEnabled: arg => {
        //         if (arg instanceof Widget) {
        //             return arg instanceof BulkEditWidget;
        //         }
        //         return this.shell.currentWidget instanceof BulkEditWidget;
        //     },
        //     isVisible: arg => {
        //         if (arg instanceof Widget) {
        //             return arg instanceof BulkEditWidget;
        //         }
        //         return this.shell.currentWidget instanceof BulkEditWidget;
        //     },
        //     execute: () => {
        //         this.widget.then(widget => {
        //             this.withWidget(widget, bulk-edit => {
        //                 bulk-edit.clear();
        //                 return true;
        //             });
        //         });
        //     }
        // });
        // registry.registerCommand(BulkEditCommands.LOCK__WIDGET, {
        //     isEnabled: widget => this.withWidget(widget, bulk-edit => !bulk-edit.isLocked),
        //     isVisible: widget => this.withWidget(widget, bulk-edit => !bulk-edit.isLocked),
        //     execute: widget => this.withWidget(widget, bulk-edit => {
        //         bulk-edit.lock();
        //         return true;
        //     })
        // });
        // registry.registerCommand(BulkEditCommands.UNLOCK__WIDGET, {
        //     isEnabled: widget => this.withWidget(widget, bulk-edit => bulk-edit.isLocked),
        //     isVisible: widget => this.withWidget(widget, bulk-edit => bulk-edit.isLocked),
        //     execute: widget => this.withWidget(widget, bulk-edit => {
        //         bulk-edit.unlock();
        //         return true;
        //     })
        // });
        // registry.registerCommand(BulkEditCommands.COPY_ALL, {
        //     execute: () => {
        //         const textToCopy = this.tryGetWidget()?.getText();
        //         if (textToCopy) {
        //             this.clipboardService.writeText(textToCopy);
        //         }
        //     }
        // });
    }

    registerMenus(registry: MenuModelRegistry): void {
        console.log('AAA registerMenus1');
        super.registerMenus(registry);
        registry.registerMenuAction(TEXT_EDIT_GROUP, {
            commandId: 'aaaa',
            label: 'AAAAAVVV'
        });
        // registry.registerMenuAction(BulkEditContextMenu.TEXT_EDIT_GROUP, {
        //     commandId: BulkEditCommands.COPY_ALL.id,
        //     label: 'Copy All'
        // });
        // registry.registerMenuAction(BulkEditContextMenu.COMMAND_GROUP, {
        //     commandId: quickCommand.id,
        //     label: 'Find Command...'
        // });
        // registry.registerMenuAction(BulkEditContextMenu.WIDGET_GROUP, {
        //     commandId: BulkEditCommands.CLEAR__WIDGET.id,
        //     label: 'Clear BulkEdit'
        // });
        console.log('AAA registerMenus2');
    }

    canHandle(uri: URI): MaybePromise<number> {
        return 200; // BulkEditUri.is(uri) ? 200 : 0;
    }

    async open(uri: URI, options?: OpenerOptions): Promise<BulkEditWidget> {
        // if (!BulkEditUri.is(uri)) {
        //     throw new Error(`Expected '${BulkEditUri.SCHEME}' URI scheme. Got: ${uri} instead.`);
        // }
        const widget = await this.openView(options);
        return widget;
    }

    protected withWidget(
        widget: Widget | undefined = this.tryGetWidget(),
        predicate: (bulkEdit: BulkEditWidget) => boolean = () => true
    ): boolean | false {
        return widget instanceof BulkEditWidget ? predicate(widget) : false;
    }
}
