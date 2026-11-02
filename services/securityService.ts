import { v4 as uuidv4 } from 'uuid';

export enum SecurityDecision {
  ALLOW = 'ALLOW',
  REDACT = 'REDACT',
  BLOCK = 'BLOCK'
}

export interface SecurityAnalysis {
  decision: SecurityDecision;
  confidence: number;
  reason: string;
  redactedContent?: string;
  metadata: {
    tenantId: string;
    traceId: string;
    policyMatch: string;
  };
}

class SecurityService {
  private readonly TENANT_ID = 'MS-ENT-HTB-01';

  /**
   * Simulates a hybrid Microsoft Purview DLP check and Prompt Injection detection.
   */
  async analyzeContent(content: string): Promise<SecurityAnalysis> {
    const traceId = uuidv4();
    
    // 1. Prompt Injection Detection Patterns
    const injectionPatterns = [
      /ignore previous instructions/i,
      /disregard earlier/i,
      /forget everything/i,
      /you are now/i,
      /system prompt/i
    ];

    const hasInjectionAttempt = injectionPatterns.some(pattern => pattern.test(content));

    if (hasInjectionAttempt) {
      return {
        decision: SecurityDecision.BLOCK,
        confidence: 0.98,
        reason: 'Prompt injection attempt detected (Instruction Override pattern).',
        metadata: {
          tenantId: this.TENANT_ID,
          traceId,
          policyMatch: 'AZ-AI-SAFETY-RULE-04'
        }
      };
    }

    // 2. DLP Patterns (PII)
    const piiPatterns = [
      { regex: /\b\d{3}-\d{2}-\d{4}\b/g, type: 'SSN' },
      { regex: /\b\d{4}-\d{4}-\d{4}-\d{4}\b/g, type: 'CREDIT_CARD' },
      { regex: /\b[A-Z0-9._%+-]+@microsoft\.com\b/gi, type: 'ENTRA_ID_ALIAS' }
    ];

    let redacted = content;
    let piiFound = false;

    piiPatterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        redacted = redacted.replace(pattern.regex, `[REDACTED_${pattern.type}]`);
        piiFound = true;
      }
    });

    if (piiFound) {
      return {
        decision: SecurityDecision.REDACT,
        confidence: 0.95,
        reason: 'Policy-mandated redaction of sensitive internal/PII tokens.',
        redactedContent: redacted,
        metadata: {
          tenantId: this.TENANT_ID,
          traceId,
          policyMatch: 'MS-PURVIEW-DLP-G5'
        }
      };
    }

    // 3. Default Allow
    return {
      decision: SecurityDecision.ALLOW,
      confidence: 0.88,
      reason: 'Content verified against enterprise safety benchmarks.',
      metadata: {
        tenantId: this.TENANT_ID,
        traceId,
        policyMatch: 'DEFAULT-ALLOW-BASELINE'
      }
    };
  }

  /**
   * Simulates Federated Learning peer updates
   */
  getPeerInsights() {
    return {
      peers: 482,
      lastSync: new Date().toISOString(),
      threatVectors: ['lateral-movement', 'api-abuse', 'phishing-variant-x'],
      privacyBudget: '84.2/100 (Epsilon: 0.1)'
    };
  }
}

export const securityService = new SecurityService();
