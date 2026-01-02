
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
    description: '传统红炮，声响巨大'
  }
];

export const CATEGORY_COLORS: Record<string, string> = {
  [Category.CAKES]: '#b91c1c', // 朱砂红
  [Category.SPARKLERS]: '#d97706', // 琥珀金
  [Category.ROCKETS]: '#1e3a8a', // 黛蓝
  [Category.FOUNTAINS]: '#065f46', // 翡翠绿
  [Category.FIRECRACKERS]: '#991b1b', // 胭脂红
  [Category.ROMAN_CANDLES]: '#4c1d95', // 葡萄紫
  [Category.NOVELTIES]: '#be185d', // 桃红
  [Category.OTHERS]: '#4b5563'  // 墨灰
};
