import { PAdicAbstract } from "./padic-array-abstract";
import { EnsureBase } from "./base";
import { PAdicInterface } from "../types";

export class PAdicSum
    extends PAdicAbstract
    implements PAdicInterface
{
    #left: PAdicInterface;
    #right: PAdicInterface;
    #sum: _PAdicArraySum;
    #withBase?: EnsureBase;
    constructor(left: PAdicInterface, right: PAdicInterface) {
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
    setBase(base: number): PAdicAbstract & { base: number } {
        this.base = base;
        this.#withBase = new EnsureBase(this.base, this.#sum);
        return this as any;
    }
    clone() {
        const ret = new PAdicSum(this.#left, this.#right);
        ret.lowestPower = this.lowestPower;
        if (this.base) {
            ret.setBase(this.base);
        }
        return ret;
    }
}

class _PAdicArraySum extends PAdicAbstract implements PAdicInterface {
    #left: PAdicInterface;
    #right: PAdicInterface;
    constructor(left: PAdicInterface, right: PAdicInterface) {
        super();
        this.#left = left;
        this.#right = right;
    }
    _rawAt(pos: number) {
        return this.#left.digit(pos) + this.#right.digit(pos);
    }
}
