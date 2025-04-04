import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Header from "./Header";
import SearchSection from "./SearchSection";
import TabsSection from "./TabsSection";
import JobCard from "./JobCard";
import AppliedJobCard from "./AppliedJobCard";
import EmptyState from "./EmptyState";
import LoadingIndicator from "./LoadingIndicator";
import ApplyModal from "./ApplyModal";
import ErrorAlert from "./ErrorAlert";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTechnology, setSearchTechnology] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [currentJobId, setCurrentJobId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          navigate("/login");
          return;
        }
      } catch (e) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [jobsResponse, applicationsResponse] = await Promise.all([
        axios.get(`${backendURL}/jobseeker/jobs`, config),
        axios.get(`${backendURL}/jobseeker/myapplications`, config),
      ]);

      setJobs(jobsResponse.data);
      setAppliedJobs(applicationsResponse.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load data. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("Please upload a PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size should be less than 5MB");
        return;
      }
      setSelectedFile(file);
      setFileError("");
    }
  };

  const handleOpenModal = (jobId) => {
    console.log("Opening modal for jobId:", jobId);
    setCurrentJobId(jobId);
    setShowModal(true);
  };

  const handleApply = async (jobId) => {
    console.log("Applying for jobId:", jobId);
    try {
      if (!jobId) {
        console.error("No job ID provided.");
        alert("No job selected");
        return;
      }

      if (!selectedFile) {
        setFileError("Please select a resume file");
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("resume", selectedFile);

      await axios.post(`${backendURL}/jobseeker/applyjob/${jobId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchData();
      setShowModal(false);
      setSelectedFile(null);
      setFileError("");
      setCurrentJobId(null);
    } catch (err) {
      console.error("Application error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setFileError(
          err.response?.data?.message || "Failed to apply. Please try again."
        );
      }
    }
  };

  const handleSearch = async () => {
    try {
      setIsSearching(true);
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${backendURL}/jobseeker/jobs/search`, {
        params: {
          technology: searchTechnology,
          keyword: searchTerm,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleResetSearch = async () => {
    setSearchTerm("");
    setSearchTechnology("");
    await fetchData();
  };

  const handleWithdraw = async (jobId) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`${backendURL}/jobseeker/withdraw/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchData();
    } catch (err) {
      console.error("Withdrawal error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to withdraw application. Please try again."
        );
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <ApplyModal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        fileError={fileError}
        handleApply={handleApply}
        setSelectedFile={setSelectedFile}
        setFileError={setFileError}
        currentJobId={currentJobId}
      />

      <div className="max-w-7xl mx-auto">
        <Header handleLogout={handleLogout} />

        {error && <ErrorAlert error={error} />}

        <SearchSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchTechnology={searchTechnology}
          setSearchTechnology={setSearchTechnology}
          handleSearch={handleSearch}
          handleResetSearch={handleResetSearch}
          isSearching={isSearching}
        />

        <TabsSection
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          appliedJobsCount={appliedJobs.length}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeTab === "available" ? (
            jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  handleOpenModal={handleOpenModal}
                  formatDate={formatDate}
                />
              ))
            ) : (
              <EmptyState
                activeTab={activeTab}
                searchTerm={searchTerm}
                searchTechnology={searchTechnology}
                handleResetSearch={handleResetSearch}
                setActiveTab={setActiveTab}
              />
            )
          ) : appliedJobs.length > 0 ? (
            appliedJobs.map((job) => (
              <AppliedJobCard
                key={job.id}
                job={job}
                handleWithdraw={() => handleWithdraw(job.id)}
                formatDate={formatDate}
              />
            ))
          ) : (
            <EmptyState
              activeTab={activeTab}
              searchTerm={searchTerm}
              searchTechnology={searchTechnology}
              handleResetSearch={handleResetSearch}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
