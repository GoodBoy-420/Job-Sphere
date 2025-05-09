import express from "express";

import { deleteUser, getAllJobs, getAllUsers, login, logout, updateUser,deleteJob } from "../controllers/admin.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";




const router = express.Router();


router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/get-users").get(isAuthenticated, getAllUsers);
router.route("/delete-user/:id").get(isAuthenticated, deleteUser);
router.route("/update-user/:id").post(isAuthenticated, updateUser);




export default router;
