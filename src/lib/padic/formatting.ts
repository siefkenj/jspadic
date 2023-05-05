import { PAdicPrimitive } from "./padic-array/padic-array-primitive";
import { PAdicBasic } from "./types";

/**
 * Insert the radix point at `radix` places to the left of `repr`.
 */
export function insertRadix(str: string, radix: number): string {
    if (radix === 0) {
        return str;
    }
    return `${str.slice(0, str.length - radix)}.${str.slice(
        str.length - radix
    )}`;
}

/**
 * Creates a latex-formatted version of the valuation.
 */
export function valuationToPrettyFraction(v: number, base: number): string {
    if (isNaN(v) || base < 2) {
        return "NaN";
    }
    if (v === -Infinity) {
        return "0";
    }
    if (v === 0) {
        return "1";
    }
    if (v === 1) {
        return `\\frac{1}{${base}}`;
    }
    return `\\frac{1}{${base}^{${v}}}`;
}

/**
 * Print a `PAdicBasic` to a string. This function prints as traditional
 * numbers (i.e., with a `-` sign in front if they're negative) not as padics.
 */
export function printPadicBasic(padic: PAdicBasic, base?: number): string {
    // Printing a PAdicBasic is the same as printing a PAdic, but negatives
    // are printed with a `-` sign instead.
    const obj = new PAdicPrimitive(padic.repr).setBase(padic.base);
    if (base) {
        obj.setBase(base)
    }
    obj.lowestPower = -padic.radix;

    let ret = obj.toString(100);
    if (padic.sign < 0 && ret !== "0") {
        ret = "-" + ret;
    }
    return ret;
}
