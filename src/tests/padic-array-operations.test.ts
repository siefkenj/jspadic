import { describe, it, expect } from "vitest";
import { createPAdic } from "../lib/padic/padic-array/create";
import { negate, prod, sum } from "../lib/padic/padic-array/operations";
import { PAdicInterface } from "../lib/padic/types";

describe("PAdic abstract operations", () => {
    it("can compute sum from abstract padic objects", () => {
        let theSum: PAdicInterface;
        theSum = sum(createPAdic("10"), createPAdic("20"));
        expect(theSum.valuation()).toEqual(1);
        expect(theSum.toString(5)).toEqual("30");

        theSum = sum(createPAdic("10"), createPAdic("90"));
        expect(theSum.valuation()).toEqual(2);
        expect(theSum.toString(5)).toEqual("100");

        theSum = sum(createPAdic("30.01"), createPAdic("90"));
        expect(theSum.toString(5)).toEqual("120.01");
        expect(theSum.valuation()).toEqual(-2);

        theSum = sum(
            createPAdic("999999999"),
            createPAdic("00000000001")
        );
        expect(theSum.valuation()).toEqual(9);
        expect(theSum.toString(5)).toEqual("0");
    });
    it("can compute negation from abstract padic objects", () => {
        let neg: PAdicInterface;
        neg = negate(createPAdic("30"));
        expect(neg.toString(5)).toEqual("99970");

        neg = negate(createPAdic("10", 2));
        expect(neg.toString(5)).toEqual("11110");

        neg = negate(createPAdic("1001.0101", 2));
        expect(neg.toString(10)).toEqual("1111110110.1011");

        neg = negate(createPAdic(0));
        expect(neg.toString(5)).toEqual("0");
    });
    it("can subtract by adding a negative", () => {
        let diff: PAdicInterface;
        diff = sum(createPAdic("12345"), negate(createPAdic("45")));
        expect(diff.toString(10)).toEqual("12300");

        diff = sum(createPAdic("12345"), negate(createPAdic("45.1")));
        expect(diff.toString(10)).toEqual("12299.9");

        diff = sum(createPAdic("45"), negate(createPAdic("12345")));
        expect(diff.toString(10)).toEqual("9999987700");

        diff = sum(createPAdic("45"), negate(createPAdic("0")));
        expect(diff.toString(10)).toEqual("45");
    });
    it("can multiply", () => {
        let theProd: PAdicInterface;
        theProd = prod(createPAdic("12.3"), createPAdic("2"));
        expect(theProd.toString(10)).toEqual("24.6");

        theProd = prod(
            createPAdic("1234567"),
            createPAdic("12997843")
        );
        expect(theProd.toString(15)).toEqual("16046708038981");

        theProd = prod(
            createPAdic("123456.7"),
            createPAdic("12997.843")
        );
        expect(theProd.toString(15)).toEqual("1604670803.8981");

        theProd = prod(
            createPAdic("123456.7"),
            createPAdic("-12997.843")
        );
        expect(theProd.toString(15)).toEqual("999998395329196.1019");
    });
});
