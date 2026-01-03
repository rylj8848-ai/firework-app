
import React, { useState, useCallback, useEffect } from 'react';
import { FireworkItem, Category, SafetyLevel, HistoryPoint } from './types';
import { INITIAL_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import AIInsightsPanel from './components/AIInsightsPanel';

// 顶部导航栏：增加磨砂玻璃效果，文字使用渐变色
const WechatNavBar: React.FC<{ title: string; onAdd?: () => void }> = ({ title, onAdd }) => (
  <div className="flex-none h-[44px] bg-white/80 backdrop-blur-md flex items-center justify-center relative border-b border-slate-200/50 z-50 shadow-sm sticky top-0">
    <div className="font-bold text-[18px] text-slate-800 tracking-wide font-sans bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
      {title}
    </div>
    {/* 右侧胶囊占位 */}
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

  const [activeTab, setActiveTab] = useState<'inventory' | 'dashboard'>('inventory');
  const [isAdding, setIsAdding] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('firework_inventory', JSON.stringify(items));
    } catch (e) {
      alert("存储空间已满，请删除部分商品或不上传图片");
    }
    
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
    if (window.confirm('确定要删除该商品吗？此操作无法撤销。')) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500; 
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setPreviewImage(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

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
      wholesalePrice: Number(formData.get('wholesalePrice')),
      cost: Number(formData.get('cost')),
      safetyLevel: formData.get('safetyLevel') as SafetyLevel,
      lastUpdated: new Date().toISOString(),
      imageUrl: previewImage || undefined
    };
    setItems(prev => [newItem, ...prev]);
    setIsAdding(false);
    setPreviewImage(null); 
  };

  const closeAddModal = () => {
    setIsAdding(false);
    setPreviewImage(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen relative overflow-hidden">
      
      {/* 状态栏背景占位 */}
      <div className="safe-pt w-full bg-white/80 backdrop-blur-md sticky top-0 z-[60]"></div>
      
      <WechatNavBar 
        title={activeTab === 'dashboard' ? '经营概况' : '库存列表'} 
      />

      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-28 no-scrollbar relative z-10">
        {activeTab === 'dashboard' ? (
          <div className="space-y-5">
            <Dashboard items={items} history={history} />
            <AIInsightsPanel items={items} />
          </div>
        ) : (
          <div className="min-h-[101%]">
            <InventoryTable items={items} onUpdateQuantity={updateQuantity} onDeleteItem={deleteItem} />
          </div>
        )}
      </main>

      {/* 底部 TabBar：磨砂质感 + 渐变图标 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/60 flex justify-around items-center pb-safe-area safe-pb z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        
        <button 
          onClick={() => setActiveTab('inventory')} 
          className="flex flex-col items-center justify-center w-full py-2 active:bg-slate-50/50 transition-colors"
        >
          <div className={`text-[22px] mb-0.5 transition-all ${activeTab === 'inventory' ? 'text-indigo-600 scale-110 drop-shadow-sm' : 'text-slate-400'}`}>
            <i className="fas fa-list-ul"></i>
          </div>
          <span className={`text-[10px] font-medium ${activeTab === 'inventory' ? 'text-indigo-600' : 'text-slate-500'}`}>
            库存
          </span>
        </button>

        {/* 核心操作按钮：强烈的渐变色 */}
        <button 
          onClick={() => setIsAdding(true)} 
          className="flex flex-col items-center justify-center w-full py-2 -mt-8 relative z-10"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-purple-200 border-4 border-[#f9fafb] active:scale-95 transition-transform">
            <i className="fas fa-plus text-xl"></i>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 font-medium">入库</span>
        </button>

        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="flex flex-col items-center justify-center w-full py-2 active:bg-slate-50/50 transition-colors"
        >
          <div className={`text-[22px] mb-0.5 transition-all ${activeTab === 'dashboard' ? 'text-indigo-600 scale-110 drop-shadow-sm' : 'text-slate-400'}`}>
            <i className="fas fa-chart-pie"></i>
          </div>
          <span className={`text-[10px] font-medium ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'}`}>
            经营
          </span>
        </button>
      </nav>

      {/* 入库弹窗 */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s]">
          <div className="bg-white/95 backdrop-blur-xl w-full rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto animate-[slide-up_0.3s_ease-out] safe-pb shadow-2xl border-t border-white/50">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                <i className="fas fa-sparkles mr-2 text-indigo-500"></i>新品入库
              </h3>
              <button onClick={closeAddModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={addItem} className="space-y-5 pb-4">
              
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">商品图片</label>
                <div className="flex gap-4 items-stretch h-28">
                    {/* Preview Box */}
                    <div className="w-28 flex-shrink-0 bg-slate-50 rounded-2xl border-2 border-dashed border-indigo-100 flex items-center justify-center overflow-hidden relative shadow-sm">
                         {previewImage ? (
                            <>
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => setPreviewImage(null)}
                                    className="absolute top-0 right-0 bg-rose-500/80 text-white w-7 h-7 flex items-center justify-center rounded-bl-xl backdrop-blur-sm shadow-sm"
                                >
                                    <i className="fas fa-times text-xs"></i>
                                </button>
                            </>
                         ) : (
                            <div className="text-center text-slate-300">
                                <i className="fas fa-image text-2xl mb-1"></i>
                                <p className="text-[10px]">预览</p>
                            </div>
                         )}
                    </div>

                    {/* Actions */}
                    <div className="flex-1 flex flex-col gap-2.5 justify-center">
                         <label className="flex-1 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group">
                            <i className="fas fa-camera mr-2"></i>
                            <span>立即拍照</span>
                            <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                         </label>

                         <label className="flex-1 flex items-center justify-center bg-white text-slate-600 rounded-xl text-sm font-bold border border-slate-200 active:scale-[0.98] transition-all cursor-pointer hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600">
                            <i className="fas fa-images mr-2 text-indigo-400"></i>
                            <span>相册上传</span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                         </label>
                    </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">商品名称</label>
                <input required name="name" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 outline-none transition-all" placeholder="例如：加特林烟花" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">当前库存</label>
                  <input required type="number" name="quantity" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-center font-bold focus:border-indigo-500 focus:bg-white outline-none transition-all" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">预警数量</label>
                  <input required type="number" name="minThreshold" defaultValue="10" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 text-center focus:border-indigo-500 focus:bg-white outline-none transition-all" />
                </div>
              </div>

              {/* 价格录入区域 */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase text-center block">进价</label>
                      <input required type="number" step="0.1" name="cost" className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-600 text-center text-sm focus:border-indigo-500 outline-none" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-indigo-400 uppercase text-center block">批发价</label>
                      <input required type="number" step="0.1" name="wholesalePrice" className="w-full bg-indigo-50/30 border border-indigo-100 rounded-lg p-2.5 text-indigo-700 text-center text-sm font-medium focus:border-indigo-500 outline-none" placeholder="0" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-emerald-500 uppercase text-center block">零售价</label>
                      <input required type="number" step="0.1" name="price" className="w-full bg-emerald-50/30 border border-emerald-100 rounded-lg p-2.5 text-emerald-700 font-bold text-center text-sm focus:border-emerald-500 outline-none" placeholder="0" />
                    </div>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">分类</label>
                  <div className="relative">
                    <select name="category" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 appearance-none focus:border-indigo-500 outline-none">
                      {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none"></i>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">风险等级</label>
                  <div className="relative">
                    <select name="safetyLevel" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 appearance-none focus:border-indigo-500 outline-none">
                      {Object.values(SafetyLevel).map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none"></i>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">SKU / 编号</label>
                <input required name="sku" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-800 focus:border-indigo-500 focus:bg-white outline-none" placeholder="例如：FW-001" />
              </div>

              <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 active:scale-[0.98] transition-transform flex items-center justify-center text-base">
                <i className="fas fa-check-circle mr-2"></i> 确认入库
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
