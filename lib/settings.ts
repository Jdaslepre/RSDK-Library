'use client';

// ---------------------
// Component Definitions
// ---------------------

export interface ISettings {
    enablePlus: boolean;
    deviceProfile: string;
}

const SETTINGS_KEY = 'settings';

const defaultSettings: ISettings = {
    enablePlus: false,
    deviceProfile: 'desktop',
};

export const Load = (): ISettings => {
    if (typeof window === 'undefined') return defaultSettings;

    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedSettings) {
        return JSON.parse(savedSettings);
    } else {
        return defaultSettings;
    }
};


export const Save = (settings: ISettings) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
};

export const Update = (updates: Partial<ISettings>) => {
    const currentSettings = Load();
    const newSettings = { ...currentSettings, ...updates };
    Save(newSettings);
};