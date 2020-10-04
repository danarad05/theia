/* eslint-disable @typescript-eslint/tslint/config */
import { test2 } from './test12dd';

export class test3 {
    A(): void {
        const r = new test2();
        r.f1();
    }

    B(): void {
        this.A();
    }
}
