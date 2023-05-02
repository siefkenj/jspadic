import { BasedDigitFactory, DigitFactory } from "../types";
import { DigitFactoryAbstract } from "./digit-factory-abstract";
import { DigitFactoryPrimitive } from "./digit-factory-primitive";

/**
 * Implements `DigitFactory`, but rounds and carries over
 * any digits that are above `this.base`, so that the resulting digits
 * can be used as in a positional number system.
 */
export class DigitFactoryWithBase
    extends DigitFactoryAbstract
    implements BasedDigitFactory
{
    #base: number = 10;
    #factory: DigitFactory;
    #cache: number[] = [];
    #carry: number = 0;
    constructor(base: number, digitFactory?: DigitFactory) {
        super();
        this.#factory = digitFactory || new DigitFactoryPrimitive();
        this.#base = base;
    }
    get base() {
        return this.#base;
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
            const rawValue = this.#factory.at(nextPos) + this.#carry;
            const computedValue = rawValue % this.#base;
            this.#carry = (rawValue - computedValue) / this.#base;

            // If the computed value is negative, we deduct from our
            // carry and return a positive
            if (computedValue < 0) {
                this.#cache.push(this.#base + computedValue);
                this.#carry -= 1;
            } else {
                this.#cache.push(computedValue);
            }
        }
        return this.#cache[pos];
    }
}
