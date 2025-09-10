import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Auth/Signup";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default App;
