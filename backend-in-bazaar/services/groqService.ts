import { ChatGroq } from "@langchain/groq";
import { 
  MarketAnalysis, 
  PriceSuggestion,
  ProductPrice,
  QuantityInfo 
} from "../types";
import { AIMessage } from "@langchain/core/messages";

export async function getAIAnalysis(
  productName: string, 
  data: string,
  basePrice?: number
): Promise<string> {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-70b-8192",
  });

  const prompt = `
Analyze the market data for ${productName} with the following information:
${data}
${basePrice ? `Base price: ₹${basePrice}` : ''}

Please provide a comprehensive market analysis including:

1. Price Analysis:
   - Recommended price point with clear reasoning
   - Analysis of market high, low, and average prices

Format all prices with ₹ symbol and ensure they are clearly labeled.
The web scraped prices can vary a lot from the actual price so keeping in mind the base price, suggest a competitive price point.
The suggested price should be competitive and maintain a reasonable margin according to the base price.
Provide specific numerical values for all price points mentioned.
Please keep the analysis brief and under 150 words.
When bargaining, consider the base price, stop loss and the suggested price point.
`;

  const response = await model.invoke(prompt);
  
  if (response instanceof AIMessage) {
    return response.content as string;
  }
  
  return '';
}

export async function analyzePricingStrategy(
  productName: string,
  priceData: ProductPrice[],
  basePrice: number
): Promise<MarketAnalysis> {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama3-70b-8192",
  });

  const prompt = `
Analyze the pricing strategy for ${productName} quantity wise:
${JSON.stringify(priceData, null, 2)}
Base price: ₹${basePrice}

Provide detailed analysis including:
1. Price points (suggested price, market high/low/average)

Format all prices with ₹ symbol and ensure numeric precision.The web scraped prices can vary a lot from the actual price so keeping in mind the base price, suggest a competitive price point.
The suggested price should be competitive and maintain a reasonable margin according to the base price.
Please keep the analysis brief and under 150 words.
`;

  const response = await model.invoke(prompt);
  
  try {
    const analysisText = response instanceof AIMessage ? 
      (response.content as string) : '';

    // Extract price information using regex
    const extractPrice = (text: string, pattern: RegExp): number => {
      const match = text.match(pattern);
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    };

    const patterns = {
      suggested: /suggested price.*?₹([\d,]+(\.\d{2})?)/i,
      high: /market high.*?₹([\d,]+(\.\d{2})?)/i,
      low: /market low.*?₹([\d,]+(\.\d{2})?)/i,
      average: /market average.*?₹([\d,]+(\.\d{2})?)/i
    };

    // Extract sections using a helper function
    const extractSection = (text: string, sectionName: string): string => {
      const pattern = new RegExp(`${sectionName}:(.*?)(?=\\n\\n|$)`, 'i');
      return text.match(pattern)?.[1]?.trim() || '';
    };

    const result: MarketAnalysis = {
      priceAnalysis: {
        suggestedPrice: extractPrice(analysisText, patterns.suggested),
        marketHigh: extractPrice(analysisText, patterns.high),
        marketLow: extractPrice(analysisText, patterns.low),
        marketAverage: extractPrice(analysisText, patterns.average),
        basePrice: basePrice,
        reasoning: extractSection(analysisText, 'Price Analysis')
      },
      pricingStrategy: extractSection(analysisText, 'Pricing Strategy'),
      marketTrends: extractSection(analysisText, 'Market Trends'),
      recommendations: extractSection(analysisText, 'Recommendations')
    };

    return result;
  } catch (error) {
    console.error('Error parsing AI analysis:', error);
    throw new Error('Failed to parse AI analysis response');
  }
}