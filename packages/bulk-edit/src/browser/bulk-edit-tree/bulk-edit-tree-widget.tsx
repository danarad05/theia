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
    ApplicationShell, CompositeTreeNode, NodeProps
} from '@theia/core/lib/browser';
import * as React from 'react';
import { DisposableCollection } from '@theia/core/lib/common/disposable';
import { BulkEditPreferences } from '../../common/bulk-edit-preferences';
import { BulkEditInfoNode, BulkEditNode } from './bulk-edit-tree';
import { BulkEditTreeModel } from './bulk-edit-tree-model';
import { FileResourceResolver } from '@theia/filesystem/lib/browser';
import URI from '@theia/core/lib/common/uri';

export const BULK_EDIT_TREE_WIDGET_ID = 'bulkedit';

@injectable()
export class BulkEditTreeWidget extends TreeWidget {

    protected readonly toDisposeOnCurrentWidgetChanged = new DisposableCollection();

    @inject(BulkEditPreferences)
    protected readonly preferences: BulkEditPreferences;

    @inject(ApplicationShell)
    protected readonly shell: ApplicationShell;

    @inject(FileResourceResolver)
    protected readonly fileResourceResolver: FileResourceResolver;

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

    async initModel(workspaceEdit: monaco.languages.WorkspaceEdit): Promise<void> {
        await this.model.initModel(workspaceEdit, await this.getFileContentsMap(workspaceEdit));
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
        if (node && node.bulkEdit && node.parent) {
            const bulkEdit = node.bulkEdit;
            const parent = node.parent as BulkEditInfoNode;

            if (parent.fileContents) {
                const lines = parent.fileContents.split('\n');
                const startLineNum = +bulkEdit.edit.range.startLineNumber;
                const startColumn = +bulkEdit.edit.range.startColumn;
                // todo: handle if endline is not is same line ?
                const endColumn = +bulkEdit.edit.range.endColumn;

                if (lines.length > startLineNum) {
                    const lineText = lines[startLineNum - 1];
                    const beforeMatch = (startColumn > 26 ? '... ' : '') + lineText.substr(0, startColumn - 1).substr(-25);
                    const replacedText = lineText.substring(startColumn - 1, endColumn - 1);
                    const afterMatch = lineText.substr(startColumn - 1 + replacedText.length, 75);

                    return <div className='bulkEditNode'>
                        <div className='message'>
                            {beforeMatch}
                            <span className="replaced-text">{replacedText}</span>
                            <span className="inserted-text">{bulkEdit.edit.text}</span>
                            {afterMatch}
                        </div>
                    </div>;
                }
            }
        }
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

    private async getFileContentsMap(workspaceEdit: monaco.languages.WorkspaceEdit): Promise<Map<string, string>> {
        const fileContentMap = new Map<string, string>();

        if (workspaceEdit && workspaceEdit.edits) {
            let fileUri;
            let resource;
            for (const element of workspaceEdit.edits) {
                if (element) {
                    const filePath = (('newUri' in element) && element.newUri && element.newUri.path) ? element.newUri.path :
                        (('resource' in element) && element.resource && element.resource.path ? element.resource.path : undefined);

                    if (filePath) {
                        fileUri = new URI(filePath).withScheme('file');
                        resource = await this.fileResourceResolver.resolve(fileUri);
                        fileContentMap.set(filePath, await resource.readContents());
                    }
                }
            }
        }
        return fileContentMap;
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
}
