'use client'

import * as React from 'react'
import * as Icons from 'lucide-react'

// --------------------
// UI Component Imports
// --------------------

import * as Path from '@/app/controls/path-context'
import * as HomeBreadcrumb from '@/app/controls/breadcrumb'
import * as Side from '@/app/controls/app-sidebar'

import * as Sidebar from 'ui/sidebar'
import * as Drawer from 'ui/drawer'
import * as Breadcrumb from 'ui/breadcrumb'

import { Button } from 'ui/button'
import { Separator } from 'ui/separator'
import { SettingsContent } from '@/app/controls/settings-content'

import PageLoader from '@/app/controls/page-loader'

// ------------
// Misc Imports
// ------------

import { useIsMobile } from 'hooks/use-mobile'

// ---------------------
// Component Definitions
// ---------------------

export default function Page() {
    return (
        <Path.Provider>
            <HomeBreadcrumb.Provider>
                <Sidebar.SidebarProvider>
                    <PageContent />
                </Sidebar.SidebarProvider>
            </HomeBreadcrumb.Provider>
        </Path.Provider>
    );
}

const PageContent: React.FC = () => {
    const { currentPath, setCurrentPath } = Path.useCurrentPath();
    const [open, setOpen] = React.useState(false);
    const isMobile = useIsMobile();

    return (
        <>
            <Side.AppSidebar onNavigate={(path) => setCurrentPath(path)} />
            <main className='w-screen h-screen flex flex-col'>
                <header className='PWA-Title-Draggable sticky top-0 z-10 p-2 flex h-14 shrink-0 items-center border-b'>
                    <div className={`PWA-Title-NonDraggable flex items-center gap-2 ${!isMobile ? 'px-4' : 'pl-2'}`}>
                        {isMobile ? (
                            <>
                                <Button variant='ghost' size='sm' onClick={() => setCurrentPath('home')}>
                                    <Icons.Home />
                                </Button>
                                <Drawer.Drawer open={open} onOpenChange={setOpen}>
                                    <Drawer.DrawerTrigger asChild>
                                        <Button className='-ml-1' variant='ghost' size='sm'>
                                            <Icons.Settings2 />
                                        </Button>
                                    </Drawer.DrawerTrigger>
                                    <Drawer.DrawerContent>
                                        <Drawer.DrawerHeader>
                                            <Drawer.DrawerTitle>Settings</Drawer.DrawerTitle>
                                            <Drawer.DrawerDescription>Configure the engines.</Drawer.DrawerDescription>
                                        </Drawer.DrawerHeader>
                                        <Drawer.DrawerFooter className='pt-2'>
                                            <SettingsContent />
                                        </Drawer.DrawerFooter>
                                    </Drawer.DrawerContent>
                                </Drawer.Drawer>
                            </>
                        ) : (
                            <Sidebar.SidebarTrigger className='-ml-1' />
                        )}
                        <Separator orientation='vertical' className='mr-2 h-4' />
                        <Breadcrumb.Breadcrumb>
                            <Breadcrumb.BreadcrumbList>
                                <BreadcrumbContent currentPath={currentPath} />
                            </Breadcrumb.BreadcrumbList>
                        </Breadcrumb.Breadcrumb>
                    </div>
                </header>
                <div className='p-4 flex-1 overflow-auto'>
                    <PageLoader path={currentPath} setCurrentPath={setCurrentPath} />
                </div>
            </main>
        </>
    );
};

const BreadcrumbContent: React.FC<{ currentPath: string }> = ({ currentPath }) => {
    const { items, AddNode } = HomeBreadcrumb.useBreadcrumb()

    React.useEffect(() => {
        if (currentPath === 'home') {
            AddNode('Home', '/', () => null)
        }
    }, [currentPath, AddNode])

    return (
        <>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <Breadcrumb.BreadcrumbItem>
                        <Breadcrumb.BreadcrumbLink
                            href='#'
                            onClick={(e) => {
                                e.preventDefault()
                                if (item.onClick) item.onClick()
                            }}>
                            {item.label}
                        </Breadcrumb.BreadcrumbLink>
                    </Breadcrumb.BreadcrumbItem>
                    {index < items.length - 1 && <Breadcrumb.BreadcrumbSeparator />}
                </React.Fragment>
            ))}
        </>
    )
}
