import './globals.css';

import type { Metadata } from 'next';
import Script from 'next/script'

import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
    title: 'RSDK-Library',
    description: 'RSDK-Library website',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <head>
                <link rel='manifest' href='./manifest.webmanifest' />
            </head>
            <body className={GeistSans.className}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                    <div vaul-drawer-wrapper=''>
                        <div className='relative flex min-h-screen flex-col bg-background'>
                            {children}
                        </div>
                    </div>
                </ThemeProvider>
                <Script src='./modules/ModuleInit.js'/>
                <Script src='./modules/Files.js'/>
            </body>
        </html>
    )
}