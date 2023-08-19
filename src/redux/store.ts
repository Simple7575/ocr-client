import { configureStore } from "@reduxjs/toolkit";
import ATRReducer from "./slices/inputs/atrSlice";
import STRReducer from "./slices/inputs/strSlice";
import BLFReducer from "./slices/inputs/blfSlice";
import GAUSReducer from "./slices/inputs/gausSlice";
import MEDIANReducer from "./slices/inputs/medianSlice";
import CHKBXReducer from "./slices/checkboxes/chkbxSlice";

export const store = configureStore({
    reducer: {
        ATR: ATRReducer,
        STR: STRReducer,
        BLF: BLFReducer,
        GAUS: GAUSReducer,
        MEDIAN: MEDIANReducer,
        CHKBX: CHKBXReducer,
    },
});

export type TRootState = ReturnType<typeof store.getState>;
export type TAppDispatch = typeof store.dispatch;
