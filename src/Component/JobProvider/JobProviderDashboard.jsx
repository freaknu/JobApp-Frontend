import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JobList from "../JobProvider/JobLIst";
import AddJobForm from "./AddForm";
import ApplicantsList from "./ApplicantsList";
import DashboardHeader from "./DashboardHeader";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const JobProviderDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newJob, setNewJob] = useState({
    jobname: "",
    jobdescription: "",
    technology: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
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
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
       `${backendURL}/jobprovider/myjobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setJobs(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async (id) => {
    setLoadingApplicants(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${backendURL}/jobprovider/job/getapplicants/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setApplicants(response.data);
      setSelectedJob(id);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleError = (err) => {
    if (err.response?.status === 401) {
      setError("Session expired. Please login again.");
      localStorage.removeItem("authToken");
      navigate("/login");
    } else {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    setError("");
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
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!jobId) {
      setError("Invalid job ID");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }
      if (!window.confirm(`Are you sure you want to delete job ${jobId}?`)) {
        return;
      }

      const response = await axios.delete(
        `${backendURL}/jobprovider/deletejob/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setJobs((prevJobs) => prevJobs.filter((job) => job.jobid !== jobId));

        if (selectedJob === jobId) {
          setApplicants([]);
          setSelectedJob(null);
        }

        setError("");
        alert(`Job ${jobId} deleted successfully`);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError(`Job ${jobId} not found - refreshing list...`);
          fetchJobs();
        } else {
          setError(error.response.data || "Failed to delete job");
        }
      } else {
        setError("Network error - please check your connection");
      }
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
    setNewJob({
      jobname: "",
      jobdescription: "",
      technology: "",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title="Job Provider Dashboard"
          onLogout={handleLogout}
          error={error}
          onClearError={() => setError("")}
        />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">My Job Postings</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showAddForm ? "Cancel" : "Add New Job"}
          </button>
        </div>

        {showAddForm && (
          <AddJobForm
            newJob={newJob}
            onInputChange={handleInputChange}
            onSubmit={handleAddJob}
            onCancel={handleCancelAdd}
          />
        )}

        <JobList
          jobs={jobs}
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
  );
};

export default JobProviderDashboard;
