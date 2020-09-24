/********************************************************************************
 * Copyright (C) 2019 Arm and others.
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
import { inject, injectable, postConstruct } from 'inversify';
// import { Emitter } from '@theia/core/lib/common/event';
import { TabBarToolbarContribution, TabBarToolbarRegistry } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
// import { BulkEditWidget } from './BulkEdit-widget';
// import { bulkEditCommands } from './BulkEdit-commands';
import { BulkEditContribution } from './bulk-edit-contribution';
import { BulkEditCommands } from './bulk-edit-commands';
// import { bulkEditChannelManager } from '../common/BulkEdit-channel';

@injectable()
export class BulkEditToolbarContribution implements TabBarToolbarContribution {

    // @inject(BulkEditChannelManager)
    // protected readonly bulkEditChannelManager: bulkEditChannelManager;

    @inject(BulkEditContribution)
    protected readonly bulkEditContribution: BulkEditContribution;

    // protected readonly onBulkEditWidgetStateChangedEmitter = new Emitter<void>();
    // protected readonly onBulkEditWidgetStateChanged = this.onBulkEditWidgetStateChangedEmitter.event;

    // protected readonly onChannelsChangedEmitter = new Emitter<void>();
    // protected readonly onChannelsChanged = this.onChannelsChangedEmitter.event;

    @postConstruct()
    protected init(): void {
        // this.bulkEditContribution.widget.then(widget => {
        //     widget.onStateChanged(() => this.onBulkEditWidgetStateChangedEmitter.fire());
        // });
        // const fireChannelsChanged = () => this.onChannelsChangedEmitter.fire();
        // this.bulkEditChannelManager.onSelectedChannelChanged(fireChannelsChanged);
        // this.bulkEditChannelManager.onChannelAdded(fireChannelsChanged);
        // this.bulkEditChannelManager.onChannelDeleted(fireChannelsChanged);
        // this.bulkEditChannelManager.onChannelWasShown(fireChannelsChanged);
        // this.bulkEditChannelManager.onChannelWasHidden(fireChannelsChanged);
    }

    async registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): Promise<void> {
        // toolbarRegistry.registerItem({
        //     id: 'channels',
        //     render: () => this.renderChannelSelector(),
        //     isVisible: widget => widget instanceof BulkEditWidget,
        //     onDidChange: this.onChannelsChanged
        // });
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
        // toolbarRegistry.registerItem({
        //     id: bulkEditCommands.LOCK__WIDGET.id,
        //     command: bulkEditCommands.LOCK__WIDGET.id,
        //     tooltip: 'Turn Auto Scrolling Off',
        //     onDidChange: this.onBulkEditWidgetStateChanged,
        //     priority: 2
        // });
        // toolbarRegistry.registerItem({
        //     id: bulkEditCommands.UNLOCK__WIDGET.id,
        //     command: bulkEditCommands.UNLOCK__WIDGET.id,
        //     tooltip: 'Turn Auto Scrolling On',
        //     onDidChange: this.onBulkEditWidgetStateChanged,
        //     priority: 2
        // });
    }

    // protected readonly NONE = '<no channels>';

    // protected renderChannelSelector(): React.ReactNode {
    //     const channelOptionElements: React.ReactNode[] = [];
    //     this.bulkEditChannelManager.getVisibleChannels().forEach(channel => {
    //         channelOptionElements.push(<option value={channel.name} key={channel.name}>{channel.name}</option>);
    //     });
    //     if (channelOptionElements.length === 0) {
    //         channelOptionElements.push(<option key={this.NONE} value={this.NONE}>{this.NONE}</option>);
    //     }
    //     return <select
    //         className='theia-select'
    //         id='BulkEditChannelList'
    //         key='BulkEditChannelList'
    //         value={this.bulkEditChannelManager.selectedChannel ? this.bulkEditChannelManager.selectedChannel.name : this.NONE}
    //         onChange={this.changeChannel}
    //     >
    //         {channelOptionElements}
    //     </select>;
    // }

    // protected changeChannel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const channelName = event.target.value;
    //     if (channelName !== this.NONE) {
    //         this.bulkEditChannelManager.getChannel(channelName).show();
    //     }
    // };
}
