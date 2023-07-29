import { BsTelegram, BsGithub, BsGlobeAsiaAustralia } from "react-icons/bs";
import Telegram from "../svg/Telegram";
import Globe from "../svg/Globe";
import Github from "../svg/Github";

export default function Footer() {
    return (
        <footer className="w-full flex items-center justify-between p-4 bg-neutral text-neutral-content">
            <div>
                <p>OCR</p>
            </div>
            <ul className="flex gap-x-5">
                <li>
                    <a href="https://simple-mmg.netlify.app/" target="_blank">
                        <BsGlobeAsiaAustralia size={24} />
                        {/* <Globe /> */}
                    </a>
                </li>
                <li>
                    <a href="https://github.com/Simple7575/ocr-client" target="_blank">
                        <BsGithub size={24} />
                        {/* <Github /> */}
                    </a>
                </li>
                <li>
                    <a href="https://telegram.me/SimpleGM" target="_blank">
                        <BsTelegram size={24} />
                        {/* <Telegram /> */}
                    </a>
                </li>
            </ul>
        </footer>
    );
}
