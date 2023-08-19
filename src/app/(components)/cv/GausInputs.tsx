import { DebouncedFunc } from "lodash";
import { ChangeEvent, Dispatch, SetStateAction, useTransition } from "react";
//
import { useTypedDispatch, useTypedSelector } from "../../../hooks/useTypedRedux";
import * as GAUSActions from "@/redux/slices/inputs/gausSlice";

type Props = {
    debouncedRedraw: DebouncedFunc<() => void>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function GAUSinputs({ debouncedRedraw, setIsLoading }: Props) {
    const [isPending, startTransition] = useTransition();

    const GAUS = useTypedSelector((state) => state.GAUS);
    const dispatch = useTypedDispatch();

    const handleGAUSchange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        debouncedRedraw.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = `Set${e.target.name.split("-")[1]}` as keyof GAUSActions.TGAUSActionTypes;
        startTransition(() => {
            dispatch(GAUSActions[type](payload));
        });
    };

    return (
        <div className="flex flex-col w-64 border border-secondary-focus p-2">
            <strong>Gausian blur</strong>
            <label className="flex flex-col" htmlFor="GAUS-Ksize">
                <span className="text-sm text-neutral-content">{`Ksize: ${GAUS.ksize}, ${GAUS.ksize}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="GAUS-Ksize"
                    id="GAUS-Ksize"
                    min={3}
                    max={15}
                    value={GAUS.ksize}
                    onChange={handleGAUSchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="GAUS-SigmaX">
                <span className="text-sm text-neutral-content">{`SigmaX: ${GAUS.sigmaX}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="GAUS-SigmaX"
                    id="GAUS-SigmaX"
                    min={1}
                    max={255}
                    value={GAUS.sigmaX}
                    onChange={handleGAUSchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="GAUS-SigmaY">
                <span className="text-sm text-neutral-content">{`SigmaY: ${GAUS.sigmaY}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="GAUS-SigmaY"
                    id="GAUS-SigmaY"
                    min={1}
                    max={255}
                    value={GAUS.sigmaY}
                    onChange={handleGAUSchange}
                />
            </label>
        </div>
    );
}
