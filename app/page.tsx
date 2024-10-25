'use client';

import * as React from 'react';

// --------------------
// UI Component Imports
// --------------------

import * as Sidebar from '@/components/ui/sidebar';
import * as Breadcrumb from '@/components/ui/breadcrumb';

import { Separator } from '@/components/ui/separator';

// -------------------------
// Home UI Component Imports
// -------------------------

import * as HomeBreadcrumb from '@/app/controls/breadcrumb';
import PageLoader from '@/app/controls/page-loader';

import { AppSidebar } from '@/app/controls/app-sidebar';

// ---------------------
// Component Definitions
// ---------------------

export default function Home() {
    const [currentPath, setCurrentPath] = React.useState('home');

    return (
        <HomeBreadcrumb.Provider>
            <Sidebar.SidebarProvider>
                <AppSidebar onNavigate={(path) => setCurrentPath(path)} />
                <main className='w-screen h-screen flex flex-col'>
                    <header className='sticky top-0 z-10 bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex h-14 shrink-0 items-center border-b transition-[width,height] ease-linear'>
                        <div className='flex items-center gap-2 px-4'>
                            <Sidebar.SidebarTrigger className='-ml-1' />
                            <Separator orientation='vertical' className='mr-2 h-4' />
                            <Breadcrumb.Breadcrumb>
                                <Breadcrumb.BreadcrumbList>
                                    <BreadcrumbContent currentPath={currentPath} setCurrentPath={setCurrentPath} />
                                </Breadcrumb.BreadcrumbList>
                            </Breadcrumb.Breadcrumb>
                        </div>
                    </header>
                    <div className='p-6 flex-1 overflow-auto'>
                        <PageLoader path={currentPath} setCurrentPath={setCurrentPath} />
                    </div>
                </main>
            </Sidebar.SidebarProvider>
        </HomeBreadcrumb.Provider>
    );
}

const BreadcrumbContent: React.FC<{ currentPath: string, setCurrentPath: (path: string) => void }> = ({ currentPath, setCurrentPath }) => {
    const { items, AddNode } = HomeBreadcrumb.useBreadcrumb();

    React.useEffect(() => {
        const _AddNode = (label: string, path: string) => {
            AddNode(label, path, () => null);
        };

        switch (currentPath) {
            case 'home':
                _AddNode('Home', '/');
                break;
            case 'files':
                // eh, the page will handle it
                break;
            default:
                // nothing... yet
                break;
        }
    }, [currentPath, items, AddNode, setCurrentPath]);

    return (
        <>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <Breadcrumb.BreadcrumbItem>
                        <Breadcrumb.BreadcrumbLink
                            href='#'
                            onClick={(e) => {
                                e.preventDefault();
                                if (item.onClick) item.onClick();
                            }}>
                            {item.label}
                        </Breadcrumb.BreadcrumbLink>
                    </Breadcrumb.BreadcrumbItem>
                    {index < items.length - 1 && <Breadcrumb.BreadcrumbSeparator />}
                </React.Fragment>
            ))}
        </>
    );
};
