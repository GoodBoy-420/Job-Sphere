import {
 
  getAllCompaniesService,
  verifyCompanyService,
  getPendingCompaniesService,
  getCompanyVerificationStatusService,
 
} from "../services/company.services.js";



export const getAllCompanies = async (req, res) => {
  const result = await getAllCompaniesService(req);
  return res.status(result.statusCode).json(result.body);
};

export const verifyCompany = async (req, res) => {
  const result = await verifyCompanyService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getPendingCompanies = async (req, res) => {
  const result = await getPendingCompaniesService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getCompanyVerificationStatus = async (req, res) => {
  const result = await getCompanyVerificationStatusService(req);
  return res.status(result.statusCode).json(result.body);
};

