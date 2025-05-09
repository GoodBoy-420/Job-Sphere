import express from "express";

import {  getAllJobs,  login, logout,deleteJob } from "../controllers/admin.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";




const router = express.Router();


router.route("/login").post(login);
router.route("/logout").get(logout);


router.route("/get-jobs").get(isAuthenticated, getAllJobs);
router.route("/delete-job/:id").get(isAuthenticated, deleteJob);



export default router;
