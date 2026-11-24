/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const DEFAULT_SLIDES = [
  {
    image: "https://i.ibb.co/Wy1D8Np/DALL-E-2024-11-19-04-43-42-A-volunteer-warmly-wrapping-a-child-in-a-cozy-blanket-during-winter-surro.webp",
    heading: "সবার জন্য উষ্ণতা",
    description: "শীতবস্ত্র পেয়ে পরিবারগুলোতে ছড়িয়ে পড়ছে উষ্ণতা ও আশার আলো।",
    buttonLabel: "এখনই অনুদান দিন",
    buttonLink: "/donate",
  },
  {
    image: "https://i.ibb.co.com/KjC0cVX/DALL-E-2024-11-19-05-13-31-A-heartwarming-scene-of-volunteers-distributing-warm-winter-clothing-to-p.webp",
    heading: "একসঙ্গে আমরা পরিবর্তন আনতে পারি",
    description: "এই শীতে প্রয়োজনমতো মানুষের হাতে শীতবস্ত্র তুলে দিচ্ছেন স্বেচ্ছাসেবীরা।",
    buttonLabel: "কার্যক্রম দেখুন",
    buttonLink: "/campaigns",
  },
  {
    image: "https://i.ibb.co.com/L5mK6Vs/DALL-E-2024-11-19-05-15-26-A-touching-scene-of-a-child-smiling-joyfully-as-they-receive-warm-winter.webp",
    heading: "প্রতিটি সদয় উদ্যোগই মূল্যবান",
    description: "উষ্ণ পোশাক পেয়ে হাসছে একটি শিশু।",
    buttonLabel: "অংশ নিন",
    buttonLink: "/campaigns",
  },
  {
    image: "https://i.ibb.co.com/cwxPF9M/DALL-E-2024-11-19-05-17-07-A-highly-realistic-and-heartwarming-scene-of-people-from-diverse-backgrou.webp",
    heading: "আমাদের উদ্যোগে যুক্ত হোন",
    description: "একসঙ্গে আমরা গড়ছি উজ্জ্বল ও উষ্ণ ভবিষ্যৎ।",
    buttonLabel: "সহায়তা করুন",
    buttonLink: "/how-to-help",
  },
];

export const DEFAULT_BRANDING = {
  siteName: "আল আহসান ফাউন্ডেশন",
  logo: "/Warm-Hearts-Initiative.png",
  primaryColor: "#4A90E2",
  overview: "মানবিক সহায়তা ও শীতবস্ত্র বিতরণের মাধ্যমে সুবিধাবঞ্চিত মানুষের পাশে দাঁড়াই।",
  overviewImage: "",
  sliderAutoplayDelay: 5,
  heroSlides: DEFAULT_SLIDES,
};

export const STORAGE_KEYS = {
  SETTINGS: "alahsan-branding-settings",
  CAMPAIGNS: "alahsan-campaigns",
  DONATIONS: "alahsan-donations",
  EXPENSES: "alahsan-expenses",
};

const loadInitialSettings = () => {
  if (typeof window === "undefined") return DEFAULT_BRANDING;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          ...DEFAULT_BRANDING,
          ...parsed,
          heroSlides: Array.isArray(parsed.heroSlides) && parsed.heroSlides.length > 0
            ? parsed.heroSlides
            : DEFAULT_SLIDES,
        };
      }
    }
  } catch (e) {
    console.warn("Failed reading saved settings from storage:", e);
  }
  return DEFAULT_BRANDING;
};

const loadInitialCampaigns = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed reading saved campaigns from storage:", e);
  }
  return null;
};

const BrandingContext = createContext(null);

export function BrandingProvider({ children }) {
  const [settings, setSettings] = useState(loadInitialSettings);
  const [campaigns, setCampaigns] = useState(loadInitialCampaigns);

  useEffect(() => {
    fetch("/.netlify/functions/api?action=public-settings")
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => {
        if (value && typeof value === "object") {
          setSettings((prev) => {
            const next = { ...DEFAULT_BRANDING, ...prev, ...value };
            try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next)); } catch { /* ignore */ }
            return next;
          });
        }
      })
      .catch(() => {});

    fetch("/.netlify/functions/api?action=public-campaigns")
      .then((response) => (response.ok ? response.json() : null))
      .then((value) => {
        if (Array.isArray(value) && value.length > 0) {
          setCampaigns(value);
          try { localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(value)); } catch { /* ignore */ }
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--site-primary", settings.primaryColor || "#4A90E2");
    document.documentElement.lang = "bn";
    document.title = settings.siteName || "আল আহসান ফাউন্ডেশন";
  }, [settings.primaryColor, settings.siteName]);

  const saveSettings = async (next) => {
    const merged = {
      ...DEFAULT_BRANDING,
      ...next,
      heroSlides: Array.isArray(next?.heroSlides) && next.heroSlides.length > 0
        ? next.heroSlides
        : DEFAULT_SLIDES,
    };

    // 1. Permanently persist in localStorage so refresh never resets it
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    } catch (e) {
      console.warn("Failed writing settings to localStorage:", e);
    }
    // 2. Immediately update current React state
    setSettings(merged);

    // 3. Attempt server sync in the background
    try {
      const response = await fetch("/.netlify/functions/api?action=admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": "alahsanfoundationbangladesh@gmail.com",
        },
        body: JSON.stringify({ action: "save-content", value: { kind: "settings", settings: merged } }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.value) {
          setSettings(result.value);
          try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(result.value)); } catch { /* ignore */ }
          return result.value;
        }
      }
    } catch (error) {
      console.info("Server-side sync skipped or failed; local persistence active.", error);
    }
    return merged;
  };

  const saveCampaigns = async (next) => {
    // 1. Permanently persist in localStorage so refresh never resets it
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed writing campaigns to localStorage:", e);
    }
    // 2. Immediately update current React state
    setCampaigns(next);

    // 3. Attempt server sync in the background
    try {
      const response = await fetch("/.netlify/functions/api?action=admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": "alahsanfoundationbangladesh@gmail.com",
        },
        body: JSON.stringify({ action: "save-content", value: { kind: "campaigns", campaigns: next } }),
      });
      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result.campaigns)) {
          setCampaigns(result.campaigns);
          try { localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(result.campaigns)); } catch { /* ignore */ }
          return result.campaigns;
        }
      }
    } catch (error) {
      console.info("Server-side sync skipped or failed; local persistence active.", error);
    }
    return next;
  };

  const value = useMemo(() => ({ settings, campaigns, saveSettings, saveCampaigns }), [settings, campaigns]);
  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>;
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) throw new Error("useBranding must be used within BrandingProvider");
  return context;
}
