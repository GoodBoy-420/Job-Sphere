import express from "express";
import {
  toggleBookmark,
  getBookmarks,
  checkBookmarkStatus,
} from "../controllers/bookmark.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Toggle bookmark status (add/remove)
router.route("/get/:jobId").post(isAuthenticated, toggleBookmark);

// Get all bookmarks for the logged-in user
router.route("/").get(isAuthenticated, getBookmarks);

// Check if a job is bookmarked by the user
router.route("/check/:jobId").get(isAuthenticated, checkBookmarkStatus);

export default router;
