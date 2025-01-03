
import db from '../config/db.js';

export const updateVaiTroQuyen = (req, res) => {
  const { VaiTroID, QuyenIDs } = req.body;

  if (!VaiTroID || !QuyenIDs || !Array.isArray(QuyenIDs) || QuyenIDs.length === 0) {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ. Cần VaiTroID và mảng QuyenIDs' });
  }

  const quyenIDsString = JSON.stringify(QuyenIDs);

  const sql = 'CALL update_vaitro_quyen(?, ?)';

  db.query(sql, [VaiTroID, quyenIDsString], (err, result) => {
  if (err) {
    console.error('Lỗi khi cập nhật vai trò và quyền:', err);
    return res.status(500).json({
      error: 'Không thể cập nhật vai trò và quyền',
      details: err.message,
      sqlMessage: err.sqlMessage || 'Không có thông tin lỗi từ MySQL'
    });
  }

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'Không tìm thấy vai trò để cập nhật' });
  }

  res.status(200).json({
    message: `Cập nhật thành công quyền cho vai trò ${VaiTroID}`,
    updated: result.affectedRows
  });
});

};