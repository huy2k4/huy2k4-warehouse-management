// client/src/pages/LichSuPage.js
import React, { useState, useEffect } from 'react';
import LichSuGiaoDichSection from '../components/LichSuGiaoDichSection';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a5d8ff', // Màu xanh nhạt sáng hơn
    },
    secondary: {
      main: '#ffb8c6', // Màu hồng nhạt
    },
    background: {
      default: '#1a1a2e', // Màu nền tối nhẹ
      paper: '#16213e',   // Màu giấy tối nhẹ
    },
    text: {
      primary: '#e6f1ff', // Chữ màu trắng sáng
      secondary: '#b8c2cc', // Chữ phụ màu xám nhạt
    },
  },
  typography: {
    fontFamily: [
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h6: {
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
    body1: {
      lineHeight: 1.6,
    },
  },
});

function LichSuPage() {
  const [lichSuGiaoDich, setLichSuGiaoDich] = useState([]);
  const [dangTaiLichSu, setDangTaiLichSu] = useState(false);
  const [lichSuThongBao, setLichSuThongBao] = useState('');
  const timKiemTheoSKU = async (sku) => {
    setDangTaiLichSu(true);
    setLichSuThongBao(`Đang tải lịch sử cho SKU ${sku}...`);
    try {
      const phanHoi = await fetch(`http://localhost:3001/api/lichsu/${sku}`);
      const ketQua = await phanHoi.json();
      if (ketQua.success) {
        setLichSuGiaoDich(ketQua.lichSu);
        setLichSuThongBao(ketQua.lichSu.length > 0 ? '' : `Không tìm thấy lịch sử cho SKU ${sku}.`);
      } else {
        setLichSuThongBao(`Lỗi: ${ketQua.message}`);
      }
    } catch (error) {
      console.error('Lỗi API:', error);
      setLichSuThongBao('Lỗi kết nối máy chủ');
    } finally {
      setDangTaiLichSu(false);
    }
  };
  const taiLichSuGiaoDich = async () => {
    setDangTaiLichSu(true);
    setLichSuThongBao('Đang tải lịch sử...');
    try {
      const phanHoi = await fetch('http://localhost:3001/api/lichsu');
      const ketQua = await phanHoi.json();
      if (ketQua.success) {
        setLichSuGiaoDich(ketQua.lichSu);
        setLichSuThongBao(ketQua.lichSu.length > 0 ? '' : 'Không tìm thấy lịch sử giao dịch.');
      } else {
        setLichSuThongBao(`Lỗi: ${ketQua.message}`);
      }
    } catch (error) {
      console.error('Lỗi API:', error);
      setLichSuThongBao('Lỗi kết nối máy chủ');
    } finally {
      setDangTaiLichSu(false);
    }
  };

  useEffect(() => {
    taiLichSuGiaoDich();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Chuẩn hóa các style cơ bản */}
      <div style={{ 
        backgroundColor: darkTheme.palette.background.default, 
        minHeight: '100vh', 
        padding: '24px',
        color: darkTheme.palette.text.primary
      }}>
        <LichSuGiaoDichSection
          lichSuGiaoDich={lichSuGiaoDich}
          dangTaiLichSu={dangTaiLichSu}
          lichSuThongBao={lichSuThongBao}
          handleTaiLichSu={taiLichSuGiaoDich}
        />
      </div>
    </ThemeProvider>
  );
}

export default LichSuPage;