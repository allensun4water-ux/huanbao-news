// 通知类型定义

export interface Notification {
  id: string;
  title: string;
  department: string;
  departmentCode: string;
  publishDate: string;
  deadline?: string;
  category: NotificationCategory;
  summary: string;
  content: string;
  originalUrl: string;
  attachments?: Attachment[];
  tags: string[];
  isFavorited: boolean;
  notes?: string;
  keywords: string[];
  fundingAmount?: string;
}

export interface Attachment {
  name: string;
  url: string;
  size?: string;
}

export type NotificationCategory = 
  | '科技平台升级'
  | '技术名录申报'
  | '项目申报'
  | '政策发布'
  | '征求意见'
  | '标准公告'
  | '行政许可'
  | '其他';

export interface Department {
  code: string;
  name: string;
  url: string;
  icon?: string;
}

export interface FilterOptions {
  departments: string[];
  categories: NotificationCategory[];
  dateRange: {
    start?: string;
    end?: string;
  };
  keywords: string[];
}

export interface DashboardStats {
  totalNotifications: number;
  newThisWeek: number;
  byDepartment: Record<string, number>;
  byCategory: Record<string, number>;
  upcomingDeadlines: number;
}

export interface TimelineEvent {
  date: string;
  notifications: Notification[];
}

export interface UserPreferences {
  favoriteIds: string[];
  customTags: string[];
  notes: Record<string, string>;
}
