import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const questionTypes = [
  "single-choice",
  "multi-choice",
  "short-text",
  "long-text",
  "numeric-range",
  "file-upload",
];

const AssessmentBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;
  
  const [sections, setSections] = useState([]);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingAssessments, setExistingAssessments] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load existing assessments
  useEffect(() => {
    const loadExistingAssessments = async () => {
      if (job) {
        try {
          const response = await axios.get(`/api/assessments/${job.id}`);
          console.log("API Response:", response.data);
          // The API returns a single assessment object, not an array
          if (response.data.assessment) {
            setExistingAssessments([response.data.assessment]);
          } else {
            setExistingAssessments([]);
          }
        } catch (error) {
          console.error("Error loading existing assessments:", error);
          setExistingAssessments([]);
        }
      }
    };
    
    loadExistingAssessments();
  }, [job]);

  // Add new section
  const addSection = () => {
    setSections([...sections, { title: "New Section", questions: [] }]);
  };

  // Remove section
  const removeSection = (sectionIdx) => {
    const updated = sections.filter((_, idx) => idx !== sectionIdx);
    setSections(updated);
  };

  // Add question
  const addQuestion = (sectionIdx, type) => {
    const updated = [...sections];
    updated[sectionIdx].questions.push({
      text: "New Question",
      type,
      required: false,
      options: type.includes("choice") ? ["Option 1", "Option 2"] : [],
      min: 0,
      max: 100,
    });
    setSections(updated);
  };

  // Remove question
  const removeQuestion = (sectionIdx, qIdx) => {
    const updated = [...sections];
    updated[sectionIdx].questions = updated[sectionIdx].questions.filter((_, idx) => idx !== qIdx);
    setSections(updated);
  };

  // Update question
  const updateQuestion = (sectionIdx, qIdx, field, value) => {
    const updated = [...sections];
    updated[sectionIdx].questions[qIdx][field] = value;
    setSections(updated);
  };

  // Update section title
  const updateSectionTitle = (sectionIdx, value) => {
    const updated = [...sections];
    updated[sectionIdx].title = value;
    setSections(updated);
  };

  // Add option to question
  const addOption = (sectionIdx, qIdx) => {
    const updated = [...sections];
    updated[sectionIdx].questions[qIdx].options.push("New Option");
    setSections(updated);
  };

  // Remove option from question
  const removeOption = (sectionIdx, qIdx, optIdx) => {
    const updated = [...sections];
    updated[sectionIdx].questions[qIdx].options = updated[sectionIdx].questions[qIdx].options.filter((_, idx) => idx !== optIdx);
    setSections(updated);
  };

  // Update option
  const updateOption = (sectionIdx, qIdx, optIdx, value) => {
    const updated = [...sections];
    updated[sectionIdx].questions[qIdx].options[optIdx] = value;
    setSections(updated);
  };

  // Save assessment to database
  const saveAssessment = async () => {
    if (!job) {
      alert("No job selected");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a title for the assessment");
      return;
    }

    if (sections.length === 0 || sections.every(section => !section.questions || section.questions.length === 0)) {
      alert("Please add at least one section with questions");
      return;
    }

    // Generate a unique ID for new assessments
    const assessmentId = editingId || `assessment-${job.id}`;

    const assessmentData = {
      id: assessmentId,
      jobId: job.id,
      title,
      description,
      sections,
      createdAt: new Date().toISOString(),
      totalQuestions: sections.reduce((total, section) => total + (section.questions?.length || 0), 0)
    };

    console.log("Saving assessment:", assessmentData);

    try {
      const response = await axios.put(`/api/assessments/${job.id}`, assessmentData);
      console.log("Assessment saved successfully:", response.data);
      alert("Assessment saved successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setSections([]);
      setEditingId(null);
      
      // Refresh the list of assessments
      const updatedResponse = await axios.get(`/api/assessments/${job.id}`);
      console.log("Updated response:", updatedResponse.data);
      // The API returns a single assessment object, not an array
      if (updatedResponse.data.assessment) {
        setExistingAssessments([updatedResponse.data.assessment]);
      } else {
        setExistingAssessments([]);
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("Failed to save assessment: " + (error.response?.data?.error || error.message));
    }
  };

  // Load assessment for editing
  const loadAssessment = (assessment) => {
    setTitle(assessment.title);
    setDescription(assessment.description || "");
    setSections(assessment.sections || []);
    setEditingId(assessment.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSections([]);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Assessment Builder</h1>
        <p className="text-[hsl(335.1,77.6%,42%)]">Create and manage assessments for {job?.title || "this job"}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder Section */}
        <div className="bg-gray-900 p-6 shadow-lg rounded-lg border border-[hsl(335.1,77.6%,42%)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {editingId ? "Edit Assessment" : "Create New Assessment"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="px-3 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded hover:bg-[hsl(335.1,77.6%,42%)] transition text-sm"
              >
                Cancel Edit
              </button>
            )}
          </div>
          
          {/* Assessment Metadata */}
          <div className="mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assessment Title"
              className="font-semibold text-lg border border-[hsl(335.1,77.6%,42%)] p-3 w-full mb-3 rounded bg-gray-800 text-white focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)] focus:border-transparent"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Assessment Description (optional)"
              className="border border-[hsl(335.1,77.6%,42%)] p-3 w-full rounded bg-gray-800 text-white focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)] focus:border-transparent"
              rows="2"
            />
          </div>
          
          {/* Sections */}
          <div className="space-y-4 mb-4">
            {sections.map((sec, secIdx) => (
              <div key={secIdx} className="border border-[hsl(335.1,77.6%,42%)] p-4 rounded-lg bg-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => updateSectionTitle(secIdx, e.target.value)}
                    className="font-semibold text-lg border-b border-[hsl(335.1,77.6%,42%)] flex-1 bg-transparent text-white focus:border-[hsl(335.1,77.6%,42%)] outline-none"
                  />
                  <button
                    onClick={() => removeSection(secIdx)}
                    className="ml-2 px-2 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded text-sm hover:bg-[hsl(335.1,77.6%,42%)]"
                  >
                    Remove Section
                  </button>
                </div>
                
                {/* Questions */}
                <div className="space-y-3 mb-3">
                  {sec.questions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-gray-800 p-3 rounded border border-[hsl(335.1,77.6%,42%)]">
                      <div className="flex justify-between items-start mb-2">
                        <input
                          type="text"
                          value={q.text}
                          onChange={(e) => updateQuestion(secIdx, qIdx, "text", e.target.value)}
                          className="border border-[hsl(335.1,77.6%,42%)] p-2 w-full rounded bg-gray-700 text-white focus:ring-2 focus:ring-[hsl(335.1,77.6%,42%)]"
                          placeholder="Question text"
                        />
                        <button
                          onClick={() => removeQuestion(secIdx, qIdx)}
                          className="ml-2 px-2 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded text-xs hover:bg-[hsl(335.1,77.6%,42%)]"
                        >
                          ✕
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-white bg-[hsl(335.1,77.6%,42%)] px-2 py-1 rounded">
                          {q.type}
                        </span>
                        <label className="flex items-center gap-1 text-sm text-white">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) => updateQuestion(secIdx, qIdx, "required", e.target.checked)}
                          />
                          Required
                        </label>
                      </div>

                      {/* Options for choice questions */}
                      {(q.type === "single-choice" || q.type === "multi-choice") && (
                        <div className="ml-4 mt-2 space-y-1">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex gap-2">
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(secIdx, qIdx, optIdx, e.target.value)}
                                className="border border-[hsl(335.1,77.6%,42%)] p-1 rounded flex-1 text-sm bg-gray-700 text-white"
                                placeholder={`Option ${optIdx + 1}`}
                              />
                              <button
                                onClick={() => removeOption(secIdx, qIdx, optIdx)}
                                className="px-2 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded text-xs hover:bg-[hsl(335.1,77.6%,42%)]"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addOption(secIdx, qIdx)}
                            className="mt-1 px-2 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded text-xs hover:bg-[hsl(335.1,77.6%,42%)]"
                          >
                            + Add Option
                          </button>
                        </div>
                      )}
                      
                      {/* Numeric range inputs */}
                      {q.type === "numeric-range" && (
                        <div className="ml-4 mt-2 flex gap-2">
                          <input
                            type="number"
                            value={q.min}
                            onChange={(e) => updateQuestion(secIdx, qIdx, "min", parseInt(e.target.value) || 0)}
                            className="border border-[hsl(335.1,77.6%,42%)] p-1 rounded w-full text-sm bg-gray-700 text-white"
                            placeholder="Min value"
                          />
                          <input
                            type="number"
                            value={q.max}
                            onChange={(e) => updateQuestion(secIdx, qIdx, "max", parseInt(e.target.value) || 100)}
                            className="border border-[hsl(335.1,77.6%,42%)] p-1 rounded w-full text-sm bg-gray-700 text-white"
                            placeholder="Max value"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add question buttons */}
                <div className="flex flex-wrap gap-2">
                  {questionTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => addQuestion(secIdx, type)}
                      className="px-3 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded text-xs hover:bg-[hsl(335.1,77.6%,42%)]"
                    >
                      + {type}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={addSection}
            className="w-full px-4 py-2 bg-[hsl(335.1,77.6%,42%)] text-white rounded hover:bg-[hsl(335.1,77.6%,42%)] mb-4 transition"
          >
            + Add Section
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setPreview(sections)}
              className="flex-1 px-4 py-2 bg-[hsl(335.1,77.6%,42%)] text-white rounded hover:bg-[hsl(335.1,77.6%,42%)] transition"
            >
              Preview
            </button>
            <button
              onClick={saveAssessment}
              className="flex-1 px-4 py-2 bg-[hsl(335.1,77.6%,42%)] text-white rounded hover:bg-[hsl(335.1,77.6%,42%)] transition"
            >
              {editingId ? "Update Assessment" : "Save Assessment"}
            </button>
          </div>
        </div>

        {/* Preview/Existing Assessments Section */}
        <div className="bg-gray-900 p-6 shadow-lg rounded-lg border border-[hsl(335.1,77.6%,42%)]">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-white">Existing Assessments</h2>
            {existingAssessments.length > 0 ? (
              <div className="space-y-3">
                {existingAssessments.map((assessment, idx) => (
                  <div key={assessment.id} className="border border-[hsl(335.1,77.6%,42%)] rounded-lg p-4 hover:border-[hsl(335.1,77.6%,42%)] transition">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-white">{assessment.title}</h3>
                        {assessment.description && (
                          <p className="text-sm text-[hsl(335.1,77.6%,42%)] mt-1">{assessment.description}</p>
                        )}
                        <div className="flex gap-3 mt-2 text-xs text-[hsl(335.1,77.6%,42%)]">
                          <span>{assessment.sections?.length || 0} sections</span>
                          <span>•</span>
                          <span>{assessment.totalQuestions || 0} questions</span>
                        </div>
                      </div>
                      <button
                        onClick={() => loadAssessment(assessment)}
                        className="px-3 py-1 bg-[hsl(335.1,77.6%,42%)] text-white rounded text-sm hover:bg-[hsl(335.1,77.6%,42%)]"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[hsl(335.1,77.6%,42%)] text-center py-4">No assessments created yet</p>
            )}
          </div>

          {preview && (
            <div>
              <h2 className="text-xl font-bold mb-4 mt-8 border-t border-[hsl(335.1,77.6%,42%)] pt-6 text-white">Live Preview</h2>
              <div className="space-y-6">
                {preview.map((sec, i) => (
                  <div key={i} className="border border-[hsl(335.1,77.6%,42%)] rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 text-white">{sec.title}</h3>
                    <div className="space-y-4">
                      {sec.questions.map((q, j) => (
                        <div key={j} className="bg-gray-800 p-3 rounded">
                          <label className="font-medium block mb-2 text-white">
                            {j + 1}. {q.text} {q.required && <span className="text-[hsl(335.1,77.6%,42%)]">*</span>}
                          </label>

                          {q.type === "short-text" && (
                            <input className="border border-[hsl(335.1,77.6%,42%)] p-2 w-full rounded bg-gray-700 text-white" placeholder="Short answer" />
                          )}
                          {q.type === "long-text" && (
                            <textarea className="border border-[hsl(335.1,77.6%,42%)] p-2 w-full rounded bg-gray-700 text-white" rows="3" placeholder="Long answer"></textarea>
                          )}
                          {q.type === "single-choice" &&
                            q.options.map((opt, idx) => (
                              <label key={idx} className="block mb-1 text-white">
                                <input type="radio" name={`q-${i}-${j}`} className="mr-2" /> {opt}
                              </label>
                            ))}
                          {q.type === "multi-choice" &&
                            q.options.map((opt, idx) => (
                              <label key={idx} className="block mb-1 text-white">
                                <input type="checkbox" className="mr-2" /> {opt}
                              </label>
                            ))}
                          {q.type === "numeric-range" && (
                            <input type="number" min={q.min} max={q.max} className="border border-[hsl(335.1,77.6%,42%)] p-2 rounded w-full bg-gray-700 text-white" placeholder={`Enter number between ${q.min} and ${q.max}`} />
                          )}
                          {q.type === "file-upload" && (
                            <input type="file" className="border border-[hsl(335.1,77.6%,42%)] p-2 rounded w-full bg-gray-700 text-white" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/view-job/${job?.id}`, { state: { job, role: 'recruiter' } })}
          className="px-6 py-2 bg-[hsl(335.1,77.6%,42%)] text-white rounded hover:bg-[hsl(335.1,77.6%,42%)] transition"
        >
          Back to Job View
        </button>
      </div>
    </div>
  );
};

export default AssessmentBuilder;