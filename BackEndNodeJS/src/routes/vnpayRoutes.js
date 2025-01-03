import express from 'express';
import { createPayment, handleReturn } from '../controllers/vnpayController.js';

const router = express.Router();

// Endpoint để tạo yêu cầu thanh toán
router.post('/vnpay/create-payment', createPayment);

// Endpoint để xử lý kết quả thanh toán từ VNPAY
router.get('/vnpay/return', handleReturn);

export default router;
