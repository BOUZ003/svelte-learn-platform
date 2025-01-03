import express from 'express';
import {
    searchAndPaginateLoaiCongNghe, 
    getByIdLoaiCongNghe,
    getByIdAndTenLoaiCongNghe,
    addLoaiCongNghe,
    updateLoaiCongNghe,
    deleteByIdLoaiCongNghe,
    deleteLoaiCongNghe
} from '../controllers/loaicongngheController.js';
import { verifyToken, verifyPermission } from '../middlewares/auth.js';


const router = express.Router();

router.get('/loaicongnghe/search', searchAndPaginateLoaiCongNghe); 
router.get('/loaicongnghe/get-by-id/:id', getByIdLoaiCongNghe); 
router.get('/loaicongnghe/get-by-id-and-ten', getByIdAndTenLoaiCongNghe); 

router.post('/loaicongnghe/add', addLoaiCongNghe);
router.put('/loaicongnghe/update/:id', updateLoaiCongNghe);
router.delete('/loaicongnghe/delete/:id', deleteByIdLoaiCongNghe);
router.delete('/loaicongnghe/delete', deleteLoaiCongNghe);


export default router;
