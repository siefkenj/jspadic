import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { globalSlice } from "./state-slice";

export const store = configureStore({
    reducer: globalSlice.reducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
