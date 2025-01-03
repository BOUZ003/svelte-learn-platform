import db from '../config/db.js';
import jwt from 'jsonwebtoken';

export const loginNguoiDung = (req, res) => {
  const { username, password } = req.body;

  const sql = `CALL DangNhap(?, ?)`; // Gọi Stored Procedure
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    const result = results[0];

    // Kiểm tra nếu thông tin không hợp lệ
    if (result.length === 0 || result[0].Message === 'Tên đăng nhập hoặc mật khẩu không chính xác!') {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
    }

    const user = result[0];

    // Kiểm tra trạng thái tài khoản
    if (user.TrangThai !== 'HoatDong') {
      return res.status(403).json({ error: 'Tài khoản của bạn đã bị khóa hoặc tạm ngưng!' });
    }

    // Tạo token nếu tài khoản hoạt động
    const token = jwt.sign(
      {
        id: user.UserID,
        username,
        role: user.Role,
        TrangThai: user.TrangThai, // Đưa trạng thái vào token
      },
      process.env.JWT_SECRET, // Secret từ file .env
      { expiresIn: '1h' } // Thời gian hết hạn token
    );

    // Trả về thông tin người dùng và token
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

export const searchAndPaginateNguoiDung = (req, res) => {
  // Lấy tham số từ query string
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  // Câu lệnh SQL để gọi Stored Procedure
  const sql = 'CALL search_and_paginate_nguoidung(?, ?, ?)';
  const params = [searchKeyword, parseInt(page, 10), parseInt(limit, 10)];

  // Thực thi Stored Procedure
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }

    try {
      // Lấy danh sách bản ghi và tổng số dòng
      const data = results[1] || []; // Dữ liệu trả về từ câu lệnh SELECT thứ hai
      const totalRows = results[0]?.[0]?.TotalRows || 0; // Tổng số dòng từ câu lệnh SELECT đầu tiên

      // Tính tổng số trang
      const totalPages = totalRows > 0 ? Math.ceil(totalRows / limit) : 0;

      // Trả kết quả
      return res.json({
        totalRows, // Tổng số bản ghi
        page: parseInt(page, 10), // Trang hiện tại
        limit: parseInt(limit, 10), // Số bản ghi mỗi trang
        totalPages, // Tổng số trang
        data, // Danh sách bản ghi
      });
    } catch (parseError) {
      console.error('Lỗi xử lý dữ liệu trả về:', parseError);
      return res.status(500).json({ error: 'Lỗi xử lý dữ liệu trả về' });
    }
  });
};

export const getByIdNguoiDung = (req, res) => {
  const { id } = req.params; // Lấy id từ tham số URL

  // Câu lệnh SQL để gọi Stored Procedure
  const sql = 'CALL get_by_id_nguoidung(?)';
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
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Trả kết quả
    return res.json(data[0]); // Trả về bản ghi đầu tiên
  });
};

const formatDate = (date) => {
  if (!date) return null; // If no date is provided, return null
  const d = new Date(date);
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
};

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

  // Format date
  const formattedNgayDangKy = formatDate(NgayDangKy);

  // Log payload to debug
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

  // SQL query to call stored procedure
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

  // Execute the SQL query
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    console.log('Query result:', result);
    return res.status(201).json({ message: 'User added successfully', data: result });
  });
};

import crypto from 'crypto'; 
export const updateNguoiDung = (req, res) => {
  const { id } = req.params; // Lấy ID từ URL
  const {
    TenDangNhap,
    MatKhau,
    Email,
    HoTen,
    SoDienThoai,
    VaiTroID,
    TrangThai,
  } = req.body; // Lấy dữ liệu từ payload

  // Kiểm tra nếu không có ID
  if (!id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Nếu có mật khẩu, mã hóa mật khẩu
  const hashedPassword = MatKhau
    ? crypto.createHash('sha256').update(MatKhau).digest('hex') // SHA-256 mã hóa mật khẩu
    : null;

  // Log dữ liệu payload để kiểm tra
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

  // Query gọi stored procedure
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

  // Gọi stored procedure
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        error: 'Database query failed',
        details: err.message,
      });
    }

    // Kiểm tra kết quả trả về
    const affectedRows = result?.[0]?.affectedRows || result?.affectedRows || 0;
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }

    // Thành công
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

export const deleteByIdNguoiDung = (req, res) => {
  const { id } = req.params; // Lấy ID từ tham số URL
  const parsedId = parseInt(id);

  // Kiểm tra nếu ID không hợp lệ
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

    // Lấy affectedRows từ kết quả của stored procedure
    const affectedRows = results?.[0]?.[0]?.affectedRows || 0;

    // Kiểm tra nếu không có bản ghi bị ảnh hưởng
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
    }

    // Trả về kết quả khi xóa thành công
    res.json({ message: 'Người dùng đã được xóa thành công' });
  });
};

export const deleteNguoiDung = (req, res) => {
  const ids = req.body.ids; // Dự kiến nhận một mảng các ID cần xóa

  // Kiểm tra tính hợp lệ của dữ liệu đầu vào
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID nào để xóa' });
  }

  // Chuẩn bị câu lệnh SQL để xóa các ID
  const placeholders = ids.map(() => '?').join(','); // Tạo danh sách `?` cho mỗi ID
  const sql = `DELETE FROM NguoiDung WHERE ID IN (${placeholders})`;

  db.query(sql, ids, (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      return res.status(500).json({ error: 'Không thể xóa người dùng', details: err.message });
    }

    // Kiểm tra nếu không có bản ghi nào bị ảnh hưởng
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng để xóa' });
    }

    // Trả về kết quả thành công
    res.status(200).json({ message: `Đã xóa thành công ${result.affectedRows} người dùng` });
  });
};




