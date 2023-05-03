export interface PAdicBasic {
    type: "padic";
    repr: number[];
    radix: number;
    base: number;
    sign: 1 | -1;
}

export type DigitsOptions = {
    pad?: boolean;
    includeBase?: boolean;
    len?: number;
};

export interface PAdicInterface {
    type: "padic-array";
    base?: number | undefined;
    lowestPower: number;
    digit: (pos: number) => number;
    digits: (len: number) => number[];
    setBase: (base: number) => PAdicInterface & { base: number };
    valuation: () => number;
    toString(len?: number | DigitsOptions, options?: DigitsOptions): string;
    clone(): PAdicInterface;
}
