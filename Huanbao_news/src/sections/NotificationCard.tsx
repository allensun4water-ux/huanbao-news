import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  ExternalLink, 
  Calendar, 
  Building2, 
  Clock,
  Banknote,
  FileText,
  Edit3
} from 'lucide-react';
import type { Notification } from '@/types/notification';
import { 
  getCategoryColor, 
  formatDate, 
  getDaysUntilDeadline, 
  getDeadlineColor,
  highlightText 
} from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NotificationCardProps {
  notification: Notification;
  searchQuery?: string;
  onToggleFavorite: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
  onAddTag: (id: string, tag: string) => void;
  onRemoveTag: (id: string, tag: string) => void;
}

export function NotificationCard({
  notification,
  searchQuery = '',
  onToggleFavorite,
  onAddNote,
  onAddTag,
  onRemoveTag,
}: NotificationCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState(notification.notes || '');
  const [newTag, setNewTag] = useState('');

  const daysUntilDeadline = notification.deadline 
    ? getDaysUntilDeadline(notification.deadline)
    : null;

  const handleSaveNote = () => {
    onAddNote(notification.id, noteText);
    setShowNoteDialog(false);
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(notification.id, newTag.trim());
      setNewTag('');
    }
  };

  const highlightedTitle = searchQuery 
    ? highlightText(notification.title, searchQuery)
    : notification.title;

  const highlightedSummary = searchQuery
    ? highlightText(notification.summary, searchQuery)
    : notification.summary;

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
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
                {daysUntilDeadline !== null && daysUntilDeadline >= 0 && daysUntilDeadline <= 7 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <Clock className="w-3 h-3 mr-1" />
                    {daysUntilDeadline === 0 ? '今天截止' : `剩${daysUntilDeadline}天`}
                  </Badge>
                )}
              </div>
              <h3 
                className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                onClick={() => setShowDetails(true)}
                dangerouslySetInnerHTML={{ __html: highlightedTitle }}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite(notification.id)}
              className="shrink-0"
            >
              <Heart 
                className={`w-5 h-5 transition-colors ${
                  notification.isFavorited 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-400 hover:text-red-400'
                }`} 
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p 
            className="text-sm text-gray-600 line-clamp-2 mb-3"
            dangerouslySetInnerHTML={{ __html: highlightedSummary }}
          />
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {notification.department}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              发布: {formatDate(notification.publishDate)}
            </span>
            {notification.deadline && (
              <span className={`flex items-center gap-1 ${getDeadlineColor(daysUntilDeadline || 0)}`}>
                <Clock className="w-3 h-3" />
                截止: {notification.deadline}
              </span>
            )}
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {notification.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
                <button
                  onClick={() => onRemoveTag(notification.id, tag)}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
            <div className="flex items-center gap-1">
              <Input
                placeholder="+ 标签"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                className="w-20 h-6 text-xs"
              />
            </div>
          </div>

          {/* 笔记提示 */}
          {notification.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3">
              <div className="flex items-center gap-1 text-xs text-yellow-700 mb-1">
                <Edit3 className="w-3 h-3" />
                <span>个人笔记</span>
              </div>
              <p className="text-xs text-yellow-800 line-clamp-2">{notification.notes}</p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => setShowDetails(true)}
            >
              <FileText className="w-4 h-4 mr-1" />
              查看详情
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNoteDialog(true)}
            >
              <Edit3 className="w-4 h-4 mr-1" />
              {notification.notes ? '编辑笔记' : '添加笔记'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(notification.originalUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              原文链接
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 详情弹窗 */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl leading-relaxed">
              {notification.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={getCategoryColor(notification.category)}>
                {notification.category}
              </Badge>
              {notification.fundingAmount && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Banknote className="w-3 h-3 mr-1" />
                  资助金额: {notification.fundingAmount}
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">发布部门:</span>
                <span className="ml-2 font-medium">{notification.department}</span>
              </div>
              <div>
                <span className="text-gray-500">发布日期:</span>
                <span className="ml-2 font-medium">{notification.publishDate}</span>
              </div>
              {notification.deadline && (
                <div>
                  <span className="text-gray-500">截止日期:</span>
                  <span className={`ml-2 font-medium ${getDeadlineColor(daysUntilDeadline || 0)}`}>
                    {notification.deadline}
                    {daysUntilDeadline !== null && (
                      <span className="ml-1">
                        ({daysUntilDeadline < 0 ? '已截止' : `还剩${daysUntilDeadline}天`})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">通知摘要</h4>
              <p className="text-gray-700">{notification.summary}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">详细内容</h4>
              <div className="text-gray-700 whitespace-pre-line">
                {notification.content}
              </div>
            </div>

            {notification.attachments && notification.attachments.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">相关附件</h4>
                <div className="space-y-2">
                  {notification.attachments.map((att, idx) => (
                    <a
                      key={idx}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      {att.name}
                      {att.size && <span className="text-gray-500">({att.size})</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 mb-2">关键词</h4>
              <div className="flex flex-wrap gap-2">
                {notification.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant={notification.isFavorited ? "default" : "outline"}
                onClick={() => onToggleFavorite(notification.id)}
                className="flex-1"
              >
                <Heart className={`w-4 h-4 mr-2 ${notification.isFavorited ? 'fill-current' : ''}`} />
                {notification.isFavorited ? '已收藏' : '收藏'}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(notification.originalUrl, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                访问原文
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 笔记弹窗 */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加个人笔记</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="记录重要信息、截止日期提醒、申报要点等..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={5}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                取消
              </Button>
              <Button onClick={handleSaveNote}>
                保存笔记
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
