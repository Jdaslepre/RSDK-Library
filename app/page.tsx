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

import * as HomeBreadcrumb from '@/components/home/breadcrumb';
import PageLoader from '@/components/home/page-loader';

import { AppSidebar } from '@/components/home/app-sidebar';

// ---------------------
// Component Definitions
// ---------------------

export default function Home() {
    const [currentPath, setCurrentPath] = React.useState('home');

    return (
        <HomeBreadcrumb.Provider>
            <Sidebar.SidebarProvider>
                <AppSidebar onNavigate={(path) => setCurrentPath(path)} />
                <main className='w-screen h-screen'>
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
                    <div className='p-6'>
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
            AddNode(label, path, () => setCurrentPath(path));
        };

        switch (currentPath) {
            case 'home':
                _AddNode('Home', '/');
                break;
            case 'files':
                _AddNode('Files', '/files');
                break;
            default:
                // nothing... yet
                break;
        }
    }, [currentPath, items, setCurrentPath]);

    return (
        <>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <Breadcrumb.BreadcrumbItem>
                        <Breadcrumb.BreadcrumbLink href={item.path} onClick={item.onClick}>
                            {item.label}
                        </Breadcrumb.BreadcrumbLink>
                    </Breadcrumb.BreadcrumbItem>
                    {index < items.length - 1 && <Breadcrumb.BreadcrumbSeparator />}
                </React.Fragment>
            ))}
        </>
    );
};
