import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useBranding } from "../context/BrandingContext";

const Footer = () => {
  const { settings } = useBranding();
  const contact = settings.contact || {};

  return (
    <footer className="relative bg-primary rounded-2xl p-8 md:p-10 w-11/12 mx-auto text-BgColor mt-12 shadow-lg">
      {/* Content */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
        {/* About Us Section */}
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-3">
            {settings.logo && (
              <img src={settings.logo} alt={settings.siteName} className="h-8 w-8 rounded object-contain bg-white p-0.5" />
            )}
            <h2 className="text-2xl font-bold tracking-tight text-white">{settings.siteName}</h2>
          </div>

          <p className="text-sm md:text-base text-gray-100 leading-relaxed">
            {contact.footerDescription || settings.overview || "মানবিক সহায়তা ও শীতবস্ত্র বিতরণের মাধ্যমে মানুষের পাশে দাঁড়াই। আমাদের উদ্যোগে যুক্ত হোন।"}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3">
          <p className="text-base font-bold text-white uppercase tracking-wider">দ্রুত লিংক</p>
          <ul className="space-y-2 flex flex-col text-sm text-gray-100">
            <li><NavLink to="/campaigns" className="hover:underline">অনুদান কার্যক্রম</NavLink></li>
            <li><NavLink to="/donate" className="hover:underline">অর্থ অনুদান</NavLink></li>
            <li><NavLink to="/how-to-help" className="hover:underline">কীভাবে সহায়তা করবেন</NavLink></li>
            <li><NavLink to="/about" className="hover:underline">আমাদের সম্পর্কে</NavLink></li>
            <li><NavLink to="/contact" className="hover:underline">যোগাযোগ</NavLink></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <p className="text-base font-bold text-white uppercase tracking-wider">যোগাযোগের ঠিকানা</p>
          <ul className="space-y-2 text-sm text-gray-100">
            <li>{contact.address || "বাংলাদেশ"}</li>
            <li>{contact.email || "alahsanfoundationbangladesh@gmail.com"}</li>
            <li>হেল্পলাইন: {contact.phone || "+৮৮০ ১৩১২৫১৫৬৪৩"}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 my-6"></div>

      {/* Bottom Bar */}
      <aside className="flex items-center justify-between flex-col md:flex-row gap-4">
        <p className="text-xs md:text-sm text-gray-200 text-center md:text-left">
          কপিরাইট © {new Date().getFullYear()} · সর্বস্বত্ব সংরক্ষিত — {settings.siteName}
        </p>
        <div className="flex items-center space-x-3">
          {contact.facebookUrl && (
            <a
              className="rounded-full bg-white p-2.5 text-[#1877F2] hover:scale-110 transition shadow-sm"
              href={contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF size={16} />
            </a>
          )}
          {contact.twitterUrl && (
            <a
              className="rounded-full bg-white p-2.5 text-[#1DA1F2] hover:scale-110 transition shadow-sm"
              href={contact.twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter size={16} />
            </a>
          )}
          {contact.instagramUrl && (
            <a
              className="rounded-full bg-white p-2.5 text-[#F56040] hover:scale-110 transition shadow-sm"
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={16} />
            </a>
          )}
          {contact.youtubeUrl && (
            <a
              className="rounded-full bg-white p-2.5 text-[#FF0000] hover:scale-110 transition shadow-sm"
              href={contact.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube size={16} />
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              className="rounded-full bg-white p-2.5 text-[#0A66C2] hover:scale-110 transition shadow-sm"
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={16} />
            </a>
          )}
        </div>
      </aside>
    </footer>
  );
};

export default Footer;
