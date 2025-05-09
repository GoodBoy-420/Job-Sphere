
import { deleteJobService, deleteUserService, getAllJobsService, getAllUsersService, loginService , logoutService, updateUserService} from "../services/admin.services.js";


export const login = async (req, res) => {
  const result = await loginService(req);
  if (result.setCookie) {
    return res
      .status(result.statusCode)
      .cookie("token", result.setCookie.token, result.setCookie.options)
      .json(result.body);
  }
  return res.status(result.statusCode).json(result.body);
};


export const logout = async (req, res) => {
  const result = await logoutService();
  return res
    .status(result.statusCode)
    .cookie("token", "", { maxAge: 0 }) 
    .json(result.body);
};

export const getAllUsers = async (req, res) => {
  const result = await getAllUsersService();
  return res.status(result.statusCode).json(result.body);
};

export const updateUser = async (req, res) => {
  const result = await updateUserService(req);
  return res.status(result.statusCode).json(result.body);
};

export const deleteUser = async (req, res) => {
  const result = await deleteUserService(req);
  return res.status(result.statusCode).json(result.body);
};
