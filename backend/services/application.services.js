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

export const updateStatusService = async (req) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return {
        statusCode: 400,
        body: { message: "Status is required", success: false },
      };
    }

    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return {
        statusCode: 404,
        body: { message: "Application not found", success: false },
      };
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    return {
      statusCode: 200,
      body: { message: "Status updated successfully", success: true },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: error.message, success: false },
    };
  }
};
