import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative bg-primary rounded-2xl p-10 w-11/12 mx-auto text-BgColor mt-12">
      {/* Content */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
        {/* About Us Section */}
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="normal-case text-2xl font-semibold">
              <h1>Warm Hearts</h1>
            </div>
          </div>

          <p className="text-base text-gray-200 max-w-72">
            empowers communities through generosity and impactful actions. Join
            us to make a difference together.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-4">
          <p className="text-base font-bold text-BgColor">About us</p>
          <ul className="space-y-1 flex flex-col">
            <NavLink to="/campaigns" className="text-gray-200 link link-hover">
              Donation
            </NavLink>
            <li className="text-gray-200 link link-hover">Events</li>
            <li className="text-gray-200 link link-hover">Blog</li>
            <NavLink to="/about" className="text-gray-200 link link-hover">
              About
            </NavLink>
            <NavLink to="/contact" className="text-gray-200 link link-hover">
              Contact Us
            </NavLink>
          </ul>
        </div>

        <div className="space-y-4 pr-10">
          <div className="footer-title opacity-100 text-BgColor">
            Contact Us
          </div>
          <ul className="space-y-1">
            <li>
              <a>
                123 Winter Lane,
                <br /> Dhaka, Bangladesh
              </a>
            </li>
            <li>
              <a>support@warmhearts.com</a>
            </li>
            <li>
              <a>+880 123-456-7890</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-BgColor border-t my-4 "></div>
      {/* Footer */}
      <aside className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
        <p className="text-BgColor">
          Copyright © {new Date().getFullYear()} - All right reserved by Warm
          Hearts Initiative
        </p>
        <div className="flex mt-4 space-x-4 sm:justify-center lg:mt-0">
          <a
            className="rounded-full bg-BgColor p-2 mr-2"
            href="https://www.facebook.com/abnahidagency"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF className="text-[#1877F2]"></FaFacebookF>
          </a>
          <a
            className="rounded-full bg-BgColor p-2 mr-2"
            href="https://twitter.com/xahid_420"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="text-[#1DA1F2]"></FaTwitter>
          </a>
          <a
            className="rounded-full bg-BgColor p-2 mr-2"
            href="https://www.instagram.com/abnahidseo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-[#F56040]"></FaInstagram>
          </a>
        </div>
      </aside>
    </footer>
  );
};

export default Footer;
