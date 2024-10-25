'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import * as Icons from 'lucide-react';

import * as Collapsible from '@/components/ui/collapsible';
import * as Dropdown from '@/components/ui/dropdown-menu';
import * as Sidebar from '@/components/ui/sidebar';

// -------------------------
// Home UI Component Imports
// -------------------------

import { SettingsDialog } from '@/app/controls/settings-dialog';

// ---------------------
// Component Definitions
// ---------------------

const EngineList = [
    { title: 'RSDKv2', url: '#', icon: './assets/RSDKGeneric.png' },
    { title: 'RSDKv3', url: '#', icon: './assets/RSDKv3.png' },
    { title: 'RSDKv4', url: '#', icon: './assets/RSDKv4.png' },
    { title: 'RSDKv5', url: '#', icon: './assets/RSDKv5.png' },
    { title: 'RSDKv5U', url: '#', icon: './assets/RSDKv5U.png' }
];

const Resources = [
    { name: 'Website Source Code', url: 'https://github.com/Jdsle/RSDK', icon: Icons.Code2 },
    { name: 'Engine Source Code', url: 'https://github.com/Jdsle/RSDK-Library-src', icon: Icons.Code2 },
    { name: 'RSDK-Modding Github', url: 'https://github.com/RSDKModding', icon: Icons.Globe },
    { name: 'RSDK-Modding Website', url: 'https://rsdkmodding.com', icon: Icons.Globe }
];

interface Props {
    onNavigate: (path: string) => void;
}

const DropdownHeader = () => (
    <Dropdown.DropdownMenu>
        <Dropdown.DropdownMenuTrigger asChild>
            <Sidebar.SidebarMenuButton className='w-fit px-1.5'>
                <div className='flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground'>
                    <img src={`./assets/RSDK.png`} alt='header logo' />
                </div>
                <span className='truncate font-semibold'>RSDK Library</span>
                <Icons.ChevronDown className='opacity-50' />
            </Sidebar.SidebarMenuButton>
        </Dropdown.DropdownMenuTrigger>
        <Dropdown.DropdownMenuContent
            className='w-64 rounded-lg'
            align='start'
            side='bottom'
            sideOffset={4}
        >
            <Dropdown.DropdownMenuLabel className='text-xs text-muted-foreground'>
                Resources
            </Dropdown.DropdownMenuLabel>
            {Resources.map((item, index) => (
                <Dropdown.DropdownMenuItem
                    key={item.name}
                    onClick={() => window.open(item.url, '_blank')}
                    className='gap-2 p-2'
                >
                    <div className='flex size-6 items-center justify-center rounded-sm border'>
                        <item.icon className='size-4 shrink-0' />
                    </div>
                    {item.name}
                    <Dropdown.DropdownMenuShortcut>⌘{index + 1}</Dropdown.DropdownMenuShortcut>
                </Dropdown.DropdownMenuItem>
            ))}
        </Dropdown.DropdownMenuContent>
    </Dropdown.DropdownMenu>
);

const EnginesCollapsible = () => (
    <Collapsible.Collapsible defaultOpen className='group/collapsible'>
        <Sidebar.SidebarGroup>
            <Sidebar.SidebarGroupLabel asChild>
                <Collapsible.CollapsibleTrigger>
                    Engines
                    <Icons.ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                </Collapsible.CollapsibleTrigger>
            </Sidebar.SidebarGroupLabel>
            <Collapsible.CollapsibleContent>
                <Sidebar.SidebarGroupContent>
                    {EngineList.map((item) => (
                        <Sidebar.SidebarMenuItem key={item.title}>
                            <Sidebar.SidebarMenuButton asChild>
                                <a href={item.url}>
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
);

export function AppSidebar({ onNavigate, ...props }: Props) {
    return (
        <Sidebar.Sidebar collapsible='icon' {...props}>
            <Sidebar.SidebarHeader>
                <Sidebar.SidebarMenu>
                    <Sidebar.SidebarMenuItem>
                        <DropdownHeader />
                    </Sidebar.SidebarMenuItem>
                </Sidebar.SidebarMenu>
            </Sidebar.SidebarHeader>
            <Sidebar.SidebarContent>
                <Sidebar.SidebarMenu>

                    {/* Home Item */}
                    <Sidebar.SidebarGroup>
                        <Sidebar.SidebarMenuButton onClick={() => onNavigate('home')} asChild>
                            <a href='#'>
                                <Icons.Home />
                                <span>Home</span>
                            </a>
                        </Sidebar.SidebarMenuButton>
                    </Sidebar.SidebarGroup>

                    <Sidebar.SidebarSeparator />

                    {/* RSDK Engines */}
                    <EnginesCollapsible />

                    <Sidebar.SidebarSeparator />

                    {/* Files Item */}
                    <Sidebar.SidebarGroup>
                        <Sidebar.SidebarMenuButton onClick={() => onNavigate('files')} asChild>
                            <a href='#'>
                                <Icons.FolderClosed />
                                <span>Files</span>
                            </a>
                        </Sidebar.SidebarMenuButton>
                    </Sidebar.SidebarGroup>

                </Sidebar.SidebarMenu>
            </Sidebar.SidebarContent>
            <Sidebar.SidebarFooter>
                <SettingsDialog />
            </Sidebar.SidebarFooter>
        </Sidebar.Sidebar>
    )
}