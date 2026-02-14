import { Control, ControlCategory, AdminRole } from './types';

/**
 * The complete governance control library
 * 
 * This curated list of controls and principles covers the key governance
 * domains for Microsoft 365 Copilot and Copilot Studio.
 */
export const controls: Control[] = [
  // ============================================
  // DATA ACCESS & PERMISSIONS
  // ============================================
  {
    id: 'least-privilege-access',
    name: 'Least Privilege Access',
    description:
      'Ensure users and services have only the minimum permissions necessary to perform their functions. Review and right-size access regularly.',
    category: ControlCategory.DATA_ACCESS,
    adminRoles: [AdminRole.SHAREPOINT_ADMIN, AdminRole.SITE_COLLECTION_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-365/security/office-365-security/step-by-step-guides/reduce-permissions-microsoft-365-copilot',
    icon: '🔒',
  },
  {
    id: 'sharepoint-permissions-audit',
    name: 'SharePoint Permissions Audit',
    description:
      'Regularly audit SharePoint site and library permissions to identify oversharing. Use access reviews and permission reports.',
    category: ControlCategory.DATA_ACCESS,
    adminRoles: [AdminRole.SHAREPOINT_ADMIN, AdminRole.SITE_COLLECTION_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/sharepoint/sharing-permissions-modern-experience',
    icon: '🔍',
  },
  {
    id: 'site-collection-scoping',
    name: 'Site Collection Scoping',
    description:
      'Scope Copilot knowledge sources to specific site collections rather than the entire tenant. Limit the search surface area.',
    category: ControlCategory.DATA_ACCESS,
    adminRoles: [AdminRole.SHAREPOINT_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-365-copilot/microsoft-365-copilot-setup',
    icon: '📁',
  },
  {
    id: 'restricted-sharepoint-search',
    name: 'Restricted SharePoint Search',
    description:
      'Configure Restricted SharePoint Search to limit which sites Copilot can access and surface in responses.',
    category: ControlCategory.DATA_ACCESS,
    adminRoles: [AdminRole.SHAREPOINT_ADMIN, AdminRole.GLOBAL_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/sharepoint/restricted-sharepoint-search',
    icon: '🚫',
  },

  // ============================================
  // INFORMATION PROTECTION
  // ============================================
  {
    id: 'sensitivity-labels',
    name: 'Sensitivity Label Application',
    description:
      'Apply sensitivity labels to classify and protect content. Labels control encryption, access, and visual markings.',
    category: ControlCategory.INFORMATION_PROTECTION,
    adminRoles: [AdminRole.COMPLIANCE_ADMIN, AdminRole.INFORMATION_PROTECTION_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/purview/sensitivity-labels',
    icon: '🏷️',
  },
  {
    id: 'label-inheritance',
    name: 'Auto-labeling & Inheritance',
    description:
      'Configure automatic labeling policies based on content inspection. Ensure labels inherit appropriately in containers.',
    category: ControlCategory.INFORMATION_PROTECTION,
    adminRoles: [AdminRole.COMPLIANCE_ADMIN, AdminRole.INFORMATION_PROTECTION_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/purview/apply-sensitivity-label-automatically',
    icon: '🔄',
  },
  {
    id: 'encryption-enforcement',
    name: 'Encryption for Labeled Content',
    description:
      'Enforce encryption on sensitivity-labeled content to prevent unauthorized access even if content is exfiltrated.',
    category: ControlCategory.INFORMATION_PROTECTION,
    adminRoles: [AdminRole.COMPLIANCE_ADMIN, AdminRole.INFORMATION_PROTECTION_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/purview/encryption-sensitivity-labels',
    icon: '🔐',
  },
  {
    id: 'content-marking',
    name: 'Visual Content Marking',
    description:
      'Apply headers, footers, and watermarks to labeled documents to visually indicate classification level.',
    category: ControlCategory.INFORMATION_PROTECTION,
    adminRoles: [AdminRole.COMPLIANCE_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/purview/sensitivity-labels-office-apps#content-marking',
    icon: '📋',
  },

  // ============================================
  // DLP & COMPLIANCE
  // ============================================
  {
    id: 'dlp-policy-alignment',
    name: 'DLP Policy Alignment',
    description:
      'Ensure DLP policies are configured to detect and block sensitive information from being shared inappropriately.',
    category: ControlCategory.DLP_COMPLIANCE,
    adminRoles: [AdminRole.COMPLIANCE_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/purview/dlp-learn-about-dlp',
    icon: '🛡️',
  },
  {
    id: 'connector-dlp-policies',
    name: 'Connector DLP Policies',
    description:
      'Configure Power Platform DLP policies to classify connectors as Business, Non-Business, or Blocked to control data flow.',
    category: ControlCategory.DLP_COMPLIANCE,
    adminRoles: [AdminRole.POWER_PLATFORM_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/power-platform/admin/wp-data-loss-prevention',
    icon: '🔌',
  },
  {
    id: 'data-residency-controls',
    name: 'Data Residency Controls',
    description:
      'Configure data residency settings to ensure data stays within required geographic boundaries for compliance.',
    category: ControlCategory.DLP_COMPLIANCE,
    adminRoles: [AdminRole.GLOBAL_ADMIN, AdminRole.COMPLIANCE_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-365/enterprise/m365-dr-overview',
    icon: '🌍',
  },
  {
    id: 'retention-policies',
    name: 'Retention Policy Configuration',
    description:
      'Configure retention policies to ensure content is kept or deleted according to compliance requirements.',
    category: ControlCategory.DLP_COMPLIANCE,
    adminRoles: [AdminRole.COMPLIANCE_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/purview/retention-policies-sharepoint',
    icon: '📅',
  },

  // ============================================
  // IDENTITY & ACCESS
  // ============================================
  {
    id: 'conditional-access',
    name: 'Conditional Access Policies',
    description:
      'Implement Conditional Access policies to control access based on user, device, location, and risk signals.',
    category: ControlCategory.IDENTITY_ACCESS,
    adminRoles: [AdminRole.CONDITIONAL_ACCESS_ADMIN, AdminRole.SECURITY_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/entra/identity/conditional-access/overview',
    icon: '🚦',
  },
  {
    id: 'mfa-enforcement',
    name: 'MFA Enforcement',
    description:
      'Require multi-factor authentication for all users to strengthen identity verification and prevent account compromise.',
    category: ControlCategory.IDENTITY_ACCESS,
    adminRoles: [AdminRole.SECURITY_ADMIN, AdminRole.CONDITIONAL_ACCESS_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/entra/identity/authentication/concept-mfa-howitworks',
    icon: '📱',
  },
  {
    id: 'privileged-identity-mgmt',
    name: 'Privileged Identity Management',
    description:
      'Use PIM for just-in-time privileged access. Require approval and time-bound elevation for admin roles.',
    category: ControlCategory.IDENTITY_ACCESS,
    adminRoles: [AdminRole.GLOBAL_ADMIN, AdminRole.SECURITY_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-configure',
    icon: '👑',
  },
  {
    id: 'guest-access-policies',
    name: 'Guest Access Governance',
    description:
      'Control external/guest access through policies. Limit what guests can access and require approval for guest invitations.',
    category: ControlCategory.IDENTITY_ACCESS,
    adminRoles: [AdminRole.GLOBAL_ADMIN, AdminRole.TEAMS_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-365/solutions/collaborate-with-people-outside-your-organization',
    icon: '👤',
  },

  // ============================================
  // AGENT SAFETY PRINCIPLES
  // ============================================
  {
    id: 'tool-scoping',
    name: 'Tool & Action Scoping',
    description:
      'Limit the tools and actions available to Copilot agents. Only enable capabilities required for the specific use case.',
    category: ControlCategory.AGENT_SAFETY,
    adminRoles: [AdminRole.COPILOT_STUDIO_MAKER],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-copilot-studio/manage-copilots',
    icon: '🔧',
  },
  {
    id: 'prompt-hardening',
    name: 'Prompt Hardening',
    description:
      'Write defensive system instructions that resist manipulation. Include guardrails against prompt injection attempts.',
    category: ControlCategory.AGENT_SAFETY,
    adminRoles: [AdminRole.COPILOT_STUDIO_MAKER],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-copilot-studio/guidance/responsible-ai-faq',
    icon: '🛡️',
  },
  {
    id: 'connector-allowlist',
    name: 'Connector Allowlisting',
    description:
      'Maintain an allowlist of approved connectors. Block or require approval for new connector usage.',
    category: ControlCategory.AGENT_SAFETY,
    adminRoles: [AdminRole.POWER_PLATFORM_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/power-platform/admin/connector-certification-submit',
    icon: '✅',
  },
  {
    id: 'input-validation',
    name: 'Input Validation & Sanitization',
    description:
      'Validate and sanitize user inputs before processing. Reject or transform malicious input patterns.',
    category: ControlCategory.AGENT_SAFETY,
    adminRoles: [AdminRole.COPILOT_STUDIO_MAKER],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-copilot-studio/guidance/security-best-practices',
    icon: '🧹',
  },
  {
    id: 'output-filtering',
    name: 'Output Filtering & Grounding',
    description:
      'Configure output filters to prevent disclosure of sensitive information. Ground responses in authorized data sources.',
    category: ControlCategory.AGENT_SAFETY,
    adminRoles: [AdminRole.COPILOT_STUDIO_MAKER],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-copilot-studio/guidance/moderation',
    icon: '🎯',
  },

  // ============================================
  // MONITORING & LIFECYCLE
  // ============================================
  {
    id: 'audit-logging',
    name: 'Audit Logging & Monitoring',
    description:
      'Enable and review audit logs for Copilot activities. Monitor for anomalies and policy violations.',
    category: ControlCategory.MONITORING_LIFECYCLE,
    adminRoles: [AdminRole.COMPLIANCE_ADMIN, AdminRole.SECURITY_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/purview/audit-solutions-overview',
    icon: '📊',
  },
  {
    id: 'change-control',
    name: 'Change Control Process',
    description:
      'Implement change management for Copilot configurations. Require review and approval before deploying changes.',
    category: ControlCategory.MONITORING_LIFECYCLE,
    adminRoles: [AdminRole.GLOBAL_ADMIN, AdminRole.POWER_PLATFORM_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/power-platform/alm/overview-alm',
    icon: '🔄',
  },
  {
    id: 'approval-workflows',
    name: 'Approval Workflows for Agents',
    description:
      'Require approval workflows for publishing or modifying Copilot agents. Include security review in the process.',
    category: ControlCategory.MONITORING_LIFECYCLE,
    adminRoles: [AdminRole.POWER_PLATFORM_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-copilot-studio/manage-copilots',
    icon: '✔️',
  },
  {
    id: 'usage-analytics',
    name: 'Usage Analytics & Reporting',
    description:
      'Monitor Copilot usage patterns through analytics dashboards. Identify adoption trends and potential misuse.',
    category: ControlCategory.MONITORING_LIFECYCLE,
    adminRoles: [AdminRole.GLOBAL_ADMIN, AdminRole.POWER_PLATFORM_ADMIN],
    microsoftLearnUrl:
      'https://learn.microsoft.com/microsoft-365/admin/activity-reports/microsoft-365-copilot-usage',
    icon: '📈',
  },
];

/**
 * Map of controls by ID for quick lookup
 */
export const controlsById: Map<string, Control> = new Map(
  controls.map((control) => [control.id, control])
);
