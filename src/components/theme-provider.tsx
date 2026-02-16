import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [isSystemDarkTheme, setIsSystemDarkTheme] = useState(true);
  const isSystemDarkThemeListener = (ev: MediaQueryListEvent): void => { setIsSystemDarkTheme(ev.matches) }

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemDarkThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      systemDarkThemeMediaQuery.addEventListener('change', isSystemDarkThemeListener)

      setIsSystemDarkTheme(systemDarkThemeMediaQuery.matches);
      const systemTheme = isSystemDarkTheme
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return () => systemDarkThemeMediaQuery.removeEventListener('change', isSystemDarkThemeListener);
    }

    root.classList.add(theme)
  }, [theme, isSystemDarkTheme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
