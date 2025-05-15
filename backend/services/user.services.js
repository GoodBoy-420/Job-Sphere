import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerService = async (req) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return {
        statusCode: 400,
        body: { message: "Something is missing", success: false },
      };
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const user = await User.findOne({ email });
    if (user) {
      return {
        statusCode: 400,
        body: { message: "User already exists with this mail", success: false },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return {
      statusCode: 201,
      body: { message: "User created successfully", success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};

export const loginService = async (req) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return {
        statusCode: 400,
        body: { message: "Something is missing", success: false },
      };
    }

    let user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 400,
        body: { message: "User not found with this mail", success: false },
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return {
        statusCode: 400,
        body: { message: "Incorrect email or password", success: false },
      };
    }

    if (role !== user.role) {
      return {
        statusCode: 400,
        body: { message: "No account found with this role", success: false },
      };
    }

    const tokenData = { userID: user._id };
    const token = jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: "1d" });

    const tokenCookie = {
      token,
      options: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      },
    };

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
      setCookie: tokenCookie,
      body: { message: `Welcome back  ${user.fullname}`, user, success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};

export const logoutService = async () => {
  try {
    return {
      statusCode: 200,
      body: { message: "User logout successfully", success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};

export const updateProfileService = async (req) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    let skillsArray = [];
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userID = req.id;
    let user = await User.findById(userID);

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

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

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
      body: { message: "Profile updated successfully", user, success: true },
    };
  } catch (error) {
    return { statusCode: 500, body: { message: error.message, success: false } };
  }
};
