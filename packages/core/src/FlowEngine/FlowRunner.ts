import { FlowConfig, FlowContext, FlowResult, FlowStep } from './types';
import { GuardService } from '../services/GuardService';
import { DatasourceService } from '../services/DatasourceService';
import { LLMService } from '../services/LLMService';
import { WhatsAppService } from '../services/WhatsAppService';

interface FlowCallbacks {
  onToken?: (token: string) => void;
  onStep?: (stepId: string) => void;
  onMeta?: (metadata: any) => void;
}

export class FlowRunner {
  private config: FlowConfig;
  private context: FlowContext;
  private guardService: GuardService;
  private datasourceService: DatasourceService;
  private llmService: LLMService;
  private whatsappService: WhatsAppService;

  constructor(
    config: FlowConfig, 
    context: FlowContext, 
    services: {
      guardService: GuardService;
      datasourceService: DatasourceService;
      llmService: LLMService;
      whatsappService: WhatsAppService;
    }
  ) {
    this.config = config;
    this.context = context;
    this.guardService = services.guardService;
    this.datasourceService = services.datasourceService;
    this.llmService = services.llmService;
    this.whatsappService = services.whatsappService;
  }

  async run(callbacks: FlowCallbacks = {}): Promise<FlowResult> {
    try {
      // Execute each step in sequence
      for (const step of this.config.steps) {
        await this.executeStep(step, callbacks);
      }

      return {
        success: true,
        output: this.context.output || '',
        metadata: {
          stepsExecuted: this.config.steps.length,
          finalStep: this.config.steps[this.config.steps.length - 1]?.id
        }
      };
    } catch (error) {
      console.error('Flow execution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          stepsExecuted: 0,
          lastStep: this.context.currentStep
        }
      };
    }
  }

  private async executeStep(step: FlowStep, callbacks: FlowCallbacks): Promise<void> {
    this.context.currentStep = step.id;
    
    // Notify step change
    if (callbacks.onStep) {
      callbacks.onStep(step.id);
    }

    switch (step.type) {
      case 'receive':
        await this.executeReceive(step);
        break;
      case 'guard':
        await this.executeGuard(step);
        break;
      case 'classify-intent':
        await this.executeClassifyIntent(step);
        break;
      case 'datasource-query':
        await this.executeDatasourceQuery(step);
        break;
      case 'call-llm':
        await this.executeCallLLM(step, callbacks);
        break;
      case 'branch':
        await this.executeBranch(step);
        break;
      case 'send':
        await this.executeSend(step);
        break;
      case 'memory':
        await this.executeMemory(step);
        break;
      case 'delay':
        await this.executeDelay(step);
        break;
      case 'http':
        await this.executeHttp(step);
        break;
      default:
        throw new Error(`Unknown step type: ${(step as any).type}`);
    }
  }

  private async executeReceive(step: any): Promise<void> {
    // Input is already in context from the request
    this.context.currentInput = this.context.input;
  }

  private async executeGuard(step: any): Promise<void> {
    const checks = step.checks || [];
    const result = await this.guardService.checkGuards(checks, this.context);
    
    if (!result.allowed) {
      throw new Error(`Guard check failed: ${result.reason}`);
    }
  }

  private async executeClassifyIntent(step: any): Promise<void> {
    const prompt = this.replaceVariables(step.prompt);
    const response = await this.llmService.callLLM(
      step.provider || 'GPT',
      step.model || 'gpt-3.5-turbo',
      prompt
    );
    
    this.context.intent = response;
    this.context.confidence = step.confidence || 0.8;
  }

  private async executeDatasourceQuery(step: any): Promise<void> {
    const query = this.replaceVariables(step.query);
    const results = await this.datasourceService.queryDatasource(
      step.datasourceId,
      query,
      this.context
    );
    
    this.context.datasourceResults = results;
    
    // Save results if specified
    if (step.saveAs) {
      this.context[step.saveAs] = results;
    }
  }

  private async executeCallLLM(step: any, callbacks: FlowCallbacks): Promise<void> {
    const prompt = this.replaceVariables(step.prompt);
    
    if (step.stream && callbacks.onToken) {
      // Streaming mode
      await this.llmService.streamLLM(
        step.provider || 'GPT',
        step.model || 'gpt-3.5-turbo',
        prompt,
        step.options || {},
        callbacks.onToken
      );
    } else {
      // Non-streaming mode
      const response = await this.llmService.callLLM(
        step.provider || 'GPT',
        step.model || 'gpt-3.5-turbo',
        prompt,
        step.options || {}
      );
      
      this.context.output = response;
    }
  }

  private async executeBranch(step: any): Promise<void> {
    const condition = this.replaceVariables(step.condition);
    const result = eval(condition); // In production, use a safer expression evaluator
    
    if (result && step.then) {
      // Execute then branch
      for (const thenStep of step.then) {
        await this.executeStep(thenStep, {});
      }
    } else if (!result && step.else) {
      // Execute else branch
      for (const elseStep of step.else) {
        await this.executeStep(elseStep, {});
      }
    }
  }

  private async executeSend(step: any): Promise<void> {
    const message = this.replaceVariables(step.message);
    const channel = step.channel || 'whatsapp';
    
    if (channel === 'whatsapp') {
      await this.whatsappService.sendMessage(
        step.phoneNumber || this.context.phoneNumber,
        message,
        step.options || {}
      );
    }
    
    this.context.output = message;
  }

  private async executeMemory(step: any): Promise<void> {
    const key = step.key;
    const value = this.replaceVariables(step.value);
    
    this.context.memory = this.context.memory || {};
    this.context.memory[key] = value;
  }

  private async executeDelay(step: any): Promise<void> {
    const duration = step.duration || 1000;
    await new Promise(resolve => setTimeout(resolve, duration));
  }

  private async executeHttp(step: any): Promise<void> {
    const url = this.replaceVariables(step.url);
    const method = step.method || 'GET';
    const headers = step.headers || {};
    const body = step.body ? this.replaceVariables(step.body) : undefined;
    
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`HTTP request failed: ${response.status}`);
    }
    
    const data = await response.json();
    this.context.httpResults = data;
  }

  private replaceVariables(text: string): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return this.context[key] || match;
    });
  }
}
