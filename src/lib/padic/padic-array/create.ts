import { parseToPadicBasic } from "../parsing/padic-basic";
import { prod } from "./operations";
import { PAdicPrimitive } from "./padic-array-primitive";
import { PAdicInterface } from "../types";

/**
 * Create a PAdicArray object out of a string/number/etc.
 */
export function createPAdic(
    repr: string | bigint | number | number[] | PAdicInterface,
    base?: number
): PAdicInterface {
    if (isPAdicArrayInterface(repr)) {
        if (base) {
            return repr.setBase(base);
        }
        return repr;
    }
    const parsedRepr = parseToPadicBasic(repr, base);
    const ret = new PAdicPrimitive(parsedRepr.repr);
    ret.lowestPower = -parsedRepr.radix;
    if (parsedRepr.sign > 0) {
        return ret.setBase(parsedRepr.base);
    }
    return prod(ret, new PAdicPrimitive([-1])).setBase(parsedRepr.base);
}

function isPAdicArrayInterface(obj: any): obj is PAdicInterface {
    return typeof obj === "object" && "padic-array" in obj;
}
