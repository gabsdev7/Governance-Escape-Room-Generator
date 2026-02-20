# Governance Escape Room

An interactive web-based learning game that teaches Microsoft 365 Copilot and Copilot Studio governance through "escape room" style scenarios.

## Overview

Players are presented with governance challenge scenarios involving M365 Copilot or Copilot Studio. They must identify the correct governance controls to mitigate risks and earn points based on their selections.

**Features:**
- 5 unique governance scenarios covering oversharing, sensitivity labels, DLP, prompt injection, and shadow IT
- Curated library of 25+ governance controls across 6 categories
- MCP-backed hints using Microsoft Learn best practices
- Deterministic scoring with detailed feedback
- Implementation gotchas and admin role mappings

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/gabsdev7/Governance-Escape-Room-Generator.git
cd Governance-Escape-Room-Generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Deployment**: Azure Static Web Apps

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home/start screen
│   ├── game/page.tsx      # Main gameplay
│   ├── results/page.tsx   # Results display
│   └── api/hints/         # Hint API route
├── components/
│   ├── ui/                # Reusable UI primitives
│   ├── game/              # Game-specific components
│   └── results/           # Results components
├── lib/
│   ├── controls/          # Governance control library
│   ├── scenarios/         # 5 escape room scenarios
│   ├── grading/           # Scoring engine
│   ├── hints/             # MCP hint providers
│   ├── game-state/        # React context & state
│   └── telemetry/         # Optional telemetry
└── hooks/                 # Custom React hooks
```

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm test          # Run unit tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Game Flow

1. **Start Game**: Click "Start Game" to receive a random scenario
2. **Read Scenario**: Understand the governance challenge and risks
3. **Select Controls**: Choose governance controls from the library
4. **Get Hints**: Request up to 3 hints (sourced from Microsoft Learn)
5. **Submit**: Get your score and detailed feedback
6. **Review**: Learn from correct picks, missed items, and gotchas

## Configuration

See [MCP Configuration](docs/MCP_CONFIGURATION.md) for hint provider setup.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_ENDPOINT` | MCP server URL for hints | `https://learn.microsoft.com/api/mcp` |
| `MCP_API_KEY` | Optional API key for MCP | - |
| `HINT_PROVIDER` | Provider type: `mcp` or `local` | `mcp` |
| `NEXT_PUBLIC_ENABLE_TELEMETRY` | Enable telemetry | `false` |

## Scenarios

| # | Title | Topic |
|---|-------|-------|
| 1 | The Leaky SharePoint Library | Oversharing & Permissions |
| 2 | Label Lockdown | Sensitivity Labels & Encryption |
| 3 | DLP Tripwires | Data Loss Prevention |
| 4 | Prompt Injection at the Factory Gate | Agent Safety & Tool Abuse |
| 5 | Shadow Connector & External Sharing | Connector Governance |

See [Scenarios Documentation](docs/SCENARIOS.md) for detailed scenario descriptions.

## Scoring Rubric

| Component | Points |
|-----------|--------|
| Required Controls | 70 pts (divided equally) |
| Recommended Controls | 30 pts (divided equally) |
| Anti-pattern Penalty | -4 pts each (max -20) |
| **Total** | **0-100 pts** |

**Grade Scale:**
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: Below 60

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Test specific file
npm test -- grader.test.ts
```

## Deployment

### Azure Static Web Apps

1. Create Azure Static Web App resource
2. Connect to GitHub repository
3. Configure build settings:
   - App location: `/`
   - API location: (empty)
   - Output location: `.next/standalone`
4. Add environment variables in Azure portal

The included GitHub Action (`.github/workflows/azure-static-web-apps.yml`) handles CI/CD.

## Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels on controls and cards
- Focus indicators
- Screen reader compatible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm test`
4. Run lint: `npm run lint`
5. Submit pull request

## License

N/A

## Resources

- [Microsoft 365 Copilot Governance](https://learn.microsoft.com/microsoft-365-copilot/)
- [Copilot Studio Documentation](https://learn.microsoft.com/microsoft-copilot-studio/)
- [Microsoft Purview](https://learn.microsoft.com/purview/)
- [Power Platform Governance](https://learn.microsoft.com/power-platform/admin/)
