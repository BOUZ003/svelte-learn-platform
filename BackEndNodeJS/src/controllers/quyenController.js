import db from '../config/db.js';

//true
export const searchAndPaginateQuyen = (req, res) => {
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  const sql = 'CALL search_and_paginate_quyen(?, ?, ?)';
  const params = [searchKeyword, parseInt(page, 10), parseInt(limit, 10)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    try {
      const data = results[1] || []; 
      const totalRows = results[0]?.[0]?.TotalRows || 0; 

      const totalPages = totalRows > 0 ? Math.ceil(totalRows / limit) : 0;

      return res.json({
        totalRows,
        page: parseInt(page, 10), 
        limit: parseInt(limit, 10),
        totalPages,
        data, 
      });
    } catch (parseError) {
      console.error('Lỗi xử lý dữ liệu trả về:', parseError);
      return res.status(500).json({ error: 'Lỗi xử lý dữ liệu trả về' });
    }
  });
};

//true
export const getByIdQuyen = (req, res) => {
  const { id } = req.params; 

  const sql = 'CALL get_by_id_quyen(?)';
  const params = [parseInt(id, 10)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    const data = results[0] || [];

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy quyền' });
    }

    return res.json(data[0]); 
  });
};

//true
export const addQuyen = (req, res) => {
  const { TenQuyen, MoTa, CapDo } = req.body;

  const sql = 'CALL add_quyen(?, ?, ?)';
  const params = [TenQuyen, MoTa, CapDo];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    return res.status(201).json({ message: 'Quyền đã được thêm thành công', data: result });
  });
};

//true
export const updateQuyen = (req, res) => {
  const { id } = req.params;
  const { TenQuyen, MoTa, CapDo } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID quyền không hợp lệ' });
  }

  const sql = 'CALL update_quyen(?, ?, ?, ?)';
  const params = [parseInt(id, 10), TenQuyen, MoTa, CapDo];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    const affectedRows = result?.[0]?.affectedRows || result?.affectedRows || 0;
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Quyền không tồn tại hoặc không có thay đổi' });
    }

    return res.status(200).json({ message: 'Quyền đã được cập nhật thành công', data: result });
  });
};

//true
export const deleteByIdQuyen = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID quyền không hợp lệ' });
  }

  const sql = 'CALL delete_by_id_quyen(?)';
  const params = [parseInt(id, 10)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    const affectedRows = results?.[0]?.[0]?.affectedRows || 0;
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy quyền để xóa' });
    }

    return res.json({ message: 'Quyền đã được xóa thành công' });
  });
};

//true
export const deleteQuyen = (req, res) => {
  const ids = req.body.ids; // Dự kiến nhận một mảng các ID quyền cần xóa

  // Kiểm tra tính hợp lệ của dữ liệu đầu vào
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID quyền nào để xóa' });
  }

  // Bước 1: Kiểm tra xem quyền có đang được sử dụng trong bảng VaiTroQuyen không
  const checkSql = 'SELECT COUNT(*) AS count FROM VaiTroQuyen WHERE QuyenID IN (?)';
  db.query(checkSql, [ids], (err, result) => {
    if (err) {
      console.error('Lỗi khi kiểm tra quyền đang sử dụng:', err);
      return res.status(500).json({ error: 'Lỗi khi kiểm tra quyền', details: err.message });
    }

    const count = result[0].count;

    // Nếu quyền đang được sử dụng trong bảng VaiTroQuyen, xóa các bản ghi liên quan
    if (count > 0) {
      // Xóa các liên kết quyền trong bảng VaiTroQuyen
      const deleteRelationSql = 'DELETE FROM VaiTroQuyen WHERE QuyenID IN (?)';
      db.query(deleteRelationSql, [ids], (err, result) => {
        if (err) {
          console.error('Lỗi khi xóa quyền khỏi VaiTroQuyen:', err);
          return res.status(500).json({ error: 'Lỗi khi xóa quyền khỏi VaiTroQuyen', details: err.message });
        }

        // Sau khi xóa liên kết, tiến hành xóa quyền khỏi bảng Quyen
        const placeholders = ids.map(() => '?').join(','); // Tạo danh sách `?` cho mỗi ID
        const deleteSql = `DELETE FROM Quyen WHERE ID IN (${placeholders})`;

        db.query(deleteSql, ids, (err, result) => {
          if (err) {
            console.error('Lỗi khi xóa quyền:', err);
            return res.status(500).json({ error: 'Không thể xóa quyền', details: err.message });
          }

          // Kiểm tra nếu không có bản ghi nào bị ảnh hưởng
          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy quyền để xóa' });
          }

          // Trả về kết quả thành công
          res.status(200).json({ message: `Đã xóa thành công ${result.affectedRows} quyền` });
        });
      });
    } else {
      // Nếu quyền không liên kết, tiến hành xóa quyền ngay
      const placeholders = ids.map(() => '?').join(','); // Tạo danh sách `?` cho mỗi ID
      const deleteSql = `DELETE FROM Quyen WHERE ID IN (${placeholders})`;

      db.query(deleteSql, ids, (err, result) => {
        if (err) {
          console.error('Lỗi khi xóa quyền:', err);
          return res.status(500).json({ error: 'Không thể xóa quyền', details: err.message });
        }

        // Kiểm tra nếu không có bản ghi nào bị ảnh hưởng
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Không tìm thấy quyền để xóa' });
        }

        // Trả về kết quả thành công
        res.status(200).json({ message: `Đã xóa thành công ${result.affectedRows} quyền` });
      });
    }
  });
};

