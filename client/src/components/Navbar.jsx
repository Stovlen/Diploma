// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          TaskMaster
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/tasks">
                Мої задачі
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Аналітика
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tips">
                ШІ поради
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-danger" to="/logout">
                Вийти
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
