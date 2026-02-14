/**
 * Control Library Types
 * 
 * Defines the structure for governance controls and principles
 * used throughout the Governance Escape Room application.
 */

/**
 * Categories of governance controls
 */
export enum ControlCategory {
  DATA_ACCESS = 'DATA_ACCESS',
  INFORMATION_PROTECTION = 'INFORMATION_PROTECTION',
  DLP_COMPLIANCE = 'DLP_COMPLIANCE',
  IDENTITY_ACCESS = 'IDENTITY_ACCESS',
  AGENT_SAFETY = 'AGENT_SAFETY',
  MONITORING_LIFECYCLE = 'MONITORING_LIFECYCLE',
}

/**
 * Display names for control categories
 */
export const ControlCategoryLabels: Record<ControlCategory, string> = {
  [ControlCategory.DATA_ACCESS]: 'Data Access & Permissions',
  [ControlCategory.INFORMATION_PROTECTION]: 'Information Protection',
  [ControlCategory.DLP_COMPLIANCE]: 'DLP & Compliance',
  [ControlCategory.IDENTITY_ACCESS]: 'Identity & Access',
  [ControlCategory.AGENT_SAFETY]: 'Agent Safety Principles',
  [ControlCategory.MONITORING_LIFECYCLE]: 'Monitoring & Lifecycle',
};

/**
 * Admin roles required for implementing controls
 */
export enum AdminRole {
  GLOBAL_ADMIN = 'GLOBAL_ADMIN',
  SHAREPOINT_ADMIN = 'SHAREPOINT_ADMIN',
  SITE_COLLECTION_ADMIN = 'SITE_COLLECTION_ADMIN',
  COMPLIANCE_ADMIN = 'COMPLIANCE_ADMIN',
  INFORMATION_PROTECTION_ADMIN = 'INFORMATION_PROTECTION_ADMIN',
  SECURITY_ADMIN = 'SECURITY_ADMIN',
  TEAMS_ADMIN = 'TEAMS_ADMIN',
  POWER_PLATFORM_ADMIN = 'POWER_PLATFORM_ADMIN',
  EXCHANGE_ADMIN = 'EXCHANGE_ADMIN',
  CONDITIONAL_ACCESS_ADMIN = 'CONDITIONAL_ACCESS_ADMIN',
  COPILOT_STUDIO_MAKER = 'COPILOT_STUDIO_MAKER',
}

/**
 * Display names for admin roles
 */
export const AdminRoleLabels: Record<AdminRole, string> = {
  [AdminRole.GLOBAL_ADMIN]: 'Global Administrator',
  [AdminRole.SHAREPOINT_ADMIN]: 'SharePoint Administrator',
  [AdminRole.SITE_COLLECTION_ADMIN]: 'Site Collection Administrator',
  [AdminRole.COMPLIANCE_ADMIN]: 'Compliance Administrator',
  [AdminRole.INFORMATION_PROTECTION_ADMIN]: 'Information Protection Administrator',
  [AdminRole.SECURITY_ADMIN]: 'Security Administrator',
  [AdminRole.TEAMS_ADMIN]: 'Teams Administrator',
  [AdminRole.POWER_PLATFORM_ADMIN]: 'Power Platform Administrator',
  [AdminRole.EXCHANGE_ADMIN]: 'Exchange Administrator',
  [AdminRole.CONDITIONAL_ACCESS_ADMIN]: 'Conditional Access Administrator',
  [AdminRole.COPILOT_STUDIO_MAKER]: 'Copilot Studio Maker/Admin',
};

/**
 * A governance control or principle
 */
export interface Control {
  /** Unique identifier for the control */
  id: string;
  /** Display name */
  name: string;
  /** Detailed description of the control */
  description: string;
  /** Category this control belongs to */
  category: ControlCategory;
  /** Admin roles typically required to implement this control */
  adminRoles: AdminRole[];
  /** Optional Microsoft Learn URL for more information */
  microsoftLearnUrl?: string;
  /** Icon for display (emoji) */
  icon: string;
}

/**
 * Controls grouped by category
 */
export type ControlsByCategory = Record<ControlCategory, Control[]>;
