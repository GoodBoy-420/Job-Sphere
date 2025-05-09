import {
  createNotificationService,
  getAdminNotificationsService,
  getUserNotificationsService,
  markNotificationAsReadService,
  getUnreadNotificationCountService,
  clearAllNotificationsService
} from "../services/notification.services.js";

export const createNotification = async (req, res) => {
  const result = await createNotificationService(req.body);
  return res.status(result.statusCode).json(result.body);
};

export const getAdminNotifications = async (req, res) => {
  const result = await getAdminNotificationsService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getUserNotifications = async (req, res) => {
  const result = await getUserNotificationsService(req);
  return res.status(result.statusCode).json(result.body);
};

export const markNotificationAsRead = async (req, res) => {
  const result = await markNotificationAsReadService(req);
  return res.status(result.statusCode).json(result.body);
};

export const getUnreadNotificationCount = async (req, res) => {
  const result = await getUnreadNotificationCountService(req);
  return res.status(result.statusCode).json(result.body);
};

export const clearAllNotifications = async (req, res) => {
  const result = await clearAllNotificationsService(req);
  return res.status(result.statusCode).json(result.body);
};
