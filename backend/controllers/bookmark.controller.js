import {

  getBookmarksService,
  
} from "../services/bookmark.services.js";


export const getBookmarks = async (req, res) => {
  const result = await getBookmarksService(req);
  return res.status(result.statusCode).json(result.body);
};
