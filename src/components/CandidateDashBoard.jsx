import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Filter, CheckCircle, Clock, FileText } from "lucide-react";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { job } = location.state || {};
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    salaryMin: "",
    salaryMax: "",
    experience: "",
    skills: ""
  });
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' or 'applied'
  const [applicationStatuses, setApplicationStatuses] = useState({});

  // Load applications from localStorage
  useEffect(() => {
    const savedApplications = localStorage.getItem("candidateApplications");
    if (savedApplications) {
      const parsed = JSON.parse(savedApplications);
      setAppliedJobs(parsed.jobIds || []);
      setApplicationStatuses(parsed.statuses || {});
    }
  }, []);

  // Persist applications always
  useEffect(() => {
    localStorage.setItem(
      "candidateApplications",
      JSON.stringify({
        jobIds: appliedJobs,
        statuses: applicationStatuses
      })
    );
  }, [appliedJobs, applicationStatuses]);

  // Fetch jobs
  useEffect(() => {
    let polling = true;
    const fetchJobs = async () => {
      try {
        const response = await axios.get("/api/jobs", {
          params: { page: 1, pageSize: 1000, status: "active" }
        });
        setJobs(response.data.jobs || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
        setLoading(false);
      }
    };

    fetchJobs();

    const interval = setInterval(() => {
      if (polling && activeTab === "all") fetchJobs();
    }, 5000); // poll only in All Jobs tab

    return () => {
      polling = false;
      clearInterval(interval);
    };
  }, [activeTab]);

  const fetchAssessments = async (jobId) => {
    try {
      const response = await axios.get(`/api/assessments/${jobId}`);
      if (response.data.assessment) {
        return [response.data.assessment];
      }
      return [];
    } catch {
      return [];
    }
  };

  const handleApply = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs([...appliedJobs, jobId]);
      setApplicationStatuses({
        ...applicationStatuses,
        [jobId]: {
          stage: "applied",
          appliedDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      });
      alert("Application submitted successfully!");
    }
  };

  const handleViewJob = async (job) => {
    const jobAssessments = await fetchAssessments(job.id);
    navigate(`/view-job/${job.id}`, {
      state: { job, role: "candidate", assessments: jobAssessments }
    });
  };

  const getStageInfo = (stage) => {
    const stages = {
      applied: {
        label: "Applied",
        color: "bg-rose-500/20 text-rose-300",
        icon: FileText
      },
      screen: {
        label: "Screening",
        color: "bg-yellow-600/20 text-yellow-400",
        icon: Clock
      },
      tech: {
        label: "Technical Round",
        color: "bg-rose-500/20 text-rose-300",
        icon: Clock
      },
      offer: {
        label: "Offer Extended",
        color: "bg-green-600/20 text-green-400",
        icon: CheckCircle
      },
      hired: {
        label: "Hired",
        color: "bg-green-700/30 text-green-300",
        icon: CheckCircle
      },
      rejected: {
        label: "Not Selected",
        color: "bg-red-600/20 text-red-400",
        icon: FileText
      }
    };
    return stages[stage] || stages.applied;
  };

  const getProgressPercentage = (stage) => {
    const progressMap = {
      applied: 20,
      screen: 40,
      tech: 60,
      offer: 80,
      hired: 100,
      rejected: 0
    };
    return progressMap[stage] ?? 20;
  };

  const parseSalary = (salary) => {
    if (!salary) return null;
    const match = salary.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  };

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    if (activeTab === "applied" && !appliedJobs.includes(job.id)) return false;
    if (activeTab === "all" && appliedJobs.includes(job.id)) return false;
    if (
      searchQuery &&
      !job.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    const salaryNum = parseSalary(job.salary);
    if (filters.salaryMin && (!salaryNum || salaryNum < parseInt(filters.salaryMin))) return false;
    if (filters.salaryMax && (!salaryNum || salaryNum > parseInt(filters.salaryMax))) return false;

    if (filters.experience && job.experienceRequired !== filters.experience)
      return false;

    if (filters.skills) {
      const jobSkills =
        typeof job.skillsRequired === "string"
          ? job.skillsRequired.toLowerCase()
          : Array.isArray(job.skillsRequired)
          ? job.skillsRequired.join(",").toLowerCase()
          : "";
      const filterSkills = filters.skills
        .toLowerCase()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (!filterSkills.every((skill) => jobSkills.includes(skill))) return false;
    }

    return true;
  });

  const appliedJobsList = jobs.filter((job) => appliedJobs.includes(job.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-rose-500 text-transparent bg-clip-text">
        Candidate Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "all"
              ? "bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          All Jobs ({jobs.length - appliedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab("applied")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "applied"
              ? "bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          My Applications ({appliedJobs.length})
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
        />
        <button
          className="px-4 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg font-medium hover:scale-105 transition flex items-center gap-2 ml-4"
          onClick={() => setShowFilters((f) => !f)}
        >
          <Filter className="w-4 h-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-6 bg-gray-800 rounded-xl shadow border border-gray-700 flex flex-col gap-4">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary Min (LPA)
              </label>
              <input
                type="number"
                value={filters.salaryMin}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, salaryMin: e.target.value }))
                }
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg w-32 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary Max (LPA)
              </label>
              <input
                type="number"
                value={filters.salaryMax}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, salaryMax: e.target.value }))
                }
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg w-32 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, experience: e.target.value }))
                }
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg w-40 text-white"
              >
                <option value="">Any</option>
                <option value="Fresher">Fresher</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Experienced">Experienced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Skills</label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, skills: e.target.value }))
                }
                className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg w-40 text-white"
                placeholder="e.g. React, Python"
              />
            </div>
          </div>
          <button
            onClick={() =>
              setFilters({ salaryMin: "", salaryMax: "", experience: "", skills: "" })
            }
            className="self-start px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Job Listings */}
      {activeTab === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-700 hover:border-rose-500 hover:shadow-rose-500/30 transition"
            >
              <h2 className="text-xl font-semibold text-rose-300 mb-2">
                {job.companyName || "Unknown Company"}
              </h2>
              <p className="text-gray-300 mb-1">
                <span className="font-semibold">Position:</span>{" "}
                {job.jobPosition || "N/A"}
              </p>
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Skills:</span>{" "}
                {Array.isArray(job.skillsRequired)
                  ? job.skillsRequired.join(", ")
                  : job.skillsRequired || "N/A"}
              </p>
              <p className="text-gray-400 mb-1">
                <span className="font-semibold">Experience:</span>{" "}
                {job.experienceRequired || "N/A"}
              </p>
              <p className="text-green-400 font-semibold mb-3">
                <span className="font-semibold">Salary:</span>{" "}
                {job.salary || "Not Disclosed"}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  className="flex-1 py-2 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-xl font-medium hover:scale-105 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                  onClick={() => handleApply(job.id)}
                  disabled={appliedJobs.includes(job.id)}
                >
                  {appliedJobs.includes(job.id) ? "Applied" : "Apply Now"}
                </button>
                <button
                  className="flex-1 py-2 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition"
                  onClick={() => handleViewJob(job)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Applications */}
      {activeTab === "applied" && (
        <div className="space-y-4">
          {appliedJobsList.map((job) => {
            const status = applicationStatuses[job.id] || { stage: "applied" };
            const stageInfo = getStageInfo(status.stage);
            const progress = getProgressPercentage(status.stage);
            const StageIcon = stageInfo.icon;

            return (
              <div
                key={job.id}
                className="bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-700 hover:border-rose-400/40 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-rose-300 mb-1">
                      {job.companyName || "Unknown Company"}
                    </h2>
                    <p className="text-gray-300 mb-2">
                      <span className="font-semibold">Position:</span>{" "}
                      {job.jobPosition || "N/A"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Applied on:{" "}
                      {status.appliedDate
                        ? new Date(status.appliedDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full ${stageInfo.color} flex items-center gap-2`}
                  >
                    <StageIcon className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {stageInfo.label}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {status.stage !== "rejected" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Application Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-rose-400 to-rose-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewJob(job)}
                    className="flex-1 py-2 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-600 transition"
                  >
                    View Job
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;