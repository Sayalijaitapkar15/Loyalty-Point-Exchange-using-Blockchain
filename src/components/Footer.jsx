import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#2C3E50",
        color: "#fff",
        padding: "1rem",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <p style={{ margin: 0 }}>
        &copy; {new Date().getFullYear()} Loyalty Point Exchange. All rights reserved.
      </p>
    </footer>
  );
};
export default Footer;
