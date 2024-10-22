import type { Metadata } from "next";
import "./globals.css";

import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
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
            <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <div className="w-full h-full">
                        {children}
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}