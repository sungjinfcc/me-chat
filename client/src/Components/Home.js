import React from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { isAuthenticated } = useAuth();
  const navigator = useNavigate();

  const checkAuth = () => {
    isAuthenticated ? navigator("/main") : navigator("/login");
  };

  return <button onClick={checkAuth}>Start</button>;
}

export default Home;
