// client/src/pages/SanPhamPage.js - Thêm kiểm tra role trước khi render ThemSanPhamSection
import React from 'react';
import { useAuth } from '../context/AuthContext'; // <<< Import useAuth
import ThemSanPhamSection from '../components/ThemSanPhamSection';
import DanhSachSanPhamSection from '../components/DanhSachSanPhamSection';

function SanPhamPage() {
    const { authState } = useAuth(); // <<< Lấy trạng thái auth

    return (
        <div>
            <h2>Quản lý Sản phẩm</h2>

            {/* --- >>> CHỈ HIỂN THỊ FORM THÊM NẾU LÀ ADMIN <<< --- */}
            {authState.isAuthenticated && authState.user?.role === 'admin' && (
                <ThemSanPhamSection />
            )}
            {/* --- >>> KẾT THÚC HIỂN THỊ CÓ ĐIỀU KIỆN <<< --- */}


            {/* Phần danh sách sản phẩm thì ai cũng xem được (nếu đã đăng nhập và vào được trang này) */}
            <DanhSachSanPhamSection />
        </div>
    );
}

export default SanPhamPage;