import { useEffect, useState } from "react";
import { themes, Theme } from "../lib/themes";

const THEME_STORAGE_KEY = "app-theme";
const MODE_STORAGE_KEY = "app-mode";

export type ThemeMode = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(THEME_STORAGE_KEY) || "zinc";
    }
    return "zinc";
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode) || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const selectedTheme = themes.find((t: Theme) => t.name === theme);

    if (!selectedTheme) return;

    // Just change primary color - simple!
    const primaryColor = selectedTheme.primary[mode];

    // Remove old theme classes
    root.classList.remove("light", "dark");
    root.classList.add(mode);

    // Apply primary color and text color
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--ring", primaryColor); // Focus ring color
    root.style.setProperty("--sidebar-primary", primaryColor); // Sidebar active color

    // Set foreground based on mode
    if (mode === "light") {
      root.style.setProperty("--primary-foreground", "oklch(0.985 0 0)"); // white text
      root.style.setProperty(
        "--sidebar-primary-foreground",
        "oklch(0.985 0 0)",
      );
    } else {
      root.style.setProperty("--primary-foreground", "oklch(0.145 0 0)"); // dark text
      root.style.setProperty(
        "--sidebar-primary-foreground",
        "oklch(0.985 0 0)",
      );
    }

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(MODE_STORAGE_KEY, mode);
  }, [theme, mode]);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  return {
    theme,
    setTheme,
    mode,
    setMode,
    toggleMode,
    themes,
  };
}
