import React from "react";
import TaskList from "../components/TaskList";

const Home = () => {
  return (
    <div className="container">
      <h1>📋 Список задач</h1>
      <TaskList />
    </div>
  );
};

export default Home;



