/**
 * @file ContactPage.jsx
 * @description Contact page component allowing users to submit queries via form.
 * Includes a responsive layout, animation effects, form validation, 
 * and integration with backend contact API endpoint.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

/**
 * ContactPage Component
 * Handles user input, form submission, and response feedback.
 */
export default function ContactPage() {
  // -------------------------
  // Local State Management
  // -------------------------
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    dishName: "",
    query: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  // -------------------------
  // Input Change Handler
  // -------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -------------------------
  // Form Submit Handler
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", error: false });

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      console.log("Contact submitted successfully:", data);

      setStatus({
        loading: false,
        message: "Your query has been submitted successfully.",
        error: false,
      });

      // Reset form fields after successful submission
      setFormData({
        fullName: "",
        phoneNumber: "",
        emailAddress: "",
        address: "",
        dishName: "",
        query: "",
      });
    } catch (err) {
      console.error("Contact submission error:", err);
      setStatus({
        loading: false,
        message: "Something went wrong. Please try again later.",
        error: true,
      });
    }
  };

  // -------------------------
  // JSX Render
  // -------------------------
  return (
    <div>
      <Navbar />

      {/* Page Background */}
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-amber-700 p-6 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-bold text-center text-yellow-400 mb-12"
          >
            Connect With Us
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* --------------------------
                Left: Contact Information
               -------------------------- */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <InfoCard
                title="Our Headquarter"
                desc="329 Tirtani Nagar, Lucknow, UP 226020"
                color="orange"
                iconPath="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              />
              <InfoCard
                title="Contact Numbers"
                desc="+91 4504341225"
                color="green"
                iconPath="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
              />
              <InfoCard
                title="Email Addresses"
                desc="hexagonservice@gmail.com"
                color="orange"
                iconPath="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
              />
            </motion.div>

            {/* --------------------------
                Right: Contact Form
               -------------------------- */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-8 shadow-xl"
            >
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Form Fields */}
                {[
                  { label: "Full Name", name: "fullName" },
                  { label: "Phone Number", name: "phoneNumber" },
                  { label: "Email Address", name: "emailAddress" },
                  { label: "Address", name: "address" },
                  { label: "Dish Name", name: "dishName" },
                ].map((field, i) => (
                  <motion.div key={i} whileFocus={{ scale: 1.02 }}>
                    <label className="block text-white font-medium mb-2">
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      type="text"
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      className="w-full px-4 py-3 bg-black/30 border border-orange-400/30 rounded-lg 
                                 text-white placeholder-gray-400 focus:outline-none 
                                 focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    />
                  </motion.div>
                ))}

                {/* Query Field */}
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <label className="block text-white font-medium mb-2">
                    Your Query
                  </label>
                  <textarea
                    name="query"
                    value={formData.query}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 bg-black/30 border border-orange-400/30 rounded-lg 
                               text-white placeholder-gray-400 focus:outline-none 
                               focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none"
                  ></textarea>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={status.loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 
                             hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg 
                             transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  {status.loading ? "Sending..." : "Submit Query"}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>

                {/* Status Message */}
                {status.message && (
                  <p
                    className={`text-center font-medium mt-2 ${
                      status.error ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {status.message}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/**
 * InfoCard Component
 * Displays contact details like address, phone, and email with an icon.
 */
const InfoCard = ({ title, desc, color, iconPath }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-black/20 backdrop-blur-sm rounded-lg p-6 border-l-4 border-${color}-500 shadow-lg`}
  >
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 bg-${color}-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
      >
        <svg
          className="w-4 h-4 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-300">{desc}</p>
      </div>
    </div>
  </motion.div>
);
