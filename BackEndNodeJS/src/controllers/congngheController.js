import db from '../config/db.js';

//true
export const getCongNghe = (req, res) => {
  const sql = 'SELECT * FROM congnghe';
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
export const searchAndPaginateCongNghe = (req, res) => {
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  const sql = 'CALL search_and_paginate_congnghe(?, ?, ?)';
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

//true
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

  const trangThaiValue = TrangThai ? 1 : 0; 

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
    TrangThai: trangThaiValue 
  });

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
    trangThaiValue 
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    console.log('Query result:', result);
    return res.status(201).json({ message: 'Technology added successfully', data: result });
  });
};

//true
export const updateCongNghe = (req, res) => {
  const { id } = req.params;  
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

  const trangThaiValue = TrangThai ? 1 : 0;

  const sql = 'CALL update_congnghe(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const params = [
    id, 
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

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      return res.status(500).json({ error: 'Database query failed', details: err.message, stack: err.stack });
    }

    return res.status(200).json({ message: 'Technology updated successfully', data: result });
  });
};

//true
export const deleteByIdCongNghe = (req, res) => {
  const { id } = req.params; 
  const parsedId = parseInt(id);

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

    const affectedRows = results?.[0]?.affectedRows || 0;

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy công nghệ để xóa' });
    }

    res.status(200).json({ message: 'Công nghệ đã được xóa thành công' });
  });
};

//true
export const deleteCongNghe = (req, res) => {
  const ids = req.body.ids; 

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Không có ID nào để xóa' });
  }

  const placeholders = ids.map(() => '?').join(','); 
  const sql = `DELETE FROM CongNghe WHERE ID IN (${placeholders})`;

  db.query(sql, ids, (err, result) => {
    if (err) {
      console.error('Lỗi khi xóa công nghệ:', err);
      return res.status(500).json({ error: 'Không thể xóa công nghệ', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy công nghệ để xóa' });
    }

    res.status(200).json({ message: `Đã xóa thành công ${result.affectedRows} công nghệ` });
  });
};

//true
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

//true
export const getPaginateHienThiTrangChu = (req, res) => {
  const { searchKeyword = '', page = 1, limit = 10 } = req.query;

  const sql = 'CALL get_paginate_congnghe_hienthitrangchu_home_user(?, ?, ?)';
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



