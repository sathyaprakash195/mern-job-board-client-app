import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import JobForm from "@/components/functional/job-form";
import { apiRoutes } from "@/constants/api-routes";
import type { IJob } from "@/interfaces";
import { Spinner } from "@/components/ui/spinner";

function EditJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<IJob | null>(null);

  useEffect(() => {
    if (!jobId) {
      toast.error("Job ID is missing");
      setLoading(false);
      return;
    }

    fetchJobData();
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiRoutes.getJobById}/${jobId}`);
      setJobData(response.data.job || response.data);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to fetch job details";
      toast.error(errorMessage);
      setJobData(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Unable to load job data</p>
      </div>
    );
  }

  return (
    <div>
      <JobForm formType="edit" initialData={jobData} />
    </div>
  );
}

export default EditJobPage;