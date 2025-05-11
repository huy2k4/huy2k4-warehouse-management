// client/src/pages/LoginPage.js - Dark Mode hoàn chỉnh

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

// Material UI Components
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Container, 
  Alert, 
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';

// Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Custom styled components
const LoginContainer = styled(Container)({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  background: `
    radial-gradient(circle at 10% 20%, rgba(15, 30, 60, 0.9) 0%, rgba(5, 15, 35, 1) 90%),
    url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')
  `,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: 'multiply'
});

const LoginCard = styled(motion.div)(({ theme }) => ({
  width: '100%',
  maxWidth: '500px',
  backgroundColor: 'rgba(25, 35, 55, 0.9)',
  borderRadius: '16px',
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
  padding: '50px 40px',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.08)'
}));

// Custom TextField style
const DarkTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'rgba(20, 30, 45, 0.8)',
    color: '#e0e0e0',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(77, 171, 245, 0.4)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4dabf5',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(200, 200, 200, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#4dabf5',
  },
  '& .MuiInputBase-input': {
    color: '#f0f0f0',
  }
});

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        console.log("Attempting login with:", username);

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                 console.log("Login successful:", data);
                 login(data.token, data.user);
                 navigate('/');
            } else {
                 setError(data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
                 console.error("Login failed:", data.message);
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
            console.error("Network or server error during login:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <LoginContainer maxWidth={false}>
            <LoginCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <WarehouseIcon sx={{ 
                        fontSize: 50, 
                        color: '#4dabf5',
                        background: 'rgba(77, 171, 245, 0.1)',
                        padding: '10px',
                        borderRadius: '12px',
                        mb: 2
                    }} />
                    <Typography variant="h5" component="h1" sx={{ 
                        fontWeight: 'bold',
                        color: '#e0e0e0',
                        mb: 1
                    }}>
                        QUẢN LÝ KHO THÔNG MINH
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(200, 200, 200, 0.7)' }}>
                        Đăng nhập để truy cập hệ thống
                    </Typography>
                </Box>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <DarkTextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Tên đăng nhập"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={loading}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <PersonOutlineIcon sx={{ color: 'rgba(200, 200, 200, 0.7)' }} />
                            </InputAdornment>
                        ),
                        }}
                        // Thêm inputProps để tắt autocomplete trên một số trình duyệt
                        inputProps={{
                        autocomplete: 'new-username', // Chrome ignore
                        form: {
                            autocomplete: 'off', // Firefox ignore
                        },
                        }}
                    />
                    
                    <DarkTextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <LockOutlinedIcon sx={{ color: 'rgba(200, 200, 200, 0.7)' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                edge="end"
                                sx={{ color: 'rgba(200, 200, 200, 0.7)' }}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        ),
                        }}
                        // Thêm inputProps để tắt autocomplete trên một số trình duyệt
                        inputProps={{
                        autocomplete: 'new-password', // Chrome ignore
                        form: {
                            autocomplete: 'off', // Firefox ignore
                        },
                        }}
                    />
                    
                    {error && (
                        <Alert severity="error" sx={{ 
                            mt: 2, 
                            borderRadius: '8px',
                            backgroundColor: 'rgba(211, 47, 47, 0.2)',
                            color: '#ffcdd2',
                            '& .MuiAlert-icon': {
                                color: '#ffcdd2'
                            }
                        }}>
                            {error}
                        </Alert>
                    )}
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            py: 1.5,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #4dabf5 0%, #1769aa 100%)',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 5px 15px rgba(33, 150, 243, 0.4)',
                                background: 'linear-gradient(135deg, #4dabf5 0%, #2196f3 100%)',
                            },
                            '&:disabled': {
                                background: 'rgba(77, 171, 245, 0.5)',
                                color: 'rgba(255, 255, 255, 0.5)'
                            },
                            transition: 'all 0.3s ease',
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'ĐĂNG NHẬP'}
                    </Button>
                </Box>
            </LoginCard>
        </LoginContainer>
    );
}

export default LoginPage;