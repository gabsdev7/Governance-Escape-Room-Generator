import { NextRequest, NextResponse } from 'next/server';
import { getHint, HintContext, HINT_CONFIG } from '@/lib/hints';

/**
 * POST /api/hints
 * 
 * Get a hint for the current game context.
 * 
 * Request body:
 * {
 *   scenarioId: string;
 *   category?: ControlCategory;
 *   selectedControlIds: string[];
 *   hintsUsed: number;
 * }
 * 
 * Response:
 * {
 *   hint: string;
 *   source: 'mcp' | 'local';
 *   learnMoreUrl?: string;
 *   category?: ControlCategory;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.scenarioId || typeof body.scenarioId !== 'string') {
      return NextResponse.json(
        { error: 'scenarioId is required' },
        { status: 400 }
      );
    }

    // Validate hints used limit
    const hintsUsed = body.hintsUsed ?? 0;
    if (hintsUsed >= HINT_CONFIG.MAX_HINTS_PER_GAME) {
      return NextResponse.json(
        { error: 'Maximum hints reached for this game' },
        { status: 400 }
      );
    }

    // Build hint context
    const context: HintContext = {
      scenarioId: body.scenarioId,
      category: body.category,
      selectedControlIds: body.selectedControlIds ?? [],
      hintsUsed,
    };

    // Get hint from service
    const result = await getHint(context);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /hints] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get hint' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/hints
 * 
 * Returns hint configuration info.
 */
export async function GET() {
  return NextResponse.json({
    maxHintsPerGame: HINT_CONFIG.MAX_HINTS_PER_GAME,
    provider: process.env.HINT_PROVIDER ?? 'mcp',
  });
}
