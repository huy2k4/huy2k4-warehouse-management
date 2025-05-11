// client/src/components/NhapKhoSection.js - Sử dụng Material UI
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
import InventoryIcon from '@mui/icons-material/Inventory';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// <<< Kết thúc Import >>>

// Sử dụng lại styled component từ XuatKhoSection
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

function NhapKhoSection({
  sku, setSku,
  soLuong, setSoLuong,
  thongBao, dangXuLy,
  handleNhapKhoSubmit
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
        NHẬP KHO HÀNG HÓA
      </SectionHeader>
      
      <Box 
        component="form" 
        onSubmit={handleNhapKhoSubmit} 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5
        }}
      >
        <OutlinedInput
          fullWidth
          id="sku-nhap"
          placeholder="Nhập mã SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          disabled={dangXuLy}
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
          id="soluong-nhap"
          placeholder="Số lượng nhập"
          type="number"
          value={soLuong}
          onChange={(e) => setSoLuong(e.target.value)}
          disabled={dangXuLy}
          inputProps={{ min: 1 }}
          startAdornment={
            <InputAdornment position="start">
              <AddCircleOutlineIcon color="action" />
            </InputAdornment>
          }
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
          }}
        />
        
        {thongBao && (
          <Alert 
            severity={thongBao.startsWith('Lỗi') ? "error" : "success"} 
            sx={{ 
              mt: 1,
              borderRadius: 1,
              alignItems: 'center'
            }}
          >
            {thongBao}
          </Alert>
        )}
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={dangXuLy}
          sx={{
            mt: 1,
            py: 1.5,
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)',
            boxShadow: '0 3px 5px 2px rgba(76, 175, 80, 0.2)',
            '&:hover': {
              background: 'linear-gradient(45deg, #43A047 30%, #5CB85C 90%)',
            },
          }}
        >
          {dangXuLy ? (
            <CircularProgress size={24} sx={{ color: 'common.white' }} />
          ) : (
            'XÁC NHẬN NHẬP KHO'
          )}
        </Button>
      </Box>
    </Paper>
  );
}

export default NhapKhoSection;