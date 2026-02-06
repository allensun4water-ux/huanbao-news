import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  ExternalLink, 
  Calendar, 
  Building2, 
  Clock,
  Banknote,
  FileText,
  Edit3,
  Tag,
  Link as LinkIcon,
  Download,
  Share2,
  Printer
} from 'lucide-react';
import type { Notification } from '@/types/notification';
import { getCategoryColor, getDaysUntilDeadline, getDeadlineColor } from '@/lib/utils';
import { useState } from 'react';

interface NotificationDetailProps {
  notification: Notification;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
}

export function NotificationDetail({
  notification,
  open,
  onOpenChange,
  onToggleFavorite,
  onAddNote,
  onAddTag,
  onRemoveTag,
}: NotificationDetailProps) {
  const [noteText, setNoteText] = useState(notification.notes || '');
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState('content');

  const daysUntilDeadline = notification.deadline 
    ? getDaysUntilDeadline(notification.deadline)
    : null;

  const handleSaveNote = () => {
    onAddNote(notification.id, noteText);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(notification.id, newTag.trim());
      setNewTag('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: notification.title,
          text: notification.summary,
          url: notification.originalUrl,
        });
      } catch (err) {
        console.log('分享失败:', err);
      }
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(notification.originalUrl);
      alert('链接已复制到剪贴板');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className={getCategoryColor(notification.category)}>
                  {notification.category}
                </Badge>
                {notification.fundingAmount && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Banknote className="w-3 h-3 mr-1" />
                    {notification.fundingAmount}
                  </Badge>
                )}
                {daysUntilDeadline !== null && (
                  <Badge 
                    variant="outline" 
                    className={daysUntilDeadline <= 3 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                    }
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {daysUntilDeadline < 0 ? '已截止' : 
                     daysUntilDeadline === 0 ? '今天截止' : 
                     `还剩${daysUntilDeadline}天`}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl leading-relaxed font-semibold">
                {notification.title}
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrint}
                title="打印"
              >
                <Printer className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                title="分享"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant={notification.isFavorited ? "default" : "ghost"}
                size="icon"
                onClick={() => onToggleFavorite(notification.id)}
                title={notification.isFavorited ? '取消收藏' : '收藏'}
              >
                <Heart className={`w-5 h-5 ${notification.isFavorited ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {notification.department}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              发布: {notification.publishDate}
            </span>
            {notification.deadline && (
              <span className={`flex items-center gap-1 ${getDeadlineColor(daysUntilDeadline || 0)}`}>
                <Clock className="w-4 h-4" />
                截止: {notification.deadline}
              </span>
            )}
          </div>
        </div>

        {/* 标签页内容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="w-full justify-start rounded-none border-b bg-gray-50 px-6">
            <TabsTrigger value="content" className="gap-2">
              <FileText className="w-4 h-4" />
              通知内容
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-2">
              <Edit3 className="w-4 h-4" />
              个人笔记
              {notification.notes && (
                <Badge variant="secondary" className="ml-1 text-xs">已添加</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tags" className="gap-2">
              <Tag className="w-4 h-4" />
              标签管理
            </TabsTrigger>
          </TabsList>

          <div className="overflow-y-auto max-h-[calc(95vh-280px)]">
            <TabsContent value="content" className="m-0 p-6 space-y-6">
              {/* 摘要 */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  通知摘要
                </h4>
                <p className="text-blue-800">{notification.summary}</p>
              </div>

              {/* 详细内容 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">详细内容</h4>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {notification.content}
                </div>
              </div>

              {/* 关键词 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">关键词</h4>
                <div className="flex flex-wrap gap-2">
                  {notification.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 附件 */}
              {notification.attachments && notification.attachments.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    相关附件
                  </h4>
                  <div className="space-y-2">
                    {notification.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{att.name}</p>
                          {att.size && <p className="text-sm text-gray-500">{att.size}</p>}
                        </div>
                        <Download className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 原文链接 */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <a
                  href={notification.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full gap-2">
                    <ExternalLink className="w-4 h-4" />
                    访问原文链接
                  </Button>
                </a>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="m-0 p-6">
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    添加个人笔记
                  </h4>
                  <p className="text-sm text-yellow-700">
                    记录重要信息、截止日期提醒、申报要点等，方便后续查阅。
                  </p>
                </div>
                <Textarea
                  placeholder="在此输入您的笔记..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    取消
                  </Button>
                  <Button onClick={handleSaveNote}>
                    保存笔记
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tags" className="m-0 p-6">
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                  <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    管理标签
                  </h4>
                  <p className="text-sm text-purple-700">
                    为通知添加自定义标签，方便分类和搜索。
                  </p>
                </div>

                {/* 当前标签 */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">当前标签</h5>
                  <div className="flex flex-wrap gap-2">
                    {notification.tags.length === 0 ? (
                      <p className="text-gray-500 text-sm">暂无标签</p>
                    ) : (
                      notification.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 text-sm py-1 px-3">
                          {tag}
                          <button
                            onClick={() => onRemoveTag(notification.id, tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* 添加标签 */}
                <div className="flex gap-2">
                  <Input
                    placeholder="输入新标签..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag}>
                    添加
                  </Button>
                </div>

                {/* 推荐标签 */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3">推荐标签</h5>
                  <div className="flex flex-wrap gap-2">
                    {['重要', '紧急', '待办', '已读', '项目申报', '政策解读', '技术标准'].map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          if (!notification.tags.includes(tag)) {
                            onAddTag(notification.id, tag);
                          }
                        }}
                      >
                        + {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* 底部操作栏 */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={notification.isFavorited ? "default" : "outline"}
              onClick={() => onToggleFavorite(notification.id)}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${notification.isFavorited ? 'fill-current' : ''}`} />
              {notification.isFavorited ? '已收藏' : '收藏'}
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              分享
            </Button>
          </div>
          <a
            href={notification.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="gap-2">
              <LinkIcon className="w-4 h-4" />
              访问原文
            </Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
