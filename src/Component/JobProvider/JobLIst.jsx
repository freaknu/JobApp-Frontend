import React from "react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const JobList = ({
  jobs,
  showAddForm,
  selectedJob,
  onFetchApplicants,
  onEditJob,
  onDeleteJob,
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div
            key={job.jobid}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {job.jobname}
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {formatDate(job.postedDate)}
                </span>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {job.jobdescription}
              </p>

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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
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

              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() => onFetchApplicants(job.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedJob === job.jobid
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Applicants
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditJob(job)}
                    className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteJob(job.id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-3 text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="max-w-md mx-auto">
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
            <h3 className="mt-4 text-lg font-medium text-gray-700">
              {showAddForm
                ? "Add your first job posting"
                : "You have no job postings yet"}
            </h3>
            <p className="mt-2 text-gray-500">
              {showAddForm
                ? "Fill out the form above to create your first job posting"
                : "Click 'Add New Job' to get started"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
