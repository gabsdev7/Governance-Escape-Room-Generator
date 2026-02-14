import { ScenarioWithRubric } from './types';

/**
 * Scenario 3: DLP Tripwires
 * Topic: Data loss prevention constraints across connectors and data movement
 */
export const scenario3DlpTripwires: ScenarioWithRubric = {
  id: 'scenario-3-dlp-tripwires',
  title: 'DLP Tripwires',
  icon: '🚧',
  topic: 'Data Loss Prevention',
  difficulty: 'standard',

  story: `
## DLP Tripwires

The sales team at Adventure Works had built something impressive: a Copilot Studio agent that could look up customer information, check order status, and even create support tickets. "It's like having a personal assistant for every sales rep," boasted the team lead.

Behind the scenes, the agent used a custom connector to their Dynamics 365 CRM, pulling customer names, email addresses, purchase history, and—critically—payment methods.

What nobody noticed was the Power Automate flow connected to the agent. Built by an enthusiastic intern, it automatically synced "high-value customer insights" to a third-party marketing analytics platform. The flow ran every hour.

Six weeks later, the GDPR compliance team discovered that PII for 12,000 EU customers—names, emails, purchase amounts, and partial payment data—had been flowing to a server in a non-EU data center. The marketing platform wasn't even in the company's approved vendor list.

The technical investigation found no malice, just gaps: the CRM connector was classified as "Business" but the marketing connector defaulted to "Non-Business." With no DLP policy explicitly blocking cross-boundary flows, the data moved freely.

**Your mission**: Identify the governance controls that would have stopped sensitive data from crossing compliance boundaries.
  `.trim(),

  riskStatement:
    'Regulated customer data flows outside compliance boundaries through automated Copilot actions and Power Platform flows to unvetted third-party services.',

  governanceObjective:
    'Enforce DLP policies that prevent sensitive data movement across business/non-business connector boundaries and ensure all data flows comply with residency requirements.',

  rubric: {
    scenarioId: 'scenario-3-dlp-tripwires',
    
    requiredControls: [
      'dlp-policy-alignment',
      'connector-dlp-policies',
      'data-residency-controls',
    ],
    
    recommendedControls: [
      'audit-logging',
      'approval-workflows',
    ],
    
    antiPatternControls: [
      'sensitivity-labels',
      'guest-access-policies',
      'mfa-enforcement',
    ],
    
    controlRationales: {
      'dlp-policy-alignment':
        'REQUIRED: Comprehensive DLP policies connecting Purview and Power Platform would identify and block sensitive data exfiltration.',
      'connector-dlp-policies':
        'REQUIRED: Power Platform DLP policies that classify connectors and block cross-group data flow would have prevented this entirely.',
      'data-residency-controls':
        'REQUIRED: Data residency boundaries should have flagged or blocked transfers to non-EU data centers for EU customer data.',
      'audit-logging':
        'RECOMMENDED: Audit logging would have detected the unusual data flow patterns earlier.',
      'approval-workflows':
        'RECOMMENDED: Requiring approval for flows connecting to external services would have added a governance checkpoint.',
      'sensitivity-labels':
        'ANTI-PATTERN: Labels protect documents, not data flowing through connectors. Complementary but not the primary control.',
      'guest-access-policies':
        'ANTI-PATTERN: Guest access is about user identity, not system-to-system data flows via connectors.',
      'mfa-enforcement':
        'ANTI-PATTERN: MFA prevents unauthorized human access. This was authorized automation moving data incorrectly.',
    },
    
    gotchas: [
      'Power Platform DLP policies evaluate at flow run time, not design time—flows may be created before policies exist.',
      'Custom connectors inherit the default connector group unless explicitly classified.',
      'DLP policies apply per-environment. A flow in a personal environment may bypass corporate policies.',
      'HTTP/webhook connectors can bypass DLP if not properly classified or blocked.',
    ],
    
    improvedApproach:
      'Implement Power Platform DLP policies at the tenant level, not just in production environments. Classify all approved business connectors explicitly. Block the HTTP and custom connector by default, requiring IT approval. Enable Power Platform audit logging and create alerts for new flows connecting to external services. Require a review process for any flow that moves CRM data outside the business connector boundary.',
  },
};
