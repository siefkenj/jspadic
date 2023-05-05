import { PAdicBasic } from "./types";

export const MAX_FRACTIONAL_DIGITS = 10;

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

export function isZero(arr: number[]) {
    return arr.every((v) => v === 0);
}

/**
 * Convert a PAdicBasic from `inBase` to `outBase`. If there is a fractional
 * part, the conversion may not be exact.
 */
export function convertBase(
    padic: PAdicBasic,
    options: { inBase?: number; outBase?: number }
): PAdicBasic {
    const { inBase = padic.base, outBase } = options;
    if (!inBase || !outBase) {
        throw new Error(
            `An input base and output base must be specified for a base conversion`
        );
    }
    const intBits = padic.repr.slice(padic.radix);
    const fracBits = padic.repr.slice(0, padic.radix);

    // Convert the integer part to the proper base

    // data is stored least-significant digit first
    let intPart = 0n;
    let intPow = 0n;
    const trueInBase = BigInt(inBase);
    const trueOutBase = BigInt(outBase);
    for (const digit of intBits) {
        intPart += BigInt(digit) * trueInBase ** intPow;
        intPow++;
    }
    const outIntBits: number[] = [];
    while (intPart > 0) {
        const bit = intPart % trueOutBase;
        intPart -= bit;
        intPart /= trueOutBase;
        outIntBits.push(Number(bit));
    }

    // Convert the fractional part

    let fracPart = 0;
    let fracPow = -1;
    for (const digit of fracBits.reverse()) {
        fracPart += digit * inBase ** fracPow;
        fracPow -= 1;
    }
    const outFracBits: number[] = [];
    while (fracPart > 0 && outFracBits.length < MAX_FRACTIONAL_DIGITS) {
        fracPart *= outBase;
        const digit = Math.floor(fracPart % outBase);
        fracPart -= digit;
        outFracBits.push(digit);
    }

    if (outFracBits.length === MAX_FRACTIONAL_DIGITS) {
        console.warn(
            `Possible truncation error converting fraction part (digits .${fracBits.join("")}) from base ${inBase} to base ${outBase}`
        );
    }
    
    const repr = outFracBits.reverse().concat(outIntBits)

    return {
        type: "padic",
        base: outBase,
        radix: outFracBits.length,
        sign: padic.sign,
        repr,
    };
}
