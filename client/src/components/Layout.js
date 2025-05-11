import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
    const { authState, logout } = useAuth();
    const navigate = useNavigate();

    const navLinkStyles = ({ isActive }) => {
        return {
            padding: '12px 20px',
            borderRadius: '8px',
            color: isActive ? '#ffffff' : '#e0e0e0',
            backgroundColor: isActive ? 'rgba(97, 218, 251, 0.2)' : 'transparent',
            textDecoration: 'none',
            fontWeight: isActive ? '600' : '500',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            margin: '0 5px',
            fontSize: '15px'
        };
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f7fa' }}>
            {/* Modern Navigation Bar */}
            <nav style={{
                background: 'linear-gradient(135deg, #20232a 0%, #282c34 100%)',
                padding: '0 10px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '70px'
                }}>
                    {/* Logo & Main Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <NavLink to="/" style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginRight: '40px',
                            textDecoration: 'none'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(45deg, #61dafb, #21a1f1)',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '12px',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                📦
                            </div>
                            <span style={{
                                color: 'white',
                                fontSize: '20px',
                                fontWeight: '600',
                                background: 'linear-gradient(90deg, #61dafb, #21a1f1)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                KHO BLOCKCHAIN
                            </span>
                        </NavLink>

                        <div style={{ display: 'flex' }}>
                            <NavLink to="/san-pham" style={navLinkStyles}>
                                <i className="fas fa-box" style={{ marginRight: '8px' }}></i>
                                Sản Phẩm
                            </NavLink>
                            <NavLink to="/kho" style={navLinkStyles}>
                                <i className="fas fa-warehouse" style={{ marginRight: '8px' }}></i>
                                Quản Lý Kho
                            </NavLink>
                            <NavLink to="/lich-su" style={navLinkStyles}>
                                <i className="fas fa-history" style={{ marginRight: '8px' }}></i>
                                Lịch Sử
                            </NavLink>
                        </div>
                    </div>

                    {/* Auth Section */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {authState.isAuthenticated ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '50px',
                                    padding: '6px 15px 6px 6px',
                                    marginRight: '15px'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #61dafb, #21a1f1)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '10px',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}>
                                        {authState.user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div style={{ 
                                            color: 'white', 
                                            fontSize: '14px', 
                                            fontWeight: '600',
                                            lineHeight: '1.2'
                                        }}>
                                            {authState.user?.username || 'User'}
                                        </div>
                                        <div style={{ 
                                            color: '#61dafb', 
                                            fontSize: '12px',
                                            lineHeight: '1.2'
                                        }}>
                                            {authState.user?.role || 'Role'}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleLogout}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid rgba(97, 218, 251, 0.3)',
                                        color: '#61dafb',
                                        padding: '8px 20px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        transition: 'all 0.3s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        ':hover': {
                                            background: 'rgba(97, 218, 251, 0.1)'
                                        }
                                    }}
                                >
                                    <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <NavLink 
                                to="/login" 
                                style={{
                                    background: 'linear-gradient(45deg, #61dafb, #21a1f1)',
                                    color: 'white',
                                    padding: '10px 25px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    transition: 'all 0.3s',
                                    boxShadow: '0 2px 10px rgba(33, 161, 241, 0.3)',
                                    ':hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 15px rgba(33, 161, 241, 0.4)'
                                    }
                                }}
                            >
                                <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>
                                Đăng Nhập
                            </NavLink>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{
                flex: 1,
                padding: '0',
                maxWidth: '1400px',
                width: '100%',
                margin: '0 auto'
            }}>
                <Outlet />
            </main>

            {/* Modern Footer */}
            <footer style={{
                background: '#20232a',
                color: '#aaaaaa',
                padding: '30px 40px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '0px'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                background: 'linear-gradient(45deg, #61dafb, #21a1f1)',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: '12px',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '18px'
                            }}>
                                📦
                            </div>
                            <span style={{
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600'
                            }}>
                                Hệ Thống Quản Lý Kho Blockchain
                            </span>
                        </div>
                        <p style={{ 
                            fontSize: '14px',
                            lineHeight: '1.6',
                            maxWidth: '400px'
                        }}>
                            Giải pháp quản lý kho hàng thông minh ứng dụng công nghệ Blockchain, đảm bảo minh bạch và bảo mật tối đa.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '40px', marginBottom: '20px' }}>
                        <div>
                            <h4 style={{ 
                                color: '#61dafb', 
                                marginBottom: '15px',
                                fontSize: '16px'
                            }}>
                                Liên Kết Nhanh
                            </h4>
                            <ul style={{ 
                                listStyle: 'none', 
                                padding: 0,
                                margin: 0
                            }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <NavLink to="/" style={{ 
                                        color: '#aaaaaa', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s',
                                        ':hover': {
                                            color: '#61dafb'
                                        }
                                    }}>
                                        Trang Chủ
                                    </NavLink>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <NavLink to="/san-pham" style={{ 
                                        color: '#aaaaaa', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s',
                                        ':hover': {
                                            color: '#61dafb'
                                        }
                                    }}>
                                        Sản Phẩm
                                    </NavLink>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <NavLink to="/kho" style={{ 
                                        color: '#aaaaaa', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s',
                                        ':hover': {
                                            color: '#61dafb'
                                        }
                                    }}>
                                        Quản Lý Kho
                                    </NavLink>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ 
                                color: '#61dafb', 
                                marginBottom: '15px',
                                fontSize: '16px'
                            }}>
                                Hỗ Trợ
                            </h4>
                            <ul style={{ 
                                listStyle: 'none', 
                                padding: 0,
                                margin: 0
                            }}>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="#" style={{ 
                                        color: '#aaaaaa', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s',
                                        ':hover': {
                                            color: '#61dafb'
                                        }
                                    }}>
                                        Trợ Giúp
                                    </a>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="#" style={{ 
                                        color: '#aaaaaa', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s',
                                        ':hover': {
                                            color: '#61dafb'
                                        }
                                    }}>
                                        Báo Cáo Lỗi
                                    </a>
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                    <a href="#" style={{ 
                                        color: '#aaaaaa', 
                                        textDecoration: 'none',
                                        fontSize: '14px',
                                        transition: 'color 0.3s',
                                        ':hover': {
                                            color: '#61dafb'
                                        }
                                    }}>
                                        Điều Khoản
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div style={{ 
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '20px',
                    marginTop: '20px',
                    textAlign: 'center',
                    fontSize: '14px'
                }}>
                    © {new Date().getFullYear()} Hệ Thống Quản Lý Kho Blockchain.
                </div>
            </footer>
        </div>
    );
}

export default Layout;