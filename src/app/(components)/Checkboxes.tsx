import { Dispatch, SetStateAction } from "react";

interface Props {
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    isBilateralFon: boolean;
    setIsBilateralFon: Dispatch<SetStateAction<boolean>>;
    isATR: boolean;
    setIsATR: Dispatch<SetStateAction<boolean>>;
    isSTR: boolean;
    setIsSTR: Dispatch<SetStateAction<boolean>>;
    isResised: boolean;
    setIsResized: Dispatch<SetStateAction<boolean>>;
    isGreyed: boolean;
    setIsGreyed: Dispatch<SetStateAction<boolean>>;
    isGausian: boolean;
    setIsGausian: Dispatch<SetStateAction<boolean>>;
    isMedian: boolean;
    setIsMedian: Dispatch<SetStateAction<boolean>>;
}

export default function Checkboxes({
    setIsLoading,
    isBilateralFon,
    setIsBilateralFon,
    isATR,
    setIsATR,
    isSTR,
    setIsSTR,
    isResised,
    setIsResized,
    isGreyed,
    setIsGreyed,
    isGausian,
    setIsGausian,
    isMedian,
    setIsMedian,
}: Props) {
    return (
        <div className="grid grid-cols-2">
            <label htmlFor="isResised" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isResised"
                    id="isResised"
                    checked={isResised}
                    onChange={() => {
                        setIsLoading(true);
                        setIsResized(!isResised);
                    }}
                />
                <span className="text-sm text-neutral-content">Is Resized</span>
            </label>
            <label htmlFor="isGreyed" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isGreyed"
                    id="isGreyed"
                    disabled={isBilateralFon}
                    checked={isGreyed}
                    onChange={() => {
                        setIsLoading(true);
                        setIsGreyed(!isGreyed);
                    }}
                />
                <span className="text-sm text-neutral-content">Is greyed</span>
            </label>
            <label htmlFor="isATR" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isATR"
                    id="isATR"
                    checked={isATR}
                    onChange={() => {
                        setIsLoading(true);
                        setIsATR(!isATR);
                    }}
                />
                <span className="text-sm text-neutral-content">isATR</span>
            </label>
            <label htmlFor="isSTR" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isSTR"
                    id="isSTR"
                    checked={isSTR}
                    onChange={() => {
                        setIsLoading(true);
                        setIsSTR(!isSTR);
                    }}
                />
                <span className="text-sm text-neutral-content">isSTR</span>
            </label>
            <label htmlFor="isMedian" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isMedian"
                    id="isMedian"
                    checked={isMedian}
                    onChange={() => {
                        setIsLoading(true);
                        setIsMedian(!isMedian);
                    }}
                />
                <span className="text-sm text-neutral-content">Is Median</span>
            </label>
            <label htmlFor="isBilateralOn" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isBilateralOn"
                    id="isBilateralOn"
                    checked={isBilateralFon}
                    onChange={() => {
                        setIsLoading(true);
                        setIsBilateralFon(!isBilateralFon);
                    }}
                />
                <span className="text-sm text-neutral-content">Is Bilateral on</span>
            </label>
            <label htmlFor="isGausian" className="flex gap-2">
                <input
                    className="checkbox checkbox-xs checkbox-secondary"
                    type="checkbox"
                    name="isGausian"
                    id="isGausian"
                    checked={isGausian}
                    onChange={() => {
                        setIsLoading(true);
                        setIsGausian(!isGausian);
                    }}
                />
                <span className="text-sm text-neutral-content">Is Gausian on</span>
            </label>
        </div>
    );
}
