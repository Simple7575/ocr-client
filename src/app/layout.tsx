import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "OCR",
    description: "Image to TXT",
    viewport: { width: "device-width", initialScale: 1 },
    // <meta name="viewport" content="width=device-width, initial-scale=1.0">
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
