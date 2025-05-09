import express from "express";
import {
  applyJob,

} from "../controllers/application.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/apply/:id").get(isAuthenticated, applyJob);


export default router;
