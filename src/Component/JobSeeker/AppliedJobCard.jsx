import React from "react";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const AppliedJobCard = ({ job, handleWithdraw, formatDate }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-green-500 transform hover:scale-[1.02] transition-transform duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold text-gray-800">{job.jobname}</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Posted on {formatDate(job.jobpost)}
          </span>
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
            {job.technology.split(",").map((tech, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          {job.resume && (
            <a
              href={`${backendURL}/jobseeker/resume/${job.resume.id}`}
              target="_blank"
              rel="noopener noreferrer"
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
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              View Submitted Resume
            </a>
          )}
          <button
            onClick={() => handleWithdraw(job.jobid)}
            className="text-red-600 hover:text-red-800 text-sm flex items-center"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Withdraw Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppliedJobCard;
