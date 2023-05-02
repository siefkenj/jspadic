import { PAdicArrayPrimitive } from "./padic-array-primitive";
import { PAdicArrayInterface } from "./types";

export class EnsureBase {
    base: number = 10;
    #digits: PAdicArrayInterface;
    #cache: number[] = [];
    #carry: number = 0;
    constructor(base: number, digits: number[] | PAdicArrayInterface = []) {
        this.#digits = Array.isArray(digits)
            ? new PAdicArrayPrimitive(digits)
            : digits;
        this.base = base;
    }
    _rawAt(pos: number) {
        if (pos < 0) {
            return 0;
        }
        if (pos < this.#cache.length) {
            return this.#cache[pos];
        }
        // We need to compute!
        while (this.#cache.length <= pos) {
            const nextPos = this.#cache.length;
            const rawValue = this.#digits.digit(nextPos) + this.#carry;
            const computedValue = rawValue % this.base;
            this.#carry = (rawValue - computedValue) / this.base;

            // If the computed value is negative, we deduct from our
            // carry and return a positive
            if (computedValue < 0) {
                this.#cache.push(this.base + computedValue);
                this.#carry -= 1;
            } else {
                this.#cache.push(computedValue);
            }
        }
        return this.#cache[pos];
    }
}
