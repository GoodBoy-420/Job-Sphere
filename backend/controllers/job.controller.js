import {

  getAllJobsService,
  
} from "../services/job.services.js";



export const getAllJobs = async (req, res) => {
  const result = await getAllJobsService(req);
  return res.status(result.statusCode).json(result.body);
};

