import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JobList from "./JobLIst";
import AddJobForm from "./AddForm";
import ApplicantsList from "./ApplicantsList";
import DashboardHeader from "./DashboardHeader";
import Navbar from "../Navbar";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const JobProviderDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [newJob, setNewJob] = useState({
    jobname: "",
    jobdescription: "",
    technology: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    if (isMounted) fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${backendURL}/jobprovider/myjobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setJobs(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (job) => {
    setLoadingApplicants(true);
    setMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${backendURL}/jobprovider/job/getapplicants/${job.jobid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setApplicants(response.data);
      setSelectedJob(job.jobid);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleError = (err) => {
    let errorMessage = "An error occurred. Please try again.";

    if (err.response) {
      switch (err.response.status) {
        case 401:
          errorMessage = "Session expired. Please login again.";
          localStorage.removeItem("authToken");
          navigate("/login");
          break;
        case 403:
          errorMessage = "You don't have permission to perform this action";
          break;
        case 404:
          errorMessage = "Resource not found";
          break;
        case 500:
          errorMessage = "Server error. Please try again later";
          break;
        default:
          errorMessage = err.response.data?.message || errorMessage;
      }
    } else if (err.request) {
      errorMessage = "Network error. Please check your connection";
    }

    setMessage({ text: errorMessage, type: "error" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", type: "" });
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${backendURL}/jobprovider/addjob`,
        {
          jobname: newJob.jobname,
          jobdescription: newJob.jobdescription,
          technology: newJob.technology,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setJobs((prev) => [...prev, response.data]);
      setNewJob({ jobname: "", jobdescription: "", technology: "" });
      setShowAddForm(false);
      setMessage({
        text: "Job posted successfully!",
        type: "success",
      });
    } catch (err) {
      handleError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!jobId) {
      setMessage({ text: "Invalid job ID", type: "error" });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete job ${jobId}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`${backendURL}/jobprovider/deletejob/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job.jobid !== jobId));

      if (selectedJob === jobId) {
        setApplicants([]);
        setSelectedJob(null);
      }

      setMessage({
        text: `Job ${jobId} deleted successfully`,
        type: "success",
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewJob({
      jobname: "",
      jobdescription: "",
      technology: "",
    });
    setMessage({ text: "", type: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const clearMessage = () => {
    setMessage({ text: "", type: "" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader
            title="Job Provider Dashboard"
            onLogout={handleLogout}
            error={message.text && message.type === "error" ? message.text : ""}
            onClearError={clearMessage}
          />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">My Job Postings</h2>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setNewJob({
                  jobname: "",
                  jobdescription: "",
                  technology: "",
                });
              }}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              {showAddForm ? "Cancel" : "Add New Job"}
            </button>
          </div>

          {message.text && message.type === "success" && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {message.text}
              </div>
              <button
                onClick={clearMessage}
                className="p-1 rounded-full hover:bg-green-100"
                aria-label="Clear message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {showAddForm && (
            <AddJobForm
              newJob={newJob}
              onInputChange={handleInputChange}
              onSubmit={handleAddJob}
              onCancel={handleCancelAdd}
              isSubmitting={isSubmitting}
            />
          )}

          <JobList
            jobs={jobs}
            loading={loading}
            showAddForm={showAddForm}
            selectedJob={selectedJob}
            onFetchApplicants={fetchApplicants}
            onEditJob={(job) => {
              setNewJob({
                jobname: job.jobname,
                jobdescription: job.jobdescription,
                technology: job.technology,
              });
              setShowAddForm(true);
            }}
            onDeleteJob={handleDeleteJob}
          />

          {selectedJob && (
            <ApplicantsList
              applicants={applicants}
              selectedJob={selectedJob}
              jobs={jobs}
              loading={loadingApplicants}
              onClose={() => {
                setSelectedJob(null);
                setApplicants([]);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default JobProviderDashboard;
