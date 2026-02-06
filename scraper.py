import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

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
        items = soup.select('.list-item') or soup.select('tr')[1:6]
        
        for item in items[:5]:
            title = item.get_text(strip=True)
            link = item.find('a')['href'] if item.find('a') else ''
            # 处理相对链接
            if link.startswith('/'):
                link = 'https://www.mohurd.gov.cn' + link
            
            # 计算倒计时（假设都是23天截止，实际应根据页面信息计算）
            deadline = datetime.now()
            deadline_text = "还剩23天"
            
            policies.append({
                'id': len(policies) + 1,
                'title': title,
                'source': '住房和城乡建设部',
                'date': datetime.now().strftime('%Y-%m-%d'),
                'deadline': deadline_text,
                'link': link,
                'type': '征求意见'
            })
        
        return policies
    except Exception as e:
        print(f"采集失败: {e}")
        return []

def main():
    print("开始采集政策信息...")
    policies = fetch_housing_policies()
    
    # 生成JSON数据文件（供React读取）
    data = {
        'lastUpdate': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'count': len(policies),
        'policies': policies
    }
    
    # 保存为JSON文件
    with open('public/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 已生成 data.json，包含 {len(policies)} 条政策")
    print(f"🔄 更新时间：{data['lastUpdate']}")

if __name__ == '__main__':
    main()
