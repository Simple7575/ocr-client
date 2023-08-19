import { createSlice } from "@reduxjs/toolkit";

export type TSTRActionTypes = {
    SetThresh: number;
    SetMaxValue: number;
    SetThresholdType: number;
};

const initialState = {
    thresh: 0,
    maxValue: 0,
    thresholdType: 0,
};

const STRSlice = createSlice({
    name: "STR",
    initialState,
    reducers: {
        SetThresh: (state, action) => {
            state.thresh = Number(action.payload);
        },
        SetMaxValue: (state, action) => {
            state.maxValue = Number(action.payload);
        },
        SetThresholdType: (state, action) => {
            state.thresholdType = Number(action.payload);
        },
    },
});

export const { SetThresh, SetMaxValue, SetThresholdType } = STRSlice.actions;
export default STRSlice.reducer;
