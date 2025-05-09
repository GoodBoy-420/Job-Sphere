import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { setSingleJob } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT, USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { BookmarkIcon, ArrowLeft } from "lucide-react";

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isIntiallyApplied = singleJob?.applications?.some(
    (application) => application.application === user?._id || false
  );
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const applyJobHandler = async () => {
    try {
      setIsApplying(true);
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true); // Update the local state

        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
        toast.success(res.data.message);
        
        // Redirect to profile page after successful application
        setTimeout(() => {
          navigate('/profile');
        }, 1500); // Short delay to show the success message
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to apply for job");
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id // Ensure the state is in sync with fetched data
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
    
    // Check if job is bookmarked
    const checkBookmarkStatus = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/bookmarks/check/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setIsBookmarked(res.data.isBookmarked);
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkBookmarkStatus();
  }, [jobId, dispatch, user?._id]);
  
  const toggleBookmark = async () => {
    try {
      if (!user) {
        toast.error("Please login to bookmark jobs");
        return;
      }
      
      if (!jobId) {
        toast.error("Job information is missing");
        return;
      }
      
      console.log('Toggling bookmark for job:', jobId);
      
      const res = await axios.post(
        `${USER_API_END_POINT}/bookmarks/${jobId}`,
        {},
        { withCredentials: true }
      );

      console.log('Bookmark toggle response:', res.data);

      if (res.data.success) {
        setIsBookmarked(!isBookmarked);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to update bookmark");
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      const errorMessage = error.response?.data?.message || "An error occurred while updating bookmark";
      toast.error(errorMessage);
    }
  };
  const goBack = () => {
    navigate('/jobs');
  };
  
  return (
    <div className="max-w-7xl mx-auto my-10">
      <Button 
        variant="ghost" 
        className="mb-4 flex items-center gap-1 text-gray-600 hover:text-gray-900"
        onClick={goBack}
      >
        <ArrowLeft size={16} />
        Back to Jobs
      </Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleJob?.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
              {singleJob?.postion} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
              {singleJob?.jobType}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
              {singleJob?.salary}LPA
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={isApplied ? null : applyJobHandler}
            disabled={isApplied || isApplying}
            className={`rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : isApplying
                ? "bg-[#5f32ad]"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
            }`}
          >
            {isApplied 
              ? "Already Applied" 
              : isApplying 
              ? "Applying..." 
              : "Apply Now"}
          </Button>
        </div>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Job Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.experienceLevel} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.salary}LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Applicants:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.applications?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:
          <span className="pl-4 font-normal text-gray-800">
            {singleJob?.createdAt.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default JobDescription;
