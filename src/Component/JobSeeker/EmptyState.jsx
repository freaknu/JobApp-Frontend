import React from "react";

const EmptyState = ({
  activeTab,
  searchTerm,
  searchTechnology,
  handleResetSearch,
  setActiveTab,
}) => {
  return (
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
          {activeTab === "available"
            ? searchTerm || searchTechnology
              ? "No matching jobs found"
              : "No available jobs"
            : "No applications yet"}
        </h3>
        <p className="mt-2 text-gray-500">
          {activeTab === "available"
            ? searchTerm || searchTechnology
              ? "Try adjusting your search criteria"
              : "Check back later for new job postings"
            : "Browse available jobs and apply to get started"}
        </p>
        {activeTab === "available" && (searchTerm || searchTechnology) ? (
          <button
            onClick={handleResetSearch}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset Search
          </button>
        ) : activeTab === "applied" ? (
          <button
            onClick={() => setActiveTab("available")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Available Jobs
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default EmptyState;
