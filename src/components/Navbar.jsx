import { useContext, useState } from "react";

import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Navbar = () => {
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
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/campaigns"
          className={({ isActive }) => (isActive ? activeStyle : "")}
        >
          Donation Campaigns
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/how-to-help"
          className={({ isActive }) => (isActive ? activeStyle : "")}
        >
          How to Help
        </NavLink>
      </li>
      {user?.email && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? activeStyle : "")}
          >
            Dashboard
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
        <Link className="px-4 normal-case text-2xl font-semibold gap-1 md:block hidden">
          <h1>Warm Hearts</h1>
          <p className="text-sm hidden md:block ">Initiative</p>
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
                  Profile
                  <span className="badge bg-green-200 text-green-800">New</span>
                </Link>
              </li>
              <li>
                <Link>Settings</Link>
              </li>
              <li>
                <button onClick={signOutUser} className="text-red-600">
                  Logout
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
              Login
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
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
