
import { Job } from "../models/job.model.js";







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

