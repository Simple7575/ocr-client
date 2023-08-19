import cv from "@techstark/opencv-js";
import { MutableRefObject, Dispatch, SetStateAction, useEffect, useState } from "react";
//
import { useTypedSelector } from "@/hooks/useTypedRedux";
import { useRedraw } from "@/hooks/useRedraw";

type Props = {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    srcImgRef: MutableRefObject<cv.Mat | undefined>;
    img: HTMLImageElement | null;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export default function Canvas({ canvasRef, srcImgRef, img, setIsLoading }: Props) {
    const [isCVready, setIsCVready] = useState(false);

    const { isBLF, isATR, isSTR, isResised, isGreyed, isGaus, isMedian } = useTypedSelector(
        (state) => state.CHKBX
    );

    const ATR = useTypedSelector((state) => state.ATR);
    const STR = useTypedSelector((state) => state.STR);
    const BLF = useTypedSelector((state) => state.BLF);
    const GAUS = useTypedSelector((state) => state.GAUS);
    const MEDIAN = useTypedSelector((state) => state.MEDIAN);

    cv["onRuntimeInitialized"] = () => {
        setIsCVready(true);
    };

    const debouncedRedraw = useRedraw({ srcImgRef, canvasRef, setIsLoading });

    useEffect(
        () => {
            if (!isCVready) return;
            if (!img) return;

            if (!srcImgRef.current || srcImgRef.current.isDeleted()) {
                srcImgRef.current = cv.imread(img);
            }

            debouncedRedraw();

            return () => {};
        },
        // prettier-ignore
        /* eslint-disable-next-line */
        [ ATR, STR, BLF, GAUS, MEDIAN, isCVready, isBLF, isResised, isGaus, isMedian, isGreyed, isATR, isSTR, img ]
    );

    return <canvas className="max-w-full" ref={canvasRef}></canvas>;
}
