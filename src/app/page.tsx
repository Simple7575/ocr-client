"use client";
import Image from "next/image";

import * as dat from "dat.gui";
import cv from "@techstark/opencv-js";
import { ProcessImg } from "@/utils/ProcessImg";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface DrawOptions {
    blured: boolean;
    greyed: boolean;
    medianBlured: boolean;
    bilateral: boolean;
    adaptive: boolean;
}

export default function Home() {
    const isExecuted = useRef(false);
    const [isCVready, setIsCVready] = useState(false);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    cv["onRuntimeInitialized"] = () => {
        setIsCVready(true);
    };

    useEffect(() => {
        if (!isCVready) return;
        // if (isExecuted.current) return;
        // isExecuted.current = true;

        const ATR = {
            maxValue: 200,
            adaptiveMethod: cv.ADAPTIVE_THRESH_GAUSSIAN_C,
            thresholdType: cv.THRESH_BINARY,
            blockSize: 5,
            C: 1,
        };

        const BL = {
            D: 9,
            sigmaColor: 75,
            sigmaSpace: 75,
        };

        const imgElement = document.createElement("img");
        imgElement.setAttribute("src", "./example.jpg");

        let animationID: number | undefined;
        let srcImg: cv.Mat | never;
        let bluredImg: cv.Mat | never;
        let medianBluredImg: cv.Mat | never;
        let bilateralImg: cv.Mat | never;
        let adaptiveTImg: cv.Mat | undefined;
        let imgGrey: cv.Mat | never;

        imgElement.onload = (e) => {
            srcImg = cv.imread(imgElement);
            const processing = new ProcessImg(srcImg);

            const animate = () => {
                adaptiveTImg = processing.adaptiveTImg(srcImg, ATR);
                if (adaptiveTImg) cv.imshow(canvasRef.current!, adaptiveTImg);

                // animationID = requestAnimationFrame(animate);
            };
            animate();
        };

        const draw = ({ blured, greyed, medianBlured, bilateral, adaptive }: DrawOptions) => {};

        const gui = new dat.GUI();
        const ATRFolder = gui.addFolder("Adaptive Threshold");
        ATRFolder.add(ATR, "maxValue", 0, 255, 1).name("MaxV");
        ATRFolder.add(ATR, "blockSize", 0, 100, 1).name("Block size");
        ATRFolder.add(ATR, "C", 0, 100, 1).name("C");
        ATRFolder.add(ATR, "thresholdType", {
            Bianary: cv.THRESH_BINARY,
            Inv: cv.THRESH_BINARY_INV,
            Mask: cv.THRESH_MASK,
            Otsu: cv.THRESH_OTSU,
            Tozero: cv.THRESH_TOZERO,
            TozeroInv: cv.THRESH_TOZERO_INV,
            Triangle: cv.THRESH_TRIANGLE,
            Trunc: cv.THRESH_TRUNC,
        }).name("T Type");

        gui.add(BL, "D", 1, 10, 1).name("D");
        gui.add(BL, "sigmaColor", 0, 100, 1).name("SigmaColor");
        gui.add(BL, "sigmaSpace", 0, 100, 1).name("SigmaSpace");

        return () => {
            gui.destroy();
            imgElement.remove();
            if (animationID) cancelAnimationFrame(animationID);
            if (srcImg) srcImg.delete();
            if (imgGrey) imgGrey.delete();
            if (adaptiveTImg) adaptiveTImg.delete();
            if (bluredImg) bluredImg.delete;
            if (medianBluredImg) medianBluredImg.delete();
            if (bilateralImg) bilateralImg.delete();
        };
    }, [isCVready]);

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
            <div className="flex flex-col">
                <div>
                    <img className="max-w-2xl" id="imgSrc" src="" alt="srcimg" ref={imgRef} />
                    <input type="file" onChange={handleInput} />
                </div>
                <div>
                    <h3>Canvas</h3>
                    <canvas className="max-w-2xl" id="canvasOutput" ref={canvasRef}></canvas>
                </div>
            </div>
        </div>
    );
}
