import { odder } from "@/utils/Odder";
import { ChangeEvent } from "react";

export type GAUSType = {
    ksize: number;
    sigmaX: number;
    sigmaY: number;
};

export const GAUSinitial = {
    ksize: 7,
    sigmaX: 100,
    sigmaY: 0,
} as GAUSType;

export type GAUSaction =
    | { type: "ksize"; payload: number }
    | { type: "sigmaX"; payload: number }
    | { type: "sigmaY"; payload: number };

export const GAUSreducer = (state: GAUSType, action: GAUSaction) => {
    switch (action.type) {
        case "ksize":
            return { ...state, ksize: odder(state.ksize, action.payload) };
        case "sigmaX":
            return { ...state, sigmaX: Number(action.payload) };
        case "sigmaY":
            return { ...state, sigmaY: Number(action.payload) };
        default:
            return state;
    }
};

interface Props {
    GAUS: GAUSType;
    handleGAUSchange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void;
}

export default function GAUSinputs({ GAUS, handleGAUSchange }: Props) {
    return (
        <div className="flex flex-col w-64 border border-secondary-focus p-2">
            <strong>Gausian blur</strong>
            <label className="flex flex-col" htmlFor="GAUS-ksize">
                <span className="text-sm text-neutral-content">{`Ksize: ${GAUS.ksize}, ${GAUS.ksize}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="GAUS-ksize"
                    id="GAUS-ksize"
                    min={3}
                    max={15}
                    value={GAUS.ksize}
                    onChange={handleGAUSchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="GAUS-sigmaX">
                <span className="text-sm text-neutral-content">{`SigmaX: ${GAUS.sigmaX}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="GAUS-sigmaX"
                    id="GAUS-sigmaX"
                    min={1}
                    max={255}
                    value={GAUS.sigmaX}
                    onChange={handleGAUSchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="GAUS-sigmaY">
                <span className="text-sm text-neutral-content">{`SigmaY: ${GAUS.sigmaY}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="GAUS-sigmaY"
                    id="GAUS-sigmaY"
                    min={1}
                    max={255}
                    value={GAUS.sigmaY}
                    onChange={handleGAUSchange}
                />
            </label>
        </div>
    );
}
