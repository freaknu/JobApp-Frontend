import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const name = searchParams.get("name");
    const picture = searchParams.get("picture");

    if (token) {
      localStorage.setItem("authToken", token);
      if (name) localStorage.setItem("userName", name);
      if (picture) localStorage.setItem("userPicture", picture);

      navigate("/dashboard");
    } else {
      navigate("/login?error=oauth_failed");
    }
  }, [searchParams, navigate]);

  return <div>Processing login...</div>;
};

export default OAuthSuccess;
