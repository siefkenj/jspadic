import { bigIntToBase } from "../bigint-to-base";
import { valuationToPrettyFraction } from "./formatting";

const MAX_OVERFLOW = 1000;

export const padic = {
    /** Compute the `base`-adic valuation of a number */
    valuation: (num: bigint, base: number): number => {
        if (num === 0n) {
            return -Infinity;
        }
        if (base < 2) {
            return NaN;
        }
        const trueBase = BigInt(base);
        let ret = 0n;
        let overflow = 0;
        while (num % trueBase ** (ret + 1n) === 0n && overflow < MAX_OVERFLOW) {
            ret += 1n;
            overflow++;
        }
        if (overflow >= MAX_OVERFLOW) {
            throw new Error(
                `Could not find the valuation of ${num}; hit maximum overflow`
            );
        }
        return Number(ret);
    },
    /** Find the distance between two `base`-adic numbers */
    dist: (num1: bigint, num2: bigint, base: number): number => {
        return padic.valuation(num1 > num2 ? num1 - num2 : num2 - num1, base);
    },
    /** Return an approximation to the negation to `num`. The number of
     * digits returned will be `digits`
     */
    neg: (num: bigint, base: number, digits = 20): bigint => {
        digits = Math.max(digits, bigIntToBase(num, base).length + 1);
        const negOne = BigInt((base - 1).toString(base).repeat(digits));
        return negOne * num;
    },
};

export { valuationToPrettyFraction };
