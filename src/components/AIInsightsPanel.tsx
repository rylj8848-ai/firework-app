
import React, { useState, useEffect } from 'react';
import { FireworkItem, AIInsight } from '../types';
import { getInventoryInsights } from '../services/geminiService';

interface AIInsightsPanelProps {
  items: FireworkItem[];
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ items }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await getInventoryInsights(items);
      setInsights(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning': return 'fa-lightbulb text-amber-500';
      case 'success': return 'fa-check-circle text-emerald-500';
      case 'info':
      default: return 'fa-info-circle text-blue-500';
    }
  };

  const getBg = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning': return 'bg-amber-50/50 border-amber-100';
      case 'success': return 'bg-emerald-50/50 border-emerald-100';
      case 'info':
      default: return 'bg-blue-50/50 border-blue-100';
    }
  };

  return (
    <div className="guofeng-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center text-slate-800">
          <i className="fas fa-robot mr-2 text-indigo-500"></i> 智能建议
        </h3>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="text-[11px] font-medium px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all active:scale-95 flex items-center"
        >
          <i className={`fas fa-sync-alt mr-1.5 ${loading ? 'animate-spin' : ''}`}></i>
          {loading ? '分析中...' : '刷新建议'}
        </button>
      </div>

      <div className="space-y-3">
        {loading && insights.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-lg"></div>
          ))
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${getBg(insight.type)} flex items-start backdrop-blur-sm`}>
              <i className={`fas ${getIcon(insight.type)} mt-0.5 mr-3 text-sm`}></i>
              <div>
                <h5 className="font-bold text-slate-800 text-xs mb-1">{insight.title}</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{insight.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AIInsightsPanel;
