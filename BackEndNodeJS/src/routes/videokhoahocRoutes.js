import express from 'express';
import { getVideoAndOthersById } from '../services/courseVideoCustomerServices.js';

const router = express.Router();

router.get('/videokhoahoc/:videoId/:courseId', getVideoAndOthersById); 

export default router;
