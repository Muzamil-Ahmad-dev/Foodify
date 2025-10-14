/**
 * cartSlice.js
 * ----------------------------
 * Redux Toolkit Slice: Cart Management
 *
 * Description:
 * Handles all shopping cart-related state management, including:
 * - Adding items to cart
 * - Removing items from cart
 * - Adjusting quantities
 * - Clearing the entire cart
 *
 * Libraries:
 * - @reduxjs/toolkit → createSlice for simplified reducer logic
 *
 * State Shape:
 * {
 *   cart: [
 *     {
 *       _id: String,
 *       name: String,
 *       price: Number,
 *       quantity: Number,
 *       ...otherItemData
 *     }
 *   ]
 * }
 */

import { createSlice } from "@reduxjs/toolkit";

// --------------------------
// Initial State
// --------------------------
const initialState = {
  cart: [],
};

// --------------------------
// Cart Slice Definition
// --------------------------
const cartSlice = createSlice({
  name: "cart", // slice name used in Redux store
  initialState,
  reducers: {
    /**
     * addToCart
     * ----------
     * Adds a new product to the cart.
     * If it already exists, increments its quantity.
     *
     * @param {Object} state - current Redux state
     * @param {Object} action - dispatched action containing product data
     */
    addToCart: (state, action) => {
      const item = state.cart.find((i) => i._id === action.payload._id);
      if (item) {
        item.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },

    /**
     * removeFromCart
     * ----------------
     * Removes a specific item from the cart by its ID.
     *
     * @param {Object} state - current Redux state
     * @param {Object} action - dispatched action with item ID
     */
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },

    /**
     * decreaseQuantity
     * -----------------
     * Decreases item quantity by 1.
     * If quantity reaches zero, removes item from cart.
     *
     * @param {Object} state - current Redux state
     * @param {Object} action - dispatched action with item ID
     */
    decreaseQuantity: (state, action) => {
      const item = state.cart.find((i) => i._id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cart = state.cart.filter((i) => i._id !== action.payload);
        }
      }
    },

    /**
     * clearCart
     * ----------
     * Clears all items from the shopping cart.
     *
     * @param {Object} state - current Redux state
     */
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

// --------------------------
// Export Actions and Reducer
// --------------------------
export const { addToCart, removeFromCart, decreaseQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
