import React from "react";
import DailyTip from "../components/DailyTip";
import TaskSuggestion from "../components/TaskSuggestion";

const TipsPage = () => {
  return (
    <div>
      <h1>ШІ поради</h1>
      <DailyTip />
      <TaskSuggestion />
    </div>
  );
};

export default TipsPage;
