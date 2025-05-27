import React from "react";
import DailyTip from "../components/DailyTip";
import TaskSuggestion from "../components/TaskSuggestion";

const TipsPage = () => {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">🧠 ШІ поради</h2>
      <DailyTip />
      <TaskSuggestion />
    </div>
  );
};

export default TipsPage;
