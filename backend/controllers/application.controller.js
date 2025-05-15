import {
  applyJobService,
  getAppliedJobsService,
  getApplicantsService,
  updateStatusService,
} from "../services/application.services.js";

export const applyJob = async (req, res) => {
  const result = await applyJobService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getAppliedJobs = async (req, res) => {
  const result = await getAppliedJobsService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getApplicants = async (req, res) => {
  const result = await getApplicantsService(req);
  return res.status(result.statusCode).json(result.body);
};

export const updateStatus = async (req, res) => {
  const result = await updateStatusService(req);
  return res.status(result.statusCode).json(result.body);
};
