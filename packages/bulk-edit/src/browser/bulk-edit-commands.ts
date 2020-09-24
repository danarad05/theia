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

import { Command } from '@theia/core/lib/common';

export namespace BulkEditCommands {
    // const BULKEDIT_CATEGORY = 'BulkEdit';
    export const TOGGLE_VIEW: Command = {
        id: 'bulk-edit:toggleView'
    };

    export const APPLY: Command = {
        id: 'bulk-edit:apply',
        // category: BULKEDIT_CATEGORY,
        iconClass: 'codicon codicon-check'
    };

    export const DISCARD: Command = {
        id: 'bulk-edit:discard',
        // category: BULKEDIT_CATEGORY,
        iconClass: 'clear-all'
    };

    export const TOGGLE: Command = {
        id: 'bulk-edit:toggle'
    };

    export const GROUP_BY_FILE: Command = {
        id: 'bulk-edit:groupByFile'
    };

    export const GROUP_BY_TYPE: Command = {
        id: 'bulk-edit:groupByType'
    };

    export const TOGGLE_GROUPING: Command = {
        id: 'bulk-edit:toggleGrouping'
    };

    // export const LOCK__WIDGET: Command = {
    //     id: 'bulk-edit:widget:lock',
    //     category: BULKEDIT_CATEGORY,
    //     iconClass: 'fa fa-unlock'
    // };

    // export const UNLOCK__WIDGET: Command = {
    //     id: 'bulk-edit:widget:unlock',
    //     category: BULKEDIT_CATEGORY,
    //     iconClass: 'fa fa-lock'
    // };

    // export const CLEAR__QUICK_PICK: Command = {
    //     id: 'bulk-edit:pick-clear',
    //     label: 'Clear bulk-edit Channel...',
    //     category: BULKEDIT_CATEGORY
    // };

    // export const SHOW__QUICK_PICK: Command = {
    //     id: 'bulk-edit:pick-show',
    //     label: 'Show bulk-edit Channel...',
    //     category: BULKEDIT_CATEGORY
    // };

    // export const HIDE__QUICK_PICK: Command = {
    //     id: 'bulk-edit:pick-hide',
    //     label: 'Hide bulk-edit Channel...',
    //     category: BULKEDIT_CATEGORY
    // };

    // export const DISPOSE__QUICK_PICK: Command = {
    //     id: 'bulk-edit:pick-dispose',
    //     label: 'Close bulk-edit Channel...',
    //     category: BULKEDIT_CATEGORY
    // };

    // export const COPY_ALL: Command = {
    //     id: 'bulk-edit:copy-all',
    // };
}
