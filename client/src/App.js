import React, { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handleRegister = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <button onClick={handleLogout}>Вийти</button>
          <TaskList />
        </>
      ) : (
        <>
          {isRegistering ? (
            <>
              <RegisterForm onRegister={handleRegister} />
              <p>
                Уже є акаунт?{" "}
                <button onClick={() => setIsRegistering(false)}>Увійти</button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onLogin={handleLogin} />
              <p>
                Ще не маєте акаунта?{" "}
                <button onClick={() => setIsRegistering(true)}>
                  Зареєструватися
                </button>
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
