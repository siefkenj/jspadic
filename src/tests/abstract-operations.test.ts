import { describe, it, expect } from "vitest";
import { PAdicNegation } from "../lib/padic/abstract/padic-negation";
import { PAdicProduct } from "../lib/padic/abstract/padic-product";
import { PAdicSum } from "../lib/padic/abstract/padic-sum";
import { PAdicPrimitive } from "../lib/padic/primitive/padic-primitive";

describe("PAdic abstract operations", () => {
    it("can compute sum from abstract padic objects", () => {
        let sum: PAdicSum;
        sum = new PAdicSum(new PAdicPrimitive("10"), new PAdicPrimitive("20"));
        expect(sum.valuation()).toEqual(1);
        expect(sum.digits(5)).toEqual("30");

        sum = new PAdicSum(new PAdicPrimitive("10"), new PAdicPrimitive("90"));
        expect(sum.valuation()).toEqual(2);
        expect(sum.digits(5)).toEqual("100");

        sum = new PAdicSum(
            new PAdicPrimitive("30.01"),
            new PAdicPrimitive("90")
        );
        expect(sum.valuation()).toEqual(-2);
        expect(sum.digits(5)).toEqual("120.01");

        sum = new PAdicSum(
            new PAdicPrimitive("999999999"),
            new PAdicPrimitive("00000000001")
        );
        expect(sum.valuation()).toEqual(9);
        expect(sum.digits(5)).toEqual("0");
    });
    it("can compute negation from abstract padic objects", () => {
        let neg: PAdicNegation;
        neg = new PAdicNegation(new PAdicPrimitive("30"));
        expect(neg.digits(5)).toEqual("99970");

        neg = new PAdicNegation(new PAdicPrimitive("10", 2));
        expect(neg.digits(5)).toEqual("11110");

        neg = new PAdicNegation(new PAdicPrimitive("1001.0101", 2));
        expect(neg.digits(10)).toEqual("1111110110.1011");

        neg = new PAdicNegation(new PAdicPrimitive(0));
        expect(neg.digits(5)).toEqual("0");
    });
    it("can subtract by adding a negative", () => {
        let diff: PAdicSum;
        diff = new PAdicSum(
            new PAdicPrimitive("12345"),
            new PAdicNegation(new PAdicPrimitive("45"))
        );
        expect(diff.digits(10)).toEqual("12300");

        diff = new PAdicSum(
            new PAdicPrimitive("12345"),
            new PAdicNegation(new PAdicPrimitive("45.1"))
        );
        expect(diff.digits(10)).toEqual("12299.9");

        diff = new PAdicSum(
            new PAdicPrimitive("45"),
            new PAdicNegation(new PAdicPrimitive("12345"))
        );
        expect(diff.digits(10)).toEqual("9999987700");

        diff = new PAdicSum(
            new PAdicPrimitive("45"),
            new PAdicNegation(new PAdicPrimitive("0"))
        );
        expect(diff.digits(10)).toEqual("45");
    });
    it("can multiply", () => {
        let prod: PAdicProduct;
        prod = new PAdicProduct(
            new PAdicPrimitive("12.3"),
            new PAdicPrimitive("2")
        );
        expect(prod.digits(10)).toEqual("24.6");
        
        
        prod = new PAdicProduct(
            new PAdicPrimitive("1234567"),
            new PAdicPrimitive("12997843")
        );
        expect(prod.digits(15)).toEqual("16046708038981");
        
        prod = new PAdicProduct(
            new PAdicPrimitive("123456.7"),
            new PAdicPrimitive("12997.843")
        );
        expect(prod.digits(15)).toEqual("1604670803.8981");
       
        prod = new PAdicProduct(
            new PAdicPrimitive("123456.7"),
            new PAdicPrimitive("-12997.843")
        );
        expect(prod.digits(15)).toEqual("999998395329196.1019");
    });
});
