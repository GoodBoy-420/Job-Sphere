import {
  postJobService,
  getAllJobsService,
  getJobByIdService,
  getAdminJobsService,
  updateJobService,
  deleteJobService,
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

export const getAdminJobs = async (req, res) => {
  const result = await getAdminJobsService(req);
  return res.status(result.statusCode).json(result.body);
};

export const updateJob = async (req, res) => {
  const result = await updateJobService(req);
  return res.status(result.statusCode).json(result.body);
};

export const deleteJob = async (req, res) => {
  const result = await deleteJobService(req);
  return res.status(result.statusCode).json(result.body);
};
