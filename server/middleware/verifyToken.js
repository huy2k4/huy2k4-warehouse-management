// server/middleware/verifyToken.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_very_secret_key_123!@#'; // Lấy lại secret key đã định nghĩa ở server.js

function verifyToken(req, res, next) {
    // Lấy token từ header 'Authorization' (thường có dạng "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy phần token sau chữ "Bearer "

    if (token == null) {
        console.log("verifyToken: No token provided");
        // Nếu không có token, trả về lỗi 401 Unauthorized
        return res.status(401).json({ success: false, message: 'Token không được cung cấp.' });
    }

    // Xác thực token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("verifyToken: Invalid token", err.message);
             // Nếu token không hợp lệ (sai chữ ký, hết hạn...), trả về lỗi 403 Forbidden
            let message = 'Token không hợp lệ.';
            if (err.name === 'TokenExpiredError') {
                message = 'Token đã hết hạn.';
            } else if (err.name === 'JsonWebTokenError') {
                 message = 'Token không đúng định dạng.';
            }
            return res.status(403).json({ success: false, message: message });
        }

        // Nếu token hợp lệ, lưu thông tin user đã decode vào request để handler sau có thể dùng
        console.log("verifyToken: Token valid for user:", decoded.username);
        req.user = decoded; // decoded chứa payload lúc sign (userId, username, role)
        next(); // Cho phép request đi tiếp đến API handler
    });
}

module.exports = verifyToken; // Xuất middleware để server.js có thể dùng