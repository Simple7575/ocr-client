import { Dispatch, SetStateAction } from "react";
//
import { useTypedDispatch, useTypedSelector } from "@/hooks/useTypedRedux";
import * as CHKBXActions from "@/redux/slices/checkboxes/chkbxSlice";

interface Props {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function Checkboxes({ setIsLoading }: Props) {
    const { isBLF, isATR, isSTR, isResised, isGreyed, isGaus, isMedian } = useTypedSelector(
        (state) => state.CHKBX
    );
    const dispatch = useTypedDispatch();

    return (
        <div className="grid grid-cols-2">
            <label htmlFor="isResised" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isResised"
                    id="isResised"
                    checked={isResised}
                    onChange={() => {
                        setIsLoading(true);
                        dispatch(CHKBXActions.SetIsResised(!isResised));
                    }}
                />
                <span className="text-sm text-neutral-content">Is Resized</span>
            </label>
            <label htmlFor="isGreyed" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isGreyed"
                    id="isGreyed"
                    disabled={isBLF}
                    checked={isGreyed}
                    onChange={() => {
                        setIsLoading(true);
                        dispatch(CHKBXActions.SetIsGreyed(!isGreyed));
                    }}
                />
                <span className="text-sm text-neutral-content">Is greyed</span>
            </label>
            <label htmlFor="isATR" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isATR"
                    id="isATR"
                    checked={isATR}
                    onChange={() => {
                        setIsLoading(true);
                        dispatch(CHKBXActions.SetIsATR(!isATR));
                    }}
                />
                <span className="text-sm text-neutral-content">isATR</span>
            </label>
            <label htmlFor="isSTR" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isSTR"
                    id="isSTR"
                    checked={isSTR}
                    onChange={() => {
                        setIsLoading(true);
                        dispatch(CHKBXActions.SetIsSTR(!isSTR));
                    }}
                />
                <span className="text-sm text-neutral-content">isSTR</span>
            </label>
            <label htmlFor="isMedian" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isMedian"
                    id="isMedian"
                    checked={isMedian}
                    onChange={() => {
                        setIsLoading(true);
                        dispatch(CHKBXActions.SetIsMedian(!isMedian));
                    }}
                />
                <span className="text-sm text-neutral-content">Is Median</span>
            </label>
            <label htmlFor="isBilateralOn" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isBilateralOn"
                    id="isBilateralOn"
                    checked={isBLF}
                    onChange={() => {
                        setIsLoading(true);
                        dispatch(CHKBXActions.SetIsBLF(!isBLF));
                    }}
                />
                <span className="text-sm text-neutral-content">Is Bilateral on</span>
            </label>
            <label htmlFor="isGausian" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isGausian"
                    id="isGausian"
                    checked={isGaus}
                    onChange={() => {
                        setIsLoading(true);
                        dispatch(CHKBXActions.SetIsGaus(!isGaus));
                    }}
                />
                <span className="text-sm text-neutral-content">Is Gausian on</span>
            </label>
        </div>
    );
}
