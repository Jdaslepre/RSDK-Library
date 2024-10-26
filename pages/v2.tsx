'use-client'

import '@/app/globals.css';
import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import Script from 'next/script'

import { Skeleton } from "@/components/ui/skeleton"
import { ThemeProvider } from '@/app/controls/theme-provider'

// ---------------------
// Component Definitions
// ---------------------

// Content of host/v2
export default function v2() {
    return (
        <html lang='en' className='enginePage' suppressHydrationWarning>
            <body className='enginePage'>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                    <div id='splash' className='engineSplash relative flex min-h-screen flex-col bg-background items-center justify-center'>
                        <div className="flex flex-col space-y-3">
                            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    </div>
                    <canvas className='engineCanvas' id='canvas' />
                </ThemeProvider>
                <Script src='./lib/Emscripten.js' />
                <Script src='./lib/RSDKv2.js' />
                <Script src='./modules/RSDKv2.js' />
            </body>
        </html>
    )
}