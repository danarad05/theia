/********************************************************************************
 * Copyright (C) 2021 Ericsson and others.
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

import { MessageService } from '@theia/core';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { FrontendApplicationConfigProvider } from '@theia/core/lib/browser/frontend-application-config-provider';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
import { inject, injectable } from '@theia/core/shared/inversify';
import { MiniBrowserEndpoint } from '../common/mini-browser-endpoint';
import { MiniBrowserEnvironment } from './environment/mini-browser-environment';

@injectable()
export class MiniBrowserFrontendSecurityWarnings implements FrontendApplicationContribution {

    @inject(WindowService)
    protected windowService: WindowService;

    @inject(MessageService)
    protected messageService: MessageService;

    @inject(MiniBrowserEnvironment)
    protected miniBrowserEnvironment: MiniBrowserEnvironment;

    initialize(): void {
        this.checkHostPattern();
    }

    protected async checkHostPattern(): Promise<void> {
        if (FrontendApplicationConfigProvider.get()['warnOnPotentiallyInsecureHostPattern'] === false) {
            return;
        }
        const hostPattern = await this.miniBrowserEnvironment.hostPatternPromise;
        if (hostPattern !== MiniBrowserEndpoint.HOST_PATTERN_DEFAULT) {
            this.messageService.warn(`\
The mini-browser endpoint's host pattern has been changed to \`${hostPattern}\`; changing the pattern can lead to security vulnerabilities. \
See \`@theia/mini-browser/README.md\` for more information.`,
            /* actions: */ 'Ok', 'Go To README',
            ).then(action => {
                if (action === 'Go To README') {
                    this.windowService.openNewWindow('https://www.npmjs.com/package/@theia/mini-browser', { external: true });
                }
            });
        }
    }
}
