import { useContext, useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { useBranding } from "../context/BrandingContext";

const Navbar = () => {
  const { settings } = useBranding();
  const { user, signOutUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("register");
  const activeStyle = "font-semibold text-primary ";

  const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? activeStyle : "")}
        >
          হোম
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/campaigns"
          className={({ isActive }) => (isActive ? activeStyle : "")}
        >
          অনুদান কার্যক্রম
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/how-to-help"
          className={({ isActive }) => (isActive ? activeStyle : "")}
        >
          কীভাবে সহায়তা করবেন
        </NavLink>
      </li>
      {user?.email && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? activeStyle : "")}
          >
            ড্যাশবোর্ড
          </NavLink>
        </li>
      )}
    </>
  );
  const fullName = user?.displayName || "";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0];
  return (
    <div className="navbar bg-base-100 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex="0" role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex="0"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-60 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <Link to="/" className="flex items-center gap-3 px-4 text-xl font-bold">
          <img src={settings.logo} alt={settings.siteName} className="h-10 w-10 rounded-lg object-contain" />
          <span className="hidden md:inline">{settings.siteName}</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-3 px-1">{links}</ul>
      </div>

      <div className="navbar-end">
        <p className="normal-case text-lg font-semibold mr-3 hidden md:block">
          {firstName}
        </p>
        {user && user?.email ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img alt="User Avatar" src={user?.photoURL} />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-60 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  প্রোফাইল
                  <span className="badge bg-green-200 text-green-800">New</span>
                </Link>
              </li>
              <li><Link to="/admin">অ্যাডমিন প্যানেল</Link></li>
              <li><Link to="/dashboard">সেটিংস</Link></li>
              <li>
                <button onClick={signOutUser} className="text-red-600">
                  লগআউট
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={`${
                activeTab === "login"
                  ? "bg-blue-500 text-white font-semibold"
                  : "text-cyan-900"
              } px-6 py-2 rounded-lg text-sm font-normal `}
              onClick={() => setActiveTab("login")}
            >
              লগইন
            </Link>
            <Link
              to="/register"
              className={`${
                activeTab === "register"
                  ? "bg-blue-500 text-white font-semibold"
                  : "text-cyan-900"
              } px-6 py-2 rounded-lg text-sm font-normal`}
              onClick={() => setActiveTab("register")}
            >
              নিবন্ধন
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
