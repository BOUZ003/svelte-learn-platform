import db from '../config/db.js';

export const getByIdThongTinNguoiDung = (req, res) => {
    const { id } = req.params; // Lấy id từ tham số URL
  
    // Câu lệnh SQL để gọi Stored Procedure mới
    const sql = 'CALL get_by_id_thongtincanhan(?)';
    const params = [parseInt(id, 10)];
  
    // Thực thi Stored Procedure
    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Lỗi khi gọi Stored Procedure:', err);
        return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
      }
  
      // Kiểm tra và lấy dữ liệu từ kết quả trả về
      const data = results[0] || []; // Kết quả trả về từ stored procedure
  
      if (data.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
      }
  
      // Trả kết quả
      return res.json(data[0]); // Trả về bản ghi đầu tiên
    });
  };

  
  