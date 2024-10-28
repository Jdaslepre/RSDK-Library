import * as React from 'react';
import * as Icons from 'lucide-react';
import { useBreadcrumb } from '@/app/controls/breadcrumb';

const cache: { [key: string]: React.LazyExoticComponent<React.FC> | undefined } = {};

const Start = (path: string) => {
    if (!cache[path]) {
        switch (path) {
            case 'home': cache[path] = React.lazy(() => import('@/app/pages/home')); break;
            case 'rsdkv2': cache[path] = React.lazy(() => import('@/app/pages/rsdkv2')); break;
            case 'rsdkv3': cache[path] = React.lazy(() => import('@/app/pages/rsdkv3')); break;
            case 'rsdkv4': cache[path] = React.lazy(() => import('@/app/pages/rsdkv4')); break;
            case 'rsdkv5': cache[path] = React.lazy(() => import('@/app/pages/rsdkv5')); break;
            case 'rsdkv5u': cache[path] = React.lazy(() => import('@/app/pages/rsdkv5u')); break;
            case 'files': cache[path] = React.lazy(() => import('@/app/pages/files')); break;
            default: cache[path] = React.lazy(() => import('@/app/pages/default')); break;
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
        const newComponent = Start(path);
        if (Component !== newComponent) {
            setComponent(newComponent);
        }

        if (prevPathRef.current !== path) {
            ResetNodes();
            prevPathRef.current = path;

            switch (path) {
                case 'home': AddNode('Home', '/'); break;
                case 'rsdkv2': AddNode('RSDKv2 Files', '/'); break;
                case 'rsdkv3': AddNode('RSDKv3 Files', '/'); break;
                case 'rsdkv4': AddNode('RSDKv4 Files', '/'); break;
                case 'rsdkv5': AddNode('RSDKv5 Files', '/'); break;
                case 'rsdkv5u': AddNode('RSDKv5U Files', '/'); break;
                case 'files': AddNode('Files', '/files'); break;
                default: break;
            }
        }
    }, [path, setCurrentPath, AddNode, ResetNodes]);

    return (
            <React.Suspense
            fallback={
              <div className="flex w-full items-center justify-center text-sm text-muted-foreground">
                <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            }
          >
            {Component ? <Component /> : null}
        </React.Suspense>
    );
};

export default PageLoader;
