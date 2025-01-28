import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserDetails from "../pages/UserDetails";
import UsersList from "../pages/UsersList";
import Login from "../pages/auth/Login";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UsersList />
          </PrivateRoute>
        }
      />
      <Route
        path="/view/:id"
        element={
          <PrivateRoute>
            <UserDetails />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
