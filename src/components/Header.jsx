import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // make sure your logo is here

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: "#1B263B",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "1.2rem 2rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        justifyContent: "space-between",
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            marginRight: "1rem",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <h1
          style={{
            fontSize: "2rem",
            margin: 0,
            fontWeight: "bold",
            background: "linear-gradient(to right, #00C9FF, #92FE9D)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Loyalty Point Exchange
        </h1>
      </Link>
    </header>
  );
};

export default Header;

