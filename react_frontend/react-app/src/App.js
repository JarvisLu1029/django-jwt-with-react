import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import RequireAuth from "./components/Auth/RequireAuth";
import LoginForm from "./components/Auth/LoginForm";
import UserInfo from "./components/UserInfo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<LoginForm />} />
        <Route element={<RequireAuth />}>
            <Route index element={<UserInfo />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
