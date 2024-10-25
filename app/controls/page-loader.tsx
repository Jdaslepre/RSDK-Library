import * as React from 'react';

// -------------------------
// Home UI Component Imports
// -------------------------

import { useBreadcrumb } from '@/app/controls/breadcrumb';

// ---------------------
// Component Definitions
// ---------------------

const cache: { [key: string]: React.LazyExoticComponent<React.FC> | undefined } = {};

const Start = (path: string) => {
    if (!cache[path]) {
        switch (path) {
            case 'home':
                cache[path] = React.lazy(() => import('@/app/pages/home'));
                break;
            case 'files':
                cache[path] = React.lazy(() => import('@/app/pages/files'));
                break;
            default:
                cache[path] = React.lazy(() => import('@/app/pages/default'));
                break;
        }
    }
    return cache[path];
};

interface Props {
    path: string;
    setCurrentPath: (path: string) => void;
}

const PageLoader: React.FC<Props> = ({ path, setCurrentPath }) => {
    const [Component, setComponent] = React.useState<React.LazyExoticComponent<React.FC> | undefined>(Start(path));

    const { AddNode, ResetNodes } = useBreadcrumb();
    const prevPathRef = React.useRef<string>(path);

    React.useEffect(() => {
        const i = Start(path);
        setComponent(i);

        if (prevPathRef.current !== path) {
            ResetNodes();
            prevPathRef.current = path;

            switch (path) {
                case 'home':
                    AddNode('Home', '/');
                    break;
                case 'files':
                    AddNode('Files', '/files');
                    break;
                default:
                    // TODO: todo... todo! todo :/
                    break;
            }
        }
    }, [path, setCurrentPath, AddNode, ResetNodes]);

    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            {Component ? <Component /> : null}
        </React.Suspense>
    );
};

export default PageLoader;
