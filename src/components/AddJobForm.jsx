import React, { useState } from "react";

const AddJobForm = ({ onSubmit, onCancel }) => {
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    deadline: "",
    skills: [], // Add skills field
    skillsRequired: "",
    experienceRequired: "",
    jobPosition: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setJobForm((prev) => ({ ...prev, skills }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(jobForm);
    }
    setJobForm({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      experience: "",
      salary: "",
      description: "",
      requirements: "",
      deadline: "",
      skills: [],
      skillsRequired: "",
      experienceRequired: "",
      jobPosition: "",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Create New Job Posting</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={jobForm.title}
              onChange={handleInputChange}
              placeholder="e.g. Senior Software Engineer"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <input
              type="text"
              name="department"
              value={jobForm.department}
              onChange={handleInputChange}
              placeholder="e.g. Engineering"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={jobForm.location}
              onChange={handleInputChange}
              placeholder="e.g. Remote, New York"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Type *
            </label>
            <select
              name="type"
              value={jobForm.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level *
            </label>
            <input
              type="text"
              name="experience"
              value={jobForm.experience}
              onChange={handleInputChange}
              placeholder="e.g. 3-5 years"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <input
              type="text"
              name="salary"
              value={jobForm.salary}
              onChange={handleInputChange}
              placeholder="e.g. $80,000 - $120,000"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Deadline *
            </label>
            <input
              type="date"
              name="deadline"
              value={jobForm.deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description *
          </label>
          <textarea
            name="description"
            value={jobForm.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements *
          </label>
          <textarea
            name="requirements"
            value={jobForm.requirements}
            onChange={handleInputChange}
            rows="4"
            placeholder="List the required skills, qualifications, and experience..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            onChange={handleSkillsChange}
            placeholder="e.g., React, Node.js, Python"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills Required (comma-separated)
          </label>
          <input
            type="text"
            name="skillsRequired"
            value={jobForm.skillsRequired}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Required
          </label>
          <input
            type="text"
            name="experienceRequired"
            value={jobForm.experienceRequired}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Position
          </label>
          <input
            type="text"
            name="jobPosition"
            value={jobForm.jobPosition}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-rose-500 hover:bg-rose-500 text-white rounded-lg font-medium transition-colors"
          >
            Create Job Posting
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJobForm;