import { DebouncedFunc } from "lodash";
import { ChangeEvent, Dispatch, SetStateAction, useTransition } from "react";
//
import { useTypedDispatch, useTypedSelector } from "../../../hooks/useTypedRedux";
import * as ATRActions from "@/redux/slices/inputs/atrSlice";

type Props = {
    debouncedRedraw: DebouncedFunc<() => void>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function ATRinputs({ debouncedRedraw, setIsLoading }: Props) {
    const [isPending, startTransition] = useTransition();

    const ATR = useTypedSelector((state) => state.ATR);
    const dispatch = useTypedDispatch();

    const handleATRchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        debouncedRedraw.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = `Set${e.target.name.split("-")[1]}` as keyof ATRActions.TATRActionTypes;
        startTransition(() => {
            dispatch(ATRActions[type](payload));
        });
    };

    return (
        <div className="flex flex-col w-64 border border-secondary-focus p-2">
            <strong>ATR</strong>
            <label className="flex flex-col" htmlFor="ATR-MaxValue">
                <span className="text-sm text-neutral-content">{`Max Value: ${ATR.maxValue}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="ATR-MaxValue"
                    id="ATR-MaxValue"
                    min={0}
                    max={255}
                    value={ATR.maxValue}
                    onChange={handleATRchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="ATR-AdaptiveMethod">
                <span className="text-sm text-neutral-content">{`Adaptive Method: ${ATR.adaptiveMethod}`}</span>
                <select
                    className="select select-xs select-secondary w-full max-w-xs"
                    name="ATR-AdaptiveMethod"
                    id="ATR-AdaptiveMethod"
                    value={ATR.adaptiveMethod}
                    onChange={handleATRchange}
                >
                    <option value="0">ADAPTIVE_THRESH_MEAN_C</option>
                    <option value="1">ADAPTIVE_THRESH_GAUSSIAN_C</option>
                </select>
            </label>
            <label className="flex flex-col" htmlFor="ATR-ThresholdType">
                <span className="text-sm text-neutral-content">{`Threshold Type: ${ATR.thresholdType}`}</span>
                <select
                    className="select select-xs select-secondary w-full max-w-xs"
                    name="ATR-ThresholdType"
                    id="ATR-ThresholdType"
                    value={ATR.thresholdType}
                    onChange={handleATRchange}
                >
                    <option value="0">THRESH_BINARY</option>
                    <option value="1">THRESH_BINARY_INV</option>
                </select>
            </label>
            <label className="flex flex-col" htmlFor="ATR-BlockSize">
                <span className="text-sm text-neutral-content">{`Block Size: ${ATR.blockSize}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="ATR-BlockSize"
                    id="ATR-BlockSize"
                    min={1}
                    max={255}
                    value={ATR.blockSize}
                    onChange={handleATRchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="ATR-C">
                <span className="text-sm text-neutral-content">{`C: ${ATR.C}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="ATR-C"
                    id="ATR-C"
                    min={-100}
                    max={100}
                    value={ATR.C}
                    onChange={handleATRchange}
                />
            </label>
        </div>
    );
}
