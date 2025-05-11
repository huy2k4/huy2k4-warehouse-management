// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
// Đảm bảo bạn đã chạy: npm install jwt-decode trong thư mục client
// import { jwtDecode } from 'jwt-decode'; // Tạm thời comment nếu chưa dùng check expiry

// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        user: null,
        isAuthenticated: false,
    });
    const [loading, setLoading] = useState(true); // State loading để chờ kiểm tra localStorage

    // Kiểm tra localStorage khi ứng dụng khởi động
    useEffect(() => {
        console.log("AuthProvider: Checking localStorage on mount...");
        try {
            const token = localStorage.getItem('authToken');
            const storedUser = localStorage.getItem('authUser');

            if (token) {
                 // Tạm thời: Chỉ cần có token là coi như đã đăng nhập
                 console.log("AuthProvider: Token found, user loaded from localStorage.");
                 setAuthState({
                     token: token,
                     user: storedUser ? JSON.parse(storedUser) : null,
                     isAuthenticated: true,
                 });
                 // Optional: Kiểm tra token expiry (cần cài jwt-decode)
                 /*
                 try {
                     const decodedToken = jwtDecode(token);
                     const currentTime = Date.now() / 1000;
                     if (decodedToken.exp < currentTime) {
                         console.log("AuthProvider: Token expired.");
                         localStorage.removeItem('authToken');
                         localStorage.removeItem('authUser');
                         setAuthState({ token: null, user: null, isAuthenticated: false });
                     } else {
                         console.log("AuthProvider: Token valid, user loaded from localStorage.");
                         setAuthState({
                             token: token,
                             user: storedUser ? JSON.parse(storedUser) : null,
                             isAuthenticated: true,
                         });
                     }
                 } catch (decodeError) {
                     console.error("AuthProvider: Error decoding token", decodeError);
                     localStorage.removeItem('authToken');
                     localStorage.removeItem('authUser');
                     setAuthState({ token: null, user: null, isAuthenticated: false });
                 }
                 */
            } else {
                console.log("AuthProvider: No token found in localStorage.");
                setAuthState({ token: null, user: null, isAuthenticated: false });
            }
        } catch (error) {
            console.error("AuthProvider: Error reading from localStorage", error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setAuthState({ token: null, user: null, isAuthenticated: false });
        } finally {
             setLoading(false); // Đánh dấu đã kiểm tra xong
        }
    }, []); // Chạy 1 lần duy nhất khi component mount

    // Hàm login: Cập nhật state và localStorage
    const login = (token, userData) => {
        console.log("AuthProvider: login called");
        try {
            localStorage.setItem('authToken', token);
            localStorage.setItem('authUser', JSON.stringify(userData));
            setAuthState({
                token: token,
                user: userData,
                isAuthenticated: true,
            });
        } catch (error) {
            console.error("AuthProvider: Error saving to localStorage during login", error);
        }
    };

    // Hàm logout: Xóa state và localStorage
    const logout = () => {
        console.log("AuthProvider: logout called");
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            setAuthState({
                token: null,
                user: null,
                isAuthenticated: false,
            });
        } catch (error) {
            console.error("AuthProvider: Error removing from localStorage during logout", error);
        }
    };

    const value = {
        authState,
        login,
        logout,
    };

    // Hiển thị loading trong khi chờ kiểm tra localStorage
    if (loading) {
         return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Authentication...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Tạo Custom Hook để sử dụng Context dễ dàng hơn
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};