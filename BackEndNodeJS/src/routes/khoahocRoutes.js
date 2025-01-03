import express from 'express';
import { searchAndPaginateKhoaHoc } from '../controllers/khoahocController.js';

const router = express.Router();

router.get('/khoahoc/search', searchAndPaginateKhoaHoc);

export default router;
