/**
 * Local Hint Provider
 * 
 * Provides hints from a curated local JSON file.
 * Used as a fallback when MCP is unavailable or as the primary provider
 * for offline/testing scenarios.
 */

import { HintProvider, HintContext, HintResult } from './types';
import localHints from './local-hints.json';

type LocalHintsData = Record<string, Record<string, string>>;

export class LocalHintProvider implements HintProvider {
  readonly name = 'LocalHintProvider';
  private hints: LocalHintsData;

  constructor() {
    this.hints = localHints as LocalHintsData;
  }

  async getHint(context: HintContext): Promise<HintResult> {
    const { scenarioId, category, hintsUsed } = context;

    // Get hints for this scenario, or fall back to generic hints
    const scenarioHints = this.hints[scenarioId] ?? this.hints['fallback'];
    
    if (!scenarioHints) {
      return {
        hint: 'Think about which governance controls would address the specific risks described in this scenario.',
        source: 'local',
      };
    }

    let hint: string;
    let hintCategory = category;

    // Strategy for selecting hints based on hint count:
    // - First hint: General guidance
    // - Subsequent hints: Try to provide category-specific guidance
    if (hintsUsed === 0 || !category) {
      hint = scenarioHints['general'] ?? this.getRandomHint(scenarioHints);
    } else {
      // Try to get a category-specific hint
      const categoryKey = category as string;
      if (scenarioHints[categoryKey]) {
        hint = scenarioHints[categoryKey];
      } else {
        // Fall back to a random hint we haven't given yet
        hint = this.getRandomHint(scenarioHints);
        hintCategory = undefined;
      }
    }

    return {
      hint,
      source: 'local',
      category: hintCategory,
      learnMoreUrl: 'https://learn.microsoft.com/microsoft-365-copilot/microsoft-365-copilot-setup',
    };
  }

  private getRandomHint(scenarioHints: Record<string, string>): string {
    const keys = Object.keys(scenarioHints);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return scenarioHints[randomKey];
  }
}
