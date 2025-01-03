export interface LoaiCongNghe {
  ID: number;
  Ten: string;
  TieuDeSEO: string;
  MoTa: string;
  ParentID: number | null;
  ThuTu: number;
  HienThiTrangChu: boolean;
  NgayTao: string;
  NguoiTao: string;
  NgayCapNhat: string;
  NguoiCapNhat: string;
  MetaKeyword: string;
  MetaDescription: string;
  TrangThai: boolean;
}
