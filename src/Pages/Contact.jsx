import { IoCallOutline, IoLocationOutline } from "react-icons/io5";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { Link } from "react-router-dom";
const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-blue-500 text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">যোগাযোগ</h1>
          <p className="mt-2 text-lg">
            We&apos;d love to hear from you! Reach out to us with any questions
            or feedback.
          </p>
        </div>
      </header>

      {/* Contact Form Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              যোগাযোগ করুন
            </h2>
            <p className="text-gray-600 mb-6">
              Fill out the form below, and we&apos;ll get back to you as soon as
              possible.
            </p>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-1"
                >
                  পূর্ণ নাম
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="আপনার নাম"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-primary"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-1"
                >
                  ইমেইল ঠিকানা
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="আপনার ইমেইল"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-primary"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-medium mb-1"
                >
                  বার্তা
                </label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="আপনার বার্তা"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg  outline-primary"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition"
              >
                বার্তা পাঠান
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              যোগাযোগের তথ্য
            </h2>
            <p className="text-gray-600 mb-6">
              You can also reach us via email or phone. Our team is here to
              assist you!
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <IoCallOutline className="text-2xl text-primary" />

                <span className="text-gray-700">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-4">
                <MdOutlineMarkEmailUnread className="text-2xl text-primary" />

                <span className="text-gray-700">info@warmhearts.com</span>
              </li>
              <li className="flex items-center gap-4">
                <IoLocationOutline className="text-2xl text-primary" />
                <span className="text-gray-700">
                  123 Charity Lane, Compassion City, Country
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-10 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold">আজই আমাদের সঙ্গে যুক্ত হোন</h2>
          <p className="mt-2 text-lg">
            এই উদ্যোগের অংশ হয়ে মানুষের জীবনে ইতিবাচক পরিবর্তন আনুন।
          </p>
          <Link
            to="/campaigns"
            className="btn mt-4 px-6 py-3 bg-white text-primary rounded-lg shadow hover:bg-gray-100"
          >
            অংশ নিন
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Contact;
