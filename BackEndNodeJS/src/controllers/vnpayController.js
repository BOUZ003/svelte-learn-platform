import axios from 'axios';
import crypto from 'crypto';

const VNPAY_MERCHANT_CODE = 'XXT1B1SM'; // Thay thế bằng mã Merchant của bạn
const VNPAY_API_KEY = 'KKXQ98AHB5BX4ZB6J2WRPRNM74PV2W1S'; // Thay thế bằng API Key của bạn
const VNPAY_URL = 'https://sandbox.vnpayment.vn/v2/vnpay.php'; // URL của VNPAY (sandbox hoặc production)

// Hàm tạo yêu cầu thanh toán VNPAY
export const createPayment = async (req, res) => {
  const { orderId, amount, orderType } = req.body;

  // Dữ liệu cần gửi lên VNPAY
  const vnpParams = {
    vnp_TxnRef: orderId, // Mã đơn hàng
    vnp_OrderInfo: orderType,
    vnp_Amount: amount * 100, // Đơn vị là đồng
    vnp_ReturnUrl: 'http://your-website.com/return', // URL để VNPAY gửi kết quả thanh toán về
    vnp_Today: new Date().toISOString().slice(0, 10), // Ngày hiện tại
  };

  // Tạo chữ ký bảo mật
  const secretKey = VNPAY_API_KEY;
  const querystring = new URLSearchParams(vnpParams).toString();
  const hash = crypto.createHmac('sha256', secretKey)
                      .update(querystring)
                      .digest('hex');

  vnpParams.vnp_SecureHash = hash;

  try {
    // Gửi yêu cầu thanh toán đến VNPAY
    const response = await axios.post(VNPAY_URL, new URLSearchParams(vnpParams));
    
    // Trả về URL thanh toán để người dùng chuyển hướng
    res.json({ paymentUrl: response.data });
  } catch (error) {
    console.error('Lỗi khi tạo yêu cầu thanh toán:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Hàm xử lý kết quả thanh toán từ VNPAY
export const handleReturn = (req, res) => {
  const result = req.query;
  const vnpSecureHash = result.vnp_SecureHash;

  // Kiểm tra chữ ký bảo mật
  const isValid = checkSignature(vnpSecureHash, result);
  if (isValid) {
    res.send('Thanh toán thành công');
  } else {
    res.send('Thanh toán thất bại');
  }
};

// Kiểm tra chữ ký bảo mật từ VNPAY
function checkSignature(vnpSecureHash, params) {
  const secretKey = VNPAY_API_KEY;
  const hash = crypto.createHmac('sha256', secretKey)
                      .update(new URLSearchParams(params).toString())
                      .digest('hex');
  return vnpSecureHash === hash;
}
