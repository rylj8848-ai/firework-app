
import { GoogleGenAI, Type } from "@google/genai";
import { FireworkItem, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getInventoryInsights = async (items: FireworkItem[]): Promise<AIInsight[]> => {
  const inventorySummary = items.map(item => ({
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    minThreshold: item.minThreshold,
    safety: item.safetyLevel
  }));

  const prompt = `作为一名资深的烟花零售专家，请分析以下库存数据并给出3条核心建议。
  重点关注：
  1. 缺货预警与补货策略。
  2. 根据烟花种类提供的存储安全建议。
  3. 季节性销售预测（假设当前接近春节或中秋节）。
  
  库存数据: ${JSON.stringify(inventorySummary)}
  
  请直接以JSON数组形式返回，结构如下:
  [{"title": "建议标题", "content": "详细内容", "type": "warning | info | success"}]`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["warning", "info", "success"] }
            },
            required: ["title", "content", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Insights Error:", error);
    return [
      {
        title: "智能分析暂不可用",
        content: "无法连接到AI分析服务，请检查网络或重试。",
        type: "info"
      }
    ];
  }
};
