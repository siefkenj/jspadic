import { describe, it, expect } from "vitest";
import { diff, prod, solve, sum } from "../lib/padic/padic-array/operations";
import { PAdicArrayPrimitive } from "../lib/padic/padic-array/padic-array-primitive";
import { PAdicArrayProd } from "../lib/padic/padic-array/padic-array-prod";
import { PAdicArraySum } from "../lib/padic/padic-array/padic-array-sum";
import { enumerateWords } from "../lib/padic/padic-array/utils";
import { PAdicArrayInterface } from "../lib/padic/types";

describe("PAdicArray tests", () => {
    it("PAdicArrayPrimitive", () => {
        let f: PAdicArrayPrimitive;

        f = new PAdicArrayPrimitive([]);
        expect(f.digits(5)).toEqual([0, 0, 0, 0, 0]);

        f = new PAdicArrayPrimitive([1, 2]);
        expect(f.digits(5)).toEqual([1, 2, 0, 0, 0]);

        f = new PAdicArrayPrimitive([0, 1, 2, 3, 4, 5, 6]);
        expect(f.digits(5)).toEqual([0, 1, 2, 3, 4]);
    });
    it("PAdicArrayPrimitive can set lowest power", () => {
        let f: PAdicArrayPrimitive;

        f = new PAdicArrayPrimitive([1, 2]);
        f.lowestPower = 2;
        expect(f.digits(5)).toEqual([0, 0, 1, 2, 0]);
    });
    it("PAdicArrayPrimitive can set base", () => {
        let f: PAdicArrayPrimitive;

        f = new PAdicArrayPrimitive([3, 2]);
        f.setBase(2);
        expect(f.digits(5)).toEqual([1, 1, 1, 0, 0]);

        f = new PAdicArrayPrimitive([0, 15, 1]);
        f.setBase(10);
        expect(f.digits(5)).toEqual([0, 5, 2, 0, 0]);

        f = new PAdicArrayPrimitive([0, 15, 1]);
        f.setBase(10);
        f.lowestPower = 2;
        expect(f.digits(5)).toEqual([0, 0, 0, 5, 2]);
    });
    it("PAdicArraySum", () => {
        let a: PAdicArrayPrimitive;
        let b: PAdicArrayPrimitive;

        a = new PAdicArrayPrimitive([]);
        b = new PAdicArrayPrimitive([]);
        expect(new PAdicArraySum(a, b).digits(5)).toEqual([0, 0, 0, 0, 0]);

        a = new PAdicArrayPrimitive([]);
        b = new PAdicArrayPrimitive([1, 2, 3]);
        expect(new PAdicArraySum(a, b).digits(5)).toEqual([1, 2, 3, 0, 0]);

        a = new PAdicArrayPrimitive([7, 1, 4, 5]);
        b = new PAdicArrayPrimitive([1, 2, 3]);
        expect(new PAdicArraySum(a, b).digits(5)).toEqual([8, 3, 7, 5, 0]);
    });
    it("PAdicArraySum can set base", () => {
        let a: PAdicArrayPrimitive;
        let b: PAdicArrayPrimitive;

        a = new PAdicArrayPrimitive([8]);
        b = new PAdicArrayPrimitive([8]);
        const sum = new PAdicArraySum(a, b);
        sum.setBase(10);
        expect(sum.digits(5)).toEqual([6, 1, 0, 0, 0]);
        sum.lowestPower = 2;
        expect(sum.digits(5)).toEqual([0, 0, 6, 1, 0]);
    });
    it("PAdicArrayProd", () => {
        let a: PAdicArrayPrimitive;
        let b: PAdicArrayPrimitive;

        a = new PAdicArrayPrimitive([]);
        b = new PAdicArrayPrimitive([]);
        expect(new PAdicArrayProd(a, b).digits(5)).toEqual([0, 0, 0, 0, 0]);

        a = new PAdicArrayPrimitive([]);
        b = new PAdicArrayPrimitive([1, 2, 3]);
        expect(new PAdicArrayProd(a, b).digits(5)).toEqual([0, 0, 0, 0, 0]);

        a = new PAdicArrayPrimitive([7, 1, 4, 5]);
        b = new PAdicArrayPrimitive([1, 2, 3]);
        expect(new PAdicArrayProd(a, b).digits(5)).toEqual([7, 15, 27, 16, 22]);
    });
    it("PAdicArrayProd can set base", () => {
        let a: PAdicArrayPrimitive;
        let b: PAdicArrayPrimitive;

        a = new PAdicArrayPrimitive([7, 1, 4, 5]);
        b = new PAdicArrayPrimitive([1, 2, 3]);
        const prod = new PAdicArrayProd(a, b);
        prod.setBase(10);
        expect(prod.digits(5)).toEqual([7, 5, 8, 8, 3]);
        prod.lowestPower = 1;
        expect(prod.digits(5)).toEqual([0, 7, 5, 8, 8]);
    });
    it("can set base", () => {
        let a: PAdicArrayPrimitive;
        let b: PAdicArrayPrimitive;

        a = new PAdicArrayPrimitive([1, 2, 3]);
        expect(a.setBase(10).digits(5)).toEqual([1, 2, 3, 0, 0]);

        a = new PAdicArrayPrimitive([]);
        b = new PAdicArrayPrimitive([]);
        expect(new PAdicArrayProd(a, b).setBase(10).digits(5)).toEqual([
            0, 0, 0, 0, 0,
        ]);

        a = new PAdicArrayPrimitive([7, 1, 4, 5]);
        b = new PAdicArrayPrimitive([1, 2, 3]);
        expect(new PAdicArrayProd(a, b).setBase(10).digits(10)).toEqual([
            7, 5, 8, 8, 3, 7, 1, 0, 0, 0,
        ]);
    });
    it("PAdicArrayWithBase works with negative values", () => {
        let a: PAdicArrayPrimitive;

        a = new PAdicArrayPrimitive([-1, 0, 0]);
        expect(a.setBase(10).digits(5)).toEqual([9, 9, 9, 9, 9]);

        a = new PAdicArrayPrimitive([-11, 0, 0]);
        expect(a.setBase(10).digits(5)).toEqual([9, 8, 9, 9, 9]);
    });
    it("Can enumerate words", () => {
        expect([...enumerateWords(1, 3)]).toEqual([[0], [1], [2]]);
        expect([...enumerateWords(2, 3)]).toEqual([
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 0],
            [1, 1],
            [1, 2],
            [2, 0],
            [2, 1],
            [2, 2],
        ]);
    });
    it("operations", () => {
        let a: PAdicArrayPrimitive;
        let b: PAdicArrayPrimitive;
        let c: PAdicArrayInterface;

        a = new PAdicArrayPrimitive([1, 2, 3]);
        b = new PAdicArrayPrimitive([1, 1, 8]);
        c = sum(a.setBase(10), b.setBase(10));
        expect(c.digits(5)).toEqual([2, 3, 1, 1, 0]);

        b = new PAdicArrayPrimitive([1]);
        c = diff(a.setBase(10), b.setBase(10));
        expect(c.digits(5)).toEqual([0, 2, 3, 0, 0]);
    });
    it("solve", () => {
        let testFunc: (a: PAdicArrayInterface) => PAdicArrayInterface;
        let sol: ReturnType<typeof solve>;

        testFunc = (a: PAdicArrayInterface) =>
            diff(a, new PAdicArrayPrimitive([2, 5]).setBase(10));
        sol = solve(10, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([[2, 5, 0, 0, 0]]);

        testFunc = (a: PAdicArrayInterface) =>
            diff(
                prod(a, new PAdicArrayPrimitive([3]).setBase(10)),
                new PAdicArrayPrimitive([1]).setBase(10)
            );
        sol = solve(10, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([[7, 6, 6, 6, 6]]);

        testFunc = (a: PAdicArrayInterface) =>
            diff(prod(a, a), new PAdicArrayPrimitive([2]));
        sol = solve(7, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([
            [3, 1, 2, 6, 1],
            [4, 5, 4, 0, 5],
        ]);

        // No solution to a^2==2 % 5, so we should get an empty list back.
        testFunc = (a: PAdicArrayInterface) =>
            diff(prod(a, a), new PAdicArrayPrimitive([2]));
        sol = solve(5, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([]);
    });
    it("can compute valuation", () => {
        let a: PAdicArrayInterface;

        a = new PAdicArrayPrimitive([1, 2, 3]).setBase(3);
        expect(a.valuation()).toEqual(0);
        expect(a.toString(5)).toEqual("1021");

        a = new PAdicArrayPrimitive([1, 2, 3]).setBase(3);
        a.lowestPower = -2;
        expect(a.valuation()).toEqual(-2);
        expect(a.toString(5)).toEqual("10.21");

        a = new PAdicArrayPrimitive([1, 2, 3]).setBase(3);
        a.lowestPower = 2;
        expect(a.valuation()).toEqual(2);
        expect(a.toString(7)).toEqual("102100");

        a = new PAdicArrayPrimitive([0, 1, 2, 3]).setBase(3);
        a.lowestPower = 2;
        expect(a.valuation()).toEqual(3);
    });
});
