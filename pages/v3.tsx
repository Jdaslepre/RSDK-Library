'use client'

import * as React from 'react'

import '@/app/globals.css'
import '@/app/engine.css'

// --------------------
// UI Component Imports
// --------------------

import Head from 'next/head'
import Script from 'next/script'

import { ThemeProvider } from '@/app/controls/theme-provider'
import { Splash } from '@/app/controls/splash'

// ---------------
// Library Imports
// ---------------

import EngineFS from '@/lib/EngineFS'

// ---------------------
// Component Definitions
// ---------------------

export default function V3() {
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
                    <Splash/>
                    <canvas className='engineCanvas' id='canvas' />
                </ThemeProvider>
                <Script src='./lib/RSDKv3.js' />
                <Script src='./modules/RSDKv3.js' />
            </div>
        </>
    )
}