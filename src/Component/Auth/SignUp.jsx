import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    useremail: "",
    userpassword: "",
    role: null,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === "userpassword") {
      if (value.length > 0 && value.length < 8) {
        setPasswordError("Password must be at least 8 characters");
      } else {
        setPasswordError("");
      }
    }

    setError("");
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setError("");
  };

  const validateForm = () => {
    if (!formData.role) {
      setError("Please select a role (Jobseeker or Jobprovider)");
      return false;
    }
    if (formData.userpassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const endpoint =
        formData.role === "JOBSEEKER"
          ? `${backendURL}/jobseeker/auth/signup`
          : `${backendURL}/jobseeker/auth/signup`;

      const payload = {
        username: formData.username,
        useremail: formData.useremail,
        userpassword: formData.userpassword,
        role: formData.role,
      };

      const res = await axios.post(endpoint, payload);

      if (res.status === 200 || res.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setError("User already exists with this email");
        } else {
          setError(
            error.response.data.message ||
              "Registration failed. Please try again."
          );
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 py-6 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
          </div>

          <form className="p-8" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                {formData.role === "JOBPROVIDER" ? "Company Name" : "Full Name"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    formData.role === "JOBPROVIDER"
                      ? "Enter company name"
                      : "Enter your full name"
                  }
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  id="useremail"
                  value={formData.useremail}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  id="userpassword"
                  value={formData.userpassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    passwordError
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="••••••••"
                  required
                  minLength="8"
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Register as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className={`py-3 rounded-lg border transition-colors duration-200 flex items-center justify-center gap-2 ${
                    formData.role === "JOBSEEKER"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleRoleSelect("JOBSEEKER")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Job Seeker
                </button>
                <button
                  type="button"
                  className={`py-3 rounded-lg border transition-colors duration-200 flex items-center justify-center gap-2 ${
                    formData.role === "JOBPROVIDER"
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => handleRoleSelect("JOBPROVIDER")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Job Provider
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!formData.role || isLoading || passwordError}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center ${
                !formData.role || isLoading || passwordError
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
