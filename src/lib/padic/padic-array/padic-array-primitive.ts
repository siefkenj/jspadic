import { PAdicArrayAbstract } from "./padic-array-abstract";
import { EnsureBase } from "./base";
import { PAdicArrayInterface } from "../types";

export class PAdicArrayPrimitive
    extends PAdicArrayAbstract
    implements PAdicArrayInterface
{
    #digits: number[] = [];
    #withBase?: EnsureBase;
    constructor(digits: number[] = []) {
        super();
        this.#digits = digits;
    }
    _rawAt(pos: number) {
        if (this.#withBase) {
            return this.#withBase._rawAt(pos);
        }
        return this.#digits[pos] || 0;
    }
    setBase(base: number): PAdicArrayAbstract & { base: number } {
        this.base = base;
        this.#withBase = new EnsureBase(this.base, this.#digits);
        return this as any;
    }
    clone() {
        const ret = new PAdicArrayPrimitive(this.#digits);
        ret.lowestPower = this.lowestPower;
        if (this.base) {
            ret.setBase(this.base);
        }
        return ret;
    }
}
