import { createContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'

type ThemeMode = 'dark' | 'light'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'expense-planner-theme'

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<ThemeMode>(() => readInitialTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

function readInitialTheme(): ThemeMode {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}
