
import { FireworkItem, AIInsight } from "../types";

export const getInventoryInsights = async (items: FireworkItem[]): Promise<AIInsight[]> => {
  try {
    // 构建精简的库存摘要，减少传输数据量
    const inventorySummary = items.map(item => ({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      minThreshold: item.minThreshold,
      safety: item.safetyLevel,
      cost: item.cost,
      wholesale: item.wholesalePrice,
      retail: item.price
    }));

    // 调用我们在 api/inventory-insight.js 创建的后端接口
    // Vercel 会自动将 /api/ 路径映射到 Serverless Functions
    const response = await fetch('/api/inventory-insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: inventorySummary }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("AI Insights Error:", error);
    return [
      {
        title: "AI 连接失败",
        content: "网络通畅但服务未响应，请检查 Vercel 环境变量 API_KEY 是否配置正确。",
        type: "warning"
      }
    ];
  }
};
