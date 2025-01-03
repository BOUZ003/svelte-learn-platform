import db from '../config/db.js';

export const getCongNghe = (req, res) => {
  const sql = 'SELECT * FROM congnghe';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn MySQL:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result); // Trả về kết quả dưới dạng JSON
  });
};

export const searchAndPaginateCongNghe = (req, res) => {
  // Lấy tham số từ query string
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  // Câu lệnh SQL để gọi Stored Procedure
  const sql = 'CALL search_and_paginate_congnghe(?, ?, ?)';
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

export const getByIdCongNghe = (req, res) => {
  const { id } = req.params;
  const sql = 'CALL get_by_id_congnghe(?)';
  const params = [parseInt(id, 10)];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure' });
    }
    const data = results[0] || []; 

    if (data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy công nghệ' });
    }
    return res.json(data[0]); 
  });
};

export const addCongNghe = (req, res) => {
  const {
    Ten,
    TieuDe,
    MoTa,
    LoaiCongNgheID,
    Icon,
    Logo,
    PhienBan,
    STT,
    Tags,
    HienThiTrangChu,
    HienThiHot,
    NguoiTao,
    MetaKeyword,
    MetaDescription,
    TrangThai
  } = req.body;

  // Chuyển TrangThai thành 0 hoặc 1 nếu là giá trị boolean
  const trangThaiValue = TrangThai ? 1 : 0; // Convert boolean to integer (0 or 1)

  // Log payload to debug
  console.log('Payload:', {
    Ten,
    TieuDe,
    MoTa,
    LoaiCongNgheID,
    Icon,
    Logo,
    PhienBan,
    STT,
    Tags,
    HienThiTrangChu,
    HienThiHot,
    NguoiTao,
    MetaKeyword,
    MetaDescription,
    TrangThai: trangThaiValue // Log TrangThai value as 0 or 1
  });

  // SQL query to call stored procedure
  const sql = 'CALL add_congnghe(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    Ten,
    TieuDe,
    MoTa,
    LoaiCongNgheID,
    Icon,
    Logo,
    PhienBan,
    STT,
    Tags,
    HienThiTrangChu,
    HienThiHot,
    NguoiTao,
    MetaKeyword,
    MetaDescription,
    trangThaiValue // Truyền giá trị boolean cho TrangThai (0 hoặc 1)
  ];

  // Execute the SQL query
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    console.log('Query result:', result);
    return res.status(201).json({ message: 'Technology added successfully', data: result });
  });
};

export const updateCongNghe = (req, res) => {
  // Lấy ID từ tham số URL
  const { id } = req.params;  // ID được truyền qua URL
  const {
    Ten,
    TieuDe,
    MoTa,
    LoaiCongNgheID,
    Icon,
    Logo,
    PhienBan,
    STT,
    Tags,
    HienThiTrangChu,
    HienThiHot,
    NguoiCapNhat,
    MetaKeyword,
    MetaDescription,
    TrangThai
  } = req.body;

  // Chuyển giá trị TrangThai thành 0 hoặc 1
  const trangThaiValue = TrangThai ? 1 : 0;

  // Câu lệnh SQL sử dụng Call Procedure
  const sql = 'CALL update_congnghe(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    id,  // Sử dụng ID từ URL
    Ten,
    TieuDe,
    MoTa,
    LoaiCongNgheID,
    Icon,
    Logo,
    PhienBan,
    STT,
    Tags,
    HienThiTrangChu,
    HienThiHot,
    NguoiCapNhat,
    MetaKeyword,
    MetaDescription,
    trangThaiValue
  ];

  // Thực thi truy vấn SQL
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    return res.status(200).json({ message: 'Technology updated successfully', data: result });
  });
};

export const deleteByIdCongNghe = (req, res) => {
  const { id } = req.params; // Lấy ID từ tham số URL
  const parsedId = parseInt(id);

  // Kiểm tra nếu ID không hợp lệ
  if (isNaN(parsedId)) {
    return res.status(400).json({ error: 'ID không hợp lệ' });
  }

  const sql = 'CALL delete_by_id_congnghe(?)';
  const params = [parsedId];

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Lỗi khi gọi Stored Procedure:', err);
      return res.status(500).json({ error: 'Lỗi khi gọi Stored Procedure', details: err.message });
    }

    // Kiểm tra cấu trúc kết quả trả về
    const affectedRows = results?.[0]?.affectedRows || 0;

    // Nếu affectedRows == 0, tức là không có bản ghi nào bị ảnh hưởng
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy công nghệ để xóa' });
    }

    // Nếu có bản ghi bị ảnh hưởng, xóa thành công
    res.status(200).json({ message: 'Công nghệ đã được xóa thành công' });
  });
};

export const deleteCongNghe = (req, res) => {
  const ids = req.body.ids; // Dự kiến nhận một mảng các ID cần xóa

  // Kiểm tra tính hợp lệ của dữ liệu đầu vào
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID nào để xóa' });
  }

  // Chuẩn bị câu lệnh SQL để xóa các ID
  const placeholders = ids.map(() => '?').join(','); // Tạo danh sách `?` cho mỗi ID
  const sql = `DELETE FROM CongNghe WHERE ID IN (${placeholders})`;

  db.query(sql, ids, (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa công nghệ:', err);
      return res.status(500).json({ error: 'Không thể xóa công nghệ', details: err.message });
    }

    // Kiểm tra nếu không có bản ghi nào bị ảnh hưởng
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công nghệ để xóa' });
    }

    // Trả về kết quả thành công
    res.status(200).json({ message: `Đã xóa thành công ${result.affectedRows} công nghệ` });
  });
};

export const getCongNgheMenuPageUser = (req, res) => {
  const sql = 'CALL get_congnghe_menu_page_home_user()'; 
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi gọi stored procedure:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result[0]); 
  });
};

export const getPaginateHienThiTrangChu = (req, res) => {
  // Lấy tham số từ query string
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  // Câu lệnh SQL để gọi Stored Procedure
  const sql = 'CALL get_paginate_congnghe_hienthitrangchu_home_user(?, ?, ?)';
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



