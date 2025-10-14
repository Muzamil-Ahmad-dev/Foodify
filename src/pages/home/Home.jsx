/**
 * Home Page Component
 * --------------------
 * This component serves as the main landing page of the application.
 * It combines all the primary UI sections such as Navbar, Banner, Special Offers,
 * About Section, Home Menu, and Footer.
 *
 * Folder Structure:
 * - components/
 *    - navbar/Navbar.jsx
 *    - banner/Banner.jsx
 *    - specialOffer/SpecialOffer.jsx
 *    - homeAbout/HomeAbout.jsx
 *    - ourHomeMenu/OurHomeMenu.jsx
 *    - footer/Footer.jsx
 *
 * Technologies:
 * - React.js (Functional Components)
 * - JSX + ES6 Modules
 * - Component-based architecture for reusability and clarity
 */

import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import Banner from "../../components/banner/Banner";
import SpecialOffer from "../../components/specialOffer/SpecialOffer";
import HomeAbout from "../../components/homeAbout/HomeAbout";
import OurHomeMenu from "../../components/ourHomeMenu/OurHomeMenu";

/**
 * Home Component
 * ----------------
 * The main page structure for the app.
 * This layout ensures consistent UI by rendering
 * the navigation bar at the top and the footer at the bottom.
 *
 * Children Components:
 * - <Navbar /> → Displays site-wide navigation
 * - <Banner /> → Hero section or introductory display
 * - <SpecialOffer /> → Displays promotional offers
 * - <HomeAbout /> → Short description or brand story
 * - <OurHomeMenu /> → Showcases featured dishes or menu
 * - <Footer /> → Displays footer information
 */
function Home() {
  return (
    <div>
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Hero Banner Section */}
      <Banner />

      {/* Special Offers Section */}
      <SpecialOffer />

      {/* About Section */}
      <HomeAbout />

      {/* Our Menu Section */}
      <OurHomeMenu />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Home;
