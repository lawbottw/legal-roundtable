import { User } from "firebase/auth";

// 客戶端：從 localStorage 獲取允許的管理員列表
export const getAdminEmails = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('adminEmails');
  return stored ? JSON.parse(stored) : [];
};

// 檢查用戶是否為管理員
export const isAdmin = (user: User | null): boolean => {
  if (!user?.email) return false;
  const adminEmails = getAdminEmails();
  return adminEmails.includes(user.email);
};
