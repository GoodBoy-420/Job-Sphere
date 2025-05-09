import express from "express";
import {
  
  updateStatus,
} from "../controllers/application.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;
