import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

// Create notification service
export const createNotificationService = async (data) => {
  try {
    const { type, message, targetId, targetModel, userId } = data;
    
    if (!type || !message || !targetId || !targetModel || !userId) {
      return {
        statusCode: 400,
        body: { message: "All notification fields are required", success: false },
      };
    }

    const notification = await Notification.create({
      type,
      message,
      targetId,
      targetModel,
      userId
    });

    return {
      statusCode: 201,
      body: {
        message: "Notification created successfully",
        notification,
        success: true,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

// Get admin notifications
export const getAdminNotificationsService = async (req) => {
  try {
    // Find admin users
    const admins = await User.find({ role: "admin" });
    
    if (!admins || admins.length === 0) {
      return {
        statusCode: 404,
        body: { message: "No admin users found", success: false },
      };
    }

    // Get admin IDs
    const adminIds = admins.map(admin => admin._id);

    // Get notifications for admin users
    const notifications = await Notification.find({ 
      userId: { $in: adminIds }
    }).sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: { notifications, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

// Get user notifications
export const getUserNotificationsService = async (req) => {
  try {
    const userId = req.id;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    return {
      statusCode: 200,
      body: { notifications, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

// Mark notification as read
export const markNotificationAsReadService = async (req) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return {
        statusCode: 404,
        body: { message: "Notification not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { 
        message: "Notification marked as read", 
        notification,
        success: true 
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

// Get unread notification count
export const getUnreadNotificationCountService = async (req) => {
  try {
    const userId = req.id;
    
    const count = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });

    return {
      statusCode: 200,
      body: { count, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

// Clear all notifications for a user
export const clearAllNotificationsService = async (req) => {
  try {
    const userId = req.id;
    
    const result = await Notification.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: { message: "No notifications found to clear", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { 
        message: `${result.deletedCount} notifications cleared successfully`, 
        success: true 
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};
