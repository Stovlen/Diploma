// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-light text-center py-3 mt-auto shadow-sm">
      <div className="container">
        <small>
          &copy; {new Date().getFullYear()} TaskMaster. Усі права захищені.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
