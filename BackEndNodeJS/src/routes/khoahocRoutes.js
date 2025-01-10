import express from 'express';
import { searchAndPaginateKhoaHoc, getKhoaHocById, searchKhoaHocByNguoiTao } from '../controllers/khoahocController.js';
import { getPurchasedCoursesByStudent } from '../services/MyLearningCustomerServices.js';

const router = express.Router();

router.get('/khoahoc/search', searchAndPaginateKhoaHoc);

// Đã mua của học viên
router.get('/khoahoc/purchased/:id', getPurchasedCoursesByStudent);

router.get('/khoahoc/get-by-id/:id', getKhoaHocById);

//giangr vieen
router.get('/khoahoc/search-by-intructor/:id', searchKhoaHocByNguoiTao);



export default router;
