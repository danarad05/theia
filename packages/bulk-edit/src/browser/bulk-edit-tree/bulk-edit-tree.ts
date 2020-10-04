/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
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

import { injectable } from 'inversify';
import { TreeNode, CompositeTreeNode, SelectableTreeNode, ExpandableTreeNode, TreeImpl } from '@theia/core/lib/browser';
import URI from '@theia/core/lib/common/uri';
import { UriSelection } from '@theia/core/lib/common/selection';
import { BulkEditNodeSelection } from './bulk-edit-selection';

@injectable()
export class BulkEditTree extends TreeImpl {
    // constructor(
    // ) {
    //     super();
    //     // this.root = <CompositeTreeNode>{
    //     //     visible: false,
    //     //     id: 'theia-bulk-edit-tree-widget',
    //     //     name: 'BulkEditTree',
    //     //     children: [],
    //     //     parent: undefined
    //     // };
    // }

    public async setBulkEdits(workspaceEdit: monaco.languages.WorkspaceEdit, fileContents: Map<string, string>): Promise<void> {
        this.root = <CompositeTreeNode>{
            visible: false,
            id: 'theia-bulk-edit-tree-widget',
            name: 'BulkEditTree',
            children: this.getBulkEditInfoNodes(workspaceEdit, fileContents),
            parent: undefined
        };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected getBulkEditInfoNodes(workspaceEdit: monaco.languages.WorkspaceEdit, fileContentsMap: Map<string, string>): BulkEditInfoNode[] {
        let bulkEditInfos: BulkEditInfoNode[] = [];
        if (workspaceEdit.edits) {
            bulkEditInfos = workspaceEdit.edits
                .map(edit =>
                    (edit && ('resource' in edit) && edit.resource && edit.resource.path) ? edit.resource.path :
                        ((edit && ('newUri' in edit) && edit.newUri && edit.newUri.path) ? edit.newUri.path : undefined))
                .filter((path, index, arr) => path && arr.indexOf(path) === index)
                .map((path: string) => this.createBulkEditInfo(path, new URI(path), fileContentsMap.get(path)))
                .filter(Boolean);

            if (bulkEditInfos.length > 0) {
                bulkEditInfos.forEach(editInfo => {
                    editInfo.children = workspaceEdit.edits.filter(edit => ((('resource' in edit) && edit.resource.path === editInfo.id)) ||
                        (('newUri' in edit) && edit.newUri && edit.newUri.path === editInfo.id))
                        .map((edit, index) => this.createBulkEditNode(edit, index, editInfo));
                });
            }
        }
        return bulkEditInfos;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected getBulkEditNodes(parent: BulkEditInfoNode, bulkEdits: any[]): BulkEditNode[] {
        return bulkEdits.map((edit, index) =>
            this.createBulkEditNode(edit, index, parent)
        );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected createBulkEditNode(bulkEdit: any, index: number, parent: BulkEditInfoNode): BulkEditNode {
        const id = parent.id + '_' + index;
        const existing = this.getNode(id);
        if (BulkEditNode.is(existing)) {
            existing.bulkEdit = bulkEdit;
            return existing;
        }
        return {
            id,
            name: 'bulkEdit',
            parent,
            selected: false,
            uri: parent.uri,
            bulkEdit
        };
    }

    private createBulkEditInfo(id: string, uri: URI, fileContents: string | undefined): BulkEditInfoNode {
        return {
            id,
            uri,
            expanded: true,
            selected: false,
            parent: this.root as BulkEditInfoNode,
            fileContents,
            children: []
        };
    }
}

export interface BulkEditNode extends UriSelection, SelectableTreeNode {
    parent: CompositeTreeNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bulkEdit: any;
}
export namespace BulkEditNode {
    export function is(node: TreeNode | undefined): node is BulkEditNode {
        return UriSelection.is(node) && SelectableTreeNode.is(node) && BulkEditNodeSelection.is(node);
    }
}

export interface BulkEditInfoNode extends UriSelection, SelectableTreeNode, ExpandableTreeNode {
    parent: CompositeTreeNode;
    fileContents?: string;
}
export namespace BulkEditInfoNode {
    export function is(node: Object | undefined): node is BulkEditInfoNode {
        return ExpandableTreeNode.is(node) && UriSelection.is(node) && 'fileContents' in node;
    }
}
