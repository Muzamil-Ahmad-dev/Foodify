/**
 * App.jsx
 * ---------------------------------
 * Application Entry Component
 *
 * Description:
 * Defines the main route configuration for the entire React application.
 * Each route is linked to its respective page component.
 *
 * Technologies Used:
 * - React Router DOM → for client-side routing
 * - React → core framework for UI rendering
 *
 * Route Overview:
 *  "/"           → Home Page
 *  "/Contact"    → Contact Page
 *  "/About"      → About Page
 *  "/menu"       → Menu Page
 *  "/orders"     → Order History Page
 *  "/Login"      → (Temporary) Home Page
 *  "/SignUp"     → User Registration Page
 *  "/Cart"       → Cart Page
 *  "/checkout"   → Checkout Page
 */

import React from "react";
import "./index.css"; // Global CSS import (Tailwind / custom styles)
import { Route, Routes } from "react-router-dom";

// --------------------------
// Page Imports
// --------------------------
import Home from "./pages/home/Home";
import ContactPage from "./pages/contactPage/ContactPage";
import AboutPage from "./pages/aboutPage/AboutPage";
import Menu from "./pages/menu/Menu";
import OrderHistory from "./pages/orders/Orders";
import SignUp from "./components/signUp/SignUp";
import CartPage from "./pages/cartPage/CartPage";
import Checkout from "./pages/checkout/Checkout";

// --------------------------
// Main App Component
// --------------------------
export default function App() {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/Contact" element={<ContactPage />} />
      <Route path="/About" element={<AboutPage />} />

      {/* Product & Orders */}
      <Route path="/menu" element={<Menu />} />
      <Route path="/orders" element={<OrderHistory />} />

      {/* Authentication */}
      <Route path="/Login" element={<Home />} /> {/* TODO: Replace with Login component */}
      <Route path="/SignUp" element={<SignUp />} />

      {/* Cart & Checkout */}
      <Route path="/Cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}
