/**
 * MCP Hint Provider
 * 
 * Provides hints by querying the Microsoft Learn MCP endpoint.
 * Falls back to local hints if MCP is unavailable or times out.
 * 
 * Security considerations:
 * - Does NOT send user-entered text or confidential data
 * - Only sends scenario context (scenario ID, category) for lookup
 * - Authentication headers are passed per-request, not persisted
 * - Requests/responses are logged for audit when configured
 */

import { HintProvider, HintContext, HintResult, HINT_CONFIG } from './types';
import { ControlCategory, ControlCategoryLabels } from '@/lib/controls/types';
import { getScenarioById } from '@/lib/scenarios';

/**
 * MCP request structure (simplified for hint lookups)
 */
interface MCPSearchRequest {
  query: string;
  top?: number;
}

/**
 * MCP response structure (simplified)
 */
interface MCPSearchResponse {
  results?: Array<{
    title: string;
    snippet: string;
    url: string;
  }>;
  error?: string;
}

export class MCPHintProvider implements HintProvider {
  readonly name = 'MCPHintProvider';
  private endpoint: string;
  private apiKey?: string;
  private enableLogging: boolean;

  constructor(
    endpoint?: string,
    apiKey?: string,
    enableLogging: boolean = false
  ) {
    this.endpoint = endpoint ?? process.env.MCP_ENDPOINT ?? 'https://learn.microsoft.com/api/mcp';
    this.apiKey = apiKey ?? process.env.MCP_API_KEY;
    this.enableLogging = enableLogging;
  }

  async getHint(context: HintContext): Promise<HintResult> {
    const { scenarioId, category } = context;

    // Build a search query based on scenario context
    // NOTE: We do NOT include any user-entered text to avoid sending PII
    const query = this.buildSearchQuery(scenarioId, category);

    try {
      const response = await this.searchMCP(query);
      
      if (response.results && response.results.length > 0) {
        const topResult = response.results[0];
        return {
          hint: this.formatHint(topResult.snippet),
          source: 'mcp',
          learnMoreUrl: topResult.url,
          category,
        };
      }
      
      // No results from MCP, return a generic hint
      return {
        hint: 'Consider reviewing Microsoft Learn documentation on governance best practices for this scenario type.',
        source: 'mcp',
        learnMoreUrl: 'https://learn.microsoft.com/microsoft-365-copilot/',
        category,
      };
    } catch (error) {
      // Log error but don't expose details
      if (this.enableLogging) {
        console.error('[MCPHintProvider] Error fetching hint:', error);
      }
      throw error; // Let the service handle fallback
    }
  }

  private buildSearchQuery(
    scenarioId: string,
    category?: ControlCategory
  ): string {
    // Get scenario metadata for context
    const scenario = getScenarioById(scenarioId);
    
    // Build a governance-focused search query
    // Topics are generic enough to not leak scenario specifics
    const topicMap: Record<string, string> = {
      'scenario-1-leaky-sharepoint': 'SharePoint permissions governance Copilot oversharing',
      'scenario-2-label-lockdown': 'sensitivity labels encryption Microsoft 365 Copilot',
      'scenario-3-dlp-tripwires': 'DLP data loss prevention Power Platform connectors',
      'scenario-4-prompt-injection': 'prompt injection AI safety Copilot Studio',
      'scenario-5-shadow-connector': 'connector governance Power Platform shadow IT',
    };

    let query = topicMap[scenarioId] ?? scenario?.topic ?? 'Microsoft 365 Copilot governance';
    
    // Add category context if provided
    if (category) {
      const categoryLabel = ControlCategoryLabels[category];
      query += ` ${categoryLabel}`;
    }

    return query;
  }

  private async searchMCP(query: string): Promise<MCPSearchResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      HINT_CONFIG.MCP_TIMEOUT_MS
    );

    try {
      const requestBody: MCPSearchRequest = {
        query,
        top: 3,
      };

      // Log request for audit (if enabled)
      if (this.enableLogging) {
        console.log('[MCPHintProvider] Request:', {
          endpoint: this.endpoint,
          query,
          timestamp: new Date().toISOString(),
        });
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Add authentication header per-request (not persisted)
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`MCP request failed: ${response.status}`);
      }

      const data: MCPSearchResponse = await response.json();

      // Log response for audit (if enabled)
      if (this.enableLogging) {
        console.log('[MCPHintProvider] Response:', {
          resultCount: data.results?.length ?? 0,
          timestamp: new Date().toISOString(),
        });
      }

      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private formatHint(snippet: string): string {
    // Clean up the snippet for display
    // Remove any HTML tags that might be in the response
    const cleaned = snippet.replace(/<[^>]*>/g, '');
    
    // Truncate if too long
    const maxLength = 500;
    if (cleaned.length > maxLength) {
      return cleaned.substring(0, maxLength).trim() + '...';
    }
    
    return cleaned.trim();
  }
}
