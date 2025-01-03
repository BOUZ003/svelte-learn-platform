export interface Quyen {
    ID: number; // AUTO_INCREMENT sẽ tạo ID tự động
    TenQuyen: string; // Tên quyền, không được NULL và phải là duy nhất
    MoTa: string; // Mô tả quyền, có thể là null
    CapDo: string; // Giá trị có thể là 'HeThong' hoặc 'KhoaHoc'
  }
  