import { DigitFactory } from "../types";
import { PAdicArrayPrimitive } from "./padic-array-primitive";
import { PAdicArrayProd } from "./padic-array-prod";
import { PAdicArraySum } from "./padic-array-sum";
import { PAdicArrayInterface } from "./types";
import { enumerateWords } from "./utils";

/**
 * Compute the sum of two `PAdicInterface` objects.
 */
export function sum(
    a: PAdicArrayInterface,
    b: PAdicArrayInterface
): PAdicArrayInterface {
    const ret = new PAdicArraySum(a, b);
    if (a.base && a.base === b.base) {
        ret.setBase(a.base);
    }
    return ret;
}

/**
 * Compute the product of two `PAdicInterface` objects.
 */
export function prod(
    a: PAdicArrayInterface,
    b: PAdicArrayInterface
): PAdicArrayInterface {
    const ret = new PAdicArrayProd(a, b);
    if (a.base && a.base === b.base) {
        ret.setBase(a.base);
    }
    return ret;
}

/**
 * Compute the difference of two `PAdicInterface` objects.
 */
export function diff(
    a: PAdicArrayInterface,
    b: PAdicArrayInterface
): PAdicArrayInterface {
    const ret = new PAdicArraySum(
        a,
        new PAdicArrayProd(b, new PAdicArrayPrimitive([-1]))
    );
    if (a.base && a.base === b.base) {
        ret.setBase(a.base);
    }
    return ret;
}

/**
 * Negate a `PAdicInterface` object.
 */
export function negate(a: PAdicArrayInterface): PAdicArrayInterface {
    const ret = new PAdicArrayProd(a, new PAdicArrayPrimitive([-1]));
    if (a.base) {
        ret.setBase(a.base);
    }
    return ret;
}

/**
 * Find all solutions that make `formula` evaluate to all zeros.
 */
export function solve(
    base: number,
    formula: (a: PAdicArrayInterface) => PAdicArrayInterface,
    MAX_SEARCH_DIGITS = 1
) {
    let possibleSolutions: number[][] = [[]];
    let digitsComputed = 0;

    function extendGuessesByOneDigit() {
        const ret: number[][] = [];
        for (let i = 0; i < possibleSolutions.length; i++) {
            const knownDigits = possibleSolutions[i];
            const possibleExtensions: Set<number> = new Set();

            for (const newDigits of enumerateWords(MAX_SEARCH_DIGITS, base)) {
                const digitsGuess = knownDigits.concat(newDigits);
                const resultingNum = formula(
                    new PAdicArrayPrimitive(digitsGuess).setBase(base)
                );

                // All the digits up to and including the newest digit should
                // be zero.
                if (isZero(resultingNum.digits(knownDigits.length + 1))) {
                    possibleExtensions.add(newDigits[0]);
                }
            }
            for (const digit of possibleExtensions) {
                ret.push(knownDigits.concat([digit]));
            }
        }
        return ret;
    }

    return {
        /**
         * Compute `num` number of digits of the solution set.
         */
        computeDigits(num: number) {
            for (; digitsComputed < num; digitsComputed++) {
                possibleSolutions = extendGuessesByOneDigit();
            }
        },
        /**
         * Get the currently computed digits of solutions. `computeDigits(...)` must
         * be called to recompute these values with more digits.
         */
        getPossibleSolutions() {
            return possibleSolutions;
        },
    };
}

function isZero(arr: number[]) {
    return arr.every((v) => v === 0);
}
