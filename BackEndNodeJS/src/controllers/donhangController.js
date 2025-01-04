import db from '../config/db.js';

//true
export const getDonHangByUserID = (req, res) => {
  const userID = req.params.userID || req.body.userID; 

  if (!userID) {
    return res.status(400).json({ error: 'Thiếu NguoiDungID' });
  }

  const sql = 'CALL get_order_details_by_User_ID(?)';

  db.query(sql, [userID], (err, result) => {
    if (err) {
      console.error('Lỗi khi gọi stored procedure:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }
    res.json(result[0]);
  });
};

export const getOrderDetails = (req, res) => {
  const { orderId } = req.params; // Get the orderId from URL parameters
  
  // Query to call the stored procedure
  const sql = 'CALL GetOrderDetails(?)';
  
  db.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn MySQL:', err);
      res.status(500).json({ error: 'Lỗi khi lấy dữ liệu từ cơ sở dữ liệu' });
      return;
    }

    // Assuming the result of the stored procedure is in result[0]
    res.json(result[0]); 
  });
};