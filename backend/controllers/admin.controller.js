
import {  loginService , logoutService} from "../services/admin.services.js";


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

