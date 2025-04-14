import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiUser, FiEdit, FiLogOut } from "react-icons/fi";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const Navbar = () => {
  const { userRole, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    userpassword: "",
  });

  useEffect(() => {
    if (userRole) {
      fetchProfile();
    }
  }, [userRole]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${backendURL}/profile/get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        userpassword: "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${backendURL}/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setIsEditMode(false);
      fetchProfile(); 
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading || !userRole) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              to={
                userRole === "JOBPROVIDER"
                  ? "/provider-dashboard"
                  : "/dashboard"
              }
              className="text-gray-800 font-medium"
            >
              {userRole === "JOBPROVIDER"
                ? "Provider Dashboard"
                : "Job Seeker Dashboard"}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/atssystem"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              ATS Score
            </Link>
            <div className="relative ml-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {profile?.username?.charAt(0)?.toUpperCase() || <FiUser />}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  {isEditMode ? (
                    <form onSubmit={handleUpdateProfile} className="px-4 py-2">
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="userpassword"
                          value={formData.userpassword}
                          onChange={handleInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Leave blank to keep current"
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditMode(false)}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="px-4 py-2">
                        <p className="text-sm text-gray-900 font-medium">
                          {profile?.username || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {profile?.useremail || ""}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Role: {profile?.userrole || userRole}
                        </p>
                      </div>
                      <div className="border-t border-gray-100"></div>
                      <button
                        onClick={() => setIsEditMode(true)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FiEdit className="mr-2" />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FiLogOut className="mr-2" />
                        Sign out
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
