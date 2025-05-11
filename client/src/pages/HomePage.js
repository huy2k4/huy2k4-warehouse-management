import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Particles } from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Engine } from "tsparticles-engine";

const HomePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeFeature, setActiveFeature] = useState(0);

    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const featureTimer = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % 3);
        }, 5000);
        
        return () => {
            clearInterval(timer);
            clearInterval(featureTimer);
        };
    }, []);

    const features = [
        {
            icon: '🔐',
            title: 'BẢO MẬT LỚP DOANH NGHIỆP',
            description: 'Công nghệ Blockchain không thể đánh cắp với mã hóa AES-256',
            color: '#4E9F3D'
        },
        {
            icon: '⚡',
            title: 'TỐC ĐỘ XỬ LÝ CỰC NHANH',
            description: 'Xử lý dữ liệu chuẩn xác dựa trên thời gian thực',
            color: '#FF6B35'
        },
        {
            icon: '🤖',
            title: 'TÍNH ỨNG DỤNG CAO, Ý NGHĨA THỰC TẾ',
            description: 'Logic thông minh, dựa trên vấn đề thực tế tại doanh nghiệp',
            color: '#2A5C82'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: '#121212' // Thêm màu nền tối
        }}>
            {/* Particle Background */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                        },
                        modes: {
                            repulse: {
                                distance: 100,
                                duration: 0.4,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: ["#2A5C82", "#FF6B35", "#4E9F3D"],
                        },
                        links: {
                            color: '#2A5C82',
                            distance: 150,
                            enable: true,
                            opacity: 0.4,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 1,
                            direction: 'none',
                            random: true,
                            straight: false,
                            out_mode: 'out'
                        },
                        number: { 
                            density: { enable: true },
                            value: 80 
                        },
                        opacity: { 
                            value: 0.5, 
                            random: true 
                        },
                        shape: { 
                            type: 'circle' 
                        },
                        size: { 
                            value: 3, 
                            random: true 
                        }
                    },
                    detectRetina: true
                }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0
                }}
            />

            {/* Main Content */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                color: '#E0E0E0' // Đổi màu chữ sang màu xám sáng
            }}>
                {/* Animated Header */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '3rem'
                    }}
                >
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(45deg, #FF6B35, #4E9F3D)',
                        borderRadius: '15px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: '1rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }}>
                        <span style={{ fontSize: '2rem' }}>📦</span>
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        background: 'linear-gradient(90deg, #FF6B35, #4E9F3D)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                    }}>
                        KHO THÔNG MINH <span style={{ color: '#E0E0E0' }}></span>
                    </h1>
                </motion.div>

                {/* Feature Showcase Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                        width: '100%',
                        maxWidth: '900px',
                        background: 'rgba(30, 30, 30, 0.7)', // Đổi màu nền card sang tối hơn
                        backdropFilter: 'blur(12px)',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <div style={{
                        width: '100%',
                        height: '250px',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '15px'
                    }}>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={activeFeature}
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: `linear-gradient(135deg, ${features[activeFeature].color}20, #00000080)`,
                                    backdropFilter: 'blur(5px)',
                                    border: `1px solid ${features[activeFeature].color}50`,
                                    borderRadius: '15px',
                                    padding: '2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: `${features[activeFeature].color}30`,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '1.5rem',
                                        fontSize: '1.8rem'
                                    }}>
                                        {features[activeFeature].icon}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        margin: 0,
                                        color: features[activeFeature].color
                                    }}>
                                        {features[activeFeature].title}
                                    </h3>
                                </div>
                                <p style={{
                                    fontSize: '1rem',
                                    lineHeight: 1.6,
                                    color: '#E0E0E0' // Đổi màu chữ sang xám sáng
                                }}>
                                    {features[activeFeature].description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <div style={{
                            position: 'absolute',
                            bottom: '1rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: '0.5rem',
                            zIndex: 3
                        }}>
                            {[0, 1, 2].map(i => (
                                <button
                                    key={i}
                                    onClick={() => setActiveFeature(i)}
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: activeFeature === i ? features[i].color : 'rgba(255,255,255,0.3)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        padding: 0
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Time Display */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    style={{
                        marginTop: '1rem',
                        fontSize: '3rem',
                        fontFamily: "'Segment7', monospace",
                        fontStyle: "italic",
                        fontWeight: "normal",
                        fontWeight: 'normal',
                        color: '#00FF41', // Màu xanh lá điện tử
                        textShadow: `
                            0 0 5px #20B2AA,
                            0 0 10px #20B2AA,
                            0 0 20px #20B2AA,
                            0 0 40px #20B2AA
                        `, // Hiệu ứng phát sáng
                        letterSpacing: '2px',
                        textAlign: 'center'
                    }}
                >
                    {currentTime.toLocaleTimeString()}
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;