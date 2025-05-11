// server.js - File backend Node.js (Đầy đủ + Snapshot Kết thúc Kỳ)

// --- 1. Nhập Thư viện ---
const express = require('express');
const { Web3 } = require('web3');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyToken = require('./middleware/verifyToken');

// --- 2. Cấu hình ---
const GANACHE_URL = "http://127.0.0.1:7545";
const CONTRACT_ADDRESS = "0xc4cB380C29BaD01c52d604E5639aF7c84157A711"; // <<< ĐỊA CHỈ MỚI NHẤT BẠN CUNG CẤP
const CONTRACT_ABI = [ // <<< ABI MỚI NHẤT BẠN CUNG CẤP (có ketThucKy, latestSnapshots)
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "sku", "type": "string" }, { "indexed": false, "internalType": "string", "name": "tenMoi", "type": "string" }, { "indexed": false, "internalType": "string", "name": "moTaMoi", "type": "string" } ], "name": "DaCapNhatSanPham", "type": "event" },
    { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "sku", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "soLuongCu", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "soLuongMoi", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "lyDo", "type": "string" } ], "name": "DaDieuChinh", "type": "event" },
    { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "sku", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "closingBalance", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" } ], "name": "DaKetThucKy", "type": "event" }, // <<< Event mới
    { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "sku", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "soLuongSoSach", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "soLuongDemDuoc", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "thoiGianKiemKe", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "nguoiKiemKe", "type": "address" } ], "name": "DaKiemKe", "type": "event" },
    { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "sku", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "soLuongNhap", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "soLuongMoi", "type": "uint256" } ], "name": "DaNhapKho", "type": "event" },
    { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "sku", "type": "string" }, { "indexed": false, "internalType": "bool", "name": "isActive", "type": "bool" } ], "name": "DaThayDoiTrangThaiSanPham", "type": "event" },
    { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "sku", "type": "string" }, { "indexed": false, "internalType": "string", "name": "ten", "type": "string" }, { "indexed": false, "internalType": "string", "name": "moTa", "type": "string" } ], "name": "DaThemSanPham", "type": "event" },
    { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "string", "name": "sku", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "soLuongXuat", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "soLuongMoi", "type": "uint256" } ], "name": "DaXuatKho", "type": "event" },
    { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "danhSachSku", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "", "type": "string" } ], "name": "latestSnapshots", "outputs": [ { "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "uint256", "name": "balance", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, // <<< Mapping mới
    { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "", "type": "string" } ], "name": "thongTinSanPham", "outputs": [ { "internalType": "string", "name": "sku", "type": "string" }, { "internalType": "string", "name": "ten", "type": "string" }, { "internalType": "string", "name": "moTa", "type": "string" }, { "internalType": "bool", "name": "tonTai", "type": "bool" }, { "internalType": "bool", "name": "active", "type": "bool" } ], "stateMutability": "view", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "", "type": "string" } ], "name": "tonKho", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" }, { "internalType": "uint256", "name": "_soLuong", "type": "uint256" } ], "name": "ghiNhanNhapKho", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" }, { "internalType": "uint256", "name": "_soLuong", "type": "uint256" } ], "name": "ghiNhanXuatKho", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" }, { "internalType": "uint256", "name": "_soLuongDemDuoc", "type": "uint256" } ], "name": "ghiNhanKiemKe", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" }, { "internalType": "uint256", "name": "_soLuongMoi", "type": "uint256" }, { "internalType": "string", "name": "_lyDo", "type": "string" } ], "name": "dieuChinhVeSoLuong", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" } ], "name": "layTonKho", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" }, { "internalType": "string", "name": "_ten", "type": "string" }, { "internalType": "string", "name": "_moTa", "type": "string" } ], "name": "themSanPham", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" }, { "internalType": "string", "name": "_tenMoi", "type": "string" }, { "internalType": "string", "name": "_moTaMoi", "type": "string" } ], "name": "capNhatSanPham", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" }, { "internalType": "bool", "name": "_isActive", "type": "bool" } ], "name": "setSanPhamActive", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "laySoLuongSku", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" },
    { "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "laySkuTaiIndex", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" },
    { "inputs": [ { "internalType": "string", "name": "_sku", "type": "string" } ], "name": "ketThucKy", "outputs": [], "stateMutability": "nonpayable", "type": "function" } // <<< Hàm mới
];
// ---------------------

// --- Cấu hình Auth ---
const JWT_SECRET = 'your_very_secret_key_123!@#';
const users = [
    { id: 1, username: 'admin', passwordHash: '$2b$10$VwOeOGGpgtxARoZosb480.j4DdmcIfL0R8sa1zFp6EYwJkfmBPFIK', role: 'admin' },
    { id: 2, username: 'thukho', passwordHash: '$2b$10$KhM6bmZXDtYSyU0wAVYEdujwnOXdOJKEowANH6sHiZ53zwffLLHVm', role: 'thukho' }
];
// ---------------------

// --- 3. Khởi tạo Web3 & Contract ---
const web3 = new Web3(GANACHE_URL);
let quanLyKhoContract;
try {
    quanLyKhoContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    console.log("Da ket noi Web3 toi Ganache.");
    console.log("Su dung Contract tai dia chi:", CONTRACT_ADDRESS);
    quanLyKhoContract.methods.owner().call()
       .then(ownerAddress => console.log("Owner cua contract:", ownerAddress))
       .catch(err => console.error("Khong the goi ham owner():", err));
} catch (error) { console.error("LOI KHOI TAO CONTRACT:", error); process.exit(1); }

// --- 4. Khởi tạo Express App ---
const app = express();
const port = 3001;
async function checkGasPrice() {
    const gasPrice = await web3.eth.getGasPrice();
    console.log(`Gas Price: ${web3.utils.fromWei(gasPrice, 'gwei')} Gwei`);
  }
  
  checkGasPrice();
// --- 5. Sử dụng Middleware ---
app.use(cors());
app.use(express.json());

// --- 6. Định nghĩa API Routes (Đầy đủ) ---

// === CÁC ROUTE CÔNG KHAI ===
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`API Login: Nhan yeu cau dang nhap cho user: ${username}`);
    if (!username || !password) { return res.status(400).json({ success: false, message: 'Thiếu username hoặc password.' }); }
    const user = users.find(u => u.username === username);
    if (!user) { console.log(`API Login: User '${username}' khong tim thay.`); return res.status(401).json({ success: false, message: 'Sai username hoặc password.' }); }
    try {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) { console.log(`API Login: Password khong khop cho user: ${username}.`); return res.status(401).json({ success: false, message: 'Sai username hoặc password.' }); }
        console.log(`API Login: Password khop. Dang tao JWT cho user: ${username}...`);
        const payload = { userId: user.id, username: user.username, role: user.role };
        jwt.sign( payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) { console.error("API Login: Loi khi tao JWT:", err); return res.status(500).json({ success: false, message: 'Lỗi server khi tạo token.' }); }
            console.log(`API Login: Tao JWT thanh cong cho user: ${username}.`);
            res.json({ success: true, message: 'Đăng nhập thành công!', token: token, user: { userId: user.id, username: user.username, role: user.role } });
        });
    } catch (error) { console.error("API Login: Loi trong qua trinh xu ly:", error); res.status(500).json({ success: false, message: 'Lỗi server khi đăng nhập.' }); }
});

app.get('/api/tonkho/:sku', async (req, res) => {
    const sku = req.params.sku;
    console.log(`API TonKho: Nhan yeu cau /api/tonkho/${sku}`);
    if (!sku) { return res.status(400).json({ success: false, message: 'Thiếu mã SKU' }); }
    try {
         const spTonTai = await quanLyKhoContract.methods.thongTinSanPham(sku).call();
         if (!spTonTai || !spTonTai.tonTai) { return res.status(404).json({ success: false, message: `Sản phẩm với SKU ${sku} không tồn tại.` }); }
        const soLuong = await quanLyKhoContract.methods.tonKho(sku).call();
        console.log(`API TonKho: So luong ton kho cua ${sku} la: ${soLuong}`);
        res.json({ success: true, sku: sku, soLuong: soLuong.toString() });
    } catch (error) { console.error(`API TonKho: Loi khi goi Smart Contract cho SKU ${sku}:`, error); let msg = 'Lỗi lấy tồn kho.'; try { if(error.message.includes("revert")) {msg = `Lỗi contract: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

// API LỊCH SỬ (Đã sửa case DaKiemKe và thêm DaKetThucKy)
app.get('/api/lichsu', async (req, res) => {
    console.log("Nhan yeu cau /api/lichsu");
    try {
        console.log("Dang truy van cac su kien...");
        const allEvents = ['DaNhapKho', 'DaXuatKho', 'DaKiemKe', 'DaDieuChinh', 'DaThemSanPham', 'DaCapNhatSanPham', 'DaThayDoiTrangThaiSanPham', 'DaKetThucKy']; // <<< Thêm DaKetThucKy
        let combinedEvents = [];
        for (const eventName of allEvents) { try { const events = await quanLyKhoContract.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' }); combinedEvents = combinedEvents.concat(events); } catch(eventError) { console.error(`API LichSu: Loi khi lay su kien ${eventName}:`, eventError); } }
        console.log(`Tim thay tong cong ${combinedEvents.length} su kien.`);

        const lichSuDaXuLy = combinedEvents.map(event => {
            const returnValues = event.returnValues;
            let moTa = `Sự kiện không xác định: ${event.event}`;
            const formatValue = (val) => typeof val === 'bigint' ? val.toString() : (val === undefined ? '' : val);

            switch (event.event) {
                case 'DaNhapKho': moTa = `Block ${formatValue(event.blockNumber)}: [Nhập] - SKU: ${formatValue(returnValues.sku)}, SL Nhập: ${formatValue(returnValues.soLuongNhap)}, Tồn Mới: ${formatValue(returnValues.soLuongMoi)}`; break;
                case 'DaXuatKho': moTa = `Block ${formatValue(event.blockNumber)}: [Xuất] - SKU: ${formatValue(returnValues.sku)}, SL Xuất: ${formatValue(returnValues.soLuongXuat)}, Tồn Mới: ${formatValue(returnValues.soLuongMoi)}`; break;
                case 'DaKiemKe': const timeKK = new Date(Number(formatValue(returnValues.thoiGianKiemKe)) * 1000).toLocaleString('vi-VN'); moTa = `Block ${formatValue(event.blockNumber)}: [Kiểm Kê] - SKU: ${formatValue(returnValues.sku)}, SL Sổ Sách: ${formatValue(returnValues.soLuongSoSach)}, SL Thực Tế: ${formatValue(returnValues.soLuongDemDuoc)}, Lúc: ${timeKK}, Bởi: ${formatValue(returnValues.nguoiKiemKe)}`; break;
                case 'DaDieuChinh': moTa = `Block ${formatValue(event.blockNumber)}: [Điều Chỉnh] - SKU: ${formatValue(returnValues.sku)}, Tồn Cũ: ${formatValue(returnValues.soLuongCu)}, Tồn Mới: ${formatValue(returnValues.soLuongMoi)}, Lý Do: ${formatValue(returnValues.lyDo)}`; break;
                case 'DaThemSanPham': moTa = `Block ${formatValue(event.blockNumber)}: [Thêm SP] - SKU: ${formatValue(returnValues.sku)}, Tên: ${formatValue(returnValues.ten)}, Mô Tả: ${formatValue(returnValues.moTa)}`; break;
                case 'DaCapNhatSanPham': moTa = `Block ${formatValue(event.blockNumber)}: [Sửa SP] - SKU: ${formatValue(returnValues.sku)}, Tên Mới: ${formatValue(returnValues.tenMoi)}, Mô Tả Mới: ${formatValue(returnValues.moTaMoi)}`; break;
                case 'DaThayDoiTrangThaiSanPham': moTa = `Block ${formatValue(event.blockNumber)}: [Trạng Thái SP] - SKU: ${formatValue(returnValues.sku)}, Active: ${formatValue(returnValues.isActive)}`; break;
                case 'DaKetThucKy': // <<< THÊM CASE MỚI
                    const timeChotKy = new Date(Number(formatValue(returnValues.timestamp)) * 1000).toLocaleString('vi-VN');
                    moTa = `Block ${formatValue(event.blockNumber)}: [Chốt Kỳ] - SKU: ${formatValue(returnValues.sku)}, SL Chốt: ${formatValue(returnValues.closingBalance)}, Lúc: ${timeChotKy}`;
                    break;
                default: let dataStr = ''; try { dataStr = JSON.stringify(returnValues); } catch { dataStr = '[Lỗi dữ liệu]';} moTa = `Block ${formatValue(event.blockNumber)}: [${event.event || 'Không rõ'}] - ${dataStr}`;
            }
            return { blockNumber: formatValue(event.blockNumber), transactionHash: event.transactionHash, moTa: moTa };
        }).sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

        console.log("Da xu ly xong lich su.");
        res.json({ success: true, lichSu: lichSuDaXuLy });
    } catch (error) { console.error("API LichSu: Loi khi lay lich su:", error); res.status(500).json({ success: false, message: 'Lỗi xảy ra khi lấy lịch sử giao dịch.' }); }
});

// API LẤY DANH SÁCH SẢN PHẨM (Đã thêm lấy snapshot)
app.get('/api/sanpham', async (req, res) => {
    console.log("API SanPham: Nhan yeu cau GET /api/sanpham (Lay danh sach)");
    try {
        console.log("API SanPham: Dang goi contract method laySoLuongSku()...");
        const soLuongSKU_BN = await quanLyKhoContract.methods.laySoLuongSku().call();
        const soLuongSKU = Number(soLuongSKU_BN);
        console.log(`API SanPham: Tim thay ${soLuongSKU} SKU.`);
        const danhSachDayDu = [];
        for (let i = 0; i < soLuongSKU; i++) {
            try {
                const sku = await quanLyKhoContract.methods.laySkuTaiIndex(i).call();
                // Gọi song song để lấy thông tin sản phẩm, snapshot cuối và tồn kho hiện tại
                const [sanPham, snapshot, tonKhoHienTai] = await Promise.all([
                     quanLyKhoContract.methods.thongTinSanPham(sku).call(),
                     quanLyKhoContract.methods.latestSnapshots(sku).call(), // <<< Gọi mapping snapshot mới
                     quanLyKhoContract.methods.tonKho(sku).call()
                ]);

                if (sanPham && sanPham.tonTai) {
                     danhSachDayDu.push({
                         sku: sanPham.sku.toString(),
                         ten: sanPham.ten.toString(),
                         moTa: sanPham.moTa.toString(),
                         active: sanPham.active,
                         tonKhoHienTai: tonKhoHienTai.toString(), // <<< Thêm tồn kho hiện tại
                         // <<< Thêm thông tin snapshot gần nhất >>>
                         latestSnapshotTimestamp: snapshot.timestamp.toString() === '0' ? null : Number(snapshot.timestamp) * 1000,
                         latestSnapshotBalance: snapshot.timestamp.toString() === '0' ? null : snapshot.balance.toString()
                     });
                }
            } catch (errLoop) { console.error(`API SanPham: Loi khi xu ly index ${i}:`, errLoop); }
        }
        console.log("API SanPham: Da lay xong danh sach chi tiet. Tra ve ket qua.");
        res.json({ success: true, danhSachSanPham: danhSachDayDu });
    } catch (error) { console.error("API SanPham: Loi khi goi laySoLuongSku() hoac xu ly:", error); let msg = 'Lỗi lấy danh sách sản phẩm.'; try { if(error.message.includes("revert")) {msg = `Lỗi contract: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

// === CÁC ROUTE CẦN BẢO VỆ + KIỂM TRA ROLE ===
app.post('/api/nhapkho', verifyToken, async (req, res) => {
    console.log(`API NhapKho: Yeu cau tu user: ${req.user?.username} (Role: ${req.user?.role})`);
    const allowedRoles = ['admin', 'thukho'];
    if (!allowedRoles.includes(req.user.role)) { return res.status(403).json({ success: false, message: 'Không có quyền thực hiện thao tác kho.' }); }
    const { sku, soLuong } = req.body;
    if (!sku || !soLuong || soLuong <= 0) { return res.status(400).json({ success: false, message: 'SKU và Số lượng nhập hợp lệ (>0) là bắt buộc.' }); }
    try {
        const accounts = await web3.eth.getAccounts();
        const taiKhoanGui = accounts[0];
        console.log(`API NhapKho: Su dung account contract: ${taiKhoanGui}`);
        const contractMethod = quanLyKhoContract.methods.ghiNhanNhapKho(sku, parseInt(soLuong));
        const receipt = await contractMethod.send({ from: taiKhoanGui, gas: 1000000 });
        console.log("API NhapKho: Giao dich thanh cong!", receipt.transactionHash);
        res.json({ success: true, message: `Đã nhập kho thành công ${soLuong} sản phẩm ${sku}.`, transactionHash: receipt.transactionHash });
    } catch (error) { console.error("API NhapKho: Loi khi goi Smart Contract:", error); let msg = 'Lỗi nhập kho.'; try { if(error.message.includes("revert")) {msg = `Từ chối: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

app.post('/api/xuatkho', verifyToken, async (req, res) => {
    console.log(`API XuatKho: Yeu cau tu user: ${req.user?.username} (Role: ${req.user?.role})`);
    const allowedRoles = ['admin', 'thukho'];
    if (!allowedRoles.includes(req.user.role)) { return res.status(403).json({ success: false, message: 'Không có quyền thực hiện thao tác kho.' }); }
    const { sku, soLuong } = req.body;
    if (!sku || !soLuong || soLuong <= 0) { return res.status(400).json({ success: false, message: 'SKU và Số lượng xuất hợp lệ (>0) là bắt buộc.' }); }
    try {
        const accounts = await web3.eth.getAccounts();
        const taiKhoanGui = accounts[0];
        console.log(`API XuatKho: Su dung account contract: ${taiKhoanGui}`);
        const contractMethod = quanLyKhoContract.methods.ghiNhanXuatKho(sku, parseInt(soLuong));
        const receipt = await contractMethod.send({ from: taiKhoanGui, gas: 1000000 });
        console.log("API XuatKho: Giao dich thanh cong!", receipt.transactionHash);
        res.json({ success: true, message: `Đã xuất kho thành công ${soLuong} sản phẩm ${sku}.`, transactionHash: receipt.transactionHash });
    } catch (error) { console.error("API XuatKho: Loi khi goi Smart Contract:", error); let msg = 'Lỗi xuất kho.'; try { if(error.message.includes("revert")) {msg = `Từ chối: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

app.post('/api/kiemke', verifyToken, async (req, res) => {
    console.log(`API KiemKe: Yeu cau tu user: ${req.user?.username} (Role: ${req.user?.role})`);
     const allowedRoles = ['admin', 'thukho'];
     if (!allowedRoles.includes(req.user.role)) { return res.status(403).json({ success: false, message: 'Không có quyền thực hiện thao tác kho.' }); }
    const { sku, soLuongDemDuoc } = req.body;
    if (!sku || soLuongDemDuoc === undefined || soLuongDemDuoc < 0) { return res.status(400).json({ success: false, message: 'SKU và Số lượng đếm được hợp lệ (>=0) là bắt buộc.' }); }
    try {
        const accounts = await web3.eth.getAccounts();
        const taiKhoanGui = accounts[0];
        console.log(`API KiemKe: Su dung account contract: ${taiKhoanGui}`);
        const contractMethod = quanLyKhoContract.methods.ghiNhanKiemKe(sku, parseInt(soLuongDemDuoc));
        const receipt = await contractMethod.send({ from: taiKhoanGui, gas: 1000000 });
        console.log("API KiemKe: Giao dich thanh cong!", receipt.transactionHash);
        res.json({ success: true, message: `Đã ghi nhận kết quả kiểm kê cho SKU ${sku}: ${soLuongDemDuoc} sản phẩm.`, transactionHash: receipt.transactionHash });
    } catch (error) { console.error("API KiemKe: Loi khi goi Smart Contract:", error); let msg = 'Lỗi ghi nhận kiểm kê.'; try { if(error.message.includes("revert")) {msg = `Từ chối: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

app.post('/api/dieuchinh', verifyToken, async (req, res) => {
    console.log(`API DieuChinh: Yeu cau tu user: ${req.user?.username} (Role: ${req.user?.role})`);
     const allowedRoles = ['admin', 'thukho'];
     if (!allowedRoles.includes(req.user.role)) { return res.status(403).json({ success: false, message: 'Không có quyền thực hiện thao tác kho.' }); }
    const { sku, soLuongMoi, lyDo } = req.body;
    if (!sku || soLuongMoi === undefined || soLuongMoi < 0) { return res.status(400).json({ success: false, message: 'SKU và Số lượng mới hợp lệ (>=0) là bắt buộc.' }); }
    const lyDoFinal = lyDo || "Điều chỉnh hệ thống";
    try {
        const accounts = await web3.eth.getAccounts();
        const taiKhoanGui = accounts[0];
        console.log(`API DieuChinh: Su dung account contract: ${taiKhoanGui}`);
        const contractMethod = quanLyKhoContract.methods.dieuChinhVeSoLuong(sku, parseInt(soLuongMoi), lyDoFinal);
        const receipt = await contractMethod.send({ from: taiKhoanGui, gas: 1000000 });
        console.log("API DieuChinh: Giao dich thanh cong!", receipt.transactionHash);
        res.json({ success: true, message: `Đã điều chỉnh tồn kho SKU ${sku} thành ${soLuongMoi}.`, transactionHash: receipt.transactionHash });
    } catch (error) { console.error("API DieuChinh: Loi khi goi Smart Contract:", error); let msg = 'Lỗi điều chỉnh tồn kho.'; try { if(error.message.includes("revert")) {msg = `Từ chối: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

app.post('/api/sanpham', verifyToken, async (req, res) => {
    console.log(`API SanPham (POST): Yeu cau tu user: ${req.user?.username} (Role: ${req.user?.role})`);
     if (req.user.role !== 'admin') { return res.status(403).json({ success: false, message: 'Không có quyền thực hiện hành động này.' }); }
    const { sku, ten, moTa } = req.body;
    if (!sku || !ten) { return res.status(400).json({ success: false, message: 'Mã SKU và Tên sản phẩm là bắt buộc.' }); }
    try {
        const accounts = await web3.eth.getAccounts();
        const taiKhoanGui = accounts[0];
        console.log(`API SanPham (POST): Su dung account contract: ${taiKhoanGui}`);
        const contractMethod = quanLyKhoContract.methods.themSanPham(sku, ten, moTa || '');
        const receipt = await contractMethod.send({ from: taiKhoanGui, gas: 1000000 });
        console.log("API SanPham (POST): Giao dich them san pham thanh cong!", receipt.transactionHash);
        res.json({ success: true, message: `Đã thêm sản phẩm ${ten} (SKU: ${sku}) thành công.`, transactionHash: receipt.transactionHash });
    } catch (error) { console.error("API SanPham (POST): Loi khi goi Smart Contract:", error); let msg = 'Lỗi thêm sản phẩm.'; try { if(error.message.includes("revert")) {msg = `Từ chối: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

app.put('/api/sanpham/:sku', verifyToken, async (req, res) => {
    console.log(`API SanPham (PUT): Yeu cau tu user: ${req.user?.username} (Role: ${req.user?.role})`);
     if (req.user.role !== 'admin') { return res.status(403).json({ success: false, message: 'Không có quyền thực hiện hành động này.' }); }
    const sku = req.params.sku;
    const { tenMoi, moTaMoi } = req.body;
    if (!sku) { return res.status(400).json({ success: false, message: 'Thiếu mã SKU trong đường dẫn API.' }); }
    if (!tenMoi) { return res.status(400).json({ success: false, message: 'Tên sản phẩm mới là bắt buộc.' }); }
    try {
        const accounts = await web3.eth.getAccounts();
        const taiKhoanGui = accounts[0];
        console.log(`API SanPham (PUT): Su dung account contract: ${taiKhoanGui}`);
        const contractMethod = quanLyKhoContract.methods.capNhatSanPham(sku, tenMoi, moTaMoi || '');
        const receipt = await contractMethod.send({ from: taiKhoanGui, gas: 1000000 });
        console.log(`API SanPham (PUT): Giao dich cap nhat san pham cho SKU ${sku} thanh cong!`, receipt.transactionHash);
        res.json({ success: true, message: `Đã cập nhật sản phẩm SKU ${sku} thành công.`, transactionHash: receipt.transactionHash });
    } catch (error) { console.error(`API SanPham (PUT): Loi khi goi Smart Contract cho SKU ${sku}:`, error); let msg = 'Lỗi cập nhật sản phẩm.'; try { if(error.message.includes("revert")) {msg = `Từ chối: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

app.patch('/api/sanpham/:sku/active', verifyToken, async (req, res) => {
    console.log(`API SanPham (PATCH): Yeu cau tu user: ${req.user?.username} (Role: ${req.user?.role})`);
     if (req.user.role !== 'admin') { return res.status(403).json({ success: false, message: 'Không có quyền thực hiện hành động này.' }); }
    const sku = req.params.sku;
    const { isActive } = req.body;
    if (!sku) { return res.status(400).json({ success: false, message: 'Thiếu mã SKU trong đường dẫn API.' }); }
    if (typeof isActive !== 'boolean') { return res.status(400).json({ success: false, message: 'Trạng thái `isActive` phải là true hoặc false.' }); }
    try {
        const accounts = await web3.eth.getAccounts();
        const taiKhoanGui = accounts[0];
        console.log(`API SanPham (PATCH): Su dung account contract: ${taiKhoanGui}`);
        const contractMethod = quanLyKhoContract.methods.setSanPhamActive(sku, isActive);
        const receipt = await contractMethod.send({ from: taiKhoanGui, gas: 1000000 });
        console.log(`API SanPham (PATCH): Giao dich thay doi trang thai SP ${sku} thanh cong!`, receipt.transactionHash);
        res.json({ success: true, message: `Đã ${isActive ? 'kích hoạt' : 'ngừng kinh doanh'} sản phẩm SKU ${sku} thành công.`, transactionHash: receipt.transactionHash });
    } catch (error) { console.error(`API SanPham (PATCH): Loi khi goi Smart Contract cho SKU ${sku}:`, error); let msg = 'Lỗi thay đổi trạng thái sản phẩm.'; try { if(error.message.includes("revert")) {msg = `Từ chối: ${error.message.split("revert ")[1]}`;} } catch{} res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message }); }
});

// --- API KẾT THÚC KỲ ---
app.post('/api/sanpham/:sku/ketthucky', verifyToken, async (req, res) => {
    console.log(`API KetThucKy: Yeu cau tu user: ${req.user?.username} (Role: ${req.user?.role})`);
    // Tạm thời cho cả admin và thukho chốt kỳ, hoặc chỉ admin tùy yêu cầu
    const allowedRoles = ['admin', 'thukho'];
    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Không có quyền thực hiện hành động này.' });
    }
    const sku = req.params.sku;
    if (!sku) { return res.status(400).json({ success: false, message: 'Thiếu mã SKU trong đường dẫn API.' }); }

    try {
        const accounts = await web3.eth.getAccounts();
        const taiKhoanGui = accounts[0]; // Backend dùng owner để gọi hàm onlyOwner nếu cần (hiện tại ketThucKy là public)
        console.log(`API KetThucKy: Su dung account contract: ${taiKhoanGui}`);

        // Gọi hàm ketThucKy trong contract
        const contractMethod = quanLyKhoContract.methods.ketThucKy(sku);
        const receipt = await contractMethod.send({ from: taiKhoanGui, gas: 1000000 }); // Cân nhắc gas nếu mapping lớn

        console.log(`API KetThucKy: Giao dich chot ky cho SKU ${sku} thanh cong!`, receipt.transactionHash);
        // Lấy lại thông tin snapshot mới nhất để trả về
         const snapshot = await quanLyKhoContract.methods.latestSnapshots(sku).call();

        res.json({
            success: true,
            message: `Đã chốt kỳ thành công cho SKU ${sku}.`,
            transactionHash: receipt.transactionHash,
             snapshot: { // Trả về snapshot mới nhất
                 timestamp: snapshot.timestamp.toString() === '0' ? null : Number(snapshot.timestamp) * 1000,
                 balance: snapshot.timestamp.toString() === '0' ? null : snapshot.balance.toString()
             }
        });
    } catch (error) {
        console.error(`API KetThucKy: Loi khi goi Smart Contract cho SKU ${sku}:`, error);
        let msg = 'Lỗi khi thực hiện chốt kỳ.';
        try { if(error.message.includes("revert")) { msg = `Từ chối: ${error.message.split("revert ")[1]?.split("'")[0]}`; } } catch{}
        res.status(error.message.includes("revert") ? 400 : 500).json({ success: false, message: msg, error: error.message });
    }
});
app.get('/api/lichsu/:sku', async (req, res) => {
    const sku = req.params.sku;
    console.log(`Nhan yeu cau /api/lichsu/${sku}`);
    if (!sku) {
        return res.status(400).json({ success: false, message: 'Thiếu mã SKU trong đường dẫn API.' });
    }

    try {
        console.log(`Dang truy van cac su kien cho SKU: ${sku}...`);
        const allEvents = ['DaNhapKho', 'DaXuatKho', 'DaKiemKe', 'DaDieuChinh', 'DaThemSanPham', 'DaCapNhatSanPham', 'DaThayDoiTrangThaiSanPham', 'DaKetThucKy'];
        let combinedEvents = [];

        for (const eventName of allEvents) {
            try {
                const events = await quanLyKhoContract.getPastEvents(eventName, {
                    fromBlock: 0,
                    toBlock: 'latest',
                    filter: { sku: sku }
                });
                combinedEvents = combinedEvents.concat(events);
            } catch (eventError) {
                console.error(`API LichSuTheoSKU: Loi khi lay su kien ${eventName} cho SKU ${sku}:`, eventError);
            }
        }
        console.log(`Tim thay ${combinedEvents.length} su kien cho SKU ${sku}.`);

        if (combinedEvents.length === 0) {
            const spTonTai = await quanLyKhoContract.methods.thongTinSanPham(sku).call();
            if (!spTonTai || !spTonTai.tonTai) {
                return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm với SKU ${sku}.` });
            }
        }

        const lichSuDaXuLy = combinedEvents.map(event => {
            const returnValues = event.returnValues;
            let moTa = `Sự kiện không xác định: ${event.event}`;
            const formatValue = (val) => typeof val === 'bigint' ? val.toString() : (val === undefined ? '' : val);

            switch (event.event) {
                case 'DaNhapKho': moTa = `Block ${formatValue(event.blockNumber)}: [Nhập] - SL Nhập: ${formatValue(returnValues.soLuongNhap)}, Tồn Mới: ${formatValue(returnValues.soLuongMoi)}`; break;
                case 'DaXuatKho': moTa = `Block ${formatValue(event.blockNumber)}: [Xuất] - SL Xuất: ${formatValue(returnValues.soLuongXuat)}, Tồn Mới: ${formatValue(returnValues.soLuongMoi)}`; break;
                case 'DaKiemKe': 
                    const timeKK = new Date(Number(formatValue(returnValues.thoiGianKiemKe)) * 1000).toLocaleString('vi-VN');
                    moTa = `Block ${formatValue(event.blockNumber)}: [Kiểm Kê] - SL Sổ Sách: ${formatValue(returnValues.soLuongSoSach)}, SL Thực Tế: ${formatValue(returnValues.soLuongDemDuoc)}, Lúc: ${timeKK}, Bởi: ${formatValue(returnValues.nguoiKiemKe)}`; 
                    break;
                case 'DaDieuChinh': moTa = `Block ${formatValue(event.blockNumber)}: [Điều Chỉnh] - Tồn Cũ: ${formatValue(returnValues.soLuongCu)}, Tồn Mới: ${formatValue(returnValues.soLuongMoi)}, Lý Do: ${formatValue(returnValues.lyDo)}`; break;
case 'DaThemSanPham': moTa = `Block ${formatValue(event.blockNumber)}: [Thêm SP] - Tên: ${formatValue(returnValues.ten)}, Mô Tả: ${formatValue(returnValues.moTa)}`; break;
                case 'DaCapNhatSanPham': moTa = `Block ${formatValue(event.blockNumber)}: [Sửa SP] - Tên Mới: ${formatValue(returnValues.tenMoi)}, Mô Tả Mới: ${formatValue(returnValues.moTaMoi)}`; break;
                case 'DaThayDoiTrangThaiSanPham': moTa = `Block ${formatValue(event.blockNumber)}: [Trạng Thái SP] - Active: ${formatValue(returnValues.isActive)}`; break;
                case 'DaKetThucKy': 
                    const timeChotKy = new Date(Number(formatValue(returnValues.timestamp)) * 1000).toLocaleString('vi-VN');
                    moTa = `Block ${formatValue(event.blockNumber)}: [Chốt Kỳ] - SL Chốt: ${formatValue(returnValues.closingBalance)}, Lúc: ${timeChotKy}`; 
                    break;
                default: 
                    let dataStr = JSON.stringify(returnValues);
                    moTa = `Block ${formatValue(event.blockNumber)}: [${event.event || 'Không rõ'}] - ${dataStr}`;
            }
            return { blockNumber: formatValue(event.blockNumber), transactionHash: event.transactionHash, moTa: moTa };
        }).sort((a, b) => Number(b.blockNumber) - Number(a.blockNumber));

        console.log(`Da xu ly xong lich su cho SKU ${sku}.`);
        res.json({ success: true, sku: sku, lichSu: lichSuDaXuLy });
    } catch (error) {
        console.error(`API LichSuTheoSKU: Loi khi lay lich su cho SKU ${sku}:`, error);
        res.status(500).json({ success: false, message: `Lỗi xảy ra khi lấy lịch sử giao dịch cho SKU ${sku}.` });
    }
});
// --- 7. Khởi động Server ---
app.listen(port, () => {
  console.log(`Server Backend đang chạy tại http://localhost:${port}`);
});