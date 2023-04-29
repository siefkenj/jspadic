import { DigitFactory } from "../types";
import { DigitFactoryAbstract } from "./digit-factory-abstract";

export class DigitFactoryProd
    extends DigitFactoryAbstract
    implements DigitFactory
{
    readonly type = "digit-factory";
    #left: DigitFactory;
    #right: DigitFactory;
    #cache: number[] = [];

    constructor(left: DigitFactory, right: DigitFactory) {
        super();
        this.#left = left;
        this.#right = right;
    }

    at(pos: number) {
        if (this.#cache[pos] !== undefined) {
            return this.#cache[pos];
        }
        const ret = reverseDotProd(
            this.#left.digits(pos + 1),
            this.#right.digits(pos + 1)
        );
        this.#cache[pos] = ret;
        return ret;
    }
}

/**
 * Compute `arr1 dot arr2` but reverse the order of the digits of `arr2`.
 */
function reverseDotProd(arr1: number[], arr2: number[]): number {
    if (arr1.length !== arr2.length) {
        throw new Error(`Arrays must have the same length`);
    }
    let ret = 0;
    for (let i = 0, j = arr1.length - 1; i < arr1.length; i++, j--) {
        ret += arr1[i] * arr2[j];
    }
    return ret;
}
