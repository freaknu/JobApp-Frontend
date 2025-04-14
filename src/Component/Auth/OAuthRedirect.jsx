import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const OAuthRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role || "JOBSEEKER");
      navigate(role === "JOBPROVIDER" ? "/provider-dashboard" : "/dashboard");
    } else {
      navigate("/login", { state: { error: "Google login failed" } });
    }
  }, [searchParams, navigate]);

  return <div>Redirecting...</div>;
};

export default OAuthRedirect;
