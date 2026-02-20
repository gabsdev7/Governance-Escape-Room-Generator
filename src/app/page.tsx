'use client';

import { useRouter } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { startGame } = useGameState();

  const handleStartGame = () => {
    startGame();
    router.push('/game');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl mb-6 shadow-lg">
          <span className="text-5xl">🔐</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Governance Escape Room
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Master Microsoft 365 Copilot and Copilot Studio governance through
          interactive escape room scenarios. Choose the right controls to
          mitigate risks and protect your organization.
        </p>
      </div>

      {/* Game Start Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
        <div className="text-center">
          <p className="text-slate-600 mb-6">
            Work through all five governance scenarios. Read each
            story, identify the risks, and select the right governance
            controls to earn the highest score.
          </p>
          <Button variant="primary" size="lg" onClick={handleStartGame}>
            Start Game
          </Button>
        </div>
      </div>

      {/* How It Works */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">📖</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            1. Read the Scenario
          </h3>
          <p className="text-slate-600 text-sm">
            Each scenario presents a real-world governance challenge involving
            Copilot or Copilot Studio.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            2. Select Controls
          </h3>
          <p className="text-slate-600 text-sm">
            Choose from a curated library of governance controls and principles
            to mitigate the identified risks.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            3. Get Graded
          </h3>
          <p className="text-slate-600 text-sm">
            Receive instant feedback with your score, what you got right, what
            you missed, and implementation gotchas.
          </p>
        </div>
      </div>

      {/* Scenarios Preview */}
      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          Five Governance Challenges Await
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: '📁',
              title: 'The Leaky SharePoint Library',
              topic: 'Oversharing & Permissions',
            },
            {
              icon: '🏷️',
              title: 'Label Lockdown',
              topic: 'Sensitivity Labels & Encryption',
            },
            {
              icon: '🚧',
              title: 'DLP Tripwires',
              topic: 'Data Loss Prevention',
            },
            {
              icon: '🛡️',
              title: 'Prompt Injection at the Factory Gate',
              topic: 'Agent Safety & Tool Abuse',
            },
            {
              icon: '👤',
              title: 'Shadow Connector & External Sharing',
              topic: 'Connector Governance',
            },
          ].map((scenario) => (
            <div
              key={scenario.title}
              className="bg-white rounded-lg p-4 border border-slate-200"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{scenario.icon}</span>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm">
                    {scenario.title}
                  </h4>
                  <p className="text-xs text-slate-500">{scenario.topic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
