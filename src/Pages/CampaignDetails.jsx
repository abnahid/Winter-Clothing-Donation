import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import CampaignOwner from "./CampaignOwner";
import { useBranding } from "../context/BrandingContext";

const CampaignDetails = () => {
  const campaign = useLoaderData();
  const { settings } = useBranding();

  const [form, setForm] = useState({
    quantity: "",
    itemType: "",
    pickupLocation: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("ধন্যবাদ! আমরা শিগগিরই আপনার ঠিকানায় যোগাযোগ করব।");
    setForm({
      quantity: "",
      itemType: "",
      pickupLocation: "",
      notes: "",
    });
  };

  return (
    <div className="w-11/12 mx-auto pt-5 block lg:grid lg:grid-cols-12 gap-5">
      <Helmet>
        <title>{campaign.title} - {settings.siteName}</title>
      </Helmet>
      <div className="col-span-8">
        <h1 className="text-3xl font-bold">{campaign.title}</h1>
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-80 object-cover object-top mt-4 rounded-lg"
        />
        <p className="mt-4 text-gray-600">{campaign.description}</p>
        <p className="mt-4 text-gray-600 text-justify">
          {campaign.secondary_description}
        </p>
        <p className="mt-4 text-gray-500">
          <strong>বিভাগ:</strong> {campaign.division}
        </p>
        <p className="mt-2 text-gray-500">
          <strong>অবস্থা:</strong> {campaign.status === "Active" ? "চলমান" : campaign.status}
        </p>
        <p className="mt-2 text-gray-500">
          <strong>যোগাযোগের তথ্য:</strong> {campaign.contactInfo}
        </p>

        <Link to={`/donate?campaignId=${campaign.id}`} className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white">এই কার্যক্রমে অর্থ অনুদান দিন</Link>

        {/* Donation Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg px-8 pt-6 pb-8 mt-8"
        >
          <h2 className="text-2xl font-bold mb-4">সামগ্রী অনুদান দিন</h2>

          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              সামগ্রীর পরিমাণ
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="যেমন: ২টি জ্যাকেট, ৩টি কম্বল"
              className="outline-blue-600 appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          {/* Item Type */}
          <div className="mb-4">
            <label
              htmlFor="itemType"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              সামগ্রীর ধরন
            </label>
            <select
              id="itemType"
              name="itemType"
              value={form.itemType}
              onChange={handleChange}
              className="outline-blue-600 appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">সামগ্রীর ধরন বেছে নিন</option>
              <option value="blanket">কম্বল</option>
              <option value="jacket">জ্যাকেট</option>
              <option value="sweater">সোয়েটার</option>
            </select>
          </div>

          {/* Pickup Location */}
          <div className="mb-4">
            <label
              htmlFor="pickupLocation"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              সংগ্রহের ঠিকানা
            </label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              placeholder="যেমন: বাড়ি ১২, সড়ক ৫, ধানমন্ডি, ঢাকা"
              className="outline-blue-600 appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          {/* Additional Notes */}
          <div className="mb-4">
            <label
              htmlFor="notes"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              অতিরিক্ত তথ্য (ঐচ্ছিক)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="প্রয়োজনীয় অতিরিক্ত তথ্য"
              className="outline-blue-600 appearance-none border rounded w-full py-2 px-3 text-gray-700"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#1da1f2] to-[#0e71c8] animate-gradient text-white px-6 py-2 rounded-md"
          >
            অনুদানের তথ্য জমা দিন
          </button>
        </form>
      </div>

      <div className="col-span-4">
        <CampaignOwner className="mt-4" />
      </div>
    </div>
  );
};

export default CampaignDetails;
