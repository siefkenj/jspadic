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
        return "NaN"
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