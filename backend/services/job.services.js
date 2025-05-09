import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";



export const getAllJobsService = async (req) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
      })
      .sort({
        createdAt: -1,
      });

    if (!jobs || jobs.length === 0) {
      return {
        statusCode: 400,
        body: { message: "Jobs not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { jobs, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};



export const getAdminJobsService = async (req) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "company",
    });

    if (!jobs || jobs.length === 0) {
      return {
        statusCode: 400,
        body: { message: "Jobs not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { jobs, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};
