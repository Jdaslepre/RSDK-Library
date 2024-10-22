"use client";

import * as React from "react"

import * as Icons from "lucide-react"
import * as Collapsible from "@/components/ui/collapsible"
import * as Dropdown from "@/components/ui/dropdown-menu"
import * as Sidebar from "@/components/ui/sidebar"

import { SettingsDialog } from "@/components/home/settings-dialog";

const RSDK_EngineList = [
    {
        title: "RSDKv2",
        url: "#",
        icon: "./assets/RSDKGeneric.png",
    },
    {
        title: "RSDKv3",
        url: "#",
        icon: "./assets/RSDKv3.png",
    },
    {
        title: "RSDKv4",
        url: "#",
        icon: "./assets/RSDKv4.png",
    },
    {
        title: "RSDKv5",
        url: "#",
        icon: "./assets/RSDKv5.png",
    },
    {
        title: "RSDKv5U",
        url: "#",
        icon: "./assets/RSDKv5U.png",
    },
]

const RSDK_Resources = [
    {
        name: "Website Source Code",
        url: "https://github.com/Jdsle/RSDK",
        icon: Icons.Code2,
    },
    {
        name: "Engine Source Code",
        url: "https://github.com/Jdsle/RSDK-Library-src",
        icon: Icons.Code2,
    },
    {
        name: "RSDK-Modding Github",
        url: "https://github.com/RSDKModding",
        icon: Icons.Globe,
    },
    {
        name: "RSDK-Modding Website",
        url: "https://rsdkmodding.com",
        icon: Icons.Globe,
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar.Sidebar>) {
    return (
        <Sidebar.Sidebar collapsible="icon" {...props}>
            <Sidebar.SidebarHeader>
                <Sidebar.SidebarMenu>
                    <Sidebar.SidebarMenuItem>

                        <Dropdown.DropdownMenu>
                            <Dropdown.DropdownMenuTrigger asChild>
                                <Sidebar.SidebarMenuButton className="w-fit px-1.5">
                                    <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                                        <img src={`./assets/RSDK.png`} alt="header logo" />
                                    </div>
                                    <span className="truncate font-semibold">RSDK-Library</span>
                                    <Icons.ChevronDown className="opacity-50" />
                                </Sidebar.SidebarMenuButton>
                            </Dropdown.DropdownMenuTrigger>
                            <Dropdown.DropdownMenuContent
                                className="w-64 rounded-lg"
                                align="start"
                                side="bottom"
                                sideOffset={4}
                            >
                                <Dropdown.DropdownMenuLabel className="text-xs text-muted-foreground">
                                    Resources
                                </Dropdown.DropdownMenuLabel>
                                {RSDK_Resources.map((item, index) => (
                                    <Dropdown.DropdownMenuItem
                                        key={item.name}
                                        onClick={() => window.open(item.url, '_blank')}
                                        className="gap-2 p-2"
                                    >
                                        <div className="flex size-6 items-center justify-center rounded-sm border">
                                            <item.icon className="size-4 shrink-0" />
                                        </div>
                                        {item.name}
                                        <Dropdown.DropdownMenuShortcut>⌘{index + 1}</Dropdown.DropdownMenuShortcut>
                                    </Dropdown.DropdownMenuItem>
                                ))}
                            </Dropdown.DropdownMenuContent>
                        </Dropdown.DropdownMenu>

                    </Sidebar.SidebarMenuItem>
                </Sidebar.SidebarMenu>
            </Sidebar.SidebarHeader>

            <Sidebar.SidebarContent>
                <Sidebar.SidebarMenu>

                    <Sidebar.SidebarGroup>
                        {/* Home Item */}
                        <Sidebar.SidebarMenuButton asChild>
                            <a>
                                <Icons.Home />
                                <span>Home</span>
                            </a>
                        </Sidebar.SidebarMenuButton>
                    </Sidebar.SidebarGroup>

                    <Sidebar.SidebarSeparator />

                    {/* RSDK Engines */}
                    <Collapsible.Collapsible defaultOpen className="group/collapsible">
                        <Sidebar.SidebarGroup>
                            <Sidebar.SidebarGroupLabel asChild>
                                <Collapsible.CollapsibleTrigger>
                                    Engines
                                    <Icons.ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </Collapsible.CollapsibleTrigger>
                            </Sidebar.SidebarGroupLabel>

                            <Collapsible.CollapsibleContent>
                                <Sidebar.SidebarGroupContent>
                                    {RSDK_EngineList.map((item) => (
                                        <Sidebar.SidebarMenuItem key={item.title}>
                                            <Sidebar.SidebarMenuButton asChild>
                                                <a href={item.url}>
                                                    <img src={item.icon} alt="engine logo" width={16} height={16} />
                                                    <span>{item.title}</span>
                                                </a>
                                            </Sidebar.SidebarMenuButton>
                                        </Sidebar.SidebarMenuItem>
                                    ))}
                                </Sidebar.SidebarGroupContent>
                            </Collapsible.CollapsibleContent>

                        </Sidebar.SidebarGroup>
                    </Collapsible.Collapsible>

                    <Sidebar.SidebarSeparator />

                    {/* Files Item */}
                    <Sidebar.SidebarGroup>
                        <Sidebar.SidebarMenuButton asChild>
                            <a>
                                <Icons.Inbox />
                                <span>Files</span>
                            </a>
                        </Sidebar.SidebarMenuButton>
                    </Sidebar.SidebarGroup>

                </Sidebar.SidebarMenu>
            </Sidebar.SidebarContent>

            {/* Footer. Includes the settings dialog button */}
            <Sidebar.SidebarFooter>
                <SettingsDialog />
            </Sidebar.SidebarFooter>
        </Sidebar.Sidebar>
    )
}