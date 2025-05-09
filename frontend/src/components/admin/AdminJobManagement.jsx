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
import { Loader2, Trash2, Eye, X, Calendar, MapPin, Briefcase, DollarSign, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../ui/dialog";
import { JOB_API_END_POINT } from "@/utils/constant";

const ADMIN_API_END_POINT = `${import.meta.env.VITE_BACKEND_URL}/admin`;

const AdminJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${ADMIN_API_END_POINT}/get-jobs`, {
        withCredentials: true
      });

      if (response.data.status === "success") {
        setJobs(response.data.data || []);
      } else {
        toast.error(response.data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job
  const handleDeleteJob = async (jobId) => {
    try {
      setIsDeleting(prev => ({ ...prev, [jobId]: true }));

      const response = await axios.get(`${ADMIN_API_END_POINT}/delete-job/${jobId}`, {
        withCredentials: true
      });

      if (response.data.success) {
        setJobs(jobs.filter(job => job._id !== jobId));
        toast.success("Job deleted successfully");
      } else {
        toast.error(response.data.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.response?.data?.message || "An error occurred while deleting job");
    } finally {
      setIsDeleting(prev => ({ ...prev, [jobId]: false }));
    }
  };

  // View job details
  const viewJobDetails = async (job) => {
    setSelectedJob(job);
    setIsDetailsDialogOpen(true);
    
    // Fetch more details if needed
    try {
      setIsLoadingDetails(true);
      const response = await axios.get(`${JOB_API_END_POINT}/get/${job._id}`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setJobDetails(response.data.job);
      } else {
        toast.error("Failed to fetch job details");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("An error occurred while fetching job details");
    } finally {
      setIsLoadingDetails(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Management</h2>
        <Button
          variant="outline"
          onClick={fetchJobs}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#7209b7]" />
        </div>
      ) : (
        <Table>
          <TableCaption>List of all jobs in the system</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No jobs found
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company?.name || "N/A"}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {job.jobType}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.salary} LPA</TableCell>
                  <TableCell>{job.applications?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewJobDetails(job)}
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
      
      {/* Job Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedJob?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedJob?.company?.name} • {selectedJob?.location}
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingDetails ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#7209b7]" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Job Overview */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium capitalize">{selectedJob?.jobType}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Salary</p>
                    <p className="font-medium">{selectedJob?.salary} LPA</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{selectedJob?.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Posted On</p>
                    <p className="font-medium">{selectedJob?.createdAt ? formatDate(selectedJob.createdAt) : 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Applications</p>
                    <p className="font-medium">{jobDetails?.applications?.length || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Experience Level</p>
                    <p className="font-medium">{selectedJob?.experienceLevel || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{selectedJob?.description}</p>
              </div>
              
              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedJob?.requirements?.map((requirement, index) => (
                    <li key={index} className="text-gray-700">{requirement}</li>
                  ))}
                </ul>
              </div>
              
              {/* Company Info */}
              {selectedJob?.company && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Company Information</h3>
                  <div className="flex items-center gap-4">
                    {selectedJob.company.logo && (
                      <img 
                        src={selectedJob.company.logo} 
                        alt={selectedJob.company.name} 
                        className="w-16 h-16 object-contain rounded-md"
                      />
                    )}
                    <div>
                      <p className="font-medium">{selectedJob.company.name}</p>
                      {selectedJob.company.website && (
                        <a 
                          href={selectedJob.company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {selectedJob.company.website}
                        </a>
                      )}
                      {selectedJob.company.location && (
                        <p className="text-sm text-gray-500">{selectedJob.company.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setIsDetailsDialogOpen(false);
                handleDeleteJob(selectedJob._id);
              }}
              disabled={isDeleting[selectedJob?._id]}
              className="flex items-center gap-1"
            >
              {isDeleting[selectedJob?._id] ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Delete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminJobManagement;
