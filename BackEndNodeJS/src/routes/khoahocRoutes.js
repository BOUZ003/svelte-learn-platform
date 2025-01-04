import express from 'express';
import { searchAndPaginateKhoaHoc, getKhoaHocById } from '../controllers/khoahocController.js';
import { getPurchasedCoursesByStudent } from '../services/MyLearningCustomerServices.js';

const router = express.Router();

router.get('/khoahoc/search', searchAndPaginateKhoaHoc);

// Đã mua của học viên
router.get('/khoahoc/purchased/:id', getPurchasedCoursesByStudent);

router.get('/khoahoc/get-by-id/:id', getKhoaHocById);


export default router;
