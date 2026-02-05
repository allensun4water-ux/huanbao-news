import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search, 
  X, 
  Calendar as CalendarIcon,
  Heart,
  Building2,
  Tag
} from 'lucide-react';
import { departments } from '@/data/mockData';
import type { NotificationCategory } from '@/types/notification';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDepartments: string[];
  setSelectedDepartments: (depts: string[]) => void;
  selectedCategories: NotificationCategory[];
  setSelectedCategories: (cats: NotificationCategory[]) => void;
  dateRange: { start?: string; end?: string };
  setDateRange: (range: { start?: string; end?: string }) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (value: boolean) => void;
  clearFilters: () => void;
}

const categories: NotificationCategory[] = [
  '科技平台升级',
  '技术名录申报',
  '项目申报',
  '政策发布',
  '征求意见',
  '标准公告',
  '行政许可',
  '其他',
];

export function SearchFilter({
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
  clearFilters,
}: SearchFilterProps) {
  const hasActiveFilters = 
    searchQuery || 
    selectedDepartments.length > 0 || 
    selectedCategories.length > 0 ||
    dateRange.start ||
    dateRange.end ||
    favoritesOnly;

  const toggleDepartment = (code: string) => {
    if (selectedDepartments.includes(code)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== code));
    } else {
      setSelectedDepartments([...selectedDepartments, code]);
    }
  };

  const toggleCategory = (category: NotificationCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索通知标题、内容、标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <Button
          variant={favoritesOnly ? "default" : "outline"}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className="gap-2"
        >
          <Heart className={`w-4 h-4 ${favoritesOnly ? 'fill-current' : ''}`} />
          仅收藏
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            清除筛选
          </Button>
        )}
      </div>

      {/* 筛选器 */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        {/* 部门筛选 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">按部门筛选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <Badge
                key={dept.code}
                variant={selectedDepartments.includes(dept.code) ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => toggleDepartment(dept.code)}
              >
                {dept.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* 分类筛选 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">按分类筛选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* 日期范围 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">发布日期范围</span>
          </div>
          <div className="flex gap-2 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.start && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.start ? format(new Date(dateRange.start), 'yyyy-MM-dd') : '开始日期'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.start ? new Date(dateRange.start) : undefined}
                  onSelect={(date) => setDateRange({ ...dateRange, start: date?.toISOString().split('T')[0] })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="text-gray-500">至</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.end && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.end ? format(new Date(dateRange.end), 'yyyy-MM-dd') : '结束日期'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.end ? new Date(dateRange.end) : undefined}
                  onSelect={(date) => setDateRange({ ...dateRange, end: date?.toISOString().split('T')[0] })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {(dateRange.start || dateRange.end) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDateRange({})}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 活跃筛选标签 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">当前筛选:</span>
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              搜索: {searchQuery}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
            </Badge>
          )}
          {selectedDepartments.map((code) => {
            const dept = departments.find(d => d.code === code);
            return (
              <Badge key={code} variant="secondary" className="gap-1">
                {dept?.name}
                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleDepartment(code)} />
              </Badge>
            );
          })}
          {selectedCategories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1">
              {cat}
              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
            </Badge>
          ))}
          {dateRange.start && (
            <Badge variant="secondary" className="gap-1">
              从: {dateRange.start}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setDateRange({ ...dateRange, start: undefined })} />
            </Badge>
          )}
          {dateRange.end && (
            <Badge variant="secondary" className="gap-1">
              至: {dateRange.end}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setDateRange({ ...dateRange, end: undefined })} />
            </Badge>
          )}
          {favoritesOnly && (
            <Badge variant="secondary" className="gap-1">
              仅收藏
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFavoritesOnly(false)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
