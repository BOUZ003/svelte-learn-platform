import jwt from 'jsonwebtoken';

// Middleware: Xác thực token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token không tồn tại' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Giải mã token
    req.user = decoded;  // Lưu thông tin người dùng vào req
    console.log('Decoded JWT:', decoded);  // Log thông tin người dùng từ token
    next();  // Tiếp tục xử lý API
  } catch (error) {
    console.error('Token không hợp lệ:', error.message);
    return res.status(403).json({ error: 'Token không hợp lệ' });
  }
};


// Middleware: Kiểm tra quyền
import db from '../config/db.js';  // Cấu hình kết nối DB

export const verifyPermission = (requiredPermission) => {
  return async (req, res, next) => {
    const { id: userID } = req.user;  // Lấy userID từ JWT
    console.log('User from token:', req.user);
    console.log('Required permission:', requiredPermission);

    if (!userID) {
      return res.status(401).json({ error: 'Không tìm thấy ID người dùng trong token' });
    }

    try {
      // Chạy câu lệnh CALL stored procedure
      await db.promise().query('CALL check_user_permission(?, ?, @hasPermission);', [userID, requiredPermission]);

      // Truy vấn lại giá trị của biến @hasPermission
      const [rows] = await db.promise().query('SELECT @hasPermission AS UserHasPermission;');

      console.log('Stored Procedure Result:', rows); // Log kết quả từ stored procedure

      // Kiểm tra kết quả trả về từ stored procedure
      if (!rows || rows.length === 0 || !rows[0].UserHasPermission) {
        console.error('Không có kết quả từ stored procedure');
        return res.status(500).json({ error: 'Lỗi kiểm tra quyền' });
      }

      // Lấy giá trị từ phần dữ liệu trả về
      const hasPermission = rows[0].UserHasPermission;
      console.log('Permission check result:', hasPermission);

      // Kiểm tra quyền
      if (hasPermission === 0 || !hasPermission) {
        return res.status(403).json({ error: 'Bạn không có quyền truy cập' });
      }

      next(); // Tiếp tục xử lý API nếu có quyền
    } catch (error) {
      console.error('Lỗi trong verifyPermission:', error.message);
      return res.status(500).json({ error: 'Lỗi kiểm tra quyền' });
    }
  };
};

// Middleware: Chỉ cho phép Admin
export const verifyAdmin = (req, res, next) => {
  const { role } = req.user;

  // Kiểm tra nếu người dùng có vai trò 'SuperAdmin' hoặc 'Admin'
  if (role !== 'SuperAdmin' || role !== 'Admin' || role !== 'ContentManager' || role !== 'Admin') {
    return res.status(403).json({ error: 'Bạn không có quyền truy cập' });
  }

  next();
};
