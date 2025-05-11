// client/src/components/ThemSanPhamSection.js - Sử dụng Material UI
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// <<< Import MUI Components >>>
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper'; // Thêm Paper để tạo nền và shadow

function ThemSanPhamSection() {
    const [sku, setSku] = useState('');
    const [ten, setTen] = useState('');
    const [moTa, setMoTa] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info'); // 'success' hoặc 'error'
    const { authState } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('Đang thêm sản phẩm...');
        setMessageType('info');

        const token = authState.token;
        if (!token) {
             setMessage('Lỗi: Bạn chưa đăng nhập.');
             setMessageType('error');
             setLoading(false);
             return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/sanpham', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sku, ten, moTa }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage(`Thành công: ${data.message}`);
                setMessageType('success');
                setSku('');
                setTen('');
                setMoTa('');
                // Tạm thời vẫn dùng alert để báo refresh list
                alert('Thêm sản phẩm thành công! Vui lòng nhấn "Làm mới danh sách" bên dưới để cập nhật.');
            } else {
                setMessage(`Lỗi ${response.status}: ${data.message || 'Không thể thêm sản phẩm.'}`);
                setMessageType('error');
            }
        } catch (error) {
            console.error("Lỗi API thêm sản phẩm:", error);
            setMessage('Lỗi kết nối hoặc server.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        // <<< Dùng Paper và Box thay cho div thường >>>
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}> {/* elevation tạo bóng đổ */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Căn giữa nội dung trong Box
                }}
            >
                <Typography component="h2" variant="h6" gutterBottom> {/* gutterBottom tạo khoảng cách dưới */}
                    Thêm Sản Phẩm Mới
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}> {/* Form chiếm hết chiều rộng Box */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="sku-them" // Đổi id để tránh trùng lặp nếu có nhiều form
                        label="Mã SKU"
                        name="sku"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        disabled={loading}
                        autoFocus // Focus vào đây đầu tiên
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="ten-them"
                        label="Tên Sản Phẩm"
                        name="ten"
                        value={ten}
                        onChange={(e) => setTen(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        id="moTa-them"
                        label="Mô Tả"
                        name="moTa"
                        multiline // Cho phép nhập nhiều dòng
                        rows={3} // Số dòng hiển thị ban đầu
                        value={moTa}
                        onChange={(e) => setMoTa(e.target.value)}
                        disabled={loading}
                    />
                    {/* <<< Hiển thị thông báo bằng Alert >>> */}
                    {message && (
                        <Alert severity={messageType} sx={{ mt: 2, width: 'calc(100% - 16px)' }}> {/* width trừ padding của Alert */}
                            {message}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained" // Kiểu nút chính
                        color="primary" // Màu xanh dương mặc định
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null} // Icon loading
                    >
                        {loading ? 'Đang xử lý...' : 'Thêm Sản Phẩm'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}

export default ThemSanPhamSection;