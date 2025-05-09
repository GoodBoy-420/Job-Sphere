import { Company } from "../models/company.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import axios from "axios";

export const registerCompanyService = async (req) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return {
        statusCode: 400,
        body: { message: "Company name is required", success: false },
      };
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return {
        statusCode: 400,
        body: { message: "Can't register same company", success: false },
      };
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
      verificationStatus: 'pending',
      isVerified: false
    });

    // Find admin users to send notifications to
    const admins = await User.find({ role: "admin" });
    
    if (admins && admins.length > 0) {
      // Create notification for each admin
      for (const admin of admins) {
        await Notification.create({
          type: 'company_verification',
          message: `New company "${companyName}" requires verification`,
          targetId: company._id,
          targetModel: 'Company',
          userId: admin._id
        });
      }
    }

    return {
      statusCode: 201,
      body: {
        message: "Company registered successfully and pending admin verification",
        company,
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
