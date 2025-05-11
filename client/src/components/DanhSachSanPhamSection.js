// client/src/components/DanhSachSanPhamSection.js - Phiên bản cải tiến

import React, { useState, useEffect, useCallback } from 'react';
import SuaSanPhamModal from './SuaSanPhamModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import MUI Components & Icons
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InventoryIcon from '@mui/icons-material/Inventory';
import { styled } from '@mui/material/styles';
import { lightBlue, green, orange, red } from '@mui/material/colors';

// Styled Components
const StyledTableContainer = styled(TableContainer)({
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  borderRadius: '12px',
  overflow: 'hidden'
});

const StatusBadge = styled('span')(({ active }) => ({
  padding: '4px 8px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: '600',
  backgroundColor: active ? green[100] : red[100],
  color: active ? green[800] : red[800]
}));

const HighlightCell = styled(TableCell)({
  fontWeight: '600',
  color: lightBlue[800]
});

function DanhSachSanPhamSection() {
    // === State ===
    const [danhSachSP, setDanhSachSP] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [togglingSku, setTogglingSku] = useState(null);
    const [closingSku, setClosingSku] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    // =================

    // === Hooks ===
    const { authState, logout } = useAuth();
    const navigate = useNavigate();
    // =============

    // === Hàm Fetch Data ===
    const fetchData = useCallback(async () => {
        setLoading(true); 
        setError(null); 
        setActionError(null);
        
        try {
            const response = await fetch('http://localhost:3001/api/sanpham');
            if (!response.ok) { 
                throw new Error(`HTTP error! status: ${response.status}`); 
            }
            
            const data = await response.json();
            if (data.success) {
                setDanhSachSP(data.danhSachSanPham);
            } else { 
                setError(data.message || 'Lỗi khi tải dữ liệu từ server.'); 
            }
        } catch (e) { 
            setError('Không thể kết nối đến server. Vui lòng thử lại.'); 
            console.error("Fetch error:", e); 
        } finally { 
            setLoading(false); 
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);
    // ====================

    // === Handlers ===
    const handleRefresh = () => { 
        setSuccessMessage(null);
        fetchData(); 
    };

    const handleEditClick = (sku) => {
        const product = danhSachSP.find(sp => sp.sku === sku);
        if (product) { 
            setActionError(null); 
            setEditingProduct(product); 
            setIsModalOpen(true); 
        } else { 
            setActionError("Không tìm thấy sản phẩm để chỉnh sửa."); 
        }
    };

    const handleCloseModal = () => { 
        setIsModalOpen(false); 
        setEditingProduct(null); 
    };

    const handleSaveSuccess = () => { 
        handleCloseModal(); 
        fetchData(); 
        setSuccessMessage('Cập nhật sản phẩm thành công!');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleAuthError = (status, message) => {
        if (status === 401 || status === 403) {
            alert(`Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.`);
            logout(); 
            navigate('/login'); 
            return true;
        } 
        return false;
    }

    const handleToggleActiveClick = async (sku, currentIsActive) => {
        const newState = !currentIsActive;
        setTogglingSku(sku); 
        setActionError(null);
        
        const token = authState.token;
        if (!token) { 
            setActionError('Vui lòng đăng nhập để thực hiện thao tác này.'); 
            setTogglingSku(null); 
            return; 
        }

        try {
            const response = await fetch(`http://localhost:3001/api/sanpham/${sku}/active`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ isActive: newState }),
            });
            
            const data = await response.json();
            
            if (handleAuthError(response.status, data.message)) { 
                setTogglingSku(null); 
                return; 
            }
            
            if (response.ok && data.success) { 
                fetchData(); 
                setSuccessMessage(`Đã ${newState ? 'kích hoạt' : 'ngừng kinh doanh'} sản phẩm thành công.`);
                setTimeout(() => setSuccessMessage(null), 3000);
            } else { 
                setActionError(data.message || 'Có lỗi xảy ra khi thay đổi trạng thái.'); 
            }
        } catch (error) { 
            setActionError('Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.'); 
            console.error("Network error:", error); 
        } finally { 
            setTogglingSku(null); 
        }
    };

    const handleKetThucKyClick = async (sku) => {
        setClosingSku(sku); 
        setActionError(null);
        const token = authState.token;
        
        if (!token) { 
            setActionError('Vui lòng đăng nhập để thực hiện thao tác này.'); 
            setClosingSku(null); 
            return; 
        }

        try {
            const response = await fetch(`http://localhost:3001/api/sanpham/${sku}/ketthucky`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
            });
            
            const data = await response.json();

            if (handleAuthError(response.status, data.message)) { 
                setClosingSku(null); 
                return; 
            }

            if (response.ok && data.success) {
                fetchData();
                setSuccessMessage(`Đã chốt kỳ thành công cho sản phẩm ${sku}. Số lượng tồn: ${data.snapshot.balance}`);
                setTimeout(() => setSuccessMessage(null), 5000);
            } else {
                setActionError(data.message || 'Có lỗi xảy ra khi chốt kỳ.');
            }
        } catch (error) {
            setActionError('Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.');
            console.error("Lỗi mạng khi chốt kỳ:", error);
        } finally {
            setClosingSku(null);
        }
    };
    // =================

    return (
        <Box sx={{ 
            p: 3, 
            backgroundColor: '#f9fafc',
            minHeight: '100vh'
        }}>
            <Paper sx={{ 
                p: 3, 
                borderRadius: 2,
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)'
            }}>
                {/* Tiêu đề và nút Refresh */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <InventoryIcon color="primary" fontSize="large" />
                        <Typography variant="h5" component="h1" sx={{ 
                            fontWeight: '600',
                            color: 'primary.main'
                        }}>
                            Quản lý tồn kho sản phẩm
                        </Typography>
                    </Box>
                    
                    <Button
                        variant="contained"
                        onClick={handleRefresh}
                        disabled={loading || !!togglingSku || !!closingSku}
                        startIcon={loading ? <CircularProgress size={20} color="inherit"/> : <RefreshIcon />}
                        sx={{
                            minWidth: '120px'
                        }}
                    >
                        {loading ? 'Đang tải...' : 'Làm mới'}
                    </Button>
                </Box>

                {/* Hiển thị thông báo */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}
                
                {actionError && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {actionError}
                    </Alert>
                )}
                
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
                        {successMessage}
                    </Alert>
                )}

                {/* Bảng hiển thị */}
                <StyledTableContainer>
                    <Table sx={{ minWidth: 1200 }} aria-label="danh sách sản phẩm">
                        <TableHead sx={{ 
                            backgroundColor: lightBlue[50],
                            '& th': {
                                fontWeight: '600',
                                color: lightBlue[800]
                            }
                        }}>
                            <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>Tên Sản Phẩm</TableCell>
                                <TableCell>Mô Tả</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="right">Đầu kỳ</TableCell>
                                <TableCell align="right">Cuối kỳ</TableCell>
                                <TableCell align="center">Thời gian chốt</TableCell>
                                <TableCell align="center" sx={{ width: '180px' }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        
                        <TableBody>
                            {loading && danhSachSP.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                                        <CircularProgress />
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            Đang tải dữ liệu...
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : danhSachSP.length > 0 ? (
                                danhSachSP.map((sp) => (
                                    <TableRow
                                        key={sp.sku}
                                        hover
                                        sx={{ 
                                            '&:last-child td': { border: 0 },
                                            opacity: sp.active ? 1 : 0.7,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontWeight: '500' }}>
                                            {sp.sku}
                                        </TableCell>
                                        
                                        <TableCell sx={{ fontWeight: '500' }}>
                                            {sp.ten}
                                        </TableCell>
                                        
                                        <TableCell sx={{ 
                                            maxWidth: '300px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {sp.moTa || 'Không có mô tả'}
                                        </TableCell>
                                        
                                        <TableCell align="center">
                                            <StatusBadge active={sp.active}>
                                                {sp.active ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                                            </StatusBadge>
                                        </TableCell>
                                        
                                        <HighlightCell align="right">
                                            {sp.latestSnapshotBalance ?? '-'}
                                        </HighlightCell>
                                        
                                        <HighlightCell align="right">
                                            {sp.tonKhoHienTai ?? '-'}
                                        </HighlightCell>
                                        
                                        <TableCell align="center" sx={{ 
                                            color: 'text.secondary',
                                            fontSize: '0.875rem'
                                        }}>
                                            {sp.latestSnapshotTimestamp
                                                ? new Date(sp.latestSnapshotTimestamp).toLocaleString('vi-VN')
                                                : 'Chưa chốt kỳ'}
                                        </TableCell>
                                        
                                        <TableCell align="center">
                                            <Box sx={{ 
                                                display: 'flex', 
                                                justifyContent: 'center', 
                                                gap: 1,
                                                flexWrap: 'wrap'
                                            }}>
                                                {/* Nút Sửa (admin) */}
                                                {authState.isAuthenticated && authState.user?.role === 'admin' && (
                                                    <Tooltip title="Sửa thông tin">
                                                        <IconButton 
                                                            color="warning" 
                                                            onClick={() => handleEditClick(sp.sku)} 
                                                            disabled={!sp.active || togglingSku === sp.sku || closingSku === sp.sku}
                                                            size="small"
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                
                                                {/* Nút Active/Inactive (admin) */}
                                                {authState.isAuthenticated && authState.user?.role === 'admin' && (
                                                    <Tooltip title={sp.active ? "Ngừng kinh doanh" : "Kích hoạt"}>
                                                        <IconButton 
                                                            color={sp.active ? "error" : "success"} 
                                                            onClick={() => handleToggleActiveClick(sp.sku, sp.active)} 
                                                            disabled={togglingSku === sp.sku || closingSku === sp.sku}
                                                            size="small"
                                                        >
                                                            {togglingSku === sp.sku ? (
                                                                <CircularProgress size={20} color="inherit"/>
                                                            ) : sp.active ? (
                                                                <ToggleOffIcon fontSize="small" />
                                                            ) : (
                                                                <ToggleOnIcon fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                
                                                {/* Nút Kết thúc kỳ (admin + thủ kho) */}
                                                {authState.isAuthenticated && ['admin', 'thukho'].includes(authState.user?.role) && (
                                                    <Tooltip title="Chốt tồn kho cuối kỳ">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() => handleKetThucKyClick(sp.sku)}
                                                            disabled={closingSku === sp.sku || togglingSku === sp.sku || !sp.active}
                                                            size="small"
                                                        >
                                                            {closingSku === sp.sku ? (
                                                                <CircularProgress size={20} color="inherit"/>
                                                            ) : (
                                                                <AccessTimeIcon fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            Không có sản phẩm nào được tìm thấy.
                                        </Typography>
                                        <Button 
                                            variant="outlined" 
                                            onClick={handleRefresh}
                                            sx={{ mt: 2 }}
                                        >
                                            Thử lại
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </Paper>

            <SuaSanPhamModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                productToEdit={editingProduct} 
                onSaveSuccess={handleSaveSuccess} 
            />
        </Box>
    );
}

export default DanhSachSanPhamSection;