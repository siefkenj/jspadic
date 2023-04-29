import { ensureCompatible } from "../primitive/padic-primitive";
import { PAdicInterface } from "../types";
import { MAX_DIGITS, PAdicAbstract } from "./padic";

export class PAdicSum extends PAdicAbstract implements PAdicInterface {
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
        this.#computeMoreDigits(5);
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
            this.#computeMoreDigits(indexPos - this.#digitsCache.length);
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
        // Compute digits and add them together until we get a non-zero.
        // The resulting position will be the valuation.
        const leftValuation = this.#left.valuation();
        const rightValuation = this.#right.valuation();
        if (leftValuation === Infinity) {
            this.#valuation = rightValuation;
            return;
        }
        if (rightValuation === Infinity) {
            this.#valuation = leftValuation;
            return;
        }

        let baseValuation = Math.min(leftValuation, rightValuation);
        // Start computing digits
        const cache: number[] = [];
        let digit = 0;
        let carry = this.#lastCarry;
        let pos = baseValuation;
        // `cache` may need to be initialized with zeros if `baseValuation` starts out positive.
        if (baseValuation > 0) {
            cache.length = baseValuation;
            cache.fill(0);
        }
        do {
            const sum =
                this.#left.numericDigitAt(pos) +
                this.#right.numericDigitAt(pos) +
                carry;
            digit = sum % this.base;
            carry = Math.floor((sum - digit) / this.base);
            if (digit !== 0 || pos >= 0) {
                cache.push(digit);
            }
            pos++;
        } while (digit === 0 && pos < MAX_DIGITS);

        this.#valuation = pos - 1;
        this.#digitsCache = cache;
        this.#lastCarry = carry;

        if (pos === MAX_DIGITS) {
            console.warn(
                `Computed ${MAX_DIGITS} digits and got all zero; approximating the number as zero`
            );
            this.#valuation = Infinity;
        }
    }
    #computeMoreDigits(num = 10) {
        const cache: number[] = [];
        let digit = 0;
        let carry = this.#lastCarry;
        let pos = this.#digitsCache.length + Math.min(this.#valuation, 0);
        let numComputed = 0;
        do {
            const sum =
                this.#left.numericDigitAt(pos) +
                this.#right.numericDigitAt(pos) +
                carry;
            digit = sum % this.base;
            carry = Math.floor((sum - digit) / this.base);
            cache.push(digit);
            pos++;
            numComputed++;
        } while (numComputed < num);
        this.#digitsCache.push(...cache);
        this.#lastCarry = carry;
    }
}
