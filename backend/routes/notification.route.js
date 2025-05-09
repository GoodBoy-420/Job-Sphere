import express from "express";
import {
  createNotification,
  getAdminNotifications,
  getUserNotifications,
  markNotificationAsRead,
  getUnreadNotificationCount,
  clearAllNotifications
} from "../controllers/notification.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Create notification - internal use only
router.route("/create").post(isAuthenticated, createNotification);

// Get notifications for current user
router.route("/user").get(isAuthenticated, getUserNotifications);

// Get notifications for admin
router.route("/admin").get(isAuthenticated, isAdmin, getAdminNotifications);

// Mark notification as read
router.route("/read/:notificationId").put(isAuthenticated, markNotificationAsRead);

// Get unread notification count
router.route("/unread/count").get(isAuthenticated, getUnreadNotificationCount);

// Clear all notifications for current user
router.route("/clear-all").delete(isAuthenticated, clearAllNotifications);

export default router;
