import { PAdicInterface } from "../types";
import { PAdicAbstract } from "./padic";

export class PAdicNegation extends PAdicAbstract implements PAdicInterface {
    #left: PAdicInterface;
    #valuation: number = 0;
    constructor(left: PAdicInterface) {
        super();
        this.#left = left;
        this.base = this.#left.base;
        this.#valuation = this.#left.valuation();
    }

    numericDigitAt(pos: number): number {
        // The position in `#digitsCache` of the requested digit.
        if (pos < this.#valuation) {
            return 0;
        }
        if (pos === this.#valuation) {
            return this.base - this.#left.numericDigitAt(pos);
        }
        return this.base - this.#left.numericDigitAt(pos) - 1;
    }

    valuation(): number {
        return this.#valuation;
    }
}
