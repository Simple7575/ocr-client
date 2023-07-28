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
import { PiCopySimple } from "react-icons/pi";
import debounce from "lodash/debounce";

import cv from "@techstark/opencv-js";
import Tesseract, { createWorker } from "tesseract.js";
import { odder } from "@/utils/Odder";
// ----
import ATRinputs, { ATRinitial, ATRreducer } from "../ATRinputs";
import STRinputs, { STRType, STRinitial, STRreducer } from "../STRinputs";
import BLFinputs, { BLFinitial, BLFreducer, BLFtype } from "../BLFinputs";
import GAUSinputs, { GAUSinitial, GAUSreducer, GAUSType } from "../GausInputs";
import Medianinputs from "../Median";
import Checkboxes from "../Checkboxes";
import Footer from "../footer/Footer";
// types
import { type ATRType } from "../ATRinputs";

export default function Ocr() {
    const [isPending, startTransition] = useTransition();
    const [text, setText] = useState("");
    const [progress, setProgress] = useState(0);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    // refs
    const srcImgRef = useRef<cv.Mat | undefined>(undefined);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    // bools
    const [isDefaultSettings, setIsDefaultSettings] = useState(true);
    const [isBilateralFon, setIsBilateralFon] = useState(false);
    const [isSTR, setIsSTR] = useState(false);
    const [isATR, setIsATR] = useState(false);
    const [isResised, setIsResized] = useState(false);
    const [isGreyed, setIsGreyed] = useState(false);
    const [isCVready, setIsCVready] = useState(false);
    const [isGausian, setIsGausian] = useState(false);
    const [isMedian, setIsMedian] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTextLoading, setIsTextLoading] = useState(false);
    // states
    const [ATR, ATRdispatch] = useReducer(ATRreducer, ATRinitial);
    const [STR, STRdispatch] = useReducer(STRreducer, STRinitial);
    const [BLF, BLFdispatch] = useReducer(BLFreducer, BLFinitial);
    const [GAUS, GAUSdispatch] = useReducer(GAUSreducer, GAUSinitial);
    const [median, setMedian] = useState(3);
    // error
    const [error, setError] = useState("");

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
                // cv.medianBlur(srcImgRef.current!, srcImgRef.current!, 3);
                // cv.medianBlur(srcImgRef.current!, srcImgRef.current!, 11);
            }
            if (isGausian) {
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

    const debounced = debounce(redraw, 500, {
        maxWait: 1000,
        // trailing: false,
        leading: false,
    });

    cv["onRuntimeInitialized"] = () => {
        setIsCVready(true);
    };

    useEffect(() => {
        const globalLoading = document.getElementById("global-loading");
        if (!globalLoading) return;
        globalLoading.style.display = "none";
    }, []);

    useEffect(
        () => {
            if (!isCVready) return;
            if (!img) return;

            if (!srcImgRef.current || srcImgRef.current.isDeleted()) {
                srcImgRef.current = cv.imread(img);
            }

            debounced();

            return () => {};
        },
        // prettier-ignore
        /* eslint-disable-next-line */
        [ isCVready, ATR, STR, BLF, GAUS, isBilateralFon, isResised, isGausian, isMedian, isGreyed, median, isATR, isSTR, img ]
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
        try {
            setIsTextLoading(true);
            // setError("OCR");

            const worker = await createWorker({
                errorHandler: (err) => {
                    console.error(err);
                    // setError(err);
                },
                logger: (message) => {
                    setProgress(Math.round(message.progress * 100));
                    // setError((pre) => pre + `\n${JSON.stringify(message)}`);
                },
                langPath: "/eng.traineddata",
                corePath: "/core",
                workerPath: "/dist/worker.min.js",
            });

            // setError((pre) => pre + "\nPassed");
            await worker.loadLanguage("eng");
            await worker.initialize("eng");
            await worker.setParameters({
                tessedit_pageseg_mode: Tesseract.PSM.AUTO_ONLY,
                tessedit_ocr_engine_mode: Tesseract.OEM.TESSERACT_ONLY,
                preserve_interword_spaces: "0",
            });

            const res = await worker.recognize(canvasRef.current?.toDataURL()!);

            setText(res.data.text);
            setIsTextLoading(false);
            await worker.terminate();
        } catch (error) {
            setError(JSON.stringify(error));
            console.error(error);
        }
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
        if (!file) return;
        const reader = new FileReader();

        reader.onload = (e) => {
            const image = document.createElement("img");
            image.setAttribute("src", e.target!.result! as string);
            setImg(image);
            image.remove();
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col items-center justify-between min-h-screen gap-y-2">
            <header>
                <h1 className="text-4xl text-secondary mt-4 font-bold">IMAGE TO TEXT</h1>
            </header>
            <div className="grid gap-x-2 gap-y-2 smm:flex flex-col border-l-2 border-l-neutral border-r-2 border-r-neutral py-2 px-2">
                <div className="col-start-1 row-span-1">
                    <div className="relative w-w-l min-h-80 border border-secondary-focus smm:w-80">
                        <canvas className="max-w-full" ref={canvasRef}></canvas>
                        {isLoading ? (
                            <div className="absolute left-0 top-0 right-0 bottom-0 flex items-center justify-center bg-slate-700/50">
                                <div>
                                    <AiOutlineLoading3Quarters
                                        size={56}
                                        color="#bf95f9"
                                        className="animate-spin mr-3"
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <progress
                        className="progress progress-secondary w-full"
                        value={progress}
                        max="100"
                    ></progress>
                </div>
                <div className="col-start-2 sm:col-start-1">
                    <div>
                        <input
                            className="file-input file-input-bordered file-input-secondary file-input-xs w-full max-w-xs"
                            type="file"
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <div className="flex gap-x-3">
                            <label
                                className="flex gap-x-1 items-center  text-secondary"
                                htmlFor="default-settings"
                            >
                                Default
                                <input
                                    className="radio radio-secondary radio-xs"
                                    type="radio"
                                    name="image-settings"
                                    id="default-settings"
                                    value="default-settings"
                                    checked={isDefaultSettings}
                                    onChange={() => setIsDefaultSettings(true)}
                                />
                            </label>
                            <label
                                className="flex gap-x-1 items-center  text-secondary"
                                htmlFor="advanced-settings"
                            >
                                Advanced
                                <input
                                    className="radio radio-secondary radio-xs"
                                    type="radio"
                                    name="image-settings"
                                    id="advanced-settings"
                                    value="advanced-settings"
                                    checked={!isDefaultSettings}
                                    onChange={() => setIsDefaultSettings(false)}
                                />
                            </label>
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
                                Save Image
                            </button>
                        </div>
                        {isDefaultSettings ? null : (
                            <>
                                <h3 className="font-bold text-2xl text-secondary">Tools</h3>
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
                                        <GAUSinputs
                                            GAUS={GAUS}
                                            handleGAUSchange={handleGAUSchange}
                                        />
                                    ) : null}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="relative col-start-1 row-start-2 h-max">
                    <textarea
                        ref={textAreaRef}
                        className="textarea relative w-w-l h-80 border border-secondary-focus smm:w-80"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <div
                        className="tooltip tooltip-top absolute right-2 top-2"
                        data-tip="Copy text"
                    >
                        <button
                            className=" btn btn-ghost btn-xs rounded-sm"
                            onClick={() => {
                                navigator.clipboard.writeText(text);
                            }}
                        >
                            <PiCopySimple color="aqua" />
                        </button>
                    </div>
                    {isTextLoading ? (
                        <div className="loading loading-ring text-secondary absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-28"></div>
                    ) : null}
                </div>
            </div>
            <Footer />
        </div>
    );
}
