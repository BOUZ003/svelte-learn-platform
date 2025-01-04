import db from '../config/db.js';

//true
export const searchAndPaginateLoaiCongNghe = (req, res) => {
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  const sql = 'CALL search_and_paginate_loaicongnghe(?, ?, ?)';
  const params = [searchKeyword, parseInt(page), parseInt(limit)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
      return;
    }

    const data = results[0] || []; 
    const totalRows = results[1]?.[0]?.TotalRows || 0; 

    const totalPages = totalRows > 0 ? Math.ceil(totalRows / limit) : 0;

    res.json({
      totalRows, 
      page: parseInt(page), 
      limit: parseInt(limit), 
      totalPages, 
      data, 
    });
  });
};

//true
export const getByIdLoaiCongNghe = (req, res) => {
  const { id } = req.params; 

  const sql = 'CALL get_by_id_loaicongnghe(?)';
  const params = [parseInt(id)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
      return;
    }

    const data = results[0] || []; 

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
    }

    res.json(data[0]); 
  });
};

//true
export const getByIdAndTenLoaiCongNghe = (req, res) => {
  const sql = 'CALL get_all_loaicongnghe()'; 
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi gọi stored procedure:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result[0]); 
  });
};

//true
const formatDate = (date) => {
  if (!date) return null; 
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
};

//true
export const addLoaiCongNghe = (req, res) => {
  const {
    Ten,
    TieuDeSEO,
    MoTa,
    ParentID,
    ThuTu,
    HienThiTrangChu,
    NgayTao,
    NguoiTao,
    NgayCapNhat,
    NguoiCapNhat,
    MetaKeyword,
    MetaDescription,
    TrangThai
  } = req.body;

  const formattedNgayTao = formatDate(NgayTao);
  const formattedNgayCapNhat = formatDate(NgayCapNhat);

  console.log('Formatted Payload:', {
    Ten,
    TieuDeSEO,
    MoTa,
    ParentID,
    ThuTu,
    HienThiTrangChu,
    NgayTao: formattedNgayTao,
    NguoiTao,
    NgayCapNhat: formattedNgayCapNhat,
    NguoiCapNhat,
    MetaKeyword,
    MetaDescription,
    TrangThai
  });

  const sql = 'CALL add_loaicongnghe(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    Ten,
    TieuDeSEO,
    MoTa,
    ParentID || null,
    ThuTu,
    HienThiTrangChu,
    formattedNgayTao,
    NguoiTao,
    formattedNgayCapNhat,
    NguoiCapNhat,
    MetaKeyword,
    MetaDescription,
    TrangThai
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    console.log('Query result:', result);
    return res.status(201).json({ message: 'Technology type added successfully', data: result });
  });
};

//true
export const updateLoaiCongNghe = (req, res) => {
  const { id } = req.params;
  const {
    Ten,
    TieuDeSEO,
    MoTa,
    ParentID,
    ThuTu,
    HienThiTrangChu,
    NgayCapNhat,
    NguoiCapNhat,
    MetaKeyword,
    MetaDescription,
    TrangThai
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const formattedNgayCapNhat = formatDate(NgayCapNhat);

  console.log('Formatted Payload:', {
    id,
    Ten,
    TieuDeSEO,
    MoTa,
    ParentID,
    ThuTu,
    HienThiTrangChu,
    NgayCapNhat: formattedNgayCapNhat,
    NguoiCapNhat,
    MetaKeyword,
    MetaDescription,
    TrangThai
  });

  const sql = 'CALL update_loaicongnghe(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    id,
    Ten,
    TieuDeSEO,
    MoTa,
    ParentID || null,
    ThuTu,
    HienThiTrangChu,
    formattedNgayCapNhat,
    NguoiCapNhat,
    MetaKeyword,
    MetaDescription,
    TrangThai
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Technology type not found or no changes made' });
    }

    console.log('Query result:', result);
    return res.status(200).json({ message: 'Technology type updated successfully', data: result });
  });
};

//true
export const deleteByIdLoaiCongNghe = (req, res) => {
  const { id } = req.params; 
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'ID không hợp lệ' });
  }

  const sql = 'CALL delete_by_id_loaicongnghe(?)';
  const params = [parsedId];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    const result = results && results[0]; 

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu để xóa' });
    }

    res.json({ message: 'Dữ liệu đã được xóa thành công' });
  });
};

//true
export const deleteLoaiCongNghe = (req, res) => {
  const ids = req.body.ids; 

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID nào để xóa' });
  }

  const placeholders = ids.map(() => '?').join(',');
  const sql = `DELETE FROM loaicongnghe WHERE id IN (${placeholders})`;

  db.query(sql, ids, (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa dữ liệu:', err);
      return res.status(500).json({ error: 'Không thể xóa mục' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy mục để xóa' });
    }

    res.status(200).json({ message: 'Đã xóa các mục thành công' });
  });
};