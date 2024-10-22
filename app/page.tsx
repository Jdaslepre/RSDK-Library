"use client";

import * as React from "react"

// --------------------
// UI Component Imports
// --------------------

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/home/app-sidebar"
import { Separator } from "@/components/ui/separator"
import * as Breadcrumb from "@/components/ui/breadcrumb";

import { PageHome } from "@/app/pages/home"

// ---------------
// Home Components
// ---------------


export default function Home() {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-screen h-screen">
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger />

                            <Separator orientation="vertical" className="mr-2 h-4" />

                            {/* This doesn't work - this is for aesthetics currently */}
                            <Breadcrumb.Breadcrumb>
                                <Breadcrumb.BreadcrumbList>

                                    <Breadcrumb.BreadcrumbItem>
                                        <Breadcrumb.BreadcrumbLink href="/components">RSDK-Library</Breadcrumb.BreadcrumbLink>
                                    </Breadcrumb.BreadcrumbItem>

                                    <Breadcrumb.BreadcrumbSeparator />

                                    <Breadcrumb.BreadcrumbItem>
                                        <Breadcrumb.BreadcrumbLink>Engines</Breadcrumb.BreadcrumbLink>
                                    </Breadcrumb.BreadcrumbItem>

                                    <Breadcrumb.BreadcrumbSeparator />

                                    <Breadcrumb.BreadcrumbItem>
                                        <Breadcrumb.BreadcrumbPage>Engine Name</Breadcrumb.BreadcrumbPage>
                                    </Breadcrumb.BreadcrumbItem>
                                </Breadcrumb.BreadcrumbList>
                            </Breadcrumb.Breadcrumb>
                        </div>
                    </header>

                    {/* page content here or whatever */}
                    <PageHome />
                </main>
            </SidebarProvider>
        </div>
    )
}