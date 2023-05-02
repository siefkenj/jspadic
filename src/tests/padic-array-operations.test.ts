import { describe, it, expect } from "vitest";
import { createPAdicArray } from "../lib/padic/padic-array/create";
import { negate, prod, sum } from "../lib/padic/padic-array/operations";
import { PAdicArrayInterface } from "../lib/padic/padic-array/types";

describe("PAdic abstract operations", () => {
    it("can compute sum from abstract padic objects", () => {
        let theSum: PAdicArrayInterface;
        theSum = sum(createPAdicArray("10"), createPAdicArray("20"));
        expect(theSum.valuation()).toEqual(1);
        expect(theSum.toString(5)).toEqual("30");

        theSum = sum(createPAdicArray("10"), createPAdicArray("90"));
        expect(theSum.valuation()).toEqual(2);
        expect(theSum.toString(5)).toEqual("100");

        theSum = sum(createPAdicArray("30.01"), createPAdicArray("90"));
        expect(theSum.toString(5)).toEqual("120.01");
        expect(theSum.valuation()).toEqual(-2);

        theSum = sum(
            createPAdicArray("999999999"),
            createPAdicArray("00000000001")
        );
        expect(theSum.valuation()).toEqual(9);
        expect(theSum.toString(5)).toEqual("0");
    });
    it("can compute negation from abstract padic objects", () => {
        let neg: PAdicArrayInterface;
        neg = negate(createPAdicArray("30"));
        expect(neg.toString(5)).toEqual("99970");

        neg = negate(createPAdicArray("10", 2));
        expect(neg.toString(5)).toEqual("11110");

        neg = negate(createPAdicArray("1001.0101", 2));
        expect(neg.toString(10)).toEqual("1111110110.1011");

        neg = negate(createPAdicArray(0));
        expect(neg.toString(5)).toEqual("0");
    });
    it("can subtract by adding a negative", () => {
        let diff: PAdicArrayInterface;
        diff = sum(createPAdicArray("12345"), negate(createPAdicArray("45")));
        expect(diff.toString(10)).toEqual("12300");

        diff = sum(createPAdicArray("12345"), negate(createPAdicArray("45.1")));
        expect(diff.toString(10)).toEqual("12299.9");

        diff = sum(createPAdicArray("45"), negate(createPAdicArray("12345")));
        expect(diff.toString(10)).toEqual("9999987700");

        diff = sum(createPAdicArray("45"), negate(createPAdicArray("0")));
        expect(diff.toString(10)).toEqual("45");
    });
    it("can multiply", () => {
        let theProd: PAdicArrayInterface;
        theProd = prod(createPAdicArray("12.3"), createPAdicArray("2"));
        expect(theProd.toString(10)).toEqual("24.6");

        theProd = prod(
            createPAdicArray("1234567"),
            createPAdicArray("12997843")
        );
        expect(theProd.toString(15)).toEqual("16046708038981");

        theProd = prod(
            createPAdicArray("123456.7"),
            createPAdicArray("12997.843")
        );
        expect(theProd.toString(15)).toEqual("1604670803.8981");

        theProd = prod(
            createPAdicArray("123456.7"),
            createPAdicArray("-12997.843")
        );
        expect(theProd.toString(15)).toEqual("999998395329196.1019");
    });
});
