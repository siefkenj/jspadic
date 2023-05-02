import { DigitFactory } from "../types";
import { DigitFactoryAbstract } from "./digit-factory-abstract";
import { DigitFactoryPrimitive } from "./digit-factory-primitive";
import { DigitFactoryWithBase } from "./digit-factory-with-base";

/**
 * A `DigitFactory` object that attempts to find a solution so that the given input formula
 * equals zero.
 *
 * Returns the lexicographically smallest solution, if a solution exists.
 */
export class DigitFactorySolve
    extends DigitFactoryWithBase
    implements DigitFactory
{
    readonly type = "digit-factory";

    MAX_SEARCH_DIGITS = 1;
    #formula: (a: DigitFactoryWithBase) => DigitFactory;
    #cache: number[] = [];

    constructor(
        base: number,
        formula: (a: DigitFactoryWithBase) => DigitFactory
    ) {
        super(base, new DigitFactoryAbstract());
        this.#formula = formula;
    }

    _rawAt(pos: number) {
        if (pos < 0) {
            return 0;
        }
        if (pos < this.#cache.length) {
            return this.#cache[pos];
        }

        // We need to guess the next digit.
        while (this.#cache.length <= pos) {
            this.#guessNextDigit();
        }
        return this.#cache[pos];
    }

    #guessNextDigit() {
        const knownDigits = [...this.#cache];

        for (const newDigits of enumerateWords(
            this.MAX_SEARCH_DIGITS,
            this.base
        )) {
            const digitsGuess = knownDigits.concat(newDigits);
            const resultingNum = this.#formula(
                new DigitFactoryWithBase(
                    this.base,
                    new DigitFactoryPrimitive(digitsGuess)
                )
            );
 
            // All the digits up to and including the newest digit should
            // be zero.
            if (isZero(resultingNum.initialDigits(knownDigits.length + 1))) {
                this.#cache.push(newDigits[0]);
                break;
            }
        }

        if (this.#cache.length === knownDigits.length) {
            // We didn't add any new digits, so there is no solution
            // to be found.
            throw new Error(
                `Could not find solution starting with digits ${this.#cache}`
            );
        }
    }
}

export function* enumerateWords(len: number, base: number) {
    for (let i = 0; i < base ** len; i++) {
        const ret = [];
        let num = i;
        for (let pow = 1; pow <= len; pow++) {
            ret.push(num % base);
            num = Math.floor(num / base);
        }
        yield ret.reverse();
    }
}

function isZero(arr: number[]) {
    return arr.every((v) => v === 0);
}
