import React from "react";
import DailyTip from "../components/DailyTip";
import TaskSuggestion from "../components/TaskSuggestion";
import HabitInsight from "../components/HabitInsight";

const TipsPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        <span role="img" aria-label="brain">
          🧠
        </span>{" "}
        ШІ поради
      </h1>

      <div className="row g-4">
        <div className="col-12">
          <DailyTip />
        </div>
        <div className="col-12">
          <TaskSuggestion />
        </div>
        <div className="col-12">
          <HabitInsight />
        </div>
      </div>
    </div>
  );
};

export default TipsPage;
