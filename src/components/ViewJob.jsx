import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  Building2,
  CheckCircle2,
  FileText,
} from "lucide-react";

const ViewJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  const role = location.state?.role;

 
  const [loading, setLoading] = useState(false);

  if (!job) {
    return <div className="p-8 text-white">No job selected.</div>;
  }

 
  const skills = Array.isArray(job.skillsRequired)
    ? job.skillsRequired.join(", ")
    : typeof job.skillsRequired === "string"
    ? job.skillsRequired
    : "No skills specified";

  return (
    <div className="min-h-screen w-full bg-gray-900 rounded-none p-10 border border-[hsl(335.1,77.6%,42%)]">
     
      <div className="flex items-center justify-end mb-8 gap-4">
        {role === "recruiter" && (
          <>
            <button
              className="px-6 py-2 bg-[hsl(335.1,77.6%,42%)] text-white font-semibold rounded-xl shadow hover:bg-[hsl(335.1,77.6%,42%)] transition"
              onClick={() => navigate("/assessment-builder", { state: { job } })}
            >
              Assessment Builder
            </button>
            <button
              className="px-6 py-2 bg-[hsl(335.1,77.6%,42%)] text-white font-semibold rounded-xl shadow hover:bg-[hsl(335.1,77.6%,42%)] transition"
              onClick={() => navigate("/kanban-board", { state: { job } })}
            >
              Kanban Board
            </button>
          </>
        )}
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-[hsl(335.1,77.6%,42%)]" />
            {job.title}
          </h2>
          <p className="text-[hsl(335.1,77.6%,42%)] font-medium text-lg mt-1">
            {job.companyName}
          </p>
        </div>
        <button
          className="px-6 py-2 bg-[hsl(335.1,77.6%,42%)] text-white font-semibold rounded-lg shadow-md hover:bg-[hsl(335.1,77.6%,42%)] transition"
          onClick={() => navigate("/candidates")}
        >
          View Candidates
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white mb-8">
        <div className="flex items-center gap-2">
          <MapPin className="text-[hsl(335.1,77.6%,42%)] w-5 h-5" />
          <span>{job.location || "Remote / Not Specified"}</span>
        </div>
        <div className="flex items-center gap-2">
          <IndianRupee className="text-[hsl(335.1,77.6%,42%)] w-5 h-5" />
          <span>{job.salary || "Not Disclosed"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="text-[hsl(335.1,77.6%,42%)] w-5 h-5" />
          <span>{job.experienceRequired || "Experience not specified"}</span>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-3">
          About the Job
        </h3>
        <p className="text-white leading-relaxed">
          {job.description ||
            "No job description provided. Please contact the recruiter for details."}
        </p>
      </section>

      {job.aboutCompany && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-3">
            About {job.companyName}
          </h3>
          <p className="text-white leading-relaxed">{job.aboutCompany}</p>
        </section>
      )}

      {job.skillsRequired && (
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-3">
            Skills Required
          </h3>
          <div className="flex flex-wrap gap-3">
            {skills.split(",").map((skill, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 px-4 py-2 bg-[hsl(335.1,77.6%,42%)] text-white rounded-full text-sm font-medium shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> {skill.trim()}
              </span>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ViewJob;
