
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { FireworkItem, Category, HistoryPoint } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  items: FireworkItem[];
  history: HistoryPoint[];
}

const Dashboard: React.FC<DashboardProps> = ({ items, history }) => {
  const stats = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const lowStockCount = items.filter(item => item.quantity <= item.minThreshold).length;
    
    const distributionMap = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

    const categoryDistribution = Object.entries(distributionMap).map(([name, value]) => ({
      name, value
    }));

    return { totalItems, totalValue, lowStockCount, categoryDistribution };
  }, [items]);

  return (
    <div className="space-y-4 pb-4">
      {/* 统计卡片：使用渐变色图标 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="guofeng-card p-5 border-l-4 border-indigo-400">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 rounded-2xl shadow-sm">
              <i className="fas fa-cubes text-xl"></i>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">库存总量</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.totalItems.toLocaleString()} <span className="text-xs font-normal text-slate-400">件</span></h3>
            </div>
          </div>
        </div>
        
        <div className="guofeng-card p-5 border-l-4 border-amber-400">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 text-amber-500 rounded-2xl shadow-sm">
              <i className="fas fa-coins text-xl"></i>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">预估货值</p>
              <h3 className="text-2xl font-black text-gradient-gold">¥{stats.totalValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="guofeng-card p-5 border-l-4 border-rose-400">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50 text-rose-500 rounded-2xl shadow-sm">
              <i className="fas fa-bell text-xl"></i>
            </div>
            <div>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-0.5">补货提醒</p>
              <h3 className="text-2xl font-black text-rose-500">{stats.lowStockCount} <span className="text-xs font-normal text-slate-400">项</span></h3>
            </div>
          </div>
        </div>
      </div>

      {/* 趋势图 */}
      <div className="guofeng-card p-5">
        <h4 className="text-sm font-bold mb-4 flex items-center text-slate-700">
          <span className="w-1 h-4 bg-indigo-500 rounded-full mr-2"></span> 货值趋势
        </h4>
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
              />
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="url(#colorValue)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, fill: '#818cf8' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 饼图 */}
        <div className="guofeng-card p-5 min-h-[350px]">
          <h4 className="text-sm font-bold mb-4 flex items-center text-slate-700">
            <span className="w-1 h-4 bg-pink-500 rounded-full mr-2"></span> 品类分布
          </h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value"
                  stroke="none"
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} itemStyle={{ color: '#334155' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 柱状图 */}
        <div className="guofeng-card p-5 min-h-[350px]">
          <h4 className="text-sm font-bold mb-4 flex items-center text-slate-700">
            <span className="w-1 h-4 bg-blue-500 rounded-full mr-2"></span> Top 8 库存
          </h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={{fill: '#94a3b8'}} tickFormatter={(val) => val.length > 4 ? val.slice(0,3)+'...' : val} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="quantity" fill="url(#colorBar)" radius={[4, 4, 0, 0]} name="库存" barSize={16}>
                    {items.slice(0, 8).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
