// src/types/congNghe.d.ts
export interface CongNghe {
	ID: number;
	Ten: string;
	TieuDe: string;
	MoTa: string | null;
	LoaiCongNgheID: number;
	Icon: string | null;
	Logo: string | null;
	PhienBan: string;
	STT: number | null;
	Tags: string | null;
	HienThiTrangChu: number;
	HienThiHot: number;
	NgayTao: string;
	NguoiTao: string | null;
	NgayCapNhat: string | null;
	NguoiCapNhat: string | null;
	MetaKeyword: string | null;
	MetaDescription: string | null;
	TrangThai: number;
}

