import React, { useEffect, useState } from "react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { user } = useSelector((store) => store.auth);
  
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };
  
  useEffect(() => {
    // Check if job is bookmarked when component mounts
    const checkBookmarkStatus = async () => {
      try {
        if (!user) return; // Don't check if user is not logged in
        
        const res = await axios.get(`${USER_API_END_POINT}/bookmarks/check/${job?._id}`, {
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
  }, [job?._id, user]);
  
  const toggleBookmark = async (e) => {
    if (e) e.stopPropagation(); // Prevent navigation when clicking the bookmark button
    
    try {
      if (!user) {
        toast.error("Please login to bookmark jobs");
        return;
      }
      
      if (!job || !job._id) {
        toast.error("Job information is missing");
        return;
      }
      
      console.log('Toggling bookmark for job:', job._id);
      
      const res = await axios.post(
        `${USER_API_END_POINT}/bookmarks/${job._id}`,
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
  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {daysAgoFunction(job?.createdAt) === 0
            ? "Today"
            : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button 
          variant="outline" 
          className={`rounded-full ${isBookmarked ? "bg-yellow-100" : ""}`} 
          size="icon"
          onClick={toggleBookmark}
          title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <Bookmark className={isBookmarked ? "fill-yellow-500 text-yellow-500" : ""} />
        </Button>
      </div>

      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} alt="@shadcn" />
          </Avatar>
        </Button>
        <div>
          <h1 className="font-medium text-lg">{job?.company?.name}</h1>
          <p className="text-sm text-gray-500">{job?.location}</p>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-lg my-2">{job?.title}</h1>
        <p className="text-sm text-gray-600">{job?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className={"text-[#F83002] font-bold"} variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
          {job?.salary} LPA
        </Badge>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
        >
          Details
        </Button>
        <Button 
          className="bg-[#7209b7]"
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(e);
          }}
        >
          {isBookmarked ? "Bookmarked" : "Save For Later"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
