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

// import { injectable, inject, named, postConstruct } from 'inversify';
// import { Position, DocumentUri } from 'vscode-languageserver-types';
// import { BulkEdit } from './bulk-edit';
// import { ContributionProvider } from '@theia/core/lib/common';
// import { LanguageSelector, score } from '../common/language-selector';
// import URI from '@theia/core/lib/common/uri';
// import { Disposable } from '@theia/core/lib/common';
// import { CancellationToken } from '@theia/core';

export const BulkEditService = Symbol('BulkEditService');

export interface BulkEditService {

    // readonly selector: LanguageSelector;

    // getRootDefinition(uri: DocumentUri, position: Position, cancellationToken: CancellationToken): Promise<Definition | undefined>
    // getCallers(definition: Definition, cancellationToken: CancellationToken): Promise<Caller[] | undefined>
    // getCallees?(definition: Definition, cancellationToken: CancellationToken): Promise<Callee[] | undefined>
}

// @injectable()
// export class BulkEditServiceProvider {

//     @inject(ContributionProvider) @named(BulkEditService)
//     protected readonly contributions: ContributionProvider<BulkEditService>;

//     private services: BulkEditService[] = [];

//     @postConstruct()
//     init(): void {
//         this.services = this.services.concat(this.contributions.getContributions());
//     }

//     get(languageId: string, uri: URI): BulkEditService | undefined {
//         return this.services.sort(
//             (left, right) =>
//                 score(right.selector, uri.scheme, uri.path.toString(), languageId, true) - score(left.selector, uri.scheme, uri.path.toString(), languageId, true))[0];
//     }

//     add(service: BulkEditService): Disposable {
//         this.services.push(service);
//         const that = this;
//         return {
//             dispose: () => {
//                 that.remove(service);
//             }
//         };
//     }

//     private remove(service: BulkEditService): boolean {
//         const length = this.services.length;
//         this.services = this.services.filter(value => value !== service);
//         return length !== this.services.length;
//     }
// }
