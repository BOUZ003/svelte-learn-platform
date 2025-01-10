import db from '../config/db.js';

//true
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

//true
export const searchAndPaginateKhoaHoc = (req, res) => {
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  const sql = 'CALL search_and_paginate_khoahoc(?, ?, ?)';
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
export const getKhoaHocById = (req, res) => {
  const { id } = req.params; 

  if (!id) {
    return res.status(400).json({ error: 'Thiếu id khóa học' });
  }

  const sql = 'SELECT TenKhoaHoc FROM khoahoc WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn MySQL:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khóa học với id này' });
    }

    res.json(result[0]); 
  });
};


export const searchKhoaHocByNguoiTao = (req, res) => {
  const { id } = req.params;

  // Kiểm tra idNguoiTao có tồn tại và hợp lệ
  // if (!idNguoiTao || isNaN(Number(idNguoiTao))) {
  //   return res.status(400).json({ error: 'idNguoiTao không hợp lệ' });
  // }

  const sql = 'CALL SearchKhoaHoc(?)';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Lỗi khi gọi thủ tục lưu trữ:', err);
      return res.status(500).json({ error: 'Lỗi máy chủ: Không thể truy vấn dữ liệu' });
    }

    if (!result || !result[0] || result[0].length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khóa học nào của người tạo này' });
    }

    // Trả về kết quả tìm thấy
    res.json(result[0]);
  });
};

