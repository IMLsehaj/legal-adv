import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeName = "navy" | "emerald" | "rose" | "sunset" | "midnight" | "ocean";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDark: boolean;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const themes: { name: ThemeName; label: string; colors: { primary: string; accent: string } }[] = [
  { name: "navy", label: "Navy Gold", colors: { primary: "#1e3a5f", accent: "#d4a843" } },
  { name: "emerald", label: "Emerald", colors: { primary: "#065f46", accent: "#10b981" } },
  { name: "rose", label: "Rose", colors: { primary: "#9f1239", accent: "#fb7185" } },
  { name: "sunset", label: "Sunset", colors: { primary: "#92400e", accent: "#f59e0b" } },
  { name: "midnight", label: "Midnight", colors: { primary: "#312e81", accent: "#818cf8" } },
  { name: "ocean", label: "Ocean", colors: { primary: "#164e63", accent: "#22d3ee" } },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => (localStorage.getItem("legaledge-theme") as ThemeName) || "navy");
  const [isDark, setIsDark] = useState(() => localStorage.getItem("legaledge-dark") === "true");

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("legaledge-theme", t);
  };

  const toggleDark = () => {
    setIsDark((p) => {
      localStorage.setItem("legaledge-dark", String(!p));
      return !p;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", isDark);
  }, [theme, isDark]);

  return <ThemeContext.Provider value={{ theme, setTheme, isDark, toggleDark }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
