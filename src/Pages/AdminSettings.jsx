import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthProvider";
import { DEFAULT_BRANDING, useBranding } from "../context/BrandingContext";

const API = "/.netlify/functions/api";
const tabs = [
  ["overview", "সাইট ওভারভিউ"],
  ["campaigns", "কার্যক্রম ও ছবি"],
  ["donations", "অনুদান যাচাই"],
  ["expenses", "আয়-ব্যয়"],
];
const money = (amount) => `৳${Number(amount || 0).toLocaleString("bn-BD")}`;

async function imageToDataUrl(file) {
  if (!new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]).has(file?.type)) {
    throw new Error("PNG, JPEG, WebP বা GIF ছবির ফাইল নির্বাচন করুন।");
  }
  if (file.size > 750 * 1024) throw new Error("প্রতিটি ছবি ৭৫০ কিলোবাইটের মধ্যে রাখুন।");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("ছবিটি পড়া যায়নি।"));
    reader.readAsDataURL(file);
  });
}

const AdminSettings = () => {
  const { user } = useContext(AuthContext);
  const { settings, campaigns: sharedCampaigns, saveSettings, saveCampaigns } = useBranding();
  const [section, setSection] = useState("overview");
  const [form, setForm] = useState(settings);
  const [campaignList, setCampaignList] = useState(sharedCampaigns || []);
  const campaignListRef = useRef(sharedCampaigns || []);
  useEffect(() => { campaignListRef.current = campaignList; }, [campaignList]);
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: "", category: "", amount: "", note: "" });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}?action=admin-data`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "অ্যাডমিন তথ্য আনা যায়নি।");
      setDonations(data.donations || []);
      setExpenses(data.expenses || []);
      if (data.settings) setForm({ ...DEFAULT_BRANDING, ...data.settings });
      if (data.campaigns) setCampaignList(data.campaigns);
      else if (!campaignListRef.current.length) {
        const seedResponse = await fetch("/donation-campaigns.json");
        setCampaignList(await seedResponse.json());
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => {
    setForm({ ...DEFAULT_BRANDING, ...settings });
    if (sharedCampaigns?.length) setCampaignList(sharedCampaigns);
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "অনুরোধটি সম্পন্ন করা যায়নি।");
    return data;
  };

  const saveBranding = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await saveSettings(form);
      toast.success("সাইটের পরিচিতি সবার জন্য সংরক্ষণ করা হয়েছে।");
    } catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };

  const handleImage = async (event, key, index = null) => {
    try {
      const value = await imageToDataUrl(event.target.files?.[0]);
      if (index === null) setForm((current) => ({ ...current, [key]: value }));
      else setCampaignList((current) => current.map((campaign, i) => i === index ? { ...campaign, image: value } : campaign));
    } catch (error) { toast.error(error.message); }
  };

  const saveCampaignImages = async () => {
    setBusy(true);
    try {
      await saveCampaigns(campaignList);
      toast.success("কার্যক্রমের লেখা ও ছবি সবার জন্য সংরক্ষিত হয়েছে।");
    } catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };

  const verifyDonation = async (id, action) => {
    setBusy(true);
    try {
      const result = await postAdmin({ action, id });
      toast.success(result.message || (action === "verify-donation" ? "অনুদান যাচাই করে রসিদ পাঠানো হয়েছে।" : "অনুদান বাতিল করা হয়েছে।"));
      await refresh();
    } catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };

  const submitExpense = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await postAdmin({ action: "add-expense", ...newExpense });
      setNewExpense({ title: "", category: "", amount: "", note: "" });
      toast.success("ব্যয়ের তথ্য সংরক্ষণ করা হয়েছে।");
      await refresh();
    } catch (error) { toast.error(error.message); }
    finally { setBusy(false); }
  };

  const inputClass = "mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-primary";
  const pendingDonations = donations.filter((donation) => donation.status === "pending");

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Helmet><title>অ্যাডমিন প্যানেল - {settings.siteName}</title></Helmet>
      <header className="mb-7 rounded-3xl bg-primary p-7 text-white shadow-lg">
        <p className="text-sm font-semibold text-white/80">সাইট পরিচালনা</p>
        <h1 className="mt-2 text-3xl font-bold">অ্যাডমিন প্যানেল</h1>
        <p className="mt-2">ওয়েবসাইট, অনুদান, কার্যক্রম ও ব্যয়ের হিসাব পরিচালনা করুন।</p>
        <p className="mt-2 text-sm text-white/80">অ্যাডমিন: {user?.email}</p>
      </header>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[["যাচাইকৃত অনুদান", money(totals.received)], ["যাচাইয়ের অপেক্ষায়", money(totals.pending)], ["মোট ব্যয়", money(totals.spent)], ["বর্তমান তহবিল", money(totals.balance)]].map(([title, value]) => (
          <article key={title} className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{title}</p><p className="mt-2 text-2xl font-bold text-primary">{value}</p></article>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="অ্যাডমিন মেনু" className="h-fit rounded-2xl bg-white p-3 shadow-sm">
          {tabs.map(([id, label]) => <button key={id} onClick={() => setSection(id)} className={`mb-1 w-full rounded-xl px-4 py-3 text-left font-semibold ${section === id ? "bg-primary text-white" : "hover:bg-gray-100"}`}>{label}</button>)}
          <button onClick={refresh} className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm hover:bg-gray-50">তথ্য হালনাগাদ করুন</button>
        </nav>

        <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          {loading ? <p className="py-8 text-center">তথ্য আনা হচ্ছে…</p> : null}

          {!loading && section === "overview" && <form onSubmit={saveBranding} className="space-y-5">
            <div><h2 className="text-2xl font-bold">সাইটের পরিচিতি ও থিম</h2><p className="mt-2 text-gray-600">পরিবর্তনগুলো সার্ভারে সংরক্ষিত হয়ে সব দর্শকের জন্য প্রকাশিত হবে।</p></div>
            <label className="block font-semibold">ওয়েবসাইটের নাম<input className={inputClass} maxLength="80" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} required /></label>
            <label className="block font-semibold">মূল থিমের রঙ<div className="mt-2 flex items-center gap-4"><input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-12 w-16"/><code>{form.primaryColor}</code></div></label>
            <label className="block font-semibold">সাইটের লোগো<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, "logo")} className={inputClass} /></label>
            <img src={form.logo} alt="লোগোর পূর্বরূপ" className="h-24 w-24 rounded-xl object-contain" />
            <label className="block font-semibold">হোম পেজের ওভারভিউ<textarea rows="5" maxLength="3000" className={inputClass} value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} /></label>
            <label className="block font-semibold">ওভারভিউ অংশের ছবি<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, "overviewImage")} className={inputClass} /></label>
            {form.overviewImage && <img src={form.overviewImage} alt="ওভারভিউ ছবির পূর্বরূপ" className="max-h-64 rounded-xl object-cover" />}
            <button disabled={busy} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60">{busy ? "সংরক্ষণ হচ্ছে…" : "পরিবর্তন সংরক্ষণ"}</button>
          </form>}

          {!loading && section === "campaigns" && <div className="space-y-5">
            <div><h2 className="text-2xl font-bold">কার্যক্রমের লেখা ও ছবি</h2><p className="mt-2 text-gray-600">এখানে আপডেট করলে তালিকা ও কার্যক্রমের বিস্তারিত পাতায় সবার কাছে প্রকাশিত হবে।</p></div>
            <button onClick={() => setCampaignList((list) => [...list, { id: Math.max(0, ...list.map((item) => Number(item.id) || 0)) + 1, title: "নতুন কার্যক্রম", image: "", description: "", secondary_description: "", division: "বাংলাদেশ", status: "চলমান", current_funds: 0, goal: 0, progress: 0, contactInfo: "alahsanfoundationbangladesh@gmail.com" }])} className="rounded-xl border border-primary px-5 py-3 font-semibold text-primary">নতুন কার্যক্রম যোগ করুন</button>
            {campaignList.map((campaign, index) => <article key={campaign.id} className="rounded-xl border border-gray-200 p-4">
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <div><img src={campaign.image} alt={campaign.title} className="h-32 w-full rounded-lg object-cover"/><label className="mt-2 block text-sm font-semibold">ছবি পরিবর্তন<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => handleImage(e, "image", index)} className="mt-2 block w-full text-sm"/></label></div>
                <div className="space-y-3"><label className="block text-sm font-semibold">কার্যক্রমের নাম<input className={inputClass} value={campaign.title} onChange={(e) => setCampaignList((list) => list.map((item, i) => i === index ? { ...item, title: e.target.value } : item))}/></label><label className="block text-sm font-semibold">পরিচিতি<textarea rows="3" className={inputClass} value={campaign.description} onChange={(e) => setCampaignList((list) => list.map((item, i) => i === index ? { ...item, description: e.target.value } : item))}/></label></div>
              </div>
            </article>)}
            <button disabled={busy || !campaignList.length} onClick={saveCampaignImages} className="rounded-xl bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60">{busy ? "সংরক্ষণ হচ্ছে…" : "কার্যক্রম ও ছবি সংরক্ষণ"}</button>
          </div>}

          {!loading && section === "donations" && <div className="space-y-5">
            <div><h2 className="text-2xl font-bold">অনুদান যাচাই</h2><p className="mt-2 text-gray-600">মোবাইল আর্থিক সেবার TrxID নিজে যাচাই করে অনুমোদন করুন। অনুমোদনের পরই দাতার ইমেইলে রসিদ পাঠানো হবে।</p></div>
            {pendingDonations.length === 0 && <p className="rounded-xl bg-gray-50 p-5 text-gray-600">যাচাইয়ের অপেক্ষায় কোনো অনুদান নেই।</p>}
            {pendingDonations.map((donation) => <article key={donation.id} className="rounded-xl border border-amber-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{donation.name} · {money(donation.amount)}</h3><p className="text-sm text-gray-600">{donation.email} · {donation.phone}</p><p className="mt-2 text-sm">মাধ্যম: {{ bKash: "বিকাশ", Nagad: "নগদ", Rocket: "রকেট" }[donation.method] || donation.method} · TrxID: <code className="font-bold">{donation.trxId}</code></p><p className="text-sm">কার্যক্রম: {donation.campaignTitle || "সাধারণ অনুদান"}</p><p className="text-xs text-gray-500">{new Date(donation.createdAt).toLocaleString("bn-BD")}</p></div><div className="flex gap-2"><button disabled={busy} onClick={() => verifyDonation(donation.id, "verify-donation")} className="rounded-lg bg-green-700 px-4 py-2 text-white disabled:opacity-60">যাচাই ও রসিদ পাঠান</button><button disabled={busy} onClick={() => verifyDonation(donation.id, "reject-donation")} className="rounded-lg border border-red-300 px-4 py-2 text-red-700">বাতিল</button></div></div>
            </article>)}
            <h3 className="pt-3 text-lg font-bold">অনুদানের ইতিহাস</h3>
            {donations.filter((d) => d.status !== "pending").map((donation) => <div key={donation.id} className="flex flex-wrap justify-between gap-2 border-b py-3 text-sm"><span>{donation.name} · {donation.trxId} · {donation.status === "approved" ? "অনুমোদিত" : "বাতিল"}</span><span>{money(donation.amount)} {donation.invoiceNumber ? `· রসিদ ${donation.invoiceNumber}` : ""}</span></div>)}
          </div>}

          {!loading && section === "expenses" && <div className="space-y-5">
            <div><h2 className="text-2xl font-bold">আয়-ব্যয়ের হিসাব</h2><p className="mt-2 text-gray-600">যাচাইকৃত অনুদানকে আয় হিসেবে গণনা করা হয়। প্রতিটি ব্যয় আলাদাভাবে নথিভুক্ত করুন।</p></div>
            <form onSubmit={submitExpense} className="grid gap-3 rounded-xl bg-gray-50 p-4 md:grid-cols-2">
              <label className="text-sm font-semibold">ব্যয়ের বিবরণ<input required className={inputClass} value={newExpense.title} onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}/></label>
              <label className="text-sm font-semibold">খাত<input className={inputClass} value={newExpense.category} onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}/></label>
              <label className="text-sm font-semibold">টাকার পরিমাণ<input required type="number" min="1" className={inputClass} value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}/></label>
              <label className="text-sm font-semibold">নোট<input className={inputClass} value={newExpense.note} onChange={(e) => setNewExpense({ ...newExpense, note: e.target.value })}/></label>
              <button disabled={busy} className="rounded-xl bg-primary px-5 py-3 font-semibold text-white md:col-span-2">ব্যয় সংরক্ষণ</button>
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
