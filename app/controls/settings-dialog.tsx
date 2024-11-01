'use client'

import * as React from 'react'

// --------------------
// UI Component Imports
// --------------------

import * as Icons from 'lucide-react'

import * as Dialog from 'ui/dialog'
import * as Drawer from 'ui/drawer'
import * as Sidebar from 'ui/sidebar'

// -------------------------
// Home UI Component Imports
// -------------------------

import { SettingsContent } from '@/app/controls/settings-content'

// ------------
// Misc Imports
// ------------

import { useIsMobile } from 'hooks/use-mobile'

// ---------------------
// Component Definitions
// ---------------------

export function SettingsDialog() {
    const [open, setOpen] = React.useState(false)
    const isMobile = useIsMobile()

    const Header = () => (
        <div className='flex items-center justify-center space-x-2'>
            <Icons.Settings2 className='h-5 w-5' />
            <span>Settings</span>
        </div>
    )

    const Content = () => <SettingsContent />

    return (
        <>
            {!isMobile ? (
                <Dialog.Dialog open={open} onOpenChange={setOpen}>
                    <Dialog.DialogTrigger asChild>
                        <Sidebar.SidebarMenuButton asChild>
                            <a href='#'>
                                <Icons.Settings2 />
                                <span>Settings</span>
                            </a>
                        </Sidebar.SidebarMenuButton>
                    </Dialog.DialogTrigger>

                    <Dialog.DialogContent className='sm:max-w-[425px]'>
                        <Dialog.DialogTitle>
                            <Header />
                        </Dialog.DialogTitle>
                        <Content />
                    </Dialog.DialogContent>
                </Dialog.Dialog>
            ) : (
                <Drawer.Drawer open={open} onOpenChange={setOpen}>
                    <Drawer.DrawerTrigger asChild>
                        <Sidebar.SidebarMenuButton asChild>
                            <a href='#'>
                                <Icons.Settings2 />
                                <span>Settings</span>
                            </a>
                        </Sidebar.SidebarMenuButton>
                    </Drawer.DrawerTrigger>

                    <Drawer.DrawerContent>
                        <Drawer.DrawerHeader className='text-left'>
                            <Header />
                        </Drawer.DrawerHeader>
                        <Drawer.DrawerFooter className='pt-2'>
                            <Content />
                        </Drawer.DrawerFooter>
                    </Drawer.DrawerContent>
                </Drawer.Drawer>
            )}
        </>
    )
}