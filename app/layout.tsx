import './globals.css'

import * as React from 'react'
import * as Next from 'next'

// --------------------
// UI Component Imports
// --------------------

import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from '@/app/controls/theme-provider'
import { Splash } from '@/app/controls/splash'

// ------------
// Misc Imports
// ------------

import Script from 'next/script'

// ---------------------
// Component Definitions
// ---------------------

export const metadata: Next.Metadata = {
    title: 'RSDK-Library',
    description: 'RSDK-Library website',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <link rel='manifest' href='./manifest.webmanifest' />
            </head>
            <body className={`min-h-screen bg-background ${GeistSans.className}`}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                    <Splash />
                    <div vaul-drawer-wrapper="">
                        <div className="relative flex min-h-screen flex-col bg-background">
                            {children}
                        </div>
                    </div>
                </ThemeProvider>
                <Script src='./lib/ModuleInit.js' />
                <Script src='./modules/Files.js' />
            </body>
        </html>
    )
}