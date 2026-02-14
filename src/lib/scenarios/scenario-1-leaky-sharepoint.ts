import { ScenarioWithRubric } from './types';

/**
 * Scenario 1: The Leaky SharePoint Library
 * Topic: Oversharing / Wrong permissions for knowledge sources
 */
export const scenario1LeakySharepoint: ScenarioWithRubric = {
  id: 'scenario-1-leaky-sharepoint',
  title: 'The Leaky SharePoint Library',
  icon: '📁',
  topic: 'Oversharing & Permissions',
  difficulty: 'standard',

  story: `
## The Leaky SharePoint Library

It was supposed to be a quiet Tuesday at Contoso Financial Services. Sarah, a senior analyst, was using the company's new M365 Copilot to help prepare quarterly reports. "Summarize the key metrics from our department documents," she typed.

What happened next sent shockwaves through the organization.

Copilot's response included salary bands for the entire executive team, bonus structures, and confidential HR performance reviews. Information Sarah should never have seen. Information that was now in her chat history.

The IT investigation revealed the root cause: when the HR team created a SharePoint library for "HR Operations," they inherited permissions from the parent site—a site accessible to all employees. The library contained sensitive compensation files that had been there for months.

Copilot did exactly what it was designed to do: surface relevant content the user could access. The problem wasn't Copilot—it was that **everyone could access content they shouldn't**.

**Your mission**: Identify the governance controls that would have prevented this exposure.
  `.trim(),

  riskStatement:
    'Copilot surfaces confidential HR compensation data to unauthorized employees through overly permissive SharePoint library access, violating privacy and potentially creating legal liability.',

  governanceObjective:
    'Ensure Copilot knowledge sources follow least-privilege access principles and are scoped to intended audiences, preventing unauthorized data exposure.',

  rubric: {
    scenarioId: 'scenario-1-leaky-sharepoint',
    
    requiredControls: [
      'least-privilege-access',
      'sharepoint-permissions-audit',
      'site-collection-scoping',
    ],
    
    recommendedControls: [
      'restricted-sharepoint-search',
      'audit-logging',
    ],
    
    antiPatternControls: [
      'mfa-enforcement',
      'connector-allowlist',
      'prompt-hardening',
    ],
    
    controlRationales: {
      'least-privilege-access':
        'REQUIRED: The core issue is overly broad permissions. Implementing least privilege ensures users only access what they need for their job function.',
      'sharepoint-permissions-audit':
        'REQUIRED: Regular permission audits would have caught the inherited permissions issue before it became a problem.',
      'site-collection-scoping':
        'REQUIRED: Scoping Copilot to specific site collections limits what content can be surfaced, reducing exposure risk.',
      'restricted-sharepoint-search':
        'RECOMMENDED: Restricting SharePoint search further limits which sites Copilot can index and surface.',
      'audit-logging':
        'RECOMMENDED: Audit logs would help detect and investigate unauthorized access patterns.',
      'mfa-enforcement':
        'ANTI-PATTERN: MFA protects against account compromise, not oversharing. Users were legitimately authenticated.',
      'connector-allowlist':
        'ANTI-PATTERN: Connector governance applies to Power Platform, not SharePoint permissions.',
      'prompt-hardening':
        'ANTI-PATTERN: This is about agent safety, not data access permissions. Copilot correctly surfaced accessible content.',
    },
    
    gotchas: [
      'Inherited permissions from parent sites cascade down silently—always check the full permission chain.',
      'Copilot respects SharePoint permissions at query time, not indexing time. Content already indexed will be surfaced if permissions allow.',
      'Breaking permission inheritance doesn\'t remove existing access—you must explicitly revoke.',
      '"Everyone except external users" is deceptively broad and often grants access to the entire organization.',
    ],
    
    improvedApproach:
      'Start by breaking inheritance on sensitive libraries and applying explicit permissions. Use Microsoft 365 Groups or SharePoint groups with defined membership. Enable Restricted SharePoint Search to control the Copilot search scope. Schedule quarterly SharePoint permissions reviews using the SharePoint Admin Center Access control reports.',
  },
};
