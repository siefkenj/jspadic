import { describe, it, expect } from "vitest";
import { parseToPadicBasic } from "../lib/padic/primitive/parsing/padic-basic";

describe("PAdic class", () => {
    it("can parse from string", () => {
        expect(parseToPadicBasic("123")).toEqual({
            type: "padic",
            repr: [3, 2, 1],
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(parseToPadicBasic("-123")).toEqual({
            type: "padic",
            repr: [3, 2, 1],
            sign: -1,
            radix: 0,
            base: 10,
        });
        expect(parseToPadicBasic("123_5")).toEqual({
            type: "padic",
            repr: [3, 2, 1],
            sign: 1,
            radix: 0,
            base: 5,
        });
        expect(parseToPadicBasic("123.45")).toEqual({
            type: "padic",
            repr: [5, 4, 3, 2, 1],
            sign: 1,
            radix: 2,
            base: 10,
        });
        expect(parseToPadicBasic("123.45_7")).toEqual({
            type: "padic",
            repr: [5, 4, 3, 2, 1],
            sign: 1,
            radix: 2,
            base: 7,
        });
        expect(parseToPadicBasic("(123.45)_7")).toEqual({
            type: "padic",
            repr: [5, 4, 3, 2, 1],
            sign: 1,
            radix: 2,
            base: 7,
        });
        expect(parseToPadicBasic("(123.45)_7", 17)).toEqual({
            type: "padic",
            repr: [5, 4, 3, 2, 1],
            sign: 1,
            radix: 2,
            base: 17,
        });
        // Extra zeros are removed
        expect(parseToPadicBasic("00123")).toEqual({
            type: "padic",
            repr: [3, 2, 1],
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(parseToPadicBasic("123.00")).toEqual({
            type: "padic",
            repr: [3, 2, 1],
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(parseToPadicBasic("01203.00")).toEqual({
            type: "padic",
            repr: [3, 0, 2, 1],
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(parseToPadicBasic(".005")).toEqual({
            type: "padic",
            repr: [5, 0, 0],
            sign: 1,
            radix: 3,
            base: 10,
        });
        expect(parseToPadicBasic("90")).toEqual({
            type: "padic",
            repr: [0, 9],
            sign: 1,
            radix: 0,
            base: 10,
        });
    });
    it("can parse from number", () => {
        expect(parseToPadicBasic(123)).toEqual({
            type: "padic",
            repr: [3, 2, 1],
            sign: 1,
            radix: 0,
            base: 10,
        });
        expect(parseToPadicBasic(-123)).toEqual({
            type: "padic",
            repr: [3, 2, 1],
            sign: -1,
            radix: 0,
            base: 10,
        });
        expect(parseToPadicBasic(38, 5)).toEqual({
            type: "padic",
            repr: [3, 2, 1],
            sign: 1,
            radix: 0,
            base: 5,
        });
        expect(parseToPadicBasic(123.45)).toEqual({
            type: "padic",
            repr: [5, 4, 3, 2, 1],
            sign: 1,
            radix: 2,
            base: 10,
        });
        expect(parseToPadicBasic(0.005)).toEqual({
            type: "padic",
            repr: [5, 0, 0],
            sign: 1,
            radix: 3,
            base: 10,
        });
    });
});
