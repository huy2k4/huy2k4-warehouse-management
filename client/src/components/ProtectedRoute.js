// client/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
    const { authState } = useAuth(); // Lấy trạng thái xác thực từ Context

    // Nếu người dùng chưa được xác thực (chưa đăng nhập)
    if (!authState.isAuthenticated) {
        console.log("ProtectedRoute: User not authenticated, redirecting to /login");
        // Chuyển hướng về trang đăng nhập, thuộc tính replace=true
        // giúp trang hiện tại không bị lưu vào lịch sử trình duyệt
        return <Navigate to="/login" replace />;
    }

    // Nếu đã xác thực, cho phép render các Route con được bọc bởi ProtectedRoute
    // Component Outlet sẽ là nơi render các element của Route con đó
    console.log("ProtectedRoute: User authenticated, rendering Outlet");
    return <Outlet />;
}

export default ProtectedRoute;