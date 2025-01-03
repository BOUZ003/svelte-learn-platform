import db from '../config/db.js';

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

export const searchAndPaginateVaiTro = (req, res) => {
  // Lấy tham số từ query string
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  // Câu lệnh SQL để gọi Stored Procedure
  const sql = 'CALL search_and_paginate_vaitro(?, ?, ?)'; // Đổi tên stored procedure thành search_and_paginate_vaitro
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

export const getByIdVaiTro = (req, res) => {
  const { id } = req.params; // Lấy id từ tham số URL

  // Câu lệnh SQL để gọi Stored Procedure
  const sql = 'CALL get_by_id_vaitro(?)'; // Thay đổi tên stored procedure
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
      return res.status(404).json({ message: 'Không tìm thấy vai trò' }); // Thay đổi thông báo
    }

    // Trả kết quả
    return res.json(data[0]); // Trả về bản ghi đầu tiên
  });
};

export const addVaiTro = (req, res) => {
  const {
    TenVaiTro,
    MoTa
  } = req.body;

  // Log payload to debug
  console.log('Payload:', {
    TenVaiTro,
    MoTa
  });

  // SQL query to call stored procedure
  const sql = 'CALL add_vaitro(?, ?)';
  const params = [
    TenVaiTro,
    MoTa
  ];

  // Execute the SQL query
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    console.log('Query result:', result);
    return res.status(201).json({ message: 'Role added successfully', data: result });
  });
};

export const updateVaiTro = (req, res) => {
  const { id } = req.params; // Lấy ID từ URL
  const { TenVaiTro, MoTa } = req.body; // Lấy dữ liệu từ payload

  // Kiểm tra nếu không có ID
  if (!id) {
    return res.status(400).json({ error: 'Role ID is required' });
  }

  // Log dữ liệu payload để kiểm tra
  console.log('Payload being sent to database:', {
    id,
    TenVaiTro,
    MoTa,
  });

  // Query gọi stored procedure
  const sql = 'CALL update_vaitro(?, ?, ?)';
  const params = [id, TenVaiTro, MoTa];

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
      return res.status(404).json({ error: 'Role not found or no changes made' });
    }

    // Thành công
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

export const deleteByIdVaiTro = (req, res) => {
  const { id } = req.params; // Lấy ID từ tham số URL
  const parsedId = parseInt(id);

  // Kiểm tra nếu ID không hợp lệ
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

    // Lấy affectedRows từ kết quả của stored procedure
    const affectedRows = results?.[0]?.[0]?.affectedRows || 0;

    // Kiểm tra nếu không có bản ghi bị ảnh hưởng
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy vai trò để xóa' });
    }

    // Trả về kết quả khi xóa thành công
    res.json({ message: 'Vai trò đã được xóa thành công' });
  });
};

export const deleteVaiTro = (req, res) => {
  const ids = req.body.ids; // Dự kiến nhận một mảng các ID cần xóa

  // Kiểm tra tính hợp lệ của dữ liệu đầu vào
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID nào để xóa' });
  }

  // Chuẩn bị câu lệnh SQL để xóa các ID
  const placeholders = ids.map(() => '?').join(','); // Tạo danh sách `?` cho mỗi ID
  const sql = `DELETE FROM VaiTro WHERE ID IN (${placeholders})`;

  db.query(sql, ids, (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa vai trò:', err);
      return res.status(500).json({ error: 'Không thể xóa vai trò', details: err.message });
    }

    // Kiểm tra nếu không có bản ghi nào bị ảnh hưởng
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy vai trò để xóa' });
    }

    // Trả về kết quả thành công
    res.status(200).json({ message: `Đã xóa thành công ${result.affectedRows} vai trò` });
  });
};


