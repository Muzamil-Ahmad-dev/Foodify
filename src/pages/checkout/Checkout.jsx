/**
 * @file Checkout.jsx
 * @description Checkout page for processing user orders with both COD and Stripe payment options.
 * @component
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { ChevronDown, Lock } from "lucide-react";
import StripeCheckout from "../payment/StripeCheckout";

export default function Checkout() {
  /**
   * @state formData - Stores customer information for the checkout form.
   */
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
  });

  /**
   * @state paymentMethod - Tracks selected payment option (COD / Stripe)
   * @state isDropdownOpen - Controls visibility of payment dropdown
   * @state loading - Indicates order submission in progress
   */
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * @redux cartItems - Fetch items from Redux cart state
   */
  const cartItems = useSelector((state) => state.cart.cart);

  /**
   * @calculations subtotal, tax, totalPrice - Order pricing logic
   */
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const totalPrice = subtotal + tax;

  /**
   * Handles controlled form input updates.
   * @param {object} e - Input change event
   */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * @constant paymentOptions - Available payment choices for the user
   */
  const paymentOptions = [
    { value: "cod", label: "Cash on Delivery" },
    { value: "online", label: "Online Payment (Stripe)" },
  ];

  /**
   * Updates selected payment method and closes dropdown.
   * @param {string} value - Selected payment option
   */
  const handlePaymentSelect = (value) => {
    setPaymentMethod(value);
    setIsDropdownOpen(false);
  };

  /**
   * Creates a new order in the backend.
   * Handles both COD and Stripe-based payments.
   * @param {string|null} paymentId - Stripe payment intent ID if applicable
   */
  const createOrder = async (paymentId = null) => {
    const token = localStorage.getItem("token");

    // Authentication & form validation
    if (!token) return alert("Please log in to place an order.");
    if (!formData.firstName || !formData.address || !formData.city)
      return alert("Please fill all required fields.");
    if (cartItems.length === 0) return alert("Your cart is empty!");

    setLoading(true);

    const orderData = {
      ...formData,
      items: cartItems,
      totalPrice,
      paymentMethod,
      paymentId: paymentId || null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create order");

      alert("Order placed successfully!");
      console.log("Order Created:", data);

      // Optionally clear cart or navigate to order history
      // dispatch(clearCart());
      // navigate("/order-history");
    } catch (err) {
      console.error(" Order creation error:", err);
      alert(` ${err.message || "Something went wrong while creating the order"}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles order creation for COD payments.
   */
  const handleSubmit = async () => {
    if (!paymentMethod) return alert("Please select a payment method.");
    if (paymentMethod === "online")
      return alert("Please complete your Stripe payment to place an order.");

    await createOrder();
  };

  /**
   * Called on successful Stripe payment.
   * @param {object} paymentIntent - Stripe payment intent response
   */
  const handlePaymentSuccess = async (paymentIntent) => {
    console.log(" Stripe Payment Success:", paymentIntent);

    if (!paymentIntent?.id)
      return alert("Payment confirmation failed. Please try again.");

    await createOrder(paymentIntent.id);
    alert(" Payment and Order created successfully!");
  };

  // ------------------- JSX RETURN ------------------- //
  return (
    <div className="min-h-screen flex flex-col bg-amber-950">
      <Navbar />

      <main className="flex-grow px-4 py-6 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ---------------- LEFT SECTION: USER INFO ---------------- */}
            <div className="bg-amber-900/40 rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="text-white text-2xl font-semibold mb-6">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "firstName", label: "First Name" },
                  { name: "lastName", label: "Last Name" },
                  { name: "phone", label: "Phone" },
                  { name: "email", label: "Email", type: "email" },
                  { name: "address", label: "Address", colSpan: true },
                  { name: "city", label: "City" },
                  { name: "zipCode", label: "Zip Code" },
                ].map((field, idx) => (
                  <div key={idx} className={field.colSpan ? "md:col-span-2" : ""}>
                    <label className="block text-white/80 text-sm mb-2">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.label}
                      className="w-full bg-amber-800/30 border border-amber-700/50 rounded-lg px-4 py-3 text-white placeholder-white/50 
                      focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------- RIGHT SECTION: PAYMENT DETAILS ---------------- */}
            <div className="bg-amber-900/40 rounded-2xl p-6 md:p-8 shadow-lg">
              <h2 className="text-white text-2xl font-semibold mb-6">
                Payment Details
              </h2>

              {/* CART SUMMARY */}
              <div className="mb-8">
                <h3 className="text-amber-400 text-lg font-medium mb-4">
                  Your Order Items
                </h3>
                {cartItems.length > 0 ? (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-white/90 mb-2"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/60">Your cart is empty</p>
                )}
              </div>

              {/* ORDER TOTALS */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-white/80">
                  <span>Subtotal:</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Tax (5%):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-amber-700/50 pt-3">
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD DROPDOWN */}
              <div className="mb-8">
                <label className="block text-white/80 text-sm mb-3">
                  Payment Method
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-amber-800/30 border border-amber-700/50 rounded-lg px-4 py-3 text-white flex justify-between items-center 
                    focus:outline-none focus:border-amber-500 transition"
                  >
                    <span className={paymentMethod ? "text-white" : "text-white/50"}>
                      {paymentOptions.find((opt) => opt.value === paymentMethod)?.label ||
                        "Select Method"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-amber-800 border border-amber-700/50 rounded-lg shadow-lg z-10">
                      {paymentOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePaymentSelect(option.value)}
                          className="w-full px-4 py-3 text-left text-white hover:bg-amber-700/50 transition"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* STRIPE PAYMENT SECTION */}
              {paymentMethod === "online" && (
                <div className="mb-6">
                  <StripeCheckout
                    totalAmount={totalPrice}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                </div>
              )}

              {/* ORDER SUBMIT BUTTON */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 
                text-white font-semibold py-4 px-6 rounded-lg flex items-center justify-center gap-2 
                transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
              >
                <Lock className="w-5 h-5" />
                {loading ? "Placing Order..." : "Complete Order"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
