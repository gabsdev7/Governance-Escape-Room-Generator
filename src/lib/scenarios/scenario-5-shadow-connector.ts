import { ScenarioWithRubric } from './types';

/**
 * Scenario 5: Shadow Connector & External Sharing
 * Topic: Unapproved connector use, external access, and governance bypass
 */
export const scenario5ShadowConnector: ScenarioWithRubric = {
  id: 'scenario-5-shadow-connector',
  title: 'Shadow Connector & External Sharing',
  icon: '👤',
  topic: 'Connector Governance',
  difficulty: 'standard',

  story: `
## Shadow Connector & External Sharing

When Fabrikam Bank's innovation team built their Copilot Studio agent for internal Q&A, they were solving a real problem: employees spent hours searching for policy documents. The agent worked beautifully—too beautifully.

Word spread. Soon, the loan operations team wanted to extend it. One ambitious analyst, Jordan, had an idea: "What if we connect it to our team's Slack workspace so remote contractors can ask compliance questions?"

Jordan found a Slack connector in the Power Platform catalog. It wasn't on the approved vendor list, but it connected easily. Within an hour, the agent was responding to queries in a Slack channel that included three external contractors—none of whom had passed the bank's vendor security assessment.

The queries started simple: "What's the policy on loan modifications?" But soon contractors were asking about specific customer escalations, expecting the agent to have context. And the agent, connected to internal SharePoint, obliged.

For six weeks, sensitive internal banking procedures and customer handling guidelines flowed to an external Slack workspace. The channel was archived when the project ended, but the data remained on Slack's servers—outside Fabrikam's control, potentially forever.

IT discovered the integration during a quarterly connector audit. By then, the compliance team had a lot of explaining to do to regulators.

**Your mission**: Identify the governance controls that would have prevented this shadow IT integration.
  `.trim(),

  riskStatement:
    'Sensitive organizational data is exfiltrated through unvetted external services connected via shadow IT integrations, bypassing security assessments and compliance requirements.',

  governanceObjective:
    'Control connector availability, enforce governance policies for external integrations, and prevent unauthorized external sharing of internal data.',

  rubric: {
    scenarioId: 'scenario-5-shadow-connector',
    
    requiredControls: [
      'connector-allowlist',
      'guest-access-policies',
      'change-control',
    ],
    
    recommendedControls: [
      'approval-workflows',
      'audit-logging',
      'usage-analytics',
    ],
    
    antiPatternControls: [
      'mfa-enforcement',
      'encryption-enforcement',
      'prompt-hardening',
    ],
    
    controlRationales: {
      'connector-allowlist':
        'REQUIRED: An allowlist would have blocked the unapproved Slack connector from being used at all.',
      'guest-access-policies':
        'REQUIRED: Guest access governance should require approval and attestation before external users can access internal resources.',
      'change-control':
        'REQUIRED: A change control process would require IT review before deploying agents with new external integrations.',
      'approval-workflows':
        'RECOMMENDED: Requiring approval for new connectors adds a governance checkpoint.',
      'audit-logging':
        'RECOMMENDED: Connector usage logs would have detected the external integration earlier.',
      'usage-analytics':
        'RECOMMENDED: Monitoring adoption patterns can identify unexpected integrations and data flows.',
      'mfa-enforcement':
        'ANTI-PATTERN: MFA ensures user identity but doesn\'t prevent authorized users from using unapproved connectors.',
      'encryption-enforcement':
        'ANTI-PATTERN: Encryption protects data but doesn\'t prevent it from leaving the organization through allowed channels.',
      'prompt-hardening':
        'ANTI-PATTERN: Prompt safety is about agent behavior, not connector governance or external sharing controls.',
    },
    
    gotchas: [
      'Environment-level connector policies don\'t apply retroactively—existing connections may persist until explicitly removed.',
      'Guest access and connector policies are separate governance surfaces; you need both.',
      'The Power Platform connector catalog includes hundreds of connectors; blocking unknown is safer than allowing all.',
      'Data shared to external services may be retained according to their policies, not yours—you lose control.',
    ],
    
    improvedApproach:
      'Implement connector allowlisting at the tenant level, blocking all connectors except those explicitly approved after security review. Require change management tickets for any new external integration. Configure guest access policies to require sponsorship, attestation, and time-limited access. Enable Power Platform audit logging and set alerts for new external connectors. Conduct quarterly reviews of active connectors and guest access.',
  },
};
