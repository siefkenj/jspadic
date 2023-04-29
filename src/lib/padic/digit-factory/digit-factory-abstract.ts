import { DigitFactory } from "../types";

export class DigitFactoryAbstract implements DigitFactory {
    readonly type = "digit-factory";
    at(pos: number): number {
        throw new Error(`Subclasses must implement this method`);
    }
    digits(len: number) {
        return Array.from({ length: len }).map((_, i) => this.at(i));
    }
}
