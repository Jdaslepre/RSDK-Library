'use client'

import * as React from 'react'

// --------------------
// UI Component Imports
// --------------------

import { ThemeProvider as Provider } from 'next-themes'

// ------------
// Misc Imports
// ------------

import { type ThemeProviderProps as Props } from 'next-themes/dist/types'

// ---------------------
// Component Definitions
// ---------------------

export function ThemeProvider({ children, ...props }: Props) {
  return <Provider {...props}>{children}</Provider>
}
