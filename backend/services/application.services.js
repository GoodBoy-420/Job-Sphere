import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJobService = async (req) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return {
        statusCode: 400,
        body: { message: "Job is required", success: false },
      };
    }

    // If already applied by applicant
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return {
        statusCode: 400,
        body: { message: "You have already applied for this job", success: false },
      };
    }

    // Checking if the job exists:
    const job = await Job.findById(jobId);
    if (!job) {
      return {
        statusCode: 400,
        body: { message: "Job not found", success: false },
      };
    }

    // Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return {
      statusCode: 201,
      body: { message: "Applied successfully", success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};
