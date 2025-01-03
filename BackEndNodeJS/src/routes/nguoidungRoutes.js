import express from 'express';
import { 
  loginNguoiDung, 
  // getNguoiDung,
  searchAndPaginateNguoiDung,
  getByIdNguoiDung,
  addNguoiDung,
  updateNguoiDung,
  deleteByIdNguoiDung,
  deleteNguoiDung
} from '../controllers/nguoidungController.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import { getByIdThongTinNguoiDung } from '../services/nguoiDungServices.js';

const router = express.Router();

// Route đăng nhập
router.post('/login', loginNguoiDung);

// Route lấy danh sách người dùng (cần xác thực bằng token)
// router.get('/nguoidung', verifyToken, getNguoiDung);

// Route dành riêng cho Admin (ktra xem có phải vai trò admin không)
router.get('/admin/data', verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: 'Đây là dữ liệu chỉ dành cho Admin' });
});

router.get('/nguoidung/search', searchAndPaginateNguoiDung);
router.get('/nguoidung/get-by-id/:id', getByIdNguoiDung);
router.post('/nguoidung/add', addNguoiDung);
router.put('/nguoidung/update/:id', updateNguoiDung);
router.delete('/nguoidung/delete/:id', deleteByIdNguoiDung);
router.delete('/nguoidung/delete', deleteNguoiDung);

router.get('/thongtinnguoidung/get-by-id/:id', getByIdThongTinNguoiDung);


export default router;
