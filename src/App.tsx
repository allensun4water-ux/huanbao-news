// 在React组件中添加（通常是App.tsx或Home.tsx）
import { useEffect, useState } from 'react';

function App() {
  const [policies, setPolicies] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    // 从JSON文件加载数据
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        setPolicies(data.policies);
        setLastUpdate(data.lastUpdate);
      })
      .catch(err => console.error('加载数据失败:', err));
  }, []);

  return (
    <div>
      <div className="update-time">🔄 最后更新：{lastUpdate}</div>
      {/* 原有代码，把写死的policies改为从state读取 */}
      {policies.map(policy => (
        <PolicyCard key={policy.id} data={policy} />
      ))}
    </div>
  );
}
