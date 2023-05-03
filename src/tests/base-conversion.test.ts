import { describe, it, expect } from "vitest";
import { bigIntToBase } from "../lib/bigint-to-base";
import { padic } from "../lib/padic";
import { parseBigInt } from "../lib/parse-bigint";

describe("Base conversions", () => {
    it("can convert to base", () => {
        expect(bigIntToBase(123n, 5)).toEqual((123).toString(5));
        expect(bigIntToBase(123n, 10)).toEqual("123");
        expect(bigIntToBase("7", 2)).toEqual("111");
    });
    it("can convert from base", () => {
        expect(parseBigInt("111", 2)).toEqual(7n);
        expect(parseBigInt("123", 5)).toEqual(BigInt(parseInt("123", 5)));
        expect(parseBigInt("123", 10)).toEqual(123n);
    });
    it("can find valuation", () => {
        expect(padic.valuation(100n, 10)).toBe(2);
    });
});
