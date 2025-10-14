/**
 * Menu Page Component
 * --------------------
 * This component represents the main Menu page of the application.
 * It displays the complete list of food items available, using the 
 * shared `OurHomeMenu` component for consistency with the homepage.
 *
 * Folder Structure:
 * - components/
 *    - navbar/Navbar.jsx
 *    - footer/Footer.jsx
 *    - ourHomeMenu/OurHomeMenu.jsx
 *
 * Technologies Used:
 * - React.js (Functional Components)
 * - Modular component imports for better reusability and maintainability
 */

import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import OurHomeMenu from "../../components/ourHomeMenu/OurHomeMenu";

/**
 * Menu Component
 * ----------------
 * The page layout includes:
 * - <Navbar /> → Persistent site navigation
 * - <OurHomeMenu /> → Displays the full food/menu section
 * - <Footer /> → Footer content with company/contact info
 *
 * Purpose:
 * Provides a clean, consistent layout for browsing food items.
 */
function Menu() {
  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Menu Display Section */}
      <OurHomeMenu />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Menu;
