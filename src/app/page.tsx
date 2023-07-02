"use client";
import Image from "next/image";
import {
    ChangeEvent,
    useEffect,
    useReducer,
    useRef,
    useState,
    useTransition,
    type MouseEvent,
} from "react";
import { GUI } from "dat.gui";

import cv from "@techstark/opencv-js";
import Tesseract, { createWorker } from "tesseract.js";
import { ProcessImg } from "@/utils/ProcessIng";
// ----
import ATRinputs, { ATRinitial, ATRreducer } from "./(components)/ATRinputs";
import STRinputs, { STRType, STRinitial, STRreducer } from "./(components)/STRinputs";
import BLFinputs, { BLFinitial, BLFreducer, BLFtype } from "./(components)/BLFinputs";

import Checkboxes from "./(components)/Checkboxes";
import { CalculateAspRatio } from "@/utils/CalculateAspRatio";
// types
import { type ATRType } from "./(components)/ATRinputs";

export default function Home() {
    const isExecuted = useRef(false);
    const [isPending, startTransition] = useTransition();
    const [isCVready, setIsCVready] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ATR, ATRdispatch] = useReducer(ATRreducer, ATRinitial);
    const [STR, STRdispatch] = useReducer(STRreducer, STRinitial);
    const [BLF, BLFdispatch] = useReducer(BLFreducer, BLFinitial);
    const [TRtype, setTRtype] = useState("STR");
    const [isBilateralFon, setIsBilateralFon] = useState(false);
    const [isThresholded, setThresholded] = useState(false);
    const [isResised, setIsResized] = useState(false);
    const [isGreyed, setIsGreyed] = useState(false);
    const [text, setText] = useState("");
    const [progress, setProgress] = useState("0");
    const [timage, settimag] = useState();

    const handleATRchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const payload = Number(e.target.value);
        const type = e.target.name.split("-")[1] as keyof ATRType;
        startTransition(() => {
            ATRdispatch({ type, payload });
        });
    };

    const handleBLFchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const payload = Number(e.target.value);
        const type = e.target.name.split("-")[1] as keyof BLFtype;
        startTransition(() => {
            BLFdispatch({ type, payload });
        });
    };

    const handleSTRchange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const payload = Number(e.target.value);
        const type = e.target.name.split("-")[1] as keyof STRType;
        startTransition(() => {
            STRdispatch({ type, payload });
        });
    };

    cv["onRuntimeInitialized"] = () => {
        setIsCVready(true);
    };

    const [median, setMedian] = useState(3);
    useEffect(() => {
        if (!isCVready) return;

        let animationID: number | undefined;
        let srcImg: cv.Mat | never;

        srcImg = cv.imread(imgRef.current!);

        const animate = () => {
            try {
                if (isResised) {
                    // const [rw, rh] = CalculateAspRatio(3000, srcImg.cols, srcImg.rows);
                    // let dsize = new cv.Size(rw, rh);
                    // cv.resize(srcImg, srcImg, new cv.Size(0, 0), 5, 5, cv.INTER_CUBIC);
                    cv.resize(srcImg, srcImg, new cv.Size(0, 0), 5, 5, cv.INTER_CUBIC);
                }
                if (isGreyed && !isBilateralFon) {
                    cv.cvtColor(srcImg, srcImg, cv.COLOR_RGBA2GRAY, 0);
                }
                if (isBilateralFon) {
                    const dst = new cv.Mat();
                    try {
                        cv.cvtColor(srcImg, dst, cv.COLOR_RGBA2GRAY, 0);
                        // prettier-ignore
                        cv.bilateralFilter(dst, srcImg, BLF.D, BLF.sigmaColor, BLF.sigmaSpace, BLF.borderType);
                    } catch (error) {
                        console.error(error);
                    } finally {
                        dst.delete();
                    }
                }
                if (isThresholded) {
                    cv.medianBlur(srcImg, srcImg, median);

                    if (TRtype === "ATR") {
                        // prettier-ignore
                        cv.adaptiveThreshold( srcImg, srcImg, ATR.maxValue, Number(ATR.adaptiveMethod), Number(ATR.thresholdType), Number(ATR.blockSize), ATR.C );
                    } else {
                        cv.threshold(srcImg, srcImg, STR.thresh, STR.maxValue, STR.thresholdType);
                    }
                }

                cv.imshow(canvasRef.current!, srcImg);
            } catch (error) {
                console.error(error);
            } finally {
                if (srcImg) srcImg.delete();
            }
        };

        animate();

        return () => {
            // gui.destroy();
            // imgElement.remove();
            if (animationID) cancelAnimationFrame(animationID);
            if (!srcImg.isDeleted) srcImg.delete();
        };
    }, [
        isCVready,
        ATR,
        STR,
        BLF,
        isBilateralFon,
        isThresholded,
        isResised,
        TRtype,
        isGreyed,
        median,
    ]);

    const handleOCR = async (e: MouseEvent<HTMLButtonElement>) => {
        console.log(canvasRef.current?.toDataURL());

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
                    <h3>Canvas</h3>
                    {/* {isPending ? "Processing..." : ""} */}
                    <canvas className="max-w-2xl" ref={canvasRef}></canvas>
                    <p>
                        Progress {progress} % {isPending ? "Loading..." : ""}
                    </p>
                    <p className="text-sm w-96">{text}</p>
                </div>
                <div>
                    <div>
                        {/* prettier-ignore */}
                        <img className="max-w-2xl" id="imgSrc" src="./example4.png" alt="srcimg" ref={imgRef} hidden/>
                        <input
                            className="file-input file-input-bordered file-input-secondary file-input-sm w-full max-w-xs"
                            type="file"
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-secondary">Controls</h3>
                        <label htmlFor="">{median}</label>
                        <input
                            type="range"
                            min="3"
                            max="15"
                            value={median}
                            onChange={(e) => {
                                setMedian((pre) => {
                                    if (Number(e.target.value) % 2 !== 0)
                                        return Number(e.target.value);
                                    else return pre;
                                });
                            }}
                        />
                        <Checkboxes
                            isBilateralFon={isBilateralFon}
                            setIsBilateralFon={setIsBilateralFon}
                            isThresholded={isThresholded}
                            setThresholded={setThresholded}
                            isResised={isResised}
                            setIsResized={setIsResized}
                            TRtype={TRtype}
                            setTRtype={setTRtype}
                            isGreyed={isGreyed}
                            setIsGreyed={setIsGreyed}
                        />
                        {isBilateralFon ? (
                            <BLFinputs BLF={BLF} handleBLFchange={handleBLFchange} />
                        ) : null}
                        {TRtype === "ATR" ? (
                            <ATRinputs ATR={ATR} handleATRchange={handleATRchange} />
                        ) : (
                            <STRinputs STR={STR} handleSTRchange={handleSTRchange} />
                        )}
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
