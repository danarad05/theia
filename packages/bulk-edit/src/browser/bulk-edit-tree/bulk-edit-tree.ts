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
    constructor(
    ) {
        super();

        // this.root = <CompositeTreeNode>{
        //     visible: false,
        //     id: 'theia-bulk-edit-tree-widget',
        //     name: 'BulkEditTree',
        //     children: [],
        //     parent: undefined
        // };
    }

    public async setBulkEdits(edits: Array<monaco.languages.WorkspaceTextEdit | monaco.languages.WorkspaceFileEdit>): Promise<void> {
        const rootNode = <CompositeTreeNode>{
            visible: false,
            id: 'theia-bulk-edit-tree-widget',
            name: 'BulkEditTree',
            children: this.getBulkEditInfoNodes(edits),
            parent: undefined
        };
        this.root = rootNode;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected getBulkEditInfoNodes(bulkEdits: any[]): BulkEditInfoNode[] {
        const bulkEditInfos = bulkEdits.map(edit => {
            if (edit && edit.resource && edit.resource.path) {
                return edit.resource.path;
            }
        }).filter((path, index, arr) => arr.indexOf(path) === index)
            .map(path => this.createBulkEditInfo(path, new URI(path)));

        bulkEditInfos.forEach(editInfo => {
            editInfo.children = bulkEdits.filter(edit => edit.resource.path === editInfo.id)
                .map((edit, index) => this.createBulkEditNode(edit, index, editInfo));
        });

        return bulkEditInfos;
    }
    // public async refreshBulkEditInfo(uri: URI): Promise<void> {
    //     // const id = uri.toString();
    //     // const existing = this.getNode(id);
    //     // const markers = []; // this.bulkEditService.findBulkEdits({ uri });
    //     // if (markers.length <= 0) {
    //     //     if (BulkEditInfoNode.is(existing)) {
    //     //         CompositeTreeNode.removeChild(existing.parent, existing);
    //     //         this.removeNode(existing);
    //     //         this.fireChanged();
    //     //     }
    //     //     return;
    //     // }
    //     // const node = BulkEditInfoNode.is(existing) ? existing : this.createBulkEditInfo(id, uri);
    //     // CompositeTreeNode.addChild(node.parent, node);
    //     // // const children = this.getBulkEditNodes(node, markers);
    //     // // node.numberOfBulkEdits = markers.length;
    //     // this.setChildren(node, children);
    // }

    // protected async resolveChildren(parent: CompositeTreeNode): Promise<TreeNode[]> {
    //     if (CompositeTreeNode.is(parent)) {
    //         const nodes: BulkEditInfoNode[] = [];
    //         // for (const id of this.bulkEditService.getUris()) {
    //         //     const uri = new URI(id);
    //         //     const existing = this.getNode(id);
    //         //     // const markers = this.bulkEditService.findBulkEdits({ uri });
    //         //     // const node = BulkEditInfoNode.is(existing) ? existing : this.createBulkEditInfo(id, uri);
    //         //     // node.children = this.getBulkEditNodes(node, markers);
    //         //     // node.numberOfBulkEdits = node.children.length;
    //         //     // nodes.push(node);
    //         // }
    //         return nodes;
    //     }
    //     return super.resolveChildren(parent);
    // }

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

    private createBulkEditInfo(id: string, uri: URI): BulkEditInfoNode {
        return {
            children: [],
            expanded: true,
            uri,
            id,
            parent: this.root as BulkEditInfoNode,
            selected: false,
            numberOfBulkEdits: 0
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
    numberOfBulkEdits: number;
}
export namespace BulkEditInfoNode {
    export function is(node: Object | undefined): node is BulkEditInfoNode {
        return ExpandableTreeNode.is(node) && UriSelection.is(node) && 'numberOfBulkEdits' in node;
    }
}

export interface SearchInWorkspaceResult {
    /**
     * The string uri to the root folder that the search was performed.
     */
    root: string;

    /**
     * The string uri to the file containing the result.
     */
    fileUri: string;

    /**
     * matches found in the file
     */
    matches: SearchMatch[];
}

export interface SearchMatch {
    /**
     * The (1-based) line number of the result.
     */
    line: number;

    /**
     * The (1-based) character number in the result line.  For UTF-8 files,
     * one multi-byte character counts as one character.
     */
    character: number;

    /**
     * The length of the match, in characters.  For UTF-8 files, one
     * multi-byte character counts as one character.
     */
    length: number;

    /**
     * The text of the line containing the result.
     */
    lineText: string | LinePreview;

}

export interface LinePreview {
    text: string;
    character: number;
}
