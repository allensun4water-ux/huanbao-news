import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Calendar, 
  Building2, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { dashboardStats, departments } from '@/data/mockData';
import { getCategoryColor, getDeadlineColor, getDaysUntilDeadline } from '@/lib/utils';
import type { Notification } from '@/types/notification';

interface DashboardProps {
  notifications: Notification[];
  upcomingDeadlines: Notification[];
  onViewNotification: (id: string) => void;
}

export function Dashboard({ notifications, upcomingDeadlines, onViewNotification }: DashboardProps) {
  const stats = [
    {
      title: '通知总数',
      value: notifications.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '本周新增',
      value: dashboardStats.newThisWeek,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '覆盖部门',
      value: departments.length,
      icon: Building2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '即将截止',
      value: upcomingDeadlines.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  // 按分类统计
  const categoryStats = Object.entries(dashboardStats.byCategory)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  // 按部门统计
  const departmentStats = Object.entries(dashboardStats.byDepartment)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 分类统计 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              通知分类分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryStats.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getCategoryColor(category)}>
                      {category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 flex-1 ml-4">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(count / notifications.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 部门统计 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              活跃部门TOP5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentStats.map(([deptCode, count], index) => {
                const dept = departments.find(d => d.code === deptCode);
                return (
                  <div key={deptCode} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{dept?.name || deptCode}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{count}条</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 即将截止 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            即将截止的申报
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p>暂无即将截止的申报项目</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.slice(0, 5).map((notification) => {
                const daysLeft = getDaysUntilDeadline(notification.deadline!);
                return (
                  <div
                    key={notification.id}
                    onClick={() => onViewNotification(notification.id)}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.department}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <Badge variant="outline" className={getCategoryColor(notification.category)}>
                        {notification.category}
                      </Badge>
                      <span className={`text-sm ${getDeadlineColor(daysLeft)}`}>
                        {daysLeft === 0 ? '今天截止' : 
                         daysLeft < 0 ? '已截止' : 
                         `还剩${daysLeft}天`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
