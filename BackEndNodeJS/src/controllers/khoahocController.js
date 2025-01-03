import db from '../config/db.js';

export const getKhoaHoc = (req, res) => {
  const sql = 'SELECT * FROM khoahoc';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn MySQL:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result); 
  });
};

export const searchAndPaginateKhoaHoc = (req, res) => {
  // Lấy tham số từ query string
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  // Câu lệnh SQL để gọi Stored Procedure
  const sql = 'CALL search_and_paginate_khoahoc(?, ?, ?)';
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

