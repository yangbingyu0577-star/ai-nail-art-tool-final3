import type { ConstructionList } from './types';

export const DEFAULT_CONSTRUCTION_LIST: ConstructionList = {
  materials: [
    { name: '基础底胶', brand: 'OPI', cost: 45, purchase_channel: '天猫旗舰店', category: 'base' },
    { name: '樱花粉色甲油胶', brand: 'KODI', cost: 32, purchase_channel: '天猫国际', category: 'color' },
    { name: '亮片金葱粉', brand: 'Lanterns', cost: 18, purchase_channel: '淘宝', category: 'decoration' },
    { name: '珍珠贴饰(50颗)', brand: 'Sweet Color', cost: 22, purchase_channel: '天猫', category: 'decoration' },
    { name: '封层胶(亮面)', brand: 'Bluesky', cost: 30, purchase_channel: '淘宝官方店', category: 'topcoat' },
  ],
  tools: [
    { name: '美甲光疗灯(LED)', brand: 'SUNUV', cost: 158, purchase_channel: '京东自营', category: 'tool' },
    { name: '海绵打磨块', brand: 'VETTY', cost: 8, purchase_channel: '拼多多', category: 'tool' },
    { name: '点钻笔套装', brand: 'Born Pretty', cost: 18, purchase_channel: '淘宝', category: 'tool' },
  ],
  techniques: [
    { name: '渐变过渡', difficulty: '中等', description: '使用海绵将两种或多种颜色自然过渡融合' },
    { name: '贴饰拼贴', difficulty: '简单', description: '将珍珠、铆钉、亮片等贴饰用胶水固定在甲面' },
    { name: '手绘花纹', difficulty: '困难', description: '使用细笔在甲面上手绘花朵、线条等图案' },
  ],
  salonPrices: [
    { tier: '平价美甲店', min: 68, max: 128, description: '社区小型美甲店，基础款式为主，适合学生党' },
    { tier: '中端美甲店', min: 128, max: 298, description: '商场或商圈美甲店，款式丰富，有手绘能力' },
    { tier: '高端美甲店', min: 298, max: 598, description: '精品美甲沙龙，进口产品，资深技师，定制设计' },
    { tier: '顶级美甲工作室', min: 598, max: 1280, description: '网红工作室/日式salon，首席技师，复杂定制款' },
  ],
  totalMaterialCost: 147,
};
