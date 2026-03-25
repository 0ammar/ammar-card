"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeCtx = { theme: Theme; toggle: () => void; mounted: boolean; };

const Ctx = createContext<ThemeCtx>({ theme: "light", toggle: () => { }, mounted: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      const sys = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      const init = stored === "light" || stored === "dark" ? stored : "dark";
      setThemeState(init);
      document.documentElement.setAttribute("data-theme", init);
      if (!stored) localStorage.setItem("theme", init);
    } catch {
      document.documentElement.setAttribute("data-theme", "light");
    } finally {
      setMounted(true);
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState(prev => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeState(e.newValue);
        document.documentElement.setAttribute("data-theme", e.newValue);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return <Ctx.Provider value={{ theme, toggle, mounted }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);