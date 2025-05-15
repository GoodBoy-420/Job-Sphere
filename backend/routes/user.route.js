import express from "express";

import {
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";

import {
  toggleBookmark,
  getBookmarks,
  checkBookmarkStatus,
} from "../controllers/bookmark.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);
router.route("/logout").get(logout);

// Bookmark routes
router.route("/bookmarks").get(isAuthenticated, getBookmarks);
router.route("/bookmarks/check/:jobId").get(isAuthenticated, checkBookmarkStatus);
router.route("/bookmarks/:jobId").post(isAuthenticated, toggleBookmark);

export default router;
