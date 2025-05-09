
import { deleteJobService, deleteUserService, getAllJobsService, getAllUsersService, loginService , logoutService, updateUserService} from "../services/admin.services.js";







export const getAllJobs = async (req, res) => {
  const result = await getAllJobsService();
  return res.status(result.status === "success" ? 200 : 500).json(result);
};

export const deleteJob= async (req, res) => {
  const result = await deleteJobService(req);
  return res.status(result.statusCode).json(result.body);
};