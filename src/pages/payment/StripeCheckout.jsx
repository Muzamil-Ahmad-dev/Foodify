/**
 * StripeCheckout Component
 * ------------------------
 * This module handles secure Stripe payment integration in the frontend.
 * It uses the official @stripe/react-stripe-js and @stripe/stripe-js packages.
 *
 * Features:
 * - Creates a Payment Intent on the backend for the entered amount.
 * - Uses CardElement for card input (securely handled by Stripe).
 * - Confirms the payment and reports success/failure to parent components.
 *
 * File Structure:
 * src/components/payment/StripeCheckout.jsx
 *
 * External Dependencies:
 * - @stripe/stripe-js
 * - @stripe/react-stripe-js
 * 
 * Expected Backend Endpoint:
 * POST /api/payment/create-payment-intent
 * Body: { amount: <integer in smallest currency unit>, currency: "usd" }
 */

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Stripe public test key (never expose secret key)
const stripePromise = loadStripe(
  "pk_test_51RUqxWC1iB5TdQiSEWzTXE9ExlC1aGBusgNuBj9ktBqht5ZXEEJmH2XXRmeLx3effEtCUx9Nk1EkDV65u4b3Ni4500MqMlisL4"
);

/**
 * CheckoutForm Component
 * ----------------------
 * Handles form submission, creates a Payment Intent, and confirms the card payment.
 *
 * Props:
 *  - totalAmount (Number): total payment amount in major currency units (e.g., USD)
 *  - setPaymentDone (Function): optional callback triggered on successful payment
 *  - onPaymentSuccess (Function): optional callback with paymentIntent data
 */
function CheckoutForm({ totalAmount, setPaymentDone, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  /**
   * handleSubmit
   * -------------
   * Main payment submission handler.
   * Steps:
   *  1. Create a payment intent via backend API.
   *  2. Confirm card payment using Stripe.js.
   *  3. Handle success and error states.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // Create a Payment Intent on backend
      const res = await fetch("https://1e20a7ed-cc85-497b-b510-b41debc2f036-00-1p28dt788ywz9.pike.replit.dev/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // Convert dollars → cents
          currency: "usd",
        }),
      });

      const data = await res.json();
      const clientSecret = data?.clientSecret || data?.client_secret;

      if (!clientSecret) throw new Error("No clientSecret returned from server.");

      // Confirm payment using Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      // Handle payment result
      if (result.error) {
        alert(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        alert("✅ Payment Successful!");

        // Notify parent components
        if (typeof setPaymentDone === "function") setPaymentDone(true);
        if (typeof onPaymentSuccess === "function") onPaymentSuccess(result.paymentIntent);
      } else {
        alert("Payment status: " + (result.paymentIntent?.status || "unknown"));
      }
    } catch (err) {
      console.error("Stripe payment error:", err);
      alert("⚠️ Payment failed: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* Stripe Card Input Field */}
      <CardElement className="p-4 border border-amber-600 rounded-lg bg-amber-900/30 text-white" />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
      >
        {loading ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
}

/**
 * StripeCheckout Wrapper
 * ----------------------
 * Wraps the CheckoutForm inside <Elements> provider (required by Stripe.js).
 *
 * Props:
 *  - totalAmount (Number)
 *  - setPaymentDone (Function)
 *  - onPaymentSuccess (Function)
 */
export default function StripeCheckout({ totalAmount, setPaymentDone, onPaymentSuccess }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        totalAmount={totalAmount}
        setPaymentDone={setPaymentDone}
        onPaymentSuccess={onPaymentSuccess}
      />
    </Elements>
  );
}
