import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    isBLF: false,
    isATR: false,
    isSTR: false,
    isResised: false,
    isGreyed: false,
    isGaus: false,
    isMedian: false,
};

const CHKBXSlice = createSlice({
    name: "CHKBX",
    initialState,
    reducers: {
        SetIsBLF: (state, action: PayloadAction<boolean>) => {
            state.isBLF = action.payload;
        },
        SetIsATR: (state, action: PayloadAction<boolean>) => {
            state.isATR = action.payload;
        },
        SetIsSTR: (state, action: PayloadAction<boolean>) => {
            state.isSTR = action.payload;
        },
        SetIsResised: (state, action: PayloadAction<boolean>) => {
            state.isResised = action.payload;
        },
        SetIsGreyed: (state, action: PayloadAction<boolean>) => {
            state.isGreyed = action.payload;
        },
        SetIsGaus: (state, action: PayloadAction<boolean>) => {
            state.isGaus = action.payload;
        },
        SetIsMedian: (state, action: PayloadAction<boolean>) => {
            state.isMedian = action.payload;
        },
    },
});

export const { SetIsBLF, SetIsATR, SetIsSTR, SetIsResised, SetIsGreyed, SetIsGaus, SetIsMedian } =
    CHKBXSlice.actions;
export default CHKBXSlice.reducer;
