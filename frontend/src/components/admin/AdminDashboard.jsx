import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LogOut, Users, Briefcase, Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearAdmin } from "@/redux/adminAuthSlice";
import { toast } from "sonner";
import axios from "axios";
import AdminUserManagement from "./AdminUserManagement";
import AdminJobManagement from "./AdminJobManagement";
import AdminCompanyManagement from "./AdminCompanyManagement";
import AdminNotifications from "./AdminNotifications";

const ADMIN_API_END_POINT = `${import.meta.env.VITE_BACKEND_URL}/admin`;

const AdminDashboard = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.adminAuth);

  // Redirect if not admin
  React.useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await axios.get(`${ADMIN_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(clearAdmin());
        toast.success("Logged out successfully");
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <AdminNotifications />
            <span className="text-sm text-gray-600">
              Welcome, {admin?.name || "Admin"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={16} />
              User Management
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase size={16} />
              Job Management
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 size={16} />
              Company Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <AdminUserManagement />
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-4">
            <AdminJobManagement />
          </TabsContent>

          <TabsContent value="companies" className="space-y-4">
            <AdminCompanyManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
