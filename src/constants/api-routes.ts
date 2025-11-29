const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export const apiRoutes = {
  registerUrl: backendUrl + "/users/register",
  loginUrl: backendUrl + "/users/login",
  profile: backendUrl + "/users/profile",

  createJob: backendUrl + "/jobs/create",
  editJob: backendUrl + "/jobs",
  getRecruiterJobs: backendUrl + "/jobs/recruiter/jobs",
  getJobById: backendUrl + "/jobs",
  deleteJob: backendUrl + "/jobs",

  openJobs: backendUrl + "/jobs/job-seeker/open",

  applyJob: backendUrl + "/applications/apply",
  jobseekerApplications: backendUrl + "/applications/job-seeker/applications",
  recruiterApplications: backendUrl + "/applications/recruiter/applications",
  updateApplicationStatus: backendUrl + "/applications",

  jobseekerDashboard : backendUrl + "/dashboard/job-seeker",
  recruiterDashboard : backendUrl + "/dashboard/recruiter",
};
