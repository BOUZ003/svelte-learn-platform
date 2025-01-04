import express from 'express';
import { getDonHangByUserID,getOrderDetails } from '../controllers/donhangController.js';

const router = express.Router();

// Định nghĩa route để lấy thông tin đơn hàng của người dùng theo NguoiDungID
router.get('/donhang/:userID', getDonHangByUserID);

router.get('/chitietdonhang/:orderId', getOrderDetails);


export default router;
