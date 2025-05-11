// client/src/components/KiemTraTonKhoSection.js - Sử dụng Material UI
import React from 'react';
import { styled } from '@mui/material/styles';

// <<< Import MUI Components >>>
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
// <<< Kết thúc Import >>>

// Sử dụng lại styled component từ các section trước
const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:before, &:after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: theme.spacing(0, 2),
  },
}));

// Styled component cho kết quả tồn kho
const TonKhoResult = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
  fontWeight: 500,
  '& strong': {
    margin: theme.spacing(0, 0.5),
    fontSize: '1.1rem',
  },
}));

function KiemTraTonKhoSection({
  skuToCheck, setSkuToCheck,
  tonKhoHienTai, kiemTraThongBao,
  dangKiemTra, handleKiemTraTonKho
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    handleKiemTraTonKho();
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        padding: 4, 
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)'
      }}
    >
      <SectionHeader variant="h6" component="h3">
        KIỂM TRA TỒN KHO
      </SectionHeader>
      
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5
        }}
      >
        <OutlinedInput
          fullWidth
          id="sku-kiemtra"
          placeholder="Nhập SKU cần kiểm tra"
          value={skuToCheck}
          onChange={(e) => setSkuToCheck(e.target.value)}
          disabled={dangKiemTra}
          startAdornment={
            <InputAdornment position="start">
              <InventoryIcon color="action" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon color="action" />
            </InputAdornment>
          }
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            },
          }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={dangKiemTra}
          sx={{
            py: 1.5,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, 0.2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #03A9F4 90%)',
            },
          }}
        >
          {dangKiemTra ? (
            <CircularProgress size={24} sx={{ color: 'common.white' }} />
          ) : (
            'KIỂM TRA TỒN KHO'
          )}
        </Button>

        {/* Hiển thị thông báo lỗi */}
        {kiemTraThongBao && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 1,
              alignItems: 'center'
            }}
          >
            {kiemTraThongBao}
          </Alert>
        )}

        {/* Hiển thị kết quả tồn kho */}
        {!kiemTraThongBao && tonKhoHienTai !== null && (
          <TonKhoResult>
            <InventoryIcon sx={{ mr: 1 }} />
            Tồn kho của <strong>{skuToCheck}</strong> là: <strong>{tonKhoHienTai}</strong>
          </TonKhoResult>
        )}
      </Box>
    </Paper>
  );
}

export default KiemTraTonKhoSection;