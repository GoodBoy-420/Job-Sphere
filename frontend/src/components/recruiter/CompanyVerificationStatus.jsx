import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useParams, Link } from "react-router-dom";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Loader2, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";

const CompanyVerificationStatus = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${COMPANY_API_END_POINT}/verification-status/${companyId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setCompany(response.data.company);
        } else {
          setError("Failed to fetch company status");
          toast.error("Failed to fetch company status");
        }
      } catch (error) {
        console.error("Error fetching company status:", error);
        setError(error.response?.data?.message || "An error occurred");
        toast.error(error.response?.data?.message || "Failed to fetch company status");
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyStatus();
    }
  }, [companyId]);

  // Get status badge based on verification status
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get status icon based on verification status
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "rejected":
        return <XCircle className="h-8 w-8 text-red-500" />;
      case "pending":
        return <Clock className="h-8 w-8 text-amber-500" />;
      default:
        return null;
    }
  };

  // Get status message based on verification status
  const getStatusMessage = (status) => {
    switch (status) {
      case "approved":
        return "Your company has been verified and approved. You can now post jobs under this company.";
      case "rejected":
        return "Your company registration has been rejected. Please contact an administrator for more information.";
      case "pending":
        return "Your company is pending verification. You will be able to post jobs once an administrator approves your company.";
      default:
        return "Unable to determine company status.";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#7209b7] mb-4" />
        <p className="text-gray-500">Loading company status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500 font-medium mb-2">Error</p>
        <p className="text-gray-500">{error}</p>
        <Button asChild className="mt-4">
          <Link to="/recruiter/companies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
        </Button>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-500 font-medium mb-2">Company Not Found</p>
        <p className="text-gray-500">The requested company could not be found.</p>
        <Button asChild className="mt-4">
          <Link to="/recruiter/companies">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-6">
        <Link to="/recruiter/companies">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{company.name}</CardTitle>
              <CardDescription>Company Verification Status</CardDescription>
            </div>
            {getStatusBadge(company.verificationStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            {getStatusIcon(company.verificationStatus)}
            <p className="text-gray-700">{getStatusMessage(company.verificationStatus)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
              <p className="mt-1">{company.name}</p>
            </div>

            {company.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{company.description}</p>
              </div>
            )}

            {company.location && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Location</h3>
                <p className="mt-1">{company.location}</p>
              </div>
            )}

            {company.website && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Website</h3>
                <p className="mt-1">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {company.website}
                  </a>
                </p>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
              <p className="mt-1">{new Date(company.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          {company.verificationStatus === "approved" ? (
            <Button asChild>
              <Link to="/recruiter/jobs/create">Post a Job</Link>
            </Button>
          ) : (
            <p className="text-sm text-gray-500">
              {company.verificationStatus === "pending"
                ? "You'll be able to post jobs once your company is approved."
                : "Please contact an administrator for more information."}
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompanyVerificationStatus;
