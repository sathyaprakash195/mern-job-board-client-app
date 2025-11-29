import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import PageTitle from "@/components/ui/page-title";
import DashboardFilters from "@/components/functional/dashboard-filters";
import DashboardData from "@/components/functional/dashboard-data";
import { Spinner } from "@/components/ui/spinner";
import { apiRoutes } from "@/constants/api-routes";

interface DashboardResponse {
  totalApplications: number;
  pendingApplications: number;
  shortlistedApplications: number;
  rejectedApplications: number;
}

function JobSeekerDashboardPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState<DashboardResponse>({
    totalApplications: 0,
    pendingApplications: 0,
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

      const response = await axios.get<DashboardResponse>(
        apiRoutes.jobseekerDashboard,
        { params }
      );

      setStats({
        totalApplications: response.data.totalApplications || 0,
        pendingApplications: response.data.pendingApplications || 0,
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

  if (loading && !stats.totalApplications) {
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
          Overview of your job applications
        </p>
      </div>

      <DashboardFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onFilter={handleFilter}
        onClear={handleClear}
      />

      <DashboardData stats={stats} loading={loading} />
    </div>
  );
}

export default JobSeekerDashboardPage;
