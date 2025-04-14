import React, { useState } from "react";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const ApplicantsList = ({ applicants, selectedJob, jobs, onClose }) => {
  const [applicationInfo, setApplicationInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); 
  const [actionLoading, setActionLoading] = useState({
    accept: false,
    reject: false,
    view: false,
  });

  const viewApplication = async (useremail) => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      setActionLoading((prev) => ({ ...prev, view: true }));
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${backendURL}/jobprovider/view-jobapplication/${useremail}/${selectedJob}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setApplicationInfo(response.data);
        setMessage({
          text: "Application loaded successfully",
          type: "success",
        });
      } else {
        setMessage({
          text: "No application found for this applicant",
          type: "error",
        });
      }
    } catch (err) {
      let errorMessage = "Failed to load application";

      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = "You need to be logged in to view applications";
            break;
          case 403:
            errorMessage = "You don't have permission to view this application";
            break;
          case 404:
            errorMessage = "Application not found";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
          default:
            errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection";
      }

      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
      setActionLoading((prev) => ({ ...prev, view: false }));
    }
  };

  const closeApplicationView = () => {
    setApplicationInfo(null);
    setMessage({ text: "", type: "" });
  };

  const handleApplicationAction = async (action, useremail) => {
    try {
      setMessage({ text: "", type: "" });
      setActionLoading((prev) => ({ ...prev, [action]: true }));
      const token = localStorage.getItem("authToken");
      const endpoint =
        action === "accept" ? "accept-application" : "reject-application";

      await axios.post(
        `${backendURL}/jobprovider/${endpoint}/${useremail}/${selectedJob}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage({
        text: `Application ${
          action === "accept" ? "accepted" : "rejected"
        } successfully`,
        type: "success",
      });
      await viewApplication(useremail);
    } catch (err) {
      let errorMessage = `Failed to ${action} application`;

      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = "You need to be logged in to perform this action";
            break;
          case 403:
            errorMessage = "You don't have permission to perform this action";
            break;
          case 404:
            errorMessage = "Application not found";
            break;
          case 409:
            errorMessage = "This application has already been processed";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
          default:
            errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection";
      }

      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setActionLoading((prev) => ({ ...prev, [action]: false }));
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
  };

  // Check application status
  const isAccepted = applicationInfo?.applicationStatus === "SHORTLISTED";
  const isRejected = applicationInfo?.applicationStatus === "REJECTED";
  const isPending = !isAccepted && !isRejected;

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Applicants for: {jobs.find((j) => j.id === selectedJob)?.jobname}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          aria-label="Close applicants list"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border-l-4 border-red-500"
              : "bg-green-50 text-green-700 border-l-4 border-green-500"
          }`}
        >
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
          <p>{message.text}</p>
        </div>
      )}

      {applicationInfo && (
        <div className="mb-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
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
              <div>
                <h3 className="text-lg font-medium">
                  {applicationInfo.firstname} {applicationInfo.lastname}
                </h3>
                <p className="text-sm text-gray-500">
                  {applicationInfo.useremail}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAccepted && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Accepted
                </span>
              )}
              {isRejected && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Rejected
                </span>
              )}
              {isPending && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  Pending Review
                </span>
              )}
              <button
                onClick={closeApplicationView}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
                aria-label="Close application view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Application Details
              </h4>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">Applied On:</span>
                  <span className="font-medium">
                    {applicationInfo.uploadDate
                      ? new Date(
                          applicationInfo.uploadDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium">
                    {applicationInfo.applicationStatus || "Pending"}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Resume Details
              </h4>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="text-gray-600">File Name:</span>
                  <span className="font-medium truncate max-w-xs">
                    {applicationInfo.filename || "N/A"}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-medium">
                    {formatFileSize(applicationInfo.fileSize)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() =>
                handleApplicationAction("accept", applicationInfo.useremail)
              }
              disabled={actionLoading.accept || isAccepted || isRejected}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                actionLoading.accept
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isAccepted
                  ? "bg-green-100 text-green-700 cursor-not-allowed"
                  : isRejected
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {actionLoading.accept ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                  Processing...
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {isAccepted ? "Accepted" : "Accept"}
                </>
              )}
            </button>

            <button
              onClick={() =>
                handleApplicationAction("reject", applicationInfo.useremail)
              }
              disabled={actionLoading.reject || isRejected || isAccepted}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                actionLoading.reject
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isRejected
                  ? "bg-red-100 text-red-700 cursor-not-allowed"
                  : isAccepted
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {actionLoading.reject ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
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
                  Processing...
                </>
              ) : (
                <>
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  {isRejected ? "Rejected" : "Reject"}
                </>
              )}
            </button>

            {applicationInfo.resumeUrl && (
              <a
                href={applicationInfo.resumeUrl}
                download={applicationInfo.filename || "resume"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download Resume
              </a>
            )}
          </div>

          {applicationInfo.resumeUrl ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {applicationInfo.fileType === "application/pdf" ? (
                <iframe
                  src={applicationInfo.resumeUrl}
                  className="w-full h-96"
                  title={`Resume of ${applicationInfo.firstname} ${applicationInfo.lastname}`}
                />
              ) : (
                <div className="p-8 text-center bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-3 text-gray-500">
                    Preview not available for this file type
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-3 text-gray-500">No resume file available</p>
            </div>
          )}
        </div>
      )}

      {applicants.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
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
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {applicant.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          Applied{" "}
                          {applicant.applicationDate
                            ? new Date(
                                applicant.applicationDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <a
                        href={`mailto:${applicant.useremail}`}
                        className="flex items-center hover:text-blue-600"
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {applicant.useremail}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => viewApplication(applicant.useremail)}
                      disabled={actionLoading.view}
                      className={`inline-flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors ${
                        actionLoading.view
                          ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {actionLoading.view ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                            className="-ml-1 mr-2 h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No applicants yet
          </h3>
          <p className="mt-1 text-gray-500">
            Check back later or share your job posting to attract candidates
          </p>
          <div className="mt-6">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="-ml-1 mr-2 h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;
