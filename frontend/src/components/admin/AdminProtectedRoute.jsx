import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { admin } = useSelector((store) => store.adminAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (admin === null) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  return <>{children}</>;
};

export default AdminProtectedRoute;
