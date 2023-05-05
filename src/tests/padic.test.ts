import { describe, it, expect } from "vitest";
import { createPAdic } from "../lib/padic/padic-array/create";
import { prod, sum } from "../lib/padic/padic-array/operations";
import { extractNumberParts } from "../lib/padic/parsing/padic-basic";
import { PAdicInterface } from "../lib/padic/types";

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
        let x: PAdicInterface;

        x = createPAdic(123, 10);
        expect(x.toString({ includeBase: true })).toBe("123_10");

        x = createPAdic(-123, 10);
        expect(x.toString({ includeBase: true })).toBe("9999999877_10");

        x = createPAdic(-123n, 10);
        expect(x.toString({ includeBase: true })).toBe("9999999877_10");

        x = createPAdic(12, 2);
        expect(x.toString({ includeBase: true })).toBe("1100_2");

        x = createPAdic(12.25, 10);
        expect(x.toString({ includeBase: true })).toBe("12.25_10");

        x = createPAdic(12.25, 2);
        expect(x.toString({ includeBase: true })).toBe("1100.01_2");

        x = createPAdic(-12.25, 2);
        expect(x.toString({ includeBase: true })).toBe("1111110011.11_2");

        x = createPAdic("-12.25_10");
        expect(x.toString({ includeBase: true })).toBe("9999999987.75_10");

        x = createPAdic("-10.11_2");
        expect(x.toString({ includeBase: true })).toBe("1111111101.01_2");

        x = createPAdic("-10.03_2");
        expect(x.toString({ includeBase: true })).toBe("1111111101.01_2");

        x = createPAdic("-10.02_2");
        expect(x.toString({ includeBase: true })).toBe("1111111101.1_2");

        x = createPAdic(0);
        expect(x.toString({ includeBase: true })).toBe("0_10");

        x = createPAdic(0.005);
        expect(x.toString({ includeBase: true })).toBe("0.005_10");

        x = createPAdic("-10.11", 2);
        expect(x.toString({ includeBase: true })).toBe("1111111101.01_2");
    });
    it("can show digits", () => {
        let x: PAdicInterface;

        x = createPAdic(123, 10);
        expect(x.toString()).toBe("123");
        expect(x.toString(10, { pad: true })).toBe("0000000123");

        x = createPAdic("123.45", 10);
        expect(x.toString()).toBe("123.45");
        expect(x.toString(10, { pad: true })).toBe("0000000123.45");

        x = createPAdic("-123.45", 10);
        expect(x.toString(5)).toBe("99876.55");
        expect(x.toString(10, { pad: true })).toBe("9999999876.55");

        x = createPAdic("-1011", 2);
        expect(x.toString(8)).toBe("11110101");
    });
    it("can show pick digits one by one", () => {
        let x: PAdicInterface;
        const seq1 = [5, 4, 3, 2, 1, 0];
        const seq2 = [5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5];

        x = createPAdic(123, 10);
        expect(seq1.map((d) => x.digit(d)).join("")).toBe("000123");
        expect(seq2.map((d) => x.digit(d)).join("")).toBe("00012300000");

        x = createPAdic("123.45", 10);
        expect(seq1.map((d) => x.digit(d)).join("")).toBe("000123");
        expect(seq2.map((d) => x.digit(d)).join("")).toBe("00012345000");

        x = createPAdic("-123.45", 10);
        expect(seq1.map((d) => x.digit(d)).join("")).toBe("999876");
        expect(x.toString(5)).toBe("99876.55");

        x = createPAdic("-1011", 2);
        expect(x.toString(8)).toBe("11110101");
    });
    it("can compute valuation", () => {
        let x: PAdicInterface;

        x = createPAdic(123, 10);
        expect(x.valuation()).toBe(0);

        x = createPAdic(0, 10);
        expect(x.valuation()).toBe(Infinity);

        x = createPAdic(1000, 10);
        expect(x.valuation()).toBe(3);

        x = createPAdic(1024, 2);
        expect(x.valuation()).toBe(10);

        x = createPAdic(1024.5, 2);
        expect(x.valuation()).toBe(-1);
    });
    it("can multiply", () => {
        let x: PAdicInterface;

        x = prod(createPAdic(123, 10), createPAdic(2, 10));
        expect(x.toString({ includeBase: true })).toBe("246_10");

        x = prod(createPAdic(123.25, 10), createPAdic(2, 10));
        expect(x.toString({ includeBase: true })).toBe("246.5_10");

        x = prod(createPAdic(3.25, 2), createPAdic(2.5, 2));
        expect(x.toString({ includeBase: true })).toBe("1000.001_2");

        x = prod(createPAdic(123.25, 10), createPAdic(-2, 10));
        expect(x.toString({ includeBase: true })).toBe("9999999753.5_10");
    });
    it("can add", () => {
        let x: PAdicInterface;

        x = sum(createPAdic(123, 10), createPAdic(2, 10));
        expect(x.toString({ includeBase: true })).toBe("125_10");

        x = sum(createPAdic(123.25, 10), createPAdic(2, 10));
        expect(x.toString({ includeBase: true })).toBe("125.25_10");

        x = sum(createPAdic(3.25, 2), createPAdic(2.5, 2));
        expect(x.toString({ includeBase: true })).toBe("101.11_2");

        x = sum(createPAdic(123, 10), createPAdic(-2, 10));
        expect(x.toString({ includeBase: true })).toBe("121_10");

        x = sum(createPAdic(123, 10), createPAdic(-200, 10));
        expect(x.toString({ includeBase: true })).toBe("9999999923_10");

        x = sum(createPAdic(-123, 10), createPAdic(-2, 10));
        expect(x.toString({ includeBase: true })).toBe("9999999875_10");

        x = sum(createPAdic(-123, 10), createPAdic(2, 10));
        expect(x.toString({ includeBase: true })).toBe("9999999879_10");
    });
});
