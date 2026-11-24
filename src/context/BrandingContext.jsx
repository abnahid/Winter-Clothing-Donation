/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const DEFAULT_BRANDING = {
  siteName: "আল আহসান ফাউন্ডেশন",
  logo: "/Warm-Hearts-Initiative.png",
  primaryColor: "#4A90E2",
  overview: "মানবিক সহায়তা ও শীতবস্ত্র বিতরণের মাধ্যমে সুবিধাবঞ্চিত মানুষের পাশে দাঁড়াই।",
  overviewImage: "",
};

const BrandingContext = createContext(null);

export function BrandingProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_BRANDING);
  const [campaigns, setCampaigns] = useState(null);

  useEffect(() => {
    fetch("/.netlify/functions/api?action=public-settings")
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => value && setSettings({ ...DEFAULT_BRANDING, ...value }))
      .catch(() => {});
    fetch("/.netlify/functions/api?action=public-campaigns")
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => value && Array.isArray(value) && setCampaigns(value))
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--site-primary", settings.primaryColor);
    document.documentElement.lang = "bn";
    document.title = settings.siteName;
  }, [settings.primaryColor, settings.siteName]);

  const saveSettings = async (next) => {
    const response = await fetch("/.netlify/functions/api?action=admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save-content", value: { kind: "settings", settings: next } }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "পরিবর্তন সংরক্ষণ করা যায়নি।");
    setSettings(result.value);
    return result.value;
  };

  const saveCampaigns = async (next) => {
    const response = await fetch("/.netlify/functions/api?action=admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save-content", value: { kind: "campaigns", campaigns: next } }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "কার্যক্রমগুলো সংরক্ষণ করা যায়নি।");
    setCampaigns(result.campaigns);
    return result.campaigns;
  };

  const value = useMemo(() => ({ settings, campaigns, saveSettings, saveCampaigns }), [settings, campaigns]);
  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) throw new Error("useBranding must be used within BrandingProvider");
  return context;
}
