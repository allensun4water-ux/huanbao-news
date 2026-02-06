import { useState, useCallback, useMemo } from 'react';
import type { Notification, NotificationCategory } from '@/types/notification';
import { mockNotifications } from '@/data/mockData';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<NotificationCategory[]>([]);
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // 收藏/取消收藏
  const toggleFavorite = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, isFavorited: !n.isFavorited } : n
      )
    );
  }, []);

  // 添加笔记
  const addNote = useCallback((id: string, note: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, notes: note } : n
      )
    );
  }, []);

  // 添加标签
  const addTag = useCallback((id: string, tag: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id && !n.tags.includes(tag)
          ? { ...n, tags: [...n.tags, tag] }
          : n
      )
    );
  }, []);

  // 移除标签
  const removeTag = useCallback((id: string, tag: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? { ...n, tags: n.tags.filter(t => t !== tag) }
          : n
      )
    );
  }, []);

  // 过滤通知
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchFields = [
          notification.title,
          notification.summary,
          notification.department,
          ...notification.tags,
          ...notification.keywords,
        ].join(' ').toLowerCase();
        if (!searchFields.includes(query)) {
          return false;
        }
      }

      // 部门过滤
      if (selectedDepartments.length > 0) {
        if (!selectedDepartments.includes(notification.departmentCode)) {
          return false;
        }
      }

      // 分类过滤
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(notification.category)) {
          return false;
        }
      }

      // 日期范围过滤
      if (dateRange.start) {
        if (notification.publishDate < dateRange.start) {
          return false;
        }
      }
      if (dateRange.end) {
        if (notification.publishDate > dateRange.end) {
          return false;
        }
      }

      // 仅收藏
      if (favoritesOnly && !notification.isFavorited) {
        return false;
      }

      return true;
    });
  }, [notifications, searchQuery, selectedDepartments, selectedCategories, dateRange, favoritesOnly]);

  // 按日期分组
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filteredNotifications.forEach(notification => {
      const date = notification.publishDate;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, items]) => ({ date, notifications: items }));
  }, [filteredNotifications]);

  // 按部门分组
  const groupedByDepartment = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filteredNotifications.forEach(notification => {
      const dept = notification.department;
      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(notification);
    });
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([department, items]) => ({ department, notifications: items }));
  }, [filteredNotifications]);

  // 获取即将截止的通知
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return notifications
      .filter(n => n.deadline && new Date(n.deadline) >= today && new Date(n.deadline) <= thirtyDaysLater)
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());
  }, [notifications]);

  // 获取收藏的通知
  const favoriteNotifications = useMemo(() => {
    return notifications.filter(n => n.isFavorited);
  }, [notifications]);

  // 清除所有过滤器
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedDepartments([]);
    setSelectedCategories([]);
    setDateRange({});
    setFavoritesOnly(false);
  }, []);

  return {
    notifications,
    filteredNotifications,
    groupedByDate,
    groupedByDepartment,
    upcomingDeadlines,
    favoriteNotifications,
    searchQuery,
    setSearchQuery,
    selectedDepartments,
    setSelectedDepartments,
    selectedCategories,
    setSelectedCategories,
    dateRange,
    setDateRange,
    favoritesOnly,
    setFavoritesOnly,
    toggleFavorite,
    addNote,
    addTag,
    removeTag,
    clearFilters,
  };
}
