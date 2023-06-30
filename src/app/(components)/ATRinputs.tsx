import { ChangeEvent } from "react";

export type ATRType = {
    maxValue: number;
    adaptiveMethod: any;
    thresholdType: any;
    blockSize: number;
    C: number;
};

export const ATRinitial = {
    maxValue: 200,
    adaptiveMethod: 1,
    thresholdType: 0,
    blockSize: 3,
    C: 1,
} as ATRType;

export type ATRaction =
    | { type: "maxValue"; payload: number }
    | { type: "adaptiveMethod"; payload: number }
    | { type: "thresholdType"; payload: number }
    | { type: "blockSize"; payload: number }
    | { type: "C"; payload: number };

export const ATRreducer = (state: ATRType, action: ATRaction) => {
    switch (action.type) {
        case "maxValue":
            return { ...state, maxValue: Number(action.payload) };
        case "adaptiveMethod":
            return { ...state, adaptiveMethod: Number(action.payload) };
        case "thresholdType":
            return { ...state, thresholdType: Number(action.payload) };
        case "blockSize":
            if (Number(action.payload) % 2 !== 0)
                return { ...state, blockSize: Number(action.payload) };
            else return { ...state };
        case "C":
            return { ...state, C: Number(action.payload) };
        default:
            return state;
            break;
    }
};

interface Props {
    ATR: ATRType;
    handleATRchange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void;
}

export default function ATRinputs({ ATR, handleATRchange }: Props) {
    return (
        <div className="flex flex-col w-64">
            <strong>ATR</strong>
            <label className="flex flex-col" htmlFor="ATR-maxValue">
                <span className="text-sm text-neutral-content">{`Max Value: ${ATR.maxValue}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="ATR-maxValue"
                    id="ATR-maxValue"
                    min={0}
                    max={255}
                    value={ATR.maxValue}
                    onChange={handleATRchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="ATR-adaptiveMethod">
                <span className="text-sm text-neutral-content">{`Adaptive Method: ${ATR.adaptiveMethod}`}</span>
                <select
                    className="select select-sm select-secondary w-full max-w-xs"
                    name="ATR-adaptiveMethod"
                    id="ATR-adaptiveMethod"
                    value={ATR.adaptiveMethod}
                    onChange={handleATRchange}
                >
                    <option value="0">ADAPTIVE_THRESH_MEAN_C</option>
                    <option value="1">ADAPTIVE_THRESH_GAUSSIAN_C</option>
                </select>
            </label>
            <label className="flex flex-col" htmlFor="ATR-thresholdType">
                <span className="text-sm text-neutral-content">{`Threshold Type: ${ATR.thresholdType}`}</span>
                <select
                    className="select select-sm select-secondary w-full max-w-xs"
                    name="ATR-thresholdType"
                    id="ATR-thresholdType"
                    value={ATR.thresholdType}
                    onChange={handleATRchange}
                >
                    <option value="0">THRESH_BINARY</option>
                    <option value="1">THRESH_BINARY_INV</option>
                </select>
            </label>
            <label className="flex flex-col" htmlFor="ATR-blockSize">
                <span className="text-sm text-neutral-content">{`Block Size: ${ATR.blockSize}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="ATR-blockSize"
                    id="ATR-blockSize"
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
