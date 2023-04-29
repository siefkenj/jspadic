import { describe, it, expect } from "vitest";
import { PAdicPrimitive } from "../lib/padic/primitive/padic-primitive";
import { extractNumberParts } from "../lib/padic/primitive/parsing/padic-basic";

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
        let x: PAdicPrimitive;

        x = new PAdicPrimitive(123, 10);
        expect(x.toString()).toBe("123_10");

        x = new PAdicPrimitive(-123, 10);
        expect(x.toString()).toBe("-123_10");

        x = new PAdicPrimitive(-123n, 10);
        expect(x.toString()).toBe("-123_10");

        x = new PAdicPrimitive(12, 2);
        expect(x.toString()).toBe("1100_2");

        x = new PAdicPrimitive(12.25, 10);
        expect(x.toString()).toBe("12.25_10");

        x = new PAdicPrimitive(12.25, 2);
        expect(x.toString()).toBe("1100.01_2");

        x = new PAdicPrimitive(-12.25, 2);
        expect(x.toString()).toBe("-1100.01_2");

        x = new PAdicPrimitive("-12.25_10");
        expect(x.toString()).toBe("-12.25_10");

        x = new PAdicPrimitive("-10.11_2");
        expect(x.toString()).toBe("-10.11_2");

        x = new PAdicPrimitive("-10.03_2");
        expect(x.toString()).toBe("-10.11_2");

        x = new PAdicPrimitive("-10.02_2");
        expect(x.toString()).toBe("-10.1_2");

        x = new PAdicPrimitive();
        expect(x.toString()).toBe("0_10");

        x = new PAdicPrimitive(0.005);
        expect(x.toString()).toBe("0.005_10");

        x = new PAdicPrimitive("-10.11", 2);
        expect(x.toString()).toBe("-10.11_2");
    });
    it("can show digits", () => {
        let x: PAdicPrimitive;

        x = new PAdicPrimitive(123, 10);
        expect(x.digits()).toBe("123");
        expect(x.digits(10, { pad: true })).toBe("0000000123");

        x = new PAdicPrimitive("123.45", 10);
        expect(x.digits()).toBe("123.45");
        expect(x.digits(10, { pad: true })).toBe("0000000123.45");

        x = new PAdicPrimitive("-123.45", 10);
        expect(x.digits(5)).toBe("99876.55");
        expect(x.digits(10, { pad: true })).toBe("9999999876.55");

        x = new PAdicPrimitive("-1011", 2);
        expect(x.digits(8)).toBe("11110101");
    });
    it("can show pick digits one by one", () => {
        let x: PAdicPrimitive;
        const seq1 = [5, 4, 3, 2, 1, 0];
        const seq2 = [5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5];

        x = new PAdicPrimitive(123, 10);
        expect(seq1.map((d) => x.digitAt(d)).join("")).toBe("000123");
        expect(seq2.map((d) => x.digitAt(d)).join("")).toBe("00012300000");

        x = new PAdicPrimitive("123.45", 10);
        expect(seq1.map((d) => x.digitAt(d)).join("")).toBe("000123");
        expect(seq2.map((d) => x.digitAt(d)).join("")).toBe("00012345000");

        x = new PAdicPrimitive("-123.45", 10);
        expect(seq1.map((d) => x.digitAt(d)).join("")).toBe("999876");
        expect(x.digits(5)).toBe("99876.55");

        x = new PAdicPrimitive("-1011", 2);
        expect(x.digits(8)).toBe("11110101");
    });
    it("can compute valuation", () => {
        let x: PAdicPrimitive;

        x = new PAdicPrimitive(123, 10);
        expect(x.valuation()).toBe(0);

        x = new PAdicPrimitive(0, 10);
        expect(x.valuation()).toBe(Infinity);

        x = new PAdicPrimitive(1000, 10);
        expect(x.valuation()).toBe(3);

        x = new PAdicPrimitive(1024, 2);
        expect(x.valuation()).toBe(10);
        
        x = new PAdicPrimitive(1024.5, 2);
        expect(x.valuation()).toBe(-1);
    });
    it("can multiply", () => {
        let x: PAdicPrimitive;

        x = new PAdicPrimitive(123, 10).mul(new PAdicPrimitive(2, 10));
        expect(x.toString()).toBe("246_10");

        x = new PAdicPrimitive(123.25, 10).mul(new PAdicPrimitive(2, 10));
        expect(x.toString()).toBe("246.5_10");

        x = new PAdicPrimitive(3.25, 2).mul(new PAdicPrimitive(2.5, 2));
        expect(x.toString()).toBe("1000.001_2");

        x = new PAdicPrimitive(123.25, 10).mul(new PAdicPrimitive(-2, 10));
        expect(x.toString()).toBe("-246.5_10");
    });
    it("can add", () => {
        let x: PAdicPrimitive;

        x = new PAdicPrimitive(123, 10).add(new PAdicPrimitive(2, 10));
        expect(x.toString()).toBe("125_10");

        x = new PAdicPrimitive(123.25, 10).add(new PAdicPrimitive(2, 10));
        expect(x.toString()).toBe("125.25_10");

        x = new PAdicPrimitive(3.25, 2).add(new PAdicPrimitive(2.5, 2));
        expect(x.toString()).toBe("101.11_2");

        x = new PAdicPrimitive(123, 10).add(new PAdicPrimitive(-2, 10));
        expect(x.toString()).toBe("121_10");

        x = new PAdicPrimitive(123, 10).add(new PAdicPrimitive(-200, 10));
        expect(x.toString()).toBe("-77_10");

        x = new PAdicPrimitive(-123, 10).add(new PAdicPrimitive(-2, 10));
        expect(x.toString()).toBe("-125_10");

        x = new PAdicPrimitive(-123, 10).add(new PAdicPrimitive(2, 10));
        expect(x.toString()).toBe("-121_10");
    });
});
