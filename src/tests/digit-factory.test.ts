import { describe, it, expect } from "vitest";
import { PAdicFromDigitFactory } from "../lib/padic/abstract/padic-from-digit-factory";
import { DigitFactoryPrimitive } from "../lib/padic/digit-factory/digit-factory-primitive";
import { DigitFactoryProd } from "../lib/padic/digit-factory/digit-factory-prod";
import {
    DigitFactorySolve,
    enumerateWords,
} from "../lib/padic/digit-factory/digit-factory-solve";
import { DigitFactorySum } from "../lib/padic/digit-factory/digit-factory-sum";
import { DigitFactoryWithBase } from "../lib/padic/digit-factory/digit-factory-with-base";
import { diff, prod, solve, sum } from "../lib/padic/digit-factory/operations";
import { DigitFactory, PAdicInterface } from "../lib/padic/types";

describe("DigitFactory tests", () => {
    it("DigitFactoryPrimitive", () => {
        let f: DigitFactoryPrimitive;

        f = new DigitFactoryPrimitive([]);
        expect(f.initialDigits(5)).toEqual([0, 0, 0, 0, 0]);

        f = new DigitFactoryPrimitive([1, 2]);
        expect(f.initialDigits(5)).toEqual([1, 2, 0, 0, 0]);

        f = new DigitFactoryPrimitive([0, 1, 2, 3, 4, 5, 6]);
        expect(f.initialDigits(5)).toEqual([0, 1, 2, 3, 4]);
    });
    it("DigitFactorySum", () => {
        let a: DigitFactoryPrimitive;
        let b: DigitFactoryPrimitive;

        a = new DigitFactoryPrimitive([]);
        b = new DigitFactoryPrimitive([]);
        expect(new DigitFactorySum(a, b).initialDigits(5)).toEqual([
            0, 0, 0, 0, 0,
        ]);

        a = new DigitFactoryPrimitive([]);
        b = new DigitFactoryPrimitive([1, 2, 3]);
        expect(new DigitFactorySum(a, b).initialDigits(5)).toEqual([
            1, 2, 3, 0, 0,
        ]);

        a = new DigitFactoryPrimitive([7, 1, 4, 5]);
        b = new DigitFactoryPrimitive([1, 2, 3]);
        expect(new DigitFactorySum(a, b).initialDigits(5)).toEqual([
            8, 3, 7, 5, 0,
        ]);
    });
    it("DigitFactoryProd", () => {
        let a: DigitFactoryPrimitive;
        let b: DigitFactoryPrimitive;

        a = new DigitFactoryPrimitive([]);
        b = new DigitFactoryPrimitive([]);
        expect(new DigitFactoryProd(a, b).initialDigits(5)).toEqual([
            0, 0, 0, 0, 0,
        ]);

        a = new DigitFactoryPrimitive([]);
        b = new DigitFactoryPrimitive([1, 2, 3]);
        expect(new DigitFactoryProd(a, b).initialDigits(5)).toEqual([
            0, 0, 0, 0, 0,
        ]);

        a = new DigitFactoryPrimitive([7, 1, 4, 5]);
        b = new DigitFactoryPrimitive([1, 2, 3]);
        expect(new DigitFactoryProd(a, b).initialDigits(5)).toEqual([
            7, 15, 27, 16, 22,
        ]);
    });
    it("DigitFactoryWithBase", () => {
        let a: DigitFactoryPrimitive;
        let b: DigitFactoryPrimitive;

        a = new DigitFactoryPrimitive([1, 2, 3]);
        expect(new DigitFactoryWithBase(10, a).initialDigits(5)).toEqual([
            1, 2, 3, 0, 0,
        ]);

        a = new DigitFactoryPrimitive([]);
        b = new DigitFactoryPrimitive([]);
        expect(
            new DigitFactoryWithBase(
                10,
                new DigitFactoryProd(a, b)
            ).initialDigits(5)
        ).toEqual([0, 0, 0, 0, 0]);

        a = new DigitFactoryPrimitive([7, 1, 4, 5]);
        b = new DigitFactoryPrimitive([1, 2, 3]);
        expect(
            new DigitFactoryWithBase(
                10,
                new DigitFactoryProd(a, b)
            ).initialDigits(10)
        ).toEqual([7, 5, 8, 8, 3, 7, 1, 0, 0, 0]);
    });
    it("DigitFactoryWithBase works with negative values", () => {
        let a: DigitFactoryPrimitive;

        a = new DigitFactoryPrimitive([-1, 0, 0]);
        expect(new DigitFactoryWithBase(10, a).initialDigits(5)).toEqual([
            9, 9, 9, 9, 9,
        ]);

        a = new DigitFactoryPrimitive([-11, 0, 0]);
        expect(new DigitFactoryWithBase(10, a).initialDigits(5)).toEqual([
            9, 8, 9, 9, 9,
        ]);
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
        let a: DigitFactoryPrimitive;
        let b: DigitFactoryPrimitive;
        let c: DigitFactoryWithBase;

        a = new DigitFactoryPrimitive([1, 2, 3]);
        b = new DigitFactoryPrimitive([1, 1, 8]);
        c = sum(
            new DigitFactoryWithBase(10, a),
            new DigitFactoryWithBase(10, b)
        );
        expect(c.initialDigits(5)).toEqual([2, 3, 1, 1, 0]);

        b = new DigitFactoryPrimitive([1]);
        c = diff(
            new DigitFactoryWithBase(10, a),
            new DigitFactoryWithBase(10, b)
        );
        expect(c.initialDigits(5)).toEqual([0, 2, 3, 0, 0]);
    });
    it("DigitFactorySolve", () => {
        let a: DigitFactory;
        let testFunc: (a: DigitFactoryWithBase) => DigitFactory;

        testFunc = (a: DigitFactoryWithBase) =>
            diff(
                a,
                new DigitFactoryWithBase(10, new DigitFactoryPrimitive([2, 5]))
            );
        a = new DigitFactorySolve(10, testFunc);
        expect(a.initialDigits(5)).toEqual([2, 5, 0, 0, 0]);

        testFunc = (a: DigitFactoryWithBase) =>
            sum(
                a,
                new DigitFactoryWithBase(10, new DigitFactoryPrimitive([2, 5]))
            );
        a = new DigitFactorySolve(10, testFunc);
        expect(a.initialDigits(5)).toEqual([8, 4, 9, 9, 9]);

        testFunc = (a: DigitFactoryWithBase) =>
            diff(
                prod(
                    a,
                    new DigitFactoryWithBase(10, new DigitFactoryPrimitive([3]))
                ),
                new DigitFactoryWithBase(10, new DigitFactoryPrimitive([1]))
            );
        a = new DigitFactorySolve(10, testFunc);
        expect(a.initialDigits(5)).toEqual([7, 6, 6, 6, 6]);

        // We cannot find a solution to 10x=1 in the p-adic integers.
        testFunc = (a: DigitFactoryWithBase) =>
            diff(
                prod(
                    a,
                    new DigitFactoryWithBase(
                        10,
                        new DigitFactoryPrimitive([0, 1])
                    )
                ),
                new DigitFactoryWithBase(10, new DigitFactoryPrimitive([1]))
            );
        a = new DigitFactorySolve(10, testFunc);
        expect(() => a.initialDigits(5)).toThrow();
    });
    it("solve", () => {
        let testFunc: (a: DigitFactoryWithBase) => DigitFactory;
        let sol: ReturnType<typeof solve>;

        testFunc = (a: DigitFactoryWithBase) =>
            diff(
                a,
                new DigitFactoryWithBase(10, new DigitFactoryPrimitive([2, 5]))
            );
        sol = solve(10, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([[2, 5, 0, 0, 0]]);

        testFunc = (a: DigitFactoryWithBase) =>
            diff(
                prod(
                    a,
                    new DigitFactoryWithBase(10, new DigitFactoryPrimitive([3]))
                ),
                new DigitFactoryWithBase(10, new DigitFactoryPrimitive([1]))
            );
        sol = solve(10, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([[7, 6, 6, 6, 6]]);

        testFunc = (a: DigitFactoryWithBase) =>
            diff(
                prod(a, a),
                new DigitFactoryWithBase(7, new DigitFactoryPrimitive([2]))
            );
        sol = solve(7, testFunc);
        sol.computeDigits(5);
        expect(sol.getPossibleSolutions()).toEqual([
            [3, 1, 2, 6, 1],
            [4, 5, 4, 0, 5],
        ]);
    });
    it("can make p-adic from digit factory", () => {
        let a: PAdicInterface;

        a = new PAdicFromDigitFactory(new DigitFactoryPrimitive([1, 2, 3]), {
            base: 3,
        });
        expect(a.valuation()).toEqual(0);
        expect(a.digits(5)).toEqual("1021");

        a = new PAdicFromDigitFactory(new DigitFactoryPrimitive([1, 2, 3]), {
            base: 3,
            rightDigitValuation: -2,
        });
        expect(a.valuation()).toEqual(-2);
        expect(a.digits(5)).toEqual("10.21");

        a = new PAdicFromDigitFactory(new DigitFactoryPrimitive([1, 2, 3]), {
            base: 3,
            rightDigitValuation: 2,
        });
        expect(a.valuation()).toEqual(2);
        expect(a.digits(7)).toEqual("102100");

        a = new PAdicFromDigitFactory(new DigitFactoryPrimitive([0, 1, 2, 3]), {
            base: 3,
            rightDigitValuation: 2,
        });
        expect(a.valuation()).toEqual(3);
    });
    it("can apply shift", () => {
        let f: DigitFactoryPrimitive;

        f = new DigitFactoryPrimitive([1, 2]);
        f.shift = 2;
        expect(f.initialDigits(5)).toEqual([0, 0, 1, 2, 0]);
    });
});
