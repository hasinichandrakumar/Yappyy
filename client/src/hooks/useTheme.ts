import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Force light mode only
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    // Force light mode only
    root.classList.add("light");
  }, [theme]);

  useEffect(() => {
    // Force light mode only
    localStorage.setItem("theme", "light");
  }, [theme]);

  return {
    theme,
    setTheme: (theme: Theme) => setTheme(theme),
  };
}