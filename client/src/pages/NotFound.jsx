import React from "react";

const NotFound = () => {
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "60vh" }}
    >
      <h1 className="display-4 text-danger">404</h1>
      <h2 className="mb-3">Сторінку не знайдено</h2>
      <p className="text-muted">
        Перевірте URL або поверніться на головну сторінку.
      </p>
    </div>
  );
};

export default NotFound;
