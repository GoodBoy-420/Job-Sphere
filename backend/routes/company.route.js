import express from "express";
import {
  getCompany,
  getCompanyById,

} from "../controllers/company.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();


router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);




export default router;
