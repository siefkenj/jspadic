import { describe, it, expect } from "vitest";
import {
    arrayToBigInt,
    arrayToString,
    bigIntToArray,
    normalizeArrayRepr,
    stringToArray,
} from "../lib/padic/parsing/array-repr";

describe("Array Representation of Numbers", () => {
    it("can convert between bigints and arrays", () => {
        expect(arrayToBigInt(bigIntToArray(1234n, 10), 10)).toEqual(1234n);
        expect(arrayToBigInt(bigIntToArray(1234n, 5), 5)).toEqual(1234n);
        expect(arrayToBigInt(bigIntToArray(-1234n, 5), 5)).toEqual(-1234n);

        expect(bigIntToArray(1234n, 10)).toEqual([4, 3, 2, 1]);
    });
    it("can normalize array repr", () => {
        expect(normalizeArrayRepr([1, 2, 3], 10)).toEqual([1, 2, 3]);
        expect(normalizeArrayRepr([10, 2, 3], 10)).toEqual([0, 3, 3]);
        expect(normalizeArrayRepr([1234, 2, 3], 10)).toEqual([4, 5, 5, 1]);
        expect(normalizeArrayRepr([1234], 10)).toEqual([4, 3, 2, 1]);
        expect(normalizeArrayRepr([7], 2)).toEqual([1, 1, 1]);
    });
    it("can convert string to array", () => {
        expect(stringToArray("123", 10)).toEqual([3, 2, 1]);
        expect(stringToArray("7", 2)).toEqual([1, 1, 1]);
    });
    it("can convert array to string", () => {
        expect(arrayToString([3,2,1], 10)).toEqual("123")
        expect(arrayToString([1,1,1], 2)).toEqual("111")
        expect(arrayToString([7, 1], 2)).toEqual("1001")
    });
});
