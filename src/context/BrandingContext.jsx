import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "warm-hearts-branding-v1";
const defaults = {
  siteName: "উষ্ণ হৃদয় উদ্যোগ",
  logo: "/Warm-Hearts-Initiative.png",
  primaryColor: "#1686c9",
  overview:
    "আমাদের লক্ষ্য হলো উদার দাতাদের সঙ্গে স্বেচ্ছাসেবীদের যুক্ত করে বাংলাদেশের সুবিধাবঞ্চিত মানুষের কাছে প্রয়োজনীয় শীতবস্ত্র পৌঁছে দেওয়া। আপনার সহায়তায় কেউ যেন একা শীতের কষ্টে না থাকেন, তা নিশ্চিত করতে আমরা কাজ করি।",
};

const BrandingContext = createContext(null);

export function BrandingProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
    } catch {
      return defaults;
    }
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--site-primary", settings.primaryColor);
    document.documentElement.lang = "bn";
    document.title = settings.siteName;
  }, [settings.primaryColor, settings.siteName]);

  const value = useMemo(() => ({
    settings,
    saveSettings: (next) => {
      const updated = { ...defaults, ...next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSettings(updated);
    },
    resetSettings: () => {
      localStorage.removeItem(STORAGE_KEY);
      setSettings(defaults);
    },
  }), [settings]);

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) throw new Error("useBranding must be used within BrandingProvider");
  return context;
}
