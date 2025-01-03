export type NguoiDung = {
  ID: number; // ID của người dùng
  TenDangNhap: string; // Tên đăng nhập của người dùng
  Email: string; // Email của người dùng
  SoDienThoai: string; // Số điện thoại
  VaiTro: string; // Tên vai trò (ví dụ: 'Admin', 'User', ...)
  TrangThai: string; // Trạng thái (ví dụ: 'HoatDong' hoặc 'BiKhoa')
  NgayDangKy: string; // Ngày đăng ký (dạng chuỗi)
};
