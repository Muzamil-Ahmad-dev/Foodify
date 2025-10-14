/**
 * Order History Page Component
 * -----------------------------
 * Displays a list of all user orders fetched from the backend API.
 * Allows logged-in users to review their past orders, including:
 *  - Order ID
 *  - Shipping address
 *  - Ordered items with thumbnails
 *  - Total price
 *  - Order status (Pending, Confirmed, Delivered)
 *
 * Dependencies:
 *  - React.js (Functional Components, Hooks)
 *  - react-router-dom (Navigation)
 *  - lucide-react (Icons)
 *  - Tailwind CSS (Styling)
 *
 * Data Flow:
 *  - Fetches user orders via an authenticated API call.
 *  - Stores data in local state.
 *  - Displays formatted results in a responsive table layout.
 */

import React, { useEffect, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function OrderHistory() {
  // Hooks
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * getImageUrl()
   * --------------
   * Utility function to ensure proper image URLs are generated,
   * supporting both local and hosted image paths.
   */
  const getImageUrl = (imagePath) =>
    !imagePath
      ? "http://localhost:5000/uploads/image-1759674627375.png"
      : imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5000/${imagePath.replace(/\\/g, "/")}`;

  /**
   * fetchOrders()
   * --------------
   * Fetches all orders of the authenticated user.
   * Uses JWT token stored in localStorage for authentication.
   */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Redirect or alert if user is not logged in
      if (!token) {
        alert("Please login to view your orders.");
        setLoading(false);
        return;
      }

      // API call to fetch orders
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch orders");

      setOrders(data.data || []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * getStatusClasses()
   * -------------------
   * Returns Tailwind CSS classes based on order status
   * for color-coded badge styling.
   */
  const getStatusClasses = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-700/80 text-yellow-100";
      case "confirmed":
        return "bg-blue-700/80 text-blue-100";
      case "delivered":
        return "bg-green-700/80 text-green-100";
      default:
        return "bg-gray-600/80 text-gray-100";
    }
  };

  /**
   * JSX Layout Structure
   * ---------------------
   * <Navbar /> - top site navigation
   * Back button  - navigates user to home
   * Orders table - displays fetched data
   * <Footer /> - persistent footer section
   */
  return (
    <div className="bg-amber-950 min-h-screen">
      <Navbar />

      {/* Main Content Section */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* Back Navigation */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        {/* Page Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-amber-400 text-center mb-8">
          My Orders
        </h1>

        {/* Loading / Empty / Data States */}
        {loading ? (
          <div className="text-center text-amber-200 py-12">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-amber-200 py-12">No orders found</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-amber-700/40 shadow-lg">
            <table className="min-w-full text-sm text-amber-100">
              {/* Table Header */}
              <thead className="bg-amber-900 text-amber-300 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Items</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-amber-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-amber-900/30 transition duration-200">
                    {/* Order ID */}
                    <td className="px-4 py-3 font-medium text-amber-300 truncate">
                      {order._id.slice(0, 8)}...
                    </td>

                    {/* Address */}
                    <td className="px-4 py-3 text-amber-200">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          {order.address}, {order.city} - {order.zipCode}
                        </span>
                      </div>
                    </td>

                    {/* Items Preview */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2 overflow-x-auto max-w-[200px] scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-transparent">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex-shrink-0">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-10 h-10 rounded-md object-cover border border-amber-700/50"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="text-xs mt-1 text-amber-300">
                        {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                      </div>
                    </td>

                    {/* Total Price */}
                    <td className="px-4 py-3 font-bold text-amber-400">
                      ${order.totalPrice?.toFixed(2)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
