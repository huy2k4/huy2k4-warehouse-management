// client/src/components/XuatKhoSection.js - Sử dụng Material UI
import React from 'react';
import { styled } from '@mui/material/styles';

// <<< Import MUI Components >>>
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InventoryIcon from '@mui/icons-material/Inventory';
import NumbersIcon from '@mui/icons-material/Numbers';
// <<< Kết thúc Import >>>

// Styled component cho phần header
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

// Component này nhận props từ KhoPage.js
function XuatKhoSection({
  xuatSku, setXuatSku,
  xuatSoLuong, setXuatSoLuong,
  xuatThongBao, dangXuLyXuat,
  handleXuatKhoSubmit
}) {
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
        XUẤT KHO HÀNG HÓA
      </SectionHeader>
      
      <Box 
        component="form" 
        onSubmit={handleXuatKhoSubmit} 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5
        }}
      >
        <OutlinedInput
          fullWidth
          id="sku-xuat"
          placeholder="Nhập mã SKU"
          value={xuatSku}
          onChange={(e) => setXuatSku(e.target.value)}
          disabled={dangXuLyXuat}
          startAdornment={
            <InputAdornment position="start">
              <InventoryIcon color="action" />
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
        
        <OutlinedInput
          fullWidth
          id="soluong-xuat"
          placeholder="Số lượng xuất"
          type="number"
          value={xuatSoLuong}
          onChange={(e) => setXuatSoLuong(e.target.value)}
          disabled={dangXuLyXuat}
          inputProps={{ min: 1 }}
          startAdornment={
            <InputAdornment position="start">
              <NumbersIcon color="action" />
            </InputAdornment>
          }
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
          }}
        />
        
        {xuatThongBao && (
          <Alert 
            severity={xuatThongBao.startsWith('Lỗi') ? "error" : "success"} 
            sx={{ 
              mt: 1,
              borderRadius: 1,
              alignItems: 'center'
            }}
          >
            {xuatThongBao}
          </Alert>
        )}
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={dangXuLyXuat}
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, 0.2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF5252 30%, #FF7043 90%)',
            },
          }}
        >
          {dangXuLyXuat ? (
            <CircularProgress size={24} sx={{ color: 'common.white' }} />
          ) : (
            'XÁC NHẬN XUẤT KHO'
          )}
        </Button>
      </Box>
    </Paper>
  );
}

export default XuatKhoSection;