export interface Notification {
  success: boolean;
  message: string;
  data: NotificationData[];
  pagination: NotificationPagination;
}

export interface NotificationData {
  _id: string;
  message: string;
  type: string;
  isRead: boolean;
  createdBy: NotificationDataCreatedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationDataCreatedBy {
  _id: string;
  email: string;
  username: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}