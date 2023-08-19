import { createSlice } from "@reduxjs/toolkit";
//
import { odder } from "@/utils/Odder";

export type TGAUSActionTypes = {
    SetKsize: number;
    SetSigmaX: number;
    SetSigmaY: number;
};

const initialState = {
    ksize: 7,
    sigmaX: 100,
    sigmaY: 0,
};

const GAUSSlice = createSlice({
    name: "GAUS",
    initialState,
    reducers: {
        SetKsize: (state, action) => {
            state.ksize = odder(state.ksize, action.payload);
        },
        SetSigmaX: (state, action) => {
            state.sigmaX = Number(action.payload);
        },
        SetSigmaY: (state, action) => {
            state.sigmaY = Number(action.payload);
        },
    },
});

export const { SetKsize, SetSigmaX, SetSigmaY } = GAUSSlice.actions;
export default GAUSSlice.reducer;
