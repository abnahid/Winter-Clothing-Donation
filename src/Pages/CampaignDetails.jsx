import { useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { useLoaderData } from "react-router-dom";
import CampaignOwner from "./CampaignOwner";

const CampaignDetails = () => {
  const campaign = useLoaderData();

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
    toast.success("Thank you! We will reach your destination soon.");
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
        <title>{campaign.title} - Warm Hearts</title>
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
          <strong>Division:</strong> {campaign.division}
        </p>
        <p className="mt-2 text-gray-500">
          <strong>Status:</strong> {campaign.status}
        </p>
        <p className="mt-2 text-gray-500">
          <strong>Contact Info:</strong> {campaign.contactInfo}
        </p>

        {/* Donation Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg px-8 pt-6 pb-8 mt-8"
        >
          <h2 className="text-2xl font-bold mb-4">Donate Items</h2>

          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Quantity of Items
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g., 2 jackets, 3 blankets"
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
              Item Type
            </label>
            <select
              id="itemType"
              name="itemType"
              value={form.itemType}
              onChange={handleChange}
              className="outline-blue-600 appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            >
              <option value="">Select Item Type</option>
              <option value="blanket">Blanket</option>
              <option value="jacket">Jacket</option>
              <option value="sweater">Sweater</option>
            </select>
          </div>

          {/* Pickup Location */}
          <div className="mb-4">
            <label
              htmlFor="pickupLocation"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Pickup Location
            </label>
            <input
              type="text"
              id="pickupLocation"
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              placeholder="e.g., House 12, Road 5, Dhanmondi, Dhaka"
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
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Any additional details"
              className="outline-blue-600 appearance-none border rounded w-full py-2 px-3 text-gray-700"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-[#1da1f2] to-[#0e71c8] animate-gradient text-white px-6 py-2 rounded-md"
          >
            Submit Donation
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
