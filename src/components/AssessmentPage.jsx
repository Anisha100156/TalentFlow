import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const AssessmentPage = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const job = location.state?.job;
  const passedAssessment = location.state?.assessment;
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    // If assessment was passed from the previous page, use it
    if (passedAssessment) {
      setAssessment(passedAssessment);
      setLoading(false);
      return;
    }
    
    // Otherwise fetch from the API
    const fetchAssessment = async () => {
      try {
        const response = await axios.get(`/api/assessments/${jobId}`);
        // The API returns an object with assessment property, not the assessment directly
        setAssessment(response.data.assessment);
      } catch (err) {
        setError("Assessment not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [jobId, passedAssessment]);

  const handleResponseChange = (sectionIndex, questionIndex, value) => {
    setResponses(prev => ({
      ...prev,
      [`${sectionIndex}-${questionIndex}`]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate required questions
    let hasUnansweredRequired = false;
    assessment.sections.forEach((section, sectionIdx) => {
      section.questions.forEach((q, qIdx) => {
        if (q.required && !responses[`${sectionIdx}-${qIdx}`]) {
          hasUnansweredRequired = true;
        }
      });
    });
    
    if (hasUnansweredRequired) {
      alert("Please answer all required questions.");
      return;
    }
    
    try {
      await axios.post(`/api/assessments/${jobId}/submit`, { responses });
      alert("Assessment submitted successfully!");
      // Redirect to job view after submission
      window.location.href = `/view-job/${jobId}`;
    } catch (err) {
      alert("Failed to submit assessment.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading assessment...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!assessment) return <div className="p-8 text-center">No assessment found for this job.</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-rose-500">Assessment for {job?.title || `Job #${jobId}`}</h2>
      
      <div className="mb-6 p-4 bg-rose-50 rounded-lg">
        <h3 className="text-xl font-semibold text-rose-500">{assessment.title}</h3>
        {assessment.description && (
          <p className="text-gray-700 mt-2">{assessment.description}</p>
        )}
      </div>

      {assessment.sections && assessment.sections.length > 0 ? (
        <div className="space-y-8">
          {assessment.sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="border-b pb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{section.title}</h3>
              {section.questions && section.questions.length > 0 ? (
                <div className="space-y-6">
                  {section.questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 bg-gray-50 rounded-lg">
                      <label className="font-medium block mb-2">
                        {qIdx + 1}. {q.text} {q.required && <span className="text-red-500">*</span>}
                      </label>

                      {/* Render field by type */}
                      {q.type === "short-text" && (
                        <input 
                          className="border p-2 w-full rounded" 
                          onChange={(e) => handleResponseChange(sectionIdx, qIdx, e.target.value)}
                        />
                      )}
                      {q.type === "long-text" && (
                        <textarea 
                          className="border p-2 w-full rounded" 
                          rows="4"
                          onChange={(e) => handleResponseChange(sectionIdx, qIdx, e.target.value)}
                        ></textarea>
                      )}
                      {q.type === "single-choice" && (
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} className="flex items-center">
                              <input 
                                type="radio" 
                                name={`section-${sectionIdx}-question-${qIdx}`} 
                                className="mr-2"
                                onChange={(e) => handleResponseChange(sectionIdx, qIdx, opt)}
                              /> 
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                      {q.type === "multi-choice" && (
                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => (
                            <label key={optIdx} className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                onChange={(e) => {
                                  const currentResponses = responses[`${sectionIdx}-${qIdx}`] || [];
                                  if (e.target.checked) {
                                    handleResponseChange(sectionIdx, qIdx, [...currentResponses, opt]);
                                  } else {
                                    handleResponseChange(sectionIdx, qIdx, currentResponses.filter(o => o !== opt));
                                  }
                                }}
                              /> 
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                      {q.type === "numeric-range" && (
                        <input 
                          type="number" 
                          min={q.min} 
                          max={q.max}
                          className="border p-2 rounded w-full" 
                          onChange={(e) => handleResponseChange(sectionIdx, qIdx, parseInt(e.target.value))}
                        />
                      )}
                      {q.type === "file-upload" && (
                        <input 
                          type="file" 
                          className="border p-2 rounded w-full" 
                          onChange={(e) => handleResponseChange(sectionIdx, qIdx, e.target.files[0])}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No questions in this section.</div>
              )}
            </div>
          ))}
          
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-500 transition"
          >
            Submit Assessment
          </button>
        </div>
      ) : (
        <div>No sections found in this assessment.</div>
      )}
    </div>
  );
};

export default AssessmentPage;