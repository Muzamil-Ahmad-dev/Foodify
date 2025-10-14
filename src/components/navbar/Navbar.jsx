/**
 * Navbar.jsx
 * ---------------------------------------------------------------------
 * Responsive navigation bar for the Foodify web app.
 * Handles navigation, user authentication, cart display, and modal control.
 * 
 * Technologies:
 * - React (functional components, hooks)
 * - React Router (routing & navigation)
 * - Redux (cart state)
 * - Tailwind CSS (styling & layout)
 * 
 * Key Features:
 * - Responsive design (desktop & mobile)
 * - Dynamic cart counter from Redux store
 * - Login/logout state persistence using localStorage
 * - Integrated login modal popup
 * - Smooth transitions and hover effects
 */

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GiChefToque, GiForkKnifeSpoon } from "react-icons/gi";
import {
  FaHome,
  FaRegStar,
  FaPhoneAlt,
  FaBoxOpen,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import LoginModal from "../login/Login";

/**
 * Main navigation component.
 * Displays links, cart status, and authentication controls.
 */
const Navbar = () => {
  const navigate = useNavigate();

  // ----------------- State -----------------
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Login modal state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication status

  // Check authentication status when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Get total items in cart from Redux
  const cartCount = useSelector((state) =>
    state.cart.cart.reduce((sum, item) => sum + item.quantity, 0)
  );

  // Navigation link configuration
  const navLinks = [
    { name: "Home", to: "/", icon: <FaHome /> },
    { name: "Menu", to: "/menu", icon: <MdMenuBook /> },
    { name: "About", to: "/about", icon: <FaRegStar /> },
    { name: "Contact", to: "/contact", icon: <FaPhoneAlt /> },
    { name: "Orders", to: "/orders", icon: <FaBoxOpen /> },
  ];

  // ----------------- Handlers -----------------

  // Logout handler: clear user data and reset auth state
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("orders");
    setIsLoggedIn(false);
    navigate("/");
  };

  // Common button styling for login/logout
  const buttonClass =
    "px-3 py-1.5 flex items-center gap-2 rounded-2xl text-sm font-semibold " +
    "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow hover:scale-105 " +
    "transition-all duration-300";

  // ----------------- Render -----------------
  return (
    <>
      <nav className="bg-[#2D1B0E] border-b-8 border-amber-900/30 shadow-amber-900/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] font-sans">
        {/* Top decorative gradient line */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
          <div className="h-[6px] bg-gradient-to-r from-transparent via-amber-600/50 to-transparent shadow[0_0_20px] shadow-amber-500/30" />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16 lg:h-18 xl:h-20">
            {/* Decorative left icon */}
            <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 -ml-2 rotate-45" size={32} />

            {/* Brand section */}
            <div className="flex items-center space-x-2 group relative">
              <div className="absolute -inset-4 bg-amber-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <GiChefToque className="text-2xl lg:text-3xl xl:text-4xl text-amber-500 transition-all group-hover:rotate-12 group-hover:text-amber-400 hover:drop-shadow-[0_0_15px] hover:drop-shadow-amber-500/50" />
              <div className="flex flex-col ml-2">
                <NavLink
                  to="/"
                  className="text-2xl lg:text-xl xl:text-3xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent tracking-wider drop-shadow-[0_2px_2px] truncate"
                >
                  Foodify
                </NavLink>
                <div className="h-[3px] bg-gradient-to-r from-amber-600/30 via-amber-400/50 to-amber-600/30 mt-1 ml-1 shadow-[0_2px_5px] shadow-amber-500/20"></div>
              </div>
            </div>

            {/* Decorative right icon */}
            <GiForkKnifeSpoon className="text-amber-500/40 -mt-4 -mr-2 rotate-45" size={32} />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 ml-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 flex items-center gap-2 rounded-2xl border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-[linear-gradient(to_right,oklab(0.414_0.0779366_0),oklab(0.666_0.0940116_0.152325))] text-white shadow-lg scale-105 border-amber-400"
                        : "text-amber-300 border-transparent hover:border-amber-400 hover:bg-[linear-gradient(to_right,oklab(0.414_0.0779366_0),oklab(0.666_0.0940116_0.152325))] hover:text-white hover:shadow-lg hover:scale-105"
                    }`
                  }
                >
                  {link.icon} {link.name}
                </NavLink>
              ))}
            </div>

            {/* Desktop Right Section: Cart + Auth */}
            <div className="hidden lg:flex items-center gap-4 ml-6">
              <div className="relative">
                <NavLink to="/cart">
                  <FiShoppingCart size={24} className="text-yellow-100" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-1.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </div>

              {isLoggedIn ? (
                <button onClick={handleLogout} className={buttonClass}>
                  <FaSignInAlt /> Logout
                </button>
              ) : (
                <button onClick={() => setIsLoginOpen(true)} className={buttonClass}>
                  <FaSignOutAlt /> Login
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-amber-400 focus:outline-none">
                {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-[#2D1B0E] border-t border-amber-900/50 px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 flex items-center gap-2 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-[linear-gradient(to_right,oklab(0.414_0.0779366_0),oklab(0.666_0.0940116_0.152325))] text-white shadow-md scale-105 border-amber-400"
                      : "text-amber-300 border-transparent hover:border-amber-400 hover:bg-[linear-gradient(to_right,oklab(0.414_0.0779366_0),oklab(0.666_0.0940116_0.152325))] hover:text-white hover:shadow-md hover:scale-105"
                  }`
                }
              >
                {link.icon} {link.name}
              </NavLink>
            ))}

            <div className="flex items-center justify-between mt-3">
              <div className="relative">
                <NavLink to="/cart" onClick={() => setIsOpen(false)}>
                  <FiShoppingCart size={24} className="text-yellow-100" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-1.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </div>

              {isLoggedIn ? (
                <button onClick={handleLogout} className={buttonClass}>
                  <FaSignInAlt /> Logout
                </button>
              ) : (
                <button onClick={() => setIsLoginOpen(true)} className={buttonClass}>
                  <FaSignOutAlt /> Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;
