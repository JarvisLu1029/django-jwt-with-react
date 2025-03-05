import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import RequireAuth from "./components/Auth/RequireAuth";
import UserInfo from "./components/UserInfo";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<UserInfo />} /> {/* Replace with your home component */}
        </Route>
        
        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
