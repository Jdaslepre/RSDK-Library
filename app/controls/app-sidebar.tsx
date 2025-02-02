'use client'

import * as React from 'react'

// --------------------
// UI Component Imports
// --------------------

import * as untitled from '@untitled-ui/icons-react';

import * as Collapsible from 'ui/collapsible'
import { Button } from 'ui/button'
import * as Dropdown from 'ui/dropdown-menu'
import * as Sidebar from '@/components/mod/sidebar'

import { ThemeProvider } from '@/app/controls/theme-provider'

// -------------------------
// Home UI Component Imports
// -------------------------

import { SettingsDialog } from '@/app/controls/settings-dialog'

// ------------
// Misc Imports
// ------------

import { useIsMobile } from 'hooks/use-mobile'

// ---------------------
// Component Definitions
// ---------------------

export const EngineList = [
    { title: 'RSDKv2', url: 'rsdkv2', icon: './assets/RSDKGeneric.png' },
    { title: 'RSDKv3', url: 'rsdkv3', icon: './assets/RSDKv3.png' },
    { title: 'RSDKv4', url: 'rsdkv4', icon: './assets/RSDKv4.png' },
    { title: 'RSDKv5', url: 'rsdkv5', icon: './assets/RSDKv5.png' },
    { title: 'RSDKv5U', url: 'rsdkv5u', icon: './assets/RSDKv5U.png' }
]

const EnginesCollapsible: React.FC<Props> = ({ onNavigate }) => (
    <Collapsible.Collapsible defaultOpen className='group/collapsible'>
        <Sidebar.SidebarGroup>
            <Sidebar.SidebarGroupLabel asChild>
                <Collapsible.CollapsibleTrigger className='gap-2'>
                    <span className='truncate font-semibold'>Engine Files</span>
                    <untitled.ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                </Collapsible.CollapsibleTrigger>
            </Sidebar.SidebarGroupLabel>
            <Collapsible.CollapsibleContent>
                <Sidebar.SidebarGroupContent>
                    {EngineList.map((item) => (
                        <Sidebar.SidebarMenuItem key={item.title}>
                            <Sidebar.SidebarMenuButton asChild>
                                <a onClick={() => onNavigate(item.url)}>
                                    <img src={item.icon} alt='engine logo' width={16} height={16} />
                                    <span>{item.title}</span>
                                </a>
                            </Sidebar.SidebarMenuButton>
                        </Sidebar.SidebarMenuItem>
                    ))}
                </Sidebar.SidebarGroupContent>
            </Collapsible.CollapsibleContent>
        </Sidebar.SidebarGroup>
    </Collapsible.Collapsible>
)

interface Props {
    onNavigate: (path: string) => void
}

export function AppSidebar({ onNavigate, ...props }: Props) {
    const isMobile = useIsMobile();
    const { toggleSidebar } = Sidebar.useSidebar();

    return isMobile ? (
        <></>
    ) : (
        <ThemeProvider attribute='class' forcedTheme='dark'>
            <Sidebar.Sidebar {...props}>
                <Sidebar.SidebarHeader className='PWA-Title-Draggable w-full h-12 pl-4 shrink-0 border-b'>
                    <div className="w-full h-full flex items-center gap-2">
                        <div onClick={toggleSidebar} className='PWA-Title-NonDraggable flex items-center justify-center aspect-square size-6'>
                            <img src="./assets/Retro.png" alt="header logo" className='PWA-Title-NonDraggable h-full w-full object-contain' />
                        </div>
                        <span className="truncate font-semibold">RSDK Library</span>
                        <Button className='PWA-Title-NonDraggable w-9 h-9 ml-auto flex items-center justify-center' variant='ghost' onClick={() => window.open('https://github.com/Jdsle/RSDK', '_blank')}>
                            <untitled.Codepen />
                        </Button>
                    </div>
                </Sidebar.SidebarHeader>
                <Sidebar.SidebarContent>
                    <Sidebar.SidebarMenu>
                        {/* Home Item */}
                        <Sidebar.SidebarGroup>
                            <Sidebar.SidebarMenuButton onClick={() => onNavigate('home')} asChild>
                                <a href='#'>
                                    <untitled.Home02 />
                                    <span>Home</span>
                                </a>
                            </Sidebar.SidebarMenuButton>
                            <SettingsDialog />
                        </Sidebar.SidebarGroup>

                        {/* RSDK Engines */}
                        <EnginesCollapsible onNavigate={onNavigate} />
                    </Sidebar.SidebarMenu>
                </Sidebar.SidebarContent>
            </Sidebar.Sidebar>
        </ThemeProvider>
    )
}
