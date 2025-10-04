import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Sparkles, Building2, LayoutDashboard, Mail, GitBranch, Settings,
  Edit, Archive, Trash2, GripVertical, X, Filter, Search, Loader2,
  AlertCircle, ChevronLeft, ChevronRight, Tag
} from 'lucide-react';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Toast Notification
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-[hsl(335.1,77.6%,42%)]' : type === 'success' ? 'bg-green-600' : 'bg-blue-600';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50`}>
      <AlertCircle className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const AddJobModal = ({ onSave, onCancel, existingSlugs }) => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    jobPosition: '',
    description: '',
    skillsRequired: '',
    experienceRequired: '',
    salary: '',
    location: '',
    slug: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (existingSlugs.includes(formData.slug)) {
      newErrors.slug = 'Slug must be unique';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Job</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white" disabled={isSubmitting}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.title ? 'ring-2 ring-[hsl(335.1,77.6%,42%)]' : 'focus:ring-[hsl(335.1,77.6%,42%)]'}`}
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-primary text-xs mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug * (auto-generated, editable)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.slug ? 'ring-2 ring-[hsl(335.1,77.6%,42%)]' : 'focus:ring-[hsl(335.1,77.6%,42%)]'}`}
              disabled={isSubmitting}
            />
            {errors.slug && <p className="text-primary text-xs mt-1">{errors.slug}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.companyName ? 'ring-2 ring-[hsl(335.1,77.6%,42%)]' : 'focus:ring-[hsl(335.1,77.6%,42%)]'}`}
              disabled={isSubmitting}
            />
            {errors.companyName && <p className="text-primary text-xs mt-1">{errors.companyName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Position</label>
            <select
              value={formData.jobPosition}
              onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              rows="4"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Skills Required (comma-separated)</label>
            <input
              type="text"
              value={formData.skillsRequired}
              onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              placeholder="e.g. React, JavaScript, Node.js"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Experience Required</label>
            <select
              value={formData.experienceRequired}
              onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              <option value="Fresher">Fresher</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              placeholder="e.g. 80 LPA"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[hsl(335.1,77.6%,42%)] hover:bg-[hsl(335.1,77.6%,42%)] disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Job'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Job Modal
const EditJobModal = ({ job, onSave, onCancel, existingSlugs }) => {
  const [formData, setFormData] = useState({
    title: job.title || '',
    companyName: job.companyName || '',
    jobPosition: job.jobPosition || '',
    description: job.description || '',
    skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired.join(', ') : job.skillsRequired || '',
    experienceRequired: job.experienceRequired || '',
    salary: job.salary || '',
    location: job.location || '',
    slug: job.slug || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (formData.slug !== job.slug && existingSlugs.includes(formData.slug)) {
      newErrors.slug = 'Slug must be unique';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Job</h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white" disabled={isSubmitting}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.title ? 'ring-2 ring-[hsl(335.1,77.6%,42%)]' : 'focus:ring-[hsl(335.1,77.6%,42%)]'}`}
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-[hsl(335.1,77.6%,42%)] text-xs mt-1">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.slug ? 'ring-2 ring-[hsl(335.1,77.6%,42%)]' : 'focus:ring-[hsl(335.1,77.6%,42%)]'}`}
              disabled={isSubmitting}
            />
            {errors.slug && <p className="text-[hsl(335.1,77.6%,42%)] text-xs mt-1">{errors.slug}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Company Name *</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className={`w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 ${errors.companyName ? 'ring-2 ring-[hsl(335.1,77.6%,42%)]' : 'focus:ring-[hsl(335.1,77.6%,42%)]'}`}
              disabled={isSubmitting}
            />
            {errors.companyName && <p className="text-[hsl(335.1,77.6%,42%)] text-xs mt-1">{errors.companyName}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Position</label>
            <select
              value={formData.jobPosition}
              onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              rows="4"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Skills Required (comma-separated)</label>
            <input
              type="text"
              value={formData.skillsRequired}
              onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              placeholder="e.g. React, JavaScript, Node.js"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Experience Required</label>
            <select
              value={formData.experienceRequired}
              onChange={(e) => setFormData({ ...formData, experienceRequired: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              disabled={isSubmitting}
            >
              <option value="">Select</option>
              <option value="Fresher">Fresher</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Salary</label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              placeholder="e.g. 80 LPA"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-[hsl(335.1,77.6%,42%)] hover:bg-[hsl(335.1,77.6%,42%)] disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// JobCard component
const JobCard = ({ job, onDelete, onViewJob, onEdit, onArchive, onDragStart, onDragEnd, onDragOver, onDrop, isDragging }) => {
  const companyInitial = job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C';

  const formatDate = (date) => {
    if (!date) return 'Posted recently';
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) return `Posted ${diffHours} hours ago`;
    if (diffDays < 30) return `Posted ${diffDays} days ago`;
    return `Posted ${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, job)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, job)}
      className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 cursor-move ${isDragging ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'} ${job.status === 'archived' ? 'border-yellow-500' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="cursor-move">
            <GripVertical className="w-5 h-5 text-gray-500" />
          </div>
          <div className="w-12 h-12 bg-[hsl(335.1,77.6%,42%)] rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
            {companyInitial}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {job.title}
              {job.status === 'archived' && (
                <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">ARCHIVED</span>
              )}
            </h3>
            <p className="text-sm text-gray-400">
              {job.companyName} • {job.applicationsSent || 0} Applicants
            </p>
            <p className="text-xs text-gray-500 mt-1">Slug: {job.slug}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.experienceRequired && (
          <span className="px-3 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded-full text-xs font-semibold">
            {job.experienceRequired}
          </span>
        )}
        {job.jobPosition && (
          <span className="px-3 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded-full text-xs font-semibold">
            {job.jobPosition}
          </span>
        )}
        {job.skillsRequired && (
          Array.isArray(job.skillsRequired)
            ? job.skillsRequired.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded-full text-xs font-semibold">
                  {skill}
                </span>
              ))
            : typeof job.skillsRequired === "string" && job.skillsRequired.length > 0
              ? job.skillsRequired.split(',').slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded-full text-xs font-semibold">
                    {skill.trim()}
                  </span>
                ))
              : null
        )}
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {job.description || job.roleOverview || `A ${job.title} at ${job.companyName} is responsible for creating, building, and maintaining scalable systems and applications...`}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700 mb-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <span>{job.salary || '₹78 LPA'}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onViewJob(job)}
          className="flex-1 py-2 bg-[hsl(335.1,77.6%,42%)] hover:bg-[hsl(335.1,77.6%,42%)] text-white rounded-lg text-sm font-bold transition-colors">
          View
        </button>
        <button
          onClick={() => onEdit(job)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          title="Edit Job"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onArchive(job)}
          className={`px-3 py-2 ${job.status === 'archived' ? 'bg-green-600 hover:bg-green-500' : 'bg-yellow-600 hover:bg-yellow-500'} text-white rounded-lg transition-colors`}
          title={job.status === 'archived' ? 'Unarchive Job' : 'Archive Job'}
        >
          <Archive className="w-4 h-4" />
        </button>
        <button
          className="px-3 py-2 bg-[hsl(335.1,77.6%,42%)] hover:bg-[hsl(335.1,77.6%,42%)] text-white rounded-lg transition-colors"
          onClick={() => onDelete(job.id)}
          title="Delete Job"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Sidebar component
const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contact', label: 'Contact leads', icon: Mail },
    { id: 'integration', label: 'Integration', icon: GitBranch },
    { id: 'admin', label: 'Admin panel', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 px-4 py-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          <span className="text-[hsl(335.1,77.6%,42%)]">Talent</span> <span className="text-white">Flow</span>
        </h1>
      </div>

      <button className="w-full mb-8 px-4 py-3 bg-[hsl(335.1,77.6%,42%)] hover:bg-[hsl(335.1,77.6%,42%)] text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
        <Sparkles className="w-5 h-5" />
        Smart Assist
      </button>

      <div className="mb-8 p-3 bg-gray-800 rounded-lg flex items-center gap-3 border border-gray-700">
        <div className="w-10 h-10 bg-[hsl(335.1,77.6%,42%)] rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-[hsl(335.1,77.6%,42%)]" />
        </div>
        <div>
          <div className="text-xs text-gray-500">Company</div>
          <div className="text-sm font-semibold text-white">Sigma group</div>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors ${
                  activeItem === item.id
                    ? 'bg-[hsl(335.1,77.6%,42%)] text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (
let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {getPageNumbers().map((page, idx) => (
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === page
                ? 'bg-[hsl(335.1,77.6%,42%)] text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

const HRDashboard = ({ showFilterButton = true }) => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    experience: '',
    jobType: '',
    selectedSkills: [],
    status: 'all'
  });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [draggedJob, setDraggedJob] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Extract unique skills
  useEffect(() => {
    const skills = new Set();
    allJobs.forEach(job => {
      if (job.skillsRequired) {
        const jobSkills = Array.isArray(job.skillsRequired) 
          ? job.skillsRequired 
          : job.skillsRequired.split(',').map(s => s.trim());
        jobSkills.forEach(skill => skills.add(skill));
      }
    });
    setAvailableSkills(Array.from(skills).sort());
  }, [allJobs]);

  const fetchAllJobs = async () => {
    try {
      const response = await axios.get('/api/jobs', {
        params: { page: 1, pageSize: 10000 }
      });
      console.log('Fetched all jobs:', response.data);
      setAllJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching all jobs:', error);
    }
  };

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        pageSize: pageSize
      };

      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }

      // Only add status filter if not 'all'
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.experience) {
        params.experienceRequired = filters.experience;
      }
      if (filters.jobType) {
        params.jobPosition = filters.jobType;
      }
      if (filters.selectedSkills.length > 0) {
        params.skills = filters.selectedSkills.join(',');
      }

      console.log('Fetching jobs with params:', params);
      const response = await axios.get('/api/jobs', { params });
      console.log('Jobs response:', response.data);
      
      setJobs(response.data.jobs || []);
      setTotalJobs(response.data.total || 0);
      
      if ((response.data.jobs || []).length === 0 && currentPage === 1) {
        console.warn('No jobs returned from API');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setTotalJobs(0);
      showToast('Failed to fetch jobs', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearchTerm, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const resetFilters = () => {
    setFilters({ experience: '', jobType: '', selectedSkills: [], status: 'all' });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const toggleSkillFilter = (skill) => {
    setFilters(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skill)
        ? prev.selectedSkills.filter(s => s !== skill)
        : [...prev.selectedSkills, skill]
    }));
    setCurrentPage(1);
  };

  const handleAddJob = async (jobData) => {
    const jobToSave = {
      ...jobData,
      status: "active",
      order: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    try {
      await axios.post('/api/jobs', jobToSave);
      await fetchJobs();
      await fetchAllJobs();
      setShowAddModal(false);
      showToast("Job created successfully!", 'success');
    } catch (error) {
      console.error("Error saving job:", error);
      showToast("Failed to save job. Please try again.", 'error');
      throw error;
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (formData) => {
    try {
      await axios.patch(`/api/jobs/${editingJob.id}`, formData);
      await fetchJobs();
      await fetchAllJobs();
      setShowEditModal(false);
      setEditingJob(null);
      showToast("Job updated successfully!", 'success');
    } catch (error) {
      console.error("Error updating job:", error);
      showToast("Failed to update job. Please try again.", 'error');
      throw error;
    }
  };

  const handleArchiveJob = async (job) => {
    const newStatus = job.status === 'archived' ? 'active' : 'archived';
    const originalJobs = [...jobs];
    
    setJobs(prevJobs => 
      prevJobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j)
    );
    
    try {
      await axios.patch(`/api/jobs/${job.id}`, { status: newStatus });
      await fetchAllJobs();
      showToast(`Job ${newStatus === 'archived' ? 'archived' : 'unarchived'} successfully!`, 'success');
    } catch (error) {
      console.error("Error archiving job:", error);
      setJobs(originalJobs);
      showToast("Failed to archive job. Please try again.", 'error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    const originalJobs = [...jobs];
    
    setJobs(prevJobs => prevJobs.filter(j => j.id !== jobId));
    
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      await fetchAllJobs();
      showToast("Job deleted successfully!", 'success');
    } catch (error) {
      console.error("Error deleting job:", error);
      setJobs(originalJobs);
      showToast("Failed to delete job. Please try again.", 'error');
    }
  };

  const handleViewJob = (job) => {
    navigate(`/view-job/${job.id}`, { state: { job, role: 'recruiter' } });
  };

  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedJob(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetJob) => {
    e.preventDefault();
    if (!draggedJob || draggedJob.id === targetJob.id) return;

    const originalJobs = [...jobs];
    const newJobs = [...jobs];
    const draggedIndex = newJobs.findIndex(j => j.id === draggedJob.id);
    const targetIndex = newJobs.findIndex(j => j.id === targetJob.id);

    newJobs.splice(draggedIndex, 1);
    newJobs.splice(targetIndex, 0, draggedJob);

    const updatedJobs = newJobs.map((job, index) => ({
      ...job,
      order: index
    }));

    setJobs(updatedJobs);
    showToast("Reordering jobs...", 'info');

    try {
      await Promise.all(
        updatedJobs.map(job => 
          axios.patch(`/api/jobs/${job.id}`, { order: job.order })
        )
      );
      showToast("Jobs reordered successfully!", 'success');
    } catch (error) {
      console.error("Error updating job order:", error);
      setJobs(originalJobs);
      showToast("Failed to reorder jobs. Changes reverted.", 'error');
    }
  };

  const totalPages = Math.ceil(totalJobs / pageSize);
  const existingSlugs = allJobs.map(job => job.slug).filter(Boolean);

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="flex-1 overflow-auto bg-gray-950">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">Jobs Board</h2>
              <p className="text-gray-400 mt-1">
                {isLoading ? 'Loading...' : `${totalJobs} total jobs`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {showFilterButton && (
                <button
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="px-4 py-2 bg-[hsl(335.1,77.6%,42%)] hover:bg-[hsl(335.1,77.6%,42%)] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2 bg-[hsl(335.1,77.6%,42%)] hover:bg-[hsl(335.1,77.6%,42%)] text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                Add Job
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search jobs by title..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)] border border-gray-700"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, status: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Experience</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, experience: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
                  >
                    <option value="">All</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Experienced">Experienced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, jobType: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
                  >
                    <option value="">All</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              
              {availableSkills.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Filter by Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkillFilter(skill)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          filters.selectedSkills.includes(skill)
                            ? 'bg-[hsl(335.1,77.6%,42%)] text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
                <div className="text-sm text-gray-400">
                  Showing {jobs.length} of {totalJobs} jobs
                  {filters.selectedSkills.length > 0 && (
                    <span className="ml-2">
                      • Filtered by: {filters.selectedSkills.join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[hsl(335.1,77.6%,42%)] animate-spin" />
              <span className="ml-3 text-gray-400">Loading jobs...</span>
            </div>
          )}

          {!isLoading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onDelete={handleDeleteJob}
                    onViewJob={handleViewJob}
                    onEdit={handleEditJob}
                    onArchive={handleArchiveJob}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    isDragging={draggedJob?.id === job.id}
                  />
                ))}
              </div>
              
              {jobs.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
                  <p className="text-gray-400 mb-4">
                    {searchTerm || filters.status !== 'all' || filters.experience || filters.jobType || filters.selectedSkills.length > 0
                      ? "Try adjusting your search or filters to see more results."
                      : "Start by adding your first job posting."}
                  </p>
                  {(searchTerm || filters.status !== 'all' || filters.experience || filters.jobType || filters.selectedSkills.length > 0) && (
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 bg-[hsl(335.1,77.6%,42%)] hover:bg-[hsl(335.1,77.6%,42%)] text-white rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </div>
      </main>

      {showAddModal && (
        <AddJobModal
          onSave={handleAddJob}
          onCancel={() => setShowAddModal(false)}
          existingSlugs={existingSlugs}
        />
      )}

      {showEditModal && editingJob && (
        <EditJobModal
          job={editingJob}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false);
            setEditingJob(null);
          }}
          existingSlugs={existingSlugs}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default HRDashboard;