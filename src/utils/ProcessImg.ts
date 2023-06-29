import cv from "@techstark/opencv-js";

type ATR = {
    maxValue: number;
    adaptiveMethod: any;
    thresholdType: any;
    blockSize: number;
    C: number;
};

export class ProcessImg {
    constructor(private srcImg: cv.Mat) {}

    public bluredImg(src: cv.Mat = this.srcImg) {
        try {
            const ksize = new cv.Size(3, 3);
            const anchor = new cv.Point(-1, -1);
            const dst = new cv.Mat();
            cv.blur(src, dst, ksize, anchor, cv.BORDER_DEFAULT);
            return dst;
        } catch (error) {
            console.error(error);
        }
    }

    public medianBluredImg(src: cv.Mat = this.srcImg) {
        try {
            const dst = new cv.Mat();
            cv.medianBlur(src, dst, 7);
            return dst;
        } catch (error) {
            console.error(error);
        }
    }

    public bilateralImg(src: cv.Mat = this.srcImg, BL: any) {
        try {
            const dst = new cv.Mat();
            cv.bilateralFilter(src, dst, BL.D, BL.sigmaColor, BL.sigmaSpace, cv.BORDER_DEFAULT);
            return dst;
        } catch (error) {
            console.error(error);
        }
    }

    public imgGrey(src: cv.Mat = this.srcImg) {
        try {
            const dst = new cv.Mat();
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
            return dst;
        } catch (error) {
            console.error(error);
        }
    }

    public adaptiveTImg(src: cv.Mat = this.srcImg, ATR: ATR) {
        try {
            const dst = new cv.Mat();
            const greyed = new cv.Mat();
            cv.cvtColor(src, greyed, cv.COLOR_RGBA2GRAY, 0);
            // prettier-ignore
            cv.adaptiveThreshold( greyed, dst, ATR.maxValue, cv.ADAPTIVE_THRESH_GAUSSIAN_C, Number(ATR.thresholdType), Number(ATR.blockSize), ATR.C );
            greyed.delete();
            return dst;
        } catch (error) {
            console.error(error);
        }
    }

    public simpleTHold = () => {
        // cv.threshold(mat, dst, TR.thresh, TR.maxValue, cv.THRESH_BINARY);
    };

    public detectEdges = () => {
        // detect edges using Canny
        // const edges = new cv.Mat();
        // cv.Canny(imgGray, edges, 100, 100);
    };
}
