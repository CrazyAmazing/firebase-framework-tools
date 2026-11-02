
import { v4 as uuidv4 } from 'uuid';

export enum TokenType {
  LEXICAL = 'lexical',
  SEMANTIC = 'semantic',
  INTENT = 'intent',
  RISK = 'risk',
  ACTION = 'action',
  DATA = 'data'
}

export interface STIMToken {
  id: string;
  type: TokenType;
  content: string;
  payload: any;
  confidence: number;
  value: number; // Token Valance/Worth
  origin: string;
  timestamp: number;
  hash: string;
  metadata: Record<string, any>;
}

export interface STIMInsight {
  minerId: string;
  description: string;
  severity: 'LOW' | 'MED' | 'HIGH' | 'CRITICAL';
  data: any;
}

export class STIMService {
  private tokens: STIMToken[] = [];
  private tokenEconomy = {
    totalValue: 1000,
    inflation: 0.02,
    burnRate: 0.3,
    processedTokens: 0
  };

  /**
   * Universal Token Schema (UTS) Implementation
   */
  private createUniversalToken(type: TokenType, content: string, origin: string): STIMToken {
    const payload = { content, timestamp: Date.now() };
    const hash = this.calculateHash(payload);
    
    return {
      id: uuidv4(),
      type,
      content,
      payload,
      confidence: 0.8 + (Math.random() * 0.2),
      value: 0, // Calculated later by Valuation Engine
      origin,
      timestamp: Date.now(),
      hash,
      metadata: {
        node: 'Sentinel-3090-Edge',
        studio: 'ICubed Studios'
      }
    };
  }

  private calculateHash(data: any): string {
    return btoa(JSON.stringify(data)).slice(0, 16);
  }

  /**
   * Token Valuation Engine
   * Calculates worth based on freshness, type, and confidence
   */
  private calculateTokenValue(token: STIMToken): number {
    const typeWeights: Record<string, number> = {
      [TokenType.RISK]: 1.5,
      [TokenType.ACTION]: 1.2,
      [TokenType.SEMANTIC]: 0.8,
      [TokenType.DATA]: 0.5,
      [TokenType.LEXICAL]: 0.1
    };

    const agePenalty = (Date.now() - token.timestamp) / 3600000; // Penalty per hour
    const baseValue = (typeWeights[token.type] || 1.0) * token.confidence;
    return Math.max(0.1, baseValue - agePenalty);
  }

  /**
   * Token Normalizer
   * Ensures fungibility by standardizing payloads
   */
  private normalizeToken(token: STIMToken): STIMToken {
    return {
      ...token,
      content: token.content.toLowerCase().trim(),
      value: this.calculateTokenValue(token)
    };
  }

  /**
   * Token Retokenizer / Distiller
   * Merges similar low-value tokens into high-confidence fungible units
   */
  public distillTokens() {
    // Logic to merge tokens with same content and type to reduce noise
    const uniqueMap = new Map<string, STIMToken>();
    
    this.tokens.forEach(t => {
      const key = `${t.type}-${t.content}`;
      if (uniqueMap.has(key)) {
        const existing = uniqueMap.get(key)!;
        existing.confidence = Math.min(1.0, existing.confidence + 0.05);
        existing.value = this.calculateTokenValue(existing);
      } else {
        uniqueMap.set(key, { ...t });
      }
    });

    this.tokens = Array.from(uniqueMap.values());
  }

  /**
   * Process raw input through the 7-layer STIM architecture
   */
  public async processInput(input: string): Promise<{
    normalized: string;
    tokens: STIMToken[];
    insights: STIMInsight[];
    riskScore: number;
    economy: any;
  }> {
    this.tokenEconomy.processedTokens++;
    
    // 1. Input Normalizer
    const rawSignals = input.split(/\s+/).filter(s => s.length > 0);

    // 2. Multi-Stage Tokenizer (UTS compliant)
    const newTokens = rawSignals.map(sig => {
      const type = this.identifyType(sig);
      const token = this.createUniversalToken(type, sig, 'Input-Mesh-0x1');
      return this.normalizeToken(token);
    });

    this.tokens = [...newTokens, ...this.tokens].slice(0, 50);

    // 3. Risk Engine
    const riskScore = this.calculateRisk(newTokens);

    // 4. Data Miner Mesh
    const insights = this.mineInsights(newTokens);

    // 5. Retokenization Governor
    this.governEconomy(newTokens);

    // 7. Output Synthesizer (handled by returns)
    return { 
      normalized: input.toLowerCase(), 
      tokens: newTokens, 
      insights, 
      riskScore,
      economy: this.tokenEconomy 
    };
  }

  private identifyType(word: string): TokenType {
    const riskWords = ['select', 'drop', 'union', 'alert', 'phish', 'brute', 'exploit', 'sql'];
    const actionWords = ['get', 'post', 'run', 'execute', 'block', 'contain', 'shield'];
    const lexicalWords = ['is', 'the', 'and', 'a', 'to', 'of'];

    if (riskWords.some(w => word.includes(w))) return TokenType.RISK;
    if (actionWords.some(w => word.includes(w))) return TokenType.ACTION;
    if (lexicalWords.includes(word)) return TokenType.LEXICAL;
    return TokenType.SEMANTIC;
  }

  private calculateRisk(tokens: STIMToken[]): number {
    const riskTokens = tokens.filter(t => t.type === TokenType.RISK);
    return Math.min((riskTokens.length * 25) + (Math.random() * 10), 100);
  }

  private mineInsights(tokens: STIMToken[]): STIMInsight[] {
    const insights: STIMInsight[] = [];
    const riskCount = tokens.filter(t => t.type === TokenType.RISK).length;
    
    if (riskCount > 0) {
      insights.push({
        minerId: 'RiskMiner-0x82',
        description: `Risk Injection Vector: ${riskCount} tokens flagged`,
        severity: riskCount > 2 ? 'CRITICAL' : 'HIGH',
        data: { 
          mitigation: 'Adaptive Rate Limiting Initiated',
          vector: tokens.filter(t => t.type === TokenType.RISK).map(t => t.content)
        }
      });
    }
    return insights;
  }

  private governEconomy(newTokens: STIMToken[]) {
    const creationValue = newTokens.reduce((acc, t) => acc + t.value, 0);
    this.tokenEconomy.totalValue += creationValue;
    // Apply Burn
    this.tokenEconomy.totalValue *= (1 - this.tokenEconomy.burnRate * 0.005);
  }

  /**
   * Token Interaction Stack: Mint Token
   */
  public async mintToken(params: {
    token_type: TokenType;
    payload: any;
    confidence?: number;
    origin: string;
    tags?: string[];
  }): Promise<STIMToken> {
    const token = this.createUniversalToken(params.token_type, params.payload.content || 'UNTITLED', params.origin);
    if (params.confidence !== undefined) token.confidence = params.confidence;
    if (params.tags) token.metadata.tags = params.tags;
    token.payload = { ...token.payload, ...params.payload };
    
    const normalized = this.normalizeToken(token);
    this.tokens = [normalized, ...this.tokens].slice(0, 100);
    this.governEconomy([normalized]);
    return normalized;
  }

  /**
   * Token Interaction Stack: Read Token
   */
  public async readToken(tokenId: string): Promise<STIMToken | undefined> {
    return this.tokens.find(t => t.id === tokenId);
  }

  /**
   * Token Interaction Stack: Update Token
   */
  public async updateToken(tokenId: string, updates: Partial<STIMToken>): Promise<STIMToken | undefined> {
    const index = this.tokens.findIndex(t => t.id === tokenId);
    if (index === -1) return undefined;
    
    this.tokens[index] = { 
      ...this.tokens[index], 
      ...updates, 
      timestamp: Date.now() 
    };
    
    // Recalculate value after update
    this.tokens[index].value = this.calculateTokenValue(this.tokens[index]);
    return this.tokens[index];
  }

  /**
   * Token Interaction Stack: Transfer Token
   */
  public async transferToken(tokenId: string, fromAgent: string, toAgent: string, metadata?: any): Promise<any> {
    const token = await this.readToken(tokenId);
    if (!token) return { success: false, error: 'Token not found' };
    
    token.origin = toAgent; // Update current location
    token.metadata.transferHistory = [
      ...(token.metadata.transferHistory || []),
      { from: fromAgent, to: toAgent, timestamp: Date.now(), metadata }
    ];
    
    return { success: true, token };
  }

  /**
   * Token Interaction Stack: Revalue Token
   */
  public async revalueToken(tokenId: string): Promise<number | undefined> {
    const token = await this.readToken(tokenId);
    if (!token) return undefined;
    
    token.value = this.calculateTokenValue(token);
    return token.value;
  }

  /**
   * Token Interaction Stack: Route Token
   */
  public async routeToken(tokenId: string): Promise<{ next_agent: string; reason: string } | undefined> {
    const token = await this.readToken(tokenId);
    if (!token) return undefined;

    if (token.type === TokenType.RISK) return { next_agent: 'RiskEngine-0x82', reason: 'Security vector identified' };
    if (token.type === TokenType.ACTION) return { next_agent: 'SentinelExecutionCore', reason: 'High-intent action requested' };
    if (token.type === TokenType.SEMANTIC) return { next_agent: 'Distiller-Agent', reason: 'Data enrichment needed' };
    
    return { next_agent: 'Archive-Mesh', reason: 'Low-salience token' };
  }

  public getEconomyState() {
    return this.tokenEconomy;
  }

  public getLiveTokens() {
    return this.tokens;
  }
}

export const stimService = new STIMService();
