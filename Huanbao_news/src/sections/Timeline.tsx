import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  ChevronRight,
  Building2,
  Tag
} from 'lucide-react';
import type { Notification } from '@/types/notification';
import { getCategoryColor, getDaysUntilDeadline, getDeadlineColor } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TimelineProps {
  groupedNotifications: { date: string; notifications: Notification[] }[];
  onToggleFavorite: (id: string) => void;
  onViewNotification: (id: string) => void;
}

export function Timeline({ groupedNotifications, onToggleFavorite, onViewNotification }: TimelineProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  if (groupedNotifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">暂无通知数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedNotifications.map(({ date, notifications }) => (
        <div key={date} className="relative">
          {/* 日期标题 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
              {new Date(date).getDate()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {new Date(date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long',
                })}
              </h3>
              <p className="text-sm text-gray-500">{notifications.length} 条通知</p>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* 通知列表 */}
          <div className="space-y-3 ml-6 pl-10 border-l-2 border-gray-200">
            {notifications.map((notification) => {
              const daysUntilDeadline = notification.deadline 
                ? getDaysUntilDeadline(notification.deadline)
                : null;

              return (
                <div key={notification.id} className="relative">
                  {/* 时间点 */}
                  <div className="absolute -left-[45px] w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                  
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedNotification(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="outline" className={getCategoryColor(notification.category)}>
                              {notification.category}
                            </Badge>
                            {notification.fundingAmount && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {notification.fundingAmount}
                              </Badge>
                            )}
                            {daysUntilDeadline !== null && daysUntilDeadline >= 0 && daysUntilDeadline <= 7 && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <Clock className="w-3 h-3 mr-1" />
                                {daysUntilDeadline === 0 ? '今天截止' : `剩${daysUntilDeadline}天`}
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {notification.department}
                            </span>
                            {notification.deadline && (
                              <span className={`flex items-center gap-1 ${getDeadlineColor(daysUntilDeadline || 0)}`}>
                                <Clock className="w-3 h-3" />
                                截止: {notification.deadline}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {notification.summary}
                          </p>
                          {notification.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {notification.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {notification.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{notification.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* 详情弹窗 */}
      <Dialog open={!!selectedNotification} onOpenChange={() => setSelectedNotification(null)}>
        {selectedNotification && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg leading-relaxed">
                {selectedNotification.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={getCategoryColor(selectedNotification.category)}>
                  {selectedNotification.category}
                </Badge>
                {selectedNotification.fundingAmount && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    资助: {selectedNotification.fundingAmount}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">发布部门:</span>
                  <span className="ml-2 font-medium">{selectedNotification.department}</span>
                </div>
                <div>
                  <span className="text-gray-500">发布日期:</span>
                  <span className="ml-2 font-medium">{selectedNotification.publishDate}</span>
                </div>
                {selectedNotification.deadline && (
                  <div>
                    <span className="text-gray-500">截止日期:</span>
                    <span className={`ml-2 font-medium ${getDeadlineColor(getDaysUntilDeadline(selectedNotification.deadline))}`}>
                      {selectedNotification.deadline}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">通知摘要</h4>
                <p className="text-gray-700">{selectedNotification.summary}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">详细内容</h4>
                <div className="text-gray-700 whitespace-pre-line">
                  {selectedNotification.content}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant={selectedNotification.isFavorited ? "default" : "outline"}
                  onClick={() => onToggleFavorite(selectedNotification.id)}
                  className="flex-1"
                >
                  {selectedNotification.isFavorited ? '已收藏' : '收藏'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onViewNotification(selectedNotification.id)}
                  className="flex-1"
                >
                  查看完整详情
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
