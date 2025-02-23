import { 
    QuantityInfo, 
    UNIT_CONVERSIONS, 
    UNIT_CATEGORIES,
    UnitCategory,
    Unit,
    UnitConversions
  } from '../types';
  
  function isValidUnit(unit: string): unit is Unit {
    // Iterate over keys to ensure proper type inference
    for (const category in UNIT_CATEGORIES) {
      const units = UNIT_CATEGORIES[category as UnitCategory] as string[];
      if (units.includes(unit)) {
        return true;
      }
    }
    return false;
  }
  
  function getCategoryForUnit(unit: Unit): UnitCategory {
    // Cast the entries to a properly typed tuple array
    const entries = Object.entries(UNIT_CATEGORIES) as [UnitCategory, Unit[]][];
    for (const [category, units] of entries) {
      if (units.includes(unit)) {
        return category;
      }
    }
    throw new Error(`Unknown unit: ${unit}`);
  }
  
  export function parseQuantity(quantityStr: string): QuantityInfo {
    const match = quantityStr.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z.]+)$/);
    if (!match) {
      throw new Error(
        `Invalid quantity format: ${quantityStr}. Expected format: "value unit" (e.g., "5 kg", "1 l")`
      );
    }
  
    const value = parseFloat(match[1]);
    const unitStr = match[2].replace(/s$/, ''); // Remove plural 's'
  
    if (!isValidUnit(unitStr)) {
      throw new Error(`Unsupported unit: ${unitStr}`);
    }
  
    // Ensure unitStr is cast as a valid Unit
    const category = getCategoryForUnit(unitStr as Unit);
  
    return { 
      value, 
      unit: unitStr as Unit, 
      category 
    };
  }
  
  export function normalizePrice(price: number, quantity: QuantityInfo): number {
    const conversions = UNIT_CONVERSIONS[quantity.category] as Record<string, number>;
    if (!conversions) {
      return price;
    }
  
    if (quantity.category === 'weight') {
      // For weight, always normalize to kg
      const kgConversion = conversions['kg'];
      const currentConversion = conversions[quantity.unit];
      
      // Convert to kg
      // If price is in g: currentConversion = 1, kgConversion = 1000, so we multiply value by (1/1000)
      // If price is in kg: currentConversion = 1000, kgConversion = 1000, so we multiply value by 1
      const valueInKg = quantity.value * (currentConversion / kgConversion);
      return price / valueInKg;
    }
  
    // For other categories, use base unit normalization
    const baseUnit = UNIT_CATEGORIES[quantity.category][0];
    const baseConversion = conversions[baseUnit];
    const currentConversion = conversions[quantity.unit];
    const normalizedValue = quantity.value * (currentConversion / baseConversion);
    
    return price / normalizedValue;
  }
  
  export function getDisplayUnit(category: UnitCategory): string {
    switch (category) {
      case 'weight': return 'kg';  // Always return kg for weight
      case 'volume': return 'l';
      case 'count': return 'pc';
      case 'length': return 'm';
      case 'area': return 'sq.m';
      default: return 'unit';
    }
  }
  
  export function formatPricePerUnit(price: number, quantity: QuantityInfo): string {
    const normalizedPrice = normalizePrice(price, quantity);
    
    if (quantity.category === 'weight') {
      // For weight, always show price per kg
      return `${normalizedPrice.toFixed(2)}/kg`;
    }
    
    // For other categories, use standard display units
    const displayUnit = getDisplayUnit(quantity.category);
    return `${normalizedPrice.toFixed(2)}/${displayUnit}`;
  }
  
  // Example usage helper
  export function getStandardizedPrice(price: number, quantity: QuantityInfo): {price: number, unit: string} {
    const normalizedPrice = normalizePrice(price, quantity);
    
    if (quantity.category === 'weight') {
      return {
        price: normalizedPrice,  // Already in price per kg
        unit: 'kg'
      };
    }
    
    // For other categories, use standard display units
    const displayUnit = getDisplayUnit(quantity.category);
    const conversions = UNIT_CONVERSIONS[quantity.category] as Record<string, number>;
    const displayConversion = conversions[displayUnit as keyof typeof conversions] || 1;
    
    return {
      price: normalizedPrice * displayConversion,
      unit: displayUnit
    };
  }
  
  export function extractQuantityFromText(text: string): QuantityInfo | null {
    const patterns = [
      // Weight patterns
      /(\d+(?:\.\d+)?)\s*(kg|g|mg)s?\b/i,
      // Volume patterns
      /(\d+(?:\.\d+)?)\s*(l|ml|kl)s?\b/i,
      // Count patterns
      /(\d+(?:\.\d+)?)\s*(piece|pc|pcs|unit)s?\b/i,
      // Length patterns
      /(\d+(?:\.\d+)?)\s*(mm|cm|m|km)s?\b/i,
      // Area patterns
      /(\d+(?:\.\d+)?)\s*(sq\.m|sq\.ft|sq\.cm)s?\b/i
    ];
  
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        try {
          return parseQuantity(`${match[1]} ${match[2]}`);
        } catch {
          continue;
        }
      }
    }
  
    // Default to 1 unit if no quantity found
    return {
      value: 1,
      unit: 'unit' as Unit,
      category: 'count'
    };
  }
  