import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { MapPin, DollarSign, Calendar, Briefcase } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ApplySection } from "@/components/functional/apply-section";
import { apiRoutes } from "@/constants/api-routes";
import type { IJob } from "@/interfaces";

export const JobInfoPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<IJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiRoutes.getJobById}/${jobId}`);
      setJob(response.data.job || response.data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-gray-600">Job not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">
                {job.title}
              </h1>
              <p className="text-sm text-gray-600">From : {job.company}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize">
              {job.jobType.replaceAll("_", " ")}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Key Details Row */}
          <div className="flex justify-between gap-8 py-4 border-t border-b border-gray-200">
            {/* Location */}
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">{job.locations}</span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">
                ${job.minSalary.toLocaleString()} - $
                {job.maxSalary.toLocaleString()}
              </span>
            </div>

            {/* Last Date to Apply */}
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">
                Last date to apply - {dayjs(job.lastDateToApply).format("MMM DD YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Description - 2 columns */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                About the Role
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 mb-6"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />

              {/* Experience Required */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase size={18} className="text-gray-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Min Experience
                  </h3>
                </div>
                <p className="text-sm text-gray-700">
                  {job.experienceRequired} years of experience
                </p>
              </div>
            </div>
          </div>

          {/* Apply Section - 1 column */}
          <div>
            <ApplySection jobId={job._id} recruiterId={job.recruiter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobInfoPage;