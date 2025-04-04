import React from "react";

const JobCard = ({ job, handleOpenModal, formatDate }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-xl font-semibold text-gray-800">{job.jobname}</h2>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {formatDate(job.jobpost)}
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
        <p className="text-gray-700 mb-4 line-clamp-3">{job.jobdescription}</p>

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

        <div className="flex justify-end mt-4">
          <button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            onClick={() => handleOpenModal(job.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
