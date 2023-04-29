import { DigitFactoryAbstract } from "../digit-factory/digit-factory-abstract";
import { DigitFactoryWithBase } from "../digit-factory/digit-factory-with-base";
import { BasedDigitFactory, DigitFactory, PAdicInterface } from "../types";
import { PAdicAbstract } from "./padic";

export const MAX_DIGITS = 100;

/**
 * Create a p-adic number out of a digit factory.
 */
export class PAdicFromDigitFactory
    extends PAdicAbstract
    implements PAdicInterface
{
    readonly type = "padic";
    readonly subType = "abstract";
    base = 10;
    #digitFactory: DigitFactoryWithBase;
    #valuation = 0;
    #rightDigitValuation = 0;

    constructor(
        digitFactory: DigitFactoryWithBase | DigitFactory,
        options?: { rightDigitValuation?: number; base?: number }
    ) {
        super();
        const { rightDigitValuation = 0 } = options || {};
        const digitFactoryWithBase = isDigitFactoryWithBase(digitFactory)
            ? digitFactory
            : new DigitFactoryWithBase(
                  options?.base || this.base,
                  digitFactory
              );
        this.base = digitFactoryWithBase.base;
        this.#digitFactory = digitFactoryWithBase;
        this.#rightDigitValuation = rightDigitValuation;
        this.#initValuation();
    }
    #initValuation() {
        for (let i = 0; i < MAX_DIGITS; i++) {
            if (this.#digitFactory.at(i) !== 0) {
                // We found the first non-zero digit
                this.#valuation = i + this.#rightDigitValuation;
                return;
            }
        }
        this.#valuation = Infinity;
    }
    valuation(): number {
        return this.#valuation;
    }
    numericDigitAt(pos: number): number {
        return this.#digitFactory.at(pos - this.#rightDigitValuation);
    }
    getDigitFactory() {
        return this.#digitFactory;
    }
}

export class DigitFactoryFromPAdic
    extends DigitFactoryAbstract
    implements BasedDigitFactory
{
    #padic: PAdicInterface;
    #valuation = 0;
    base = 10;
    constructor(padic: PAdicInterface) {
        super();
        this.#padic = padic;
        this.#valuation = this.#padic.valuation();
        this.base = this.#padic.base;
    }
    at(pos: number): number {
        if (this.#valuation === Infinity) {
            return 0;
        }
        const relPos = pos + this.#valuation;
        return this.#padic.numericDigitAt(relPos);
    }
}

/**
 * Turn a padic into a DigitFactory.
 */
export function padicToDigitFactory(padic: PAdicInterface): DigitFactory {
    if ("getDigitFactory" in padic) {
        return (padic.getDigitFactory as any)() as DigitFactory;
    }
    return new DigitFactoryFromPAdic(padic);
}

function isDigitFactoryWithBase(x: any): x is DigitFactoryWithBase {
    if (typeof x !== "object") {
        return false;
    }
    if (x.valuation && x.base) {
        return true;
    }
    return false;
}
