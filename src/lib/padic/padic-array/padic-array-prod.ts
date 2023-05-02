import { PAdicArrayAbstract } from "./padic-array-abstract";
import { EnsureBase } from "./base";
import { PAdicArrayInterface } from "./types";

export class PAdicArrayProd
    extends PAdicArrayAbstract
    implements PAdicArrayInterface
{
    #left: PAdicArrayInterface;
    #right: PAdicArrayInterface;
    #prod: _PAdicArrayProd;
    #withBase?: EnsureBase;
    constructor(left: PAdicArrayInterface, right: PAdicArrayInterface) {
        super();
        this.#left = left;
        this.#right = right;

        if (left.lowestPower !== 0) {
            left = left.clone();
        }
        if (right.lowestPower !== 0) {
            right = right.clone();
        }
        this.lowestPower = left.lowestPower + right.lowestPower;
        left.lowestPower = 0;
        right.lowestPower = 0;
        this.#prod = new _PAdicArrayProd(left, right);
    }
    _rawAt(pos: number) {
        if (this.#withBase) {
            return this.#withBase._rawAt(pos);
        }
        return this.#prod.digit(pos);
    }
    setBase(base: number): PAdicArrayAbstract & { base: number } {
        this.base = base;
        this.#withBase = new EnsureBase(this.base, this.#prod);
        return this as any;
    }
    clone() {
        const ret = new PAdicArrayProd(this.#left, this.#right);
        ret.lowestPower = this.lowestPower;
        if (this.base) {
            ret.setBase(this.base);
        }
        return ret;
    }
}

class _PAdicArrayProd
    extends PAdicArrayAbstract
    implements PAdicArrayInterface
{
    #left: PAdicArrayInterface;
    #right: PAdicArrayInterface;
    #cache: number[] = [];
    constructor(left: PAdicArrayInterface, right: PAdicArrayInterface) {
        super();
        this.#left = left;
        this.#right = right;
    }
    _rawAt(pos: number) {
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
    clone() {
        const ret = new PAdicArrayProd(this.#left, this.#right);
        ret.lowestPower = this.lowestPower;
        if (this.base) {
            ret.setBase(this.base);
        }
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
