import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";


export const getAppliedJobsService = async (req) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!application || application.length === 0) {
      return {
        statusCode: 404,
        body: { message: "No application", success: false },
      };
    }

    return {
      statusCode: 200,
      body: { application, success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};

export const getApplicantsService = async (req) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return {
        statusCode: 404,
        body: { message: "Job not found", success: false },
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
