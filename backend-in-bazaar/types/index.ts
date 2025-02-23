// types/index.ts
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'INR';

export type UnitCategory = 'weight' | 'volume' | 'count' | 'length' | 'area';

// Define specific units for each category
export type WeightUnit = 'g' | 'kg' | 'mg';
export type VolumeUnit = 'ml' | 'l' | 'kl';
export type CountUnit = 'piece' | 'dozen' | 'unit' | 'pc' | 'pcs';
export type LengthUnit = 'mm' | 'cm' | 'm' | 'km';
export type AreaUnit = 'sq.m' | 'sq.ft' | 'sq.cm';

export type Unit = WeightUnit | VolumeUnit | CountUnit | LengthUnit | AreaUnit;

export interface QuantityInfo {
  value: number;
  unit: Unit;
  category: UnitCategory;
}

export interface PriceSuggestion {
  suggestedPrice: number;
  marketHigh: number;
  marketLow: number;
  marketAverage: number;
  basePrice?: number;  // Added to track the base price
  pricingStrategy?: string;  // Added to explain pricing decision
  pricePoints: ProductPrice[];
  quantity: QuantityInfo;
  pricePerUnit: string;
  unit: string;
  trustedRetailersCount: number;
  confidence: number;
  reasoning: string;
}

export interface ProductPrice {
  retailer: string;
  price: number;
  originalPrice: number;
  quantity: QuantityInfo;
  url: string;
  rating?: number;
  reviews?: number;
  delivery?: boolean;
}

export interface MarketAnalysis {
  priceAnalysis: {
    suggestedPrice: number;
    marketHigh: number;
    marketLow: number;
    marketAverage: number;
    basePrice: number;  // Added base price
    reasoning: string;
  };
  pricingStrategy: string;  // Added to explain pricing decision
  marketTrends: string;
  recommendations: string;
}

export interface PriceAnalysisResponse {
  suggestion: PriceSuggestion;
  analysis: string;
}

export interface ShoppingResult {
  title: string;
  price: number;
  retailer: string;
  url: string;
  rating?: number;
  reviews?: number;
  delivery?: string;
  thumbnail?: string;
  quantity?: QuantityInfo;
}

export interface APIResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
}

export interface ProductDetails {
  title?: string;
  description?: string;
  specifications?: Record<string, string>;
  totalReviews?: number;
  averageRating?: number;
  basePrice?: number;  // Added base price
}

// Unit conversion factors relative to base unit
export const UNIT_CONVERSIONS = {
  weight: {
    g: 1,
    kg: 1000,
    mg: 0.001
  },
  volume: {
    ml: 1,
    l: 1000,
    kl: 1000000
  },
  count: {
    piece: 1,
    dozen: 12,
    unit: 1,
    pc: 1,
    pcs: 1
  },
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000
  },
  area: {
    'sq.cm': 0.0001,
    'sq.m': 1,
    'sq.ft': 0.092903
  }
} as const;

// Category units mapping
export const UNIT_CATEGORIES = {
  weight: ['g', 'kg', 'mg'] as WeightUnit[],
  volume: ['ml', 'l', 'kl'] as VolumeUnit[],
  count: ['piece', 'dozen', 'unit', 'pc', 'pcs'] as CountUnit[],
  length: ['mm', 'cm', 'm', 'km'] as LengthUnit[],
  area: ['sq.m', 'sq.ft', 'sq.cm'] as AreaUnit[]
};

// Type for conversion lookup
export type UnitConversions = typeof UNIT_CONVERSIONS;

export interface BargainingResponse {
  currentPrice: number;
  message: string;
  attemptCount: number;
  canContinue: boolean;
  stopLossReached?: boolean;
}

export interface SimplifiedOutputData {
  suggestedPrice: number;
}

export interface BargainingSession {
  currentPrice: number;
  initialPrice: number;
  stopLossPercentage: number;
  attemptCount: number;
  priceHistory: number[];
  quantity: string;
}