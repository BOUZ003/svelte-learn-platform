import express from 'express';
import {
  getCart, 
  addToCart, 
  getCartByUserId,
  addQuantityToCart, 
  subtractQuantityFromCart ,
  deleteFromCart,

  getCartTotalByUserId
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/cart', getCart);
router.post('/cart/add', addToCart);
router.get('/cart/:NguoiDungID', getCartByUserId);
router.put('/cart/increase/:cartid', addQuantityToCart);
router.put('/cart/decrease/:cartid', subtractQuantityFromCart);
router.delete('/cart/delete/:cartid', deleteFromCart);
router.get('/cart/total/:NguoiDungID', getCartTotalByUserId);


export default router;
