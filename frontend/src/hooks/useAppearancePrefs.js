import { useEffect, useState } from "react";

const DEFAULT_PREFS = {
  appTheme: "system",          // system | light | dark
  cardDensity: "comfortable",  // comfortable | compact
  animationsEnabled: true
};

// 🔑 map Appearance → EXISTING themes
function resolveTheme(appTheme) {
  if (appTheme === "light") return "paper";        // existing light theme
  if (appTheme === "dark") return "dark";          // existing dark theme

  // system
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isDark ? "dark" : "paper";
}

export function useAppearancePrefs() {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("appearancePrefs");
      return saved ? JSON.parse(saved) : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  // 🔥 APPLY REAL CHANGES
  useEffect(() => {
    const theme = resolveTheme(prefs.appTheme);

    // ✅ THIS is what your app already understands
    localStorage.setItem("theme", theme);

    // optional but useful if your CSS uses data-theme
    document.documentElement.setAttribute("data-theme", theme);

    // density (already fine)
    document.body.dataset.density = prefs.cardDensity;

    // animations
    document.body.classList.toggle(
      "no-animations",
      !prefs.animationsEnabled
    );
  }, [prefs]);

  const save = () => {
    localStorage.setItem("appearancePrefs", JSON.stringify(prefs));
  };

  const reset = () => {
    localStorage.removeItem("appearancePrefs");
    setPrefs(DEFAULT_PREFS);
  };

  const updatePref = (key, value) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  return { prefs, updatePref, save, reset };
}
