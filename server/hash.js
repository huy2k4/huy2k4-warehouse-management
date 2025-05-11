// hash.js - Chạy file này một lần để tạo hash
const bcrypt = require('bcryptjs');
const password = 'thukho123'; // <<< Đặt mật khẩu bạn muốn cho user admin
const saltRounds = 10; // Độ phức tạp của hash

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error("Lỗi hash mật khẩu:", err);
        return;
    }
    console.log("Mật khẩu gốc:", password);
    console.log("Mật khẩu đã hash (copy giá trị này):");
    console.log(hash); // <<< COPY GIÁ TRỊ HASH NÀY
});