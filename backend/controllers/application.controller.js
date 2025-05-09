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




