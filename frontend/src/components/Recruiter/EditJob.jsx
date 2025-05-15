import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Loader2, Trash2 } from "lucide-react";
import Navbar from "../shared/Navbar";
import { JOB_API_END_POINT } from "@/utils/constant";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: "",
  });

  // Fetch job data when component mounts
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${JOB_API_END_POINT}/get/${id}`,
          {
            withCredentials: true
          }
        );

        if (response.data.success) {
          const job = response.data.job;
          setInput({
            title: job.title || "",
            description: job.description || "",
            requirements: job.requirements?.join(",") || "",
            salary: job.salary || "",
            location: job.location || "",
            jobType: job.jobType || "",
            experience: job.experienceLevel || "",
            position: job.position || "",
          });
        } else {
          toast.error("Failed to fetch job details");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `${JOB_API_END_POINT}/update/${id}`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Job updated successfully");
        navigate("/recruiter/jobs");
      } else {
        toast.error(response.data.message || "Failed to update job");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${JOB_API_END_POINT}/delete/${id}`,
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success("Job deleted successfully");
        navigate("/recruiter/jobs");
      } else {
        toast.error(response.data.message || "Failed to delete job");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading && !input.title) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center w-screen my-5">
          <div className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading job details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit Job</h1>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Job
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this job?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the job and remove it from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                    {loading ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job description"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job requirements (comma separated)"
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="number"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job salary"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job location"
              />
            </div>
            <div>
              <Label>Position</Label>
              <Input
                type="text"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job position"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Select
                name="jobType"
                value={input.jobType}
                onValueChange={(value) => setInput({ ...input, jobType: value })}
              >
                <SelectTrigger className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Experience Level</Label>
              <Select
                name="experience"
                value={input.experience}
                onValueChange={(value) => setInput({ ...input, experience: value })}
              >
                <SelectTrigger className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                  <SelectValue placeholder="Select Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between mt-6 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/recruiter/jobs")}
              className="w-1/2"
            >
              Cancel
            </Button>
            {loading ? (
              <Button className="w-1/2" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </Button>
            ) : (
              <Button type="submit" className="w-1/2">
                Update Job
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
