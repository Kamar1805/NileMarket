import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AboutPage.css";

const AboutPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout functionality here
    alert("Logout successful");
  };

  return (
    <div className="about-container">
      {/* Navbar */}
      <nav className="nav-bar">
        <img src="/logo.png" alt="NileMarket Logo" className="logo" />
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li onClick={() => navigate("/dashboard")}>Home</li>
          <li onClick={() => navigate("/AboutPage")}>About</li>
          {/* Conditionally render 'Sell Item' link */}
          <li onClick={() => navigate("/upload")}>Sell Item</li>
          <li onClick={() => alert("My Profile page coming soon!")}>My Profile</li>
          <li onClick={() => navigate("/")}>Logout</li>
        </ul>
      </nav>

      <header className="about-header">
        <h1>About NileanHub</h1>
        <p>Your trusted marketplace for the Nile University co.</p>
      </header>

      <section className="about-section">
        <h2>About Nilean Hub</h2>
        <p>
          NileanHub is a peer to peer marketplace platform designed to cater for the Nile university community. 
          it provides a safe and easy space for students and staff members to buy and sell their items, creating a thriving marketplace where university members 
          can connect with ech other and meet their needs.
        </p>
      </section>

      <section className="about-section">
        <h2>About Nile University of Nigeria</h2>
        <p>
          Nile University of Nigeria (NUN) is a private university located in
          Abuja, Nigeria. Founded in 2009, the university aims to provide
          world-class education and foster academic excellence. NUN offers a
          diverse range of undergraduate and postgraduate programs in science,
          engineering, business, and humanities. With a commitment to innovation,
          NUN is focused on empowering students to be leaders in their respective
          fields.
        </p>
      </section>

      <section className="about-section">
        <h2>Mission and Values</h2>
        <p>
          At NileanHub, our mission is to create a trusted and accessible
          marketplace exclusively for the Nile University community. We believe
          in fostering a collaborative environment where students and staff can
          interact, buy, sell, and connect with ease. We uphold values of trust,
          convenience, and community spirit.
        </p>
      </section>

      <section className="about-section">
        <h2>How NileanHub Benefits the Nile University Community</h2>
        <p>
          NileanHub benefits the Nile University community by providing a
          reliable, user-friendly platform for students and staff to trade items.
          Whether you are selling used textbooks, electronics, or personal items,
          NileMarket provides a secure and easy way to make transactions. Students
          can easily browse through listings and connect with sellers, making it
          an essential part of campus life.
        </p>
      </section>

      <section className="about-section">
        <h2>NileanHub Features</h2>
        <ul>
          <li>Secure login for university members only.</li>
          <li>Post items for sale with a simple form.</li>
          <li>Search and filter options to browse through listings efficiently.</li>
          <li>Ability to view detailed information about each item.</li>
          <li>A community-driven platform where users can rate products and sellers.</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Our Message</h2>
        <p>
          NileanHub was created to offer students and members of the university a seamless,
          secure, and efficient way to exchange goods. My vision is to build a
          platform where students and staff can easily connect and support one
          another in their academic and personal lives. I believe this platform
          will strengthen our university community and foster collaboration."
        </p>
        <p>- KamarThinks Innovations ©  2025</p>
      </section>

      <section className="about-section">
        <h2>Contact Information & Support</h2>
        <p>
          For inquiries, support, or suggestions, please feel free to contact us at:
        </p>
        <ul>
          <li>Email: support@nileanhub.com</li>
          <li>Phone: +234 814 310 4084</li>
          
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
