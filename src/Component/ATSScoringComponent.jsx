import { useState } from "react";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const ATSScoringComponent = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jobDescription.trim()) {
      setError("Please upload a resume and enter a job description");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("jobDescription", jobDescription);
      const response = await axios.post(`${backendURL}/ats/score`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process your request");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        ATS Resume Scoring
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste the job description here..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Calculate ATS Score"}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>
        )}
      </form>

      {result && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Overall Score
              </h3>
              <p
                className={`text-3xl font-bold ${getScoreColor(
                  result.overallScore
                )}`}
              >
                {result.overallScore.toFixed(1)}%
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Keyword Match
              </h3>
              <p
                className={`text-3xl font-bold ${getScoreColor(
                  result.keywordMatchScore
                )}`}
              >
                {result.keywordMatchScore.toFixed(1)}%
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Text Similarity
              </h3>
              <p
                className={`text-3xl font-bold ${getScoreColor(
                  result.textSimilarityScore
                )}`}
              >
                {result.textSimilarityScore.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Matched Keywords ({result.matchedKeywords.length} of{" "}
              {result.totalKeywordsInJobDescription})
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              Note: Scores above 80% are considered strong matches, 50-80%
              moderate, and below 50% may need improvement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScoringComponent;
