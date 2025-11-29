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
import { apiRoutes } from "@/constants/api-routes";
import type { IApplication } from "@/interfaces";
import { Spinner } from "@/components/ui/spinner";
import { FileText, Download } from "lucide-react";

function JobseekerApplicationsPage() {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverLetterDialogOpen, setCoverLetterDialogOpen] = useState(false);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<string>("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.jobseekerApplications);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const columns = ["Job Title", "Company", "Recruiter" , "Applied On", "Status", "Actions"];

  return (
    <div className="space-y-4">
      <PageTitle title="My Applications" />

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
                No applications submitted yet
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => {
              const job = typeof application.job === 'string' ? null : application.job;
              const recruiter = typeof application.recruiter === 'string' ? null : application.recruiter;
              
              return (
                <TableRow key={application._id}>
                  <TableCell className="font-medium">{job?.title || 'N/A'}</TableCell>
                  <TableCell>{job?.company || 'N/A'}</TableCell>
                    <TableCell>{recruiter?.name || 'N/A'}</TableCell>
                  <TableCell>{formatDate(application.createdAt)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : application.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {application.status?.toUpperCase()}
                    </span>
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
              Your submitted cover letter for this application
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

export default JobseekerApplicationsPage;
