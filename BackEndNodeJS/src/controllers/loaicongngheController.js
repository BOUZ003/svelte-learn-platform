import db from '../config/db.js';


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

    // Kiểm tra và lấy dữ liệu
    const data = results[0] || []; // Danh sách bản ghi
    const totalRows = results[1]?.[0]?.TotalRows || 0; // Tổng số dòng

    // Tính tổng số trang
    const totalPages = totalRows > 0 ? Math.ceil(totalRows / limit) : 0;

    // Trả kết quả
    res.json({
      totalRows, // Tổng số bản ghi
      page: parseInt(page), // Trang hiện tại
      limit: parseInt(limit), // Số bản ghi mỗi trang
      totalPages, // Tổng số trang
      data, // Danh sách bản ghi
    });
  });
};

export const getByIdLoaiCongNghe = (req, res) => {
  const { id } = req.params; // Lấy id từ tham số URL

  const sql = 'CALL get_by_id_loaicongnghe(?)';
  const params = [parseInt(id)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
      return;
    }

    // Kiểm tra và lấy dữ liệu
    const data = results[0] || []; // Dữ liệu trả về từ stored procedure

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
    }

    // Trả kết quả
    res.json(data[0]); // Trả về bản ghi đầu tiên
  });
};

export const getByIdAndTenLoaiCongNghe = (req, res) => {
  const sql = 'CALL get_all_loaicongnghe()'; // Gọi stored procedure thay vì truy vấn trực tiếp
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi gọi stored procedure:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result[0]); // result[0] chứa dữ liệu trả về từ stored procedure
  });
};

const formatDate = (date) => {
  if (!date) return null; // If no date is provided, return null
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
};

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

  // Format dates
  const formattedNgayTao = formatDate(NgayTao);
  const formattedNgayCapNhat = formatDate(NgayCapNhat);

  // Log to check payload
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

  // SQL query to call stored procedure
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

  // Execute the SQL query
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    console.log('Query result:', result);
    return res.status(201).json({ message: 'Technology type added successfully', data: result });
  });
};

export const updateLoaiCongNghe = (req, res) => {
  // Lấy ID từ tham số URL
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

  // Kiểm tra xem ID có tồn tại không
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  // Format the date (use your date formatting function here)
  const formattedNgayCapNhat = formatDate(NgayCapNhat);

  // Log để kiểm tra payload
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

  // SQL query để gọi stored procedure
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

  // Thực thi query SQL
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    // If no rows are affected, return a 404
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Technology type not found or no changes made' });
    }

    console.log('Query result:', result);
    return res.status(200).json({ message: 'Technology type updated successfully', data: result });
  });
};

export const deleteByIdLoaiCongNghe = (req, res) => {
  const { id } = req.params; // Lấy id từ tham số URL
  const parsedId = parseInt(id);

  // Kiểm tra nếu id không hợp lệ
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

    // Kiểm tra nếu không có bản ghi bị ảnh hưởng
    const result = results && results[0]; // Đảm bảo rằng kết quả không phải là undefined hoặc null

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu để xóa' });
    }

    // Trả về kết quả khi xóa thành công
    res.json({ message: 'Dữ liệu đã được xóa thành công' });
  });
};

export const deleteLoaiCongNghe = (req, res) => {
  const ids = req.body.ids; // Dự kiến nhận một mảng các id

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID nào để xóa' });
  }

  // Chuẩn bị câu lệnh SQL để xóa
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