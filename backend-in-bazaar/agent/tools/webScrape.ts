import { DynamicTool } from "langchain/tools";
import axios from 'axios';
import { SupportedCurrency, ShoppingResult, QuantityInfo } from "../../types";
import { extractQuantityFromText } from "../../utils/quantity";

const CURRENCY_RATES: Record<SupportedCurrency, number> = {
  USD: 75,
  EUR: 85,
  GBP: 95,
  INR: 1
};

// List of trusted retailers
const TRUSTED_RETAILERS = [
  'amazon.in',
  'blinkit',
  'zepto',
  'jiomart',
  'bigbasket',
  'flipkart',
];

// Helper function to check if a retailer is trusted
const isTrustedRetailer = (retailer: string): boolean => {
  const normalizedRetailer = retailer.toLowerCase().trim();
  return TRUSTED_RETAILERS.some(trusted => 
    normalizedRetailer.includes(trusted) || 
    trusted.includes(normalizedRetailer)
  );
};

const convertToINR = (price: number, currency: SupportedCurrency): number => {
  if (currency === 'INR') return price;
  return price * CURRENCY_RATES[currency];
};

const cleanPrice = (price: string, currency: string = 'INR'): number => {
  const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
  return convertToINR(numericPrice, currency as SupportedCurrency);
};

export const createGoogleShoppingTool = () => {
    const SERP_API_KEY = process.env.SERP_API_KEY;
    const SERP_API_URL = 'https://serpapi.com/search.json';
  
    return new DynamicTool({
      name: "search_shopping_prices",
      description: "Searches for product prices using Google Shopping from trusted retailers",
      func: async (productName: string) => {
        try {
          const shoppingResponse = await axios.get(SERP_API_URL, {
            params: {
              api_key: SERP_API_KEY,
              q: productName,
              location: 'India',
              gl: 'in',
              hl: 'en',
              google_domain: 'google.co.in',
              tbm: 'shop',
              num: 100 // Keep high to ensure we get enough trusted retailers
            }
          });
  
          let results: ShoppingResult[] = [];
  
          if (shoppingResponse.data.shopping_results) {
            results = shoppingResponse.data.shopping_results
              .filter((item: any) => {
                const retailer = (item.source || item.seller || '').toLowerCase();
                return isTrustedRetailer(retailer);
              })
              // Take only first 5 trusted results
              .slice(0, 5)
              .map((item: any) => {
                const quantity = extractQuantityFromText(item.title);
                return {
                  title: item.title,
                  price: cleanPrice(item.price, (item.currency || 'INR') as SupportedCurrency),
                  retailer: item.source || item.seller || 'Unknown Retailer',
                  url: item.link,
                  rating: item.rating,
                  reviews: item.reviews,
                  delivery: item.delivery,
                  thumbnail: item.thumbnail,
                  quantity
                };
              });
          }
  
          if (results.length > 0) {
            try {
              const productResponse = await axios.get(SERP_API_URL, {
                params: {
                  api_key: SERP_API_KEY,
                  engine: 'google_product',
                  product_id: shoppingResponse.data.shopping_results[0].product_id,
                  gl: 'in',
                  hl: 'en'
                }
              });
  
              return JSON.stringify({
                query: productName,
                timestamp: new Date().toISOString(),
                total_results: results.length,
                filtered_retailers: true,
                max_results: 5, // Add this to indicate limit
                trusted_sources: TRUSTED_RETAILERS,
                product_details: {
                  description: productResponse.data.description,
                  specs: productResponse.data.specifications,
                  variants: productResponse.data.variants,
                  reviews_data: productResponse.data.reviews,
                  stores: productResponse.data.stores?.filter((store: any) => 
                    isTrustedRetailer(store.name || '')
                  ).slice(0, 5) // Also limit store results
                },
                shopping_results: results.sort((a, b) => a.price - b.price),
                metadata: {
                  currency: 'INR',
                  location: 'India',
                  search_type: 'shopping'
                }
              });
            } catch (error) {
              return JSON.stringify({
                query: productName,
                timestamp: new Date().toISOString(),
                total_results: results.length,
                filtered_retailers: true,
                max_results: 5,
                trusted_sources: TRUSTED_RETAILERS,
                shopping_results: results.sort((a, b) => a.price - b.price),
                metadata: {
                  currency: 'INR',
                  location: 'India',
                  search_type: 'shopping'
                }
              });
            }
          }
  
          throw new Error('No shopping results found from trusted retailers');
  
        } catch (error) {
          console.error('Error in Google Shopping search:', error);
          
          if (axios.isAxiosError(error)) {
            return JSON.stringify({
              error: 'SerpAPI Error',
              message: error.response?.data || error.message,
              status: error.response?.status,
              query: productName
            });
          }
          
          return JSON.stringify({
            error: 'Search Error',
            message: error instanceof Error ? error.message : 'Failed to fetch shopping results',
            query: productName
          });
        }
      },
    });
  };