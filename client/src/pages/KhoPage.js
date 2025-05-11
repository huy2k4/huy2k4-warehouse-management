// client/src/pages/KhoPage.js
import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Divider, 
  LinearProgress,
  Alert,
  Button,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { px } from 'framer-motion';

// Custom Styled Components
const SectionHeader = ({ icon, title }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
    {icon}
    <Typography variant="h6" component="h2" sx={{ ml: 1, fontWeight: 600 }}>
      {title}
    </Typography>
  </Box>
);

const ActionCard = ({ children }) => (
  <Paper elevation={0} sx={{ 
    p: 3, 
    height: '100%',
    backgroundColor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }
  }}>
    {children}
  </Paper>
);

function KhoPage() {
  // State management (giữ nguyên như cũ)
  const [sku, setSku] = useState('');
  const [soLuong, setSoLuong] = useState('');
  const [thongBao, setThongBao] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);
  const [skuToCheck, setSkuToCheck] = useState('');
  const [tonKhoHienTai, setTonKhoHienTai] = useState(null);
  const [kiemTraThongBao, setKiemTraThongBao] = useState('');
  const [dangKiemTra, setDangKiemTra] = useState(false);
  const [xuatSku, setXuatSku] = useState('');
  const [xuatSoLuong, setXuatSoLuong] = useState('');
  const [xuatThongBao, setXuatThongBao] = useState('');
  const [dangXuLyXuat, setDangXuLyXuat] = useState(false);
  const [kiemKeSku, setKiemKeSku] = useState('');
  const [kiemKeSoLuong, setKiemKeSoLuong] = useState('');
  const [kiemKeThongBao, setKiemKeThongBao] = useState('');
  const [dangXuLyKiemKe, setDangXuLyKiemKe] = useState(false);
  const [dieuChinhThongBao, setDieuChinhThongBao] = useState('');
  const [dangXuLyDieuChinh, setDangXuLyDieuChinh] = useState(false);
  const [kiemKeResultForAdj, setKiemKeResultForAdj] = useState(null);

  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  // Các hàm xử lý (giữ nguyên như cũ)
  const xuLyKiemTraTonKho = useCallback(async (skuParam = skuToCheck) => {
    if (!skuParam) { setKiemTraThongBao('Vui lòng nhập SKU cần kiểm tra.'); return; }
    setDangKiemTra(true); setKiemTraThongBao('Đang kiểm tra...'); setTonKhoHienTai(null);
    try {
      const phanHoi = await fetch(`http://localhost:3001/api/tonkho/${skuParam}`);
      const ketQua = await phanHoi.json();
      if (phanHoi.ok && ketQua.success) { 
        setTonKhoHienTai(ketQua.soLuong); 
        setKiemTraThongBao(''); 
      } else { 
        setKiemTraThongBao(`Lỗi ${phanHoi.status}: ${ketQua.message || 'Lỗi không xác định'}`); 
        setTonKhoHienTai(null); 
      }
    } catch (error) { 
      console.error('Lỗi API kiểm tra tồn kho:', error); 
      setKiemTraThongBao('Lỗi kết nối.'); 
      setTonKhoHienTai(null); 
    } finally { 
      setDangKiemTra(false); 
    }
  }, [skuToCheck]);

  const handleAuthError = (status, message, logoutFn, navigateFn) => {
    if (status === 401 || status === 403) {
      alert(`Lỗi xác thực (${status}): ${message}\nVui lòng đăng nhập lại.`);
      logoutFn();
      navigateFn('/login');
      return true;
    }
    return false;
  };

  const xuLyNhapKho = async (event) => {
    event.preventDefault(); 
    setDangXuLy(true); 
    setThongBao('Đang xử lý...');
    const token = authState.token;
    if (!token) { setThongBao('Lỗi: Chưa đăng nhập.'); setDangXuLy(false); return; }

    try {
      const response = await fetch('http://localhost:3001/api/nhapkho', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ sku: sku, soLuong: parseInt(soLuong) }),
      });
      const ketQua = await response.json();

      if (handleAuthError(response.status, ketQua.message, logout, navigate)) return;

      if (response.ok && ketQua.success) {
        setThongBao(`✅ ${ketQua.message}`);
        setSku(''); 
        setSoLuong('');
        if(sku === skuToCheck) { xuLyKiemTraTonKho(sku); }
      } else {
        setThongBao(`❌ ${ketQua.message || 'Không thể nhập kho.'}`);
      }
    } catch (error) { 
      console.error('Lỗi API nhập kho:', error); 
      setThongBao('❌ Lỗi kết nối.'); 
    } finally { 
      setDangXuLy(false); 
    }
  };

  const xuLyXuatKho = async (event) => {
    event.preventDefault(); 
    setDangXuLyXuat(true); 
    setXuatThongBao('Đang xử lý...');
    const token = authState.token;
    if (!token) { setXuatThongBao('Lỗi: Chưa đăng nhập.'); setDangXuLyXuat(false); return; }

    try {
      const response = await fetch('http://localhost:3001/api/xuatkho', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ sku: xuatSku, soLuong: parseInt(xuatSoLuong) }),
      });
      const ketQua = await response.json();

      if (handleAuthError(response.status, ketQua.message, logout, navigate)) return;

      if (response.ok && ketQua.success) {
        setXuatThongBao(`✅ ${ketQua.message}`);
        setXuatSku(''); 
        setXuatSoLuong('');
        if(xuatSku === skuToCheck) { xuLyKiemTraTonKho(xuatSku); }
      } else {
        setXuatThongBao(`❌ ${ketQua.message || 'Không thể xuất kho.'}`);
      }
    } catch (error) { 
      console.error('Lỗi API xuất kho:', error); 
      setXuatThongBao('❌ Lỗi kết nối.'); 
    } finally { 
      setDangXuLyXuat(false); 
    }
  };

  const xuLyKiemKe = async (event) => {
    event.preventDefault(); 
    setDangXuLyKiemKe(true); 
    setKiemKeThongBao('Đang xử lý...');
    setKiemKeResultForAdj(null); 
    setDieuChinhThongBao(''); 
    setTonKhoHienTai(null); 
    setKiemTraThongBao('');
    const skuDaKiemKe = kiemKeSku; 
    const soLuongDaDem = parseInt(kiemKeSoLuong);
    const token = authState.token;
    if (!token) { 
      setKiemKeThongBao('Lỗi: Chưa đăng nhập.'); 
      setDangXuLyKiemKe(false); 
      return; 
    }

    try {
      const response = await fetch('http://localhost:3001/api/kiemke', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          sku: skuDaKiemKe, 
          soLuongDemDuoc: soLuongDaDem 
        }),
      });
      const ketQua = await response.json();

      if (handleAuthError(response.status, ketQua.message, logout, navigate)) return;

      if (response.ok && ketQua.success) {
        setKiemKeThongBao(`✅ ${ketQua.message}`);
        setKiemKeResultForAdj({ 
          sku: skuDaKiemKe, 
          soLuong: soLuongDaDem 
        });
        setKiemKeSku(''); 
        setKiemKeSoLuong('');
        xuLyKiemTraTonKho(skuDaKiemKe);
      } else {
        setKiemKeThongBao(`❌ ${ketQua.message || 'Không thể ghi nhận kiểm kê.'}`);
        setKiemKeResultForAdj(null);
      }
    } catch (error) { 
      console.error('Lỗi API kiểm kê:', error); 
      setKiemKeThongBao('❌ Lỗi kết nối.'); 
      setKiemKeResultForAdj(null); 
    } finally { 
      setDangXuLyKiemKe(false); 
    }
  };

  const xuLyDieuChinh = async () => {
    if (!kiemKeResultForAdj) { 
      setDieuChinhThongBao('❌ Không có KQ kiểm kê để điều chỉnh.'); 
      return; 
    }
    setDangXuLyDieuChinh(true); 
    setDieuChinhThongBao('Đang điều chỉnh...');
    const token = authState.token;
    if (!token) { 
      setDieuChinhThongBao('Lỗi: Chưa đăng nhập.'); 
      setDangXuLyDieuChinh(false); 
      return; 
    }

    try {
      const response = await fetch('http://localhost:3001/api/dieuchinh', {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          sku: kiemKeResultForAdj.sku, 
          soLuongMoi: kiemKeResultForAdj.soLuong, 
          lyDo: "Điều chỉnh sau kiểm kê" 
        }),
      });
      const ketQua = await response.json();

      if (handleAuthError(response.status, ketQua.message, logout, navigate)) return;

      if (response.ok && ketQua.success) {
        setDieuChinhThongBao(`✅ ${ketQua.message}`);
        xuLyKiemTraTonKho(kiemKeResultForAdj.sku);
        setKiemKeResultForAdj(null);
      } else {
        setDieuChinhThongBao(`❌ ${ketQua.message || 'Không thể điều chỉnh.'}`);
      }
    } catch (error) { 
      console.error('Lỗi API điều chỉnh:', error); 
      setDieuChinhThongBao('❌ Lỗi kết nối.'); 
    } finally { 
      setDangXuLyDieuChinh(false); 
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: 'background.default',
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          mb: 4,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <InventoryIcon sx={{ mr: 1, fontSize: '2rem' }} />
        Quản lý Kho
      </Typography>
      
      {/* Phần Kiểm tra & Kiểm kê */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader 
          icon={<SearchIcon color="primary" />}
          title="Kiểm Kho" 
        />
        
        <Grid container spacing={3}>
          {/* Kiểm tra tồn kho */}
          <Grid item xs={12} md={6}>
            <ActionCard>
              <Box padding={4} component="form" onSubmit={(e) => { e.preventDefault(); xuLyKiemTraTonKho(); }}>
                <TextField
                  fullWidth
                  label="SKU sản phẩm"
                  variant="outlined"
                  value={skuToCheck}
                  onChange={(e) => setSkuToCheck(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => xuLyKiemTraTonKho()}
                          edge="end"
                          color="primary"
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                
                {dangKiemTra && <LinearProgress sx={{ mb: 2 }} />}
                
                {tonKhoHienTai !== null && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Tồn kho hiện tại: <strong>{tonKhoHienTai}</strong>
                  </Alert>
                )}
                
                {kiemTraThongBao && (
                  <Alert severity={kiemTraThongBao.includes('Lỗi') ? 'error' : 'success'}>
                    {kiemTraThongBao}
                  </Alert>
                )}
              </Box>
            </ActionCard>
          </Grid>
          
          {/* Kiểm kê */}
          <Grid item xs={12} md={6}>
            <ActionCard>
              <Box component="form" onSubmit={xuLyKiemKe}>
                <TextField
                  fullWidth
                  label="SKU kiểm kê"
                  variant="outlined"
                  value={kiemKeSku}
                  onChange={(e) => setKiemKeSku(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Số lượng thực tế"
                  variant="outlined"
                  type="number"
                  value={kiemKeSoLuong}
                  onChange={(e) => setKiemKeSoLuong(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  type="submit"
                  disabled={dangXuLyKiemKe}
                  startIcon={<CompareArrowsIcon />}
                >
                  {dangXuLyKiemKe ? 'Đang kiểm kê...' : 'Ghi nhận kiểm kê'}
                </Button>
                
                {dangXuLyKiemKe && <LinearProgress sx={{ mt: 2 }} />}
                
                {kiemKeThongBao && (
                  <Alert severity={kiemKeThongBao.includes('Lỗi') ? 'error' : 'success'} sx={{ mt: 2 }}>
                    {kiemKeThongBao}
                  </Alert>
                )}
                
                {kiemKeResultForAdj && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      Chênh lệch: {tonKhoHienTai !== null ? 
                        (kiemKeResultForAdj.soLuong - tonKhoHienTai) : 'N/A'}
                    </Alert>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      color="warning"
                      onClick={xuLyDieuChinh}
                      disabled={dangXuLyDieuChinh}
                    >
                      {dangXuLyDieuChinh ? 'Đang điều chỉnh...' : 'Điều chỉnh tồn kho'}
                    </Button>
                    
                    {dieuChinhThongBao && (
                      <Alert 
                        severity={dieuChinhThongBao.includes('Lỗi') ? 'error' : 'success'}
                        sx={{ mt: 2 }}
                      >
                        {dieuChinhThongBao}
                      </Alert>
                    )}
                  </Box>
                )}
              </Box>
            </ActionCard>
          </Grid>
        </Grid>
      </Box>

      {/* Phần Nhập/Xuất kho */}
      <Box padding={4} color={'darkblue'}>
        <SectionHeader 
          icon={<CompareArrowsIcon color="primary" />}
          title="Giao Dịch"
          padding="40px"
        />
        
        <Grid container spacing={3}>
          {/* Nhập kho */}
          <Grid item xs={12} md={6}>
            <ActionCard>
              <Box component="form" onSubmit={xuLyNhapKho}>
                <TextField
                  fullWidth
                  label="SKU nhập kho"
                  variant="outlined"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Số lượng nhập"
                  variant="outlined"
                  type="number"
                  value={soLuong}
                  onChange={(e) => setSoLuong(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  type="submit"
                  disabled={dangXuLy}
                  startIcon={<InventoryIcon />}
                >
                  {dangXuLy ? 'Đang xử lý...' : 'Nhập kho'}
                </Button>
                
                {dangXuLy && <LinearProgress sx={{ mt: 2 }} />}
                
                {thongBao && (
                  <Alert 
                    severity={thongBao.includes('Lỗi') ? 'error' : 'success'}
                    sx={{ mt: 2 }}
                  >
                    {thongBao}
                  </Alert>
                )}
              </Box>
            </ActionCard>
          </Grid>
          
          {/* Xuất kho */}
          <Grid item xs={12} md={6}>
            <ActionCard>
              <Box component="form" onSubmit={xuLyXuatKho}>
                <TextField
                  fullWidth
                  label="SKU xuất kho"
                  variant="outlined"
                  value={xuatSku}
                  onChange={(e) => setXuatSku(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Số lượng xuất"
                  variant="outlined"
                  type="number"
                  value={xuatSoLuong}
                  onChange={(e) => setXuatSoLuong(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <Button 
                  fullWidth 
                  variant="contained" 
                  type="submit"
                  disabled={dangXuLyXuat}
                  startIcon={<InventoryIcon />}
                >
                  {dangXuLyXuat ? 'Đang xử lý...' : 'Xuất kho'}
                </Button>
                
                {dangXuLyXuat && <LinearProgress sx={{ mt: 2 }} />}
                
                {xuatThongBao && (
                  <Alert 
                    severity={xuatThongBao.includes('Lỗi') ? 'error' : 'success'}
                    sx={{ mt: 2 }}
                  >
                    {xuatThongBao}
                  </Alert>
                )}
              </Box>
            </ActionCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default KhoPage;