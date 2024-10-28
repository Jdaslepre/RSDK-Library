declare global {
    interface Window {
        TS_InitFS: (p: string, f: any) => void;
    }
}

export {};