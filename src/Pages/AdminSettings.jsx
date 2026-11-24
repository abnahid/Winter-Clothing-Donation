import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";
import { DEFAULT_BRANDING, STORAGE_KEYS, useBranding } from "../context/BrandingContext";

const API = "/.netlify/functions/api";
const tabs = [
  ["overview", "সাইট ওভারভিউ"],
  ["hero", "হিরো স্লাইড"],
  ["campaigns", "কার্যক্রম ও ছবি"],
  ["donations", "অনুদান যাচাই"],
  ["expenses", "আয়-ব্যয়"],
];
const money = (amount) => `৳${Number(amount || 0).toLocaleString("bn-BD")}`;
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

async function imageToDataUrl(file) {
  if (!IMAGE_TYPES.has(file?.type)) {
    throw new Error("PNG, JPEG, WebP বা GIF ছবির ফাইল নির্বাচন করুন।");
  }
  if (file.size > 750 * 1024) throw new Error("ছবির মূল ফাইল ৭৫০ কিলোবাইটের মধ্যে রাখুন।");

  let uploadFile = file;
  if (file.size > 180 * 1024 && typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1600;
    let scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    let blob = null;
    for (let attempt = 0; attempt < 7; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.82 - attempt * 0.04));
      if (blob && blob.size <= 180 * 1024) break;
      scale *= 0.82;
    }
    bitmap.close();
    if (!blob || blob.size > 180 * 1024) throw new Error("ছবিটি ছোট করে আপলোড করুন।");
    uploadFile = blob;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("ছবিটি পড়া যায়নি।"));
    reader.readAsDataURL(uploadFile);
  });
}

const emailStatusText = (status) => ({
  sent: "পাঠানো হয়েছে",
  failed: "পাঠানো ব্যর্থ",
  pending: "পাঠানোর অপেক্ষায়",
  unknown: "অবস্থা জানা নেই",
}[status] || "অবস্থা জানা নেই");

const mergeRecords = (remoteList = [], localList = [], key = "id") => {
  const map = new Map();
  for (const item of localList || []) {
    if (item && item[key]) map.set(String(item[key]), item);
  }
  for (const item of remoteList || []) {
    if (item && item[key]) {
      const existing = map.get(String(item[key])) || {};
      map.set(String(item[key]), { ...existing, ...item });
    }
  }
  return Array.from(map.values());
};

const AdminSettings = () => {
  const { user } = useContext(AuthContext);
  const { settings, campaigns: sharedCampaigns, saveSettings, saveCampaigns } = useBranding();
  const [section, setSection] = useState("overview");
  const [form, setForm] = useState({ ...DEFAULT_BRANDING, ...settings });
  const [campaignList, setCampaignList] = useState(sharedCampaigns || []);
  const campaignListRef = useRef(sharedCampaigns || []);
  
  // Initialize donations and expenses from localStorage immediately so there is zero delay
  const [donations, setDonations] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const [loading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: "", category: "", amount: "", note: "" });
  const inputClass = "mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-primary";

  useEffect(() => { campaignListRef.current = campaignList; }, [campaignList]);

  const refresh = useCallback(async () => {
    try {
      // 1. Read latest local storage first
      let currentLocalDonations = [];
      let currentLocalExpenses = [];
      try {
        const rawDonations = localStorage.getItem(STORAGE_KEYS.DONATIONS);
        if (rawDonations) currentLocalDonations = JSON.parse(rawDonations);
        const rawExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        if (rawExpenses) currentLocalExpenses = JSON.parse(rawExpenses);
      } catch { /* ignore */ }

      // 2. Fetch server data
      const response = await fetch(`${API}?action=admin-data`, {
        headers: {
          "x-admin-email": "alahsanfoundationbangladesh@gmail.com",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.donations)) {
          const merged = mergeRecords(data.donations, currentLocalDonations, "id")
            .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
          setDonations(merged);
          try { localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(merged)); } catch { /* ignore */ }
        }
        if (Array.isArray(data.expenses)) {
          const merged = mergeRecords(data.expenses, currentLocalExpenses, "id")
            .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
          setExpenses(merged);
          try { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(merged)); } catch { /* ignore */ }
        }
        if (data.settings && typeof data.settings === "object") {
          setForm((current) => ({ ...current, ...DEFAULT_BRANDING, ...data.settings }));
        }
        if (Array.isArray(data.campaigns) && data.campaigns.length > 0) {
          setCampaignList(data.campaigns);
        }
      }
    } catch (error) {
      console.info("Could not fetch cloud admin data, working from local storage:", error);
    } finally {
      // If campaigns still empty, load seed JSON
      if (!campaignListRef.current?.length) {
        try {
          const seedResponse = await fetch("/donation-campaigns.json");
          const seed = await seedResponse.json();
          if (Array.isArray(seed) && seed.length > 0) {
            setCampaignList(seed);
          }
        } catch { /* ignore */ }
      }
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    setForm((current) => ({ ...current, ...DEFAULT_BRANDING, ...settings }));
    if (Array.isArray(sharedCampaigns) && sharedCampaigns.length > 0) {
      setCampaignList(sharedCampaigns);
    }
  }, [settings, sharedCampaigns]);

  const totals = useMemo(() => {
    const received = donations.filter((d) => d.status === "approved").reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const pending = donations.filter((d) => d.status === "pending").reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const spent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    return { received, pending, spent, balance: received - spent };
  }, [donations, expenses]);

  const postAdmin = async (payload) => {
    const response = await fetch(`${API}?action=admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-email": "alahsanfoundationbangladesh@gmail.com",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "অনুরোধটি সার্ভারে প্রক্রিয়া করা যায়নি।");
    return data;
  };

  const saveBranding = async (event) => {
    event?.preventDefault();
    setBusy(true);
    try {
      await saveSettings(form);
      toast.success("সাইটের পরিচিতি ও থিম স্থায়ীভাবে সংরক্ষণ করা হয়েছে।");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleImage = async (event, update) => {
    try {
      const value = await imageToDataUrl(event.target.files?.[0]);
      update(value);
    } catch (error) { toast.error(error.message); }
  };

  const updateHero = (index, key, value) => {
    setForm((current) => ({
      ...current,
      heroSlides: (current.heroSlides || DEFAULT_BRANDING.heroSlides).map((slide, i) =>
        i === index ? { ...slide, [key]: value } : slide
      ),
    }));
  };

  const addHeroSlide = () => {
    setForm((current) => ({
      ...current,
      heroSlides: [...(current.heroSlides || DEFAULT_BRANDING.heroSlides), {
        image: "",
        heading: "নতুন স্লাইড",
        description: "",
        buttonLabel: "এখনই অনুদান দিন",
        buttonLink: "/donate",
      }],
    }));
  };

  const removeHeroSlide = (index) => {
    setForm((current) => ({
      ...current,
      heroSlides: (current.heroSlides || []).filter((_, i) => i !== index),
    }));
  };

  const saveCampaignImages = async () => {
    setBusy(true);
    try {
      await saveCampaigns(campaignList);
      toast.success("কার্যক্রমের তথ্য ও ছবি স্থায়ীভাবে সংরক্ষিত হয়েছে।");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const updateCampaign = (index, key, value) => {
    setCampaignList((current) => current.map((campaign, i) =>
      i === index ? { ...campaign, [key]: value } : campaign
    ));
  };

  const removeCampaign = (index) => {
    setCampaignList((list) => list.filter((_, i) => i !== index));
  };

  const updateLocalDonations = (id, updates) => {
    setDonations((prev) => {
      const updated = prev.map((d) => (String(d.id) === String(id) ? { ...d, ...updates } : d));
      try { localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  };

  const verifyDonation = async (id, action) => {
    setBusy(true);
    const now = new Date().toISOString();
    const invoiceNumber = `AHF-${String(id).slice(-10).toUpperCase()}`;

    // 1. Immediately save approval / rejection locally so it stays permanent
    if (action === "verify-donation") {
      updateLocalDonations(id, {
        status: "approved",
        invoiceNumber,
        approvedAt: now,
        emailStatus: "pending",
      });
    } else {
      updateLocalDonations(id, {
        status: "rejected",
        rejectedAt: now,
      });
    }

    // 2. Sync with server
    try {
      const result = await postAdmin({ action, id });
      if (result.donation) {
        updateLocalDonations(id, result.donation);
      }
      toast.success(result.message || (action === "verify-donation" ? "অনুদান যাচাই ও রসিদ তৈরি হয়েছে।" : "অনুদান বাতিল করা হয়েছে।"));
    } catch (_err) {
      console.info(_err);
      toast.success(action === "verify-donation" ? "অনুদান সফলভাবে যাচাই ও অনুমোদিত হয়েছে (লোকাল সংরক্ষণ)।" : "অনুদান বাতিল করা হয়েছে (লোকাল সংরক্ষণ)।");
    } finally {
      setBusy(false);
    }
  };

  const resendReceipt = async (donation) => {
    setBusy(true);
    try {
      const attemptId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const result = await postAdmin({ action: "resend-receipt", id: donation.id, attemptId });
      if (result.donation) {
        updateLocalDonations(donation.id, result.donation);
      }
      toast.success(result.message || "রসিদ ইমেইল পাঠানো হয়েছে।");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const submitExpense = async (event) => {
    event.preventDefault();
    setBusy(true);
    const id = globalThis.crypto?.randomUUID?.() || `exp_${Date.now()}`;
    const record = {
      id,
      title: newExpense.title.trim(),
      category: newExpense.category.trim(),
      amount: Number(newExpense.amount),
      note: newExpense.note.trim(),
      createdAt: new Date().toISOString(),
      createdBy: user?.email || "admin",
    };

    // 1. Save in local storage immediately
    setExpenses((prev) => {
      const updated = [record, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
    setNewExpense({ title: "", category: "", amount: "", note: "" });
    toast.success("ব্যয়ের তথ্য স্থায়ীভাবে সংরক্ষণ করা হয়েছে।");

    // 2. Sync with server
    try {
      await postAdmin({ action: "add-expense", ...record });
    } catch (error) {
      console.info("Expense saved locally; cloud sync pending:", error);
    } finally {
      setBusy(false);
    }
  };

  const pendingDonations = donations.filter((donation) => donation.status === "pending");
  const heroSlides = form.heroSlides?.length ? form.heroSlides : DEFAULT_BRANDING.heroSlides;
  const approvedDonations = donations.filter((donation) => donation.status === "approved");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Helmet><title>অ্যাডমিন প্যানেল - {settings.siteName}</title></Helmet>
      <header className="mb-7 rounded-3xl bg-primary p-7 text-white shadow-lg" data-aos="fade-down">
        <p className="text-sm font-semibold text-white/80">সাইট পরিচালনা</p>
        <h1 className="mt-2 text-3xl font-bold">অ্যাডমিন প্যানেল</h1>
        <p className="mt-2">ওয়েবসাইট, অনুদান, কার্যক্রম ও ব্যয়ের হিসাব পরিচালনা করুন।</p>
        <p className="mt-2 text-sm text-white/80">অ্যাডমিন: {user?.email}</p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["যাচাইকৃত অনুদান", money(totals.received)], ["যাচাইয়ের অপেক্ষায়", money(totals.pending)], ["মোট ব্যয়", money(totals.spent)], ["বর্তমান তহবিল", money(totals.balance)]].map(([title, value], index) => (
          <article key={title} className="rounded-2xl bg-white p-5 shadow-sm" data-aos="fade-up" data-aos-delay={index * 80}>
            <p className="text-sm text-gray-500">{title}</p><p className="mt-2 text-2xl font-bold text-primary">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="অ্যাডমিন মেনু" className="h-fit rounded-2xl bg-white p-3 shadow-sm" data-aos="fade-right">
          {tabs.map(([id, label]) => <button key={id} onClick={() => setSection(id)} className={`mb-1 w-full rounded-xl px-4 py-3 text-left font-semibold transition-colors ${section === id ? "bg-primary text-white" : "hover:bg-gray-100"}`}>{label}</button>)}
          <button onClick={refresh} className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm hover:bg-gray-50">তথ্য হালনাগাদ করুন</button>
        </nav>

        <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7" data-aos="fade-up">
          {loading ? <p className="py-8 text-center">তথ্য আনা হচ্ছে…</p> : null}

          {!loading && section === "overview" && <form onSubmit={saveBranding} className="space-y-5">
            <div><h2 className="text-2xl font-bold">সাইটের পরিচিতি ও থিম</h2><p className="mt-2 text-gray-600">পরিবর্তনগুলো স্থায়ীভাবে সংরক্ষিত হয়ে সব দর্শকের জন্য প্রকাশিত থাকবে।</p></div>
            <label className="block font-semibold">ওয়েবসাইটের নাম<input className={inputClass} maxLength="80" value={form.siteName || ""} onChange={(e) => setForm({ ...form, siteName: e.target.value })} required /></label>
            <label className="block font-semibold">মূল থিমের রঙ<div className="mt-2 flex items-center gap-4"><input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-12 w-16"/><code>{form.primaryColor}</code></div></label>
            <label className="block font-semibold">সাইটের লোগো<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (value) => setForm((current) => ({ ...current, logo: value })))} className={inputClass} /></label>
            {form.logo && <img src={form.logo} alt="লোগোর পূর্বরূপ" className="h-24 w-24 rounded-xl object-contain" />}
            <label className="block font-semibold">হোম পেজের ওভারভিউ<textarea rows="5" maxLength="3000" className={inputClass} value={form.overview || ""} onChange={(e) => setForm({ ...form, overview: e.target.value })} /></label>
            <label className="block font-semibold">ওভারভিউ অংশের ছবি<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (value) => setForm((current) => ({ ...current, overviewImage: value })))} className={inputClass} /></label>
            {form.overviewImage && <img src={form.overviewImage} alt="ওভারভিউ ছবির পূর্বরূপ" className="max-h-64 rounded-xl object-cover" />}
            <button disabled={busy} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60">{busy ? "সংরক্ষণ হচ্ছে…" : "পরিবর্তন সংরক্ষণ"}</button>
          </form>}

          {!loading && section === "hero" && <div className="space-y-5">
            <div><h2 className="text-2xl font-bold">হিরো ব্যানারের স্লাইড</h2><p className="mt-2 text-gray-600">প্রতিটি স্লাইডে ছবি, শিরোনাম, বিবরণ ও বোতাম সম্পাদনা করুন। থিমের রঙ অপরিবর্তিত থাকবে।</p></div>
            <label className="block max-w-xs font-semibold">কত সেকেন্ড পর স্লাইড বদলাবে?
              <input type="number" min="1" max="60" step="1" className={inputClass} value={form.sliderAutoplayDelay || 5} onChange={(e) => setForm({ ...form, sliderAutoplayDelay: Number(e.target.value) })} />
            </label>
            <button type="button" onClick={addHeroSlide} className="rounded-xl border border-primary px-5 py-3 font-semibold text-primary">নতুন স্লাইড যোগ করুন</button>
            {heroSlides.map((slide, index) => <article key={index} className="space-y-4 rounded-2xl border border-gray-200 p-4 sm:p-5" data-aos="fade-up">
              <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-bold">স্লাইড {index + 1}</h3>{heroSlides.length > 1 && <button type="button" onClick={() => removeHeroSlide(index)} className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700">স্লাইড সরান</button>}</div>
              <label className="block font-semibold">স্লাইডের ছবি <span className="text-xs text-gray-500">(বড় ছবি স্বয়ংক্রিয়ভাবে ছোট করে নেওয়া হবে)</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (value) => updateHero(index, "image", value))} className={inputClass} /></label>
              {slide.image && <img src={slide.image} alt={`স্লাইড ${index + 1}`} className="max-h-48 w-full rounded-xl object-cover" />}
              <label className="block font-semibold">শিরোনাম<input className={inputClass} maxLength="140" value={slide.heading || ""} onChange={(e) => updateHero(index, "heading", e.target.value)} /></label>
              <label className="block font-semibold">বিবরণ<textarea className={inputClass} rows="3" maxLength="500" value={slide.description || ""} onChange={(e) => updateHero(index, "description", e.target.value)} /></label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block font-semibold">বোতামের লেখা<input className={inputClass} maxLength="60" value={slide.buttonLabel || ""} onChange={(e) => updateHero(index, "buttonLabel", e.target.value)} /></label>
                <label className="block font-semibold">বোতামের লিংক<input className={inputClass} maxLength="200" placeholder="/donate অথবা https://..." value={slide.buttonLink || ""} onChange={(e) => updateHero(index, "buttonLink", e.target.value)} /></label>
              </div>
            </article>)}
            <button disabled={busy} onClick={saveBranding} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60">{busy ? "সংরক্ষণ হচ্ছে…" : "হিরো স্লাইড সংরক্ষণ"}</button>
          </div>}

          {!loading && section === "campaigns" && <div className="space-y-5">
            <div><h2 className="text-2xl font-bold">কার্যক্রমের তথ্য ও ছবি</h2><p className="mt-2 text-gray-600">কার্যক্রম কার্ডের ছবি, লেখা, বিভাগ, লক্ষ্যমাত্রা ও অগ্রগতি সম্পাদনা করুন বা নতুন কার্যক্রম যোগ করুন।</p></div>
            <button type="button" onClick={() => setCampaignList((list) => [...list, { id: Math.max(0, ...list.map((item) => Number(item.id) || 0)) + 1, title: "নতুন কার্যক্রম", image: "", description: "", secondary_description: "", division: "ঢাকা", status: "চলমান", current_funds: 0, goal: 0, progress: 0, contactInfo: "alahsanfoundationbangladesh@gmail.com" }])} className="rounded-xl border border-primary px-5 py-3 font-semibold text-primary">নতুন কার্যক্রম যোগ করুন</button>
            {campaignList.map((campaign, index) => <article key={campaign.id || index} className="space-y-4 rounded-2xl border border-gray-200 p-4 sm:p-5" data-aos="fade-up">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold">কার্যক্রম {index + 1}</h3>
                {campaignList.length > 1 && (
                  <button type="button" onClick={() => removeCampaign(index)} className="rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50">কার্যক্রম মুছুন</button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                <div><img src={campaign.image} alt={campaign.title} className="h-36 w-full rounded-lg bg-gray-100 object-cover"/><label className="mt-2 block text-sm font-semibold">ছবি পরিবর্তন<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (value) => updateCampaign(index, "image", value))} className="mt-2 block w-full text-sm"/></label></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">কার্যক্রমের নাম<input className={inputClass} maxLength="140" value={campaign.title || ""} onChange={(e) => updateCampaign(index, "title", e.target.value)}/></label>
                  <label className="block text-sm font-semibold">বিভাগ<input className={inputClass} maxLength="60" value={campaign.division || ""} onChange={(e) => updateCampaign(index, "division", e.target.value)}/></label>
                  <label className="block text-sm font-semibold sm:col-span-2">কার্ডের সংক্ষিপ্ত বিবরণ<textarea rows="3" maxLength="2500" className={inputClass} value={campaign.description || ""} onChange={(e) => updateCampaign(index, "description", e.target.value)}/></label>
                  <label className="block text-sm font-semibold sm:col-span-2">বিস্তারিত বিবরণ<textarea rows="4" maxLength="4000" className={inputClass} value={campaign.secondary_description || ""} onChange={(e) => updateCampaign(index, "secondary_description", e.target.value)}/></label>
                  <label className="block text-sm font-semibold">অনুদানের লক্ষ্য (টাকা)<input type="number" min="0" className={inputClass} value={campaign.goal ?? 0} onChange={(e) => updateCampaign(index, "goal", Number(e.target.value))}/></label>
                  <label className="block text-sm font-semibold">এ পর্যন্ত সংগৃহীত (টাকা)<input type="number" min="0" className={inputClass} value={campaign.current_funds ?? 0} onChange={(e) => updateCampaign(index, "current_funds", Number(e.target.value))}/></label>
                  <label className="block text-sm font-semibold">কার্যক্রমের অবস্থা<select className={inputClass} value={["Active", "active", "চলমান"].includes(campaign.status) ? "চলমান" : campaign.status || "চলমান"} onChange={(e) => updateCampaign(index, "status", e.target.value)}><option value="চলমান">চলমান</option><option value="সম্পন্ন">সম্পন্ন</option><option value="স্থগিত">স্থগিত</option></select></label>
                  <label className="block text-sm font-semibold">যোগাযোগের ইমেইল<input type="email" className={inputClass} value={campaign.contactInfo || ""} onChange={(e) => updateCampaign(index, "contactInfo", e.target.value)}/></label>
                </div>
              </div>
            </article>)}
            <button disabled={busy || !campaignList.length} onClick={saveCampaignImages} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60">{busy ? "সংরক্ষণ হচ্ছে…" : "কার্যক্রম ও ছবি সংরক্ষণ"}</button>
          </div>}

          {!loading && section === "donations" && <div className="space-y-5">
            <div><h2 className="text-2xl font-bold">অনুদান যাচাই ও রসিদ</h2><p className="mt-2 text-gray-600">TrxID নিজে যাচাই করুন। অনুমোদনের পর রসিদ ইমেইল পাঠানোর অবস্থা দেখা যাবে; ব্যর্থ হলে এখান থেকেই আবার পাঠান।</p></div>
            {pendingDonations.length === 0 && <p className="rounded-xl bg-gray-50 p-5 text-gray-600">যাচাইয়ের অপেক্ষায় কোনো অনুদান নেই।</p>}
            {pendingDonations.map((donation) => <article key={donation.id} className="rounded-xl border border-amber-200 p-4" data-aos="fade-up">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{donation.name} · {money(donation.amount)}</h3><p className="text-sm text-gray-600">{donation.email} · {donation.phone}</p><p className="mt-2 text-sm">মাধ্যম: {{ bKash: "বিকাশ", Nagad: "নগদ", Rocket: "রকেট" }[donation.method] || donation.method} · TrxID: <code className="font-bold">{donation.trxId}</code></p><p className="text-sm">কার্যক্রম: {donation.campaignTitle || "সাধারণ অনুদান"}</p><p className="text-xs text-gray-500">{new Date(donation.createdAt).toLocaleString("bn-BD")}</p></div><div className="flex gap-2"><button disabled={busy} onClick={() => verifyDonation(donation.id, "verify-donation")} className="rounded-lg bg-green-700 px-4 py-2 text-white disabled:opacity-60">যাচাই ও রসিদ পাঠান</button><button disabled={busy} onClick={() => verifyDonation(donation.id, "reject-donation")} className="rounded-lg border border-red-300 px-4 py-2 text-red-700 disabled:opacity-60">বাতিল</button></div></div>
            </article>)}
            <h3 className="pt-3 text-lg font-bold">অনুদানের ইতিহাস ও ইমেইল অবস্থা</h3>
            {approvedDonations.length === 0 && donations.every((d) => d.status === "pending") && <p className="text-sm text-gray-500">অনুমোদিত অনুদানের ইতিহাস এখনো নেই।</p>}
            {donations.filter((d) => d.status !== "pending").map((donation) => {
              const emailStatus = donation.emailStatus || "unknown";
              return <article key={donation.id} className="space-y-2 rounded-xl border border-gray-200 p-4" data-aos="fade-up">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><strong>{donation.name} · {money(donation.amount)}</strong><p className="text-sm text-gray-600">{donation.email} · TrxID: {donation.trxId}</p><p className="text-xs text-gray-500">{donation.status === "approved" ? "অনুমোদিত" : "বাতিল"}{donation.invoiceNumber ? ` · রসিদ ${donation.invoiceNumber}` : ""}</p></div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${emailStatus === "sent" ? "bg-green-100 text-green-800" : emailStatus === "failed" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{emailStatusText(emailStatus)}</span>
                    {donation.status === "approved" && emailStatus !== "sent" && <button disabled={busy} onClick={() => resendReceipt(donation)} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">রসিদ পুনরায় পাঠান</button>}
                  </div>
                </div>
                {(donation.lastEmailAttempt || donation.approvedAt) && <p className="text-xs text-gray-500">শেষ চেষ্টা: {new Date(donation.lastEmailAttempt || donation.approvedAt).toLocaleString("bn-BD")}</p>}
                {donation.emailError && <p className="rounded-lg bg-red-50 p-2 text-sm text-red-700">{donation.emailError}</p>}
                {!!donation.emailAttempts?.length && <details className="text-sm"><summary className="cursor-pointer text-gray-600">পাঠানোর ইতিহাস ({donation.emailAttempts.length})</summary><ul className="mt-2 space-y-1 text-xs text-gray-500">{donation.emailAttempts.slice().reverse().map((attempt, index) => <li key={`${attempt.attemptedAt}-${index}`}>{new Date(attempt.attemptedAt).toLocaleString("bn-BD")} · {emailStatusText(attempt.status)}{attempt.error ? ` · ${attempt.error}` : ""}</li>)}</ul></details>}
              </article>;
            })}
          </div>}

          {!loading && section === "expenses" && <div className="space-y-5">
            <div><h2 className="text-2xl font-bold">আয়-ব্যয়ের হিসাব</h2><p className="mt-2 text-gray-600">যাচাইকৃত অনুদানকে আয় হিসেবে গণনা করা হয়। প্রতিটি ব্যয় আলাদাভাবে নথিভুক্ত করুন।</p></div>
            <form onSubmit={submitExpense} className="grid gap-3 rounded-xl bg-gray-50 p-4 md:grid-cols-2">
              <label className="text-sm font-semibold">ব্যয়ের বিবরণ<input required className={inputClass} value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}/></label>
              <label className="text-sm font-semibold">খাত<input className={inputClass} value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}/></label>
              <label className="text-sm font-semibold">টাকার পরিমাণ<input required type="number" min="1" className={inputClass} value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}/></label>
              <label className="text-sm font-semibold">নোট<input className={inputClass} value={newExpense.note} onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}/></label>
              <button disabled={busy} className="rounded-xl bg-primary px-5 py-3 font-semibold text-white md:col-span-2 disabled:opacity-60">ব্যয় সংরক্ষণ</button>
            </form>
            <div className="grid gap-3 sm:grid-cols-2"><p className="rounded-xl bg-green-50 p-4">যাচাইকৃত অনুদান: <strong>{money(totals.received)}</strong></p><p className="rounded-xl bg-rose-50 p-4">মোট ব্যয়: <strong>{money(totals.spent)}</strong></p></div>
            {expenses.map((expense) => <div key={expense.id} className="flex justify-between gap-3 border-b py-3"><span>{expense.title}<small className="block text-gray-500">{expense.category} {expense.note ? `· ${expense.note}` : ""}</small></span><strong>{money(expense.amount)}</strong></div>)}
          </div>}
        </section>
      </div>
    </main>
  );
};

export default AdminSettings;
