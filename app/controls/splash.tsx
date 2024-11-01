'use client'

// --------------------
// UI Component Imports
// --------------------

import { Skeleton } from 'ui/skeleton'

// ---------------------
// Component Definitions
// ---------------------

export function Splash() {
    return (
        <div id='splash' className='emsplash fixed inset-0 flex items-center justify-center bg-background'>
            <div className='flex flex-col space-y-3'>
                <Skeleton className='h-[125px] w-[250px] rounded-xl' />
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-[250px]' />
                    <Skeleton className='h-4 w-[200px]' />
                </div>
            </div>
        </div>
    );
}

export function PageSplash() {
    return (
        <div className='emsplash flex bg-background h-full w-full'>
            <div className='flex flex-col space-y-3'>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-[300px]' />
                    <Skeleton className='h-4 w-[250px]' />
                    <Skeleton className='h-4 w-[200px]' />
                </div>
            </div>
        </div>
    );
}