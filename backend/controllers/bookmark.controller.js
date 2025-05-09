import {
  toggleBookmarkService,
  getBookmarksService,
  checkBookmarkStatusService,
} from "../services/bookmark.services.js";

export const toggleBookmark = async (req, res) => {
  const result = await toggleBookmarkService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getBookmarks = async (req, res) => {
  const result = await getBookmarksService(req);
  return res.status(result.statusCode).json(result.body);
};

export const checkBookmarkStatus = async (req, res) => {
  const result = await checkBookmarkStatusService(req);
  return res.status(result.statusCode).json(result.body);
};
