/**
 * store.js
 * ---------------------------------
 * Redux Store Configuration
 *
 * Description:
 * Centralized Redux store setup using Redux Toolkit.
 * Combines all slices (reducers) into a single global store.
 * This file initializes and exports the configured store instance
 * for use across the React application.
 *
 * Libraries:
 * - @reduxjs/toolkit → provides configureStore for simplified store setup
 *
 * Integrated Slices:
 * - products → manages product/menu data
 * - cart → manages shopping cart state and actions
 */

import { configureStore } from "@reduxjs/toolkit";

// --------------------------
// Slice Imports
// --------------------------
import productReducer from "./Slice/productSlice";
import cartReducer from "./Slice/cartSlice";

// --------------------------
// Store Configuration
// --------------------------
export const store = configureStore({
  reducer: {
    products: productReducer, // Product data management
    cart: cartReducer,        // Cart data management
  },
});

// --------------------------
// Usage Example
// --------------------------
// In index.js (or main.jsx):
// import { Provider } from "react-redux";
// import { store } from "./Redux/store";
// 
// <Provider store={store}>
//   <App />
// </Provider>
//
// This ensures Redux state is accessible throughout the app.
