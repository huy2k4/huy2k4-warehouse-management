// client/src/App.js - Áp dụng ProtectedRoute

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute'; // <<< IMPORT PROTECTED ROUTE
import HomePage from './pages/HomePage';
import SanPhamPage from './pages/SanPhamPage';
import KhoPage from './pages/KhoPage';
import LichSuPage from './pages/LichSuPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- Các Route cần đăng nhập mới được vào --- */}
                <Route element={<ProtectedRoute />}> {/* <<< BỌC NGOÀI BẰNG PROTECTED ROUTE */}
                    {/* Route cha dùng Layout (vẫn nằm bên trong ProtectedRoute) */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                        <Route path="san-pham" element={<SanPhamPage />} />
                        <Route path="kho" element={<KhoPage />} />
                        <Route path="lich-su" element={<LichSuPage />} />
                    </Route>
                    {/* Thêm các route cần bảo vệ khác vào đây nếu có */}
                </Route>
                 {/* --- Các Route công khai, không cần đăng nhập --- */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;