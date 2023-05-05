import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { printPadicBasic } from "../lib/padic/formatting";
import { createPAdic } from "../lib/padic/padic-array/create";
import { parseToPadicBasic } from "../lib/padic/parsing/padic-basic";
import { convertBase } from "../lib/padic/utils";
import { RootState } from "./store";

export interface GlobalState {
    base: number;
    a: string;
    aText: string;
    aInBaseText: string;
    b: string;
    bText: string;
    bInBaseText: string;
}

const initialState: GlobalState = {
    base: 2,
    a: "123",
    aText: "123",
    aInBaseText: "1111011",
    b: "2",
    bText: "2",
    bInBaseText: "10",
};

function parseAndPrintToBase(base10Input: string, base: number): string {
    const base10 = parseToPadicBasic(base10Input, 10);
    return printPadicBasic(convertBase(base10, { inBase: 10, outBase: base }));
}

export const globalSlice = createSlice({
    name: "global",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setBase(state, action: PayloadAction<string>) {
            state.base = parseInt(action.payload, 10);
            if (Number.isNaN(state.base) || state.base < 0) {
                state.base = 0;
            }
            if (state.base >= 2) {
                state.aInBaseText = parseAndPrintToBase(state.a, state.base);
                state.bInBaseText = parseAndPrintToBase(state.b, state.base);
            }
        },
        setAText(state, action: PayloadAction<string>) {
            state.aText = action.payload;
            const a = parseToPadicBasic(state.aText, 10);
            state.a = printPadicBasic(a, 10);
            try {
                state.aInBaseText = printPadicBasic(
                    convertBase(a, { inBase: 10, outBase: state.base }),
                    state.base
                );
            } catch {}
        },
        setAInBaseText(state, action: PayloadAction<string>) {
            state.aInBaseText = action.payload;
            const a = parseToPadicBasic(state.aInBaseText, state.base);
            try {
                state.a = printPadicBasic(
                    convertBase(a, { inBase: state.base, outBase: 10 })
                );
                state.aText = state.a;
            } catch {}
        },
        setBText(state, action: PayloadAction<string>) {
            state.bText = action.payload;
            const b = parseToPadicBasic(state.bText, 10);
            state.b = printPadicBasic(b, 10);
            try {
                state.bInBaseText = printPadicBasic(
                    convertBase(b, { inBase: 10, outBase: state.base }),
                    state.base
                );
            } catch {}
        },
        setBInBaseText(state, action: PayloadAction<string>) {
            state.bInBaseText = action.payload;
            const b = parseToPadicBasic(state.bInBaseText, state.base);
            try {
                state.b = printPadicBasic(
                    convertBase(b, { inBase: state.base, outBase: 10 })
                );
                state.bText = state.b;
            } catch {}
        },
    },
});

export const selector = {
    // Very inefficient selector, but it's fine for now...
    a: (state: RootState) =>
        state.base >= 2
            ? createPAdic(parseAndPrintToBase(state.a, state.base)).setBase(
                  state.base
              )
            : createPAdic(0),
    aText: (state: RootState) => state.aText,
    aInBaseText: (state: RootState) => state.aInBaseText,
    b: (state: RootState) =>
        state.base >= 2
            ? createPAdic(parseAndPrintToBase(state.b, state.base)).setBase(
                  state.base
              )
            : createPAdic(0),
    bText: (state: RootState) => state.bText,
    bInBaseText: (state: RootState) => state.bInBaseText,
    base: (state: RootState) => state.base,
};

export const actions = globalSlice.actions;
