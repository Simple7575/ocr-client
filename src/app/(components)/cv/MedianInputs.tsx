import { DebouncedFunc } from "lodash";
import { ChangeEvent, Dispatch, SetStateAction, useTransition } from "react";
//
import { useTypedDispatch, useTypedSelector } from "@/hooks/useTypedRedux";
import * as MEDIANActions from "@/redux/slices/inputs/medianSlice";

type Props = {
    debouncedRedraw: DebouncedFunc<() => void>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function Medianinputs({ debouncedRedraw, setIsLoading }: Props) {
    const [isPending, startTransition] = useTransition();

    const MEDIAN = useTypedSelector((state) => state.MEDIAN);
    const dispatch = useTypedDispatch();

    const handleMedian = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        debouncedRedraw.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = `Set${e.target.name.split("-")[1]}` as keyof MEDIANActions.TMEDIANActionTypes;
        startTransition(() => {
            dispatch(MEDIANActions[type](payload));
        });
    };

    return (
        <div className="flex flex-col w-64 border border-secondary-focus p-2">
            <strong>Median</strong>
            <label className="flex flex-col" htmlFor="MEDIAN-Median">
                <span className="text-sm text-neutral-content">{`Median: ${MEDIAN.median}`}</span>
                <input
                    className="range range-secondary range-xs"
                    name="MEDIAN-Median"
                    id="MEDIAN-Median"
                    type="range"
                    min="3"
                    max="21"
                    value={MEDIAN.median}
                    onChange={handleMedian}
                />
            </label>
        </div>
    );
}
