import React from 'react';
import { AdminRoleMapping } from '@/lib/grading/types';
import { Badge } from '@/components/ui/Badge';

interface AdminRolesTableProps {
  adminRoles: AdminRoleMapping[];
  disclaimer: string;
}

/**
 * Display required admin roles for implementing controls
 */
export function AdminRolesTable({
  adminRoles,
  disclaimer,
}: AdminRolesTableProps) {
  if (adminRoles.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="text-xl">👑</span>
          <h3 className="font-semibold text-slate-900">
            Required Admin Roles
          </h3>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          These roles are typically required to implement the selected controls.
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Control
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Required Roles
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {adminRoles.map((mapping) => (
              <tr key={mapping.controlId}>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                  {mapping.controlName}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {mapping.requiredRoleNames.map((roleName) => (
                      <Badge key={roleName} variant="neutral" size="sm">
                        {roleName}
                      </Badge>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-slate-200">
        {adminRoles.map((mapping) => (
          <div key={mapping.controlId} className="px-6 py-4">
            <h4 className="font-medium text-slate-900 mb-2">
              {mapping.controlName}
            </h4>
            <div className="flex flex-wrap gap-2">
              {mapping.requiredRoleNames.map((roleName) => (
                <Badge key={roleName} variant="neutral" size="sm">
                  {roleName}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <p className="text-xs text-slate-500 flex items-start gap-2">
          <span className="flex-shrink-0">ℹ️</span>
          <span>{disclaimer}</span>
        </p>
      </div>
    </div>
  );
}
