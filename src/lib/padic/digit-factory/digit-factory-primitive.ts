import { DigitFactory } from "../types";
import { DigitFactoryAbstract } from "./digit-factory-abstract";

export class DigitFactoryPrimitive
    extends DigitFactoryAbstract
    implements DigitFactory
{
    readonly type = "digit-factory";
    #digits: number[] = [];
    constructor(digits: number[] = []) {
        super();
        this.#digits = digits;
    }
    at(pos: number) {
        return this.#digits[pos] || 0;
    }
}
