import express from 'express';
import {
  searchAndPaginateQuyen,
  getByIdQuyen,
  addQuyen,
  updateQuyen,
  deleteByIdQuyen,
  deleteQuyen
} from '../controllers/quyenController.js'; 

const router = express.Router();

router.get('/quyen/search', searchAndPaginateQuyen);
router.get('/quyen/get-by-id/:id', getByIdQuyen);
router.post('/quyen/add', addQuyen);
router.put('/quyen/update/:id', updateQuyen);
router.delete('/quyen/delete/:id', deleteByIdQuyen);
router.delete('/quyen/delete', deleteQuyen);

export default router;
