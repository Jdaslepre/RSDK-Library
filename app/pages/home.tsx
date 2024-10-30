'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import { Button } from "@/components/ui/button"

// ---------------
// Home Components
// ---------------

const HomePage: React.FC = () => {
    return (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            <Button variant="outline" className="flex items-center p-6 space-x-2 h-20 font-bold w-full" onClick={() => {
                const siteUrl = window.location.origin + window.location.pathname;
                window.open(`${siteUrl}v2`, '_blank');
            }}>
                <img src="./assets/RSDKGeneric.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                <span className="flex-grow text-left">RSDKv2</span>
            </Button>

            <Button variant="outline" className="flex items-center p-6 space-x-2 h-20 font-bold w-full" onClick={() => {
                const siteUrl = window.location.origin + window.location.pathname;
                window.open(`${siteUrl}v3`, '_blank');
            }}>
                <img src="./assets/RSDKv3.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                <span className="flex-grow text-left">RSDKv3</span>
            </Button>

            <Button variant="outline" className="flex items-center p-6 space-x-2 h-20 font-bold w-full" onClick={() => {
                const siteUrl = window.location.origin + window.location.pathname;
                window.open(`${siteUrl}v4`, '_blank');
            }}>
                <img src="./assets/RSDKv4.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                <span className="flex-grow text-left">RSDKv4</span>
            </Button>

            <Button variant="outline" className="flex items-center p-6 space-x-2 h-20 font-bold w-full" onClick={() => {
                const siteUrl = window.location.origin + window.location.pathname;
                window.open(`${siteUrl}v5`, '_blank');
            }}>
                <img src="./assets/RSDKv5.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                <span className="flex-grow text-left">RSDKv5</span>
            </Button>

            <Button variant="outline" className="flex items-center p-6 space-x-2 h-20 font-bold w-full" onClick={() => {
                const siteUrl = window.location.origin + window.location.pathname;
                window.open(`${siteUrl}/v5U`, '_blank');
            }}>
                <img src="./assets/RSDKv5U.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                <span className="flex-grow text-left">RSDKv5U</span>
            </Button>
        </div>
    )
}

export default HomePage;