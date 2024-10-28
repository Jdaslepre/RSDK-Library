'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import * as Icons from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// ---------------
// Home Components
// ---------------

const HomePage: React.FC = () => {
    return (
        <div className='space-y-6'>

            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                <Button variant="outline" className="flex items-center gap-4 h-16 font-bold w-full">
                    <a
                        href={`${window.location.origin}${window.location.pathname}v2`}
                        className="flex items-center gap-4 w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="./assets/RSDKGeneric.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                        <span className="flex-grow text-left">RSDKv2</span>
                    </a>
                </Button>

                <Button variant="outline" className="flex items-center gap-4 h-16 font-bold w-full">
                    <a
                        href={`${window.location.origin}${window.location.pathname}v3`}
                        className="flex items-center gap-4 w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="./assets/RSDKv3.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                        <span className="flex-grow text-left">RSDKv3</span>
                    </a>
                </Button>

                <Button variant="outline" className="flex items-center gap-4 h-16 font-bold w-full">
                    <a
                        href={`${window.location.origin}${window.location.pathname}v4`}
                        className="flex items-center gap-4 w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="./assets/RSDKv4.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                        <span className="flex-grow text-left">RSDKv4</span>
                    </a>
                </Button>

                <Button variant="outline" className="flex items-center gap-4 h-16 font-bold w-full">
                    <a
                        href={`${window.location.origin}${window.location.pathname}v5`}
                        className="flex items-center gap-4 w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="./assets/RSDKv5.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                        <span className="flex-grow text-left">RSDKv5</span>
                    </a>
                </Button>

                <Button variant="outline" className="flex items-center gap-4 h-16 font-bold w-full">
                    <a
                        href={`${window.location.origin}${window.location.pathname}v5U`}
                        className="flex items-center gap-4 w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src="./assets/RSDKv5.png" alt="Engine image" className='w-[2rem] h-[2rem]' />
                        <span className="flex-grow text-left">RSDKv5U</span>
                    </a>
                </Button>
            </div>

            <Separator orientation='horizontal' />
        </div>
    )
}

export default HomePage;