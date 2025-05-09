import express from "express";
import {

  registerCompany,
 
} from "../controllers/company.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);

export default router;
