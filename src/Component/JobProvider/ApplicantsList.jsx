import React, { useState } from "react";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const ApplicantsList = ({ applicants, selectedJob, jobs, onClose }) => {
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loadingResume, setLoadingResume] = useState(false);
  const [resumeError, setResumeError] = useState("");

  const viewResume = async (useremail) => {
    try {
      console.log(useremail);
      setLoadingResume(true);
      setResumeError("");
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${backendURL}/jobprovider/view-resume/${useremail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.resumerl) {
        console.log(response.data.resumerl);
        setResumeInfo(response.data);
      } else {
        setResumeError("No resume found for this applicant");
      }
    } catch (err) {
      setResumeError("Failed to load resume. Please try again.");
      console.error("Error fetching resume:", err);
    } finally {
      setLoadingResume(false);
    }
  };

  const closeResumeView = () => {
    setResumeInfo(null);
    setResumeError("");
  };
  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

      {resumeError && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{resumeError}</p>
        </div>
      )}

      {resumeInfo && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              Resume for {resumeInfo.username || resumeInfo.useremail}
            </h3>
            <button
              onClick={closeResumeView}
              className="text-gray-500 hover:text-gray-700"
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

          <div className="space-y-2 mb-4">
            <p>
              <span className="font-medium">File Name:</span>{" "}
              {resumeInfo.filename || "N/A"}
            </p>
            <p>
              <span className="font-medium">File Type:</span>{" "}
              {resumeInfo.fileType || "N/A"}
            </p>
            <p>
              <span className="font-medium">File Size:</span>{" "}
              {formatFileSize(resumeInfo.fileSize)}
            </p>
            <p>
              <span className="font-medium">Uploaded:</span>{" "}
              {resumeInfo.uploadDate
                ? new Date(resumeInfo.uploadDate).toLocaleString()
                : "N/A"}
            </p>
          </div>

          {resumeInfo.resumerl ? (
            <div className="flex flex-col items-center">
              {resumeInfo.fileType === "application/pdf" ? (
                <iframe
                  src={resumeInfo.resumerl}
                  className="w-full h-96 border border-gray-300 rounded-lg"
                  title={`Resume of ${
                    resumeInfo.username || resumeInfo.useremail
                  }`}
                />
              ) : (
                <p className="text-gray-500 mb-4">
                  Preview not available for this file type
                </p>
              )}
              <a
                href={resumeInfo.resumerl}
                download={resumeInfo.filename || "resume"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
            </div>
          ) : (
            <p className="text-gray-500">No resume file available</p>
          )}
        </div>
      )}

      {applicants.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
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
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center">
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
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => viewResume(applicant.useremail)}
                      disabled={loadingResume}
                      className={`flex items-center gap-1 px-3 py-2 rounded text-sm ${
                        loadingResume
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {loadingResume ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 mr-1"
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
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          View Resume
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
        <div className="text-center py-8 bg-gray-50 rounded-lg">
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
          <h3 className="mt-3 text-lg font-medium text-gray-700">
            No applicants yet
          </h3>
          <p className="mt-1 text-gray-500">Check back later for applicants</p>
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;
