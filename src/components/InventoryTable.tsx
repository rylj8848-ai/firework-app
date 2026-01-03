
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
      case SafetyLevel.HIGH: return 'bg-rose-100 text-rose-600 border border-rose-200';
      case SafetyLevel.MEDIUM: return 'bg-orange-100 text-orange-600 border border-orange-200';
      case SafetyLevel.LOW: return 'bg-emerald-100 text-emerald-600 border border-emerald-200';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="space-y-3">
      {/* 搜索与筛选 - 吸顶 */}
      <div className="sticky top-[44px] z-40 bg-white/80 backdrop-blur-md pb-2 pt-2 -mx-4 px-4 shadow-sm">
        <div className="bg-slate-100/50 p-2.5 rounded-2xl flex items-center shadow-inner border border-white/50 mb-3">
          <i className="fas fa-search text-slate-400 ml-2 mr-2 text-sm"></i>
          <input 
            type="text"
            placeholder="搜索商品名称或编号..."
            className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {filter && <button onClick={() => setFilter('')} className="text-slate-400 px-2"><i className="fas fa-times-circle"></i></button>}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setCategoryFilter('ALL')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${categoryFilter === 'ALL' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-500 border border-slate-200 shadow-sm'}`}
          >
            全部
          </button>
          {Object.values(Category).map(cat => (
            <button 
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${categoryFilter === cat ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-500 border border-slate-200 shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 列表内容 */}
      <div className="space-y-3 pb-safe pt-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md border border-slate-50">
                <i className="fas fa-box-open text-4xl opacity-30 text-indigo-300"></i>
            </div>
            <p className="text-sm font-medium">暂无相关货品</p>
            <p className="text-xs mt-1 text-slate-400">点击下方 "+" 按钮添加入库</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="guofeng-card p-3 relative active:scale-[0.99] transition-transform overflow-hidden">
              
              <div className="flex justify-between items-start mb-2">
                {/* 图片区域 */}
                <div className="w-[88px] h-[88px] flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden mr-3 border border-slate-100 shadow-inner relative group">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                      <i className="fas fa-fire text-2xl mb-1 opacity-50"></i>
                      <span className="text-[10px]">无图</span>
                    </div>
                  )}
                </div>

                {/* 信息区域 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${getSafetyBadge(item.safetyLevel)}`}>
                      {item.safetyLevel}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate bg-slate-100 px-1.5 py-0.5 rounded">#{item.sku}</span>
                  </div>
                  <h4 className="text-[15px] font-bold text-slate-800 leading-tight truncate mb-1">{item.name}</h4>
                  <p className="text-[11px] text-indigo-500 truncate font-medium">{item.category}</p>
                  
                  {/* 价格展示区 - 增强版 */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 flex-1 text-center">
                        <span className="text-[9px] text-slate-400 block uppercase">进价</span>
                        <span className="text-[10px] font-medium text-slate-600">¥{item.cost}</span>
                    </div>
                    <div className="bg-indigo-50/50 px-2 py-1 rounded-lg border border-indigo-100 flex-1 text-center">
                        <span className="text-[9px] text-indigo-400 block uppercase">批发</span>
                        <span className="text-[10px] font-bold text-indigo-600">¥{item.wholesalePrice || item.price}</span>
                    </div>
                    <div className="flex-1 text-right pl-2">
                        <span className="text-[9px] text-emerald-500 block uppercase tracking-wide">零售</span>
                        <span className="text-base font-black text-emerald-600">¥{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 操作区域 */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                 <button 
                    onClick={() => onDeleteItem(item.id)} 
                    className="text-slate-400 hover:text-rose-500 p-2 text-xs flex items-center transition-colors"
                >
                    <i className="fas fa-trash-alt mr-1.5"></i> 删除
                </button>

                <div className="flex items-center space-x-1 bg-slate-100/50 rounded-lg p-1 border border-slate-100">
                  <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm active:bg-slate-50 transition-colors">
                    <i className="fas fa-minus text-[10px]"></i>
                  </button>
                  <span className={`text-sm font-bold w-8 text-center ${item.quantity <= item.minThreshold ? 'text-rose-500' : 'text-slate-700'}`}>
                    {item.quantity}
                  </span>
                  <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-7 h-7 rounded-md bg-indigo-600 border border-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 active:bg-indigo-700 transition-colors">
                    <i className="fas fa-plus text-[10px]"></i>
                  </button>
                </div>
              </div>

              {item.quantity <= item.minThreshold && (
                 <div className="absolute top-0 right-0">
                    <div className="bg-rose-500/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-bl-xl font-bold shadow-sm z-10">
                        缺货预警
                    </div>
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
