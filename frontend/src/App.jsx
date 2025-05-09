import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/recruiter/Companies";
import CompanyCreate from "./components/recruiter/CompanyCreate";
import CompanySetup from "./components/recruiter/CompanySetup";
import CompanyVerificationStatus from "./components/recruiter/CompanyVerificationStatus";
import AdminJobs from "./components/recruiter/RecruiterJobs";
import PostJob from "./components/recruiter/PostJob";
import Applicants from "./components/recruiter/Applicants";
import ProtectedRoute from "./components/recruiter/ProtectedRoute";

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
