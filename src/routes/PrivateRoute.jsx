import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = false; // 실제 로그인 여부 확인

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;