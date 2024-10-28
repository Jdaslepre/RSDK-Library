'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import * as Icons from 'lucide-react';

import * as Dialog from '@/components/ui/dialog';
import * as Drawer from '@/components/ui/drawer';
import * as Sidebar from '@/components/ui/sidebar';

// -------------------------
// Home UI Component Imports
// -------------------------

import { SettingsContent } from '@/app/controls/settings-content';

// ------------
// Misc Imports
// ------------

import { useMediaQuery } from '@custom-react-hooks/use-media-query';

// ---------------------
// Component Definitions
// ---------------------

export function SettingsDialog() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')

    const Header = () => (
        <div className='flex items-center justify-center space-x-2'>
            <Icons.Settings2 className='h-5 w-5' />
            <span>Settings</span>
        </div>
    );

    const Content = () => <SettingsContent />;

    return (
        <>
            {isDesktop ? (
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
    );
}