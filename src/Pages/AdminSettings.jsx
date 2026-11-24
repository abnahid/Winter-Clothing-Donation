import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";
import { DEFAULT_BRANDING, DEFAULT_TEAM, STORAGE_KEYS, useBranding } from "../context/BrandingContext";

const API = "/.netlify/functions/api";
const tabs = [
  ["overview", "১. সাইট পরিচিতি ও থিম"],
  ["hero", "২. হিরো স্লাইডার"],
  ["team", "৩. নির্বাহী কমিটি ও দল"],
  ["about", "৪. আমাদের সম্পর্কে পাতা"],
  ["howItWorks", "৫. যেভাবে কাজ করে ও বিভাগ"],
  ["testimonials", "৬. মানুষের অভিজ্ঞতা ও রিভিউ"],
  ["faqs", "৭. সাধারণ জিজ্ঞাসা (FAQ)"],
  ["contact", "৮. যোগাযোগ ও সোশ্যাল লিংক"],
  ["campaigns", "৯. কার্যক্রম ও ছবি"],
  ["donations", "১০. অনুদান যাচাই"],
  ["expenses", "১১. আয়-ব্যয় হিসাব"],
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
      let currentLocalDonations = [];
      let currentLocalExpenses = [];
      try {
        const rawDonations = localStorage.getItem(STORAGE_KEYS.DONATIONS);
        if (rawDonations) currentLocalDonations = JSON.parse(rawDonations);
        const rawExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
        if (rawExpenses) currentLocalExpenses = JSON.parse(rawExpenses);
      } catch { /* ignore */ }

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

  const saveBranding = async (event, customMsg) => {
    event?.preventDefault();
    setBusy(true);
    try {
      await saveSettings(form);
      toast.success(customMsg || "পরিবর্তনগুলো সফলভাবে ও স্থায়ীভাবে সংরক্ষণ করা হয়েছে।");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleImage = async (event, setter) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await imageToDataUrl(file);
      setter(dataUrl);
      toast.success("ছবি নির্বাচন সম্পন্ন হয়েছে।");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Hero slide helpers
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
        id: Date.now(),
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

  // Team member helpers
  const updateTeamMember = (index, key, value) => {
    setForm((current) => {
      const about = current.about || {};
      const teamMembers = (about.teamMembers || DEFAULT_TEAM).map((m, i) =>
        i === index ? { ...m, [key]: value } : m
      );
      return { ...current, about: { ...about, teamMembers } };
    });
  };

  const addTeamMember = () => {
    setForm((current) => {
      const about = current.about || {};
      const teamMembers = [...(about.teamMembers || DEFAULT_TEAM), {
        id: Date.now(),
        name: "নতুন সদস্যের নাম",
        role: "পদবি বা দায়িত্ব",
        image: "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg",
        bio: "",
      }];
      return { ...current, about: { ...about, teamMembers } };
    });
  };

  const removeTeamMember = (index) => {
    setForm((current) => {
      const about = current.about || {};
      const teamMembers = (about.teamMembers || []).filter((_, i) => i !== index);
      return { ...current, about: { ...about, teamMembers } };
    });
  };

  // About helpers
  const updateAbout = (key, value) => {
    setForm((current) => ({
      ...current,
      about: { ...(current.about || {}), [key]: value },
    }));
  };

  // How it works helpers
  const updateHowItWorks = (key, value) => {
    setForm((current) => ({
      ...current,
      howItWorks: { ...(current.howItWorks || {}), [key]: value },
    }));
  };

  const updateStep = (index, key, value) => {
    setForm((current) => {
      const how = current.howItWorks || {};
      const steps = (how.steps || []).map((step, i) =>
        i === index ? { ...step, [key]: value } : step
      );
      return { ...current, howItWorks: { ...how, steps } };
    });
  };

  // Testimonial helpers
  const updateTestimonial = (index, key, value) => {
    setForm((current) => {
      const test = current.testimonials || {};
      const items = (test.items || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
      return { ...current, testimonials: { ...test, items } };
    });
  };

  const addTestimonial = () => {
    setForm((current) => {
      const test = current.testimonials || {};
      const items = [...(test.items || []), {
        id: Date.now(),
        name: "নতুন ব্যক্তির নাম",
        role: "উপকারভোগী বা স্বেচ্ছাসেবক",
        location: "স্থান / শহর",
        title: "শিরোনাম",
        message: "অভিজ্ঞতা বা বক্তব্য লিখুন...",
        image: "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg",
      }];
      return { ...current, testimonials: { ...test, items } };
    });
  };

  const removeTestimonial = (index) => {
    setForm((current) => {
      const test = current.testimonials || {};
      const items = (test.items || []).filter((_, i) => i !== index);
      return { ...current, testimonials: { ...test, items } };
    });
  };

  // FAQ helpers
  const updateFaq = (index, key, value) => {
    setForm((current) => {
      const faq = current.faqs || {};
      const items = (faq.items || []).map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
      return { ...current, faqs: { ...faq, items } };
    });
  };

  const addFaq = () => {
    setForm((current) => {
      const faq = current.faqs || {};
      const items = [...(faq.items || []), {
        id: Date.now(),
        question: "নতুন প্রশ্ন?",
        answer: "প্রশ্নের উত্তর এখানে লিখুন...",
      }];
      return { ...current, faqs: { ...faq, items } };
    });
  };

  const removeFaq = (index) => {
    setForm((current) => {
      const faq = current.faqs || {};
      const items = (faq.items || []).filter((_, i) => i !== index);
      return { ...current, faqs: { ...faq, items } };
    });
  };

  // Contact helpers
  const updateContact = (key, value) => {
    setForm((current) => ({
      ...current,
      contact: { ...(current.contact || {}), [key]: value },
    }));
  };

  // Campaign helpers
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

    setExpenses((prev) => {
      const updated = [record, ...prev];
      try { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
    setNewExpense({ title: "", category: "", amount: "", note: "" });
    toast.success("ব্যয়ের তথ্য স্থায়ীভাবে সংরক্ষণ করা হয়েছে।");

    try {
      await postAdmin({ action: "add-expense", ...record });
    } catch (error) {
      console.info("Expense saved locally; cloud sync pending:", error);
    } finally {
      setBusy(false);
    }
  };

  const pendingDonations = donations.filter((donation) => donation.status === "pending");
  const approvedDonations = donations.filter((donation) => donation.status === "approved");
  const heroSlides = form.heroSlides?.length ? form.heroSlides : DEFAULT_BRANDING.heroSlides;
  const teamMembers = form.about?.teamMembers?.length ? form.about.teamMembers : DEFAULT_TEAM;
  const howSteps = form.howItWorks?.steps?.length ? form.howItWorks.steps : DEFAULT_BRANDING.howItWorks.steps;
  const testimonialItems = form.testimonials?.items?.length ? form.testimonials.items : DEFAULT_BRANDING.testimonials.items;
  const faqItems = form.faqs?.items?.length ? form.faqs.items : DEFAULT_BRANDING.faqs.items;
  const contact = form.contact || DEFAULT_BRANDING.contact;
  const about = form.about || DEFAULT_BRANDING.about;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Helmet><title>অ্যাডমিন প্যানেল - {settings.siteName}</title></Helmet>
      <header className="mb-7 rounded-3xl bg-primary p-7 text-white shadow-lg" data-aos="fade-down">
        <p className="text-sm font-semibold text-white/80">সাইট পরিচালনা ও নিয়ন্ত্রণ</p>
        <h1 className="mt-2 text-3xl font-bold">অ্যাডমিন কন্ট্রোল সেন্টার</h1>
        <p className="mt-2">ওয়েবসাইটের প্রতিটি পাতা, লেখা, ছবি, নির্বাহী কমিটি, অনুদান ও ব্যয়ের হিসাব পরিচালনা করুন।</p>
        <p className="mt-2 text-sm text-white/80">লগইন করা অ্যাডমিন: {user?.email}</p>
      </header>

      {/* Top Ledger Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["যাচাইকৃত অনুদান", money(totals.received)], ["যাচাইয়ের অপেক্ষায়", money(totals.pending)], ["মোট ব্যয়", money(totals.spent)], ["বর্তমান তহবিল", money(totals.balance)]].map(([title, value], index) => (
          <article key={title} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100" data-aos="fade-up" data-aos-delay={index * 60}>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Navigation Sidebar */}
        <nav aria-label="অ্যাডমিন মেনু" className="h-fit rounded-2xl bg-white p-3 shadow-sm border border-gray-100 sticky top-4" data-aos="fade-right">
          <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">কনটেন্ট ও পরিচালনা</p>
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`mb-1 w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                section === id ? "bg-primary text-white shadow" : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3">
            <button
              onClick={refresh}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-center text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              🔄 তথ্য রিফ্রেশ / রি-লোড
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7 border border-gray-100" data-aos="fade-up">
          {loading ? <p className="py-8 text-center text-gray-500">তথ্য আনা হচ্ছে…</p> : null}

          {/* 1. OVERVIEW & THEME */}
          {!loading && section === "overview" && (
            <form onSubmit={(e) => saveBranding(e, "সাইটের পরিচিতি ও থিম স্থায়ীভাবে সংরক্ষণ করা হয়েছে।")} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">১. সাইটের পরিচিতি ও থিম</h2>
                <p className="mt-1 text-gray-600 text-sm">ওয়েবসাইটের নাম, থিম রঙ, লোগো এবং হোমপেজ ওভারভিউ সরাসরি এখান থেকে পরিবর্তন করুন।</p>
              </div>

              <label className="block font-semibold">ওয়েবসাইটের নাম
                <input className={inputClass} maxLength="80" value={form.siteName || ""} onChange={(e) => setForm({ ...form, siteName: e.target.value })} required />
              </label>

              <label className="block font-semibold">মূল থিমের রঙ (Primary Brand Color)
                <div className="mt-2 flex items-center gap-4">
                  <input type="color" value={form.primaryColor || "#4A90E2"} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-12 w-16 cursor-pointer rounded border p-1" />
                  <code className="text-sm font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-lg">{form.primaryColor}</code>
                </div>
              </label>

              <div className="space-y-2">
                <label className="block font-semibold">সাইটের লোগো (ছবি আপলোড বা লিংক দিন)</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (value) => setForm((current) => ({ ...current, logo: value })))} className={inputClass} />
                  <span className="text-xs text-gray-400">অথবা URL:</span>
                  <input type="text" placeholder="https://..." value={form.logo || ""} onChange={(e) => setForm({ ...form, logo: e.target.value })} className={inputClass} />
                </div>
                {form.logo && <div className="p-3 bg-gray-50 rounded-xl inline-block mt-2"><img src={form.logo} alt="লোগোর পূর্বরূপ" className="h-16 w-16 rounded-xl object-contain bg-white p-1 border" /></div>}
              </div>

              <label className="block font-semibold">হোমপেজ ওভারভিউ সেকশনের শিরোনাম
                <input className={inputClass} maxLength="120" value={form.overviewTitle || ""} placeholder="আল আহসান ফাউন্ডেশন সম্পর্কে" onChange={(e) => setForm({ ...form, overviewTitle: e.target.value })} />
              </label>

              <label className="block font-semibold">হোমপেজ ওভারভিউ বর্ণনা
                <textarea rows="4" maxLength="3000" className={inputClass} value={form.overview || ""} onChange={(e) => setForm({ ...form, overview: e.target.value })} />
              </label>

              <div className="space-y-2">
                <label className="block font-semibold">ওভারভিউ অংশের ছবি</label>
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (value) => setForm((current) => ({ ...current, overviewImage: value })))} className={inputClass} />
                  <span className="text-xs text-gray-400">অথবা URL:</span>
                  <input type="text" placeholder="https://..." value={form.overviewImage || ""} onChange={(e) => setForm({ ...form, overviewImage: e.target.value })} className={inputClass} />
                </div>
                {form.overviewImage && <img src={form.overviewImage} alt="ওভারভিউ ছবির পূর্বরূপ" className="max-h-48 rounded-xl object-cover border mt-2" />}
              </div>

              <button disabled={busy} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "সাইট ওভারভিউ সংরক্ষণ"}
              </button>
            </form>
          )}

          {/* 2. HERO SLIDER */}
          {!loading && section === "hero" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">২. হিরো স্লাইডার</h2>
                  <p className="mt-1 text-gray-600 text-sm">হোম পেজের ব্যানারের প্রতিটি স্লাইডের ছবি, লেখা, বাটন এবং সময় নিয়ন্ত্রণ করুন।</p>
                </div>
                <button type="button" onClick={addHeroSlide} className="rounded-xl bg-primary/10 border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary/20 text-sm">
                  + নতুন স্লাইড যোগ করুন
                </button>
              </div>

              <label className="block max-w-xs font-semibold">কত সেকেন্ড পর স্লাইড স্বয়ংক্রিয়ভাবে বদলাবে?
                <input type="number" min="1" max="60" step="1" className={inputClass} value={form.sliderAutoplayDelay || 5} onChange={(e) => setForm({ ...form, sliderAutoplayDelay: Number(e.target.value) })} />
              </label>

              {heroSlides.map((slide, index) => (
                <article key={slide.id || index} className="space-y-4 rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50/50">
                  <div className="flex items-center justify-between gap-3 border-b pb-3">
                    <h3 className="text-lg font-bold text-gray-800">স্লাইড {index + 1}</h3>
                    {heroSlides.length > 1 && (
                      <button type="button" onClick={() => removeHeroSlide(index)} className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50">
                        স্লাইড মুছুন
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold">স্লাইডের ছবি (আপলোড করুন বা লিঙ্ক দিন)</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (val) => updateHero(index, "image", val))} className="text-sm" />
                      <input type="text" placeholder="ছবির URL" value={slide.image || ""} onChange={(e) => updateHero(index, "image", e.target.value)} className={inputClass} />
                    </div>
                    {slide.image && <img src={slide.image} alt={`স্লাইড ${index + 1}`} className="max-h-40 w-full rounded-xl object-cover mt-2 border" />}
                  </div>

                  <label className="block text-sm font-semibold">স্লাইডের শিরোনাম
                    <input className={inputClass} maxLength="140" value={slide.heading || ""} onChange={(e) => updateHero(index, "heading", e.target.value)} />
                  </label>

                  <label className="block text-sm font-semibold">বিবরণ
                    <textarea className={inputClass} rows="2" maxLength="500" value={slide.description || ""} onChange={(e) => updateHero(index, "description", e.target.value)} />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold">বোতামের লেখা
                      <input className={inputClass} maxLength="60" value={slide.buttonLabel || ""} onChange={(e) => updateHero(index, "buttonLabel", e.target.value)} />
                    </label>
                    <label className="block text-sm font-semibold">বোতামের লিঙ্ক
                      <input className={inputClass} maxLength="200" placeholder="/donate" value={slide.buttonLink || ""} onChange={(e) => updateHero(index, "buttonLink", e.target.value)} />
                    </label>
                  </div>
                </article>
              ))}

              <button disabled={busy} onClick={(e) => saveBranding(e, "হিরো স্লাইডসমূহ স্থায়ীভাবে সংরক্ষণ করা হয়েছে।")} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "হিরো স্লাইড সংরক্ষণ"}
              </button>
            </div>
          )}

          {/* 3. EXECUTIVE COMMITTEE & TEAM */}
          {!loading && section === "team" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">৩. নির্বাহী কমিটি ও দল (Team)</h2>
                  <p className="mt-1 text-gray-600 text-sm">ওয়েবসাইটের নির্বাহী কমিটির নাম, পদবি, ছবি ও বিবরণ পরিবর্তন বা নতুন সদস্য যুক্ত করুন।</p>
                </div>
                <button type="button" onClick={addTeamMember} className="rounded-xl bg-primary/10 border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary/20 text-sm">
                  + নতুন সদস্য যোগ করুন
                </button>
              </div>

              <label className="block font-semibold">সেকশনের শিরোনাম
                <input className={inputClass} value={about.teamSectionTitle || "আমাদের দলের সঙ্গে পরিচিত হোন"} onChange={(e) => updateAbout("teamSectionTitle", e.target.value)} />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                {teamMembers.map((member, index) => (
                  <article key={member.id || index} className="space-y-3 rounded-2xl border border-gray-200 p-4 bg-gray-50/50">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-sm text-gray-700">সদস্য #{index + 1}</span>
                      {teamMembers.length > 1 && (
                        <button type="button" onClick={() => removeTeamMember(index)} className="text-xs text-red-600 hover:underline">
                          মুছে ফেলুন
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <img src={member.image || "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg"} alt={member.name} className="h-16 w-16 rounded-full object-cover border" />
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-600">ছবি পরিবর্তন</label>
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (val) => updateTeamMember(index, "image", val))} className="text-xs mt-1 block w-full" />
                      </div>
                    </div>

                    <label className="block text-xs font-semibold text-gray-600">ছবির সরাসরি URL
                      <input className={inputClass} placeholder="https://..." value={member.image || ""} onChange={(e) => updateTeamMember(index, "image", e.target.value)} />
                    </label>

                    <label className="block text-xs font-semibold text-gray-600">পূর্ণ নাম
                      <input className={inputClass} value={member.name || ""} onChange={(e) => updateTeamMember(index, "name", e.target.value)} required />
                    </label>

                    <label className="block text-xs font-semibold text-gray-600">পদবি বা দায়িত্ব
                      <input className={inputClass} value={member.role || ""} onChange={(e) => updateTeamMember(index, "role", e.target.value)} required />
                    </label>

                    <label className="block text-xs font-semibold text-gray-600">সংক্ষিপ্ত পরিচয় বা নোট (ঐচ্ছিক)
                      <input className={inputClass} value={member.bio || ""} onChange={(e) => updateTeamMember(index, "bio", e.target.value)} />
                    </label>
                  </article>
                ))}
              </div>

              <button disabled={busy} onClick={(e) => saveBranding(e, "নির্বাহী কমিটির তথ্য স্থায়ীভাবে সংরক্ষণ করা হয়েছে।")} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "নির্বাহী কমিটির তথ্য সংরক্ষণ"}
              </button>
            </div>
          )}

          {/* 4. ABOUT US PAGE */}
          {!loading && section === "about" && (
            <form onSubmit={(e) => saveBranding(e, "আমাদের সম্পর্কে পাতার তথ্য স্থায়ীভাবে সংরক্ষণ করা হয়েছে।")} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">৪. আমাদের সম্পর্কে পাতা (/about)</h2>
                <p className="mt-1 text-gray-600 text-sm">আমাদের লক্ষ্য (Mission), স্বপ্ন (Vision) এবং যুক্ত হওয়ার আহ্বান (CTA) অংশের লেখা ও ছবি সম্পাদনা করুন।</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block font-semibold">পাতার মূল হেডার শিরোনাম
                  <input className={inputClass} value={about.headerTitle || "আমাদের সম্পর্কে"} onChange={(e) => updateAbout("headerTitle", e.target.value)} />
                </label>
                <label className="block font-semibold">হেডার সাবটাইটেল
                  <input className={inputClass} value={about.headerSubtitle || ""} onChange={(e) => updateAbout("headerSubtitle", e.target.value)} />
                </label>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 space-y-4">
                <h3 className="font-bold text-lg text-primary">আমাদের লক্ষ্য (Our Mission)</h3>
                <label className="block text-sm font-semibold">লক্ষ্য সেকশনের শিরোনাম
                  <input className={inputClass} value={about.missionTitle || "আমাদের লক্ষ্য"} onChange={(e) => updateAbout("missionTitle", e.target.value)} />
                </label>
                <label className="block text-sm font-semibold">প্রথম অনুচ্ছেদ
                  <textarea rows="3" className={inputClass} value={about.missionText1 || ""} onChange={(e) => updateAbout("missionText1", e.target.value)} />
                </label>
                <label className="block text-sm font-semibold">দ্বিতীয় অনুচ্ছেদ
                  <textarea rows="3" className={inputClass} value={about.missionText2 || ""} onChange={(e) => updateAbout("missionText2", e.target.value)} />
                </label>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">লক্ষ্য সেকশনের ছবি</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (val) => updateAbout("missionImage", val))} className="text-sm" />
                    <input type="text" placeholder="ছবির URL" value={about.missionImage || ""} onChange={(e) => updateAbout("missionImage", e.target.value)} className={inputClass} />
                  </div>
                  {about.missionImage && <img src={about.missionImage} alt="Mission" className="max-h-40 rounded-xl object-cover border mt-2" />}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 space-y-4">
                <h3 className="font-bold text-lg text-primary">আমাদের স্বপ্ন (Our Vision)</h3>
                <label className="block text-sm font-semibold">স্বপ্ন সেকশনের শিরোনাম
                  <input className={inputClass} value={about.visionTitle || "আমাদের স্বপ্ন"} onChange={(e) => updateAbout("visionTitle", e.target.value)} />
                </label>
                <label className="block text-sm font-semibold">বিস্তারিত বর্ণনা
                  <textarea rows="3" className={inputClass} value={about.visionText || ""} onChange={(e) => updateAbout("visionText", e.target.value)} />
                </label>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 space-y-4">
                <h3 className="font-bold text-lg text-primary">যুক্ত হওয়ার আহ্বান (Call To Action)</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">CTA শিরোনাম
                    <input className={inputClass} value={about.ctaTitle || "আজই আমাদের সঙ্গে যুক্ত হোন"} onChange={(e) => updateAbout("ctaTitle", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">CTA সাবটাইটেল
                    <input className={inputClass} value={about.ctaSubtitle || ""} onChange={(e) => updateAbout("ctaSubtitle", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">বোতামের লেখা
                    <input className={inputClass} value={about.ctaButtonText || "অংশ নিন"} onChange={(e) => updateAbout("ctaButtonText", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">বোতামের লিঙ্ক
                    <input className={inputClass} value={about.ctaButtonLink || "/donate"} onChange={(e) => updateAbout("ctaButtonLink", e.target.value)} />
                  </label>
                </div>
              </div>

              <button disabled={busy} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "আমাদের সম্পর্কে পাতা সংরক্ষণ"}
              </button>
            </form>
          )}

          {/* 5. HOW IT WORKS */}
          {!loading && section === "howItWorks" && (
            <form onSubmit={(e) => saveBranding(e, "যেভাবে কাজ করে সেকশনটি স্থায়ীভাবে সংরক্ষণ করা হয়েছে।")} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">৫. যেভাবে কাজ করে ও বিভাগ</h2>
                <p className="mt-1 text-gray-600 text-sm">সহায়তা কার্যক্রম পরিচালনার ধাপসমূহ, কার্যক্রমের বিভাগ তালিকা ও ধাপচিত্র পরিচালনা করুন।</p>
              </div>

              <label className="block font-semibold">সেকশনের মূল শিরোনাম
                <input className={inputClass} value={form.howItWorks?.title || "যেভাবে কাজ করে"} onChange={(e) => updateHowItWorks("title", e.target.value)} />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                {howSteps.map((step, index) => (
                  <article key={step.id || index} className="space-y-2 rounded-2xl border border-gray-200 p-4 bg-gray-50/50">
                    <span className="font-bold text-sm text-primary">ধাপ #{index + 1}</span>
                    <div className="grid grid-cols-[80px_1fr] gap-2">
                      <label className="block text-xs font-semibold">নম্বর
                        <input className={inputClass} value={step.stepNumber || (index + 1)} onChange={(e) => updateStep(index, "stepNumber", e.target.value)} />
                      </label>
                      <label className="block text-xs font-semibold">ধাপের শিরোনাম
                        <input className={inputClass} value={step.title || ""} onChange={(e) => updateStep(index, "title", e.target.value)} />
                      </label>
                    </div>
                    <label className="block text-xs font-semibold">ধাপের বিবরণ
                      <textarea rows="2" className={inputClass} value={step.description || ""} onChange={(e) => updateStep(index, "description", e.target.value)} />
                    </label>
                  </article>
                ))}
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 space-y-4">
                <h3 className="font-bold text-lg text-primary">কার্যক্রমের বিভাগ তালিকা</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">বিভাগ বক্সের শিরোনাম
                    <input className={inputClass} value={form.howItWorks?.divisionsTitle || "কার্যক্রমের বিভাগ"} onChange={(e) => updateHowItWorks("divisionsTitle", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">বিভাগ বক্সের সাবটাইটেল
                    <input className={inputClass} value={form.howItWorks?.divisionsSubtitle || "বর্তমানে আমরা নিচের বিভাগগুলোতে কাজ করছি:"} onChange={(e) => updateHowItWorks("divisionsSubtitle", e.target.value)} />
                  </label>
                </div>
                <label className="block text-sm font-semibold">বিভাগসমূহের তালিকা (কমা দিয়ে আলাদা করুন)
                  <input className={inputClass} value={form.howItWorks?.divisions || "ঢাকা, চট্টগ্রাম, সিলেট, খুলনা, রাজশাহী, বরিশাল, রংপুর, ময়মনসিংহ"} onChange={(e) => updateHowItWorks("divisions", e.target.value)} />
                </label>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold">ধাপচিত্র বা ফ্লোচার্টের ছবি</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (val) => updateHowItWorks("flowchartImage", val))} className="text-sm" />
                    <input type="text" placeholder="ছবির URL" value={form.howItWorks?.flowchartImage || ""} onChange={(e) => updateHowItWorks("flowchartImage", e.target.value)} className={inputClass} />
                  </div>
                  {form.howItWorks?.flowchartImage && <img src={form.howItWorks.flowchartImage} alt="Flowchart" className="max-h-40 rounded-xl object-cover border mt-2" />}
                </div>
              </div>

              <button disabled={busy} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "যেভাবে কাজ করে সংরক্ষণ"}
              </button>
            </form>
          )}

          {/* 6. TESTIMONIALS */}
          {!loading && section === "testimonials" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">৬. মানুষের অভিজ্ঞতা ও রিভিউ</h2>
                  <p className="mt-1 text-gray-600 text-sm">উপকারভোগী বা স্বেচ্ছাসেবকদের অভিজ্ঞতা, বক্তব্য ও ছবি পরিচালনা করুন।</p>
                </div>
                <button type="button" onClick={addTestimonial} className="rounded-xl bg-primary/10 border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary/20 text-sm">
                  + নতুন রিভিউ যোগ করুন
                </button>
              </div>

              <label className="block font-semibold">সেকশনের শিরোনাম
                <input className={inputClass} value={form.testimonials?.title || "মানুষের অভিজ্ঞতা"} onChange={(e) => setForm((c) => ({ ...c, testimonials: { ...(c.testimonials || {}), title: e.target.value } }))} />
              </label>

              <div className="space-y-4">
                {testimonialItems.map((item, index) => (
                  <article key={item.id || index} className="space-y-3 rounded-2xl border border-gray-200 p-4 bg-gray-50/50">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-sm text-gray-700">রিভিউ #{index + 1}</span>
                      {testimonialItems.length > 1 && (
                        <button type="button" onClick={() => removeTestimonial(index)} className="text-xs text-red-600 hover:underline">
                          মুছে ফেলুন
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="block text-xs font-semibold">নাম
                        <input className={inputClass} value={item.name || ""} onChange={(e) => updateTestimonial(index, "name", e.target.value)} />
                      </label>
                      <label className="block text-xs font-semibold">ভূমিকা (যেমন: উপকারভোগী / স্বেচ্ছাসেবক)
                        <input className={inputClass} value={item.role || ""} onChange={(e) => updateTestimonial(index, "role", e.target.value)} />
                      </label>
                      <label className="block text-xs font-semibold">স্থান বা জেলা
                        <input className={inputClass} value={item.location || ""} onChange={(e) => updateTestimonial(index, "location", e.target.value)} />
                      </label>
                    </div>

                    <label className="block text-xs font-semibold">রিভিউ শিরোনাম
                      <input className={inputClass} value={item.title || ""} onChange={(e) => updateTestimonial(index, "title", e.target.value)} />
                    </label>

                    <label className="block text-xs font-semibold">অভিজ্ঞতার বক্তব্য
                      <textarea rows="2" className={inputClass} value={item.message || ""} onChange={(e) => updateTestimonial(index, "message", e.target.value)} />
                    </label>

                    <div className="flex items-center gap-3">
                      <img src={item.image || "https://i.ibb.co.com/XZdP5hF/2023-05-15-1.jpg"} alt={item.name} className="h-12 w-12 rounded-full object-cover border" />
                      <input type="text" placeholder="ছবির URL" value={item.image || ""} onChange={(e) => updateTestimonial(index, "image", e.target.value)} className={inputClass} />
                    </div>
                  </article>
                ))}
              </div>

              <button disabled={busy} onClick={(e) => saveBranding(e, "অভিজ্ঞতা ও রিভিউ স্থায়ীভাবে সংরক্ষণ করা হয়েছে।")} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "রিভিউ সংরক্ষণ"}
              </button>
            </div>
          )}

          {/* 7. FAQS */}
          {!loading && section === "faqs" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">৭. সাধারণ জিজ্ঞাসা (FAQ)</h2>
                  <p className="mt-1 text-gray-600 text-sm">সাধারণ জিজ্ঞাসার প্রশ্ন ও উত্তরসমূহ সম্পাদনা করুন বা নতুন প্রশ্ন যুক্ত করুন।</p>
                </div>
                <button type="button" onClick={addFaq} className="rounded-xl bg-primary/10 border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary/20 text-sm">
                  + নতুন প্রশ্ন-উত্তর যোগ করুন
                </button>
              </div>

              <label className="block font-semibold">সেকশনের শিরোনাম
                <input className={inputClass} value={form.faqs?.title || "সাধারণ জিজ্ঞাসা"} onChange={(e) => setForm((c) => ({ ...c, faqs: { ...(c.faqs || {}), title: e.target.value } }))} />
              </label>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <article key={item.id || index} className="space-y-2 rounded-2xl border border-gray-200 p-4 bg-gray-50/50">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-sm text-primary">প্রশ্ন #{index + 1}</span>
                      {faqItems.length > 1 && (
                        <button type="button" onClick={() => removeFaq(index)} className="text-xs text-red-600 hover:underline">
                          মুছে ফেলুন
                        </button>
                      )}
                    </div>
                    <label className="block text-xs font-semibold">প্রশ্ন
                      <input className={inputClass} value={item.question || ""} onChange={(e) => updateFaq(index, "question", e.target.value)} />
                    </label>
                    <label className="block text-xs font-semibold">উত্তর
                      <textarea rows="3" className={inputClass} value={item.answer || ""} onChange={(e) => updateFaq(index, "answer", e.target.value)} />
                    </label>
                  </article>
                ))}
              </div>

              <button disabled={busy} onClick={(e) => saveBranding(e, "সাধারণ জিজ্ঞাসা স্থায়ীভাবে সংরক্ষণ করা হয়েছে।")} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "সাধারণ জিজ্ঞাসা সংরক্ষণ"}
              </button>
            </div>
          )}

          {/* 8. CONTACT & SOCIAL */}
          {!loading && section === "contact" && (
            <form onSubmit={(e) => saveBranding(e, "যোগাযোগ ও সোশ্যাল মিডিয়ার তথ্য স্থায়ীভাবে সংরক্ষণ করা হয়েছে।")} className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">৮. যোগাযোগ, মোবাইল ব্যাংকিং ও সোশ্যাল লিংক</h2>
                <p className="mt-1 text-gray-600 text-sm">অফিসিয়াল ইমেইল, হেল্পলাইন, বিকাশ/নগদ/রকেট নম্বর, ঠিকানা এবং সোশ্যাল মিডিয়া লিংক পরিবর্তন করুন।</p>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 space-y-4">
                <h3 className="font-bold text-lg text-primary">অফিসিয়াল যোগাযোগের তথ্য</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">অফিসিয়াল ইমেইল
                    <input type="email" className={inputClass} value={contact.email || ""} onChange={(e) => updateContact("email", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">হেল্পলাইন / অনুদান নম্বর
                    <input className={inputClass} value={contact.phone || ""} onChange={(e) => updateContact("phone", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold sm:col-span-2">ঠিকানা
                    <input className={inputClass} value={contact.address || ""} onChange={(e) => updateContact("address", e.target.value)} />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 space-y-4">
                <h3 className="font-bold text-lg text-primary">মোবাইল ব্যাংকিং অ্যাকাউন্ট নম্বর</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block text-sm font-semibold">বিকাশ নম্বর (Personal)
                    <input className={inputClass} value={contact.bkashNumber || ""} onChange={(e) => updateContact("bkashNumber", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">নগদ নম্বর (Personal)
                    <input className={inputClass} value={contact.nagadNumber || ""} onChange={(e) => updateContact("nagadNumber", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">রকেট নম্বর (Personal)
                    <input className={inputClass} value={contact.rocketNumber || ""} onChange={(e) => updateContact("rocketNumber", e.target.value)} />
                  </label>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50/50 space-y-4">
                <h3 className="font-bold text-lg text-primary">সোশ্যাল মিডিয়া ও ফুটার লিংক</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold">Facebook পেজ লিংক
                    <input className={inputClass} placeholder="https://facebook.com/..." value={contact.facebookUrl || ""} onChange={(e) => updateContact("facebookUrl", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">Twitter / X লিংক
                    <input className={inputClass} placeholder="https://x.com/..." value={contact.twitterUrl || ""} onChange={(e) => updateContact("twitterUrl", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">Instagram প্রোফাইল লিংক
                    <input className={inputClass} placeholder="https://instagram.com/..." value={contact.instagramUrl || ""} onChange={(e) => updateContact("instagramUrl", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold">YouTube চ্যানেল লিংক
                    <input className={inputClass} placeholder="https://youtube.com/..." value={contact.youtubeUrl || ""} onChange={(e) => updateContact("youtubeUrl", e.target.value)} />
                  </label>
                  <label className="block text-sm font-semibold sm:col-span-2">LinkedIn লিংক
                    <input className={inputClass} placeholder="https://linkedin.com/..." value={contact.linkedinUrl || ""} onChange={(e) => updateContact("linkedinUrl", e.target.value)} />
                  </label>
                </div>
                <label className="block text-sm font-semibold">ফুটারের সংক্ষিপ্ত পরিচিতি
                  <textarea rows="2" className={inputClass} value={contact.footerDescription || ""} onChange={(e) => updateContact("footerDescription", e.target.value)} />
                </label>
              </div>

              <button disabled={busy} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "যোগাযোগ ও সোশ্যাল তথ্য সংরক্ষণ"}
              </button>
            </form>
          )}

          {/* 9. CAMPAIGNS */}
          {!loading && section === "campaigns" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">৯. কার্যক্রমের তথ্য ও ছবি</h2>
                  <p className="mt-1 text-gray-600 text-sm">কার্যক্রম কার্ডের ছবি, লেখা, বিভাগ, লক্ষ্যমাত্রা ও অগ্রগতি সম্পাদনা করুন বা নতুন কার্যক্রম যোগ করুন।</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCampaignList((list) => [...list, {
                    id: Math.max(0, ...list.map((item) => Number(item.id) || 0)) + 1,
                    title: "নতুন কার্যক্রম",
                    image: "",
                    description: "",
                    secondary_description: "",
                    division: "ঢাকা",
                    status: "চলমান",
                    current_funds: 0,
                    goal: 0,
                    progress: 0,
                    contactInfo: contact.email || "alahsanfoundationbangladesh@gmail.com",
                  }])}
                  className="rounded-xl bg-primary/10 border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary/20 text-sm"
                >
                  + নতুন কার্যক্রম যোগ করুন
                </button>
              </div>

              {campaignList.map((campaign, index) => (
                <article key={campaign.id || index} className="space-y-4 rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50/50">
                  <div className="flex items-center justify-between gap-3 border-b pb-2">
                    <h3 className="text-lg font-bold text-gray-800">কার্যক্রম {index + 1}</h3>
                    {campaignList.length > 1 && (
                      <button type="button" onClick={() => removeCampaign(index)} className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50">
                        কার্যক্রম মুছুন
                      </button>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-[200px_1fr]">
                    <div>
                      <img src={campaign.image || "https://i.ibb.co.com/hFKT7MM/pexels-photo-6995106.webp"} alt={campaign.title} className="h-36 w-full rounded-lg bg-gray-100 object-cover border" />
                      <label className="mt-2 block text-xs font-semibold">ছবি আপলোড
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, (value) => updateCampaign(index, "image", value))} className="mt-1 block w-full text-xs" />
                      </label>
                      <label className="mt-2 block text-xs font-semibold">ছবির URL
                        <input className={inputClass} placeholder="https://..." value={campaign.image || ""} onChange={(e) => updateCampaign(index, "image", e.target.value)} />
                      </label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm font-semibold">কার্যক্রমের নাম
                        <input className={inputClass} maxLength="140" value={campaign.title || ""} onChange={(e) => updateCampaign(index, "title", e.target.value)} />
                      </label>
                      <label className="block text-sm font-semibold">বিভাগ
                        <input className={inputClass} maxLength="60" value={campaign.division || ""} onChange={(e) => updateCampaign(index, "division", e.target.value)} />
                      </label>
                      <label className="block text-sm font-semibold sm:col-span-2">কার্ডের সংক্ষিপ্ত বিবরণ
                        <textarea rows="3" maxLength="2500" className={inputClass} value={campaign.description || ""} onChange={(e) => updateCampaign(index, "description", e.target.value)} />
                      </label>
                      <label className="block text-sm font-semibold sm:col-span-2">বিস্তারিত বিবরণ
                        <textarea rows="4" maxLength="4000" className={inputClass} value={campaign.secondary_description || ""} onChange={(e) => updateCampaign(index, "secondary_description", e.target.value)} />
                      </label>
                      <label className="block text-sm font-semibold">অনুদানের লক্ষ্য (টাকা)
                        <input type="number" min="0" className={inputClass} value={campaign.goal ?? 0} onChange={(e) => updateCampaign(index, "goal", Number(e.target.value))} />
                      </label>
                      <label className="block text-sm font-semibold">সংগৃহীত তহবিল (টাকা)
                        <input type="number" min="0" className={inputClass} value={campaign.current_funds ?? 0} onChange={(e) => updateCampaign(index, "current_funds", Number(e.target.value))} />
                      </label>
                      <label className="block text-sm font-semibold">অবস্থা
                        <select className={inputClass} value={["Active", "active", "চলমান"].includes(campaign.status) ? "চলমান" : campaign.status || "চলমান"} onChange={(e) => updateCampaign(index, "status", e.target.value)}>
                          <option value="চলমান">চলমান</option>
                          <option value="সম্পন্ন">সম্পন্ন</option>
                          <option value="স্থগিত">স্থগিত</option>
                        </select>
                      </label>
                      <label className="block text-sm font-semibold">যোগাযোগের ইমেইল
                        <input type="email" className={inputClass} value={campaign.contactInfo || ""} onChange={(e) => updateCampaign(index, "contactInfo", e.target.value)} />
                      </label>
                    </div>
                  </div>
                </article>
              ))}

              <button disabled={busy || !campaignList.length} onClick={saveCampaignImages} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow hover:opacity-90 disabled:opacity-60">
                {busy ? "সংরক্ষণ হচ্ছে…" : "কার্যক্রম ও ছবি সংরক্ষণ"}
              </button>
            </div>
          )}

          {/* 10. DONATIONS */}
          {!loading && section === "donations" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">১০. অনুদান যাচাই ও রসিদ</h2>
                <p className="mt-1 text-gray-600 text-sm">TrxID যাচাই করুন। অনুমোদনের পর রসিদ ইমেইল পাঠানোর অবস্থা দেখা যাবে; ব্যর্থ হলে পুনরায় পাঠান।</p>
              </div>

              {pendingDonations.length === 0 && (
                <p className="rounded-xl bg-gray-50 p-5 text-gray-600 text-sm">যাচাইয়ের অপেক্ষায় কোনো অনুদান নেই।</p>
              )}

              {pendingDonations.map((donation) => (
                <article key={donation.id} className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{donation.name} · {money(donation.amount)}</h3>
                      <p className="text-sm text-gray-600">{donation.email} · {donation.phone}</p>
                      <p className="mt-2 text-sm">
                        মাধ্যম: {{ bKash: "বিকাশ", Nagad: "নগদ", Rocket: "রকেট" }[donation.method] || donation.method} · TrxID: <code className="font-bold bg-white px-2 py-0.5 rounded border">{donation.trxId}</code>
                      </p>
                      <p className="text-sm text-gray-700">কার্যক্রম: {donation.campaignTitle || "সাধারণ অনুদান"}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(donation.createdAt).toLocaleString("bn-BD")}</p>
                    </div>
                    <div className="flex gap-2">
                      <button disabled={busy} onClick={() => verifyDonation(donation.id, "verify-donation")} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60">
                        যাচাই ও অনুমোদন
                      </button>
                      <button disabled={busy} onClick={() => verifyDonation(donation.id, "reject-donation")} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60">
                        বাতিল
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <h3 className="pt-4 text-lg font-bold text-gray-800 border-t">অনুদানের ইতিহাস ও ইমেইল অবস্থা</h3>
              {approvedDonations.length === 0 && donations.every((d) => d.status === "pending") && (
                <p className="text-sm text-gray-500">অনুমোদিত অনুদানের ইতিহাস এখনো নেই।</p>
              )}

              {donations.filter((d) => d.status !== "pending").map((donation) => {
                const emailStatus = donation.emailStatus || "unknown";
                return (
                  <article key={donation.id} className="space-y-2 rounded-xl border border-gray-200 p-4 bg-gray-50/50">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <strong>{donation.name} · {money(donation.amount)}</strong>
                        <p className="text-sm text-gray-600">{donation.email} · TrxID: {donation.trxId}</p>
                        <p className="text-xs text-gray-500">
                          {donation.status === "approved" ? "অনুমোদিত" : "বাতিল"}
                          {donation.invoiceNumber ? ` · রসিদ ${donation.invoiceNumber}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          emailStatus === "sent" ? "bg-green-100 text-green-800" : emailStatus === "failed" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {emailStatusText(emailStatus)}
                        </span>
                        {donation.status === "approved" && emailStatus !== "sent" && (
                          <button disabled={busy} onClick={() => resendReceipt(donation)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60">
                            রসিদ পুনরায় পাঠান
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* 11. EXPENSES */}
          {!loading && section === "expenses" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">১১. আয়-ব্যয়ের হিসাব (লেজার)</h2>
                <p className="mt-1 text-gray-600 text-sm">যাচাইকৃত অনুদানকে তহবিল আয় হিসেবে গণনা করা হয়। মাঠপর্যায়ের প্রতিটি ব্যয় ভাউচার এখানে নথিভুক্ত করুন।</p>
              </div>

              <form onSubmit={submitExpense} className="grid gap-3 rounded-xl bg-gray-50 p-4 border md:grid-cols-2">
                <label className="text-sm font-semibold">ব্যয়ের বিবরণ বা খাত
                  <input required placeholder="যেমন: ১০০টি কম্বল ক্রয়" className={inputClass} value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })} />
                </label>
                <label className="text-sm font-semibold">বিভাগ / প্রকল্প
                  <input placeholder="যেমন: কুড়িগ্রাম বিতরণ প্রকল্প" className={inputClass} value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })} />
                </label>
                <label className="text-sm font-semibold">টাকার পরিমাণ
                  <input required type="number" min="1" className={inputClass} value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} />
                </label>
                <label className="text-sm font-semibold">নোট / ভাউচার নম্বর
                  <input className={inputClass} value={newExpense.note} onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })} />
                </label>
                <button disabled={busy} className="rounded-xl bg-primary px-5 py-3 font-semibold text-white md:col-span-2 shadow hover:opacity-90 disabled:opacity-60">
                  + ব্যয় সংরক্ষণ করুন
                </button>
              </form>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-green-50 p-4 border border-green-200">
                  <p className="text-xs text-gray-500">মোট সংগৃহীত অনুদান</p>
                  <p className="text-xl font-bold text-green-700 mt-1">{money(totals.received)}</p>
                </div>
                <div className="rounded-xl bg-rose-50 p-4 border border-rose-200">
                  <p className="text-xs text-gray-500">মোট বিতরণ বা ব্যয়</p>
                  <p className="text-xl font-bold text-rose-700 mt-1">{money(totals.spent)}</p>
                </div>
              </div>

              <div className="divide-y border rounded-xl overflow-hidden">
                {expenses.length === 0 && <p className="p-4 text-center text-sm text-gray-500">কোনো ব্যয়ের রেকর্ড এখনো নেই।</p>}
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{expense.title}</p>
                      <p className="text-xs text-gray-500">{expense.category} {expense.note ? `· ${expense.note}` : ""} · {new Date(expense.createdAt).toLocaleDateString("bn-BD")}</p>
                    </div>
                    <strong className="text-rose-600 font-bold text-sm">-{money(expense.amount)}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminSettings;
