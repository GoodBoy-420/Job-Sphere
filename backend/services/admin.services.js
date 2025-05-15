import mongoose from "mongoose";

import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";


const ObjectId=mongoose.Types.ObjectId;

import jwt from "jsonwebtoken";

export const loginService = async (req) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: { message: "Email and password are required", success: false },
      };
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return {
        statusCode: 400,
        body: { message: "Admin not found with this email", success: false },
      };
    }

    // Check if the password matches (No encryption check needed)
    if (admin.password !== password) {
      return {
        statusCode: 400,
        body: { message: "Incorrect password", success: false },
      };
    }

    // Generate JWT token
    const tokenData = { adminID: admin._id };
    const token = jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: "1d" });

    return {
      statusCode: 200,
      setCookie: {
        token,
        options: {
          maxAge: 1 * 24 * 60 * 60 * 1000,  // 1 day expiration
          httpOnly: true,
          sameSite: "strict",
        },
      },
      body: { message: `Welcome back, ${admin.email}`, success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};

export const logoutService = async () => {
  try {
    return {
      statusCode: 200,
      body: { message: "Admin logout successfully", success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};


export const getAllUsersService = async () => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    return {
      statusCode: 200,
      body: { users, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};


export const updateUserService = async (req) => {
  try {
    const { id } = req.params;  
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    let skillsArray = [];
    if (skills) {
      skillsArray = skills.split(",");
    }

    // Check if the user exists
    let user = await User.findById(id);
    if (!user) {
      return {
        statusCode: 400,
        body: { message: "User not found", success: false },
      };
    }


    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;



   
    await user.save();

    // Return the updated user data
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return {
      statusCode: 200,
      body: { message: "User profile updated successfully", user, success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};
export const deleteUserService = async (req) => {
  try {
    const { id } = req.params;  
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return {
        statusCode: 400,
        body: { message: "User not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { message: "User deleted successfully", success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
};
}

export const getAllJobsService = async () => {
  try {
    
    let JoinWithCompanyStage = {
      $lookup: {
        from: "companies", 
        localField: "company", 
        foreignField: "_id", 
        as: "company", 
      },
    };

    let JoinWithUserStage = {
      $lookup: {
        from: "users", // The collection we are joining with
        localField: "created_by", // Field in Job collection
        foreignField: "_id", // Field in User collection
        as: "user", // Name of the new array field in the result
      },
    };

    let UnwindCompanyStage = {
      $unwind: "$company"
    };

    let UnwindUserStage = {
      $unwind: "$user"
    }

    let ProjectionStage = {
      $project: {
        "company._id": 0, 
        "company.userId": 0,
        "company.logo": 0,
        "user._id": 0, 
        "user.password": 0, 
        "user.profile": 0, 
       
        
      },
    };

    let data = await Job.aggregate([
      JoinWithCompanyStage,
      JoinWithUserStage,
      UnwindCompanyStage,
      UnwindUserStage,
      ProjectionStage,
    ]);

    return { status: "success", data: data };
  } catch (error) {
    return { status: "fail", data: error.message };
  }
};

export const deleteJobService = async (req) => {
  try {
    const { id } = req.params;  
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return {
        statusCode: 400,
        body: { message: "job not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { message: "Job deleted successfully", success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
};
}

