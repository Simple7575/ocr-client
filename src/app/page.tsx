"use client";
import {
    ChangeEvent,
    useEffect,
    useReducer,
    useRef,
    useState,
    useTransition,
    type MouseEvent,
} from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import debounce from "lodash/debounce";

import cv from "@techstark/opencv-js";
import Tesseract, { createWorker } from "tesseract.js";
import { odder } from "@/utils/Odder";
// ----
import ATRinputs, { ATRinitial, ATRreducer } from "./(components)/ATRinputs";
import STRinputs, { STRType, STRinitial, STRreducer } from "./(components)/STRinputs";
import BLFinputs, { BLFinitial, BLFreducer, BLFtype } from "./(components)/BLFinputs";
import GAUSinputs, { GAUSinitial, GAUSreducer, GAUSType } from "./(components)/GausInputs";
import Medianinputs from "./(components)/Median";
import Checkboxes from "./(components)/Checkboxes";
// types
import { type ATRType } from "./(components)/ATRinputs";

export default function Home() {
    const isExecuted = useRef(false);
    const [isPending, startTransition] = useTransition();
    const [text, setText] = useState("");
    const [progress, setProgress] = useState("0");
    // refs
    const imgRef = useRef<HTMLImageElement | null>(null);
    const srcImgRef = useRef<cv.Mat | undefined>(undefined);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // bools
    const [isBilateralFon, setIsBilateralFon] = useState(false);
    const [isSTR, setIsSTR] = useState(false);
    const [isATR, setIsATR] = useState(false);
    const [isResised, setIsResized] = useState(false);
    const [isGreyed, setIsGreyed] = useState(false);
    const [isCVready, setIsCVready] = useState(false);
    const [isGausian, setIsGausian] = useState(false);
    const [isMedian, setIsMedian] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // states
    const [ATR, ATRdispatch] = useReducer(ATRreducer, ATRinitial);
    const [STR, STRdispatch] = useReducer(STRreducer, STRinitial);
    const [BLF, BLFdispatch] = useReducer(BLFreducer, BLFinitial);
    const [GAUS, GAUSdispatch] = useReducer(GAUSreducer, GAUSinitial);
    const [median, setMedian] = useState(3);

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
            if (isGreyed && !isBilateralFon) {
                cv.cvtColor(srcImgRef.current!, srcImgRef.current!, cv.COLOR_RGBA2GRAY, 0);
            }
            if (isBilateralFon) {
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
                cv.medianBlur(srcImgRef.current!, srcImgRef.current!, median);
            }
            if (isSTR) {
                // prettier-ignore
                cv.threshold( srcImgRef.current!, srcImgRef.current!, STR.thresh, STR.maxValue, STR.thresholdType );
            }
            if (isATR) {
                if (!isGreyed)
                    cv.cvtColor(srcImgRef.current!, srcImgRef.current!, cv.COLOR_RGBA2GRAY, 0);
                // prettier-ignore
                cv.adaptiveThreshold( srcImgRef.current!, srcImgRef.current!, ATR.maxValue, Number(ATR.adaptiveMethod), Number(ATR.thresholdType), Number(ATR.blockSize), ATR.C );
            }
            if (isGausian) {
                let ksize = new cv.Size(GAUS.ksize, GAUS.ksize);
                // prettier-ignore
                cv.GaussianBlur(srcImgRef.current!, srcImgRef.current!, ksize, GAUS.sigmaX, GAUS.sigmaY, cv.BORDER_DEFAULT);
            }

            cv.imshow(canvasRef.current!, srcImgRef.current!);
            setIsLoading(false);
            if (srcImgRef.current && !srcImgRef.current.isDeleted()) srcImgRef.current!.delete();
        } catch (error) {
            if (srcImgRef.current && !srcImgRef.current.isDeleted()) srcImgRef.current!.delete();
            console.error(error);
        }
    };

    const debounced = debounce(redraw, 500, {
        maxWait: 1000,
        // trailing: false,
        leading: false,
    });

    cv["onRuntimeInitialized"] = () => {
        setIsCVready(true);
    };

    useEffect(
        () => {
            if (!isCVready) return;

            if (!srcImgRef.current || srcImgRef.current.isDeleted()) {
                srcImgRef.current = cv.imread(imgRef.current!);
            }

            debounced();

            return () => {};
        },
        // prettier-ignore
        [ isCVready, ATR, STR, BLF, GAUS, isBilateralFon, isResised, isGausian, isMedian, isGreyed, median, isATR, isSTR ]
    );

    const handleATRchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        debounced.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = e.target.name.split("-")[1] as keyof ATRType;
        startTransition(() => {
            ATRdispatch({ type, payload });
        });
    };

    const handleSTRchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        debounced.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = e.target.name.split("-")[1] as keyof STRType;
        startTransition(() => {
            STRdispatch({ type, payload });
        });
    };

    const handleBLFchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        debounced.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = e.target.name.split("-")[1] as keyof BLFtype;
        startTransition(() => {
            BLFdispatch({ type, payload });
        });
    };

    const handleGAUSchange = (
        e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
    ) => {
        debounced.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        const type = e.target.name.split("-")[1] as keyof GAUSType;
        startTransition(() => {
            GAUSdispatch({ type, payload });
        });
    };

    const handleMedian = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        debounced.cancel();
        setIsLoading(true);
        const payload = Number(e.target.value);
        startTransition(() => {
            setMedian((pre) => odder(pre, payload));
        });
    };

    const handleOCR = async (e: MouseEvent<HTMLButtonElement>) => {
        console.log("OCR");

        const worker = await createWorker({
            logger: (message) => setProgress(String(message.progress)),
        });

        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        await worker.setParameters({
            tessedit_pageseg_mode: Tesseract.PSM.AUTO_ONLY,
            tessedit_ocr_engine_mode: Tesseract.OEM.TESSERACT_ONLY,
            preserve_interword_spaces: "0",
            // tessedit_write_images: true,
        });

        const res = await worker.recognize(canvasRef.current?.toDataURL()!);

        setText(res.data.text);
        await worker.terminate();
    };

    const handleSave = () => {
        const link = document.createElement("a");
        link.download = "filename.jpg";
        link.href = canvasRef.current!.toDataURL();
        link.click();
        link.remove();
    };

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const imgUrl = URL.createObjectURL(file);
            imgRef.current!.setAttribute("src", imgUrl);
        };

        imgRef.current!.onload = (e) => {
            let mat = cv.imread(imgRef.current!);
            let dst = new cv.Mat();
            // You can try more different parameters
            cv.threshold(mat, dst, 177, 200, cv.THRESH_BINARY);
            // cv.threshold(mat, )
            cv.imshow(canvasRef.current!, dst);
            mat.delete();
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex gap-3">
                <div>
                    <div className="relative">
                        <canvas className="max-w-2xl" ref={canvasRef}></canvas>
                        {isLoading ? (
                            <div className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center bg-slate-700/50">
                                <div className="">
                                    <AiOutlineLoading3Quarters
                                        size={56}
                                        color="purple"
                                        className="animate-spin mr-3"
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <p>Progress {progress} %</p>
                    <p className="text-sm w-96">{text}</p>
                </div>
                <div>
                    <div>
                        {/* prettier-ignore */}
                        <img className="max-w-2xl" id="imgSrc" src="./exampletrimmed.jpg" alt="srcimg" ref={imgRef} hidden/>
                        <input
                            className="file-input file-input-bordered file-input-secondary file-input-sm w-full max-w-xs"
                            type="file"
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-secondary">Controls</h3>
                        <Checkboxes
                            setIsLoading={setIsLoading}
                            isBilateralFon={isBilateralFon}
                            setIsBilateralFon={setIsBilateralFon}
                            isATR={isATR}
                            setIsATR={setIsATR}
                            isSTR={isSTR}
                            setIsSTR={setIsSTR}
                            isResised={isResised}
                            setIsResized={setIsResized}
                            isGreyed={isGreyed}
                            setIsGreyed={setIsGreyed}
                            isGausian={isGausian}
                            setIsGausian={setIsGausian}
                            isMedian={isMedian}
                            setIsMedian={setIsMedian}
                        />
                        <div className="h-80 overflow-y-scroll">
                            {isBilateralFon ? (
                                <BLFinputs BLF={BLF} handleBLFchange={handleBLFchange} />
                            ) : null}
                            {isATR ? (
                                <ATRinputs ATR={ATR} handleATRchange={handleATRchange} />
                            ) : null}
                            {isSTR ? (
                                <STRinputs STR={STR} handleSTRchange={handleSTRchange} />
                            ) : null}
                            {isMedian ? (
                                <Medianinputs median={median} handleMedian={handleMedian} />
                            ) : null}
                            {isGausian ? (
                                <GAUSinputs GAUS={GAUS} handleGAUSchange={handleGAUSchange} />
                            ) : null}
                        </div>
                        <div className="flex gap-x-2">
                            <button
                                className="btn btn-secondary btn-sm mt-1"
                                type="button"
                                onClick={handleOCR}
                            >
                                Process OCR
                            </button>
                            <button
                                className="btn btn-secondary btn-sm mt-1"
                                type="button"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
