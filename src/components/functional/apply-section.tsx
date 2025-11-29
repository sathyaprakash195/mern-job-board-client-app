import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { apiRoutes } from "@/constants/api-routes";
import { uploadResumeAndGetUrl } from "@/helpers/supabase-helpers";

interface ApplySectionProps {
  jobId: string;
  recruiterId: string;
}

export const ApplySection = ({ jobId, recruiterId }: ApplySectionProps) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!coverLetter.trim()) {
      toast.error("Please enter a cover letter");
      return;
    }

    if (!resumeFile) {
      toast.error("Please select a resume file");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Upload resume to Supabase and get URL
      const resumeUrl = await uploadResumeAndGetUrl(resumeFile);

      // Step 2: Construct the payload for the backend
      const payload = {
        jobId: jobId,
        recruiter: recruiterId,
        coverLetter,
        resume: resumeUrl,
        status: "applied",
      };

      // Step 3: Send application to backend
      const response = await axios.post(apiRoutes.applyJob, payload);

      // Step 4: Show success message
      toast.success("Application submitted successfully!");

      // Step 5: Reset form
      setCoverLetter("");
      setResumeFile(null);

      // Step 6: Navigate to applications page
      setTimeout(() => {
        navigate("/job-seeker/applications");
      }, 500);
    } catch (error) {
      console.error("Error submitting application:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to submit application");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 h-fit sticky top-4 bg-white">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Apply Now</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cover Letter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Cover Letter
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Enter your cover letter"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={6}
          />
        </div>

        {/* Resume File */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Select Resume File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="cursor-pointer block">
              {resumeFile ? (
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {resumeFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    Select File
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF only</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
};
