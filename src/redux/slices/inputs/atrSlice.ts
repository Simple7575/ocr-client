import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TATRActionTypes = {
    SetMaxValue: number;
    SetAdaptiveMethod: number;
    SetThresholdType: number;
    SetBlockSize: number;
    SetC: number;
};

const initialState = {
    maxValue: 200,
    adaptiveMethod: 1,
    thresholdType: 0,
    blockSize: 3,
    C: 1,
};

const ATRSlice = createSlice({
    name: "ATR",
    initialState,
    reducers: {
        SetMaxValue: (state, action: PayloadAction<number>) => {
            state.maxValue = Number(action.payload);
        },
        SetAdaptiveMethod: (state, action: PayloadAction<number>) => {
            state.adaptiveMethod = Number(action.payload);
        },
        SetThresholdType: (state, action: PayloadAction<number>) => {
            state.thresholdType = Number(action.payload);
        },
        SetBlockSize: (state, action: PayloadAction<number>) => {
            if (Number(action.payload) % 2 !== 0) {
                state.blockSize = Number(action.payload);
            } else {
                state;
            }
        },
        SetC: (state, action: PayloadAction<number>) => {
            state.C = Number(action.payload);
        },
    },
});

export const { SetMaxValue, SetAdaptiveMethod, SetThresholdType, SetBlockSize, SetC } =
    ATRSlice.actions;

export default ATRSlice.reducer;
