import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatGroq } from '@langchain/groq';
import { createGoogleShoppingTool } from './tools/webScrape';
import { PriceSuggestion, ProductPrice, QuantityInfo } from '../types';
import {
  parseQuantity,
  normalizePrice,
  getDisplayUnit,
  extractQuantityFromText,
} from '../utils/quantity';
// import dotenv from 'dotenv';

// dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY;
const serpApiKey = process.env.SERP_API_KEY;

if (!groqApiKey)
  throw new Error('GROQ_API_KEY is not set in environment variables');
if (!serpApiKey)
  throw new Error('SERP_API_KEY is not set in environment variables');

export async function createPriceAgent() {
  const model = new ChatGroq({
    apiKey: groqApiKey,
    model: 'llama3-70b-8192',
  });

  const tools = [createGoogleShoppingTool()];

  return await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'chat-conversational-react-description',
    verbose: true,
  });
}

export async function getPriceSuggestion(
  productName: string,
  quantityStr: string,
  basePrice: number,
): Promise<{
  suggestion: PriceSuggestion;
  // analysis: string;
}> {
  try {
    const quantity = parseQuantity(quantityStr);
    const searchTool = createGoogleShoppingTool();
    const searchResult = await searchTool.func(
      `${productName} ${quantity.value}${quantity.unit}`,
    );
    let priceData = JSON.parse(searchResult);

    if (priceData.error) {
      throw new Error(priceData.message || 'Failed to fetch price data');
    }

    if (!priceData.shopping_results || priceData.shopping_results.length < 1) {
      throw new Error('No valid data from trusted retailers.');
    }

    const prices = (priceData.shopping_results || [])
      .map((item: any) => {
        try {
          const itemQuantity = extractQuantityFromText(item.title) || quantity;
          const originalPrice = parseFloat(item.price.toString());
          const normalizedPrice = normalizePrice(originalPrice, itemQuantity);

          return {
            retailer: item.retailer || 'Unknown',
            price: normalizedPrice,
            originalPrice,
            quantity: itemQuantity,
            url: item.url || '',
            rating: item.rating,
            reviews: item.reviews,
            delivery: item.delivery,
          };
        } catch (e) {
          console.error('Error processing price item:', e);
          return null;
        }
      })
      .filter(
        (item: ProductPrice | null): item is ProductPrice =>
          item !== null && !isNaN(item.price) && item.price > 0,
      );

    if (prices.length === 0) {
      throw new Error('No valid price data found from trusted retailers');
    }

    const baseUnit = getDisplayUnit(quantity.category);
    const priceValues = prices.map((p: { price: any }) => p.price);

    // Calculate weighted average based on retailer ratings
    const weightedPrices = prices.map((p: { price: any; rating: any }) => ({
      price: p.price,
      weight: p.rating ? p.rating : 1,
    }));

    const totalWeight = weightedPrices.reduce(
      (sum: any, item: { weight: any }) => sum + item.weight,
      0,
    );
    const weightedAverage =
      weightedPrices.reduce(
        (sum: number, item: { price: number; weight: number }) =>
          sum + item.price * item.weight,
        0,
      ) / totalWeight;

    const marketLow = Math.min(...priceValues);
    const marketHigh = Math.max(...priceValues);
    const marketAverage = weightedAverage;

    // Calculate suggested price based on base price
    let suggestedPrice = marketAverage;
    if (suggestedPrice >= basePrice) {
      // If market average is higher than base price, set price 1% below base price
      suggestedPrice = basePrice * 0.97;
    } else if (suggestedPrice < basePrice * 0.85) {
      suggestedPrice = basePrice * 0.95;
    }
    // If market average is between 1-15% below base price
    else {
      suggestedPrice = marketAverage;
    }

    const suggestion: PriceSuggestion = {
      suggestedPrice,
      marketHigh,
      marketLow,
      marketAverage,
      pricePoints: prices,
      quantity,
      pricePerUnit: `₹${marketAverage.toFixed(2)}/${baseUnit}`,
      unit: baseUnit,
      trustedRetailersCount: prices.length,
      confidence: 0,
      reasoning: '',
    };

    const analysis = generateAnalysis(
      productName,
      quantity,
      suggestion,
      prices,
      basePrice,
    );

    // console.log('Muski');
    // console.log(suggestedPrice);
    // console.log(suggestion);

    return { suggestion };
  } catch (error) {
    console.error('Error in price analysis:', error);
    throw error;
  }
}

function generateAnalysis(
  productName: string,
  quantity: QuantityInfo,
  suggestion: PriceSuggestion,
  prices: ProductPrice[],
  basePrice: number,
): string {
  const retailerBreakdown = prices
    .sort((a, b) => a.price - b.price)
    .map((p) => {
      const ratingInfo = p.rating ? ` (Rating: ${p.rating}/5)` : '';
      const deliveryInfo = p.delivery ? ' - Delivery Available' : '';
      return `   - ${p.retailer}: ₹${p.originalPrice} for ${p.quantity.value}${p.quantity.unit}${ratingInfo}${deliveryInfo}`;
    })
    .join('\n');

  const pricingStrategy =
    suggestion.suggestedPrice < basePrice
      ? `Suggested price is set below market average to maintain competitiveness while staying under base price of ₹${basePrice}`
      : `Market prices are significantly below base price of ₹${basePrice}, suggesting room for competitive pricing`;

  return `Market Analysis for ${productName} (${quantity.value}${quantity.unit}):
1. Trusted Retailer Price Range: ₹${suggestion.marketLow.toFixed(2)} to ₹${suggestion.marketHigh.toFixed(2)} per ${suggestion.unit}
2. Weighted Average Market Price: ₹${suggestion.marketAverage.toFixed(2)} per ${suggestion.unit}
3. Base Price: ₹${basePrice.toFixed(2)} per ${suggestion.unit}
4. Recommended Price: ₹${suggestion.suggestedPrice.toFixed(2)} per ${suggestion.unit}
5. Pricing Strategy: ${pricingStrategy}
6. Retailer Price Breakdown:
${retailerBreakdown}
7. Market Insights:
   - Number of trusted retailers analyzed: ${prices.length}
   - Average rating across retailers: ${calculateAverageRating(prices)}
   - Delivery availability: ${calculateDeliveryStats(prices)}
   - Price consistency: ${calculatePriceConsistency(prices)}`;
}

function calculateAverageRating(prices: ProductPrice[]): string {
  const ratingsAvailable = prices.filter((p) => p.rating !== undefined);
  if (ratingsAvailable.length === 0) return 'N/A';

  const avgRating =
    ratingsAvailable.reduce((sum, p) => sum + (p.rating || 0), 0) /
    ratingsAvailable.length;
  return avgRating.toFixed(1) + '/5';
}

function calculateDeliveryStats(prices: ProductPrice[]): string {
  const withDelivery = prices.filter((p) => p.delivery).length;
  return `${withDelivery}/${prices.length} retailers offer delivery`;
}

function calculatePriceConsistency(prices: ProductPrice[]): string {
  if (prices.length < 2) return 'Insufficient data';

  const avg = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const variance =
    prices.reduce((sum, p) => sum + Math.pow(p.price - avg, 2), 0) /
    prices.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / avg) * 100;

  if (coefficientOfVariation < 10) return 'High (prices are very consistent)';
  if (coefficientOfVariation < 20) return 'Medium (some price variation)';
  return 'Low (significant price variation)';
}
