import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

# 采集目标：住建部政策通知
def fetch_housing_policies():
    url = "https://www.mohurd.gov.cn/zhengce/zhengcefile/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        policies = []
        # 根据实际网页结构调整选择器
        items = soup.select('.list-item') or soup.select('tr')[1:6]  # 示例选择器
        
        for item in items[:5]:  # 只取前5条
            title = item.get_text(strip=True)
            link = item.find('a')['href'] if item.find('a') else ''
            date = datetime.now().strftime('%Y-%m-%d')
            
            policies.append({
                'title': title,
                'link': link,
                'date': date,
                'source': '住房和城乡建设部'
            })
        
        return policies
    except Exception as e:
        print(f"采集失败: {e}")
        return []

# 生成新的HTML页面
def generate_html(policies):
    # 读取Kimi原版的模板（假设你保存为 template.html）
    try:
        with open('template.html', 'r', encoding='utf-8') as f:
            template = f.read()
    except:
        # 如果找不到模板，使用基础版本
        template = None
    
    if template:
        # 在模板中找到政策列表的位置，插入新数据
        # 这里需要根据Kimi的具体HTML结构调整
        policy_html = generate_kimi_style_cards(policies)
        
        # 替换模板中的占位符或旧内容
        # 假设Kimi的模板中有 <!-- POLICY_LIST --> 标记
        final_html = template.replace('<!-- POLICY_LIST -->', policy_html)
        
        # 更新页面底部的"最后更新时间"
        final_html = final_html.replace(
            'id="update-time">', 
            f'id="update-time">{datetime.now().strftime("%Y年%m月%d日 %H:%M")}'
        )
    else:
        # 备用简单版本
        final_html = generate_simple_html(policies)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(final_html)

def generate_kimi_style_cards(policies):
    """生成Kimi风格的政策卡片HTML"""
    if not policies:
        return '<div class="empty-state">暂无最新政策，请稍后查看</div>'
    
    cards = ''
    for p in policies:
        # 这里需要根据Kimi的实际CSS类名调整
        cards += f'''
        <div class="policy-card" data-aos="fade-up">
            <div class="card-header">
                <span class="tag">{p['source']}</span>
                <span class="date">{p['date']}</span>
            </div>
            <h3 class="title">{p['title']}</h3>
            <div class="meta">
                <span class="countdown">⏰ 征求意见还剩 <strong>23</strong> 天</span>
                <a href="{p['link']}" target="_blank" class="btn-detail">查看详情 →</a>
            </div>
        </div>
        '''
    return cards
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>环保科技讯息平台 - 自动更新</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f7fa; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
        .update-time { color: #666; font-size: 14px; margin-bottom: 20px; text-align: center; }
        .policy-card { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .policy-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .policy-title { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 8px; }
        .policy-meta { color: #666; font-size: 14px; display: flex; gap: 15px; }
        .tag { background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
        .countdown { color: #f44336; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏛️ 环保科技政策资讯平台</h1>
        <p>每日自动采集 | 实时更新</p>
    </div>
    
    <div class="update-time">🔄 最后更新时间：""" + datetime.now().strftime('%Y年%m月%d日 %H:%M') + """</div>
    
    <div id="policy-list">
        """ + generate_policy_cards(policies) + """
    </div>

    <script>
        // 简单的倒计时功能
        function updateCountdown() {
            const cards = document.querySelectorAll('.policy-card');
            cards.forEach(card => {
                const deadline = new Date();
                deadline.setDate(deadline.getDate() + 23); // 示例：23天截止
                const diff = deadline - new Date();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const countdownEl = card.querySelector('.countdown');
                if(countdownEl) countdownEl.textContent = '还剩' + days + '天';
            });
        }
        updateCountdown();
        setInterval(updateCountdown, 60000); // 每分钟更新
    </script>
</body>
</html>
    """
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html_template)

def generate_policy_cards(policies):
    if not policies:
        return '<div class="policy-card">暂无最新政策信息</div>'
    
    cards = ''
    for p in policies:
        cards += f"""
        <div class="policy-card">
            <div class="policy-title">{p['title']}</div>
            <div class="policy-meta">
                <span class="tag">{p['source']}</span>
                <span>📅 {p['date']}</span>
                <span class="countdown">计算中...</span>
            </div>
        </div>
        """
    return cards

if __name__ == '__main__':
    print("开始采集政策信息...")
    policies = fetch_housing_policies()
    
    # 可以添加更多数据源
    # policies += fetch_mee_policies()  # 生态环境部
    # policies += fetch_bj_kx_policies()  # 北京科协
    
    print(f"采集到 {len(policies)} 条政策")
    generate_html(policies)
    print("已生成新的 index.html")
