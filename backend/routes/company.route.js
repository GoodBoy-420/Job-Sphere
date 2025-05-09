import express from "express";
import {
  
  updateCompany,
 
} from "../controllers/company.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();


router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);




export default router;
