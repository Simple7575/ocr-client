import { ChangeEvent } from "react";

export type STRType = {
    thresh: number;
    maxValue: number;
    thresholdType: number;
};

export const STRinitial = {
    thresh: 0,
    maxValue: 0,
    thresholdType: 0,
} as STRType;

export type STRaction =
    | { type: "thresh"; payload: number }
    | { type: "maxValue"; payload: number }
    | { type: "thresholdType"; payload: number };

export const STRreducer = (state: STRType, action: STRaction) => {
    switch (action.type) {
        case "thresh":
            return { ...state, thresh: Number(action.payload) };
        case "maxValue":
            return { ...state, maxValue: Number(action.payload) };
        case "thresholdType":
            return { ...state, thresholdType: Number(action.payload) };
        default:
            return state;
    }
};

interface Props {
    STR: STRType;
    handleSTRchange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void;
}

export default function STRinputs({ STR, handleSTRchange }: Props) {
    return (
        <div className="flex flex-col w-64">
            <strong>STR</strong>
            <label className="flex flex-col" htmlFor="STR-thresh">
                <span className="text-sm text-neutral-content">{`Thresh: ${STR.thresh}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="STR-thresh"
                    id="STR-thresh"
                    min={0}
                    max={255}
                    value={STR.thresh}
                    onChange={handleSTRchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="STR-maxValue">
                <span className="text-sm text-neutral-content">{`Max Value: ${STR.maxValue}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="STR-maxValue"
                    id="STR-maxValue"
                    min={0}
                    max={255}
                    value={STR.maxValue}
                    onChange={handleSTRchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="STR-thresholdType">
                <span className="text-sm text-neutral-content">{`Threshold Type: ${STR.thresholdType}`}</span>
                <select
                    className="select select-sm select-secondary w-full max-w-xs"
                    name="STR-thresholdType"
                    id="STR-thresholdType"
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
