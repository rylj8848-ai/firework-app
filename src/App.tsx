
import React, { useState, useCallback, useEffect } from 'react';
import { FireworkItem, Category, SafetyLevel, HistoryPoint } from './types';
import { INITIAL_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import AIInsightsPanel from './components/AIInsightsPanel';

// 模拟微信小程序顶部导航栏组件
const WechatNavBar: React.FC<{ title: string; onAdd?: () => void }> = ({ title, onAdd }) => (
  <div className="flex-none h-[44px] bg-[#1c1c1b] flex items-center justify-center relative border-b border-[#d97706]/10 z-50">
    {/* 模拟左上角返回/Home占位 (如果不是首页) */}
    {/* <div className="absolute left-4 text-slate-400"><i className="fas fa-chevron-left"></i></div> */}
    
    <div className="font-bold text-[17px] text-[#fdf6e3] tracking-wide font-sans">{title}</div>
    
    {/* 右侧模拟胶囊按钮的占位，避免内容重叠。真实微信中这里有胶囊按钮 */}
    <div className="absolute right-4 w-[87px] h-[32px] pointer-events-none"></div>
  </div>
);

const App: React.FC = () => {
  const [items, setItems] = useState<FireworkItem[]>(() => {
    const saved = localStorage.getItem('firework_inventory');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [history, setHistory] = useState<HistoryPoint[]>(() => {
    const saved = localStorage.getItem('firework_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory'>('dashboard');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('firework_inventory', JSON.stringify(items));
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const today = new Date().toISOString().split('T')[0];
    setHistory(prev => {
      const last = prev[prev.length - 1];
      if (last && last.date === today) {
        if (last.value === totalValue) return prev;
        const updated = [...prev];
        updated[updated.length - 1] = { date: today, value: totalValue };
        return updated;
      } else {
        const next = [...prev, { date: today, value: totalValue }];
        return next.slice(-30);
      }
    });
  }, [items]);

  useEffect(() => {
    localStorage.setItem('firework_history', JSON.stringify(history));
  }, [history]);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta), lastUpdated: new Date().toISOString() } : item
    ));
  }, []);

  const deleteItem = useCallback((id: string) => {
    // 微信风格的确认框通常不同，这里简化使用 confirm
    if (window.confirm('确定要移出台账吗？')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  const addItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: FireworkItem = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      category: formData.get('category') as Category,
      quantity: Number(formData.get('quantity')),
      minThreshold: Number(formData.get('minThreshold')),
      price: Number(formData.get('price')),
      cost: Number(formData.get('cost')),
      safetyLevel: formData.get('safetyLevel') as SafetyLevel,
      lastUpdated: new Date().toISOString()
    };
    setItems(prev => [newItem, ...prev]);
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1c1c1b] text-slate-200 overflow-hidden">
      <div className="fixed inset-0 cloud-bg pointer-events-none"></div>

      {/* 顶部状态栏占位 (适配刘海屏) */}
      <div className="safe-pt w-full bg-[#1c1c1b]"></div>
      
      {/* 微信风格导航栏 */}
      <WechatNavBar 
        title={activeTab === 'dashboard' ? '花火管家·看板' : '库存台账'} 
      />

      {/* 滚动内容区域 (flex-1 自动填充中间区域) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20 no-scrollbar relative z-10">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            <Dashboard items={items} history={history} />
            <AIInsightsPanel items={items} />
          </div>
        ) : (
          <div className="min-h-[101%]"> {/* 确保能滚动，触发下拉刷新感 */}
            <InventoryTable items={items} onUpdateQuantity={updateQuantity} onDeleteItem={deleteItem} />
          </div>
        )}
      </main>

      {/* 微信风格底部 TabBar */}
      <nav className="flex-none bg-[#262624] border-t border-[#3f3f3e] flex justify-around items-center pb-safe-area safe-pb z-50 shadow-2xl">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="flex flex-col items-center justify-center w-full py-2 active:bg-white/5 transition-colors"
        >
          <div className={`text-[20px] mb-0.5 ${activeTab === 'dashboard' ? 'text-[#b91c1c]' : 'text-slate-500'}`}>
            <i className={`fas ${activeTab === 'dashboard' ? 'fa-chart-pie' : 'fa-chart-pie'}`}></i>
          </div>
          <span className={`text-[10px] ${activeTab === 'dashboard' ? 'text-[#b91c1c] font-bold' : 'text-slate-500'}`}>
            经营
          </span>
        </button>

        {/* 核心操作按钮：入库 (突出显示，模拟中间的大按钮) */}
        <button 
          onClick={() => setIsAdding(true)} 
          className="flex flex-col items-center justify-center w-full py-2 -mt-6"
        >
          <div className="w-12 h-12 rounded-full bg-[#b91c1c] text-white flex items-center justify-center shadow-lg border-4 border-[#1c1c1b] active:scale-95 transition-transform">
            <i className="fas fa-plus text-lg"></i>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">入库</span>
        </button>

        <button 
          onClick={() => setActiveTab('inventory')} 
          className="flex flex-col items-center justify-center w-full py-2 active:bg-white/5 transition-colors"
        >
          <div className={`text-[20px] mb-0.5 ${activeTab === 'inventory' ? 'text-[#b91c1c]' : 'text-slate-500'}`}>
            <i className="fas fa-list-ul"></i>
          </div>
          <span className={`text-[10px] ${activeTab === 'inventory' ? 'text-[#b91c1c] font-bold' : 'text-slate-500'}`}>
            库存
          </span>
        </button>
      </nav>

      {/* 入库弹窗 (模拟 PageContainer) */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s]">
          <div className="bg-[#1c1c1b] w-full rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto guofeng-card animate-[slide-up_0.3s_ease-out] safe-pb">
            <div className="flex justify-between items-center mb-6 border-b border-[#3f3f3e] pb-4">
              <h3 className="text-lg font-bold text-[#fdf6e3]">新增货品</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 p-2 active:opacity-50">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={addItem} className="space-y-5 pb-4">
              <div className="space-y-1">
                <label className="text-xs text-[#d97706] opacity-80">货品名称</label>
                <input required name="name" className="w-full bg-[#262624] border border-[#3f3f3e] rounded-lg p-3 text-[#fdf6e3] focus:border-[#b91c1c] outline-none transition-colors" placeholder="如：大地红1000响" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#d97706] opacity-80">初始库存</label>
                  <input required type="number" name="quantity" className="w-full bg-[#262624] border border-[#3f3f3e] rounded-lg p-3 text-[#fdf6e3] text-center focus:border-[#b91c1c] outline-none" placeholder="0" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#d97706] opacity-80">零售价 (¥)</label>
                  <input required type="number" step="0.01" name="price" className="w-full bg-[#262624] border border-[#3f3f3e] rounded-lg p-3 text-[#d97706] font-bold text-center focus:border-[#b91c1c] outline-none" placeholder="0.00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                  <label className="text-xs text-[#d97706] opacity-80">分类</label>
                  <div className="relative">
                    <select name="category" className="w-full bg-[#262624] border border-[#3f3f3e] rounded-lg p-3 text-[#fdf6e3] appearance-none focus:border-[#b91c1c] outline-none">
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none"></i>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#d97706] opacity-80">风险等级</label>
                  <div className="relative">
                    <select name="safetyLevel" className="w-full bg-[#262624] border border-[#3f3f3e] rounded-lg p-3 text-[#fdf6e3] appearance-none focus:border-[#b91c1c] outline-none">
                      {Object.values(SafetyLevel).map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none"></i>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#d97706] opacity-80">SKU / 编号</label>
                <input required name="sku" className="w-full bg-[#262624] border border-[#3f3f3e] rounded-lg p-3 text-[#fdf6e3] focus:border-[#b91c1c] outline-none" placeholder="自动生成或手动输入" />
                {/* 隐藏字段：成本和阈值设为默认，简化快速录入 */}
                <input type="hidden" name="cost" value="0" />
                <input type="hidden" name="minThreshold" value="10" />
              </div>

              <button type="submit" className="w-full py-3.5 mt-4 bg-[#b91c1c] text-white font-bold rounded-lg shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center">
                <i className="fas fa-check mr-2"></i> 确认入库
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
