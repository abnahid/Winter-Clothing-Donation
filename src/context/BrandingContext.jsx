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
