/**
 * Telemetry Module
 * 
 * Lightweight telemetry hooks for usage tracking.
 * Default: OFF (must be explicitly enabled via NEXT_PUBLIC_ENABLE_TELEMETRY)
 */

type TelemetryEventName =
  | 'game_started'
  | 'hint_requested'
  | 'game_submitted'
  | 'results_viewed'
  | 'control_selected'
  | 'control_deselected';

interface TelemetryProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Check if telemetry is enabled
 */
function isTelemetryEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return process.env.NEXT_PUBLIC_ENABLE_TELEMETRY === 'true';
}

/**
 * Track a telemetry event
 * 
 * When enabled, logs events to console.
 * In production, this should be extended to send to an analytics service.
 */
export function trackEvent(
  eventName: TelemetryEventName,
  properties?: TelemetryProperties
): void {
  if (!isTelemetryEnabled()) return;

  const event = {
    name: eventName,
    properties: properties ?? {},
    timestamp: new Date().toISOString(),
  };

  // In development/MVP, log to console
  console.log('[Telemetry]', event);

  // TODO: In production, send to analytics service
  // Example: sendToAnalytics(event);
}

/**
 * Track game start event
 */
export function trackGameStarted(scenarioId: string): void {
  trackEvent('game_started', { scenarioId });
}

/**
 * Track hint request event
 */
export function trackHintRequested(
  scenarioId: string,
  hintNumber: number,
  source: 'mcp' | 'local'
): void {
  trackEvent('hint_requested', { scenarioId, hintNumber, source });
}

/**
 * Track game submission event
 */
export function trackGameSubmitted(
  scenarioId: string,
  score: number,
  controlsSelected: number,
  hintsUsed: number
): void {
  trackEvent('game_submitted', {
    scenarioId,
    score,
    controlsSelected,
    hintsUsed,
  });
}

/**
 * Track results viewed event
 */
export function trackResultsViewed(scenarioId: string, score: number): void {
  trackEvent('results_viewed', { scenarioId, score });
}
