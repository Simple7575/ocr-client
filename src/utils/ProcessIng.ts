import cv from "@techstark/opencv-js";
// types
import { type ATRType } from "@/app/(components)/ATRinputs";
import { type BLFtype } from "@/app/(components)/BLFinputs";
import { type STRType } from "@/app/(components)/STRinputs";

export class ProcessImg {
    constructor(private srcImg: cv.Mat) {}

    public bluredImg(src: cv.Mat = this.srcImg) {
        const dst = new cv.Mat();
        try {
            const ksize = new cv.Size(3, 3);
            const anchor = new cv.Point(-1, -1);
            cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);
            return dst;
        } catch (error) {
            if (dst) dst.delete();
            console.error(error);
        }
    }

    public medianBluredImg(src: cv.Mat = this.srcImg) {
        const dst = new cv.Mat();
        try {
            cv.medianBlur(src, dst, 7);
            return dst;
        } catch (error) {
            if (dst) dst.delete();
            console.error(error);
        }
    }

    public bilateralImg(src: cv.Mat, BLF: BLFtype) {
        const dst = new cv.Mat();
        try {
            cv.bilateralFilter(src, dst, BLF.D, BLF.sigmaColor, BLF.sigmaSpace, cv.BORDER_DEFAULT);
            return dst;
        } catch (error) {
            console.error(error);
        }
    }

    public greyedImg(src: cv.Mat = this.srcImg) {
        const dst = new cv.Mat();
        try {
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
            return dst;
        } catch (error) {
            if (dst) dst.delete();
            console.error(error);
        }
    }

    public simpleThreshold = (src: cv.Mat, STR: STRType) => {
        const dst = new cv.Mat();
        try {
            cv.threshold(src, dst, STR.thresh, STR.maxValue, STR.thresholdType);
            return dst;
        } catch (error) {
            if (dst) dst.delete();
            console.error(error);
        }
    };

    public adaptiveTImg(src: cv.Mat, ATR: ATRType) {
        const dst = new cv.Mat();
        try {
            // prettier-ignore
            cv.adaptiveThreshold( src, dst, ATR.maxValue, Number(ATR.adaptiveMethod), Number(ATR.thresholdType), Number(ATR.blockSize), ATR.C );
            return dst;
        } catch (error) {
            if (dst) dst.delete();
            console.error(error);
        }
    }

    public detectEdges = () => {
        // detect edges using Canny
        // const edges = new cv.Mat();
        // cv.Canny(imgGray, edges, 100, 100);
    };
}
