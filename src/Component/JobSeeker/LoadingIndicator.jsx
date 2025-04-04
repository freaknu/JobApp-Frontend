import React from "react";

const LoadingIndicator = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-xl text-gray-600">Loading your dashboard...</div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
