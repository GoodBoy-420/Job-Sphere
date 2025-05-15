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

export const getCompanyService = async (req) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });

    if (!companies || companies.length === 0) {
      return {
        statusCode: 404,
        body: { message: "Companies not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { companies, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

export const getCompanyByIdService = async (req) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return {
        statusCode: 404,
        body: { message: "Company not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { company, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

export const updateCompanyService = async (req) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const logo = cloudResponse.secure_url;

    const updateData = { name, description, website, location, logo };

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return {
        statusCode: 404,
        body: { message: "Company not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { message: "Company info updated", success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

// Get all companies for admin
export const getAllCompaniesService = async (req) => {
  try {
    const companies = await Company.find().populate('userId', 'fullname email');

    if (!companies || companies.length === 0) {
      return {
        statusCode: 404,
        body: { message: "No companies found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { companies, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

// Verify company service
export const verifyCompanyService = async (req) => {
  try {
    const { companyId } = req.params;
    const { verificationStatus } = req.body;

    if (!companyId || !verificationStatus) {
      return {
        statusCode: 400,
        body: { message: "Company ID and verification status are required", success: false },
      };
    }

    if (!['pending', 'approved', 'rejected'].includes(verificationStatus)) {
      return {
        statusCode: 400,
        body: { message: "Invalid verification status", success: false },
      };
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return {
        statusCode: 404,
        body: { message: "Company not found", success: false },
      };
    }
    
    // Only create notification if status is changing
    if (company.verificationStatus !== verificationStatus) {
      // Create notification for the company owner (recruiter)
      await Notification.create({
        type: 'company_verification',
        message: `Your company "${company.name}" has been ${verificationStatus === 'approved' ? 'approved' : verificationStatus === 'rejected' ? 'rejected' : 'set to pending review'}`,
        targetId: company._id,
        targetModel: 'Company',
        userId: company.userId
      });
    }

    company.verificationStatus = verificationStatus;
    company.isVerified = verificationStatus === 'approved';
    await company.save();

    return {
      statusCode: 200,
      body: { 
        message: `Company ${verificationStatus === 'approved' ? 'approved' : verificationStatus === 'rejected' ? 'rejected' : 'set to pending'}`, 
        company, 
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

// Get pending companies for admin
export const getPendingCompaniesService = async (req) => {
  try {
    const companies = await Company.find({ verificationStatus: 'pending' }).populate('userId', 'fullname email');

    return {
      statusCode: 200,
      body: { companies, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

// Get company verification status for recruiter
export const getCompanyVerificationStatusService = async (req) => {
  try {
    const companyId = req.params.id;
    const userId = req.id;

    if (!companyId) {
      return {
        statusCode: 400,
        body: { message: "Company ID is required", success: false },
      };
    }

    const company = await Company.findById(companyId);

    if (!company) {
      return {
        statusCode: 404,
        body: { message: "Company not found", success: false },
      };
    }

    // Ensure the company belongs to the requesting user
    if (company.userId.toString() !== userId) {
      return {
        statusCode: 403,
        body: { message: "You don't have permission to view this company's status", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { 
        verificationStatus: company.verificationStatus,
        isVerified: company.isVerified,
        company,
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

// Delete company service for admin
export const deleteCompanyService = async (req) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return {
        statusCode: 400,
        body: { message: "Company ID is required", success: false },
      };
    }

    // Check if company exists
    const company = await Company.findById(companyId);

    if (!company) {
      return {
        statusCode: 404,
        body: { message: "Company not found", success: false },
      };
    }

    // Delete the company
    await Company.findByIdAndDelete(companyId);

    // Create notification for the company owner
    await Notification.create({
      type: 'company_verification',
      message: `Your company "${company.name}" has been deleted by an administrator`,
      targetId: company._id,
      targetModel: 'Company',
      userId: company.userId
    });

    return {
      statusCode: 200,
      body: { 
        message: "Company deleted successfully", 
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
