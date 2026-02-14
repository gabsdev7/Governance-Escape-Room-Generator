import { ScenarioWithRubric } from './types';

/**
 * Scenario 2: Label Lockdown
 * Topic: Sensitivity labels / encryption / handling confidential content
 */
export const scenario2LabelLockdown: ScenarioWithRubric = {
  id: 'scenario-2-label-lockdown',
  title: 'Label Lockdown',
  icon: '🏷️',
  topic: 'Sensitivity Labels & Encryption',
  difficulty: 'standard',

  story: `
## Label Lockdown

The marketing team at Northwind Traders was thrilled with their new Copilot-powered blog writing assistant. "Write an engaging blog post about our upcoming product launch," typed Marcus, the content manager.

Three days later, the company's stock price swung wildly after a tech news site published an article with uncanny details about Northwind's unannounced features—details that matched Marcus's draft almost word for word.

The forensic review told a troubling story.

Marcus's Copilot query had pulled content from a document titled "Q4 Product Roadmap - Board Confidential" sitting in a department SharePoint folder. The document was marked with a red "CONFIDENTIAL" watermark added manually by the author—but it had no sensitivity label.

Without a label, there was no encryption. Without encryption, there was no access control beyond SharePoint permissions. And without access control, Copilot treated it as fair game for anyone in Marketing who had site access.

The roadmap content flowed into the blog draft. The blog draft was emailed to an external agency for design work. The rest is SEC filing history.

**Your mission**: Identify the governance controls that would have kept confidential content confidential.
  `.trim(),

  riskStatement:
    'Confidential strategic content is inadvertently included in public-facing communications because it lacks proper sensitivity labeling and encryption.',

  governanceObjective:
    'Ensure sensitive content is properly classified with sensitivity labels, encrypted where required, and that Copilot respects label-based access boundaries.',

  rubric: {
    scenarioId: 'scenario-2-label-lockdown',
    
    requiredControls: [
      'sensitivity-labels',
      'encryption-enforcement',
      'label-inheritance',
    ],
    
    recommendedControls: [
      'content-marking',
      'dlp-policy-alignment',
    ],
    
    antiPatternControls: [
      'tool-scoping',
      'prompt-hardening',
      'connector-allowlist',
    ],
    
    controlRationales: {
      'sensitivity-labels':
        'REQUIRED: Sensitivity labels are the foundation of content classification. A "Confidential" label would have restricted who could access the roadmap.',
      'encryption-enforcement':
        'REQUIRED: Encryption tied to labels ensures content remains protected even if it leaves the organization.',
      'label-inheritance':
        'REQUIRED: Auto-labeling and container inheritance ensures new documents get appropriate protection automatically.',
      'content-marking':
        'RECOMMENDED: Visual markings (headers/footers) reinforce classification and alert users to sensitivity.',
      'dlp-policy-alignment':
        'RECOMMENDED: DLP policies can block labeled content from being shared externally.',
      'tool-scoping':
        'ANTI-PATTERN: Tool scoping is for agent actions, not content classification. This was a labeling gap.',
      'prompt-hardening':
        'ANTI-PATTERN: Prompt hardening protects against manipulation, not content classification failures.',
      'connector-allowlist':
        'ANTI-PATTERN: Connector governance is for Power Platform integrations, not document protection.',
    },
    
    gotchas: [
      'Manual watermarks and visual markings without sensitivity labels provide no technical protection.',
      'Default container labels (site/library level) don\'t automatically apply to existing documents—only new ones.',
      'Users can downgrade labels unless you configure label policies to require justification or block downgrades.',
      'Encryption can break some workflows (like external sharing) unless you plan the user experience carefully.',
    ],
    
    improvedApproach:
      'Implement a sensitivity labeling taxonomy starting with "Public," "Internal," "Confidential," and "Highly Confidential." Enable auto-labeling policies to detect confidential content patterns. Configure encryption on "Confidential" and above labels. Set default labels at the container level for sensitive document libraries. Enable DLP policies to alert on or block external sharing of labeled content.',
  },
};
