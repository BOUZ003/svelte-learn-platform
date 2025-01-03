// Import kết nối cơ sở dữ liệu
import db from '../config/db.js';

export const getPermissionsForRole = (req, res) => {
  const { id } = req.params; 

  const sql = 'CALL get_permissions_for_role(?)'; 
  const params = [parseInt(id, 10)]; 

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    const data = results[0] || []; 

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy quyền cho vai trò này' }); 
    }

    return res.json({
      message: 'Danh sách quyền cho vai trò được lấy thành công',
      permissions: data 
    });
  });
};
