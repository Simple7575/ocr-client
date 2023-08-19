import { DebouncedFunc } from "lodash";
import { ChangeEvent, Dispatch, SetStateAction, useTransition } from "react";
//
import { useTypedDispatch, useTypedSelector } from "@/hooks/useTypedRedux";
import * as BLFActions from "@/redux/slices/inputs/blfSlice";

type Props = {
    debouncedRedraw: DebouncedFunc<() => void>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function BLFinputs({ debouncedRedraw, setIsLoading }: Props) {
    const [isPending, startTransition] = useTransition();

    const BLF = useTypedSelector((state) => state.BLF);
    const dispatch = useTypedDispatch();

    const handleBLFchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        debouncedRedraw.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = `Set${e.target.name.split("-")[1]}` as keyof BLFActions.TBLFActionTypes;
        startTransition(() => {
            dispatch(BLFActions[type](payload));
        });
    };

    return (
        <div className="flex flex-col w-64 border border-secondary-focus p-2">
            <strong>BLF</strong>
            <label className="flex flex-col" htmlFor="BLF-D">
                <span className="text-sm text-neutral-content">{`Diemeter: ${BLF.D}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="BLF-D"
                    id="BLF-D"
                    min={1}
                    max={20}
                    value={BLF.D}
                    onChange={handleBLFchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="BLF-SigmaColor">
                <span className="text-sm text-neutral-content">
                    {`Sigma Color: ${BLF.sigmaColor}`}
                </span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="BLF-SigmaColor"
                    id="BLF-SigmaColor"
                    min={0}
                    max={255}
                    value={BLF.sigmaColor}
                    onChange={handleBLFchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="BLF-SigmaSpace">
                <span className="text-sm text-neutral-content">
                    {`Sigma Space: ${BLF.sigmaSpace}`}
                </span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="BLF-SigmaSpace"
                    id="BLF-SigmaSpace"
                    min={0}
                    max={255}
                    value={BLF.sigmaSpace}
                    onChange={handleBLFchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="BLF-BorderType">
                <span className="text-sm text-neutral-content">{`Border type: ${BLF.borderType}`}</span>
                <select
                    className="select select-xs select-secondary w-full max-w-xs"
                    name="BLF-BorderType"
                    id="BLF-BorderType"
                    value={BLF.borderType}
                    onChange={handleBLFchange}
                >
                    <option value="0">BORDER_CONSTANT</option>
                    <option value="1">BORDER_REPLICATE</option>
                    <option value="2">BORDER_REFLECT</option>
                    <option value="3">BORDER_WRAP</option>
                    <option value="4">BORDER_REFLECT_101</option>
                </select>
            </label>
        </div>
    );
}
