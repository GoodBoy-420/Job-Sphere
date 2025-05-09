import { Company } from "../models/company.model.js";




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




