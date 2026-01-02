
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
      case 'warning': return 'fa-fire-alt text-[#b91c1c]';
      case 'success': return 'fa-leaf text-[#065f46]';
      case 'info':
      default: return 'fa-feather text-[#d97706]';
    }
  };

  return (
    <div className="guofeng-card p-6 rounded-xl border-t-4 border-t-[#b91c1c]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black flex items-center text-[#fdf6e3]">
          <i className="fas fa-hat-wizard mr-3 text-[#d97706]"></i> 锦囊妙计
        </h3>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="text-[10px] font-bold px-3 py-2 bg-black/30 border border-[#d97706]/30 text-[#d97706] rounded-md transition-all active:scale-90"
        >
          <i className={`fas fa-sync-alt mr-2 ${loading ? 'animate-spin' : ''}`}></i>
          {loading ? '卜算中...' : '再寻良策'}
        </button>
      </div>

      <div className="space-y-6">
        {loading && insights.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-black/20 animate-pulse rounded-lg border border-white/5"></div>
          ))
        ) : (
          insights.map((insight, idx) => (
            <div key={idx} className="relative pl-6 border-l border-[#d97706]/30">
              <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-[#d97706]"></div>
              <div className="flex items-start">
                <i className={`fas ${getIcon(insight.type)} mt-1 mr-3 opacity-80`}></i>
                <div>
                  <h5 className="font-bold text-[#fdf6e3] mb-2">{insight.title}</h5>
                  <p className="text-xs text-slate-500 leading-relaxed italic">“ {insight.content} ”</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AIInsightsPanel;
