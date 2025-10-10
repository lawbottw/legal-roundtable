// Author 介面定義
export interface Author {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  title?: string; // 新增職稱欄位
}