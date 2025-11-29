import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRoutes } from "@/constants/api-routes";
import { Eye, Edit2, Trash2 } from "lucide-react";
import type { IJob } from "@/interfaces";
import { Spinner } from "@/components/ui/spinner";

function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiRoutes.getRecruiterJobs);
      setJobs(response.data.jobs);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to fetch jobs";
      toast.error(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      await axios.delete(`${apiRoutes.deleteJob}/${jobToDelete}`);
      toast.success("Job deleted successfully");
      setJobs(jobs.filter((job) => job._id !== jobToDelete));
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to delete job";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (jobId: string) => {
    navigate(`/recruiter/jobs/edit/${jobId}`);
  };

  const handleView = (jobId: string) => {
    navigate(`/recruiter/jobs/${jobId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  const columns = ["Job Title", "Location", "Type", "Posted On", "Status", "Actions"];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Jobs</h2>
        <Button onClick={() => navigate("/recruiter/jobs/add")}>
          + Post New Job
        </Button>
      </div>

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
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                No jobs posted yet
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.locations}</TableCell>
                <TableCell>{job.jobType}</TableCell>
                <TableCell>{formatDate(job.createdAt)}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {job.status?.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(job._id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="View job"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(job._id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Edit job"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteDialog(job._id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors text-red-600"
                      title="Delete job"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default JobsPage;
