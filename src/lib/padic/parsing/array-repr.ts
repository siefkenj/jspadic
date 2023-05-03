/**
 * Convert a string representation (written with most significant digit on the left)
 * to an array of numbers in base `base`. The representation must be in a base between 2 and 36.
 */
export function stringToArray(str: string, base: number): number[] {
    const digits = str
        .replace(/[^a-zA-Z0-9]/g, "")
        .split("")
        .reverse()
        .map((d) => parseInt(d, 36));
    return normalizeArrayRepr(digits, base);
}

/**
 * Digits are returned with most-significant digit on the left (opposite the order of the input array).
 */
export function arrayToString(arr: number[], base: number | bigint): string {
    base = Number(base);
    ensureBase(base);
    if (base > 36) {
        throw new Error(
            `Can only make a string representation for a number with a base between 2 and 36, not ${base}`
        );
    }
    arr = normalizeArrayRepr(arr, base);
    return [...arr]
        .reverse()
        .map((d) => d.toString(base as number))
        .join("");
}

/**
 * Convert an array of digits in base `base` to a BigInt. The digits are specified
 * least-significant first.
 */
export function arrayToBigInt(arr: number[], base: number | bigint): bigint {
    ensureBase(base);
    const trueBase = BigInt(base);
    let ret: bigint = 0n;
    let i = 0n;
    for (const digit of arr) {
        ret += BigInt(digit) * trueBase ** i;
        i++;
    }
    return ret;
}

/**
 * Convert a bigint to an array in base `base`. Least significant digit first.
 */
export function bigIntToArray(num: bigint, base: number | bigint): number[] {
    ensureBase(base);
    const trueBase = BigInt(base);
    const ret: number[] = [];
    let remaining = num;
    while (remaining !== 0n) {
        ret.push(Number(remaining % trueBase));
        remaining = remaining / trueBase;
    }
    return ret;
}

/**
 * Ensure that the digits of `arr` are in the range [0, base), recomputing with carry
 * if they are not.
 */
export function normalizeArrayRepr(arr: number[], base: number): number[] {
    ensureBase(base);
    function inRange(num: number) {
        return num >= 0 && num < base;
    }
    if (arr.every(inRange)) {
        return arr;
    }

    let carry = 0;
    const ret: number[] = [];
    for (let digit of arr) {
        digit += carry;
        if (inRange(digit)) {
            ret.push(digit);
            carry = 0;
            continue;
        }
        if (digit < 0) {
            throw new Error(`Normalizing negative digits is not supported`);
        }
        // If the digit is not in range, we need carry over its excess to the next digit
        const newDigit = digit % base;
        carry = (digit - newDigit) / base;
        ret.push(newDigit);
    }
    // Handle whatever is left in the carry
    while (carry > 0) {
        const digit = carry % base;
        ret.push(digit);
        carry = (carry - digit) / base;
    }

    return ret;
}

/**
 * Add two numbers in array representation.
 */
export function addArr(arr1: number[], arr2: number[], base: number): number[] {
    return bigIntToArray(
        arrayToBigInt(arr1, base) + arrayToBigInt(arr2, base),
        base
    );
}

/**
 * Multiply two numbers in array representation.
 */
export function mulArr(arr1: number[], arr2: number[], base: number): number[] {
    return bigIntToArray(
        arrayToBigInt(arr1, base) * arrayToBigInt(arr2, base),
        base
    );
}

function ensureBase(base: number | bigint) {
    if (
        (typeof base === "number" && (Math.floor(base) !== base || base < 2)) ||
        (typeof base === "bigint" && base < 2n)
    ) {
        throw new Error(
            `Number base must be an integer that is at least 2, not ${base}`
        );
    }
}
