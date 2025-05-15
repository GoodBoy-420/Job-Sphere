import express from "express";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
  deleteJob,
} from "../controllers/job.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/update/:id").put(isAuthenticated, updateJob);
router.route("/delete/:id").delete(isAuthenticated, deleteJob);

export default router;
