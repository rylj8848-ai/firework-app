
import { Category, FireworkItem, SafetyLevel } from './types';

export const INITIAL_ITEMS: FireworkItem[] = [
  {
    id: '1',
    name: '锦绣中华 100发',
    sku: 'FW-CK-001',
    category: Category.CAKES,
    quantity: 15,
    minThreshold: 5,
    price: 388,       
    cost: 220,        
    safetyLevel: SafetyLevel.HIGH,
    lastUpdated: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?auto=format&fit=crop&q=80&w=300&h=300',
    description: '大型组合烟花，适合庆典活动'
  },
  {
    id: '2',
    name: '仙女棒',
    sku: 'FW-SP-012',
    category: Category.SPARKLERS,
    quantity: 200,
    minThreshold: 50,
    price: 5,
    cost: 1.5,
    safetyLevel: SafetyLevel.LOW,
    lastUpdated: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1576182606775-80f0c0ae2f83?auto=format&fit=crop&q=80&w=300&h=300',
    description: '儿童及拍照必备，网红产品'
  },
  {
    id: '3',
    name: '大地红 5000响',
    sku: 'FW-FC-005',
    category: Category.FIRECRACKERS,
    quantity: 4,
    minThreshold: 10,
    price: 120,
    cost: 75,
    safetyLevel: SafetyLevel.MEDIUM,
    lastUpdated: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1549419227-28d8b8a4a50d?auto=format&fit=crop&q=80&w=300&h=300',
    description: '传统红炮，声响巨大'
  }
];

// 使用更鲜艳、更有活力的配色方案
export const CATEGORY_COLORS: Record<string, string> = {
  [Category.CAKES]: '#6366f1', // Indigo
  [Category.SPARKLERS]: '#3b82f6', // Bright Blue
  [Category.ROCKETS]: '#8b5cf6', // Violet
  [Category.FOUNTAINS]: '#10b981', // Emerald
  [Category.FIRECRACKERS]: '#ef4444', // Red
  [Category.ROMAN_CANDLES]: '#f472b6', // Pink
  [Category.NOVELTIES]: '#f59e0b', // Amber
  [Category.OTHERS]: '#64748b'  // Slate
};
