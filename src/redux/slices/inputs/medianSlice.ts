import { createSlice } from "@reduxjs/toolkit";
//
import { odder } from "@/utils/Odder";

export type TMEDIANActionTypes = {
    SetMedian: number;
};

const initialState = {
    median: 3,
};

const MEDIANSlice = createSlice({
    name: "MEDIAN",
    initialState,
    reducers: {
        SetMedian: (state, action) => {
            state.median = odder(state.median, action.payload);
        },
    },
});

export const { SetMedian } = MEDIANSlice.actions;
export default MEDIANSlice.reducer;
