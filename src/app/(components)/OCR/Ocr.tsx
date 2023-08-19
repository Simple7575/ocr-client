"use client";
import { ChangeEvent, useEffect, useRef, useState, useTransition, type MouseEvent } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiCopySimple } from "react-icons/pi";
import { io } from "socket.io-client";
import axios from "axios";
import cv from "@techstark/opencv-js";
// components
import Canvas from "../canvas/Canvas";
import ATRinputs from "../cv/ATRinputs";
import STRinputs from "../cv/STRinputs";
import BLFinputs from "../cv/BLFinputs";
import GAUSinputs from "../cv/GausInputs";
import Medianinputs from "../cv/MedianInputs";
import Checkboxes from "../cv/Checkboxes";
import Footer from "../footer/Footer";
// types
import { useTypedSelector } from "@/hooks/useTypedRedux";
import { useRedraw } from "@/hooks/useRedraw";

export default function Ocr() {
    const [text, setText] = useState("");
    const [progress, setProgress] = useState(0);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    // refs
    const srcImgRef = useRef<cv.Mat | undefined>(undefined);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    // bools
    const [isDefaultSettings, setIsDefaultSettings] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isTextLoading, setIsTextLoading] = useState(false);
    // bools
    const { isBLF, isATR, isSTR, isGaus, isMedian } = useTypedSelector((state) => state.CHKBX);

    const debouncedRedraw = useRedraw({ srcImgRef, canvasRef, setIsLoading });

    useEffect(() => {
        const globalLoading = document.getElementById("global-loading");
        if (!globalLoading) return;
        globalLoading.style.display = "none";
    }, []);

    const handleOCR = async (e: MouseEvent<HTMLButtonElement>) => {
        try {
            setIsTextLoading(true);

            const url = process.env.NEXT_PUBLIC_SERVER_BASE;
            const socket = io(`${url}`, { path: "/io" });

            socket.connect();

            socket.on("loading", (progress) => {
                setProgress(Math.round(progress.progress * 100));
            });

            const res = await axios.post(`${url}/ocr`, {
                image: canvasRef.current?.toDataURL()!,
            });

            setText(res.data.text);
            setIsTextLoading(false);
            textAreaRef.current?.focus();
            socket.disconnect();
        } catch (error) {
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
            <div className="grid gap-x-2 gap-y-2 mdd:flex smm:flex flex-col border-l-2 border-l-neutral border-r-2 border-r-neutral py-2 px-2">
                <div className="col-start-1 row-span-1">
                    <div className="relative min-h-80 border border-secondary-focus -mdd:w-w-l -smm:w-w-m smm:w-80">
                        <Canvas
                            canvasRef={canvasRef}
                            srcImgRef={srcImgRef}
                            img={img}
                            setIsLoading={setIsLoading}
                        />
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
                            accept="image/png, image/jpg"
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
                                <Checkboxes setIsLoading={setIsLoading} />
                                <div className="h-80 overflow-y-scroll">
                                    {isBLF ? (
                                        <BLFinputs
                                            debouncedRedraw={debouncedRedraw}
                                            setIsLoading={setIsLoading}
                                        />
                                    ) : null}
                                    {isATR ? (
                                        <ATRinputs
                                            debouncedRedraw={debouncedRedraw}
                                            setIsLoading={setIsLoading}
                                        />
                                    ) : null}
                                    {isSTR ? (
                                        <STRinputs
                                            debouncedRedraw={debouncedRedraw}
                                            setIsLoading={setIsLoading}
                                        />
                                    ) : null}
                                    {isMedian ? (
                                        <Medianinputs
                                            debouncedRedraw={debouncedRedraw}
                                            setIsLoading={setIsLoading}
                                        />
                                    ) : null}
                                    {isGaus ? (
                                        <GAUSinputs
                                            debouncedRedraw={debouncedRedraw}
                                            setIsLoading={setIsLoading}
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
                        className="textarea relative w-w-l h-80 border border-secondary-focus -mdd:w-w-l -smm:w-w-m smm:w-80"
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
