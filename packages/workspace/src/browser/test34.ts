/* eslint-disable @typescript-eslint/tslint/config */
import { test25 } from './test12dd';

export class test5 {
    A(): void {
        const r = new test25();
        r.f1();
    }

    B(): void {
        this.A();
    }
}
