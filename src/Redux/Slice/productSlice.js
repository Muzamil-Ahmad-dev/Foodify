/**
 * productSlice.js
 * ---------------------------------
 * Redux Toolkit Slice: Product Management
 *
 * Description:
 * Manages product-related state for the application.
 * This includes:
 * - Storing fetched menu or API data
 * - Adding new products
 * - Updating existing products
 *
 * Libraries:
 * - @reduxjs/toolkit → createSlice for structured and simplified Redux logic
 *
 * State Shape:
 * {
 *   products: [
 *     {
 *       id: String,
 *       name: String,
 *       price: Number,
 *       description: String,
 *       image: String,
 *       ...otherFields
 *     }
 *   ]
 * }
 */

import { createSlice } from "@reduxjs/toolkit";

// --------------------------
// Initial State
// --------------------------
const initialState = {
  products: [], // Stores product or menu data from API/backend
};

// --------------------------
// Product Slice Definition
// --------------------------
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    /**
     * setProducts
     * ----------------
     * Replaces the current products array with new data.
     * Typically used after fetching data from API.
     *
     * @param {Object} state - current Redux state
     * @param {Object} action - dispatched action containing product array
     */
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    /**
     * addProduct
     * ----------------
     * Adds a single new product to the store.
     *
     * @param {Object} state - current Redux state
     * @param {Object} action - dispatched action containing product object
     */
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },

    /**
     * updateProduct
     * ----------------
     * Finds and updates an existing product by its ID.
     * If product not found, no changes are made.
     *
     * @param {Object} state - current Redux state
     * @param {Object} action - dispatched action containing updated product
     */
    updateProduct: (state, action) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
  },
});

// --------------------------
// Export Actions and Reducer
// --------------------------
export const { setProducts, addProduct, updateProduct } = productSlice.actions;
export default productSlice.reducer;
