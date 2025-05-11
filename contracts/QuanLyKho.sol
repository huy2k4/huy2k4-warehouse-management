// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract QuanLyKho {

    struct SanPham {
        string sku;
        string ten;
        string moTa;
        bool tonTai;
        bool active;
    }

    // <<< STRUCT MỚI CHO SNAPSHOT >>>
    struct Snapshot {
        uint timestamp; // Thời điểm chốt kỳ
        uint balance;   // Số lượng tồn kho tại thời điểm đó
    }
    // <<< KẾT THÚC STRUCT MỚI >>>

    address public owner;

    mapping(string => SanPham) public thongTinSanPham;
    string[] public danhSachSku;
    mapping(string => uint256) public tonKho;
    // <<< MAPPING MỚI LƯU SNAPSHOT GẦN NHẤT >>>
    mapping(string => Snapshot) public latestSnapshots;
    // <<< KẾT THÚC MAPPING MỚI >>>

    // --- Events ---
    event DaNhapKho(string sku, uint256 soLuongNhap, uint256 soLuongMoi);
    event DaXuatKho(string sku, uint256 soLuongXuat, uint256 soLuongMoi);
    event DaKiemKe(string sku, uint256 soLuongSoSach, uint256 soLuongDemDuoc, uint256 thoiGianKiemKe, address nguoiKiemKe);
    event DaDieuChinh(string sku, uint256 soLuongCu, uint256 soLuongMoi, string lyDo);
    event DaThemSanPham(string sku, string ten, string moTa);
    event DaCapNhatSanPham(string sku, string tenMoi, string moTaMoi);
    event DaThayDoiTrangThaiSanPham(string sku, bool isActive);
    // <<< EVENT MỚI CHO KẾT THÚC KỲ >>>
    event DaKetThucKy(string sku, uint closingBalance, uint timestamp);
    // <<< KẾT THÚC EVENT MỚI >>>

    // --- Modifier ---
    modifier onlyOwner() { require(msg.sender == owner, "Chi chu hop dong moi co quyen thuc hien"); _; }
    modifier chiKhiSanPhamTonTai(string memory _sku) { require(thongTinSanPham[_sku].tonTai, "SKU khong ton tai"); _; }
    modifier chiKhiSanPhamHoatDong(string memory _sku) { require(thongTinSanPham[_sku].active, "San pham da ngung kinh doanh"); _; }

    constructor() {
        owner = msg.sender;
    }

    // --- Các hàm Kho (Giữ nguyên) ---
    function ghiNhanNhapKho(string memory _sku, uint256 _soLuong) public chiKhiSanPhamTonTai(_sku) chiKhiSanPhamHoatDong(_sku) {
        require(_soLuong > 0, "So luong nhap phai lon hon 0");
        tonKho[_sku] = tonKho[_sku] + _soLuong;
        emit DaNhapKho(_sku, _soLuong, tonKho[_sku]);
    }

    function ghiNhanXuatKho(string memory _sku, uint256 _soLuong) public chiKhiSanPhamTonTai(_sku) chiKhiSanPhamHoatDong(_sku) {
        require(_soLuong > 0, "So luong xuat phai lon hon 0");
        uint256 soLuongHienTai = tonKho[_sku];
        require(soLuongHienTai >= _soLuong, "Khong du so luong ton kho de xuat");
        tonKho[_sku] = soLuongHienTai - _soLuong;
        emit DaXuatKho(_sku, _soLuong, tonKho[_sku]);
    }

    function ghiNhanKiemKe(string memory _sku, uint256 _soLuongDemDuoc) public chiKhiSanPhamTonTai(_sku) chiKhiSanPhamHoatDong(_sku) {
        uint256 soSachHienTai = tonKho[_sku];
        emit DaKiemKe(_sku, soSachHienTai, _soLuongDemDuoc, block.timestamp, msg.sender);
    }

    function dieuChinhVeSoLuong(string memory _sku, uint256 _soLuongMoi, string memory _lyDo) public chiKhiSanPhamTonTai(_sku) chiKhiSanPhamHoatDong(_sku) {
        uint256 soLuongCu = tonKho[_sku];
        tonKho[_sku] = _soLuongMoi;
        emit DaDieuChinh(_sku, soLuongCu, _soLuongMoi, _lyDo);
    }

    function layTonKho(string memory _sku) public view chiKhiSanPhamTonTai(_sku) returns (uint256) {
        return tonKho[_sku];
    }

    // --- HÀM QUẢN LÝ SẢN PHẨM (Giữ nguyên) ---
    function themSanPham(string memory _sku, string memory _ten, string memory _moTa) public onlyOwner {
        require(bytes(_sku).length > 0, "SKU khong duoc de trong");
        require(bytes(_ten).length > 0, "Ten san pham khong duoc de trong");
        require(!thongTinSanPham[_sku].tonTai, "SKU nay da ton tai");
        thongTinSanPham[_sku] = SanPham(_sku, _ten, _moTa, true, true);
        danhSachSku.push(_sku);
        emit DaThemSanPham(_sku, _ten, _moTa);
    }

    function capNhatSanPham(string memory _sku, string memory _tenMoi, string memory _moTaMoi) public onlyOwner chiKhiSanPhamTonTai(_sku) chiKhiSanPhamHoatDong(_sku) {
        require(bytes(_tenMoi).length > 0, "Ten san pham moi khong duoc de trong");
        SanPham storage sanPham = thongTinSanPham[_sku];
        sanPham.ten = _tenMoi;
        sanPham.moTa = _moTaMoi;
        emit DaCapNhatSanPham(_sku, _tenMoi, _moTaMoi);
    }

     function setSanPhamActive(string memory _sku, bool _isActive) public onlyOwner chiKhiSanPhamTonTai(_sku) {
        if (thongTinSanPham[_sku].active != _isActive) {
             thongTinSanPham[_sku].active = _isActive;
             emit DaThayDoiTrangThaiSanPham(_sku, _isActive);
        }
    }

    // --- HÀM LẤY DANH SÁCH SKU (Giữ nguyên) ---
    function laySoLuongSku() public view returns (uint256) {
        return danhSachSku.length;
    }
    function laySkuTaiIndex(uint256 index) public view returns (string memory) {
        require(index < danhSachSku.length, "Chi so vuot qua do dai mang SKU");
        return danhSachSku[index];
    }

    // --- >>> HÀM MỚI ĐỂ KẾT THÚC KỲ (LƯU SNAPSHOT) <<< ---
    /**
     * @dev Ghi nhận (snapshot) số lượng tồn kho hiện tại làm số lượng chốt kỳ.
     * Chỉ Owner mới có thể gọi hàm này.
     * @param _sku Ma SKU của sản phẩm cần chốt kỳ.
     */
    function ketThucKy(string memory _sku) public onlyOwner chiKhiSanPhamTonTai(_sku) chiKhiSanPhamHoatDong(_sku) { // Chỉ Owner, SP tồn tại và active
        uint currentBalance = tonKho[_sku];
        uint currentTime = block.timestamp;

        // Lưu lại snapshot mới nhất
        latestSnapshots[_sku] = Snapshot(currentTime, currentBalance);

        // Phát sự kiện
        emit DaKetThucKy(_sku, currentBalance, currentTime);
    }
    // --- >>> KẾT THÚC HÀM MỚI <<< ---

}