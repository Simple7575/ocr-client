import { DebouncedFunc } from "lodash";
import { ChangeEvent, Dispatch, SetStateAction, useTransition } from "react";
//
import { useTypedDispatch, useTypedSelector } from "@/hooks/useTypedRedux";
import * as STRActions from "@/redux/slices/inputs/strSlice";

type Props = {
    debouncedRedraw: DebouncedFunc<() => void>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function STRinputs({ debouncedRedraw, setIsLoading }: Props) {
    const [isPending, startTransition] = useTransition();

    const STR = useTypedSelector((state) => state.STR);
    const dispatch = useTypedDispatch();

    const handleSTRchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        debouncedRedraw.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = `Set${e.target.name.split("-")[1]}` as keyof STRActions.TSTRActionTypes;
        startTransition(() => {
            dispatch(STRActions[type](payload));
        });
    };

    return (
        <div className="flex flex-col w-64 border border-secondary-focus p-2">
            <strong>STR</strong>
            <label className="flex flex-col" htmlFor="STR-Thresh">
                <span className="text-sm text-neutral-content">{`Thresh: ${STR.thresh}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="STR-Thresh"
                    id="STR-Thresh"
                    min={0}
                    max={255}
                    value={STR.thresh}
                    onChange={handleSTRchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="STR-MaxValue">
                <span className="text-sm text-neutral-content">{`Max Value: ${STR.maxValue}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="STR-MaxValue"
                    id="STR-MaxValue"
                    min={0}
                    max={255}
                    value={STR.maxValue}
                    onChange={handleSTRchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="STR-ThresholdType">
                <span className="text-sm text-neutral-content">{`Threshold Type: ${STR.thresholdType}`}</span>
                <select
                    className="select select-xs select-secondary w-full max-w-xs"
                    name="STR-ThresholdType"
                    id="STR-ThresholdType"
                    value={STR.thresholdType}
                    onChange={handleSTRchange}
                >
                    <option value="0">THRESH_BINARY</option>
                    <option value="1">THRESH_BINARY_INV</option>
                    <option value="2">THRESH_TRUNC</option>
                    <option value="3">THRESH_TOZERO</option>
                    <option value="4">THRESH_OTSU</option>
                    <option value="5">THRESH_TRIANGLE</option>
                </select>
            </label>
        </div>
    );
}
