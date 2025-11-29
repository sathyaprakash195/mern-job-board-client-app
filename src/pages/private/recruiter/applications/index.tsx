import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import PageTitle from "@/components/ui/page-title";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRoutes } from "@/constants/api-routes";
import type { IApplication } from "@/interfaces";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Download } from "lucide-react";
import { applicationStatuses } from "@/constants";

function RecruiterApplicationsPage() {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string>("");
  const [statusChangeLoading, setStatusChangeLoading] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<{ [key: string]: string }>({});

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.recruiterApplications);
      setApplications(response.data.applications);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to fetch applications";
      toast.error(errorMessage);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("MMM D, YYYY h:mm A");
  };

  const handleViewResume = (resumeUrl: string) => {
    window.open(resumeUrl, "_blank");
  };

  const handleViewCoverLetter = (coverLetter: string) => {
    setSelectedCoverLetter(coverLetter);
    setCoverLetterDialogOpen(true);
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      setStatusUpdating((prev) => ({ ...prev, [applicationId]: newStatus }));
      
      // Call API to update status
      await axios.put(`${apiRoutes.updateApplicationStatus}/${applicationId}`, {
        status: newStatus,
      });

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      toast.success("Application status updated successfully");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to update application status";
      toast.error(errorMessage);
    } finally {
      setStatusUpdating((prev) => {
        const newState = { ...prev };
        delete newState[applicationId];
        return newState;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const columns = ["Applicant", "Job Title", "Company", "Applied On", "Status", "Actions"];

  return (
    <div className="space-y-4">
      <PageTitle title="Applications" />

      {/* Table */}
      <Table>
        <TableHeader className="bg-gray-200">
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="font-bold text-primary">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                No applications received yet
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => {
              const job = typeof application.job === 'string' ? null : application.job;
              const applicant = typeof application.applicant === 'string' ? null : application.applicant;
              const isUpdating = statusUpdating[application._id];
              
              return (
                <TableRow key={application._id}>
                  <TableCell className="font-medium">{applicant?.name || 'N/A'}</TableCell>
                  <TableCell>{job?.title || 'N/A'}</TableCell>
                  <TableCell>{job?.company || 'N/A'}</TableCell>
                  <TableCell>{formatDate(application.createdAt)}</TableCell>
                  <TableCell>
                    <Select
                      value={isUpdating || application.status}
                      onValueChange={(value) => handleStatusChange(application._id, value)}
                      disabled={!!isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {applicationStatuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewResume(application.resume)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors text-blue-600"
                        title="View resume"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleViewCoverLetter(application.coverLetter || "")}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="View cover letter"
                        disabled={!application.coverLetter}
                      >
                        <FileText size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {/* Cover Letter Dialog */}
      <Dialog open={coverLetterDialogOpen} onOpenChange={setCoverLetterDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Cover Letter</DialogTitle>
            <DialogDescription>
              Cover letter submitted by the applicant
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
            {selectedCoverLetter || "No cover letter provided"}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RecruiterApplicationsPage;
