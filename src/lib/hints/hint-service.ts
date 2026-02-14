/**
 * Hint Service
 * 
 * Orchestrates hint provider selection and fallback behavior.
 * - Reads HINT_PROVIDER env var to select primary provider
 * - Falls back to LocalHintProvider if MCP fails
 */

import { HintProvider, HintContext, HintResult } from './types';
import { LocalHintProvider } from './local-hint-provider';
import { MCPHintProvider } from './mcp-hint-provider';

export type HintProviderType = 'mcp' | 'local';

/**
 * Get the configured hint provider type
 */
function getProviderType(): HintProviderType {
  const configuredProvider = process.env.HINT_PROVIDER?.toLowerCase();
  if (configuredProvider === 'local') {
    return 'local';
  }
  return 'mcp'; // Default to MCP
}

/**
 * Hint Service - singleton orchestrator for hint fetching
 */
class HintService {
  private mcpProvider: HintProvider;
  private localProvider: HintProvider;
  private providerType: HintProviderType;

  constructor() {
    this.localProvider = new LocalHintProvider();
    this.mcpProvider = new MCPHintProvider();
    this.providerType = getProviderType();
  }

  /**
   * Get a hint for the given context
   * 
   * If MCP is configured but fails, falls back to local provider.
   */
  async getHint(context: HintContext): Promise<HintResult> {
    if (this.providerType === 'local') {
      return this.localProvider.getHint(context);
    }

    // Try MCP first, fall back to local on failure
    try {
      return await this.mcpProvider.getHint(context);
    } catch (error) {
      console.warn(
        '[HintService] MCP provider failed, falling back to local:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return this.localProvider.getHint(context);
    }
  }

  /**
   * Get the current provider type
   */
  getProviderType(): HintProviderType {
    return this.providerType;
  }
}

// Export singleton instance
export const hintService = new HintService();

/**
 * Convenience function to get a hint
 */
export async function getHint(context: HintContext): Promise<HintResult> {
  return hintService.getHint(context);
}
