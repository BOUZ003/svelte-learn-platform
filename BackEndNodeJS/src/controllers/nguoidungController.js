import db from '../config/db.js';
import jwt from 'jsonwebtoken';

//true
export const loginNguoiDung = (req, res) => {
  const { username, password } = req.body;

  const sql = `CALL login(?, ?)`; 
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    const result = results[0];

    if (result.length === 0 || result[0].Message === 'Tên đăng nhập hoặc mật khẩu không chính xác!') {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
    }

    const user = result[0];

    if (user.TrangThai !== 'HoatDong') {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa hoặc tạm ngưng!' });
    }

    const token = jwt.sign(
      {
        id: user.UserID,
        username,
        role: user.Role,
        TrangThai: user.TrangThai, 
      },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.UserID,
        fullName: user.FullName,
        email: user.Email,
        role: user.Role,
        TrangThai: user.TrangThai,
      },
    });
  });
};

//true
export const searchAndPaginateNguoiDung = (req, res) => {
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  const sql = 'CALL search_and_paginate_nguoidung(?, ?, ?)';
  const params = [searchKeyword, parseInt(page, 10), parseInt(limit, 10)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    try {
      const data = results[1] || []; // Dữ liệu trả về từ câu lệnh SELECT thứ hai
      const totalRows = results[0]?.[0]?.TotalRows || 0; // Tổng số dòng từ câu lệnh SELECT đầu tiên

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
export const getByIdNguoiDung = (req, res) => {
  const { id } = req.params;

  const sql = 'CALL get_by_id_nguoidung(?)';
  const params = [parseInt(id, 10)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    const data = results[0] || []; 

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    return res.json(data[0]); 
  });
};

//true
const formatDate = (date) => {
  if (!date) return null; // If no date is provided, return null
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
};

//true
export const addNguoiDung = (req, res) => {
  const {
    TenDangNhap,
    MatKhau,
    Email,
    HoTen,
    SoDienThoai,
    VaiTroID,
    TrangThai,
    NgayDangKy
  } = req.body;

  const formattedNgayDangKy = formatDate(NgayDangKy);

  console.log('Formatted Payload:', {
    TenDangNhap,
    MatKhau,
    Email,
    HoTen,
    SoDienThoai,
    VaiTroID,
    TrangThai,
    NgayDangKy: formattedNgayDangKy
  });

  const sql = 'CALL add_nguoidung(?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    TenDangNhap,
    MatKhau,
    Email,
    HoTen,
    SoDienThoai,
    VaiTroID,
    TrangThai,
    formattedNgayDangKy
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    console.log('Query result:', result);
    return res.status(201).json({ message: 'User added successfully', data: result });
  });
};

//true
import crypto from 'crypto'; 
export const updateNguoiDung = (req, res) => {
  const { id } = req.params;
  const {
    TenDangNhap,
    MatKhau,
    Email,
    HoTen,
    SoDienThoai,
    VaiTroID,
    TrangThai,
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const hashedPassword = MatKhau
    ? crypto.createHash('sha256').update(MatKhau).digest('hex') 
    : null;

  console.log('Payload being sent to database:', {
    id,
    TenDangNhap,
    MatKhau: hashedPassword,
    Email,
    HoTen,
    SoDienThoai,
    VaiTroID,
    TrangThai,
  });

  const sql = 'CALL update_nguoidung(?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    id,
    TenDangNhap,
    hashedPassword,
    Email,
    HoTen,
    SoDienThoai,
    VaiTroID,
    TrangThai,
  ];

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
      return res.status(404).json({ error: 'User not found or no changes made' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: {
        id,
        TenDangNhap,
        Email,
        HoTen,
        SoDienThoai,
        VaiTroID,
        TrangThai,
      },
    });
  });
};

//true
export const deleteByIdNguoiDung = (req, res) => {
  const { id } = req.params; 
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'ID không hợp lệ' });
  }

  const sql = 'CALL delete_by_id_nguoidung(?)';
  const params = [parsedId];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure', details: err.message });
    }

    const affectedRows = results?.[0]?.[0]?.affectedRows || 0;

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
    }

    res.json({ message: 'Người dùng đã được xóa thành công' });
  });
};

//true
export const deleteNguoiDung = (req, res) => {
  const ids = req.body.ids;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID nào để xóa' });
  }

  const placeholders = ids.map(() => '?').join(','); 
  const sql = `DELETE FROM NguoiDung WHERE ID IN (${placeholders})`;

  db.query(sql, ids, (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      return res.status(500).json({ error: 'Không thể xóa người dùng', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng để xóa' });
    }

    res.status(200).json({ message: `Đã xóa thành công ${result.affectedRows} người dùng` });
  });
};




