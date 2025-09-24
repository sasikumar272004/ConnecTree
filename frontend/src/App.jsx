import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Logind";
import Register from "./pages/Register";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/:tab" element={<Home />} />
        <Route path="/home/:tab/:section" element={<Home />} />
        <Route path="/home/:tab/:section/:view" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;