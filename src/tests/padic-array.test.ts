import { describe, it, expect } from "vitest";
import { diff, prod, solve, sum } from "../lib/padic/padic-array/operations";
import { PAdicPrimitive } from "../lib/padic/padic-array/padic-array-primitive";
import { PAdicProd } from "../lib/padic/padic-array/padic-array-prod";
import { PAdicSum } from "../lib/padic/padic-array/padic-array-sum";
import { enumerateWords } from "../lib/padic/utils";
import { PAdicInterface } from "../lib/padic/types";

describe("PAdicArray tests", () => {
    it("PAdicArrayPrimitive", () => {
        let f: PAdicPrimitive;

        f = new PAdicPrimitive([]);
        expect(f.digits(5)).toEqual([0, 0, 0, 0, 0]);

        f = new PAdicPrimitive([1, 2]);
        expect(f.digits(5)).toEqual([1, 2, 0, 0, 0]);

        f = new PAdicPrimitive([0, 1, 2, 3, 4, 5, 6]);
        expect(f.digits(5)).toEqual([0, 1, 2, 3, 4]);
    });
    it("PAdicArrayPrimitive can set lowest power", () => {
        let f: PAdicPrimitive;

        f = new PAdicPrimitive([1, 2]);
        f.lowestPower = 2;
        expect(f.digits(5)).toEqual([0, 0, 1, 2, 0]);
    });
    it("PAdicArrayPrimitive can set base", () => {
        let f: PAdicPrimitive;

        f = new PAdicPrimitive([3, 2]);
        f.setBase(2);
        expect(f.digits(5)).toEqual([1, 1, 1, 0, 0]);

        f = new PAdicPrimitive([0, 15, 1]);
        f.setBase(10);
        expect(f.digits(5)).toEqual([0, 5, 2, 0, 0]);

        f = new PAdicPrimitive([0, 15, 1]);
        f.setBase(10);
        f.lowestPower = 2;
        expect(f.digits(5)).toEqual([0, 0, 0, 5, 2]);
    });
    it("PAdicArraySum", () => {
        let a: PAdicPrimitive;
        let b: PAdicPrimitive;

        a = new PAdicPrimitive([]);
        b = new PAdicPrimitive([]);
        expect(new PAdicSum(a, b).digits(5)).toEqual([0, 0, 0, 0, 0]);

        a = new PAdicPrimitive([]);
        b = new PAdicPrimitive([1, 2, 3]);
        expect(new PAdicSum(a, b).digits(5)).toEqual([1, 2, 3, 0, 0]);

        a = new PAdicPrimitive([7, 1, 4, 5]);
        b = new PAdicPrimitive([1, 2, 3]);
        expect(new PAdicSum(a, b).digits(5)).toEqual([8, 3, 7, 5, 0]);
    });
    it("PAdicArraySum can set base", () => {
        let a: PAdicPrimitive;
        let b: PAdicPrimitive;

        a = new PAdicPrimitive([8]);
        b = new PAdicPrimitive([8]);
        const sum = new PAdicSum(a, b);
        sum.setBase(10);
        expect(sum.digits(5)).toEqual([6, 1, 0, 0, 0]);
        sum.lowestPower = 2;
        expect(sum.digits(5)).toEqual([0, 0, 6, 1, 0]);
    });
    it("PAdicArrayProd", () => {
        let a: PAdicPrimitive;
        let b: PAdicPrimitive;

        a = new PAdicPrimitive([]);
        b = new PAdicPrimitive([]);
        expect(new PAdicProd(a, b).digits(5)).toEqual([0, 0, 0, 0, 0]);

        a = new PAdicPrimitive([]);
        b = new PAdicPrimitive([1, 2, 3]);
        expect(new PAdicProd(a, b).digits(5)).toEqual([0, 0, 0, 0, 0]);

        a = new PAdicPrimitive([7, 1, 4, 5]);
        b = new PAdicPrimitive([1, 2, 3]);
        expect(new PAdicProd(a, b).digits(5)).toEqual([7, 15, 27, 16, 22]);
    });
    it("PAdicArrayProd can set base", () => {
        let a: PAdicPrimitive;
        let b: PAdicPrimitive;

        a = new PAdicPrimitive([7, 1, 4, 5]);
        b = new PAdicPrimitive([1, 2, 3]);
        const prod = new PAdicProd(a, b);
        prod.setBase(10);
        expect(prod.digits(5)).toEqual([7, 5, 8, 8, 3]);
        prod.lowestPower = 1;
        expect(prod.digits(5)).toEqual([0, 7, 5, 8, 8]);
    });
    it("can set base", () => {
        let a: PAdicPrimitive;
        let b: PAdicPrimitive;

        a = new PAdicPrimitive([1, 2, 3]);
        expect(a.setBase(10).digits(5)).toEqual([1, 2, 3, 0, 0]);

        a = new PAdicPrimitive([]);
        b = new PAdicPrimitive([]);
        expect(new PAdicProd(a, b).setBase(10).digits(5)).toEqual([
            0, 0, 0, 0, 0,
        ]);

        a = new PAdicPrimitive([7, 1, 4, 5]);
        b = new PAdicPrimitive([1, 2, 3]);
        expect(new PAdicProd(a, b).setBase(10).digits(10)).toEqual([
            7, 5, 8, 8, 3, 7, 1, 0, 0, 0,
        ]);
    });
    it("PAdicArrayWithBase works with negative values", () => {
        let a: PAdicPrimitive;

        a = new PAdicPrimitive([-1, 0, 0]);
        expect(a.setBase(10).digits(5)).toEqual([9, 9, 9, 9, 9]);

        a = new PAdicPrimitive([-11, 0, 0]);
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
        let a: PAdicPrimitive;
        let b: PAdicPrimitive;
        let c: PAdicInterface;

        a = new PAdicPrimitive([1, 2, 3]);
        b = new PAdicPrimitive([1, 1, 8]);
        c = sum(a.setBase(10), b.setBase(10));
        expect(c.digits(5)).toEqual([2, 3, 1, 1, 0]);

        b = new PAdicPrimitive([1]);
        c = diff(a.setBase(10), b.setBase(10));
        expect(c.digits(5)).toEqual([0, 2, 3, 0, 0]);
    });
    it("solve", () => {
        let testFunc: (a: PAdicInterface) => PAdicInterface;
        let sol: ReturnType<typeof solve>;

        testFunc = (a: PAdicInterface) =>
            diff(a, new PAdicPrimitive([2, 5]).setBase(10));
        sol = solve(10, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([[2, 5, 0, 0, 0]]);

        testFunc = (a: PAdicInterface) =>
            diff(
                prod(a, new PAdicPrimitive([3]).setBase(10)),
                new PAdicPrimitive([1]).setBase(10)
            );
        sol = solve(10, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([[7, 6, 6, 6, 6]]);

        testFunc = (a: PAdicInterface) =>
            diff(prod(a, a), new PAdicPrimitive([2]));
        sol = solve(7, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([
            [3, 1, 2, 6, 1],
            [4, 5, 4, 0, 5],
        ]);

        // No solution to a^2==2 % 5, so we should get an empty list back.
        testFunc = (a: PAdicInterface) =>
            diff(prod(a, a), new PAdicPrimitive([2]));
        sol = solve(5, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([]);
    });
    it("can compute valuation", () => {
        let a: PAdicInterface;

        a = new PAdicPrimitive([1, 2, 3]).setBase(3);
        expect(a.valuation()).toEqual(0);
        expect(a.toString(5)).toEqual("1021");

        a = new PAdicPrimitive([1, 2, 3]).setBase(3);
        a.lowestPower = -2;
        expect(a.valuation()).toEqual(-2);
        expect(a.toString(5)).toEqual("10.21");

        a = new PAdicPrimitive([1, 2, 3]).setBase(3);
        a.lowestPower = 2;
        expect(a.valuation()).toEqual(2);
        expect(a.toString(7)).toEqual("102100");

        a = new PAdicPrimitive([0, 1, 2, 3]).setBase(3);
        a.lowestPower = 2;
        expect(a.valuation()).toEqual(3);
    });
});
