
export enum Category {
  CAKES = '大型礼花弹',
  SPARKLERS = '手持烟花',
  ROCKETS = '火箭升空',
  FOUNTAINS = '喷花类',
  FIRECRACKERS = '鞭炮类',
  ROMAN_CANDLES = '罗马烛光',
  NOVELTIES = '玩具类',
  OTHERS = '其他'
}

export enum SafetyLevel {
  LOW = '低风险',
  MEDIUM = '中等风险',
  HIGH = '高风险'
}

export interface FireworkItem {
  id: string;
  name: string;
  sku: string;
  category: Category;
  quantity: number;
  minThreshold: number;
  price: number;
  cost: number;
  safetyLevel: SafetyLevel;
  lastUpdated: string;
  description?: string;
}

export interface HistoryPoint {
  date: string;
  value: number;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  categoryDistribution: { name: string; value: number }[];
}

export interface AIInsight {
  title: string;
  content: string;
  type: 'warning' | 'info' | 'success';
}
