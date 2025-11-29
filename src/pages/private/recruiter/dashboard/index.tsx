import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import PageTitle from "@/components/ui/page-title";
import RecruiterDashboardFilters from "@/components/functional/recruiter-dashboard-filters";
import RecruiterDashboardData from "@/components/functional/recruiter-dashboard-data";
import { Spinner } from "@/components/ui/spinner";
import { apiRoutes } from "@/constants/api-routes";

interface RecruiterDashboardResponse {
  totalJobsPosted: number;
  applicationsReceived: number;
  shortlistedApplications: number;
  rejectedApplications: number;
}

function RecruiterDashboardPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState<RecruiterDashboardResponse>({
    totalJobsPosted: 0,
    applicationsReceived: 0,
    shortlistedApplications: 0,
    rejectedApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      
      if (start) {
        params.startDate = start;
      }
      if (end) {
        params.endDate = end;
      }

      const response = await axios.get<RecruiterDashboardResponse>(
        apiRoutes.recruiterDashboard,
        { params }
      );

      setStats({
        totalJobsPosted: response.data.totalJobsPosted || 0,
        applicationsReceived: response.data.applicationsReceived || 0,
        shortlistedApplications: response.data.shortlistedApplications || 0,
        rejectedApplications: response.data.rejectedApplications || 0,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to fetch dashboard data";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      toast.error("Start date must be before end date");
      return;
    }

    fetchDashboardData(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    fetchDashboardData();
  };

  if (loading && !stats.totalJobsPosted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <PageTitle title="Dashboard" />
        <p className="text-gray-600 text-sm mt-2">
          Overview of your job postings and applications
        </p>
      </div>

      <RecruiterDashboardFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <RecruiterDashboardData stats={stats} loading={loading} />
    </div>
  );
}

export default RecruiterDashboardPage;
