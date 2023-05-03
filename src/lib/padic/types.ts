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
