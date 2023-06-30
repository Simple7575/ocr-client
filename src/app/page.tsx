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
    const [text, setText] = useState("");
    const [progress, setProgress] = useState("0");

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

    useEffect(() => {
        if (!isCVready) return;

        let animationID: number | undefined;
        let srcImg: cv.Mat | never;
        let bluredImg: cv.Mat | never;
        let medianBluredImg: cv.Mat | never;
        let bilateralImg: cv.Mat | undefined;
        let adaptiveTImg: cv.Mat | undefined;
        let sTRImg: cv.Mat | undefined;
        let greyedImg: cv.Mat | undefined;

        srcImg = cv.imread(imgRef.current!);

        const processing = new ProcessImg(srcImg);

        const animate = () => {
            greyedImg = processing.greyedImg(srcImg);
            if (isResised) {
                const [rw, rh] = CalculateAspRatio(3000, srcImg.cols, srcImg.rows);
                let dsize = new cv.Size(rw, rh);
                cv.resize(srcImg, srcImg, new cv.Size(0, 0), 2, 2, cv.INTER_CUBIC);
            }
            if (isThresholded) {
                if (TRtype === "ATR") {
                    if (isBilateralFon) {
                        if (greyedImg) bilateralImg = processing.bilateralImg(greyedImg, BLF);
                        if (bilateralImg) adaptiveTImg = processing.adaptiveTImg(bilateralImg, ATR);
                        if (adaptiveTImg) cv.imshow(canvasRef.current!, adaptiveTImg);
                    } else {
                        if (greyedImg) adaptiveTImg = processing.adaptiveTImg(greyedImg, ATR);
                        if (adaptiveTImg) cv.imshow(canvasRef.current!, adaptiveTImg);
                    }
                } else {
                    if (isBilateralFon) {
                        if (greyedImg) bilateralImg = processing.bilateralImg(greyedImg, BLF);
                        if (bilateralImg) sTRImg = processing.simpleThreshold(bilateralImg, STR);
                        if (sTRImg) cv.imshow(canvasRef.current!, sTRImg);
                    } else {
                        if (greyedImg) sTRImg = processing.simpleThreshold(srcImg, STR);
                        if (sTRImg) cv.imshow(canvasRef.current!, sTRImg);
                    }
                }
            } else {
                if (isBilateralFon) {
                    if (greyedImg) bilateralImg = processing.bilateralImg(greyedImg, BLF);
                    if (bilateralImg) cv.imshow(canvasRef.current!, bilateralImg);
                } else {
                    cv.imshow(canvasRef.current!, srcImg);
                }
            }
        };

        animate();

        return () => {
            // gui.destroy();
            // imgElement.remove();
            if (animationID) cancelAnimationFrame(animationID);
            if (srcImg) srcImg.delete();
            if (greyedImg) greyedImg.delete();
            if (adaptiveTImg) adaptiveTImg.delete();
            if (bluredImg) bluredImg.delete;
            if (medianBluredImg) medianBluredImg.delete();
            if (bilateralImg) bilateralImg.delete();
            if (sTRImg) sTRImg.delete();
        };
    }, [isCVready, ATR, STR, BLF, isBilateralFon, isThresholded, isResised, TRtype]);

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
                    <p>Progress {progress} %</p>
                    <p className="text-sm w-96">{text}</p>
                </div>
                <div>
                    <div>
                        {/* prettier-ignore */}
                        <img className="max-w-2xl" id="imgSrc" src="./example.jpg" alt="srcimg" ref={imgRef} hidden/>
                        <input
                            className="file-input file-input-bordered file-input-secondary file-input-sm w-full max-w-xs"
                            type="file"
                            onChange={handleInput}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-2xl text-secondary">Controls</h3>
                        <Checkboxes
                            isBilateralFon={isBilateralFon}
                            setIsBilateralFon={setIsBilateralFon}
                            isThresholded={isThresholded}
                            setThresholded={setThresholded}
                            isResised={isResised}
                            setIsResized={setIsResized}
                            TRtype={TRtype}
                            setTRtype={setTRtype}
                        />
                        {isBilateralFon ? (
                            <BLFinputs BLF={BLF} handleBLFchange={handleBLFchange} />
                        ) : null}
                        {TRtype === "ATR" ? (
                            <ATRinputs ATR={ATR} handleATRchange={handleATRchange} />
                        ) : (
                            <STRinputs STR={STR} handleSTRchange={handleSTRchange} />
                        )}
                        <button
                            className="btn btn-secondary mt-1"
                            type="button"
                            onClick={handleOCR}
                        >
                            Process OCR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
