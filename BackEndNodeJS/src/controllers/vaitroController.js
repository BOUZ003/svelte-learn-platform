import db from '../config/db.js';

//true
export const getVaiTro = (req, res) => {
  const sql = 'SELECT * FROM vaitro';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn MySQL:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result); 
  });
};

//true
export const searchAndPaginateVaiTro = (req, res) => {
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  const sql = 'CALL search_and_paginate_vaitro(?, ?, ?)'; 
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
export const getByIdVaiTro = (req, res) => {
  const { id } = req.params; 

  const sql = 'CALL get_by_id_vaitro(?)'; 
  const params = [parseInt(id, 10)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    const data = results[0] || []; 

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy vai trò' }); 
    }

    return res.json(data[0]);
  });
};

//true
export const addVaiTro = (req, res) => {
  const {
    TenVaiTro,
    MoTa
  } = req.body;

  console.log('Payload:', {
    TenVaiTro,
    MoTa
  });

  const sql = 'CALL add_vaitro(?, ?)';
  const params = [
    TenVaiTro,
    MoTa
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    console.log('Query result:', result);
    return res.status(201).json({ message: 'Role added successfully', data: result });
  });
};

//true
export const updateVaiTro = (req, res) => {
  const { id } = req.params; 
  const { TenVaiTro, MoTa } = req.body; 

  if (!id) {
    return res.status(400).json({ error: 'Role ID is required' });
  }

  console.log('Payload being sent to database:', {
    id,
    TenVaiTro,
    MoTa,
  });

  const sql = 'CALL update_vaitro(?, ?, ?)';
  const params = [id, TenVaiTro, MoTa];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Database query failed',
        details: err.message,
      });
    }

    const affectedRows = result?.[0]?.affectedRows || result?.affectedRows || 0;
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Role not found or no changes made' });
    }

    res.status(200).json({
      message: 'Role updated successfully',
      data: {
        id,
        TenVaiTro,
        MoTa,
      },
    });
  });
};

//true
export const deleteByIdVaiTro = (req, res) => {
  const { id } = req.params; 
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'ID không hợp lệ' });
  }

  const sql = 'CALL delete_by_id_vaitro(?)';
  const params = [parsedId];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure', details: err.message });
    }

    const affectedRows = results?.[0]?.[0]?.affectedRows || 0;

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy vai trò để xóa' });
    }

    res.json({ message: 'Vai trò đã được xóa thành công' });
  });
};

//true
export const deleteVaiTro = (req, res) => {
  const ids = req.body.ids; 
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID nào để xóa' });
  }

  const placeholders = ids.map(() => '?').join(','); 
  const sql = `DELETE FROM VaiTro WHERE ID IN (${placeholders})`;

  db.query(sql, ids, (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa vai trò:', err);
      return res.status(500).json({ error: 'Không thể xóa vai trò', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy vai trò để xóa' });
    }

    res.status(200).json({ message: `Đã xóa thành công ${result.affectedRows} vai trò` });
  });
};


