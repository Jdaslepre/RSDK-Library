import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
    title: "RSDK-Library",
    description: "RSDK-Library website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="manifest" href="./manifest.webmanifest" />
            </head>
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}