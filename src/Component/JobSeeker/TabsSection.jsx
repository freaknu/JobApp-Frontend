import React from "react";

const TabsSection = ({ activeTab, setActiveTab, appliedJobsCount }) => {
  return (
    <div className="flex overflow-x-auto mb-6 bg-white rounded-xl shadow-sm">
      <button
        className={`flex-1 px-4 py-3 font-medium text-center transition-colors duration-200 ${
          activeTab === "available"
            ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => setActiveTab("available")}
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
          Available Jobs
        </div>
      </button>
      <button
        className={`flex-1 px-4 py-3 font-medium text-center transition-colors duration-200 ${
          activeTab === "applied"
            ? "text-green-600 border-b-2 border-green-500 bg-green-50"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
        onClick={() => setActiveTab("applied")}
      >
        <div className="flex items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Applied Jobs ({appliedJobsCount})
        </div>
      </button>
    </div>
  );
};

export default TabsSection;
