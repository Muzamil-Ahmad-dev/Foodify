/**
 * LoginModal.jsx
 * -----------------------------
 * A fully animated login modal component using React, Framer Motion,
 * and Tailwind CSS. It handles authentication via a backend API,
 * stores JWT token and user data in localStorage, and automatically
 * fetches user orders after successful login.
 *
 * Technologies:
 * - React (hooks: useState, useEffect)
 * - Framer Motion (for enter/exit animations)
 * - React Router (navigation and Link)
 * - Tailwind CSS (styling)
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiChefToque } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

/**
 * @param {boolean} isOpen - Controls modal visibility (true = open)
 * @param {function} onClose - Callback to close modal
 */
export default function LoginModal({ isOpen, onClose }) {
  // ------------------ STATE ------------------
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ------------------ HANDLERS ------------------

  /** Updates state on input change */
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /**
   * Handles user login
   * - Validates inputs
   * - Sends login request to backend
   * - Stores token & user info
   * - Fetches user orders post-login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Send login request
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Handle failed login
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // 🔹 Save token & user data locally
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));

      // 🔹 Immediately fetch user orders after login
      const ordersRes = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${data.data.token}` },
      });
      const ordersData = await ordersRes.json();

      if (ordersRes.ok && ordersData.success) {
        localStorage.setItem("orders", JSON.stringify(ordersData.data));
      } else {
        console.warn("Failed to fetch orders:", ordersData.message);
      }

      // Close modal & redirect to orders page
      onClose();
      navigate("/orders", {
        state: { message: "Login successful! Welcome back 🎉" },
      });
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ EFFECTS ------------------

  /** Close modal when ESC key is pressed */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ------------------ RENDER ------------------
  return (
    <AnimatePresence>
      {isOpen && (
        // Overlay background
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={onClose}
        >
          {/* Animated modal container */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Prevent overlay click
            className="bg-[#2D1B0E] p-6 rounded-2xl w-80 sm:w-96 shadow-2xl relative border-2 border-amber-900/50"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-amber-400 hover:text-amber-200 transition text-lg"
            >
              <FaTimes />
            </button>

            {/* Brand Header */}
            <div className="flex items-center space-x-2 justify-center mb-6">
              <GiChefToque className="text-3xl text-amber-500" />
              <h2 className="text-2xl font-bold text-amber-400">
                Foodie-Frenzy
              </h2>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-center mb-3 text-sm">{error}</p>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Field */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="px-4 py-2 rounded-xl border border-amber-700 bg-[#3A2413] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
              />

              {/* Password Field */}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="px-4 py-2 rounded-xl border border-amber-700 bg-[#3A2413] text-amber-100 placeholder-amber-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r from-orange-500 to-orange-700 text-white py-2 rounded-xl font-semibold shadow-lg transition-transform ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging In..." : "Login"}
              </motion.button>
            </form>

            {/* Signup Redirect */}
            <p className="text-center text-amber-300 mt-4 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-400 font-semibold hover:underline"
                onClick={onClose}
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
