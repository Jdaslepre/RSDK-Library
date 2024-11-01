import * as React from 'react'

interface Props {
    currentPath: string;
    setCurrentPath: (path: string) => void;
}

const Context = React.createContext<Props | undefined>(undefined);

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentPath, setCurrentPath] = React.useState<string>('home');

    return (
        <Context.Provider value={{ currentPath, setCurrentPath }}>
            {children}
        </Context.Provider>
    );
};

export const useCurrentPath = (): Props => {
    const context = React.useContext(Context);
    if (!context) {
        throw new Error('useCurrentPath must be used within a CurrentPathProvider');
    }
    return context;
};
