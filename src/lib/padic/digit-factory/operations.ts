import { DigitFactory } from "../types";
import { DigitFactoryPrimitive } from "./digit-factory-primitive";
import { DigitFactoryProd } from "./digit-factory-prod";
import { enumerateWords } from "./digit-factory-solve";
import { DigitFactorySum } from "./digit-factory-sum";
import { DigitFactoryWithBase } from "./digit-factory-with-base";

/**
 * Compute the sum of two `DigitFactory` objects.
 */
export function sum(
    a: DigitFactoryWithBase,
    b: DigitFactoryWithBase
): DigitFactoryWithBase {
    if (a.base !== b.base) {
        throw new Error(`Cannot add items with different bases`);
    }
    return new DigitFactoryWithBase(a.base, new DigitFactorySum(a, b));
}

/**
 * Compute the product of two `DigitFactory` objects.
 */
export function prod(
    a: DigitFactoryWithBase,
    b: DigitFactoryWithBase
): DigitFactoryWithBase {
    if (a.base !== b.base) {
        throw new Error(`Cannot add items with different bases`);
    }
    return new DigitFactoryWithBase(a.base, new DigitFactoryProd(a, b));
}

/**
 * Compute the difference of two `DigitFactory` objects.
 */
export function diff(
    a: DigitFactoryWithBase,
    b: DigitFactoryWithBase
): DigitFactoryWithBase {
    if (a.base !== b.base) {
        throw new Error(`Cannot add items with different bases`);
    }
    return new DigitFactoryWithBase(
        a.base,
        new DigitFactorySum(
            a,
            new DigitFactoryProd(b, new DigitFactoryPrimitive([-1]))
        )
    );
}

/**
 * Find all solutions that make `formula` evaluate to all zeros.
 */
export function solve(
    base: number,
    formula: (a: DigitFactoryWithBase) => DigitFactory,
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
                    new DigitFactoryWithBase(
                        base,
                        new DigitFactoryPrimitive(digitsGuess)
                    )
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
