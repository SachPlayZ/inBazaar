import { ChatGroq } from '@langchain/groq';
// import dotenv from "dotenv";

// dotenv.config();

interface BargainingSession {
  currentPrice: number;
  initialPrice: number;
  stopLossPercentage: number;
  attemptCount: number;
  priceHistory: number[];
  quantity: string;
  minReduction: number;
  maxReduction: number;
  lastResponse: string;
}

interface PriceSummary {
  initialPrice: number;
  currentOffer: number;
  totalReduction: number;
  reductionPercentage: number;
  attempt: number;
  maxAttempts: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface BargainingResponse {
  currentPrice: number;
  message: string;
  attemptCount: number;
  canContinue: boolean;
  stopLossReached: boolean;
  priceSummary: PriceSummary;
}

interface APIResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
}

export function parseQuantity(quantityStr: string): {
  value: number;
  unit: string;
} {
  const match = quantityStr.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
  if (!match) {
    throw new Error(
      "Invalid quantity format. Expected format: '5 kg' or '1.5 l'",
    );
  }
  return {
    value: parseFloat(match[1]),
    unit: match[2].toLowerCase(),
  };
}

export class BargainingAgent {
  private model: ChatGroq;
  private readonly MAX_ATTEMPTS = 10;
  private session: BargainingSession | null = null;

  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY ?? '',
      model: 'llama3-70b-8192',
    });
  }

  private calculateStopLossPrice(
    basePrice: number,
    stopLossPercentage: number,
  ): number {
    const validatedPercentage = Math.min(Math.max(stopLossPercentage, 1), 11);
    return Number((basePrice * (1 - validatedPercentage / 100)).toFixed(2));
  }

  private generateWeightedRandom(
    min: number,
    max: number,
    bias: number = 0.5,
  ): number {
    const r = Math.random();
    const weighted = Math.pow(r, 1 - bias);
    return min + weighted * (max - min);
  }

  private calculateNextPrice(): number {
    if (!this.session) {
      throw new Error('No active session');
    }

    const stopLossPrice = this.calculateStopLossPrice(
      this.session.initialPrice,
      this.session.stopLossPercentage,
    );

    const remainingAttempts = this.MAX_ATTEMPTS - this.session.attemptCount;
    const totalPriceRange = this.session.initialPrice - stopLossPrice;
    const progress = this.session.attemptCount / this.MAX_ATTEMPTS;

    let reductionRate: number;
    if (progress < 0.3) {
      reductionRate = this.generateWeightedRandom(0.05, 0.1, 0.4);
    } else if (progress < 0.7) {
      reductionRate = this.generateWeightedRandom(0.03, 0.07, 0.6);
    } else {
      reductionRate = this.generateWeightedRandom(0.02, 0.05, 0.7);
    }

    const reduction = totalPriceRange * reductionRate;
    let newPrice = this.session.currentPrice - reduction;

    newPrice = Math.max(newPrice, stopLossPrice);
    newPrice = Number(newPrice.toFixed(2));

    if (this.session.priceHistory.includes(newPrice)) {
      const minAdjustment = 0.01;
      const maxAdjustment = reduction * 0.1;
      const adjustment = this.generateWeightedRandom(
        minAdjustment,
        maxAdjustment,
        0.5,
      );
      newPrice = Math.max(
        stopLossPrice,
        Math.min(
          this.session.currentPrice - minAdjustment,
          newPrice + adjustment,
        ),
      );
      newPrice = Number(newPrice.toFixed(2));
    }

    return newPrice;
  }

  private generatePriceSummary(
    status: 'pending' | 'accepted' | 'rejected',
  ): PriceSummary {
    if (!this.session) {
      throw new Error('No active session');
    }

    return {
      initialPrice: this.session.initialPrice,
      currentOffer: this.session.currentPrice,
      totalReduction: Number(
        (this.session.initialPrice - this.session.currentPrice).toFixed(2),
      ),
      reductionPercentage: Number(
        (
          ((this.session.initialPrice - this.session.currentPrice) /
            this.session.initialPrice) *
          100
        ).toFixed(2),
      ),
      attempt: this.session.attemptCount,
      maxAttempts: this.MAX_ATTEMPTS,
      status,
    };
  }

  private async generateBargainingResponse(
    productName: string,
    currentPrice: number,
    previousPrice: number | null,
    quantity: string,
    attempt: number,
    isAtStopLoss: boolean = false,
    isMaxAttempts: boolean = false,
  ): Promise<string> {
    const priceReduction = previousPrice
      ? (previousPrice - currentPrice).toFixed(2)
      : '0.00';
    const percentageReduction = previousPrice
      ? (((previousPrice - currentPrice) / previousPrice) * 100).toFixed(1)
      : '0.0';

    const prompt = `
CONTEXT:
You are an experienced retail salesperson negotiating the price for ${quantity} of ${productName}.
Current offer: ₹${currentPrice.toFixed(2)}
${previousPrice ? `Previous offer: ₹${previousPrice.toFixed(2)}` : ''}
${previousPrice ? `Price reduction: ₹${priceReduction} (${percentageReduction}%)` : ''}
Negotiation progress: Attempt ${attempt} of ${this.MAX_ATTEMPTS}
${isAtStopLoss ? 'STATUS: At minimum possible price' : ''}
${isMaxAttempts ? 'STATUS: Final negotiation attempt' : ''}

INSTRUCTIONS:
Generate a natural, persuasive bargaining response that:
1. Sounds like a real salesperson (casual yet professional)
2. Includes strategy based on negotiation stage:
   ${attempt <= 3 ? '- Early stage: Emphasize quality and value' : ''}
   ${attempt > 3 && attempt <= 7 ? '- Middle stage: Show flexibility and understanding' : ''}
   ${attempt > 7 ? '- Final stage: Create urgency and finality' : ''}
3. Must include the exact price: ₹${currentPrice.toFixed(2)}
4. Keep response under 2 sentences
5. Vary language and approach from previous response: "${this.session?.lastResponse || ''}"
${isAtStopLoss ? '6. Clearly indicate this is the absolute final price possible' : ''}
${isMaxAttempts ? '6. Emphasize this is the final negotiation attempt' : ''}

Generate response:`;

    try {
      const response = await this.model.invoke(prompt);
      const message = response.content as string;

      if (this.session) {
        this.session.lastResponse = message;
      }

      return message;
    } catch (error) {
      console.error('Error generating response:', error);
      if (isAtStopLoss || isMaxAttempts) {
        return `This is my final offer: ₹${currentPrice.toFixed(2)}. I cannot go any lower.`;
      }
      return `I can offer you ₹${currentPrice.toFixed(2)} for ${quantity} of ${productName}.`;
    }
  }

  public async startBargaining(
    productName: string,
    quantityStr: string,
    basePrice: number,
    stopLossPercentage: number,
  ): Promise<APIResponse<BargainingResponse>> {
    try {
      if (stopLossPercentage < 1 || stopLossPercentage > 11) {
        throw new Error('Stop loss percentage must be between 1 and 11');
      }

      const quantity = parseQuantity(quantityStr);

      const minInitialReduction = basePrice * 0.03;
      const maxInitialReduction = basePrice * 0.08;
      const initialReduction = this.generateWeightedRandom(
        minInitialReduction,
        maxInitialReduction,
        0.4,
      );
      const initialPrice = Number((basePrice - initialReduction).toFixed(2));

      this.session = {
        currentPrice: initialPrice,
        initialPrice: basePrice,
        stopLossPercentage,
        attemptCount: 1,
        priceHistory: [initialPrice],
        quantity: quantityStr,
        minReduction: 1,
        maxReduction: 5,
        lastResponse: '',
      };

      const message = await this.generateBargainingResponse(
        productName,
        this.session.currentPrice,
        basePrice,
        quantityStr,
        this.session.attemptCount,
      );

      const priceSummary = this.generatePriceSummary('pending');

      return {
        status: 'success',
        data: {
          currentPrice: this.session.currentPrice,
          message,
          attemptCount: this.session.attemptCount,
          canContinue: true,
          stopLossReached: false,
          priceSummary,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  public async continueBargaining(
    productName: string,
    accepted: boolean = false,
  ): Promise<APIResponse<BargainingResponse>> {
    try {
      if (!this.session) {
        throw new Error('No active bargaining session');
      }

      if (accepted) {
        return {
          status: 'success',
          data: {
            currentPrice: this.session.currentPrice,
            message: `Deal finalized at ₹${this.session.currentPrice.toFixed(2)}`,
            attemptCount: this.session.attemptCount,
            canContinue: false,
            stopLossReached: false,
            priceSummary: this.generatePriceSummary('accepted'),
          },
        };
      }

      if (this.session.attemptCount >= this.MAX_ATTEMPTS) {
        return {
          status: 'success',
          data: {
            currentPrice: this.session.currentPrice,
            message: `Final offer: ₹${this.session.currentPrice.toFixed(2)}`,
            attemptCount: this.session.attemptCount,
            canContinue: false,
            stopLossReached: false,
            priceSummary: this.generatePriceSummary('rejected'),
          },
        };
      }

      const previousPrice = this.session.currentPrice;
      const stopLossPrice = this.calculateStopLossPrice(
        this.session.initialPrice,
        this.session.stopLossPercentage,
      );

      const newPrice = this.calculateNextPrice();
      const isAtStopLoss = newPrice <= stopLossPrice;

      this.session.currentPrice = newPrice;
      this.session.attemptCount++;
      this.session.priceHistory.push(newPrice);

      const message = await this.generateBargainingResponse(
        productName,
        newPrice,
        previousPrice,
        this.session.quantity,
        this.session.attemptCount,
        isAtStopLoss,
        this.session.attemptCount === this.MAX_ATTEMPTS,
      );

      return {
        status: 'success',
        data: {
          currentPrice: newPrice,
          message,
          attemptCount: this.session.attemptCount,
          canContinue:
            !isAtStopLoss && this.session.attemptCount < this.MAX_ATTEMPTS,
          stopLossReached: isAtStopLoss,
          priceSummary: this.generatePriceSummary('pending'),
        },
      };
    } catch (error) {
      return {
        status: 'error',
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }
}
