import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignUp from "./Component/Auth/SignUp";
import Login from "./Component/Auth/Login";
import { useAuth } from "./hooks/useAuth";
import JobProviderDashboard from "./Component/JobProvider/JobProviderDashboard";
import JobSeekerDashboard from "./Component/JobSeeker/JobSeekerDashboard";

const ProtectedRoute = ({ role, element }) => {
  const { userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!userRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole !== role) {
    return (
      <Navigate
        to={userRole === "JOBPROVIDER" ? "/provider-dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return element;
};

const App = () => {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="JOBSEEKER" element={<JobSeekerDashboard />} />
        }
      />
      <Route
        path="/provider-dashboard"
        element={
          <ProtectedRoute
            role="JOBPROVIDER"
            element={<JobProviderDashboard />}
          />
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
