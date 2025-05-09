import { setBookmarkedJobs } from "@/redux/jobSlice";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetBookmarkedJobs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/bookmarks`, {
          withCredentials: true,
        });

        console.log('Bookmark API response:', res.data);
        
        if (res.data.success) {
          // Initialize with an empty array if bookmarks is undefined
          const bookmarks = res.data.bookmarks || [];
          dispatch(setBookmarkedJobs(bookmarks));
        } else {
          // If the request was not successful, initialize with an empty array
          dispatch(setBookmarkedJobs([]));
        }
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        // Initialize with an empty array on error
        dispatch(setBookmarkedJobs([]));
      }
    };
    fetchBookmarkedJobs();
  }, [dispatch]);
};

export default useGetBookmarkedJobs;
