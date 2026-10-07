export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface PaletteColor {
  hex: string;
  rgb: RGBColor;
  name: string;
  ratio: number;
}

export type PatternType =
  | 'solid'
  | 'gradient'
  | 'french'
  | 'floral'
  | 'glitter'
  | 'marble'
  | 'stripes'
  | 'dots'
  | 'ombre'
  | 'foil';

export type NailShape = 'almond' | 'oval' | 'square' | 'coffin' | 'stiletto';

export interface NailElement {
  id: string;
  type: 'flower' | 'rhinestone' | 'stripe' | 'dot' | 'glitter' | 'heart' | 'star' | 'foil';
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  opacity: number;
}

export interface NailDesign {
  shape: NailShape;
  baseColor: string;
  secondaryColor: string;
  pattern: PatternType;
  elements: NailElement[];
  finish: 'glossy' | 'matte';
}

export interface MaterialItem {
  name: string;
  brand: string;
  cost: number;
  purchase_channel: string;
  category: string;
}

export interface TechniqueItem {
  name: string;
  difficulty: string;
  description: string;
}

export interface SalonPrice {
  tier: string;
  min: number;
  max: number;
  description: string;
}

export interface ConstructionList {
  materials: MaterialItem[];
  tools: MaterialItem[];
  techniques: TechniqueItem[];
  salonPrices: SalonPrice[];
  totalMaterialCost: number;
}

export interface MaterialLibraryItem {
  id: string;
  name: string;
  category: string;
  image_url: string;
  description: string;
}

export const PATTERN_LABELS: Record<string, string> = {
  solid: '纯色',
  gradient: '渐变',
  french: '法式',
  floral: '花卉',
  glitter: '闪粉',
  marble: '大理石',
  stripes: '条纹',
  dots: '波点',
  ombre: '晕染',
  foil: '金属箔',
};

export const SHAPE_LABELS: Record<NailShape, string> = {
  almond: '杏仁形',
  oval: '椭圆',
  square: '方圆',
  coffin: '棺材形',
  stiletto: '尖锥形',
};

export const ELEMENT_LABELS: Record<string, string> = {
  flower: '花朵',
  rhinestone: '水钻',
  stripe: '条纹',
  dot: '圆点',
  glitter: '闪粉',
  heart: '爱心',
  star: '星星',
  foil: '金属箔',
};
