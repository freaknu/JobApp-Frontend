import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

const OAuthError = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div>
      <h2>Login Error</h2>
      <p>{message || "An error occurred during login"}</p>
      <Link to="/login">Return to Login</Link>
    </div>
  );
};

export default OAuthError;
