import { writable } from 'svelte/store';

// Lấy thông tin ban đầu từ localStorage
const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const initialRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
const initialUsername = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
const initialUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null; // Lấy ID người dùng

export const token = writable<string | null>(initialToken);
export const isAuthenticated = writable<boolean>(!!initialToken);
export const role = writable<string | null>(initialRole);
export const username = writable<string | null>(initialUsername); // Lưu tên người dùng
export const userId = writable<string | null>(initialUserId); // Lưu ID người dùng

// Hàm đăng nhập
export function login(userToken: string, userRole: string, userName: string, userID: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', userToken);
    localStorage.setItem('role', userRole);
    localStorage.setItem('username', userName); // Lưu tên người dùng
    localStorage.setItem('userId', userID); // Lưu ID người dùng
  }
  token.set(userToken);
  role.set(userRole);
  username.set(userName);
  userId.set(userID); // Cập nhật ID vào store
  isAuthenticated.set(true);
}

// Hàm đăng xuất
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username'); // Xóa tên người dùng
    localStorage.removeItem('userId'); // Xóa ID người dùng
  }
  token.set(null);
  role.set(null);
  username.set(null);
  userId.set(null); // Xóa ID khỏi store
  isAuthenticated.set(false);
}
