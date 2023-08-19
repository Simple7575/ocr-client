import cv from "@techstark/opencv-js";
import { MutableRefObject, Dispatch, SetStateAction } from "react";
import debounce from "lodash/debounce";
import { useTypedSelector } from "@/hooks/useTypedRedux";

type Props = {
    srcImgRef: MutableRefObject<cv.Mat | undefined>;
    canvasRef: MutableRefObject<HTMLCanvasElement | null>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useRedraw = ({ srcImgRef, canvasRef, setIsLoading }: Props) => {
    const { isBLF, isATR, isSTR, isResised, isGreyed, isGaus, isMedian } = useTypedSelector(
        (state) => state.CHKBX
    );
    const ATR = useTypedSelector((state) => state.ATR);
    const STR = useTypedSelector((state) => state.STR);
    const BLF = useTypedSelector((state) => state.BLF);
    const GAUS = useTypedSelector((state) => state.GAUS);
    const MEDIAN = useTypedSelector((state) => state.MEDIAN);

    const redraw = () => {
        try {
            if (srcImgRef.current?.isDeleted()) return;
            if (isResised) {
                // const [rw, rh] = CalculateAspRatio(3000, srcImg.cols, srcImg.rows);
                // let dsize = new cv.Size(rw, rh);
                // cv.resize(srcImg, srcImg, new cv.Size(0, 0), 5, 5, cv.INTER_CUBIC);
                // prettier-ignore
                cv.resize( srcImgRef.current!, srcImgRef.current!, new cv.Size(0, 0), 7, 7, cv.INTER_CUBIC );
            }
            if (isGreyed && !isBLF) {
                cv.cvtColor(srcImgRef.current!, srcImgRef.current!, cv.COLOR_RGBA2GRAY, 0);
            }
            if (isBLF) {
                const dst = new cv.Mat();
                try {
                    cv.cvtColor(srcImgRef.current!, dst, cv.COLOR_RGBA2GRAY, 0);
                    // prettier-ignore
                    cv.bilateralFilter(dst, srcImgRef.current!, BLF.D, BLF.sigmaColor, BLF.sigmaSpace, BLF.borderType);
                    dst.delete();
                } catch (error) {
                    dst.delete();
                    console.error(error);
                }
            }
            if (isMedian) {
                cv.medianBlur(srcImgRef.current!, srcImgRef.current!, MEDIAN.median);
                // cv.medianBlur(srcImgRef.current!, srcImgRef.current!, 3);
                // cv.medianBlur(srcImgRef.current!, srcImgRef.current!, 11);
            }
            if (isGaus) {
                let ksize = new cv.Size(GAUS.ksize, GAUS.ksize);
                // prettier-ignore
                cv.GaussianBlur(srcImgRef.current!, srcImgRef.current!, ksize, GAUS.sigmaX, GAUS.sigmaY, cv.BORDER_DEFAULT);
            }
            if (isSTR) {
                // cv.threshold(srcImgRef.current!, srcImgRef.current!, 162, 255, cv.THRESH_TRUNC);
                // prettier-ignore
                cv.threshold( srcImgRef.current!, srcImgRef.current!, STR.thresh, STR.maxValue, STR.thresholdType );
            }
            if (isATR) {
                if (!isGreyed)
                    cv.cvtColor(srcImgRef.current!, srcImgRef.current!, cv.COLOR_RGBA2GRAY, 0);
                // prettier-ignore
                cv.adaptiveThreshold( srcImgRef.current!, srcImgRef.current!, ATR.maxValue, Number(ATR.adaptiveMethod), Number(ATR.thresholdType), Number(ATR.blockSize), ATR.C );
            }
            // cv.Canny(srcImgRef.current!, srcImgRef.current!, 200, 50, 7, true);

            cv.imshow(canvasRef.current!, srcImgRef.current!);
            setIsLoading(false);
            if (srcImgRef.current && !srcImgRef.current.isDeleted()) srcImgRef.current!.delete();
        } catch (error) {
            if (srcImgRef.current && !srcImgRef.current.isDeleted()) srcImgRef.current!.delete();
            console.error(error);
        }
    };

    const debouncedRedraw = debounce(redraw, 500, {
        maxWait: 1000,
        leading: false,
    });

    return debouncedRedraw;
};
