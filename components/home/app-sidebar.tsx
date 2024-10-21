"use client";

import * as Icons from "lucide-react"
import * as Sidebar from "@/components/ui/sidebar"
import * as Collapsible from "@/components/ui/collapsible"

import { SettingsDialog } from "@/components/home/settings-dialog";

const RSDK_EngineList = [
    {
        title: "RSDKv2",
        url: "#",
        icon: Icons.Inbox,
    },
    {
        title: "RSDKv3",
        url: "#",
        icon: Icons.Inbox,
    },
    {
        title: "RSDKv4",
        url: "#",
        icon: Icons.Inbox,
    },
    {
        title: "RSDKv5",
        url: "#",
        icon: Icons.Inbox,
    },
    {
        title: "RSDKv5U",
        url: "#",
        icon: Icons.Inbox,
    },
]

export function AppSidebar() {
    return (
        <Sidebar.Sidebar>
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

                    <Collapsible.Collapsible defaultOpen className="group/collapsible">
                        <Sidebar.SidebarGroup>
                            <Sidebar.SidebarGroupLabel asChild>
                                <Collapsible.CollapsibleTrigger>
                                    Engines
                                    <Icons.ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </Collapsible.CollapsibleTrigger>
                            </Sidebar.SidebarGroupLabel>

                            {/* RSDK Engines */}
                            <Collapsible.CollapsibleContent>
                                <Sidebar.SidebarGroupContent>
                                    {RSDK_EngineList.map((item) => (
                                        <Sidebar.SidebarMenuItem key={item.title}>
                                            <Sidebar.SidebarMenuButton asChild>
                                                <a href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </a>
                                            </Sidebar.SidebarMenuButton>
                                        </Sidebar.SidebarMenuItem>
                                    ))}
                                </Sidebar.SidebarGroupContent>
                            </Collapsible.CollapsibleContent>

                        </Sidebar.SidebarGroup>
                    </Collapsible.Collapsible>

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