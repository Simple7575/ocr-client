import { Dispatch, SetStateAction } from "react";

interface Props {
    isBilateralFon: boolean;
    setIsBilateralFon: Dispatch<SetStateAction<boolean>>;
    isThresholded: boolean;
    setThresholded: Dispatch<SetStateAction<boolean>>;
    isResised: boolean;
    setIsResized: Dispatch<SetStateAction<boolean>>;
    TRtype: string;
    setTRtype: Dispatch<SetStateAction<string>>;
}

export default function Checkboxes({
    isBilateralFon,
    setIsBilateralFon,
    isThresholded,
    setThresholded,
    isResised,
    setIsResized,
    TRtype,
    setTRtype,
}: Props) {
    return (
        <>
            <div>
                <label htmlFor="STR-radio">
                    STR
                    <input
                        type="radio"
                        name="TR-type"
                        id="STR-radio"
                        value="STR"
                        onChange={(e) => {
                            setTRtype(e.target.value);
                        }}
                        checked={TRtype === "STR"}
                    />
                </label>
                <label htmlFor="ATR-radio">
                    ATR
                    <input
                        type="radio"
                        name="TR-type"
                        id="ATR-radio"
                        value="ATR"
                        onChange={(e) => {
                            setTRtype(e.target.value);
                        }}
                        checked={TRtype === "ATR"}
                    />
                </label>
            </div>
            <label htmlFor="isResised" className="flex gap-2 mb-1">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isResised"
                    id="isResised"
                    checked={isResised}
                    onChange={() => setIsResized(!isResised)}
                />
                <span className="text-sm text-neutral-content">Is Resized</span>
            </label>
            <label htmlFor="isThresholded" className="flex gap-2 mb-1">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isThresholded"
                    id="isThresholded"
                    checked={isThresholded}
                    onChange={() => setThresholded(!isThresholded)}
                />
                <span className="text-sm text-neutral-content">Is Threshholded</span>
            </label>
            <label htmlFor="isBilateralOn" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isBilateralOn"
                    id="isBilateralOn"
                    checked={isBilateralFon}
                    onChange={() => setIsBilateralFon(!isBilateralFon)}
                />
                <span className="text-sm text-neutral-content">Is bilateral on</span>
            </label>
        </>
    );
}
