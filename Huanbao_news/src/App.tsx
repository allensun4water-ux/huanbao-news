import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  List, 
  Clock,
  Search,
  Heart,
  Download,
  RefreshCw,
  Bell,
  Settings,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { Dashboard } from '@/sections/Dashboard';
import { SearchFilter } from '@/sections/SearchFilter';
import { NotificationCard } from '@/sections/NotificationCard';
import { Timeline } from '@/sections/Timeline';
import { ExportPanel } from '@/sections/ExportPanel';
import { useNotifications } from '@/hooks/useNotifications';
import { departments } from '@/data/mockData';
import { NotificationDetail } from '@/sections/NotificationDetail';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// App component

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const {
    notifications,
    filteredNotifications,
    groupedByDate,

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
  } = useNotifications();

  const selectedNotification = selectedNotificationId 
    ? notifications.find(n => n.id === selectedNotificationId) 
    : null;

  // 导航项
  const navItems = [
    { id: 'dashboard', label: '仪表板', icon: LayoutDashboard },
    { id: 'list', label: '通知列表', icon: List },
    { id: 'timeline', label: '时间线', icon: Clock },
    { id: 'favorites', label: '我的收藏', icon: Heart },
    { id: 'export', label: '导出报告', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">环保科技讯息平台</h1>
                <p className="text-xs text-gray-500">政府通知聚合与管理系统</p>
              </div>
            </div>

            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className="gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.id === 'favorites' && favoriteNotifications.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {favoriteNotifications.length}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>

            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

            {/* 右侧操作 */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                更新数据
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>设置</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">监控的部门</h4>
                      <div className="space-y-2">
                        {departments.map((dept) => (
                          <div key={dept.code} className="flex items-center justify-between text-sm">
                            <span>{dept.name}</span>
                            <Badge variant="outline" className="text-xs">已启用</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">数据更新</h4>
                      <p className="text-xs text-gray-500">
                        每日早上 8:30 自动更新
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.id === 'favorites' && favoriteNotifications.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {favoriteNotifications.length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 搜索筛选区 - 在列表和时间线页面显示 */}
        {(activeTab === 'list' || activeTab === 'timeline') && (
          <div className="mb-6">
            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              dateRange={dateRange}
              setDateRange={setDateRange}
              favoritesOnly={favoritesOnly}
              setFavoritesOnly={setFavoritesOnly}
              clearFilters={clearFilters}
            />
          </div>
        )}

        {/* 内容标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* 仪表板 */}
          <TabsContent value="dashboard" className="m-0">
            <Dashboard
              notifications={notifications}
              upcomingDeadlines={upcomingDeadlines}
              onViewNotification={setSelectedNotificationId}
            />
          </TabsContent>

          {/* 通知列表 */}
          <TabsContent value="list" className="m-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  通知列表
                  <Badge variant="secondary" className="ml-2">
                    {filteredNotifications.length}
                  </Badge>
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    清除筛选
                  </Button>
                </div>
              </div>
              
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">没有找到匹配的通知</p>
                  <Button variant="link" onClick={clearFilters}>
                    清除筛选条件
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      searchQuery={searchQuery}
                      onToggleFavorite={toggleFavorite}
                      onAddNote={addNote}
                      onAddTag={addTag}
                      onRemoveTag={removeTag}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* 时间线 */}
          <TabsContent value="timeline" className="m-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  时间线视图
                  <Badge variant="secondary" className="ml-2">
                    {filteredNotifications.length}
                  </Badge>
                </h2>
              </div>
              <Timeline
                groupedNotifications={groupedByDate}
                onToggleFavorite={toggleFavorite}
                onViewNotification={setSelectedNotificationId}
              />
            </div>
          </TabsContent>

          {/* 我的收藏 */}
          <TabsContent value="favorites" className="m-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  我的收藏
                  <Badge variant="secondary" className="ml-2">
                    {favoriteNotifications.length}
                  </Badge>
                </h2>
              </div>
              
              {favoriteNotifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">暂无收藏的通知</p>
                  <p className="text-sm text-gray-400 mt-1">
                    点击通知卡片上的心形图标收藏重要通知
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {favoriteNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onToggleFavorite={toggleFavorite}
                      onAddNote={addNote}
                      onAddTag={addTag}
                      onRemoveTag={removeTag}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* 导出报告 */}
          <TabsContent value="export" className="m-0">
            <ExportPanel
              notifications={notifications}
              filteredNotifications={filteredNotifications}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* 通知详情弹窗 */}
      {selectedNotification && (
        <NotificationDetail
          notification={selectedNotification}
          open={!!selectedNotificationId}
          onOpenChange={(open) => {
            if (!open) setSelectedNotificationId(null);
          }}
          onToggleFavorite={toggleFavorite}
          onAddNote={addNote}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />
      )}

      {/* 页脚 */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              <p>数据来源: 各部委官方网站</p>
              <p className="mt-1">更新时间: 每日早上 8:30</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">数据来源网站:</span>
              <div className="flex flex-wrap gap-2">
                {departments.slice(0, 5).map((dept) => (
                  <a
                    key={dept.code}
                    href={dept.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {dept.name}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
