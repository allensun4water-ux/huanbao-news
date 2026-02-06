import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 高亮搜索关键词
export function highlightText(text: string, query: string): string {
  if (!query) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
}

// 转义正则特殊字符
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 提取关键词
export function extractKeywords(text: string): string[] {
  const commonWords = new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']);
  
  const words = text.split(/\s+/);
  const keywords: string[] = [];
  
  for (const word of words) {
    const cleanWord = word.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
    if (cleanWord.length >= 2 && !commonWords.has(cleanWord)) {
      keywords.push(cleanWord);
    }
  }
  
  return [...new Set(keywords)].slice(0, 10);
}

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 计算截止日期剩余天数
export function getDaysUntilDeadline(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(deadline);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 获取截止日期颜色
export function getDeadlineColor(days: number): string {
  if (days < 0) return 'text-gray-500';
  if (days <= 3) return 'text-red-600 font-semibold';
  if (days <= 7) return 'text-orange-500';
  if (days <= 14) return 'text-yellow-600';
  return 'text-green-600';
}

// 获取分类颜色
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    '科技平台升级': 'bg-blue-100 text-blue-800 border-blue-200',
    '技术名录申报': 'bg-green-100 text-green-800 border-green-200',
    '项目申报': 'bg-purple-100 text-purple-800 border-purple-200',
    '政策发布': 'bg-red-100 text-red-800 border-red-200',
    '征求意见': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    '标准公告': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    '行政许可': 'bg-pink-100 text-pink-800 border-pink-200',
    '其他': 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[category] || colors['其他'];
}

// 导出为CSV
export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {});
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// 生成周报数据
export function generateWeeklyReport(notifications: any[]) {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const thisWeekNotifications = notifications.filter(n => {
    const publishDate = new Date(n.publishDate);
    return publishDate >= oneWeekAgo && publishDate <= today;
  });
  
  const byCategory: Record<string, number> = {};
  const byDepartment: Record<string, number> = {};
  
  thisWeekNotifications.forEach(n => {
    byCategory[n.category] = (byCategory[n.category] || 0) + 1;
    byDepartment[n.department] = (byDepartment[n.department] || 0) + 1;
  });
  
  return {
    total: thisWeekNotifications.length,
    byCategory,
    byDepartment,
    notifications: thisWeekNotifications,
  };
}
