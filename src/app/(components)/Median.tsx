import { ChangeEvent } from "react";

interface Props {
    median: number;
    handleMedian: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void;
}

export default function Medianinputs({ median, handleMedian }: Props) {
    return (
        <div className="flex flex-col w-64 border border-secondary-focus p-2">
            <strong>Median</strong>
            <label className="flex flex-col" htmlFor="">
                <span className="text-sm text-neutral-content">{`Median: ${median}`}</span>
                <input
                    className="range range-secondary range-xs"
                    type="range"
                    min="3"
                    max="21"
                    value={median}
                    onChange={handleMedian}
                />
            </label>
        </div>
    );
}
