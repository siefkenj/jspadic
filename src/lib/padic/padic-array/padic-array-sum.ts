import { PAdicArrayAbstract } from "./padic-array-abstract";
import { EnsureBase } from "./base";
import { PAdicArrayInterface } from "./types";

export class PAdicArraySum
    extends PAdicArrayAbstract
    implements PAdicArrayInterface
{
    #left: PAdicArrayInterface;
    #right: PAdicArrayInterface;
    #sum: _PAdicArraySum;
    #withBase?: EnsureBase;
    constructor(left: PAdicArrayInterface, right: PAdicArrayInterface) {
        super();
        this.#left = left;
        this.#right = right;

        if (left.lowestPower !== right.lowestPower) {
            left = left.clone();
            right = right.clone();
        }
        const minLowestPower = Math.min(left.lowestPower, right.lowestPower);
        left.lowestPower -= minLowestPower;
        right.lowestPower -= minLowestPower;
        this.lowestPower = minLowestPower;

        this.#sum = new _PAdicArraySum(left, right);
    }
    _rawAt(pos: number) {
        if (this.#withBase) {
            return this.#withBase._rawAt(pos);
        }
        return this.#sum.digit(pos);
    }
    setBase(base: number): PAdicArrayAbstract & { base: number } {
        this.base = base;
        this.#withBase = new EnsureBase(this.base, this.#sum);
        return this as any;
    }
    clone() {
        const ret = new PAdicArraySum(this.#left, this.#right);
        ret.lowestPower = this.lowestPower;
        if (this.base) {
            ret.setBase(this.base);
        }
        return ret;
    }
}

class _PAdicArraySum extends PAdicArrayAbstract implements PAdicArrayInterface {
    #left: PAdicArrayInterface;
    #right: PAdicArrayInterface;
    constructor(left: PAdicArrayInterface, right: PAdicArrayInterface) {
        super();
        this.#left = left;
        this.#right = right;
    }
    _rawAt(pos: number) {
        return this.#left.digit(pos) + this.#right.digit(pos);
    }
}
