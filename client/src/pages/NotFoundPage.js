// client/src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div>
            <h2>404 - Không Tìm Thấy Trang</h2>
            <p>Xin lỗi, trang bạn tìm kiếm không tồn tại.</p>
            <Link to="/">Quay về Trang Chủ</Link>
        </div>
    );
}

export default NotFoundPage;