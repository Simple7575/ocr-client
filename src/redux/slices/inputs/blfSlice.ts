import { createSlice } from "@reduxjs/toolkit";

export type TBLFActionTypes = {
    SetD: number;
    SetSigmaColor: number;
    SetSigmaSpace: number;
    SetBorderType: number;
};

const initialState = {
    D: 9,
    sigmaColor: 75,
    sigmaSpace: 75,
    borderType: 0,
};

const BLFSlice = createSlice({
    name: "BLF",
    initialState,
    reducers: {
        SetD: (state, action) => {
            state.D = Number(action.payload);
        },
        SetSigmaColor: (state, action) => {
            state.sigmaColor = Number(action.payload);
        },
        SetSigmaSpace: (state, action) => {
            state.sigmaSpace = Number(action.payload);
        },
        SetBorderType: (state, action) => {
            state.borderType = Number(action.payload);
        },
    },
});

export const { SetD, SetSigmaColor, SetSigmaSpace, SetBorderType } = BLFSlice.actions;
export default BLFSlice.reducer;
