import express from 'express';
import { 
    getVaiTro,
    searchAndPaginateVaiTro,
    getByIdVaiTro,
    addVaiTro,
    updateVaiTro,
    deleteByIdVaiTro,
    deleteVaiTro
} from '../controllers/vaitroController.js';
import { getPermissionsForRole } from '../services/vaitroServices.js';
import { updateVaiTroQuyen } from '../controllers/vaitroquyenController.js'

const router = express.Router();

router.get('/vaitro', getVaiTro); 
router.get('/vaitro/search', searchAndPaginateVaiTro); 
router.get('/vaitro/get-by-id/:id', getByIdVaiTro);
router.post('/vaitro/add', addVaiTro);
router.put('/vaitro/update/:id', updateVaiTro);
router.delete('/vaitro/delete/:id', deleteByIdVaiTro);
router.delete('/vaitro/delete', deleteVaiTro);

router.get('/vaitro/get-prermissions-for-role/:id', getPermissionsForRole);
router.put('/vaitro/update-permissions/:id', updateVaiTroQuyen);

export default router;

