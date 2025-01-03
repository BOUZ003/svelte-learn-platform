// // File cấu hình kết nối MySQL

// import mysql from 'mysql2';
// import dotenv from 'dotenv';

// dotenv.config();

// // Tạo kết nối với MySQL
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT
// });

// // Kết nối đến MySQL
// db.connect((err) => {
//   if (err) {
//     console.error('Lỗi kết nối đến MySQL:', err);
//     return;
//   }
//   console.log('Đã kết nối đến MySQL!');
// });

// export default db;

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Tạo connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,  // Đảm bảo sẽ đợi kết nối khi kết nối đang được sử dụng
  connectionLimit: 10,       // Giới hạn số kết nối tối đa
  queueLimit: 0              // Không giới hạn số lượng câu lệnh trong queue
});

// Sử dụng pool để thực thi các truy vấn
db.getConnection((err, connection) => {
  if (err) {
    console.error('Lỗi kết nối đến MySQL:', err);
    return;
  }
  console.log('Đã kết nối đến MySQL!');
  connection.release();  // Sau khi sử dụng, trả kết nối lại cho pool
});

// Export pool để sử dụng trong các file khác
export default db;
