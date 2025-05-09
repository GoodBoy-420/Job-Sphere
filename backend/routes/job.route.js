import express from "express";
import {
  
  getAllJobs,
  
} from "../controllers/job.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();


router.route("/get").get(isAuthenticated, getAllJobs);


export default router;
