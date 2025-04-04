import React from "react";

const SearchSection = ({
  searchTerm,
  setSearchTerm,
  searchTechnology,
  setSearchTechnology,
  handleSearch,
  handleResetSearch,
  isSearching,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="keyword-search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search by Keyword
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              id="keyword-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Job title, description..."
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="technology-search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search by Technology
          </label>
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              id="technology-search"
              value={searchTechnology}
              onChange={(e) => setSearchTechnology(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Java, React, etc..."
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-3">
        {(searchTerm || searchTechnology) && (
          <button
            onClick={handleResetSearch}
            disabled={isSearching}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={isSearching || (!searchTerm && !searchTechnology)}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isSearching || (!searchTerm && !searchTechnology)
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSearching ? "Searching..." : "Search Jobs"}
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
