import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const AppliedJobCard = ({ job, handleWithdraw, formatDate }) => {
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchApplicationDetails = async (jobId) => {
    try {
      setLoadingDetails(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(
        `${backendURL}/jobseeker/get-jobapplication/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const transformedDetails = {
        ...response.data,
        firstname: response.data.firstname || "Not available",
        lastname: response.data.lastname || "Not available",
        useremail: response.data.useremail || job.jobposteruseremail,
        applicationStatus:
          response.data.applicationStatus || job.applicationStatus || "PENDING",
        uploadDate:
          response.data.uploadDate ||
          job.applicationDate ||
          new Date().toISOString(),
      };

      setApplicationDetails(transformedDetails);
      setShowDetails(true);
      setSuccess("Application details loaded successfully");
    } catch (error) {
      console.error("Error fetching application details:", error);
      setError(
        error.response?.data?.message ||
          "Failed to fetch application details. Please try again."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDownloadResume = async (fileUrl, filename) => {
    try {
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(fileUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      saveAs(new Blob([response.data]), filename);
      setSuccess("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error downloading resume:", error);
      setError("Failed to download resume. Please try again.");
    }
  };

  const handleWithdrawApplication = async (jobId) => {
    try {
      setWithdrawing(true);
      setError(null);
      setSuccess(null);

      await handleWithdraw(jobId);
      setSuccess("Application withdrawn successfully");
    } catch (error) {
      console.error("Error withdrawing application:", error);
      setError(
        error.response?.data?.message ||
          "Failed to withdraw application. Please try again."
      );
    } finally {
      setWithdrawing(false);
    }
  };

  const toggleDetails = () => {
    if (!showDetails && !applicationDetails) {
      fetchApplicationDetails(job.jobid);
    } else {
      setShowDetails(!showDetails);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (success || error) {
        setSuccess(null);
        setError(null);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [success, error]);

  if (!job) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <p>No job information available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-green-500 transform hover:scale-[1.02] transition-transform duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold text-gray-800">{job.jobname}</h2>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mb-1">
              Posted: {formatDate(job.jobpost)}
            </span>
            {job.applicationDate && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Applied: {formatDate(job.applicationDate)}
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-3 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
          Posted by: {job.jobposteruseremail}
        </p>
        <p className="text-gray-700 mb-4">{job.jobdescription}</p>
        <div className="mb-4">
          <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Technologies:
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.technology?.split(",").map((tech, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
        {job.applicationStatus && (
          <div className="mb-3">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                job.applicationStatus === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : job.applicationStatus === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              Status: {job.applicationStatus}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={toggleDetails}
            disabled={loadingDetails}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center disabled:opacity-50"
          >
            {loadingDetails ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
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
                Loading...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {showDetails
                  ? "Hide Application Details"
                  : "View Application Details"}
              </>
            )}
          </button>

          <button
            onClick={() => handleWithdrawApplication(job.jobid)}
            disabled={withdrawing}
            className="text-red-600 hover:text-red-800 text-sm flex items-center disabled:opacity-50"
          >
            {withdrawing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500"
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
                Withdrawing...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Withdraw Application
              </>
            )}
          </button>
        </div>
        {success && (
          <div className="mt-2 p-2 text-sm text-green-700 bg-green-100 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-2 p-2 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {showDetails && applicationDetails && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">
              Application Details
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-gray-500">First Name</p>
                <p className="font-medium">{applicationDetails.firstname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Name</p>
                <p className="font-medium">{applicationDetails.lastname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{applicationDetails.useremail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Application Status</p>
                <p className="font-medium capitalize">
                  {applicationDetails.applicationStatus?.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-500">Resume</p>
              <div className="flex items-center justify-between mt-1">
                <p className="font-medium">{applicationDetails.filename}</p>
                <button
                  onClick={() =>
                    handleDownloadResume(
                      applicationDetails.fileurl,
                      applicationDetails.filename
                    )
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {applicationDetails.filetype},{" "}
                {Math.round(applicationDetails.filesize / 1024)} KB
              </p>
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-500">Applied On</p>
              <p className="font-medium">
                {new Date(applicationDetails.uploadDate).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobCard;
