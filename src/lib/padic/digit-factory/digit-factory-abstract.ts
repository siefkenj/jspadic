import { DigitFactory } from "../types";

export class DigitFactoryAbstract implements DigitFactory {
    readonly type = "digit-factory";
    shift = 0;
    at(pos: number): number {
        return this._rawAt(pos - this.shift)
    }
    _rawAt(pos: number): number {
        throw new Error(`Subclasses must implement this method`);
    }
    initialDigits(len: number) {
        return Array.from({ length: len }).map((_, i) => this.at(i));
    }
}
