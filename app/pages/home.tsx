'use client'

import * as React from 'react'

// --------------------
// UI Component Imports
// --------------------

import * as Path from '@/app/controls/path-context'
import LaunchEngineGroup from '@/app/controls/launch-engine-group'

// ---------------
// Home Components
// ---------------

const HomePage: React.FC = () => {
    const { setCurrentPath } = Path.useCurrentPath();

    return (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
            <LaunchEngineGroup title='RSDKv2' icon='./assets/RSDKGeneric.png'
                launchClicked={() => {
                    const siteUrl = window.location.origin + window.location.pathname
                    window.location.href = `${siteUrl}v2`
                }}
                filesClicked={() => setCurrentPath('rsdkv2')}
            />

            <LaunchEngineGroup title='RSDKv3' icon='./assets/RSDKv3.png'
                launchClicked={() => {
                    const siteUrl = window.location.origin + window.location.pathname
                    window.location.href = `${siteUrl}v3`
                }}
                filesClicked={() => setCurrentPath('rsdkv3')}
            />

            <LaunchEngineGroup title='RSDKv4' icon='./assets/RSDKv4.png'
                launchClicked={() => {
                    const siteUrl = window.location.origin + window.location.pathname
                    window.location.href = `${siteUrl}v4`
                }}
                filesClicked={() => setCurrentPath('rsdkv4')}
            />

            <LaunchEngineGroup title='RSDKv5' icon='./assets/RSDKv5.png'
                launchClicked={() => {
                    const siteUrl = window.location.origin + window.location.pathname
                    window.location.href = `${siteUrl}v5`
                }}
                filesClicked={() => setCurrentPath('rsdkv5')}
            />

            <LaunchEngineGroup title='RSDKv5U' icon='./assets/RSDKv5U.png'
                launchClicked={() => {
                    const siteUrl = window.location.origin + window.location.pathname
                    window.location.href = `${siteUrl}v5U`
                }}
                filesClicked={() => setCurrentPath('rsdkv5u')}
            />
        </div>
    )
}

export default HomePage