import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-light px-4 d-flex justify-content-between">
      <Link to="/tasks" className="navbar-brand fw-bold">
        TaskMaster
      </Link>
      <div>
        <Link to="/tasks" className="me-3 text-decoration-none text-dark">
          Мої задачі
        </Link>
        <Link to="/dashboard" className="me-3 text-decoration-none text-dark">
          Аналітика
        </Link>
        <Link to="/tips" className="me-3 text-decoration-none text-dark">
          ШІ поради
        </Link>
        <Link to="/profile" className="me-3 text-decoration-none text-dark">
          Мій профіль
        </Link>
        <button onClick={handleLogout} className="btn btn-link text-danger p-0">
          Вийти
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
