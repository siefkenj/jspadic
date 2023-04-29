import { ensureCompatible } from "../primitive/padic-primitive";
import { arrayToBigInt, bigIntToArray } from "../primitive/parsing/array-repr";
import { PAdicInterface } from "../types";
import { MAX_DIGITS, PAdicAbstract } from "./padic";

export class PAdicProduct extends PAdicAbstract implements PAdicInterface {
    #left: PAdicInterface;
    #right: PAdicInterface;
    #digitsCache: number[] = [];
    #valuation: number = 0;
    #lastCarry: number = 0;
    constructor(left: PAdicInterface, right: PAdicInterface) {
        ensureCompatible(left, right);
        super();
        this.#left = left;
        this.#right = right;
        this.base = this.#left.base;
        this.#initValuation();
    }

    _cache() {
        const before = [...this.#digitsCache];
        const after = [...this.#digitsCache];
        return { before, after };
    }

    numericDigitAt(pos: number): number {
        // The position in `#digitsCache` of the requested digit.
        let indexPos = pos;
        if (this.#valuation < 0) {
            indexPos -= this.#valuation;
        }
        if (indexPos < 0) {
            return 0;
        }
        if (indexPos >= this.#digitsCache.length) {
            return 0;
        }
        return this.#digitsCache[indexPos];
    }

    valuation(): number {
        return this.#valuation;
    }

    /**
     * Initialize the valuation for this sum. This is required
     * for other computations (so that we can properly estimate precision).
     */
    #initValuation() {
        const leftValuation = this.#left.valuation();
        const rightValuation = this.#right.valuation();
        // Bail early if we're multiplying by zero
        if (leftValuation === Infinity || rightValuation === Infinity) {
            this.#valuation = Infinity;
            return;
        }
        let minImportantDigit = Math.min(
            this.#left.valuation(),
            this.#right.valuation(),
            0
        );
        const bigIntSize = MAX_DIGITS - minImportantDigit;
        const leftDigits = Array.from({ length: bigIntSize }).map((_, i) =>
            this.#left.numericDigitAt(i + minImportantDigit)
        );
        const rightDigits = Array.from({ length: bigIntSize }).map((_, i) =>
            this.#right.numericDigitAt(i + minImportantDigit)
        );
        const leftNum = arrayToBigInt(leftDigits, this.base);
        const rightNum = arrayToBigInt(rightDigits, this.base);

        const prod = leftNum * rightNum;
        this.#digitsCache = bigIntToArray(prod, this.base);

        let baseValuation = 2 * minImportantDigit;
        // Now that we've computed the product, we can estimate the valuation
        while (this.#digitsCache[0] === 0 && baseValuation < 0) {
            this.#digitsCache.shift();
            baseValuation += 1;
        }
        if (baseValuation < 0) {
            this.#valuation = baseValuation;
        } else {
            this.#valuation = this.#digitsCache.findIndex((n) => n !== 0);
            if (this.#valuation === -1) {
                // If there were only zeros in the product array, we are approximately zero
                console.warn(
                    `Computed ${MAX_DIGITS} digits and got all zero; approximating the number as zero`
                );
                this.#valuation = Infinity;
            }
        }
    }
}
