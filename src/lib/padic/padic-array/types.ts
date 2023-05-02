import { DigitsOptions } from "../types";

export interface PAdicArrayInterface {
    type: "padic-array";
    base?: number | undefined;
    lowestPower: number;
    digit: (pos: number) => number;
    digits: (len: number) => number[];
    setBase: (base: number) => PAdicArrayInterface & { base: number };
    valuation: () => number;
    toString(len?: number, options?: DigitsOptions): string;
    clone(): PAdicArrayInterface;
}
