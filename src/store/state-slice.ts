import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bigIntToBase } from "../lib/bigint-to-base";
import { parseBigInt } from "../lib/parse-bigint";
import { RootState, AppThunk } from "./store";

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
                state.aInBaseText = bigIntToBase(state.a, state.base);
            }
        },
        setAText(state, action: PayloadAction<string>) {
            state.aText = action.payload;
            const a = parseBigInt(state.aText, 10);
            state.a = String(a);
            state.aInBaseText = bigIntToBase(a, state.base);
        },
        setAInBaseText(state, action: PayloadAction<string>) {
            state.aInBaseText = action.payload;
            const a = parseBigInt(state.aInBaseText, state.base);
            state.a = String(a);
            state.aText = bigIntToBase(a, 10);
        },
        setBText(state, action: PayloadAction<string>) {
            state.bText = action.payload;
            const b = parseBigInt(state.bText, 10);
            state.b = String(b);
            state.bInBaseText = bigIntToBase(b, state.base);
        },
        setBInBaseText(state, action: PayloadAction<string>) {
            state.bInBaseText = action.payload;
            const b = parseBigInt(state.bInBaseText, state.base);
            state.b = String(b);
            state.bText = bigIntToBase(b, 10);
        },
    },
});

export const selector = {
    a: (state: RootState) => BigInt(state.a),
    aText: (state: RootState) => state.aText,
    aInBaseText: (state: RootState) => state.aInBaseText,
    b: (state: RootState) => BigInt(state.b),
    bText: (state: RootState) => state.bText,
    bInBaseText: (state: RootState) => state.bInBaseText,
    base: (state: RootState) => state.base,
};

export const actions = globalSlice.actions;
