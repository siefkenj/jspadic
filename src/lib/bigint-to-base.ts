/**
 *
 * Convert `n` to a particular base.
 */
export function bigIntToBase(
    n: bigint | typeof NaN | string,
    base: number
): string {
    if (Number.isNaN(n) || base < 2 || base > 36) {
        return "NaN";
    }
    if (typeof n === "string") {
        n = BigInt(n);
    }
    return n.toString(base);
}
