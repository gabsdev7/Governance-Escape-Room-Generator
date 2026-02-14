# Governance Control Library

This document describes the curated library of governance controls and principles used in the Governance Escape Room.

## Overview

The control library contains 25+ controls across 6 categories. Each control represents a governance capability, principle, or best practice for Microsoft 365 Copilot and Copilot Studio governance.

---

## Categories

### 🔒 Data Access & Permissions

Controls focused on who can access what data.

| ID | Name | Description | Admin Roles |
|----|------|-------------|-------------|
| `least-privilege-access` | Least Privilege Access | Ensure users and services have only the minimum permissions necessary | SharePoint Admin, Site Collection Admin |
| `sharepoint-permissions-audit` | SharePoint Permissions Audit | Regularly audit SharePoint site and library permissions to identify oversharing | SharePoint Admin, Site Collection Admin |
| `site-collection-scoping` | Site Collection Scoping | Scope Copilot knowledge sources to specific site collections | SharePoint Admin |
| `restricted-sharepoint-search` | Restricted SharePoint Search | Configure Restricted SharePoint Search to limit Copilot access | SharePoint Admin, Global Admin |

### 🏷️ Information Protection

Controls for classifying and protecting content.

| ID | Name | Description | Admin Roles |
|----|------|-------------|-------------|
| `sensitivity-labels` | Sensitivity Label Application | Apply sensitivity labels to classify and protect content | Compliance Admin, Information Protection Admin |
| `label-inheritance` | Auto-labeling & Inheritance | Configure automatic labeling policies based on content inspection | Compliance Admin, Information Protection Admin |
| `encryption-enforcement` | Encryption for Labeled Content | Enforce encryption on sensitivity-labeled content | Compliance Admin, Information Protection Admin |
| `content-marking` | Visual Content Marking | Apply headers, footers, and watermarks to labeled documents | Compliance Admin |

### 🛡️ DLP & Compliance

Controls for data loss prevention and regulatory compliance.

| ID | Name | Description | Admin Roles |
|----|------|-------------|-------------|
| `dlp-policy-alignment` | DLP Policy Alignment | Ensure DLP policies detect and block sensitive information sharing | Compliance Admin |
| `connector-dlp-policies` | Connector DLP Policies | Configure Power Platform DLP policies to classify connectors | Power Platform Admin |
| `data-residency-controls` | Data Residency Controls | Configure data residency settings for geographic compliance | Global Admin, Compliance Admin |
| `retention-policies` | Retention Policy Configuration | Configure retention policies for content lifecycle | Compliance Admin |

### 👤 Identity & Access

Controls for user identity and access management.

| ID | Name | Description | Admin Roles |
|----|------|-------------|-------------|
| `conditional-access` | Conditional Access Policies | Implement access controls based on user, device, location, and risk | Conditional Access Admin, Security Admin |
| `mfa-enforcement` | MFA Enforcement | Require multi-factor authentication for all users | Security Admin, Conditional Access Admin |
| `privileged-identity-mgmt` | Privileged Identity Management | Use PIM for just-in-time privileged access | Global Admin, Security Admin |
| `guest-access-policies` | Guest Access Governance | Control external/guest access through policies | Global Admin, Teams Admin |

### 🤖 Agent Safety Principles

Controls for securing AI agents and preventing misuse.

| ID | Name | Description | Admin Roles |
|----|------|-------------|-------------|
| `tool-scoping` | Tool & Action Scoping | Limit the tools and actions available to Copilot agents | Copilot Studio Maker |
| `prompt-hardening` | Prompt Hardening | Write defensive system instructions that resist manipulation | Copilot Studio Maker |
| `connector-allowlist` | Connector Allowlisting | Maintain an allowlist of approved connectors | Power Platform Admin |
| `input-validation` | Input Validation & Sanitization | Validate and sanitize user inputs before processing | Copilot Studio Maker |
| `output-filtering` | Output Filtering & Grounding | Configure output filters to prevent sensitive disclosure | Copilot Studio Maker |

### 📊 Monitoring & Lifecycle

Controls for observability and change management.

| ID | Name | Description | Admin Roles |
|----|------|-------------|-------------|
| `audit-logging` | Audit Logging & Monitoring | Enable and review audit logs for Copilot activities | Compliance Admin, Security Admin |
| `change-control` | Change Control Process | Implement change management for Copilot configurations | Global Admin, Power Platform Admin |
| `approval-workflows` | Approval Workflows for Agents | Require approval workflows for publishing/modifying agents | Power Platform Admin |
| `usage-analytics` | Usage Analytics & Reporting | Monitor Copilot usage patterns through analytics dashboards | Global Admin, Power Platform Admin |

---

## Admin Roles Reference

| Role | Description |
|------|-------------|
| Global Administrator | Full access to all admin features (use sparingly) |
| SharePoint Administrator | Manages SharePoint sites, permissions, and settings |
| Site Collection Administrator | Manages specific site collection permissions |
| Compliance Administrator | Manages compliance features in Microsoft Purview |
| Information Protection Administrator | Manages sensitivity labels and policies |
| Security Administrator | Manages security features and policies |
| Teams Administrator | Manages Teams settings and policies |
| Power Platform Administrator | Manages Power Platform environments and policies |
| Exchange Administrator | Manages Exchange Online settings |
| Conditional Access Administrator | Manages Conditional Access policies |
| Copilot Studio Maker/Admin | Creates and manages Copilot Studio agents |

> **Note**: Verify specific role requirements in your tenant as custom roles or Privileged Identity Management may change role assignments.

---

## Control Usage in Scenarios

### Scenario 1: The Leaky SharePoint Library

- **Required**: `least-privilege-access`, `sharepoint-permissions-audit`, `site-collection-scoping`
- **Recommended**: `restricted-sharepoint-search`, `audit-logging`
- **Anti-patterns**: `mfa-enforcement`, `connector-allowlist`, `prompt-hardening`

### Scenario 2: Label Lockdown

- **Required**: `sensitivity-labels`, `encryption-enforcement`, `label-inheritance`
- **Recommended**: `content-marking`, `dlp-policy-alignment`
- **Anti-patterns**: `tool-scoping`, `prompt-hardening`, `connector-allowlist`

### Scenario 3: DLP Tripwires

- **Required**: `dlp-policy-alignment`, `connector-dlp-policies`, `data-residency-controls`
- **Recommended**: `audit-logging`, `approval-workflows`
- **Anti-patterns**: `sensitivity-labels`, `guest-access-policies`, `mfa-enforcement`

### Scenario 4: Prompt Injection at the Factory Gate

- **Required**: `prompt-hardening`, `tool-scoping`, `input-validation`
- **Recommended**: `output-filtering`, `approval-workflows`, `audit-logging`
- **Anti-patterns**: `sensitivity-labels`, `least-privilege-access`, `encryption-enforcement`

### Scenario 5: Shadow Connector & External Sharing

- **Required**: `connector-allowlist`, `guest-access-policies`, `change-control`
- **Recommended**: `approval-workflows`, `audit-logging`, `usage-analytics`
- **Anti-patterns**: `mfa-enforcement`, `encryption-enforcement`, `prompt-hardening`

---

## Adding New Controls

To add a new control:

1. Add the control object to `src/lib/controls/control-library.ts`
2. Ensure all required fields are populated:
   - `id`: Unique kebab-case identifier
   - `name`: Display name
   - `description`: Detailed description
   - `category`: One of the ControlCategory enum values
   - `adminRoles`: Array of required admin roles
   - `icon`: Emoji icon
   - `microsoftLearnUrl`: Optional link to documentation
3. Run tests to verify no duplicate IDs: `npm test -- control-library.test.ts`

### Example

```typescript
{
  id: 'new-control-id',
  name: 'New Control Name',
  description: 'Detailed description of what this control does...',
  category: ControlCategory.DATA_ACCESS,
  adminRoles: [AdminRole.SHAREPOINT_ADMIN],
  microsoftLearnUrl: 'https://learn.microsoft.com/...',
  icon: '🔑',
}
```
