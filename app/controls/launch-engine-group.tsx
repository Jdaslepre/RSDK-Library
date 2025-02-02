import * as React from 'react'
import * as untitled from '@untitled-ui/icons-react';

// --------------------
// UI Component Imports
// --------------------

import { Button } from 'ui/button';

// ---------------------
// Component Definitions
// ---------------------

interface Props {
    icon?: string;
    title?: string;
    launchClicked?: () => void;
    filesClicked?: () => void;
    disabled?: boolean;
}

const LaunchEngineGroup: React.FC<Props> = ({ icon, title, launchClicked, filesClicked, disabled = false }) => {
    return (
        <div className='flex gap-2'>
            <Button
                variant='outline'
                className='flex items-center p-6 space-x-2 h-16 font-bold w-full'
                onClick={launchClicked}
                disabled={disabled}
            >
                <img src={icon} alt='Engine image' className='w-[2rem] h-[2rem]' />
                <span className='flex-grow text-left'>{title}</span>
            </Button>

            <Button
                variant='outline'
                className='w-20 h-16'
                onClick={filesClicked}
                disabled={disabled}
            >
                <untitled.FolderCode />
            </Button>
        </div>
    );
};

export default LaunchEngineGroup;