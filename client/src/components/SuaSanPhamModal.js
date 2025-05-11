// client/src/components/SuaSanPhamModal.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // <<< Import useAuth

function SuaSanPhamModal({ isOpen, onClose, productToEdit, onSaveSuccess }) {
    const [tenMoi, setTenMoi] = useState('');
    const [moTaMoi, setMoTaMoi] = useState('');
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState('');
    const { authState } = useAuth(); // <<< Lấy authState

    useEffect(() => {
        if (productToEdit) {
            setTenMoi(productToEdit.ten || '');
            setMoTaMoi(productToEdit.moTa || '');
            setFeedback(''); // Reset feedback khi mở modal
        }
    }, [productToEdit]); // Chạy lại khi sản phẩm cần sửa thay đổi

    const handleSave = async (event) => {
        event.preventDefault();
        setSaving(true);
        setFeedback('Đang lưu thay đổi...');

        const token = authState.token; // <<< Lấy token
        const sku = productToEdit?.sku;

        if (!sku || !token) {
            setFeedback(`Lỗi: ${!sku ? 'Thiếu SKU sản phẩm.' : 'Chưa đăng nhập hoặc token không hợp lệ.'}`);
            setSaving(false);
            return;
        }
        if (!tenMoi) { // Kiểm tra tên mới không được rỗng
             setFeedback('Lỗi: Tên sản phẩm mới không được để trống.');
             setSaving(false);
             return;
        }


        try {
            const response = await fetch(`http://localhost:3001/api/sanpham/${sku}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // <<< THÊM HEADER AUTH
                },
                body: JSON.stringify({ tenMoi: tenMoi, moTaMoi: moTaMoi }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                setFeedback('Cập nhật thành công!');
                // Đợi một chút để người dùng thấy thông báo rồi mới gọi callback
                setTimeout(() => {
                    onSaveSuccess(); // Gọi callback báo thành công cho component cha (sẽ đóng modal và refresh list)
                }, 1000); // Đợi 1 giây
            } else {
                setFeedback(`Lỗi ${response.status}: ${data.message || 'Không thể cập nhật.'}`);
                 // Có thể logout user nếu lỗi 401/403
                 // if (response.status === 401 || response.status === 403) { logout(); navigate('/login'); }
            }
        } catch (error) {
            console.error("Lỗi API cập nhật sản phẩm:", error);
            setFeedback('Lỗi kết nối hoặc server.');
        } finally {
            // Không setSaving(false) ngay nếu muốn giữ nút disable sau khi thành công/lỗi
             if (!feedback.includes('thành công')) { // Chỉ bật lại nút nếu không thành công
                 setSaving(false);
             }
        }
    };

    // --- Style cơ bản cho Modal ---
    const modalStyle = {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '400px', maxWidth: '90%', background: 'white', padding: '20px 30px',
        borderRadius: '8px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        zIndex: 1000, color: '#333',
    };
    const overlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)', zIndex: 999,
    };
    // --- Kết thúc Style ---

    if (!isOpen) return null;

    // Xử lý trường hợp productToEdit chưa có (hiếm khi xảy ra nếu logic đúng)
    if (!productToEdit) {
         return (
             <>
                <div style={overlayStyle} onClick={onClose} />
                <div style={modalStyle}>
                     <p style={{color: 'red'}}>Lỗi: Không có thông tin sản phẩm để sửa.</p>
                     <button onClick={onClose}>Đóng</button>
                </div>
             </>
         )
    }

    // Render Modal
    return (
        <>
            <div style={overlayStyle} onClick={saving ? undefined : onClose} /> {/* Không cho đóng nếu đang lưu */}
            <div style={modalStyle}>
                <h3>Sửa Thông Tin Sản Phẩm</h3>
                <p><strong>SKU:</strong> {productToEdit.sku} (Không thể sửa)</p>
                <form onSubmit={handleSave}>
                    <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                        <label htmlFor="tenMoiInput" style={{ display: 'block', marginBottom: '5px' }}>Tên Sản Phẩm Mới (*):</label>
                        <input
                            type="text"
                            id="tenMoiInput"
                            value={tenMoi}
                            onChange={(e) => setTenMoi(e.target.value)}
                            required
                            disabled={saving}
                            style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <label htmlFor="moTaMoiInput" style={{ display: 'block', marginBottom: '5px' }}>Mô Tả Mới:</label>
                        <textarea
                            id="moTaMoiInput"
                            value={moTaMoi}
                            onChange={(e) => setMoTaMoi(e.target.value)}
                            disabled={saving}
                            rows="4"
                            style={{ width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    {feedback && <p style={{ color: feedback.startsWith('Lỗi') ? 'red' : 'green', marginBottom: '15px', minHeight: '1.2em' }}>{feedback}</p>}
                    <div style={{ textAlign: 'right' }}>
                        <button type="button" onClick={onClose} disabled={saving} style={{ marginRight: '10px', padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Hủy
                        </button>
                        <button type="submit" disabled={saving} style={{ padding: '8px 15px', background: '#5cb85c', color: 'white', border: 'none', borderRadius: '4px', cursor: saving? 'wait' : 'pointer' }}>
                            {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SuaSanPhamModal;