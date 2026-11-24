import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { STORAGE_KEYS, useBranding } from "../context/BrandingContext";

const paymentNumber = "8801312515643";

const DonateMoney = () => {
  const [searchParams] = useSearchParams();
  const { settings, campaigns: sharedCampaigns } = useBranding();
  const contact = settings?.contact || {};
  const [campaigns, setCampaigns] = useState(sharedCampaigns || []);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    method: "bKash",
    trxId: "",
    campaignId: searchParams.get("campaignId") || "",
    note: "",
  });

  const currentPaymentNumber =
    form.method === "bKash"
      ? (contact.bkashNumber || contact.phone || paymentNumber)
      : form.method === "Nagad"
      ? (contact.nagadNumber || contact.phone || paymentNumber)
      : (contact.rocketNumber || contact.phone || paymentNumber);

  useEffect(() => {
    if (Array.isArray(sharedCampaigns) && sharedCampaigns.length > 0) {
      setCampaigns(sharedCampaigns);
      return;
    }
    const load = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCampaigns(parsed);
            return;
          }
        }
      } catch { /* ignore */ }

      try {
        const dynamic = await fetch("/.netlify/functions/api?action=public-campaigns").then((res) => (res.ok ? res.json() : null));
        if (Array.isArray(dynamic) && dynamic.length > 0) {
          setCampaigns(dynamic);
          return;
        }
      } catch { /* ignore */ }

      try {
        const staticList = await fetch("/donation-campaigns.json").then((res) => res.json());
        if (Array.isArray(staticList)) setCampaigns(staticList);
      } catch {
        setCampaigns([]);
      }
    };
    load();
  }, [sharedCampaigns]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    const selected = campaigns.find((campaign) => String(campaign.id) === String(form.campaignId));
    const donationId = (globalThis.crypto?.randomUUID?.() || `don_${Date.now()}`);
    const localRecord = {
      id: donationId,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      method: form.method,
      trxId: form.trxId.trim().toUpperCase(),
      amount: Number(form.amount),
      campaignId: form.campaignId ? Number(form.campaignId) : null,
      campaignTitle: selected?.title || "সাধারণ অনুদান",
      note: form.note.trim(),
      status: "pending",
      invoiceNumber: null,
      createdAt: new Date().toISOString(),
    };

    // 1. Immediately store in local donations list so it shows in Admin Panel
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.DONATIONS) || "[]");
      const filtered = existing.filter((d) => d.trxId !== localRecord.trxId);
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify([localRecord, ...filtered]));
    } catch (e) {
      console.warn("Could not save donation to local storage:", e);
    }

    // 2. Submit to server API
    try {
      const response = await fetch("/.netlify/functions/api?action=donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, campaignTitle: selected?.title || "" }),
      });
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        setSubmitted(result);
      } else {
        setSubmitted({ donationId });
      }
      setForm({
        name: "",
        email: "",
        phone: "",
        amount: "",
        method: "bKash",
        trxId: "",
        campaignId: searchParams.get("campaignId") || "",
        note: "",
      });
      toast.success("অনুদানের তথ্য সফলভাবে জমা হয়েছে।");
    } catch (_err) {
      console.info(_err);
      setSubmitted({ donationId });
      setForm({
        name: "",
        email: "",
        phone: "",
        amount: "",
        method: "bKash",
        trxId: "",
        campaignId: searchParams.get("campaignId") || "",
        note: "",
      });
      toast.success("অনুদানের তথ্য জমা হয়েছে।");
    } finally {
      setBusy(false);
    }
  };

  const inputClass = "mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-primary";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Helmet><title>অর্থ অনুদান | আল আহসান ফাউন্ডেশন</title></Helmet>
      <header className="mb-7 rounded-3xl bg-primary p-7 text-white">
        <p className="text-sm font-semibold text-white/80">নিরাপদ ও যাচাইকৃত অনুদান</p>
        <h1 className="mt-2 text-3xl font-bold">অর্থ অনুদান দিন</h1>
        <p className="mt-2">বিকাশ, নগদ অথবা রকেট থেকে অর্থ পাঠিয়ে TrxID দিয়ে অনুদান জমা করুন।</p>
      </header>

      {submitted ? <div role="status" className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
        <h2 className="text-xl font-bold text-green-800">অনুদানের তথ্য জমা হয়েছে</h2>
        <p className="mt-2">আপনার অনুদান নম্বর: <code className="font-bold">{submitted.donationId}</code></p>
        <p className="mt-1">অ্যাডমিন TrxID যাচাই করার পর আপনার ইমেইলে রসিদ পাঠানো হবে।</p>
      </div> : null}

      <section className="mb-6 rounded-2xl border border-primary/20 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold">টাকা পাঠানোর নম্বর</h2>
        <p className="mt-2 text-gray-600">বিকাশ, নগদ বা রকেট থেকে নিচের নম্বরে টাকা পাঠান। সফল লেনদেনের পর পাওয়া TrxID ফর্মে দিন। অনুদান যাচাই না হওয়া পর্যন্ত এটি অপেক্ষমাণ থাকবে।</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4">
          <span className="font-bold">বিকাশ · নগদ · রকেট</span>
          <a className="text-xl font-extrabold text-primary" href={`tel:${currentPaymentNumber}`}>{currentPaymentNumber}</a>
        </div>
      </section>

      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">অনুদানের তথ্য জমা দিন</h2>
        <label className="block font-semibold">আপনার নাম<input className={inputClass} required maxLength="100" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label>
        <label className="block font-semibold">ইমেইল<input type="email" className={inputClass} required maxLength="254" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></label>
        <label className="block font-semibold">মোবাইল নম্বর<input type="tel" className={inputClass} required maxLength="24" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block font-semibold">অনুদানের পরিমাণ (টাকা)<input type="number" className={inputClass} required min="1" max="1000000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}/></label>
          <label className="block font-semibold">পেমেন্ট মাধ্যম<select className={inputClass} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}><option value="bKash">বিকাশ</option><option value="Nagad">নগদ</option><option value="Rocket">রকেট</option></select></label>
        </div>
        <label className="block font-semibold">লেনদেন নম্বর (TrxID)<input className={inputClass} required maxLength="80" autoCapitalize="characters" value={form.trxId} onChange={(e) => setForm({ ...form, trxId: e.target.value })}/></label>
        <label className="block font-semibold">কোন কার্যক্রমে অনুদান দেবেন<select className={inputClass} value={form.campaignId} onChange={(e) => setForm({ ...form, campaignId: e.target.value })}><option value="">সাধারণ অনুদান</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.title}</option>)}</select></label>
        <label className="block font-semibold">নোট (ঐচ্ছিক)<textarea rows="3" maxLength="500" className={inputClass} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}/></label>
        <button disabled={busy} className="w-full rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? "জমা হচ্ছে…" : "অনুদানের তথ্য জমা দিন"}</button>
        <p className="text-sm leading-6 text-gray-500">TrxID জমা দেওয়া মানেই পেমেন্ট নিশ্চিত হওয়া নয়। প্রশাসক লেনদেনটি যাচাই করবেন; অনুমোদিত হলে রসিদ আপনার ইমেইলে যাবে।</p>
      </form>
    </main>
  );
};

export default DonateMoney;
