import {

  updateStatusService,
} from "../services/application.services.js";



export const updateStatus = async (req, res) => {
  const result = await updateStatusService(req);
  return res.status(result.statusCode).json(result.body);
};
