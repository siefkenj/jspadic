export interface PAdicBasic {
    type: "padic";
    repr: number[];
    radix: number;
    base: number;
    sign: 1 | -1;
}

export type DigitsOptions = { pad?: boolean };

export interface PAdicInterface {
    type: "padic";
    subType: "primitive" | "abstract";
    base: number;
    valuation: () => number;
    numericDigitAt(pos: number): number;
    digitAt: (pos: number) => string;
    digits: (len: number, options?: DigitsOptions) => string;
}

export interface DigitFactory {
    type: "digit-factory";
    at: (pos: number) => number;
    digits: (len: number) => number[];
}

export interface BasedDigitFactory extends DigitFactory {
    readonly base: number;
}
