import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/Recruiter/Companies";
import CompanyCreate from "./components/Recruiter/CompanyCreate";
import CompanySetup from "./components/Recruiter/CompanySetup";
import CompanyVerificationStatus from "./components/Recruiter/CompanyVerificationStatus";
import AdminJobs from "./components/Recruiter/RecruiterJobs";
import PostJob from "./components/Recruiter/PostJob";
import Applicants from "./components/Recruiter/Applicants";
import EditJob from "./components/Recruiter/EditJob";
import ProtectedRoute from "./components/Recruiter/ProtectedRoute";

// Admin Panel Components
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  // For Recruiter
  {
    path: "/recruiter/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/recruiter/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/recruiter/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
  {
    path: "/recruiter/companies/:companyId/status",
    element: <ProtectedRoute><CompanyVerificationStatus /></ProtectedRoute>
  },
  {
    path: "/recruiter/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>
  },
  {
    path: "/recruiter/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/recruiter/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: "/recruiter/jobs/:id",
    element: <ProtectedRoute><EditJob /></ProtectedRoute>
  },
  // Admin Panel Routes
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
