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

export const getJobByIdService = async (req) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
    });

    if (!job) {
      return {
        statusCode: 400,
        body: { message: "Jobs not found", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { job, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};
export const postJobService = async (req) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return {
        statusCode: 400,
        body: { message: "Something is missing", success: false },
      };
    }

    // Check if company exists and is verified
    const company = await Company.findById(companyId);
    
    if (!company) {
      return {
        statusCode: 404,
        body: { message: "Company not found", success: false },
      };
    }

    // Check if company is verified
    if (!company.isVerified || company.verificationStatus !== 'approved') {
      return {
        statusCode: 403,
        body: { 
          message: "Cannot post jobs for unapproved companies. Please wait for admin verification.", 
          success: false,
          verificationStatus: company.verificationStatus
        },
      };
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });

    return {
      statusCode: 201,
      body: { message: "New job created successfully", job, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};
