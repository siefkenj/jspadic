/**
 * Parse the string `str` into a BigInt of in base `base`. Returns `NaN` if
 * the parsing fails. Whitespace is trimmed, but other characters must be appropriate
 * for the base.
 */
export function parseBigInt(str: string, base: number): bigint | typeof NaN {
    str = str.replace(/\s*/g, "");
    if (base === 10) {
        return BigInt(str);
    }
    if (base <= 1 || base > 36) {
        return NaN;
    }
    try {
        let ret = 0n;
        let place = 0n;
        const bigIntBase = BigInt(base);
        for (const digit of str.split("").reverse()) {
            ret += BigInt(parseInt(digit, 36)) * bigIntBase ** place;
            place += 1n;
        }
        return ret;
    } catch {
        console.warn(`Could not convert "${str}" to integer in base ${base}`);
    }

    return NaN;
}

export function parseBigIntOrThrow(
    str: string,
    base: number
): bigint {
    str = str.replace(/\s*/g, "");
    if (base === 10) {
        return BigInt(str);
    }
    if (base <= 1 || base > 36) {
        throw new Error(
            `Cannot parse ${str}; \`base\` must be between 2 and 36`
        );
    }
    try {
        let ret = 0n;
        let place = 0n;
        const bigIntBase = BigInt(base);
        for (const digit of str.split("").reverse()) {
            ret += BigInt(parseInt(digit, 36)) * bigIntBase ** place;
            place += 1n;
        }
        return ret;
    } catch {}

    throw new Error(`Could not convert "${str}" to integer in base ${base}`);
}
