import { Bookmark } from "../models/bookmark.model.js";
import { Job } from "../models/job.model.js";


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
