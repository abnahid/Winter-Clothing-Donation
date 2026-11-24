import { useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useBranding } from "../context/BrandingContext";

const AdminSettings = () => {
  const { settings, saveSettings, resetSettings } = useBranding();
  const [form, setForm] = useState(settings);
  const [section, setSection] = useState("overview");

  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const handleLogo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("একটি ছবি নির্বাচন করুন।");
    if (file.size > 1024 * 1024) return toast.error("লোগোর ফাইল ১ মেগাবাইটের মধ্যে রাখুন।");
    const reader = new FileReader();
    reader.onload = () => change("logo", reader.result);
    reader.readAsDataURL(file);
  };
  const handleSave = (event) => {
    event.preventDefault();
    saveSettings(form);
    toast.success("সাইটের পরিচিতি সংরক্ষিত হয়েছে।");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Helmet><title>অ্যাডমিন প্যানেল</title></Helmet>
      <header className="mb-8 rounded-3xl bg-primary p-7 text-white shadow-lg">
        <p className="text-sm font-semibold text-white/80">সাইট পরিচালনা</p>
        <h1 className="mt-2 text-3xl font-bold">অ্যাডমিন প্যানেল</h1>
        <p className="mt-2 max-w-2xl text-white/90">ওয়েবসাইটের নাম, লোগো, রঙের থিম ও পরিচিতি এখানে হালনাগাদ করুন।</p>
      </header>

      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
        <strong>গুরুত্বপূর্ণ:</strong> এই সংস্করণে পরিবর্তনগুলো এই ব্রাউজারের লোকাল স্টোরেজে থাকে। সবার জন্য একসঙ্গে প্রকাশ করতে শেয়ার করা ডেটাবেস সংযুক্ত করা দরকার। বর্তমানে অ্যাডমিন পৃষ্ঠা লগইন-সুরক্ষিত, তবে আলাদা অ্যাডমিন-ভূমিকা যাচাই নেই।
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <nav aria-label="অ্যাডমিন মেনু" className="rounded-2xl bg-white p-3 shadow-sm">
          <button onClick={() => setSection("overview")} className={`mb-2 w-full rounded-xl px-4 py-3 text-left font-semibold ${section === "overview" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>ওভারভিউ ও পরিচিতি</button>
          <button onClick={() => setSection("branding")} className={`w-full rounded-xl px-4 py-3 text-left font-semibold ${section === "branding" ? "bg-primary text-white" : "hover:bg-gray-100"}`}>নাম, লোগো ও থিম</button>
        </nav>

        <form onSubmit={handleSave} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          {section === "overview" ? (
            <section>
              <h2 className="text-2xl font-bold">ওয়েবসাইটের পরিচিতি</h2>
              <p className="mt-2 text-gray-600">হোম পেজের আমাদের উদ্যোগ অংশে দেখানো পরিচিতি সম্পাদনা করুন।</p>
              <label className="mt-6 block font-semibold" htmlFor="overview">পরিচিতির লেখা</label>
              <textarea id="overview" rows="7" maxLength={1200} value={form.overview} onChange={(e) => change("overview", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-4 outline-primary" />
              <p className="mt-2 text-right text-sm text-gray-500">{form.overview.length}/১২০০</p>
            </section>
          ) : (
            <section>
              <h2 className="text-2xl font-bold">ব্র্যান্ড পরিচিতি</h2>
              <p className="mt-2 text-gray-600">নেভিগেশন বার ও ফুটারে সাইটের নাম এবং লোগো দেখানো হবে।</p>
              <label className="mt-6 block font-semibold" htmlFor="siteName">ওয়েবসাইটের নাম</label>
              <input id="siteName" maxLength={60} value={form.siteName} onChange={(e) => change("siteName", e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3" required />
              <label className="mt-6 block font-semibold" htmlFor="logo">লোগো আপলোড (সর্বোচ্চ ১ মেগাবাইট)</label>
              <input id="logo" type="file" accept="image/*" onChange={handleLogo} className="mt-2 block w-full rounded-xl border border-gray-300 p-3" />
              <div className="mt-4 flex h-28 items-center gap-4 rounded-xl bg-gray-50 p-4">
                <img src={form.logo} alt="লোগোর পূর্বরূপ" className="h-20 w-20 rounded-xl object-contain" />
                <span className="font-semibold">{form.siteName || "আপনার সাইটের নাম"}</span>
              </div>
              <label className="mt-6 block font-semibold" htmlFor="primaryColor">মূল থিমের রঙ</label>
              <div className="mt-2 flex items-center gap-4">
                <input id="primaryColor" type="color" value={form.primaryColor} onChange={(e) => change("primaryColor", e.target.value)} className="h-12 w-16 cursor-pointer rounded border-0" />
                <code className="text-gray-600">{form.primaryColor}</code>
              </div>
            </section>
          )}
          <div className="flex flex-wrap gap-3 border-t pt-5">
            <button type="submit" className="rounded-xl bg-primary px-6 py-3 font-semibold text-white">পরিবর্তন সংরক্ষণ</button>
            <button type="button" onClick={() => { resetSettings(); setForm({ siteName: "উষ্ণ হৃদয় উদ্যোগ", logo: "/Warm-Hearts-Initiative.png", primaryColor: "#1686c9", overview: "আমাদের লক্ষ্য হলো উদার দাতাদের সঙ্গে স্বেচ্ছাসেবীদের যুক্ত করে বাংলাদেশের সুবিধাবঞ্চিত মানুষের কাছে প্রয়োজনীয় শীতবস্ত্র পৌঁছে দেওয়া। আপনার সহায়তায় কেউ যেন একা শীতের কষ্টে না থাকেন, তা নিশ্চিত করতে আমরা কাজ করি।" }); toast.success("ডিফল্ট পরিচিতি ফিরিয়ে আনা হয়েছে।"); }} className="rounded-xl border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-50">ডিফল্টে ফিরুন</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AdminSettings;
