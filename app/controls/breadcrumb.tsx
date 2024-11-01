'use client'

import * as React from 'react'

// ---------------------
// Component Definitions
// ---------------------

interface IItem {
    label: string
    path: string
    onClick?: () => void
}
interface ContextType {
    items: IItem[]
    AddNode: (label: string, path: string, onClick?: () => void) => void
    ResetNodes: () => void
}

const Context = React.createContext<ContextType | undefined>(undefined)

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, SetItem] = React.useState<IItem[]>([])

    const AddNode = (label: string, path: string, onClick?: () => void) => {
        SetItem(prev => {
            const exists = prev.find(item => item.path === path)
            return exists ? prev : [...prev, { label, path, onClick }]
        })
    }
    const ResetNodes = () => {
        SetItem([])
    }

    return (
        <Context.Provider value={{ items, AddNode, ResetNodes }}>
            {children}
        </Context.Provider>
    )
}

export const useBreadcrumb = (): ContextType => {
    const context = React.useContext(Context)
    if (context === undefined) {
        throw new Error('useBreadcrumb must be used within a BreadcrumbProvider')
    }
    return context
}