import { insertRadix } from "../formatting";
import { DigitsOptions, PAdicInterface } from "../types";

export const MAX_DIGITS = 100;

export class PAdicAbstract implements PAdicInterface {
    readonly type = "padic";
    readonly subType = "abstract";
    base = 10;
    valuation(): number {
        throw new Error("valuation function must be implemented by subclass");
    }
    numericDigitAt(pos: number): number {
        throw new Error(
            "numericDigitAt function must be implemented by subclass"
        );
    }
    digitAt(n: number) {
        return this.numericDigitAt(n).toString(36);
    }
    digits(len: number, options?: DigitsOptions): string {
        const { pad = false } = options || {};
        const valuation = this.valuation();
        const radix = valuation < 0 ? -valuation : 0;
        // We return everything to the right of the radix
        // and then the desired number of digits (including the padded digits)
        const numReturn = radix + len;
        const retDigits = Array.from({ length: numReturn })
            .map((_, i) => this.digitAt(i - radix))
            .reverse()
            .join("");
        let ret = insertRadix(retDigits, radix);

        if (!pad) {
            ret = ret.replace(/^0+/, "");
        }

        // If the number is all zeros, then we should return the string "0" instead of blank.
        return ret || "0";
    }
}