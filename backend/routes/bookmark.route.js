import express from "express";
import {
 
  getBookmarks,
 
} from "../controllers/bookmark.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();



// Get all bookmarks for the logged-in user
router.route("/").get(isAuthenticated, getBookmarks);



export default router;
