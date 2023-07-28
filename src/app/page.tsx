import Ocr from "./(components)/OCR/Ocr";

export default function Home() {
    return (
        <>
            <div
                className="absolute top-0 right-0 bottom-0 left-0 bg-slate-500 z-50 flex justify-center"
                id="global-loading"
            >
                <h3 className="text-neutral-content text-3xl font-bold mt-10">
                    Loading Please wait.
                </h3>
                <div className="loading loading-ring text-neutral-content absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-28"></div>
            </div>
            <Ocr />
        </>
    );
}
