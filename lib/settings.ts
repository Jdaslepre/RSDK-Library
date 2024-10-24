'use client';

// ---------------------
// Component Definitions
// ---------------------

export interface ISettings {
    enablePlus: boolean;
    enableConsole: boolean;
    deviceProfile: string;
}

const SETTINGS_KEY = 'settings';

const defaultSettings: ISettings = {
    enablePlus: false,
    enableConsole: false,
    deviceProfile: 'desktop',
};

export const Load = (): ISettings => {
    let savedSettings = null;

    if (typeof window !== 'undefined') {
        savedSettings = localStorage.getItem(SETTINGS_KEY);
    }

    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
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