import {
  postJobService,
  getAllJobsService,
  getJobByIdService,
  
} from "../services/job.services.js";

export const postJob = async (req, res) => {
  const result = await postJobService(req);
  return res.status(result.statusCode).json(result.body);
};


export const getAllJobs = async (req, res) => {
  const result = await getAllJobsService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getJobById = async (req, res) => {
  const result = await getJobByIdService(req);
  return res.status(result.statusCode).json(result.body);
};

