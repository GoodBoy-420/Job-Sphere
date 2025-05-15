import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Loader2, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "../ui/dialog";

const ADMIN_API_END_POINT = `${import.meta.env.VITE_BACKEND_URL}/admin`;
const COMPANY_API_END_POINT = `${import.meta.env.VITE_BACKEND_URL}/company`;

const AdminCompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState({});
  const [isDeleting, setIsDeleting] = useState({});
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all"); // "all" or "pending"
  const navigate = useNavigate();

  // Fetch all companies
  const fetchCompanies = async (tab = activeTab) => {
    try {
      setIsLoading(true);
      const endpoint = tab === "pending" 
        ? `${COMPANY_API_END_POINT}/admin/pending` 
        : `${COMPANY_API_END_POINT}/admin/all`;
      
      const response = await axios.get(endpoint, {
        withCredentials: true
      });

      if (response.data.success) {
        setCompanies(response.data.companies || []);
        
        // Count pending companies if viewing all companies
        if (tab === "all") {
          const pendingCompanies = response.data.companies.filter(
            company => company.verificationStatus === "pending"
          );
          setPendingCount(pendingCompanies.length);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch companies");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching companies");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchCompanies(tab);
  };

  // Verify or reject company
  const handleVerifyCompany = async (companyId, status) => {
    try {
      setIsProcessing(prev => ({ ...prev, [companyId]: true }));

      const response = await axios.post(
        `${COMPANY_API_END_POINT}/admin/verify/${companyId}`,
        { verificationStatus: status },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update company in the list
        setCompanies(companies.map(company => 
          company._id === companyId
            ? { ...company, verificationStatus: status, isVerified: status === "approved" }
            : company
        ));
        
        toast.success(`Company ${status === "approved" ? "approved" : "rejected"} successfully`);
        
        // Close dialog if open
        if (isDetailsDialogOpen && selectedCompany?._id === companyId) {
          setIsDetailsDialogOpen(false);
        }
      } else {
        toast.error(response.data.message || `Failed to ${status} company`);
      }
    } catch (error) {
      console.error(`Error ${status} company:`, error);
      toast.error(error.response?.data?.message || `An error occurred while ${status} company`);
    } finally {
      setIsProcessing(prev => ({ ...prev, [companyId]: false }));
    }
  };
  
  // Delete company
  const handleDeleteCompany = async (companyId) => {
    if (!confirm("Are you sure you want to delete this company? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsDeleting(prev => ({ ...prev, [companyId]: true }));

      const response = await axios.delete(
        `${COMPANY_API_END_POINT}/admin/delete/${companyId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Remove company from the list
        setCompanies(companies.filter(company => company._id !== companyId));
        toast.success("Company deleted successfully");
        
        // Close dialog if open
        if (isDetailsDialogOpen && selectedCompany?._id === companyId) {
          setIsDetailsDialogOpen(false);
        }
      } else {
        toast.error(response.data.message || "Failed to delete company");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(error.response?.data?.message || "An error occurred while deleting company");
    } finally {
      setIsDeleting(prev => ({ ...prev, [companyId]: false }));
    }
  };

  // View company details
  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setIsDetailsDialogOpen(true);
  };

  // Get badge color based on verification status
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Company Management</h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => handleTabChange("all")}
            className="flex items-center gap-1"
          >
            All Companies
          </Button>
          <Button
            variant={activeTab === "pending" ? "default" : "outline"}
            onClick={() => handleTabChange("pending")}
            className="flex items-center gap-1"
          >
            Pending 
            {pendingCount > 0 && activeTab === "all" && (
              <Badge className="ml-1 bg-amber-500">{pendingCount}</Badge>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => fetchCompanies()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#7209b7]" />
        </div>
      ) : (
        <Table>
          <TableCaption>
            {activeTab === "pending" 
              ? "List of companies pending verification" 
              : "List of all companies in the system"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={company.logo} alt={company.name} />
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{getStatusBadge(company.verificationStatus)}</TableCell>
                  <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(company)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        Details
                      </Button>
                      
                      {company.verificationStatus === "pending" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleVerifyCompany(company._id, "approved")}
                            disabled={isProcessing[company._id]}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                          >
                            {isProcessing[company._id] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleVerifyCompany(company._id, "rejected")}
                            disabled={isProcessing[company._id]}
                            className="flex items-center gap-1"
                          >
                            {isProcessing[company._id] ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Company Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
            <DialogDescription>
              View company information and verification status
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Logo */}
              <div className="flex justify-center mb-6">
                {selectedCompany.logo ? (
                  <img
                    src={selectedCompany.logo}
                    alt={selectedCompany.name}
                    className="w-32 h-32 object-contain border rounded-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold">
                    {selectedCompany.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
                <div className="font-semibold">Name:</div>
                <div>{selectedCompany.name}</div>
            
                <div className="font-semibold">Owner:</div>
                <div>{selectedCompany.userId?.fullname || "N/A"}</div>
            
                <div className="font-semibold">Email:</div>
                <div>{selectedCompany.userId?.email || "N/A"}</div>
            
                <div className="font-semibold">Status:</div>
                <div>{getStatusBadge(selectedCompany.verificationStatus)}</div>
            
                <div className="font-semibold">Created At:</div>
                <div>{new Date(selectedCompany.createdAt).toLocaleString()}</div>
                
                {selectedCompany.description && (
                  <>
                    <div className="font-semibold">Description:</div>
                    <div className="break-words overflow-hidden">{selectedCompany.description}</div>
                  </>
                )}
                
                {selectedCompany.website && (
                  <>
                    <div className="font-semibold">Website:</div>
                    <div>
                      <a 
                        href={selectedCompany.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {selectedCompany.website}
                      </a>
                    </div>
                  </>
                )}
                
                {selectedCompany.location && (
                  <>
                    <div className="font-semibold">Location:</div>
                    <div>{selectedCompany.location}</div>
                  </>
                )}
              </div>

              <DialogFooter className="flex flex-wrap justify-end gap-2 mt-4">
                {selectedCompany.verificationStatus === "pending" && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => handleVerifyCompany(selectedCompany._id, "approved")}
                      disabled={isProcessing[selectedCompany._id] || isDeleting[selectedCompany._id]}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing[selectedCompany._id] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} className="mr-2" />
                          Approve Company
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleVerifyCompany(selectedCompany._id, "rejected")}
                      disabled={isProcessing[selectedCompany._id] || isDeleting[selectedCompany._id]}
                    >
                      {isProcessing[selectedCompany._id] ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="mr-2" />
                          Reject Company
                        </>
                      )}
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDeleteCompany(selectedCompany._id)}
                  disabled={isDeleting[selectedCompany._id] || isProcessing[selectedCompany._id]}
                  className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
                >
                  {isDeleting[selectedCompany._id] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete Company
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCompanyManagement;
