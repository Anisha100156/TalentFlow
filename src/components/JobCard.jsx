import React from "react";

const JobCard = ({ job, onDelete, onViewJob }) => {
  const companyInitial = job.companyName
    ? job.companyName.charAt(0).toUpperCase()
    : "C";

  const formatDate = (date) => {
    if (!date) return "Posted recently";
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) return `Posted ${diffHours} hours ago`;
    if (diffDays < 30) return `Posted ${diffDays} days ago`;
    return `Posted ${Math.floor(diffDays / 30)} month${
      Math.floor(diffDays / 30) > 1 ? "s" : ""
    } ago`;
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {companyInitial}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
            <p className="text-sm text-gray-400">
              {job.companyName} • {job.applicationsSent || 0} Applicants
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-yellow-400 transition-colors">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>

      {/* Skills and Requirements */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.experienceRequired && (
          <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold">
            {job.experienceRequired}
          </span>
        )}
        {job.jobPosition && (
          <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold">
            {job.jobPosition}
          </span>
        )}
        {job.skillsRequired &&
          job.skillsRequired.split(",").map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-semibold"
            >
              {skill.trim()}
            </span>
          ))}
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {job.description ||
          job.roleOverview ||
          `A ${job.title} at ${job.companyName} is responsible for creating, building, and maintaining scalable systems and applications...`}
      </p>

      {/* Job Details */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700 mb-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <span>{job.salary || "₹78 LPA"}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewJob(job)}
          className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-colors"
        >
          View Job
        </button>
        <button
          className="px-4 py-3 bg-gray-700 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
          onClick={() => onDelete(job.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;
