import {

  updateCompanyService,

} from "../services/company.services.js";



export const updateCompany = async (req, res) => {
  const result = await updateCompanyService(req);
  return res.status(result.statusCode).json(result.body);
};
