
import React, { useState } from 'react';
import { FireworkItem, Category, SafetyLevel } from '../types';

interface InventoryTableProps {
  items: FireworkItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onDeleteItem: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items, onUpdateQuantity, onDeleteItem }) => {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'ALL'>('ALL');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(filter.toLowerCase()) || 
                          item.sku.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getSafetyBadge = (level: SafetyLevel) => {
    switch(level) {
      case SafetyLevel.HIGH: return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
      case SafetyLevel.MEDIUM: return 'bg-orange-500/10 text-orange-400 border border-orange-500/30';
      case SafetyLevel.LOW: return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div className="space-y-3">
      {/* 搜索与筛选 - 微信小程序风格吸顶栏 */}
      <div className="sticky top-0 z-30 bg-[#1c1c1b] pb-2 -mt-2 pt-2">
        <div className="bg-[#262624] p-2 rounded-lg flex items-center border border-[#3f3f3e] mb-3">
          <i className="fas fa-search text-slate-500 ml-2 mr-2 text-sm"></i>
          <input 
            type="text"
            placeholder="搜索名号或编号..."
            className="w-full bg-transparent outline-none text-sm text-[#fdf6e3] placeholder-slate-600"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {filter && <button onClick={() => setFilter('')} className="text-slate-500 px-2"><i className="fas fa-times-circle"></i></button>}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setCategoryFilter('ALL')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${categoryFilter === 'ALL' ? 'bg-[#b91c1c] text-white border-[#b91c1c]' : 'bg-[#262624] text-slate-400 border-[#3f3f3e]'}`}
          >
            全部
          </button>
          {Object.values(Category).map(cat => (
            <button 
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-bold transition-all border ${categoryFilter === cat ? 'bg-[#b91c1c] text-white border-[#b91c1c]' : 'bg-[#262624] text-slate-400 border-[#3f3f3e]'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 列表内容 */}
      <div className="space-y-3 pb-safe">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <i className="fas fa-box-open text-4xl mb-3 opacity-50"></i>
            <p className="text-xs">暂无相关货品</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="guofeng-card p-4 rounded-lg relative active:scale-[0.99] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 mr-4">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-[2px] font-bold ${getSafetyBadge(item.safetyLevel)}`}>
                      {item.safetyLevel}
                    </span>
                    <span className="text-[10px] text-[#d97706]/70">#{item.sku}</span>
                  </div>
                  <h4 className="text-[16px] font-bold text-[#fdf6e3] leading-snug">{item.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{item.category} · 成本 ¥{item.cost}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                   <span className="text-xs text-slate-500 scale-90 origin-right">单价</span>
                   <span className="text-[#d97706] font-bold text-lg">¥{item.price}</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#1c1c1b]/50 rounded p-2 border border-white/5">
                <span className="text-[10px] text-slate-500 ml-1">库存结余</span>
                <div className="flex items-center space-x-4">
                  <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-8 h-8 rounded bg-[#262624] border border-[#3f3f3e] flex items-center justify-center text-slate-400 active:bg-white/10">
                    <i className="fas fa-minus text-xs"></i>
                  </button>
                  <span className={`text-lg font-bold w-8 text-center ${item.quantity <= item.minThreshold ? 'text-[#b91c1c]' : 'text-[#fdf6e3]'}`}>
                    {item.quantity}
                  </span>
                  <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-8 h-8 rounded bg-[#b91c1c] border border-[#b91c1c] flex items-center justify-center text-white active:bg-[#991b1b]">
                    <i className="fas fa-plus text-xs"></i>
                  </button>
                </div>
              </div>
              
              {/* 删除按钮 (仅小图标) */}
              <button onClick={() => onDeleteItem(item.id)} className="absolute top-4 right-4 text-slate-700 p-2 -mr-2 -mt-2 active:text-rose-500">
                <i className="fas fa-trash-alt text-xs"></i>
              </button>

              {item.quantity <= item.minThreshold && (
                 <div className="absolute top-0 left-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-[#b91c1c] border-r-transparent rounded-tl-lg z-10">
                    <i className="fas fa-exclamation text-white text-[8px] absolute top-[-26px] left-[4px]"></i>
                 </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
