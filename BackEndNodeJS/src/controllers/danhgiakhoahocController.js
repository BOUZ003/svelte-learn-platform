import db from '../config/db.js';

//true
export const getDanhGiaKhoaHoc = (req, res) => {
  const sql = 'SELECT * FROM danhgiakhoahoc';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn MySQL:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result);
  });
};
