import { bigIntToArray, normalizeArrayRepr, stringToArray } from "./array-repr";
import { PAdicBasic } from "../../types";

function newPAdicBasic(base?: number): PAdicBasic {
    return { type: "padic", base: base || 10, radix: 0, repr: [], sign: 1 };
}

export function parseToPadicBasic(
    repr?: string | bigint | number | number[],
    base?: number
): PAdicBasic {
    if (!repr) {
        return newPAdicBasic(base);
    }
    switch (typeof repr) {
        case "undefined":
            return newPAdicBasic(base);
        case "bigint":
            return padicBasicFromBigInt(repr, base);
        case "number":
            return padicBasicFromNumber(repr, base);
        case "string":
            return padicBasicFromString(repr, base);
        case "object":
            if (Array.isArray(repr)) {
                const ret = newPAdicBasic(base);
                ret.repr = [...normalizeArrayRepr(repr, ret.base)];
                return ret;
            }
        default:
            throw new Error(`Cannot create PadicBasic from ${repr}`);
    }
}

const MAX_FRACTIONAL_DIGITS = 10;

/**
 * Parse a number into a PAdicBasic object. If the number contains decimals and `allowApprox` is true,
 * the resulting conversion may only be an approximation (good up to 10 digits)
 */
export function padicBasicFromNumber(
    num: number,
    base?: number,
    allowApprox = true
): PAdicBasic {
    base = base || 10;
    const trueBase = BigInt(base);

    // The integer part is straightforward
    if (Math.floor(num) === num) {
        return padicBasicFromBigInt(BigInt(num), base);
    }

    // If we're here, we are a non-integer. In this case, multiply by `base` until
    // we don't have any fractional part. Then convert with the appropriate radix.
    // We must set a maximum limit, since otherwise this could loop indefinitely.
    const sign = num < 0 ? -1 : 1;
    num = Math.abs(num);
    let bigintRepr = BigInt(Math.floor(num));
    let radix = 0;
    let fractionalPart = num % 1;
    while (fractionalPart !== 0 && radix < MAX_FRACTIONAL_DIGITS) {
        const digitR = fractionalPart * base;
        const digit = BigInt(Math.floor(digitR));
        fractionalPart = digitR % 1;
        bigintRepr *= trueBase;
        bigintRepr += digit;
        radix += 1;
    }
    if (fractionalPart !== 0 && !allowApprox) {
        throw new Error(
            `Could not convert ${num} to a padic exactly; the fractional part does not represent a finite padic`
        );
    }

    const ret = newPAdicBasic(base);
    ret.radix = radix;
    ret.sign = sign;
    ret.repr = bigIntToArray(bigintRepr, base);

    // Remove any leading zeros left from an approximation
    while (ret.repr[0] === 0) {
        ret.repr.shift();
        ret.radix -= 1;
    }

    // The algorithm may have ended early and not filled everything
    // before the radix with zeros. In that case, we add zeros.
    if (ret.repr.length < ret.radix) {
        ret.repr.push(...Array(ret.radix - ret.repr.length).fill(0));
    }

    return ret;
}

export function padicBasicFromBigInt(num: bigint, base?: number): PAdicBasic {
    base = base || 10;

    const ret = newPAdicBasic(base);
    ret.repr =
        num < 0n ? bigIntToArray(-1n * num, base) : bigIntToArray(num, base);
    ret.sign = num < 0n ? -1 : 1;
    return ret;
}

/**
 * Extract a PAdicBasic object from a string representation.
 */
export function padicBasicFromString(str: string, base?: number): PAdicBasic {
    const parts = extractNumberParts(str);
    base = base || parts.base;

    const ret = newPAdicBasic(base);
    ret.repr = stringToArray(parts.strRepr, base);
    ret.radix = parts.radix;
    ret.sign = parts.sign;

    // Remove any leading zeros left from an approximation
    while (ret.repr[0] === 0 && ret.radix > 0) {
        ret.repr.shift();
        ret.radix -= 1;
    }

    return ret;
}

/**
 * Extract the parts of a number written as a string. `num` may be
 * of the form `+/-dddd.ddd_b` where `d` is a digit of the number and `b` is
 * the base (specified in base-10).
 *
 */
export function extractNumberParts(num: string): {
    strRepr: string;
    sign: 1 | -1;
    radix: number;
    base: number;
} {
    num = num.replace(/\s+/g, "");
    num = num.replace(/\(|\)/g, "");
    let sign: 1 | -1 = 1;
    let base = 10;
    let radix = 0;

    if (num.startsWith("-")) {
        sign = -1;
        num = num.slice(1);
    }
    if (num.startsWith("+")) {
        num = num.slice(1);
    }

    {
        const [front, back] = num.split("_");
        if (back) {
            base = parseInt(back, 10);
        }
        num = front;
    }
    {
        // Get rid of any leading zeros
        num = num.replace(/^0+/, "");
        let [front, back = ""] = num.split(".");
        if (back) {
            // No trailing zeros to the right of the radix point
            back = back.replace(/0+$/, "");
            radix = back.length;
        }
        num = front + back;
    }

    return { strRepr: num, sign, base, radix };
}

export function isPAdicBasic(obj: any): obj is PAdicBasic {
    return (
        typeof obj === "object" &&
        obj.type === "padic" &&
        Array.isArray(obj.repr)
    );
}
