import db from '../config/db.js';

export const getCart = (req, res) => {
  const sql = 'SELECT * FROM Cart';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn MySQL:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result); 
  });
};

export const addToCart = (req, res) => {
  const { NguoiDungID, KhoaHocID } = req.body;
  if (!NguoiDungID || !KhoaHocID) {
    return res.status(400).json({ error: 'NguoiDungID và KhoaHocID là bắt buộc' });
  }
  const sql = 'CALL add_to_cart(?, ?)';
  db.query(sql, [NguoiDungID, KhoaHocID], (err, result) => {
    if (err) {
      console.error('Lỗi khi thực thi stored procedure add_to_cart:', err);
      return res.status(500).json({ error: 'Lỗi khi thêm khóa học vào giỏ hàng' });
    }
    res.status(200).json({ message: 'Khóa học đã được thêm vào giỏ hàng hoặc số lượng đã được cập nhật' });
  });
};

export const getCartByUserId = (req, res) => {
  const { NguoiDungID } = req.params;
  if (!NguoiDungID) {
    return res.status(400).json({ error: 'NguoiDungID là bắt buộc' });
  }

  const sql = 'CALL get_cart_by_nguoidung_id(?)';
  db.query(sql, [NguoiDungID], (err, result) => {
    if (err) {
      console.error('Lỗi khi thực thi stored procedure get_cart_by_nguoidung_id:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy giỏ hàng' });
    }

    // Assuming result[0] contains the cart data since it's the first result of the stored procedure
    const cartItems = result[0];
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }

    res.status(200).json({ cartItems });
  });
};

export const addQuantityToCart = (req, res) => {
  const { cartid } = req.params; // Lấy CartID từ URL params
  if (!cartid) {
    return res.status(400).json({ error: 'CartID là bắt buộc' });
  }

  const sql = 'CALL add_soluong_cart(?)';
  db.query(sql, [cartid], (err, result) => {
    if (err) {
      console.error('Lỗi khi thực thi stored procedure add_soluong_cart:', err);
      return res.status(500).json({ error: 'Lỗi khi cập nhật số lượng giỏ hàng' });
    }
    res.status(200).json({ message: 'Số lượng giỏ hàng đã được tăng lên' });
  });
};

export const subtractQuantityFromCart = (req, res) => {
  const { cartid } = req.params; // Lấy CartID từ URL params
  if (!cartid) {
    return res.status(400).json({ error: 'CartID là bắt buộc' });
  }

  const sql = 'CALL subtract_soluong_cart(?)';
  db.query(sql, [cartid], (err, result) => {
    if (err) {
      console.error('Lỗi khi thực thi stored procedure subtract_soluong_cart:', err);
      return res.status(500).json({ error: 'Lỗi khi giảm số lượng giỏ hàng' });
    }
    res.status(200).json({ message: 'Số lượng giỏ hàng đã được giảm' });
  });
};

export const deleteFromCart = (req, res) => {
  const { cartid } = req.params; // Lấy CartID từ URL params

  if (!cartid) {
    return res.status(400).json({ error: 'CartID là bắt buộc' });
  }

  const sql = 'CALL delete_from_cart(?)';
  db.query(sql, [cartid], (err, result) => {
    if (err) {
      console.error('Lỗi khi thực thi stored procedure delete_from_cart:', err);
      return res.status(500).json({ error: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
    }
    res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
  });
};



export const getCartTotalByUserId = (req, res) => {
  const { NguoiDungID } = req.params;

  if (!NguoiDungID) {
    return res.status(400).json({ error: 'NguoiDungID là bắt buộc' });
  }

  // SQL query gọi stored procedure tính tổng tiền của giỏ hàng
  const sql = 'CALL get_cart_total_by_nguoidung_id(?)';
  db.query(sql, [NguoiDungID], (err, result) => {
    if (err) {
      console.error('Lỗi khi thực thi stored procedure get_cart_total_by_nguoidung_id:', err);
      return res.status(500).json({ error: 'Lỗi khi lấy tổng tiền giỏ hàng' });
    }

    // result[0] sẽ chứa kết quả trả về từ stored procedure (tổng tiền giỏ hàng)
    const totalPrice = result[0][0]?.TotalPrice;

    if (totalPrice === null || totalPrice === undefined) {
      return res.status(404).json({ message: 'Giỏ hàng trống hoặc không có dữ liệu' });
    }

    // Trả về tổng tiền giỏ hàng
    res.status(200).json({ totalPrice });
  });
};
