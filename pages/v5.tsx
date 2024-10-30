'use client'

import * as React from 'react'

import '@/app/globals.css'
import '@/app/engine.css'

// --------------------
// UI Component Imports
// --------------------

import Head from 'next/head'
import Script from 'next/script'

import { Skeleton } from "@/components/ui/skeleton"
import { ThemeProvider } from '@/app/controls/theme-provider'

// ---------------
// Library Imports
// ---------------

import EngineFS from '@/lib/EngineFS'

// ---------------------
// Component Definitions
// ---------------------

export default function V5() {
    // this is stupid.
    React.useEffect(() => {
        window.TS_InitFS = async (p: string, f: any) => {
            try {
                await EngineFS.Init(p);
                f();
            } catch (error) {
            }
        };
    }, []);

    return (
        <>
            <Head>
                <meta name='viewport' content='initial-scale=1, viewport-fit=cover' />
            </Head>
            <div className='enginePage'>
                <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
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
                <Script src='coi-serviceworker.js' />
                <Script src='./lib/RSDKv5.js' />
                <Script src='./modules/RSDKv5.js' />
            </div>
        </>
    )
}