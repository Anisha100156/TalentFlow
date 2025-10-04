import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Building2, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CandidatesDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  const stages = [
    { value: '', label: 'All Stages', color: 'bg-gray-800 text-white' },
    { value: 'applied', label: 'Applied', color: 'bg-[hsl(335.1,77.6%,42%)] text-white' },
    { value: 'screen', label: 'Screening', color: 'bg-[hsl(335.1,77.6%,42%)] text-white' },
    { value: 'tech', label: 'Technical', color: 'bg-[hsl(335.1,77.6%,42%)] text-white' },
    { value: 'offer', label: 'Offer', color: 'bg-[hsl(335.1,77.6%,42%)] text-white' },
    { value: 'hired', label: 'Hired', color: 'bg-[hsl(335.1,77.6%,42%)] text-white' },
    { value: 'rejected', label: 'Rejected', color: 'bg-[hsl(335.1,77.6%,42%)] text-white' }
  ];

  const getStageColor = (stage) => {
    const stageObj = stages.find(s => s.value === stage);
    return stageObj ? stageObj.color : 'bg-gray-800 text-white';
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [currentPage, searchTerm, selectedStage]);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs?pageSize=25');
      const data = await response.json();
      const jobsMap = {};
      data.jobs.forEach(job => {
        jobsMap[job.id] = job;
      });
      setJobs(jobsMap);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStage && { stage: selectedStage })
      });
      
      const response = await fetch(`/api/candidates?${params}`);
      const data = await response.json();
      setCandidates(data.candidates);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStageFilter = (stage) => {
    setSelectedStage(stage);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  const stageCounts = stages.slice(1).map(stage => {
    const count = candidates.filter(c => c.stage === stage.value).length;
    return { ...stage, count };
  });

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Candidates Dashboard</h1>
          <p className="text-white">Manage and track all candidates across different stages</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          {stages.map(stage => (
            <div
              key={stage.value}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedStage === stage.value
                  ? 'border-white shadow-md'
                  : 'border-transparent hover:border-white'
              } bg-gray-900`}
              onClick={() => handleStageFilter(stage.value)}
            >
              <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${stage.color} mb-2`}>
                {stage.label}
              </div>
              <div className="text-2xl font-bold text-white">
                {stage.value === '' ? total : stageCounts.find(s => s.value === stage.value)?.count || 0}
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900 rounded-lg shadow-sm p-4 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[hsl(335.1,77.6%,42%)] w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[hsl(335.1,77.6%,42%)] rounded-lg focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)] focus:border-transparent bg-gray-800 text-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-[hsl(335.1,77.6%,42%)] w-5 h-5" />
              <select
                value={selectedStage}
                onChange={(e) => handleStageFilter(e.target.value)}
                className="px-4 py-2 border border-[hsl(335.1,77.6%,42%)] rounded-lg focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)] focus:border-transparent bg-gray-800 text-white"
              >
                {stages.map(stage => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[hsl(335.1,77.6%,42%)] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Loading candidates...</p>
          </div>
        )}

        {/* Candidates Grid */}
        {!loading && candidates.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {candidates.map(candidate => {
                const job = jobs[candidate.jobId];
                return (
                  <div
                    key={candidate.id}
                    className="bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[hsl(335.1,77.6%,42%)] rounded-full flex items-center justify-center text-white font-semibold">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{candidate.name}</h3>
                          <p className="text-xs text-white">{candidate.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mb-3 ${getStageColor(candidate.stage)}`}>
                      {stages.find(s => s.value === candidate.stage)?.label || candidate.stage}
                    </div>

                    {job && (
                      <div className="space-y-2 pt-3 border-t border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-white">
                          <Briefcase className="w-4 h-4 text-[hsl(335.1,77.6%,42%)]" />
                          <span className="font-medium">{job.jobPosition}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white">
                          <Building2 className="w-4 h-4 text-[hsl(335.1,77.6%,42%)]" />
                          <span>{job.companyName}</span>
                        </div>
                        <div className="text-xs text-white mt-2">
                          {job.experienceRequired} • {job.salary}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="bg-gray-900 rounded-lg shadow-sm p-4 flex items-center justify-between border border-gray-700">
              <div className="text-sm text-white">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} candidates
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-[hsl(335.1,77.6%,42%)] rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-[hsl(335.1,77.6%,42%)] rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && candidates.length === 0 && (
          <div className="bg-gray-900 rounded-lg shadow-sm p-12 text-center border border-gray-700">
            <Users className="w-16 h-16 text-[hsl(335.1,77.6%,42%)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No candidates found</h3>
            <p className="text-white">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}