import { ChangeEvent } from "react";

export type BLFtype = {
    D: number;
    sigmaColor: number;
    sigmaSpace: number;
    borderType: any;
};

export const BLFinitial = {
    D: 9,
    sigmaColor: 75,
    sigmaSpace: 75,
    borderType: 0,
};

export type BLFaction =
    | { type: "D"; payload: number }
    | { type: "sigmaColor"; payload: number }
    | { type: "sigmaSpace"; payload: number }
    | { type: "borderType"; payload: number };

export const BLFreducer = (state: BLFtype, action: BLFaction) => {
    switch (action.type) {
        case "D":
            return { ...state, D: Number(action.payload) };
        case "sigmaColor":
            return { ...state, sigmaColor: Number(action.payload) };
        case "sigmaSpace":
            return { ...state, sigmaSpace: Number(action.payload) };
        case "borderType":
            console.log(action.payload);
            return { ...state, borderType: Number(action.payload) };
        default:
            return state;
            break;
    }
};

interface Props {
    BLF: BLFtype;
    handleBLFchange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void;
}

export default function BLFinputs({ BLF, handleBLFchange }: Props) {
    return (
        <div className="flex flex-col w-64">
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
            <label className="flex flex-col" htmlFor="BLF-sigmaColor">
                <span className="text-sm text-neutral-content">
                    {`Sigma Color: ${BLF.sigmaColor}`}
                </span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="BLF-sigmaColor"
                    id="BLF-sigmaColor"
                    min={0}
                    max={255}
                    value={BLF.sigmaColor}
                    onChange={handleBLFchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="BLF-sigmaSpace">
                <span className="text-sm text-neutral-content">
                    {`Sigma Space: ${BLF.sigmaSpace}`}
                </span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    name="BLF-sigmaSpace"
                    id="BLF-sigmaSpace"
                    min={0}
                    max={255}
                    value={BLF.sigmaSpace}
                    onChange={handleBLFchange}
                />
            </label>
            <label className="flex flex-col" htmlFor="BLF-borderType">
                <span className="text-sm text-neutral-content">{`Border type: ${BLF.borderType}`}</span>
                <select
                    className="select select-xs select-secondary w-full max-w-xs"
                    name="BLF-borderType"
                    id="BLF-borderType"
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
