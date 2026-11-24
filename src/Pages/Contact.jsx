import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useBranding } from "../context/BrandingContext";
import toast from "react-hot-toast";

const Contact = () => {
  const { settings } = useBranding();
  const contact = settings.contact || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে! ধন্যবাদ।");
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>{contact.headerTitle || "যোগাযোগ"} - {settings.siteName}</title></Helmet>

      {/* Header Section */}
      <header className="bg-primary text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">{contact.headerTitle || "যোগাযোগ"}</h1>
          <p className="mt-2 text-lg">
            {contact.headerSubtitle || "আপনার প্রশ্ন বা মতামত জানাতে আমাদের সঙ্গে যোগাযোগ করুন।"}
          </p>
        </div>
      </header>

      {/* Contact Form Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Form */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
              {contact.formTitle || "যোগাযোগ করুন"}
            </h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              {contact.formSubtitle || "নিচের ফর্মে আপনার বার্তা লিখুন, আমরা যোগাযোগ করার চেষ্টা করব।"}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-1 text-sm">
                  পূর্ণ নাম
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="আপনার নাম"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1 text-sm">
                  ইমেইল ঠিকানা
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="আপনার ইমেইল"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-1 text-sm">
                  বার্তা
                </label>
                <textarea
                  id="message"
                  rows="4"
                  placeholder="আপনার বার্তা"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-primary"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:opacity-90 font-semibold shadow transition"
              >
                বার্তা পাঠান
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
                যোগাযোগের তথ্য
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                যেকোনো প্রয়োজনে আমাদের সঙ্গে সরাসরি যোগাযোগ করতে পারেন।
              </p>
            </div>

            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-primary text-2xl">
                  <IoCallOutline />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">অনুদান ও হেল্পলাইন</p>
                  <p className="text-gray-800 font-semibold text-base">{contact.phone || "+৮৮০ ১৩১২৫১৫৬৪৩"}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-primary text-2xl">
                  <MdOutlineMarkEmailUnread />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">অফিসিয়াল ইমেইল</p>
                  <p className="text-gray-800 font-semibold text-base break-all">{contact.email || "alahsanfoundationbangladesh@gmail.com"}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-primary text-2xl">
                  <IoLocationOutline />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">ঠিকানা</p>
                  <p className="text-gray-800 font-semibold text-base">{contact.address || "বাংলাদেশ"}</p>
                </div>
              </li>
            </ul>

            {(contact.bkashNumber || contact.nagadNumber || contact.rocketNumber) && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">মোবাইল ব্যাংকিং অ্যাকাউন্ট নম্বর (ব্যক্তিগত):</p>
                <div className="text-xs text-gray-600 space-y-1">
                  {contact.bkashNumber && <p><span className="font-medium text-pink-600">বিকাশ:</span> {contact.bkashNumber}</p>}
                  {contact.nagadNumber && <p><span className="font-medium text-orange-600">নগদ:</span> {contact.nagadNumber}</p>}
                  {contact.rocketNumber && <p><span className="font-medium text-purple-600">রকেট:</span> {contact.rocketNumber}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-10 rounded-lg container mx-auto px-4 text-center my-8">
        <h2 className="text-3xl font-semibold">{contact.ctaTitle || "আজই আমাদের সঙ্গে যুক্ত হোন"}</h2>
        <p className="mt-2 text-lg">
          {contact.ctaSubtitle || "এই উদ্যোগের অংশ হয়ে মানুষের জীবনে ইতিবাচক পরিবর্তন আনুন।"}
        </p>
        <Link
          to={contact.ctaButtonLink || "/donate"}
          className="btn mt-4 px-6 py-3 bg-white text-primary rounded-lg shadow hover:bg-gray-100 font-semibold"
        >
          {contact.ctaButtonText || "অংশ নিন"}
        </Link>
      </section>
    </div>
  );
};

export default Contact;
