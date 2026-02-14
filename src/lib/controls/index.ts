import { controls, controlsById } from './control-library';
import { Control, ControlCategory, ControlsByCategory } from './types';

export * from './types';
export { controls, controlsById } from './control-library';

/**
 * Get a control by its ID
 */
export function getControlById(id: string): Control | undefined {
  return controlsById.get(id);
}

/**
 * Get all controls in a specific category
 */
export function getControlsByCategory(category: ControlCategory): Control[] {
  return controls.filter((control) => control.category === category);
}

/**
 * Get all controls grouped by category
 */
export function groupControlsByCategory(): ControlsByCategory {
  const grouped: ControlsByCategory = {
    [ControlCategory.DATA_ACCESS]: [],
    [ControlCategory.INFORMATION_PROTECTION]: [],
    [ControlCategory.DLP_COMPLIANCE]: [],
    [ControlCategory.IDENTITY_ACCESS]: [],
    [ControlCategory.AGENT_SAFETY]: [],
    [ControlCategory.MONITORING_LIFECYCLE]: [],
  };

  controls.forEach((control) => {
    grouped[control.category].push(control);
  });

  return grouped;
}

/**
 * Get multiple controls by their IDs
 */
export function getControlsByIds(ids: string[]): Control[] {
  return ids
    .map((id) => controlsById.get(id))
    .filter((control): control is Control => control !== undefined);
}

/**
 * Get all control IDs
 */
export function getAllControlIds(): string[] {
  return controls.map((control) => control.id);
}

/**
 * Category order for display
 */
export const categoryDisplayOrder: ControlCategory[] = [
  ControlCategory.DATA_ACCESS,
  ControlCategory.INFORMATION_PROTECTION,
  ControlCategory.DLP_COMPLIANCE,
  ControlCategory.IDENTITY_ACCESS,
  ControlCategory.AGENT_SAFETY,
  ControlCategory.MONITORING_LIFECYCLE,
];
