import { insertRadix } from "../formatting";
import { DigitsOptions } from "../types";
import { PAdicArrayInterface } from "./types";

export const MAX_DIGITS = 100;

export class PAdicArrayAbstract implements PAdicArrayInterface {
    readonly type = "padic-array";
    lowestPower = 0;
    base?: number;
    // Cache to store info needed for computations in this _abstract_ class
    #abstractCache: {
        valuation?: number;
        base?: number;
        lowestPower?: number;
    } = {
        valuation: undefined,
        base: undefined,
        lowestPower: undefined,
    };

    _rawAt(pos: number): number {
        throw new Error(`Subclasses must implement this method`);
    }
    setBase(base: number): PAdicArrayAbstract & { base: number } {
        throw new Error(`Subclasses must implement this method`);
    }
    clone(): PAdicArrayInterface {
        throw new Error(`Subclasses must implement this method`);
    }

    digit(power: number): number {
        return this._rawAt(power - this.lowestPower);
    }
    digits(len: number) {
        return Array.from({ length: len }).map((_, i) => this.digit(i));
    }
    valuation(): number {
        if (
            this.#abstractCache.valuation != null &&
            this.#abstractCache.base === this.base &&
            this.#abstractCache.lowestPower === this.lowestPower
        ) {
            return this.#abstractCache.valuation;
        }
        // If we have not computed the valuation or the value of the base or offset has changed for some reason,
        // we need to recompute.
        this.#abstractCache.base = this.base;
        this.#abstractCache.lowestPower = this.lowestPower;
        // Make sure `pos` is an integer so that we don't get `-0` as a valuation.
        let pos = this.lowestPower | 0;
        while (pos < MAX_DIGITS && this.digit(pos) === 0) {
            pos++;
        }
        let ret = pos;
        if (pos === MAX_DIGITS) {
            ret = Infinity;
        }
        this.#abstractCache.valuation = ret;
        return ret;
    }
    toString(
        _len: number | DigitsOptions = 10,
        options?: DigitsOptions
    ): string {
        let {
            pad = false,
            len = _len,
            includeBase = false,
        } = typeof _len === "object" ? _len : options || {};
        if (typeof len !== "number") {
            len = 10;
        }
        const valuation = this.valuation();
        const radix = valuation < 0 ? -valuation : 0;
        // We return everything to the right of the radix
        // and then the desired number of digits (including the padded digits)
        const numReturn = radix + len;
        const retDigits = Array.from({ length: numReturn })
            .map((_, i) => this.digit(i - radix))
            .reverse()
            .join("");
        let ret = insertRadix(retDigits, radix);

        if (!pad) {
            ret = ret.replace(/^0+/, "");
        }

        // If the number is all zeros, then we should return the string "0" instead of blank.
        ret = ret || "0";
        if (includeBase) {
            ret += `_${this.base || 10}`;
        }
        if (ret.startsWith(".")) {
            ret = "0" + ret;
        }
        return ret;
    }
}
