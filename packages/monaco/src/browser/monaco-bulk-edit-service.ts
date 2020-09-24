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

import { injectable, inject } from 'inversify';
import { MonacoWorkspace } from './monaco-workspace';

@injectable()
export class MonacoBulkEditService implements monaco.editor.IBulkEditService {

    @inject(MonacoWorkspace)
    protected readonly workspace: MonacoWorkspace;

    private _previewHandler?: monaco.editor.IBulkEditPreviewHandler;

    async apply(workspaceEdit: monaco.languages.WorkspaceEdit, options?: monaco.editor.IBulkEditOptions): Promise<monaco.editor.IBulkEditResult & { success: boolean }> {
        // return this.workspace.applyBulkEdit(edit);
        if (this._previewHandler && (options?.showPreview || workspaceEdit.edits.some(value => value.metadata?.needsConfirmation))) {
            workspaceEdit = await this._previewHandler(workspaceEdit, options);
        }

        return this.workspace.applyBulkEdit(workspaceEdit);

        // let codeEditor = options?.editor;
        // // try to find code editor
        // if (!codeEditor) {
        //     let candidate = this._editorService.activeTextEditorControl;
        //     if (isCodeEditor(candidate)) {
        //         codeEditor = candidate;
        //     }
        // }

        // if (codeEditor && codeEditor.getOption(EditorOption.readOnly)) {
        //     // If the code editor is readonly still allow bulk edits to be applied #68549
        //     codeEditor = undefined;
        // }

        // const bulkEdit = this._instaService.createInstance(
        //     BulkEdit,
        //     options?.quotableLabel || options?.label,
        //     codeEditor, options?.progress ?? Progress.None,
        //     edits
        // );

        // try {
        //     await bulkEdit.perform();
        //     return { ariaSummary: bulkEdit.ariaMessage() };
        // } catch (err) {
        //     // console.log('apply FAILED');
        //     // console.log(err);
        //     this._logService.error(err);
        //     throw err;
        // }
    }

    hasPreviewHandler(): boolean {
        return Boolean(this._previewHandler);
    }

    setPreviewHandler(handler: monaco.editor.IBulkEditPreviewHandler): monaco.IDisposable {
        this._previewHandler = handler;

        const disposePreviewHandler = () => {
            if (this._previewHandler === handler) {
                this._previewHandler = undefined;
            }
        };

        return {
            dispose(): void {
                disposePreviewHandler();
            }
        };
    }
}
