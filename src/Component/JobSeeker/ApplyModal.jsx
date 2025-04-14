import React, { useState } from "react";

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
  userEmail,
  applyError,
  applySuccess,
  setApplyError,
  setApplySuccess,
  isApplying,
}) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    useCustomEmail: false,
  });

  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [localSuccess, setLocalSuccess] = useState(null);
  const [localError, setLocalError] = useState(null);

  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      useCustomEmail: false,
    });
    setFormErrors({
      firstname: "",
      lastname: "",
      email: "",
    });
    setSelectedFile(null);
    setFileError("");
    setLocalSuccess(null);
    setLocalError(null);
    setApplyError(null);
    setApplySuccess(null);
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }


    if (localError || localSuccess) {
      setLocalError(null);
      setLocalSuccess(null);
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
      valid = false;
    }

    if (!formData.lastname.trim()) {
      newErrors.lastname = "Last name is required";
      valid = false;
    }

    if ((formData.useCustomEmail || !userEmail) && !formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (
      (formData.useCustomEmail || !userEmail) &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setLocalError("Please fix the errors in the form");
      return;
    }

    if (!selectedFile) {
      setFileError("Resume is required");
      setLocalError("Please upload your resume");
      return;
    }

    try {
      const applicationEmail = formData.useCustomEmail
        ? formData.email
        : userEmail || formData.email;

      await handleApply(currentJobId, selectedFile, {
        ...formData,
        email: applicationEmail,
      });
      setLocalSuccess("Application submitted successfully!");
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error("Application error:", error);
      setLocalError(
        error.message || "Failed to submit application. Please try again."
      );
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-4">Apply for Job</h3>
        {applySuccess && (
          <div className="mb-4 p-2 text-sm text-green-700 bg-green-100 rounded">
            {applySuccess}
          </div>
        )}
        {applyError && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded">
            {applyError}
          </div>
        )}

        {localSuccess && (
          <div className="mb-4 p-2 text-sm text-green-700 bg-green-100 rounded">
            {localSuccess}
          </div>
        )}
        {localError && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded">
            {localError}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {formErrors.firstname && (
            <p className="mt-1 text-sm text-red-600">{formErrors.firstname}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {formErrors.lastname && (
            <p className="mt-1 text-sm text-red-600">{formErrors.lastname}</p>
          )}
        </div>

        {userEmail && (
          <div className="mb-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="useCustomEmail"
                checked={formData.useCustomEmail}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Use a different email than my account email ({userEmail})
              </label>
            </div>
          </div>
        )}

        {(formData.useCustomEmail || !userEmail) && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF only, max 5MB) *
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
            onClick={handleClose}
            disabled={isApplying}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isApplying ||
              !selectedFile ||
              !formData.firstname ||
              !formData.lastname ||
              ((formData.useCustomEmail || !userEmail) && !formData.email)
            }
            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
              isApplying ||
              !selectedFile ||
              !formData.firstname ||
              !formData.lastname ||
              ((formData.useCustomEmail || !userEmail) && !formData.email)
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isApplying ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
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
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
