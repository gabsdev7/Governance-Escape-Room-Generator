'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useHint } from '@/hooks/useHint';

interface HintButtonProps {
  onHintReceived?: () => void;
}

/**
 * Button to request a hint
 */
export function HintButton({ onHintReceived }: HintButtonProps) {
  const { requestHint, hintsRemaining, isLoading, canRequestHint } = useHint();

  const handleClick = async () => {
    const hint = await requestHint();
    if (hint && onHintReceived) {
      onHintReceived();
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={!canRequestHint}
      loading={isLoading}
      className="gap-2"
    >
      <span className="text-lg">💡</span>
      <span>Need a hint?</span>
      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
        {hintsRemaining} left
      </span>
    </Button>
  );
}
