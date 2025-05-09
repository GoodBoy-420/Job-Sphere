import { User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Find the user and check if they have admin role
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required."
      });
    }

    // If user is admin, proceed to the next middleware
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authorization"
    });
  }
};

export default isAdmin;
