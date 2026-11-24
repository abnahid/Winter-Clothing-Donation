import { getStore } from "@netlify/blobs";
import { getUser } from "@netlify/identity";

const ADMIN_EMAIL = "alahsanfoundationbangladesh@gmail.com";
const donations = getStore("alahsan-donations");
const expenses = getStore("alahsan-expenses");
const content = getStore("alahsan-site-content");
const methods = new Set(["bKash", "Nagad", "Rocket"]);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

const readJson = async (store, key, fallback = null) => {
  const value = await store.get(key, { type: "json" });
  return value ?? fallback;
};

const cleanText = (value, max = 160) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const validImage = (value) => {
  if (!value) return true;
  if (typeof value !== "string" || value.length > 3_000_000) return false;
  if (/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(value)) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
};

async function requireAdmin() {
  const user = await getUser();
  if (!user) return { error: json({ error: "লগইন আবশ্যক।" }, 401) };
  if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return { error: json({ error: "অ্যাডমিন অনুমতি নেই।" }, 403) };
  }
  return { user };
}

async function sendReceiptEmail(donation) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    throw new Error("ইমেইল পাঠানোর সেটআপ সম্পূর্ণ নয়। Netlify-তে RESEND_API_KEY ও RESEND_FROM_EMAIL সেট করতে হবে।");
  }
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
  const invoiceNumber = `AHF-${donation.id.slice(-10).toUpperCase()}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `donation-invoice/${donation.id}`,
    },
    body: JSON.stringify({
      from,
      to: [donation.email],
      subject: `অনুদানের রসিদ ${invoiceNumber} | আল আহসান ফাউন্ডেশন`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#17324d"><h1>অনুদানের রসিদ</h1><p>প্রিয় ${escapeHtml(donation.name)},</p><p>আপনার অনুদান যাচাই করে গ্রহণ করা হয়েছে। পাশে থাকার জন্য আন্তরিক ধন্যবাদ।</p><table style="border-collapse:collapse;width:100%"><tr><td>রসিদ নম্বর</td><td>${invoiceNumber}</td></tr><tr><td>অনুদানের পরিমাণ</td><td>৳${Number(donation.amount).toLocaleString("bn-BD")}</td></tr><tr><td>মাধ্যম</td><td>${escapeHtml(donation.method)}</td></tr><tr><td>TrxID</td><td>${escapeHtml(donation.trxId)}</td></tr><tr><td>কার্যক্রম</td><td>${escapeHtml(donation.campaignTitle || "সাধারণ অনুদান")}</td></tr></table><p>আল আহসান ফাউন্ডেশন</p></div>`,
      text: `অনুদানের রসিদ ${invoiceNumber}\nপরিমাণ: ৳${donation.amount}\nমাধ্যম: ${donation.method}\nTrxID: ${donation.trxId}\nকার্যক্রম: ${donation.campaignTitle || "সাধারণ অনুদান"}`,
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "ইমেইল পাঠানো যায়নি।");
  return { invoiceNumber, emailId: result.id };
}

export default async (request) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });

  try {
    if (action === "public-settings" && request.method === "GET") {
      return json(await readJson(content, "settings", {
        siteName: "আল আহসান ফাউন্ডেশন",
        logo: "/Warm-Hearts-Initiative.png",
        primaryColor: "#4A90E2",
        overview: "মানবিক সহায়তা ও শীতবস্ত্র বিতরণের মাধ্যমে সুবিধাবঞ্চিত মানুষের পাশে দাঁড়াই।",
        overviewImage: "",
      }));
    }

    if (action === "public-campaigns" && request.method === "GET") {
      return json(await readJson(content, "campaigns", null));
    }

    if (action === "donation" && request.method === "POST") {
      const input = await request.json();
      const amount = Number(input.amount);
      const name = cleanText(input.name, 100);
      const email = cleanText(input.email, 254).toLowerCase();
      const phone = cleanText(input.phone, 24);
      const method = cleanText(input.method, 16);
      const trxId = cleanText(input.trxId, 80).replace(/\s/g, "").toUpperCase();
      if (!name || !/^\S+@\S+\.\S+$/.test(email) || !phone || !methods.has(method) || !trxId || !Number.isFinite(amount) || amount < 1 || amount > 1000000) {
        return json({ error: "নাম, সঠিক ইমেইল, মোবাইল নম্বর, মাধ্যম, TrxID ও ১–১০,০০,০০০ টাকার বৈধ অনুদান দিন।" }, 400);
      }
      const id = crypto.randomUUID();
      const record = {
        id,
        name,
        email,
        phone,
        method,
        trxId,
        amount,
        campaignId: input.campaignId ? Number(input.campaignId) : null,
        campaignTitle: cleanText(input.campaignTitle, 140),
        note: cleanText(input.note, 500),
        status: "pending",
        invoiceNumber: null,
        createdAt: new Date().toISOString(),
      };
      await donations.setJSON(`donation/${id}`, record, { onlyIfNew: true });
      // Atomically claim each transaction ID so concurrent duplicate submissions cannot both count.
      let transactionClaim;
      try {
        transactionClaim = await donations.setJSON(`trx/${trxId}`, { id }, { onlyIfNew: true });
      } catch (error) {
        await donations.delete(`donation/${id}`);
        throw error;
      }
      if (!transactionClaim.modified) {
        await donations.delete(`donation/${id}`);
        return json({ error: "এই TrxID আগে জমা দেওয়া হয়েছে।" }, 409);
      }
      return json({ success: true, donationId: id, message: "অনুদানের তথ্য জমা হয়েছে। যাচাই শেষে ইমেইলে রসিদ পাঠানো হবে।" }, 201);
    }

    if (action === "admin-data" && request.method === "GET") {
      const auth = await requireAdmin();
      if (auth.error) return auth.error;
      const [donationList, expenseList, settings, campaigns] = await Promise.all([
        donations.list({ prefix: "donation/" }),
        expenses.list({ prefix: "expense/" }),
        readJson(content, "settings", null),
        readJson(content, "campaigns", null),
      ]);
      const donationRows = await Promise.all(donationList.blobs.map(({ key }) => donations.get(key, { type: "json" })));
      const expenseRows = await Promise.all(expenseList.blobs.map(({ key }) => expenses.get(key, { type: "json" })));
      return json({
        donations: donationRows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        expenses: expenseRows.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        settings,
        campaigns,
      });
    }

    if (action === "admin" && request.method === "POST") {
      const auth = await requireAdmin();
      if (auth.error) return auth.error;
      const input = await request.json();

      if (input.action === "verify-donation") {
        const donation = await donations.get(`donation/${input.id}`, { type: "json" });
        if (!donation) return json({ error: "অনুদানের তথ্য পাওয়া যায়নি।" }, 404);
        if (donation.status === "approved") return json({ error: "এই অনুদান আগে যাচাই করা হয়েছে।" }, 409);
        if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
          return json({ error: "রসিদ ইমেইল পাঠাতে Netlify-তে RESEND_API_KEY ও RESEND_FROM_EMAIL নিরাপদে সেট করুন।" }, 503);
        }
        const receipt = await sendReceiptEmail(donation);
        const updated = { ...donation, status: "approved", invoiceNumber: receipt.invoiceNumber, approvedAt: new Date().toISOString(), emailId: receipt.emailId };
        await donations.setJSON(`donation/${input.id}`, updated);
        return json({ success: true, donation: updated, message: "অনুদান যাচাই হয়েছে এবং রসিদ ইমেইলে পাঠানো হয়েছে।" });
      }

      if (input.action === "reject-donation") {
        const donation = await donations.get(`donation/${input.id}`, { type: "json" });
        if (!donation) return json({ error: "অনুদানের তথ্য পাওয়া যায়নি।" }, 404);
        const updated = { ...donation, status: "rejected", rejectedAt: new Date().toISOString() };
        await donations.setJSON(`donation/${input.id}`, updated);
        return json({ success: true, donation: updated });
      }

      if (input.action === "add-expense") {
        const amount = Number(input.amount);
        const title = cleanText(input.title, 140);
        if (!title || !Number.isFinite(amount) || amount <= 0 || amount > 100000000) return json({ error: "ব্যয়ের শিরোনাম ও সঠিক টাকার পরিমাণ দিন।" }, 400);
        const record = { id: crypto.randomUUID(), title, category: cleanText(input.category, 80), amount, note: cleanText(input.note, 500), createdAt: new Date().toISOString(), createdBy: auth.user.email };
        const saved = await expenses.setJSON(`expense/${record.id}`, record, { onlyIfNew: true });
        if (!saved.modified) return json({ error: "ব্যয়ের তথ্য সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।" }, 500);
        return json({ success: true, expense: record }, 201);
      }

      if (input.action === "save-content") {
        const value = input.value;
        if (!value || typeof value !== "object") return json({ error: "সংরক্ষণের তথ্য সঠিক নয়।" }, 400);
        if (new TextEncoder().encode(JSON.stringify(value)).byteLength > 4_000_000) {
          return json({ error: "ছবি ও তথ্যের মোট আকার ৪ মেগাবাইটের মধ্যে রাখুন।" }, 413);
        }
        if (value.kind === "settings") {
          if (!validImage(value.settings?.logo) || !validImage(value.settings?.overviewImage)) {
            return json({ error: "লোগো বা ওভারভিউ ছবির ঠিকানা সঠিক নয়।" }, 400);
          }
          const settings = {
            siteName: cleanText(value.settings?.siteName, 80),
            logo: cleanText(value.settings?.logo, 3_000_000),
            primaryColor: /^#[0-9a-f]{6}$/i.test(value.settings?.primaryColor || "") ? value.settings.primaryColor : "#4A90E2",
            overview: cleanText(value.settings?.overview, 3000),
            overviewImage: cleanText(value.settings?.overviewImage, 3_000_000),
          };
          await content.setJSON("settings", settings);
          return json({ success: true, value: settings });
        }
        if (value.kind === "campaigns" && Array.isArray(value.campaigns) && value.campaigns.length <= 100) {
          if (value.campaigns.some((campaign) => !cleanText(campaign.title, 140))) {
            return json({ error: "প্রতিটি কার্যক্রমের নাম লিখুন।" }, 400);
          }
          if (value.campaigns.some((campaign) => !validImage(campaign.image))) {
            return json({ error: "কার্যক্রমের ছবি PNG, JPEG, WebP বা GIF হতে হবে, অথবা HTTPS ছবির ঠিকানা দিন।" }, 400);
          }
          const campaigns = value.campaigns.map((campaign) => ({
            ...campaign,
            title: cleanText(campaign.title, 140),
            description: cleanText(campaign.description, 2500),
            secondary_description: cleanText(campaign.secondary_description, 4000),
            image: cleanText(campaign.image, 3_000_000),
          }));
          await content.setJSON("campaigns", campaigns);
          return json({ success: true, campaigns });
        }
        return json({ error: "পরিচিতির ধরন সঠিক নয়।" }, 400);
      }

      return json({ error: "কাজটি শনাক্ত করা যায়নি।" }, 400);
    }

    return json({ error: "ঠিকানাটি পাওয়া যায়নি।" }, 404);
  } catch (error) {
    console.error("Netlify API error", error);
    return json({ error: "সার্ভারে সাময়িক সমস্যা হয়েছে। আবার চেষ্টা করুন; প্রয়োজনে প্রশাসকের সঙ্গে যোগাযোগ করুন।" }, 500);
  }
};
