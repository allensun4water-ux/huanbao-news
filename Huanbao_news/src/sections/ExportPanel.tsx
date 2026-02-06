import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar,
  TrendingUp,
  PieChart,
  Building2,
  Tag
} from 'lucide-react';
import type { Notification } from '@/types/notification';
import { exportToCSV, generateWeeklyReport } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExportPanelProps {
  notifications: Notification[];
  filteredNotifications: Notification[];
}

export function ExportPanel({ notifications, filteredNotifications }: ExportPanelProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState<'weekly' | 'monthly'>('weekly');

  // 导出为Excel/CSV
  const handleExportCSV = () => {
    const exportData = filteredNotifications.map(n => ({
      标题: n.title,
      部门: n.department,
      分类: n.category,
      发布日期: n.publishDate,
      截止日期: n.deadline || '-',
      资助金额: n.fundingAmount || '-',
      摘要: n.summary,
      原文链接: n.originalUrl,
      标签: n.tags.join(', '),
    }));
    
    const filename = `环保科技通知_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(exportData, filename);
  };

  // 生成周报
  const weeklyReport = generateWeeklyReport(notifications);

  // 生成月报数据
  const monthlyReport = (() => {
    const today = new Date();
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisMonthNotifications = notifications.filter(n => {
      const publishDate = new Date(n.publishDate);
      return publishDate >= oneMonthAgo && publishDate <= today;
    });
    
    const byCategory: Record<string, number> = {};
    const byDepartment: Record<string, number> = {};
    
    thisMonthNotifications.forEach(n => {
      byCategory[n.category] = (byCategory[n.category] || 0) + 1;
      byDepartment[n.department] = (byDepartment[n.department] || 0) + 1;
    });
    
    return {
      total: thisMonthNotifications.length,
      byCategory,
      byDepartment,
      notifications: thisMonthNotifications,
    };
  })();

  return (
    <div className="space-y-6">
      {/* 导出选项 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              导出数据
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              将当前筛选结果导出为CSV格式，可在Excel中打开编辑。
            </p>
            <div className="text-sm text-gray-500">
              共 <span className="font-medium text-gray-900">{filteredNotifications.length}</span> 条记录待导出
            </div>
            <Button onClick={handleExportCSV} className="w-full gap-2">
              <Download className="w-4 h-4" />
              导出为CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              生成报告
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              生成周报或月报，汇总通知数据和统计分析结果。
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => { setPreviewType('weekly'); setShowPreview(true); }}
                className="flex-1 gap-2"
              >
                <Calendar className="w-4 h-4" />
                周报预览
              </Button>
              <Button 
                variant="outline"
                onClick={() => { setPreviewType('monthly'); setShowPreview(true); }}
                className="flex-1 gap-2"
              >
                <Calendar className="w-4 h-4" />
                月报预览
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 数据统计概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            数据统计概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                按分类统计
              </h4>
              <div className="space-y-2">
                {Object.entries(
                  filteredNotifications.reduce((acc, n) => {
                    acc[n.category] = (acc[n.category] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium">{count}条</span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                按部门统计
              </h4>
              <div className="space-y-2">
                {Object.entries(
                  filteredNotifications.reduce((acc, n) => {
                    acc[n.department] = (acc[n.department] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([dept, count]) => (
                    <div key={dept} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate max-w-[150px]">{dept}</span>
                      <span className="font-medium">{count}条</span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                热门标签
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  filteredNotifications.flatMap(n => n.tags).reduce((acc, tag) => {
                    acc[tag] = (acc[tag] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([tag, count]) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag} ({count})
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 报告预览弹窗 */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewType === 'weekly' ? '周报预览' : '月报预览'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">概览</TabsTrigger>
              <TabsTrigger value="byCategory">分类统计</TabsTrigger>
              <TabsTrigger value="details">详细列表</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-4">
              {previewType === 'weekly' ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">环保科技讯息周报</h4>
                    <p className="text-sm text-blue-700">
                      统计周期: {new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')} 至 {new Date().toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-gray-900">{weeklyReport.total}</p>
                      <p className="text-sm text-gray-600">本周新增通知</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {Object.keys(weeklyReport.byDepartment).length}
                      </p>
                      <p className="text-sm text-gray-600">涉及部门数</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900 mb-2">环保科技讯息月报</h4>
                    <p className="text-sm text-purple-700">
                      统计周期: {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')} 至 {new Date().toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-gray-900">{monthlyReport.total}</p>
                      <p className="text-sm text-gray-600">本月新增通知</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-gray-900">
                        {Object.keys(monthlyReport.byDepartment).length}
                      </p>
                      <p className="text-sm text-gray-600">涉及部门数</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="byCategory">
              <div className="space-y-2">
                {(previewType === 'weekly' ? weeklyReport : monthlyReport).byCategory &&
                  Object.entries((previewType === 'weekly' ? weeklyReport : monthlyReport).byCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{category}</span>
                        <Badge>{count}条</Badge>
                      </div>
                    ))
                }
              </div>
            </TabsContent>
            
            <TabsContent value="details">
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {(previewType === 'weekly' ? weeklyReport : monthlyReport).notifications
                  .slice(0, 20)
                  .map((n) => (
                    <div key={n.id} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">{n.title}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span>{n.department}</span>
                        <span>•</span>
                        <span>{n.category}</span>
                        <span>•</span>
                        <span>{n.publishDate}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(false)}
              className="flex-1"
            >
              关闭
            </Button>
            <Button 
              onClick={() => {
                const report = previewType === 'weekly' ? weeklyReport : monthlyReport;
                const exportData = report.notifications.map(n => ({
                  标题: n.title,
                  部门: n.department,
                  分类: n.category,
                  发布日期: n.publishDate,
                  截止日期: n.deadline || '-',
                  摘要: n.summary,
                }));
                const filename = `环保科技${previewType === 'weekly' ? '周报' : '月报'}_${new Date().toISOString().split('T')[0]}.csv`;
                exportToCSV(exportData, filename);
              }}
              className="flex-1 gap-2"
            >
              <Download className="w-4 h-4" />
              下载报告
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
