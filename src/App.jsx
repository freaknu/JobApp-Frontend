import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignUp from "./Component/Auth/SignUp";
import Login from "./Component/Auth/Login";
import { useAuth } from "./hooks/useAuth";
import JobProviderDashboard from "./Component/JobProvider/JobProviderDashboard";
import JobSeekerDashboard from "./Component/JobSeeker/JobSeekerDashboard";
import OAuthRedirect from "./Component/Auth/OAuthRedirect";
import ATSScoringComponent from "./Component/ATSScoringComponent";
import LoadingSpinner from "./Component/LoadingSpinner";

const ProtectedRoute = ({ role, element }) => {
  const { userRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
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
  const { isLoading } = useAuth();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setInitialLoad(false);
    }
  }, [isLoading]);

  if (initialLoad) {
    return <LoadingSpinner fullPage />;
  }

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
      <Route path="/atssystem" element={<ATSScoringComponent />} />
      <Route path="/oauth-redirect" element={<OAuthRedirect />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
