import express from "express";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
  getAllCompanies,
  verifyCompany,
  getPendingCompanies,
  getCompanyVerificationStatus,
  deleteCompany
} from "../controllers/company.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);
router.route("/verification-status/:id").get(isAuthenticated, getCompanyVerificationStatus);

// Admin routes for company verification
router.route("/admin/all").get(isAuthenticated, getAllCompanies);
router.route("/admin/pending").get(isAuthenticated, getPendingCompanies);
router.route("/admin/verify/:companyId").post(isAuthenticated, verifyCompany);
router.route("/admin/delete/:companyId").delete(isAuthenticated, deleteCompany);

export default router;
