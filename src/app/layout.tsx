import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { GameStateProvider } from '@/lib/game-state/context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Governance Escape Room | M365 Copilot Governance Training',
  description:
    'Learn Microsoft 365 Copilot and Copilot Studio governance through interactive escape room scenarios. Master data protection, DLP, sensitivity labels, and agent safety principles.',
  keywords: [
    'Microsoft 365',
    'Copilot',
    'Copilot Studio',
    'Governance',
    'Data Protection',
    'DLP',
    'Sensitivity Labels',
    'Training',
    'Escape Room',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameStateProvider>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b border-slate-200 px-4 py-3">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🔐</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-slate-900">
                      Governance Escape Room
                    </h1>
                    <p className="text-xs text-slate-500">
                      M365 Copilot Governance Training
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="bg-white border-t border-slate-200 px-4 py-4">
              <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
                <p>
                  Learn governance best practices for Microsoft 365 Copilot and
                  Copilot Studio
                </p>
              </div>
            </footer>
          </div>
        </GameStateProvider>
      </body>
    </html>
  );
}
