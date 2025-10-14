/**
 * @file CartPage.jsx
 * @description
 * The Cart Page component displays the user's current shopping cart,
 * providing interactive quantity controls, item removal, total price calculation,
 * and navigation options (continue shopping, checkout, or return home).
 *
 * This component integrates Redux for state management and uses
 * Lucide React icons for consistent, lightweight UI visuals.
 *
 * @module Pages/CartPage
 * @author 
 * Muzamil Ahmad
 *
 * @dependencies
 * - React & React-Redux (useSelector, useDispatch)
 * - Redux Slice: cartSlice (addToCart, removeFromCart, decreaseQuantity)
 * - Lucide React for icons
 * - React Router DOM for navigation
 * - Tailwind CSS for layout and styling
 * - Custom Components: Navbar, Footer
 */

import React from "react";
import { Plus, Minus, ShoppingCart, ArrowRight, Trash2, Home } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, decreaseQuantity } from "../../Redux/Slice/cartSlice"; 
import { Link } from "react-router-dom";  
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function CartPage() {
  /**
   * Redux dispatch function used to trigger cart actions.
   */
  const dispatch = useDispatch();

  /**
   * Selects the current cart state from the Redux store.
   */
  const cartItems = useSelector((state) => state.cart.cart);

  /**
   * Calculates the total cart value by summing up
   * the product of price and quantity for all cart items.
   */
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div>
      <Navbar />

      {/* Main Wrapper */}
      <div className="min-h-screen bg-amber-900 p-6 sm:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-serif text-yellow-400 text-center mb-10 sm:mb-16 italic">
            Your Cart
          </h1>

          {/* Cart Items Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-10 mb-12">
            {cartItems.length === 0 ? (
              // Empty Cart State
              <div className="flex flex-col items-center justify-center gap-6 col-span-full mt-12">
                <ShoppingCart className="w-24 h-24 text-yellow-400 animate-bounce" /> 
                <p className="text-2xl text-yellow-300 font-medium">Your cart is empty</p>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-6 py-3 bg-amber-800 border border-yellow-400 text-yellow-400 rounded-md hover:bg-amber-700 transition"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Link>
              </div>
            ) : (
              // Render Cart Items
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-amber-800 border-2 border-dashed border-yellow-400 rounded-lg p-5 sm:p-6"
                >
                  {/* Product Image */}
                  <div className="w-28 h-28 mx-auto mb-4 bg-amber-700 rounded-lg overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Name & Price */}
                  <h3 className="text-yellow-400 text-lg text-center mb-2">{item.name}</h3>
                  <p className="text-yellow-400 text-center mb-4">
                    ₹{Number(item.price).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                      onClick={() => dispatch(decreaseQuantity(item.id))}
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-yellow-400 text-yellow-400 hover:bg-amber-700 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="text-yellow-400">{item.quantity}</span>

                    <button
                      onClick={() => dispatch(addToCart({ id: item.id }))}
                      className="w-8 h-8 flex items-center justify-center rounded-md border border-yellow-400 text-yellow-400 hover:bg-amber-700 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Item Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="flex items-center gap-2 px-3 py-1 border border-yellow-400 rounded-md text-yellow-400 hover:bg-amber-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      REMOVE
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-yellow-400 text-right mt-4 font-medium">
                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary Section */}
          {cartItems.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Continue Shopping */}
              <Link
                to="/menu"
                className="flex items-center gap-2 px-8 py-3 bg-amber-800 border border-yellow-400 text-yellow-400 rounded-md hover:bg-amber-700 transition"
              >
                <ShoppingCart className="w-5 h-5" />
                CONTINUE SHOPPING
              </Link>

              {/* Home Link */}
              <Link
                to="/"
                className="flex items-center gap-2 px-8 py-3 bg-amber-800 border border-yellow-400 text-yellow-400 rounded-md hover:bg-amber-700 transition"
              >
                <Home className="w-5 h-5" />
                HOME
              </Link>

              {/* Total Amount */}
              <div className="text-yellow-400 text-2xl">
                Total: ₹{total.toFixed(2)}
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="flex items-center gap-2 px-8 py-3 bg-amber-700 border border-yellow-400 text-yellow-400 rounded-md hover:bg-amber-600 transition"
              >
                CHECKOUT NOW
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
