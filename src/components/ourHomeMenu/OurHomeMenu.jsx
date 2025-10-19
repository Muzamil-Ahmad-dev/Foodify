/**
 * @file OurHomeMenu.jsx
 * @description Displays dynamic restaurant menu fetched from backend.
 * Includes category filtering, animations, and Redux state management.
 *
 * @version 2.0.0
 * @since 2025-10-19
 * @author
 * Muzamil Ahmad
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../Redux/Slice/productSlice";
import { addToCart } from "../../Redux/Slice/cartSlice";
import { DollarSign } from "lucide-react";
import axios from "axios";

const OurHomeMenu = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  /** API base URL with fallback */
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://1e20a7ed-cc85-497b-b510-b41debc2f036-00-1p28dt788ywz9.pike.replit.dev";

  /** Axios instance with defaults */
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  /** Helper: Generate valid image URLs */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}/${imagePath.replace(/\\/g, "/")}`;
  };

  /** Fetch menu data */
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get("/api/menu");
      const { data } = response;

      if (!data.success || !data.data)
        throw new Error(data.message || "Failed to fetch menu items");

      const formattedData = data.data.map((item) => ({
        id: item._id,
        name: item.name?.trim() || "Unnamed Item",
        description: item.description || "No description available.",
        category: item.category
          ? item.category.trim().toUpperCase()
          : "OTHER",
        price: Number(item.price) || 0,
        image: getImageUrl(item.image),
      }));

      dispatch(setProducts(formattedData));

      const uniqueCats = [...new Set(formattedData.map((p) => p.category))];
      setCategories(uniqueCats);
      if (!activeCategory && uniqueCats.length > 0)
        setActiveCategory(uniqueCats[0]);
    } catch (err) {
      console.error("Menu Fetch Error:", err.message);
      setError(
        err.response?.data?.message || "Failed to load menu. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /** Load menu on mount */
  useEffect(() => {
    fetchMenuItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Filter products by active category */
  const filteredProducts = products.filter(
    (item) =>
      item.category &&
      item.category.toUpperCase() === activeCategory.toUpperCase()
  );

  /** Animation variants */
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const cardHoverVariants = {
    hover: { scale: 1.05, y: -10, transition: { duration: 0.3 } },
  };

  /** Main UI */
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-950 py-16 px-4 relative overflow-hidden">
      {/* Animated background layers */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      <motion.div
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-5xl md:text-6xl font-serif text-yellow-400 mb-4 font-light tracking-wide">
            Our Exquisite Menu
          </h1>
          <p className="text-yellow-200 text-lg tracking-[0.3em] font-light">
            A SYMPHONY OF FLAVORS
          </p>
        </motion.div>

        {/* Category Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          variants={itemVariants}
        >
          {categories.map((category, index) => (
            <motion.button
              key={`${category}-${index}`}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? "bg-amber-600 text-white shadow-lg"
                  : "bg-amber-800/50 text-amber-200 hover:bg-amber-700/70"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          variants={itemVariants}
        >
          {loading ? (
            <div className="text-white col-span-full text-center py-12">
              Loading menu...
            </div>
          ) : error ? (
            <div className="text-red-400 col-span-full text-center py-12">
              {error}
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <motion.div
                key={item.id || index}
                className="bg-amber-900/60 backdrop-blur-sm rounded-lg overflow-hidden border border-amber-700/50 shadow-xl"
                variants={cardHoverVariants}
                whileHover="hover"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="relative h-48 bg-amber-800/30 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/placeholder.svg")}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/80 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-yellow-400 mb-2 italic">
                    {item.name}
                  </h3>
                  <p className="text-amber-200 text-sm mb-4 tracking-wide line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-2xl font-bold text-yellow-400">
                      <DollarSign className="w-5 h-5 text-yellow-400" />{" "}
                      {item.price.toFixed(2)}
                    </span>
                    <motion.button
                      onClick={() => dispatch(addToCart(item))}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium tracking-wider transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ORDER NOW
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-white col-span-full text-center py-12">
              No items found in this category
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OurHomeMenu;
