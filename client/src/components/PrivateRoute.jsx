import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const PrivateRoute = () => {
  const [isValidToken, setIsValidToken] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValidToken(false);
        return;
      }

      try {
        const response = await axios.get("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsValidToken(response.data.isValid);
      } catch (error) {
        console.error("Token verification error:", error);
        setIsValidToken(false);
      }
    };

    verifyToken();
  }, []);

  if (isValidToken === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-blue-500">Checking authentication...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mt-2"></div>
      </div>
    );
  }

  return isValidToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
