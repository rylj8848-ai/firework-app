
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
    <div className="space-y-6 pb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="guofeng-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center bg-[#b91c1c]/10 text-[#b91c1c] rounded-full border border-[#b91c1c]/30">
              <i className="fas fa-cubes text-xl"></i>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1">库存总量</p>
              <h3 className="text-2xl font-black text-white">{stats.totalItems.toLocaleString()} <span className="text-sm font-normal text-slate-500 ml-1">件</span></h3>
            </div>
          </div>
        </div>
        
        <div className="guofeng-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center bg-[#d97706]/10 text-[#d97706] rounded-full border border-[#d97706]/30">
              <i className="fas fa-coins text-xl"></i>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1">预估货值</p>
              <h3 className="text-2xl font-black text-white">¥{stats.totalValue.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="guofeng-card p-6 rounded-xl border-l-4 border-l-[#b91c1c]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center bg-[#b91c1c]/20 text-[#b91c1c] rounded-full">
              <i className="fas fa-bell text-xl"></i>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold mb-1">补货提醒</p>
              <h3 className="text-2xl font-black text-[#b91c1c]">{stats.lowStockCount} <span className="text-sm font-normal text-slate-500 ml-1">项告急</span></h3>
            </div>
          </div>
        </div>
      </div>

      <div className="guofeng-card p-6 rounded-xl">
        <h4 className="text-lg font-bold mb-6 flex items-center text-[#d97706]">
          <i className="fas fa-mountain mr-3"></i> 货值起伏图
        </h4>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#666" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
              <YAxis stroke="#666" fontSize={10} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c1c1b', border: '1px solid #d97706', borderRadius: '4px' }}
                itemStyle={{ color: '#d97706' }}
              />
              <Line type="monotone" dataKey="value" stroke="#b91c1c" strokeWidth={3} dot={{ r: 4, fill: '#b91c1c' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="guofeng-card p-6 rounded-xl min-h-[400px]">
          <h4 className="text-lg font-bold mb-6 flex items-center text-[#d97706]">
            <i className="fas fa-yin-yang mr-3"></i> 品类分布
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category] || '#444'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1c1c1b', border: 'none' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="guofeng-card p-6 rounded-xl min-h-[400px]">
          <h4 className="text-lg font-bold mb-6 flex items-center text-[#d97706]">
            <i className="fas fa-scroll mr-3"></i> 关键单品
          </h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" />
                <Tooltip cursor={{ fill: '#333' }} contentStyle={{ backgroundColor: '#1c1c1b', border: 'none' }} />
                <Bar dataKey="quantity" fill="#b91c1c" radius={[4, 4, 0, 0]} name="库存" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
