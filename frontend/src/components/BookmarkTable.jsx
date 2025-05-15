import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { APPLICATION_API_END_POINT, BOOKMARK_API_END_POINT } from "@/utils/constant";
import { setBookmarkedJobs } from "@/redux/jobSlice";
import { toast } from "sonner";
import { Trash2, BookmarkPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const BookmarkTable = () => {
  const { bookmarkedJobs = [] } = useSelector((store) => store.job);
  const [applyingJobs, setApplyingJobs] = useState({});
  const [removingJobs, setRemovingJobs] = useState({});
  const [categories, setCategories] = useState(["All", "Urgent", "Interested", "Applied", "Rejected"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newCategory, setNewCategory] = useState("");
  const [bookmarkCategories, setBookmarkCategories] = useState({});
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  
  // Load saved categories from localStorage
  useEffect(() => {
    const savedCategories = localStorage.getItem("bookmarkCategories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
    
    const savedBookmarkCategories = localStorage.getItem("bookmarkCategoryAssignments");
    if (savedBookmarkCategories) {
      setBookmarkCategories(JSON.parse(savedBookmarkCategories));
    }
  }, []);
  
  // Filter bookmarks based on selected category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredBookmarks(bookmarkedJobs);
    } else {
      setFilteredBookmarks(
        bookmarkedJobs.filter(bookmark => 
          bookmarkCategories[bookmark._id] === selectedCategory
        )
      );
    }
  }, [selectedCategory, bookmarkedJobs, bookmarkCategories]);

  // Function to apply for a job
  const applyForJob = async (jobId, bookmarkId) => {
    try {
      setApplyingJobs(prev => ({ ...prev, [jobId]: true }));
      
      // Call the API to apply for the job
      const applyResponse = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true
      });
      
      if (applyResponse.data.success) {
        // If application is successful, remove from bookmarks
        const updatedBookmarks = bookmarkedJobs.filter(bookmark => bookmark._id !== bookmarkId);
        dispatch(setBookmarkedJobs(updatedBookmarks));
        
        // Remove from categories
        const updatedCategories = { ...bookmarkCategories };
        delete updatedCategories[bookmarkId];
        setBookmarkCategories(updatedCategories);
        localStorage.setItem("bookmarkCategoryAssignments", JSON.stringify(updatedCategories));
        
        toast.success("Applied successfully! Job removed from bookmarks.");
      } else {
        toast.error(applyResponse.data.message || "Failed to apply for job");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error(error.response?.data?.message || "An error occurred while applying for the job");
    } finally {
      setApplyingJobs(prev => ({ ...prev, [jobId]: false }));
    }
  };
  
  // Function to remove a bookmark
  const removeBookmark = async (jobId, bookmarkId) => {
    try {
      setRemovingJobs(prev => ({ ...prev, [jobId]: true }));
      
      // Call the API to toggle (remove) the bookmark
      const response = await axios.post(`${BOOKMARK_API_END_POINT}/get/${jobId}`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Remove from bookmarks list
        const updatedBookmarks = bookmarkedJobs.filter(bookmark => bookmark._id !== bookmarkId);
        dispatch(setBookmarkedJobs(updatedBookmarks));
        
        // Remove from categories
        const updatedCategories = { ...bookmarkCategories };
        delete updatedCategories[bookmarkId];
        setBookmarkCategories(updatedCategories);
        localStorage.setItem("bookmarkCategoryAssignments", JSON.stringify(updatedCategories));
        
        toast.success("Job removed from bookmarks.");
      } else {
        toast.error(response.data.message || "Failed to remove bookmark");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error(error.response?.data?.message || "An error occurred while removing the bookmark");
    } finally {
      setRemovingJobs(prev => ({ ...prev, [jobId]: false }));
    }
  };
  
  // Function to add a new category
  const addCategory = () => {
    if (newCategory.trim() === "") return;
    if (categories.includes(newCategory.trim())) {
      toast.error("Category already exists");
      return;
    }
    
    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);
    localStorage.setItem("bookmarkCategories", JSON.stringify(updatedCategories));
    setNewCategory("");
    setIsDialogOpen(false);
    toast.success(`Category '${newCategory.trim()}' added successfully`);
  };
  
  // Function to assign a category to a bookmark
  const assignCategory = (bookmarkId, category) => {
    const updatedCategories = { ...bookmarkCategories, [bookmarkId]: category };
    setBookmarkCategories(updatedCategories);
    localStorage.setItem("bookmarkCategoryAssignments", JSON.stringify(updatedCategories));
    toast.success(`Job categorized as '${category}'`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Filter by Category:</h2>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              <BookmarkPlus size={16} />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category to organize your bookmarked jobs.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="category-name">Category Name</Label>
              <Input 
                id="category-name" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                placeholder="e.g., High Priority"
              />
            </div>
            <DialogFooter>
              <Button onClick={addCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Table>
        <TableCaption>A list of your bookmarked jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!filteredBookmarks || filteredBookmarks.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                {selectedCategory === "All" 
                  ? "You haven't bookmarked any jobs yet." 
                  : `No jobs in the '${selectedCategory}' category.`}
              </TableCell>
            </TableRow>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <TableRow key={bookmark._id}>
                <TableCell>{bookmark?.createdAt?.split("T")[0]}</TableCell>
                <TableCell>{bookmark.job?.title}</TableCell>
                <TableCell>{bookmark.job?.company?.name}</TableCell>
                <TableCell>
                  <Badge className="bg-[#7209b7]">
                    {bookmark.job?.salary}LPA
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select 
                    value={bookmarkCategories[bookmark._id] || "Uncategorized"} 
                    onValueChange={(value) => assignCategory(bookmark._id, value)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => applyForJob(bookmark.job?._id, bookmark._id)}
                      disabled={applyingJobs[bookmark.job?._id]}
                    >
                      {applyingJobs[bookmark.job?._id] ? "Applying..." : "Apply"}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeBookmark(bookmark.job?._id, bookmark._id)}
                      disabled={removingJobs[bookmark.job?._id]}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BookmarkTable;
