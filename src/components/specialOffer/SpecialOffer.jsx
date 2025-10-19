/**
 * @file SpecialOffer.jsx
 * @description Displays a section of products fetched from the backend API with category filters,
 * animations, and add-to-cart functionality. Uses Redux for state management and Framer Motion
 * for smooth animations.
 * 
 * Dependencies:
 * - React (useState, useEffect)
 * - Redux Toolkit (useDispatch, useSelector)
 * - Framer Motion (motion)
 * - Lucide Icons (Star, Heart, Plus, Loader2, ImageOff, DollarSign)
 * - Tailwind CSS for styling
 */

import React, { useEffect, useState } from "react";
import { Star, Heart, Plus, Loader2, ImageOff, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../Redux/Slice/productSlice";
import { addToCart } from "../../Redux/Slice/cartSlice";
import "./SpecialOffer.css"; // Galaxy/star background animations

// Backend endpoints
const API_URL = "https://1e20a7ed-cc85-497b-b510-b41debc2f036-00-1p28dt788ywz9.pike.replit.dev/api/menu";
const IMAGE_BASE_URL = "http://localhost:5000/uploads/";

/**
 * SpecialOffer Component
 * ------------------------------------------------------------
 * - Fetches products from backend API
 * - Displays category filters
 * - Animates product grid items
 * - Allows adding items to cart
 * ------------------------------------------------------------
 */
export default function SpecialOffer() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  // Local UI states
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch products from backend on mount
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          // Normalize data to ensure numbers are properly typed
          const normalized = data.data.map((item) => ({
            ...item,
            rating: item.rating != null ? Number(item.rating) : 0,
            popularity: item.popularity != null ? Number(item.popularity) : 0,
            price: item.price != null ? Number(item.price) : 0,
          }));
          dispatch(setProducts(normalized));
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Server not responding");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  /** Extract categories from product list */
  const categories = ["All", ...new Set(products.map((p) => p.category || "Uncategorized"))];

  /** Filter products based on selected category */
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  /** Limit visible products */
  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, 4);

  /** Framer Motion animation settings */
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  /** Render loading spinner */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#2c2026]">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
      </div>
    );

  /** Render error message */
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <main className="relative min-h-screen bg-[#2c2026] overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {/* Section Header */}
      <section className="relative z-10 text-center py-16 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-4">
          Special Offers Just for You
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-lg sm:text-xl">
          Explore our exclusive products at amazing prices.
        </p>
      </section>

      {/* Category Filter Buttons */}
      <div className="relative z-10 flex justify-center flex-wrap gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === cat
                ? "bg-yellow-400 text-[#2c2026]"
                : "bg-[#3b2f38] text-yellow-300 hover:bg-yellow-300 hover:text-[#2c2026]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid Section */}
      <section className="relative z-10 py-10 px-4">
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {visibleProducts.length === 0 ? (
            <p className="text-gray-300 text-center col-span-full">
              No products found.
            </p>
          ) : (
            visibleProducts.map((product) => {
              const imageUrl = product.image
                ? product.image.startsWith("http")
                  ? product.image
                  : `${IMAGE_BASE_URL}${product.image}`
                : null;

              return (
                <motion.div
                  key={product._id || product.name}
                  className="bg-[#3b2f38] rounded-xl overflow-hidden relative shadow-lg"
                  style={{ height: "26rem" }}
                  variants={cardVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px 5px #facc15",
                  }}
                >
                  {/* Product Image */}
                  <div className="relative h-56 overflow-hidden rounded-t-xl flex items-center justify-center bg-[#2c2026]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.src = "/fallback.png")}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageOff className="w-10 h-10 mb-2" />
                        <p className="text-sm">No Image</p>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 text-yellow-400 bg-black/50 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">
                        {Number(product.rating ?? 0).toFixed(1)}
                      </span>
                    </div>

                    {/* Popularity */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-pink-400 bg-black/50 px-2 py-1 rounded-full">
                      <Heart className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">
                        {Number(product.popularity ?? 0)}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-yellow-400 text-lg font-semibold italic">
                      {product.name}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Product Price */}
                      <span className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                        <DollarSign className="w-5 h-5" />
                        {product.price != null ? product.price : "0.00"}
                      </span>

                      {/* Add to Cart */}
                      <button
                        onClick={() => dispatch(addToCart(product))}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-1 rounded-lg font-medium shadow-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Show More / Show Less Button */}
        {filteredProducts.length > 4 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-yellow-400 text-[#2c2026] font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
