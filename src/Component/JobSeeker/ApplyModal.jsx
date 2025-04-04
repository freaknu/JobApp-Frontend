import React from "react";

const ApplyModal = ({
  showModal,
  setShowModal,
  selectedFile,
  handleFileChange,
  fileError,
  handleApply,
  setSelectedFile,
  setFileError,
  currentJobId,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Apply for Job</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF only, max 5MB)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {fileError && (
            <p className="mt-1 text-sm text-red-600">{fileError}</p>
          )}
          {selectedFile && (
            <p className="mt-2 text-sm text-green-600">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setShowModal(false);
              setSelectedFile(null);
              setFileError("");
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleApply(currentJobId)}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              !selectedFile
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
