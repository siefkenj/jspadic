import { arrayToBigInt } from "./parsing/array-repr";
import { insertRadix } from "../formatting";
import { isPAdicBasic, parseToPadicBasic } from "./parsing/padic-basic";
import { DigitsOptions, PAdicBasic, PAdicInterface } from "../types";

export class PAdicPrimitive implements PAdicBasic, PAdicInterface {
    readonly type = "padic";
    readonly subType = "primitive";
    base = 10;
    sign: 1 | -1 = 1;
    repr: number[] = [];
    radix = 0;
    constructor(
        repr?: string | bigint | number | number[] | PAdicBasic,
        base?: number
    ) {
        if (!(repr instanceof PAdicPrimitive) && !isPAdicBasic(repr)) {
            repr = parseToPadicBasic(repr, base);
        }
        this.base = repr.base;
        this.sign = repr.sign;
        this.repr = repr.repr;
        this.radix = repr.radix;
    }

    valuation() {
        if (this.radix > 0) {
            return -this.radix;
        }
        const index = this.repr.findIndex((d) => d !== 0);
        if (index === -1) {
            return Infinity;
        }
        return index;
    }

    numericDigitAt(n: number): number {
        // Recast `n` so its its starts at the starting index of `this.repr`
        n += this.radix;

        const baseDigit = this.repr[n] || 0;
        if (this.sign > 0) {
            return baseDigit || 0;
        }
        // If we made it here, the number is negative
        if (n === 0) {
            return this.base - baseDigit || 0;
        }
        return this.base - baseDigit - 1 || 0;
    }

    /**
     * Return the `n`th digit to the left of the radix point. Negative numbers
     * return digits to the right of the radix point. Indexing starts at 0.
     */
    digitAt(n: number): string {
        return this.numericDigitAt(n).toString(36);
    }

    /**
     * Get `n` p-adic digits to the left of the radix point.
     * All digits to the right of the radix point are always returned.
     */
    digits(len: number = 10, options?: DigitsOptions): string {
        if (this.valuation() === Infinity) {
            return "0";
        }

        const { pad = false } = options || {};
        // We return everything to the right of the radix
        // and then the desired number of digits (including the padded digits)
        const numReturn =
            this.radix +
            (pad || this.sign < 0
                ? len
                : Math.min(this.repr.length - this.radix, len));
        const retDigits = Array.from({ length: numReturn })
            .map((_, i) => this.digitAt(i - this.radix))
            .reverse()
            .join("");
        return insertRadix(retDigits, this.radix);
    }

    toString(): string {
        const repr = this.repr
            .map((d) => d.toString(this.base))
            .reverse()
            .join("");
        const sign = this.sign < 0 ? "-" : "";
        const radix = this.radix > 0 ? "." : "";
        return `${sign}${
            repr.slice(0, repr.length - this.radix) || "0"
        }${radix}${repr.slice(repr.length - this.radix)}_${this.base}`;
    }

    /**
     * Remove leading and trailing zeros from `this.repr`, adjusting the
     * radix as appropriate.
     */
    _trimRepr() {
        while (this.repr[0] === 0) {
            this.repr.shift();
            this.radix -= 1;
        }
        while (
            this.repr[this.repr.length - 1] === 0 &&
            this.repr.length > this.radix
        ) {
            this.repr.pop();
        }
    }

    /**
     * Return a new padic with the radix point set. If the new
     * padic would have zeros to the right of the radix point, those zeros
     * are trimmed and the radix is reduced.
     */
    withRadix(radix: number): PAdicPrimitive {
        if (this.radix === radix) {
            return this;
        }
        const ret = new PAdicPrimitive(this);
        ret.radix = radix;
        ret._trimRepr();
        return ret;
    }

    withSign(sign: 1 | -1): PAdicPrimitive {
        if (sign === this.sign) {
            return this;
        }
        const ret = new PAdicPrimitive(this);
        ret.sign = sign;
        return ret;
    }

    mul(other: PAdicPrimitive): PAdicPrimitive {
        ensureCompatible(this, other);
        const sign = (this.sign * other.sign) as 1 | -1;
        const radix = this.radix + other.radix;
        const a = arrayToBigInt(this.repr, this.base);
        const b = arrayToBigInt(other.repr, other.base);
        const ret = new PAdicPrimitive(a * b, this.base);
        return ret.withRadix(radix).withSign(sign);
    }

    add(other: PAdicPrimitive): PAdicPrimitive {
        ensureCompatible(this, other);
        const radix = Math.max(this.radix, other.radix);
        let a = arrayToBigInt(this.repr, this.base);
        let b = arrayToBigInt(other.repr, other.base);
        // We need to adjust the representations so they have the same radix
        if (this.radix < radix) {
            a *= BigInt(this.base) ** BigInt(radix - this.radix);
        }
        if (other.radix < radix) {
            b *= BigInt(other.base) ** BigInt(radix - other.radix);
        }
        if (this.sign === other.sign) {
            // If we have the same sign, it's easy to add!
            return new PAdicPrimitive(a + b, this.base)
                .withRadix(radix)
                .withSign(this.sign);
        }
        // Different signs mean we need to subtract
        const diff = a > b ? a - b : b - a;
        const sign =
            (a > b && this.sign > other.sign) ||
            (b > a && other.sign > this.sign)
                ? 1
                : (a > b && other.sign > this.sign) ||
                  (b > a && this.sign > other.sign)
                ? -1
                : 1;
        return new PAdicPrimitive(diff, this.base)
            .withRadix(radix)
            .withSign(sign);
    }

    toJSON() {
        return {
            type: "padic",
            radix: this.radix,
            sign: this.sign,
            repr: this.repr,
            base: this.base,
        };
    }
}

/**
 * Throw an error if `a` and `b` don't share the same base.
 */
export function ensureCompatible(a: { base: number }, b: { base: number }) {
    if (a.base !== b.base) {
        throw new Error(
            `Operation cannot be completed on numbers from different bases`
        );
    }
}
