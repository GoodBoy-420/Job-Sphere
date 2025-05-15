import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import axios from "axios";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyVerificationStatus, setCompanyVerificationStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const navigate = useNavigate();

  const { companies } = useSelector((store) => store.company);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const company = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setSelectedCompany(company);
    setInput({ ...input, companyId: company._id });
    
    // Check company verification status
    checkCompanyVerificationStatus(company._id);
  };
  
  // Check company verification status
  const checkCompanyVerificationStatus = async (companyId) => {
    try {
      setCheckingStatus(true);
      const response = await axios.get(
        `${COMPANY_API_END_POINT}/verification-status/${companyId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setCompanyVerificationStatus(response.data.verificationStatus);
      }
    } catch (error) {
      console.error("Error checking company verification status:", error);
      toast.error("Failed to check company verification status");
    } finally {
      setCheckingStatus(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Check if company is verified before submitting
    if (companyVerificationStatus !== 'approved') {
      toast.error("Cannot post jobs for unapproved companies. Please wait for admin verification.");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/recruiter/jobs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
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
                placeholder="Enter job requirements"
              />
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job salary in LPA"
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
                placeholder="Enter job title"
              />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job place"
              />
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                placeholder="Enter job exp. (year)"
              />
            </div>
            <div>
              <Label>No. of Postion</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            {companies.length > 0 && (
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((company) => {
                      return (
                        <SelectItem value={company?.name?.toLowerCase()}>
                          {company.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          {selectedCompany && (
            <div className="col-span-2 mt-4">
              <Alert className={`
                ${companyVerificationStatus === 'approved' ? 'border-green-500 bg-green-50' : ''}
                ${companyVerificationStatus === 'pending' ? 'border-amber-500 bg-amber-50' : ''}
                ${companyVerificationStatus === 'rejected' ? 'border-red-500 bg-red-50' : ''}
              `}>
                <div className="flex items-center">
                  {checkingStatus ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : companyVerificationStatus === 'approved' ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : companyVerificationStatus === 'pending' ? (
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <AlertTitle>
                    Company Verification Status: 
                    <Badge className={`ml-2 
                      ${companyVerificationStatus === 'approved' ? 'bg-green-500' : ''}
                      ${companyVerificationStatus === 'pending' ? 'bg-amber-500' : ''}
                      ${companyVerificationStatus === 'rejected' ? 'bg-red-500' : ''}
                    `}>
                      {companyVerificationStatus ? companyVerificationStatus.charAt(0).toUpperCase() + companyVerificationStatus.slice(1) : 'Checking...'}
                    </Badge>
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  {companyVerificationStatus === 'approved' ? (
                    "This company is verified and you can post jobs."
                  ) : companyVerificationStatus === 'pending' ? (
                    "This company is pending verification. You cannot post jobs until an admin approves it."
                  ) : companyVerificationStatus === 'rejected' ? (
                    "This company has been rejected. Please contact an administrator for more information."
                  ) : (
                    "Checking company verification status..."
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="w-full my-4"
              disabled={!selectedCompany || companyVerificationStatus !== 'approved'}
            >
              Post New Job
            </Button>
          )}
          
          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first, before posting a jobs
            </p>
          )}
          
          {selectedCompany && companyVerificationStatus !== 'approved' && (
            <p className="text-xs text-amber-600 font-bold text-center my-3">
              *You cannot post jobs until your company is approved by an administrator
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
