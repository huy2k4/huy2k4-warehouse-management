// client/src/components/LichSuGiaoDichSection.js
import React from 'react';
import {
  Button,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Link,
  CircularProgress,
  Collapse,
  Divider,
  Tooltip,
  Zoom
} from '@mui/material';
import {
  Refresh,
  ExpandMore,
  ExpandLess,
  Receipt,
  CheckCircle,
  Error,
  SwapHoriz,
  ArrowUpward,
  ArrowDownward,
  Edit,
  Cached,
  LocalAtm,
  AttachMoney
} from '@mui/icons-material';

function LichSuGiaoDichSection(props) {
  const { lichSuGiaoDich, dangTaiLichSu, lichSuThongBao, handleTaiLichSu } = props;
  const [expandedId, setExpandedId] = React.useState(null);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTransactionIcon = (moTa) => {
    if (!moTa) return <SwapHoriz />;
    
    const lowerMoTa = moTa.toLowerCase();
    
    if (lowerMoTa.includes('xuất') || lowerMoTa.includes('gửi đi')) {
      return <ArrowUpward />;
    } else if (lowerMoTa.includes('nhập') || lowerMoTa.includes('nhận được')) {
      return <ArrowDownward />;
    } else if (lowerMoTa.includes('chỉnh sửa') || lowerMoTa.includes('cập nhật')) {
      return <Edit />;
    } else if (lowerMoTa.includes('hoàn tiền') || lowerMoTa.includes('refund')) {
      return <Cached />;
    } else if (lowerMoTa.includes('thanh toán') || lowerMoTa.includes('payment')) {
      return <LocalAtm />;
    } else if (lowerMoTa.includes('chuyển') || lowerMoTa.includes('transfer')) {
      return <AttachMoney />;
    }
    
    return <SwapHoriz />;
  };

  const getAvatarColor = (status, moTa) => {
    if (status !== 'success') return '#f44336';
    
    const lowerMoTa = moTa?.toLowerCase() || '';
    if (lowerMoTa.includes('xuất') || lowerMoTa.includes('gửi đi')) {
      return '#ff7043'; // Cam đậm
    } else if (lowerMoTa.includes('nhập') || lowerMoTa.includes('nhận được')) {
      return '#66bb6a'; // Xanh lá
    } else if (lowerMoTa.includes('chỉnh sửa') || lowerMoTa.includes('cập nhật')) {
      return '#29b6f6'; // Xanh dương
    }
    
    return '#29b6f6'; // Xanh lá mặc định
  };

  return (
    <Paper elevation={6} sx={{ 
      padding: 3, 
      margin: '40px auto', 
      maxWidth: '900px',
      backgroundColor: '#2d2d2d', // Màu nền tối nhẹ
      borderRadius: '12px',
      border: '1px solid #383838' // Viền tối
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ 
          fontWeight: 600,
          color: '#e0e0e0', // Màu chữ sáng nhẹ
        }}>
          Lịch Sử Giao Dịch
        </Typography>
        <Tooltip title="Làm mới dữ liệu" TransitionComponent={Zoom}>
          <Button
            onClick={handleTaiLichSu}
            disabled={dangTaiLichSu}
            variant="contained"
            startIcon={dangTaiLichSu ? <CircularProgress size={20} /> : <Refresh />}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              backgroundColor: '#424242', // Màu nút tối
              color: '#e0e0e0', // Màu chữ sáng
              '&:hover': {
                backgroundColor: '#535353' // Màu hover
              }
            }}
          >
            {dangTaiLichSu ? 'Đang tải...' : 'Làm mới'}
          </Button>
        </Tooltip>
      </Box>

      {lichSuThongBao && (
        <Collapse in={!!lichSuThongBao}>
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: '8px',
              backgroundColor: lichSuThongBao.startsWith('Lỗi') ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)',
              borderLeft: `4px solid ${lichSuThongBao.startsWith('Lỗi') ? '#f44336' : '#ff9800'}`
            }}
          >
            <Typography
              variant="body1"
              color={lichSuThongBao.startsWith('Lỗi') ? 'error' : 'warning'}
              display="flex"
              alignItems="center"
              gap={1}
            >
              {lichSuThongBao.startsWith('Lỗi') ? <Error /> : <CheckCircle />}
              {lichSuThongBao}
            </Typography>
          </Box>
        </Collapse>
      )}

      <Box sx={{ 
        maxHeight: '600px', 
        overflowY: 'auto',
        pr: 1,
        '&::-webkit-scrollbar': {
          display: 'none' // Ẩn thanh cuộn
        }
      }}>
        {lichSuGiaoDich.map((item, index) => (
          <Zoom in={true} key={item.transactionHash + index} style={{ transitionDelay: `${index * 50}ms` }}>
            <Card sx={{ 
              mb: 2, 
              borderRadius: '10px',
              backgroundColor: '#383838', // Màu thẻ tối
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                '& .transaction-header': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)' // Hiệu ứng hover nhẹ
                }
              }
            }}>
              <Box className="transaction-header">
                <CardHeader
                  avatar={
                    <Avatar sx={{ 
                      bgcolor: getAvatarColor(item.status || 'success', item.moTa),
                      boxShadow: `0 0 10px ${getAvatarColor(item.status || 'success', item.moTa)}80`
                    }}>
                      {getTransactionIcon(item.moTa)}
                    </Avatar>
                  }
                  action={
                    <IconButton
                      onClick={() => handleExpandClick(index)}
                      aria-expanded={expandedId === index}
                      aria-label="show more"
                      sx={{
                        color: '#b0b0b0', // Màu icon
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#ffffff'
                        }
                      }}
                    >
                      {expandedId === index ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  }
                  title={
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#e0e0e0' }}>
                      {item.moTa}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="caption" color="#a0a0a0">
                      Block: {item.blockNumber} • {new Date(item.timestamp || Date.now()).toLocaleString()}
                    </Typography>
                  }
                />
              </Box>
              
              <Collapse in={expandedId === index} timeout="auto" unmountOnExit>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
                <CardContent sx={{ pt: 1 }}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="body2" color="#b0b0b0">
                      <strong>TxHash:</strong>{' '}
                      <Link 
                        href={`#${item.transactionHash}`} 
                        target="_blank" 
                        rel="noopener"
                        sx={{ 
                          color: '#90caf9',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: '#bbdefb'
                          }
                        }}
                      >
                        {item.transactionHash}
                      </Link>
                    </Typography>
                    {item.from && (
                      <Typography variant="body2" color="#b0b0b0">
                        <strong>From:</strong> {item.from}
                      </Typography>
                    )}
                    {item.to && (
                      <Typography variant="body2" color="#b0b0b0">
                        <strong>To:</strong> {item.to}
                      </Typography>
                    )}
                    {item.value && (
                      <Typography variant="body2" color="#b0b0b0">
                        <strong>Value:</strong> {item.value}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          </Zoom>
        ))}
      </Box>
    </Paper>
  );
}

export default LichSuGiaoDichSection;