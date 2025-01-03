import express from 'express';
import {addDonHang} from '../controllers/thanhtoanController.js';

const router = express.Router();

router.post('/donhang/add', addDonHang);


export default router;