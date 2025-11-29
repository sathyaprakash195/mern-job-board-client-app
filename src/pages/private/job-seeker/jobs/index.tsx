import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner";
import { JobCard } from "@/components/functional/job-card";
import { JobFilters } from "@/components/functional/job-filters";
import { apiRoutes } from "@/constants/api-routes";
import type { IJob } from "@/interfaces";
import PageTitle from "@/components/ui/page-title";

interface FilterState {
  keywords: string;
  location: string;
  jobType: string;
  minSalary: string;
  maxSalary: string;
  experienceLevel: string;
}

export const JobsListPage = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    keywords: "",
    location: "",
    jobType: "",
    minSalary: "",
    maxSalary: "",
    experienceLevel: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.openJobs);
      setJobs(response.data.jobs || []);
    } catch (error) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (filters.keywords) params.append("keywords", filters.keywords);
    if (filters.location) params.append("location", filters.location);
    if (filters.jobType) params.append("jobType", filters.jobType);
    if (filters.minSalary) params.append("minSalary", filters.minSalary);
    if (filters.maxSalary) params.append("maxSalary", filters.maxSalary);
    if (filters.experienceLevel)
      params.append("experienceLevel", filters.experienceLevel);

    return params.toString();
  };

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const queryString = buildQueryString();
      const url = queryString
        ? `${apiRoutes.openJobs}?${queryString}`
        : apiRoutes.openJobs;
      const response = await axios.get(url);
      setJobs(response.data.jobs || []);
    } catch (error) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    try {
      setLoading(true);
      setFilters({
        keywords: "",
        location: "",
        jobType: "",
        minSalary: "",
        maxSalary: "",
        experienceLevel: "",
      });
      const response = await axios.get(apiRoutes.openJobs);
      setJobs(response.data.jobs || []);
      toast.success("Filters cleared");
    } catch (error) {
      console.error("Error clearing filters:", error);
      toast.error("Failed to clear filters");
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/job-seeker/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col gap-5">
      <div>
        <PageTitle title="Browse Jobs" />
        <p className="text-gray-600">Find your next opportunity</p>
      </div>

      <JobFilters
        filters={filters}
        onFilterChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No jobs available at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} onClick={handleJobClick} />
          ))}
        </div>
      )}
    </div>
  );
};
