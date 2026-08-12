"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

export type Accent =
  | "violet"
  | "amber"
  | "blue"
  | "pink"
  | "rose"
  | "emerald"
  | "black";

export const accents: {
  id: Accent;
  label: string;
  swatch: string;
}[] = [
  {
    id: "violet",
    label: "Violet",
    swatch: "bg-[oklch(0.55_0.19_295)]",
  },
  {
    id: "amber",
    label: "Amber",
    swatch: "bg-[oklch(0.78_0.15_70)]",
  },
  {
    id: "blue",
    label: "Blue",
    swatch: "bg-[oklch(0.58_0.19_255)]",
  },
  {
    id: "pink",
    label: "Pink",
    swatch: "bg-[oklch(0.68_0.2_350)]",
  },
  {
    id: "rose",
    label: "Rose",
    swatch: "bg-[oklch(0.62_0.21_15)]",
  },
  {
    id: "emerald",
    label: "Emerald",
    swatch: "bg-[oklch(0.6_0.14_162)]",
  },
  {
    id: "black",
    label: "Black",
    swatch: "bg-[oklch(0.22_0.015_265)]",
  },
];

const MODE_KEY = "dexter.theme.mode";
const ACCENT_KEY = "dexter.theme.accent";

type ThemeContextValue = {
  mode: ThemeMode;
  accent: Accent;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: Accent) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [accent, setAccent] = useState<Accent>("violet");
  const [hydrated, setHydrated] = useState(false);

  // Load saved preferences once
  useEffect(() => {
    const savedMode = localStorage.getItem(MODE_KEY);
    const savedAccent = localStorage.getItem(ACCENT_KEY);

    if (savedMode === "dark" || savedMode === "light") {
      setMode(savedMode);
    }

    if (
      savedAccent === "violet" ||
      savedAccent === "amber" ||
      savedAccent === "blue" ||
      savedAccent === "pink" ||
      savedAccent === "rose" ||
      savedAccent === "emerald" ||
      savedAccent === "black"
    ) {
      setAccent(savedAccent);
    }

    setHydrated(true);
  }, []);

  // Apply theme + save preferences
  useEffect(() => {
    if (!hydrated) return;

    const root = document.documentElement;

    root.classList.toggle("dark", mode === "dark");
    root.setAttribute("data-accent", accent);

    localStorage.setItem(MODE_KEY, mode);
    localStorage.setItem(ACCENT_KEY, accent);
  }, [mode, accent, hydrated]);

  return (
    <ThemeContext.Provider
      value={{
        mode,
        accent,
        setMode,
        setAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

