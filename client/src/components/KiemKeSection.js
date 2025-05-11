// client/src/components/KiemKeSection.js
import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from '@mui/material';

function KiemKeSection({
  kiemKeSku, setKiemKeSku,
  kiemKeSoLuong, setKiemKeSoLuong,
  kiemKeThongBao, dangXuLyKiemKe,
  handleKiemKeSubmit,
  kiemKeResultForAdj, tonKhoHienTai,
  dangKiemTra, kiemTraThongBao,
  handleDieuChinhSubmit,
  dangXuLyDieuChinh, dieuChinhThongBao
}) {

  let chenhLech = null;
  if (kiemKeResultForAdj && tonKhoHienTai !== null && !dangKiemTra) {
    chenhLech = parseInt(kiemKeResultForAdj.soLuong) - parseInt(tonKhoHienTai);
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        Kiểm Kê Kho
      </Typography>
      <form onSubmit={handleKiemKeSubmit}>
        <Box mb={2}>
          <TextField
            label="SKU Cần Kiểm Kê (*)"
            variant="outlined"
            fullWidth
            value={kiemKeSku}
            onChange={(e) => setKiemKeSku(e.target.value)}
            required
            disabled={dangXuLyKiemKe || dangXuLyDieuChinh}
          />
        </Box>
        <Box mb={3}>
          <TextField
            label="Số Lượng Thực Tế Đếm Được (*)"
            variant="outlined"
            type="number"
            fullWidth
            value={kiemKeSoLuong}
            onChange={(e) => setKiemKeSoLuong(e.target.value)}
            required
            min="0"
            disabled={dangXuLyKiemKe || dangXuLyDieuChinh}
          />
        </Box>
        {kiemKeThongBao && (
          <Typography variant="body2" color={kiemKeThongBao.startsWith('Lỗi') ? 'error' : 'success'} mt={1}>
            {kiemKeThongBao}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={dangXuLyKiemKe || dangXuLyDieuChinh}
          sx={{ mt: 2 }}
        >
          {dangXuLyKiemKe ? 'Đang ghi nhận...' : 'Ghi Nhận Kết Quả Kiểm Kê'}
        </Button>
      </form>

      {kiemKeResultForAdj && (
        <Box mt={3} pt={3} borderTop="1px dashed #ccc">
          <Typography variant="h6" component="h4" gutterBottom>
            Kết quả kiểm kê cho SKU: {kiemKeResultForAdj.sku}
          </Typography>
          {dangKiemTra && <Typography>Đang lấy số lượng sổ sách...</Typography>}
          {kiemTraThongBao && !dangKiemTra && (
            <Typography variant="body2" color="warning">
              Cảnh báo: {kiemTraThongBao} (Không thể so sánh)
            </Typography>
          )}

          {!dangKiemTra && tonKhoHienTai !== null && (
            <>
              <Typography>
                <strong>Số lượng Sổ sách (Trước điều chỉnh):</strong> {tonKhoHienTai}
              </Typography>
              <Typography>
                <strong>Số lượng Thực tế:</strong> {kiemKeResultForAdj.soLuong}
              </Typography>
              <Typography
                fontWeight="bold"
                color={chenhLech === 0 ? 'success.main' : (chenhLech > 0 ? 'primary.main' : 'error.main')}
              >
                <strong>Chênh lệch:</strong> {chenhLech !== null ? (chenhLech > 0 ? `+${chenhLech}` : chenhLech) : 'N/A'}
                {chenhLech !== null && chenhLech !== 0 && " (Cần điều chỉnh)"}
                {chenhLech === 0 && " (Khớp)"}
              </Typography>

              {chenhLech !== null && chenhLech !== 0 && (
                <>
                  <Button
                    onClick={handleDieuChinhSubmit}
                    variant="contained"
                    color="warning"
                    disabled={dangXuLyDieuChinh || dangXuLyKiemKe}
                    sx={{ mt: 2 }}
                  >
                    {dangXuLyDieuChinh ? 'Đang điều chỉnh...' : `Phê duyệt Điều chỉnh về ${kiemKeResultForAdj.soLuong}`}
                  </Button>
                  {dieuChinhThongBao && (
                    <Typography variant="body2" color={dieuChinhThongBao.startsWith('Lỗi') ? 'error' : 'success'} mt={1}>
                      {dieuChinhThongBao}
                    </Typography>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default KiemKeSection;