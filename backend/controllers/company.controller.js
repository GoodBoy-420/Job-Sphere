import {
  
  getCompanyService,
  getCompanyByIdService,
 
} from "../services/company.services.js";



export const getCompany = async (req, res) => {
  const result = await getCompanyService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getCompanyById = async (req, res) => {
  const result = await getCompanyByIdService(req);
  return res.status(result.statusCode).json(result.body);
};
