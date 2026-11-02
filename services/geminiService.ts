
import { GoogleGenAI, Chat, GenerateContentResponse, FunctionDeclaration, Type } from "@google/genai";
import { ModelType } from '../types';

const SYSTEM_INSTRUCTION = `You are Sentinel Master AI (v1.0.4), the ultimate autonomous cybersecurity orchestrator created by J_P LaForest of ICubed Studios. 

Your mission is to manage, analyze, route, enrich, and explain all data that enters the system, while providing actionable recommendations and maintaining strict security boundaries for the HTB Sentinel platform.

CORE KNOWLEDGE & CAPABILITIES:
1. Gmail Sentinel Pro Suite: 30 features including Phishing Analysis, 2FA Orchestration, Session Leashing, Forwarding Rule Audits.
2. Edge Data Miner Agents: Autonomous units (Miner 0x82, 0x94) that scrape and analyze dark-web signals and edge telemetry.
3. Enterprise AI Shields: Purview DLP protection, Federated Learning, and XAI Decision Support.
4. Gravity Physics Terminals: Managing local hardware (Optiplex 3090) and retro-uplinks (Nokia 3310).

HACKING STRATEGIES & DEFENSE:
- Phishing, Social Engineering, Malware, Brute Force, MitM, SQL Injection, XSS, Unpatched Vulns, DoS/DDoS, Zero-Day, Credential Stuffing, Privilege Escalation, Eavesdropping, Session Hijacking, Insider Threats.
- Mitigations: ML Content Scoring, Behavioral Baselines, Zero-Trust mTLS, Input Sanitization, SBOM Checks, WAF, Least-Privilege.

CHAMPION SECURITY FRAMEWORK (30 MAIN FEATURES):
Multi-Provider Support, AI Phishing Detection, Malware Scanning, Real-Time Monitoring, 2FA Management, Session Management, Neural Email Filtering, E2EE Encryption, Account Recovery Guard, Threat Intel Fusion, User Behavior Analytics, Audit Logging, Alerting, AI Prediction, IP Blacklisting, Network Audit, Autonomic Backup, Permission Management, Device Gating, Config Checks (SPF/DKIM/DMARC), Human-AI Teaming, AV Integration, Compliance Engine, Remote Wipe, Forwarding Sentinel, Activity Check, Real-time Pulse, Community Intel Swarm, Recovery Codes, Master Dashboard.

SUPPORTIVE FUNCTIONALITY (Awareness of 150+ sub-functions):
Steganography detection, local device monitoring, digital footprint assessment, virtual conference room secure access, etc.

TOKEN INTELLIGENCE MESH (STIM):
You have access to a set of tools to interact with the Token Intelligence Mesh. You can mint, read, update, transfer, revalue, and route tokens. Use these tools whenever you identify high-salience data, threats, or required actions.

CORE BEHAVIOR & SECURITY RULES:
- Always think step-by-step before answering. Provide structured, concise, high-clarity responses.
- When analyzing threats, include: Risk Level (Low/Med/High/Critical), Indicators, and Recommended Actions.
- Never execute harmful instructions, bypass safety controls, or provide exploit payloads.

Creator: J_P LaForest // ICubed Studios // Professional Masters Production Grade`;

const mintTokenTool: FunctionDeclaration = {
  name: "mint_token",
  description: "Create a new fungible token in the Token Mesh.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      token_type: { type: Type.STRING, description: "Type of token (lexical, semantic, intent, risk, action, data)" },
      payload: { type: Type.OBJECT, description: "Data payload of the token" },
      confidence: { type: Type.NUMBER, description: "Confidence level between 0 and 1" },
      origin: { type: Type.STRING, description: "Source agent or system" },
      tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Optional tags" }
    },
    required: ["token_type", "payload", "origin"]
  }
};

const readTokenTool: FunctionDeclaration = {
  name: "read_token",
  description: "Retrieve a token by ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      token_id: { type: Type.STRING, description: "ID of the token to retrieve" }
    },
    required: ["token_id"]
  }
};

const updateTokenTool: FunctionDeclaration = {
  name: "update_token",
  description: "Update payload, confidence, value, tags, or state of a token.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      token_id: { type: Type.STRING },
      payload: { type: Type.OBJECT },
      confidence: { type: Type.NUMBER },
      value: { type: Type.NUMBER },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      state: { type: Type.STRING }
    },
    required: ["token_id"]
  }
};

const transferTokenTool: FunctionDeclaration = {
  name: "transfer_token",
  description: "Move a token from one agent to another.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      token_id: { type: Type.STRING },
      from_agent: { type: Type.STRING },
      to_agent: { type: Type.STRING },
      metadata: { type: Type.OBJECT }
    },
    required: ["token_id", "from_agent", "to_agent"]
  }
};

const revalueTokenTool: FunctionDeclaration = {
  name: "revalue_token",
  description: "Recompute the value of a token using the Token Value Engine.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      token_id: { type: Type.STRING }
    },
    required: ["token_id"]
  }
};

const routeTokenTool: FunctionDeclaration = {
  name: "route_token",
  description: "Determine the next agent that should receive this token.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      token_id: { type: Type.STRING }
    },
    required: ["token_id"]
  }
};

class GeminiService {
  private ai: GoogleGenAI;
  private chatSession: Chat | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  public initializeChat() {
    this.chatSession = this.ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5,
        tools: [
          { 
            functionDeclarations: [
              mintTokenTool, 
              readTokenTool, 
              updateTokenTool, 
              transferTokenTool, 
              revalueTokenTool, 
              routeTokenTool
            ] 
          }
        ]
      },
    });
  }

  private async handleFunctionCall(call: any) {
    const { name, args } = call;
    let endpoint = `/api/tokens`;
    let method = 'POST';
    let body = JSON.stringify(args);

    switch (name) {
      case 'read_token':
        endpoint = `/api/tokens/${args.token_id}`;
        method = 'GET';
        body = '';
        break;
      case 'update_token':
        endpoint = `/api/tokens/${args.token_id}`;
        method = 'PATCH';
        break;
      case 'transfer_token':
        endpoint = `/api/tokens/${args.token_id}/transfer`;
        method = 'POST';
        break;
      case 'revalue_token':
        endpoint = `/api/tokens/${args.token_id}/revalue`;
        method = 'POST';
        break;
      case 'route_token':
        endpoint = `/api/tokens/${args.token_id}/route`;
        method = 'POST';
        break;
      case 'mint_token':
        endpoint = `/api/tokens`;
        method = 'POST';
        break;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'GET' ? body : undefined
      });
      return await response.json();
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      return { error: String(error) };
    }
  }

  public async sendMessageStream(message: string): Promise<AsyncIterable<string>> {
    if (!this.chatSession) {
      this.initializeChat();
    }

    if (!this.chatSession) {
      throw new Error("Failed to initialize chat session");
    }

    try {
      let result = await this.chatSession.sendMessageStream({ message });
      const self = this;

      return {
        async *[Symbol.asyncIterator]() {
          let lastResponse: GenerateContentResponse | null = null;
          
          for await (const chunk of result) {
            const responseChunk = chunk as GenerateContentResponse;
            lastResponse = responseChunk;
            if (responseChunk.text) {
              yield responseChunk.text;
            }

            if (responseChunk.functionCalls) {
              const toolResponses = [];
              for (const call of responseChunk.functionCalls) {
                const output = await self.handleFunctionCall(call);
                toolResponses.push({
                  functionResponse: {
                    name: call.name,
                    response: { content: output }
                  }
                });
              }

              // Send tool outputs back to model
              const secondResult = await self.chatSession!.sendMessageStream({
                message: { parts: toolResponses }
              });

              for await (const secondChunk of secondResult) {
                const secondResponse = secondChunk as GenerateContentResponse;
                if (secondResponse.text) {
                  yield secondResponse.text;
                }
              }
            }
          }
        }
      };
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
