import { parseToPadicBasic } from "../parsing/padic-basic";
import { prod } from "./operations";
import { PAdicArrayPrimitive } from "./padic-array-primitive";
import { PAdicArrayInterface } from "../types";

/**
 * Create a PAdicArray object out of a string/number/etc.
 */
export function createPAdicArray(
    repr: string | bigint | number | number[] | PAdicArrayInterface,
    base?: number
): PAdicArrayInterface {
    if (isPAdicArrayInterface(repr)) {
        if (base) {
            return repr.setBase(base);
        }
        return repr;
    }
    const parsedRepr = parseToPadicBasic(repr, base);
    const ret = new PAdicArrayPrimitive(parsedRepr.repr);
    ret.lowestPower = -parsedRepr.radix;
    if (parsedRepr.sign > 0) {
        return ret.setBase(parsedRepr.base);
    }
    return prod(ret, new PAdicArrayPrimitive([-1])).setBase(parsedRepr.base);
}

function isPAdicArrayInterface(obj: any): obj is PAdicArrayInterface {
    return typeof obj === "object" && "padic-array" in obj;
}
