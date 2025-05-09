import {
  registerCompanyService,

} from "../services/company.services.js";

export const registerCompany = async (req, res) => {
  const result = await registerCompanyService(req);
  return res.status(result.statusCode).json(result.body);
};
