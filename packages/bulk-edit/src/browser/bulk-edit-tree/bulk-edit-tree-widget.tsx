/********************************************************************************
 * Copyright (C) 2017 TypeFox and others.
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
import {
    TreeWidget, TreeProps, ContextMenuRenderer, TreeNode, TreeModel,
    ApplicationShell, CompositeTreeNode, NodeProps // , NodeProps, Navigatable, ExpandableTreeNode, SelectableTreeNode
} from '@theia/core/lib/browser';
import * as React from 'react';
import { DisposableCollection } from '@theia/core/lib/common/disposable';
import { BulkEditPreferences } from '../../common/bulk-edit-preferences';
import { BulkEditInfoNode, BulkEditNode } from './bulk-edit-tree';
import { BulkEditTreeModel } from './bulk-edit-tree-model';

export const BULK_EDIT_TREE_WIDGET_ID = 'bulkedit';

@injectable()
export class BulkEditTreeWidget extends TreeWidget {

    protected readonly toDisposeOnCurrentWidgetChanged = new DisposableCollection();

    @inject(BulkEditPreferences)
    protected readonly preferences: BulkEditPreferences;

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    constructor(
        @inject(TreeProps) readonly treeProps: TreeProps,
        @inject(BulkEditTreeModel) readonly model: BulkEditTreeModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer
    ) {
        super(treeProps, model, contextMenuRenderer);

        this.id = BULK_EDIT_TREE_WIDGET_ID;
        this.title.label = 'Refator Preview';
        this.title.caption = 'Refator Preview';
        this.title.closable = true;
        this.addClass('theia-bulk-edit-container');
    }

    @postConstruct()
    protected init(): void {
        super.init();
    }

    async initModel(edits: Array<monaco.languages.WorkspaceTextEdit | monaco.languages.WorkspaceFileEdit>): Promise<void> {
        await this.model.initModel(edits);
    }

    storeState(): object {
        // no-op
        return {};
    }
    protected superStoreState(): object {
        return super.storeState();
    }
    restoreState(state: object): void {
        // no-op
    }
    protected superRestoreState(state: object): void {
        super.restoreState(state);
        return;
    }

    protected handleClickEvent(node: TreeNode | undefined, event: React.MouseEvent<HTMLElement>): void {
        super.handleClickEvent(node, event);
        if (BulkEditNode.is(node)) {
            this.model.revealNode(node);
        }
    }

    protected handleDown(event: KeyboardEvent): void {
        const node = this.model.getNextSelectableNode();
        super.handleDown(event);
        if (BulkEditNode.is(node)) {
            this.model.revealNode(node);
        }
    }

    protected handleUp(event: KeyboardEvent): void {
        const node = this.model.getPrevSelectableNode();
        super.handleUp(event);
        if (BulkEditNode.is(node)) {
            this.model.revealNode(node);
        }
    }

    protected renderTree(model: TreeModel): React.ReactNode {
        if (CompositeTreeNode.is(model.root) && model.root.children.length > 0) {
            return super.renderTree(model);
        }
        return <div className='theia-widget-noInfo noEdits'>No edits have been detected in the workspace so far.</div>;
    }

    protected renderCaption(node: TreeNode, props: NodeProps): React.ReactNode {
        console.log('AAA bulk-edit-tree-widget renderCaption', node, props);
        if (BulkEditInfoNode.is(node)) {
            return this.decorateBulkEditInfoNode(node);
        } else if (BulkEditNode.is(node)) {
            return this.decorateBulkEditNode(node);
        }
        return 'caption';
    }

    // protected renderTailDecorations(node: TreeNode, props: NodeProps): JSX.Element {
    //     return <div className='row-button-container'>
    //         {this.renderRemoveButton(node)}
    //     </div>;
    // }

    // protected renderRemoveButton(node: TreeNode): React.ReactNode {
    //     return <ProblemMarkerRemoveButton model={this.model} node={node} />;
    // }

    protected decorateBulkEditNode(node: BulkEditNode): React.ReactNode {
        const bulkEdit = node.bulkEdit;
        return <div
            className='bulkEditNode'
            title={`${bulkEdit.edit.text} (${bulkEdit.edit.range.startLineNumber}, ${bulkEdit.edit.range.startColumn})`}>
            <div className='message'>{bulkEdit.edit.text}
                <span className='position'>
                    {'[' + (bulkEdit.edit.range.startLineNumber) + ', ' + (bulkEdit.edit.range.startColumn) + ']'}
                </span>
            </div>
        </div>;
    }

    protected decorateBulkEditInfoNode(node: BulkEditInfoNode): React.ReactNode {
        const icon = this.toNodeIcon(node);
        const name = this.toNodeName(node);
        const description = this.toNodeDescription(node);
        // Use a custom scheme so that we fallback to the `DefaultUriLabelProviderContribution`.
        const path = this.labelProvider.getLongName(node.uri.withScheme('bulkedit'));
        return <div title={path} className='bulkEditInfoNode'>
            {icon && <div className={icon + ' file-icon'}></div>}
            <div className='name'>{name}</div>
            <div className='path'>{description}</div>
        </div>;
    }

    // protected renderResultLineNode(node: SearchInWorkspaceResultLineNode): React.ReactNode {
    //     let before;
    //     let after;
    //     let title;
    //     if (typeof node.lineText === 'string') {
    //         const prefix = node.character > 26 ? '... ' : '';
    //         before = prefix + node.lineText.substr(0, node.character - 1).substr(-25);
    //         after = node.lineText.substr(node.character - 1 + node.length, 75);
    //         title = node.lineText.trim();
    //     } else {
    //         before = node.lineText.text.substr(0, node.lineText.character);
    //         after = node.lineText.text.substr(node.lineText.character + node.length);
    //         title = node.lineText.text.trim();
    //     }
    //     return <div className={`resultLine noWrapInfo ${node.selected ? 'selected' : ''}`} title={title}>
    //         {this.searchInWorkspacePreferences['search.lineNumbers'] && <span className='theia-siw-lineNumber'>{node.line}</span>}
    //         <span>
    //             {before}
    //         </span>
    //         {this.renderMatchLinePart(node)}
    //         <span>
    //             {after}
    //         </span>
    //     </div>;
    // }
}

// export class ProblemMarkerRemoveButton extends React.Component<{ model: ProblemTreeModel, node: TreeNode }> {

//     render(): React.ReactNode {
//         return <span className='remove-node' onClick={this.remove}></span>;
//     }

//     protected readonly remove = (e: React.MouseEvent<HTMLElement>) => this.doRemove(e);
//     protected doRemove(e: React.MouseEvent<HTMLElement>): void {
//         this.props.model.removeNode(this.props.node);
//         e.stopPropagation();
//     }
// }
