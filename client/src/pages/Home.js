import React from "react";
import TaskList from "../components/TaskList";

const Home = () => {
  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="display-5">📋 Список задач</h1>
        <p className="text-muted">Управляйте своїми справами зручно і швидко</p>
      </div>
      <TaskList />
    </div>
  );
};

export default Home;
