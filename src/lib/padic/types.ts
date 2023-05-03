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

export interface PAdicInterface extends BasedDigitFactory {
    type: "padic";
    subType: "primitive" | "abstract";
    base: number;
    valuation: () => number;
    numericDigitAt(pos: number): number;
    digitAt: (pos: number) => string;
    digits: (len: number, options?: DigitsOptions) => string;
}

export interface DigitFactory {
    shift: number;
    at: (pos: number) => number;
    initialDigits: (len: number) => number[];
}

export interface BasedDigitFactory extends DigitFactory {
    readonly base: number;
}

export interface PAdicArrayInterface {
    type: "padic-array";
    base?: number | undefined;
    lowestPower: number;
    digit: (pos: number) => number;
    digits: (len: number) => number[];
    setBase: (base: number) => PAdicArrayInterface & { base: number };
    valuation: () => number;
    toString(len?: number | DigitsOptions, options?: DigitsOptions): string;
    clone(): PAdicArrayInterface;
}
