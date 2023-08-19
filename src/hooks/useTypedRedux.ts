import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { TRootState, TAppDispatch } from "@/redux/store";

export const useTypedSelector: TypedUseSelectorHook<TRootState> = useSelector;
export const useTypedDispatch = () => useDispatch<TAppDispatch>();
