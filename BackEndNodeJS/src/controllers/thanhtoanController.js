import db from "../config/db.js";

//true
export const addDonHang = (req, res) => {
  const {
    NguoiDungID,
    Email,
    SoDienThoai,
    TongTien,
    PhuongThucThanhToan,
    TrangThaiThanhToan,
    DataKhoaHoc,
  } = req.body;

  console.log("Payload:", {
    NguoiDungID,
    Email,
    SoDienThoai,
    TongTien,
    PhuongThucThanhToan,
    TrangThaiThanhToan,
    DataKhoaHoc,
  });

  const sql = "CALL add_donhang(?, ?, ?, ?, ?, ?)";
  const params = [
    NguoiDungID,
    Email,
    SoDienThoai,
    TongTien,
    PhuongThucThanhToan,
    TrangThaiThanhToan,
  ];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return res.status(500).json({
        error: "Database query failed",
        details: err.message,
        stack: err.stack,
      });
    }

    if (!result || !result[0] || !result[0][0] || !result[0][0].DonHangID) {
      return res
        .status(500)
        .json({ error: "Stored procedure did not return DonHangID" });
    }

    const DonHangID = result[0][0].DonHangID; 
    console.log("New DonHangID:", DonHangID);

    const detailSql = `
      INSERT INTO ChiTietDonHang (DonHangID, KhoaHocID, TenKhoaHoc, SoLuong, gia)
      VALUES ?
    `;
    const detailParams = DataKhoaHoc.map((item) => [
      DonHangID,
      item.KhoaHocID,
      item.Ten,
      item.SoLuong,
      item.Tien,
    ]);

    db.query(detailSql, [detailParams], (err, detailResult) => {
      if (err) {
        console.error("Error inserting order details:", err);
        return res.status(500).json({
          error: "Failed to insert order details",
          details: err.message,
          stack: err.stack,
        });
      }
    });

    const paymentSql = `
      INSERT INTO ThanhToan (DonHangID, PhuongThucThanhToan, SoTien, TrangThaiThanhToan)
      VALUES (?, ?, ?, ?)
    `;
    const paymentParams = [
      DonHangID,
      PhuongThucThanhToan,
      TongTien,
      TrangThaiThanhToan,
    ];

    db.query(paymentSql, paymentParams, (err, paymentResult) => {
      if (err) {
        console.error("Error inserting payment information:", err);
        return res.status(500).json({
          error: "Failed to insert payment information",
          details: err.message,
          stack: err.stack,
        });
      }

      console.log("Inserted payment information:", paymentResult);
    });

    const deleteCartSql = "CALL delete_cart_by_nguoidungID(?)";
    db.query(deleteCartSql, [NguoiDungID], (err, deleteResult) => {
      if (err) {
        console.error("Error deleting cart:", err);
        return res.status(500).json({
          error: "Failed to delete cart",
          details: err.message,
          stack: err.stack,
        });
      }
    });
  });
};
