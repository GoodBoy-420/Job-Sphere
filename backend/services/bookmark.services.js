import { Bookmark } from "../models/bookmark.model.js";
import { Job } from "../models/job.model.js";

export const toggleBookmarkService = async (req) => {
  try {
    const {jobId}  = req.params;
    const userId = req.id;
    
    if (!jobId) {
      return {
        statusCode: 400,
        body: { message: "Job ID is required", success: false },
      };
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return {
        statusCode: 404,
        body: { message: "Job not found", success: false },
      };
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      user: userId,
      job: jobId,
    });

    if (existingBookmark) {
      // Remove bookmark if it exists
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      return {
        statusCode: 200,
        body: { message: "Job removed from bookmarks", success: true },
      };
    } else {
      // Add bookmark if it doesn't exist
      await Bookmark.create({
        user: userId,
        job: jobId,
      });
      return {
        statusCode: 201,
        body: { message: "Job added to bookmarks", success: true },
      };
    }
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};

export const getBookmarksService = async (req) => {
  try {
    const userId = req.id;

    // Get all bookmarks for the user with job details
    const bookmarks = await Bookmark.find({ user: userId })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: { bookmarks, success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};

export const checkBookmarkStatusService = async (req) => {
  try {
    const { jobId } = req.params;
    const userId = req.id;

    if (!jobId) {
      return {
        statusCode: 400,
        body: { message: "Job ID is required", success: false },
      };
    }

    // Check if bookmark exists
    const bookmark = await Bookmark.findOne({
      user: userId,
      job: jobId,
    });

    return {
      statusCode: 200,
      body: { isBookmarked: !!bookmark, success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};
