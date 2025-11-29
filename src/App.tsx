import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/public/home";
import LoginPage from "./pages/public/login";
import RegisterPage from "./pages/public/register";

import { Toaster } from "react-hot-toast";
import RecruiterDashboardPage from "./pages/private/recruiter/dashboard";
import JobSeekerDashboardPage from "./pages/private/job-seeker/dashboard";
import { PublicLayout, PrivateLayout } from "./components/layouts";
import RecruiterJobsPage from "./pages/private/recruiter/jobs";
import AddJobPage from "./pages/private/recruiter/add-job";
import EditJobPage from "./pages/private/recruiter/edit-job";
import { JobsListPage } from "./pages/private/job-seeker/jobs";
import JobInfoPage from "./pages/private/job-seeker/job-info";
import JobseekerApplicationsPage from "./pages/private/job-seeker/applications";
import RecruiterApplicationsPage from "./pages/private/recruiter/applications";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Homepage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <RegisterPage />
              </PublicLayout>
            }
          />

          {/* Private Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <PrivateLayout>
                <RecruiterDashboardPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/job-seeker/dashboard"
            element={
              <PrivateLayout>
                <JobSeekerDashboardPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <PrivateLayout>
                <RecruiterJobsPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/recruiter/jobs/add"
            element={
              <PrivateLayout>
                <AddJobPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/recruiter/jobs/edit/:jobId"
            element={
              <PrivateLayout>
                <EditJobPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/recruiter/applications"
            element={
              <PrivateLayout>
                <RecruiterApplicationsPage />
              </PrivateLayout>
            }
          />

          <Route
            path="/job-seeker/jobs"
            element={
              <PrivateLayout>
                <JobsListPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/job-seeker/jobs/:jobId"
            element={
              <PrivateLayout>
                <JobInfoPage />
              </PrivateLayout>
            }
          />
          <Route
            path="/job-seeker/applications"
            element={
              <PrivateLayout>
                <JobseekerApplicationsPage />
              </PrivateLayout>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
