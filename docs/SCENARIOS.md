# Scenarios

This document provides detailed information about the five governance escape room scenarios.

## Overview

Each scenario presents a realistic governance challenge involving Microsoft 365 Copilot or Copilot Studio. Players must identify the correct governance controls to mitigate the risk.

All scenarios are "standard" difficulty in the MVP.

---

## Scenario 1: The Leaky SharePoint Library

**Topic:** Oversharing & Permissions

### Summary

A Copilot user accidentally accesses confidential HR compensation data because SharePoint library permissions were inherited from a parent site with overly broad access.

### Learning Objectives

- Understand that Copilot respects SharePoint permissions at query time
- Learn the importance of least privilege access
- Recognize dangers of inherited permissions
- Know how to audit and scope SharePoint permissions

### Key Concepts

- SharePoint permission inheritance
- Least privilege principle
- Site collection scoping
- Restricted SharePoint Search

### Required Controls

| Control | Why |
|---------|-----|
| Least Privilege Access | Core principle - users should only access what they need |
| SharePoint Permissions Audit | Would catch oversharing before exploitation |
| Site Collection Scoping | Limits Copilot's search surface |

### Related Microsoft Learn

- [Reduce permissions for Microsoft 365 Copilot](https://learn.microsoft.com/microsoft-365/security/office-365-security/step-by-step-guides/reduce-permissions-microsoft-365-copilot)
- [Sharing & permissions in SharePoint](https://learn.microsoft.com/sharepoint/sharing-permissions-modern-experience)

---

## Scenario 2: Label Lockdown

**Topic:** Sensitivity Labels & Encryption

### Summary

Marketing drafts external-facing content using Copilot, which inadvertently pulls from a confidential product roadmap document that lacked proper sensitivity labeling.

### Learning Objectives

- Understand that manual markings (watermarks) don't provide technical protection
- Learn sensitivity label taxonomy design
- Know how encryption protects labeled content
- Recognize auto-labeling capabilities

### Key Concepts

- Sensitivity labels
- Encryption for labeled content
- Auto-labeling policies
- Label inheritance in containers

### Required Controls

| Control | Why |
|---------|-----|
| Sensitivity Label Application | Foundation of content classification |
| Encryption for Labeled Content | Protects data even if exfiltrated |
| Auto-labeling & Inheritance | Ensures consistent protection |

### Related Microsoft Learn

- [Sensitivity labels overview](https://learn.microsoft.com/purview/sensitivity-labels)
- [Apply labels automatically](https://learn.microsoft.com/purview/apply-sensitivity-label-automatically)
- [Encryption in sensitivity labels](https://learn.microsoft.com/purview/encryption-sensitivity-labels)

---

## Scenario 3: DLP Tripwires

**Topic:** Data Loss Prevention

### Summary

A Copilot Studio agent connected to CRM data inadvertently syncs customer PII to a third-party marketing platform through a Power Automate flow that crosses DLP boundaries.

### Learning Objectives

- Understand Power Platform DLP connector classification
- Learn about business vs. non-business connector boundaries
- Know data residency compliance requirements
- Recognize the need for connector governance

### Key Concepts

- DLP policies
- Connector classification (Business/Non-Business/Blocked)
- Data residency
- Cross-boundary data flows

### Required Controls

| Control | Why |
|---------|-----|
| DLP Policy Alignment | Detect and block sensitive data sharing |
| Connector DLP Policies | Control data flow between connector groups |
| Data Residency Controls | Ensure geographic compliance |

### Related Microsoft Learn

- [Learn about DLP](https://learn.microsoft.com/purview/dlp-learn-about-dlp)
- [Power Platform DLP policies](https://learn.microsoft.com/power-platform/admin/wp-data-loss-prevention)
- [Data residency overview](https://learn.microsoft.com/microsoft-365/enterprise/m365-dr-overview)

---

## Scenario 4: Prompt Injection at the Factory Gate

**Topic:** Agent Safety & Tool Abuse

### Summary

A customer support Copilot agent with order cancellation capabilities is tricked into canceling legitimate orders through a prompt injection attack embedded in user input.

### Learning Objectives

- Understand prompt injection attack vectors
- Learn defensive system prompt writing
- Know the importance of tool scoping
- Recognize input validation requirements

### Key Concepts

- Prompt injection attacks
- System prompt hardening
- Tool/action scoping
- Input validation and sanitization
- Defense in depth

### Required Controls

| Control | Why |
|---------|-----|
| Prompt Hardening | Write defensive system instructions |
| Tool & Action Scoping | Limit actions to user's own resources |
| Input Validation & Sanitization | Detect and reject injection patterns |

### Related Microsoft Learn

- [Copilot Studio security best practices](https://learn.microsoft.com/microsoft-copilot-studio/guidance/security-best-practices)
- [Responsible AI FAQ](https://learn.microsoft.com/microsoft-copilot-studio/guidance/responsible-ai-faq)
- [Manage copilots](https://learn.microsoft.com/microsoft-copilot-studio/manage-copilots)

---

## Scenario 5: Shadow Connector & External Sharing

**Topic:** Connector Governance

### Summary

An employee connects a Copilot Studio agent to an unapproved external Slack workspace, allowing sensitive internal Q&A to be accessed by contractors who haven't passed security vetting.

### Learning Objectives

- Understand shadow IT risks
- Learn connector allowlisting
- Know guest access governance requirements
- Recognize change control importance

### Key Concepts

- Connector governance
- Shadow IT prevention
- Guest/external access policies
- Change management

### Required Controls

| Control | Why |
|---------|-----|
| Connector Allowlisting | Block unapproved connectors |
| Guest Access Governance | Control external user access |
| Change Control Process | Review before deploying integrations |

### Related Microsoft Learn

- [Connector certification](https://learn.microsoft.com/power-platform/admin/connector-certification-submit)
- [Collaborate with external users](https://learn.microsoft.com/microsoft-365/solutions/collaborate-with-people-outside-your-organization)
- [Power Platform ALM](https://learn.microsoft.com/power-platform/alm/overview-alm)

---

## Scenario Design Principles

### Realistic but Fictional

Each scenario is based on real governance challenges but uses fictional companies and characters.

### Single Incident Focus

Each scenario focuses on one primary governance failure to maintain learning clarity.

### Actionable Controls

The required/recommended controls are specific and actionable in real M365/Power Platform environments.

### Non-Punitive Learning

Anti-patterns are explained as learning opportunities, not criticisms.

---

## Adding New Scenarios

To add a new scenario:

1. Create `src/lib/scenarios/scenario-N-name.ts`
2. Define the `ScenarioWithRubric` object
3. Export from `src/lib/scenarios/index.ts`
4. Add corresponding hints in `src/lib/hints/local-hints.json`
5. Update test counts in `tests/unit/scenario-selector.test.ts`
