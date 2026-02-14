/**
 * Control Library Tests
 */

import {
  controls,
  getControlById,
  getControlsByCategory,
  groupControlsByCategory,
  getAllControlIds,
  ControlCategory,
} from '@/lib/controls';

describe('Control Library', () => {
  describe('controls array', () => {
    it('should have at least 20 controls', () => {
      expect(controls.length).toBeGreaterThanOrEqual(20);
    });

    it('should have no duplicate IDs', () => {
      const ids = controls.map((c) => c.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all required fields for each control', () => {
      controls.forEach((control) => {
        expect(control.id).toBeTruthy();
        expect(control.name).toBeTruthy();
        expect(control.description).toBeTruthy();
        expect(control.category).toBeTruthy();
        expect(Object.values(ControlCategory)).toContain(control.category);
        expect(control.adminRoles).toBeDefined();
        expect(Array.isArray(control.adminRoles)).toBe(true);
        expect(control.icon).toBeTruthy();
      });
    });

    it('should have valid Microsoft Learn URLs where provided', () => {
      controls.forEach((control) => {
        if (control.microsoftLearnUrl) {
          expect(control.microsoftLearnUrl).toMatch(/^https:\/\/learn\.microsoft\.com/);
        }
      });
    });
  });

  describe('getControlById', () => {
    it('should return control for valid ID', () => {
      const control = getControlById('least-privilege-access');
      
      expect(control).toBeDefined();
      expect(control?.name).toBe('Least Privilege Access');
    });

    it('should return undefined for invalid ID', () => {
      const control = getControlById('invalid-id');
      expect(control).toBeUndefined();
    });
  });

  describe('getControlsByCategory', () => {
    it('should return controls for each category', () => {
      Object.values(ControlCategory).forEach((category) => {
        const categoryControls = getControlsByCategory(category);
        
        expect(categoryControls.length).toBeGreaterThan(0);
        categoryControls.forEach((control) => {
          expect(control.category).toBe(category);
        });
      });
    });
  });

  describe('groupControlsByCategory', () => {
    it('should return all categories', () => {
      const grouped = groupControlsByCategory();
      
      Object.values(ControlCategory).forEach((category) => {
        expect(grouped[category]).toBeDefined();
        expect(Array.isArray(grouped[category])).toBe(true);
      });
    });

    it('should have all controls grouped', () => {
      const grouped = groupControlsByCategory();
      
      let totalGrouped = 0;
      Object.values(grouped).forEach((categoryControls) => {
        totalGrouped += categoryControls.length;
      });

      expect(totalGrouped).toBe(controls.length);
    });
  });

  describe('getAllControlIds', () => {
    it('should return all control IDs', () => {
      const ids = getAllControlIds();
      
      expect(ids.length).toBe(controls.length);
      controls.forEach((control) => {
        expect(ids).toContain(control.id);
      });
    });
  });

  describe('category coverage', () => {
    it('should have at least one control in each category', () => {
      const grouped = groupControlsByCategory();

      Object.values(ControlCategory).forEach((category) => {
        expect(grouped[category].length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should have DATA_ACCESS category with SharePoint-related controls', () => {
      const dataAccessControls = getControlsByCategory(ControlCategory.DATA_ACCESS);
      const hasSharePointControl = dataAccessControls.some(
        (c) => c.id.includes('sharepoint') || c.description.toLowerCase().includes('sharepoint')
      );
      
      expect(hasSharePointControl).toBe(true);
    });

    it('should have AGENT_SAFETY category with prompt-related controls', () => {
      const agentSafetyControls = getControlsByCategory(ControlCategory.AGENT_SAFETY);
      const hasPromptControl = agentSafetyControls.some(
        (c) => c.id.includes('prompt') || c.description.toLowerCase().includes('prompt')
      );
      
      expect(hasPromptControl).toBe(true);
    });
  });
});
