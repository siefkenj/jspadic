import { describe, it, expect } from "vitest";
import { createPAdicArray } from "../lib/padic/padic-array/create";
import { prod, sum } from "../lib/padic/padic-array/operations";
import { PAdicArrayPrimitive } from "../lib/padic/padic-array/padic-array-primitive";
import { extractNumberParts } from "../lib/padic/parsing/padic-basic";
import { PAdicArrayInterface } from "../lib/padic/types";

describe("PAdic class", () => {
    it("can extract number info from string", () => {
        expect(extractNumberParts("123")).toEqual({
            strRepr: "123",
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(extractNumberParts("-123")).toEqual({
            strRepr: "123",
            sign: -1,
            radix: 0,
            base: 10,
        });
        expect(extractNumberParts("123_5")).toEqual({
            strRepr: "123",
            sign: 1,
            radix: 0,
            base: 5,
        });
        expect(extractNumberParts("123.45")).toEqual({
            strRepr: "12345",
            sign: 1,
            radix: 2,
            base: 10,
        });
        expect(extractNumberParts("123.45_7")).toEqual({
            strRepr: "12345",
            sign: 1,
            radix: 2,
            base: 7,
        });
        expect(extractNumberParts("(123.45)_7")).toEqual({
            strRepr: "12345",
            sign: 1,
            radix: 2,
            base: 7,
        });
        // Extra zeros are removed
        expect(extractNumberParts("00123")).toEqual({
            strRepr: "123",
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(extractNumberParts("123.00")).toEqual({
            strRepr: "123",
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(extractNumberParts("01203.00")).toEqual({
            strRepr: "1203",
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(extractNumberParts("90")).toEqual({
            strRepr: "90",
            sign: 1,
            radix: 0,
            base: 10,
        });
    });
    it("can initialize", () => {
        let x: PAdicArrayInterface;

        x = createPAdicArray(123, 10);
        expect(x.toString({ includeBase: true })).toBe("123_10");

        x = createPAdicArray(-123, 10);
        expect(x.toString({ includeBase: true })).toBe("9999999877_10");

        x = createPAdicArray(-123n, 10);
        expect(x.toString({ includeBase: true })).toBe("9999999877_10");

        x = createPAdicArray(12, 2);
        expect(x.toString({ includeBase: true })).toBe("1100_2");

        x = createPAdicArray(12.25, 10);
        expect(x.toString({ includeBase: true })).toBe("12.25_10");

        x = createPAdicArray(12.25, 2);
        expect(x.toString({ includeBase: true })).toBe("1100.01_2");

        x = createPAdicArray(-12.25, 2);
        expect(x.toString({ includeBase: true })).toBe("1111110011.11_2");

        x = createPAdicArray("-12.25_10");
        expect(x.toString({ includeBase: true })).toBe("9999999987.75_10");

        x = createPAdicArray("-10.11_2");
        expect(x.toString({ includeBase: true })).toBe("1111111101.01_2");

        x = createPAdicArray("-10.03_2");
        expect(x.toString({ includeBase: true })).toBe("1111111101.01_2");

        x = createPAdicArray("-10.02_2");
        expect(x.toString({ includeBase: true })).toBe("1111111101.1_2");

        x = createPAdicArray(0);
        expect(x.toString({ includeBase: true })).toBe("0_10");

        x = createPAdicArray(0.005);
        expect(x.toString({ includeBase: true })).toBe("0.005_10");

        x = createPAdicArray("-10.11", 2);
        expect(x.toString({ includeBase: true })).toBe("1111111101.01_2");
    });
    it("can show digits", () => {
        let x: PAdicArrayInterface;

        x = createPAdicArray(123, 10);
        expect(x.toString()).toBe("123");
        expect(x.toString(10, { pad: true })).toBe("0000000123");

        x = createPAdicArray("123.45", 10);
        expect(x.toString()).toBe("123.45");
        expect(x.toString(10, { pad: true })).toBe("0000000123.45");

        x = createPAdicArray("-123.45", 10);
        expect(x.toString(5)).toBe("99876.55");
        expect(x.toString(10, { pad: true })).toBe("9999999876.55");

        x = createPAdicArray("-1011", 2);
        expect(x.toString(8)).toBe("11110101");
    });
    it("can show pick digits one by one", () => {
        let x: PAdicArrayInterface;
        const seq1 = [5, 4, 3, 2, 1, 0];
        const seq2 = [5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5];

        x = createPAdicArray(123, 10);
        expect(seq1.map((d) => x.digit(d)).join("")).toBe("000123");
        expect(seq2.map((d) => x.digit(d)).join("")).toBe("00012300000");

        x = createPAdicArray("123.45", 10);
        expect(seq1.map((d) => x.digit(d)).join("")).toBe("000123");
        expect(seq2.map((d) => x.digit(d)).join("")).toBe("00012345000");

        x = createPAdicArray("-123.45", 10);
        expect(seq1.map((d) => x.digit(d)).join("")).toBe("999876");
        expect(x.toString(5)).toBe("99876.55");

        x = createPAdicArray("-1011", 2);
        expect(x.toString(8)).toBe("11110101");
    });
    it("can compute valuation", () => {
        let x: PAdicArrayInterface;

        x = createPAdicArray(123, 10);
        expect(x.valuation()).toBe(0);

        x = createPAdicArray(0, 10);
        expect(x.valuation()).toBe(Infinity);

        x = createPAdicArray(1000, 10);
        expect(x.valuation()).toBe(3);

        x = createPAdicArray(1024, 2);
        expect(x.valuation()).toBe(10);

        x = createPAdicArray(1024.5, 2);
        expect(x.valuation()).toBe(-1);
    });
    it("can multiply", () => {
        let x: PAdicArrayInterface;

        x = prod(createPAdicArray(123, 10), createPAdicArray(2, 10));
        expect(x.toString({ includeBase: true })).toBe("246_10");

        x = prod(createPAdicArray(123.25, 10), createPAdicArray(2, 10));
        expect(x.toString({ includeBase: true })).toBe("246.5_10");

        x = prod(createPAdicArray(3.25, 2), createPAdicArray(2.5, 2));
        expect(x.toString({ includeBase: true })).toBe("1000.001_2");

        x = prod(createPAdicArray(123.25, 10), createPAdicArray(-2, 10));
        expect(x.toString({ includeBase: true })).toBe("9999999753.5_10");
    });
    it("can add", () => {
        let x: PAdicArrayInterface;

        x = sum(createPAdicArray(123, 10), createPAdicArray(2, 10));
        expect(x.toString({ includeBase: true })).toBe("125_10");

        x = sum(createPAdicArray(123.25, 10), createPAdicArray(2, 10));
        expect(x.toString({ includeBase: true })).toBe("125.25_10");

        x = sum(createPAdicArray(3.25, 2), createPAdicArray(2.5, 2));
        expect(x.toString({ includeBase: true })).toBe("101.11_2");

        x = sum(createPAdicArray(123, 10), createPAdicArray(-2, 10));
        expect(x.toString({ includeBase: true })).toBe("121_10");

        x = sum(createPAdicArray(123, 10), createPAdicArray(-200, 10));
        expect(x.toString({ includeBase: true })).toBe("9999999923_10");

        x = sum(createPAdicArray(-123, 10), createPAdicArray(-2, 10));
        expect(x.toString({ includeBase: true })).toBe("9999999875_10");

        x = sum(createPAdicArray(-123, 10), createPAdicArray(2, 10));
        expect(x.toString({ includeBase: true })).toBe("9999999879_10");
    });
});
