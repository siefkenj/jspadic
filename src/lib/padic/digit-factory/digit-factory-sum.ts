import { DigitFactory } from "../types";
import { DigitFactoryAbstract } from "./digit-factory-abstract";

export class DigitFactorySum
    extends DigitFactoryAbstract
    implements DigitFactory
{
    readonly type = "digit-factory";
    #left: DigitFactory;
    #right: DigitFactory;
    constructor(left: DigitFactory, right: DigitFactory) {
        super();
        this.#left = left;
        this.#right = right;
    }
    at(pos: number) {
        return this.#left.at(pos) + this.#right.at(pos);
    }
}
