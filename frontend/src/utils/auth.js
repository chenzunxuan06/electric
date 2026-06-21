export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

export function getCurrentRole() {
  return getCurrentUser()?.role || 'visitor';
}

export function getCurrentPermissions() {
  try {
    return JSON.parse(localStorage.getItem('permissions') || '[]');
  } catch {
    return [];
  }
}

export function hasRole(roles) {
  const role = getCurrentRole();
  return roles.includes(role);
}

export function hasPermission(permission) {
  return getCurrentPermissions().includes(permission);
}

export function hasAnyPermission(permissions) {
  const current = new Set(getCurrentPermissions());
  return permissions.some((p) => current.has(p));
}

export function hasAllPermissions(permissions) {
  const current = new Set(getCurrentPermissions());
  return permissions.every((p) => current.has(p));
}

export function getRolePermissions(role) {
  const map = {
    admin: ['home:view', 'dashboard:view', 'user:view', 'user:create', 'user:update', 'user:delete', 'role:view', 'role:create', 'role:update', 'role:delete', 'asset:view', 'asset:create', 'asset:update', 'asset:delete', 'audit:view', 'approval:view', 'approval:approve', 'privacy:view', 'privacy:create', 'privacy:complete', 'report:view', 'chain:view', 'system:view'],
    manager: ['home:view', 'dashboard:view', 'asset:view', 'approval:view', 'approval:approve', 'privacy:view', 'chain:view', 'audit:view', 'report:view'],
    analyst: ['home:view', 'dashboard:view', 'asset:view', 'privacy:view', 'privacy:create', 'privacy:complete', 'chain:view', 'audit:view', 'report:view'],
    user: ['home:view', 'asset:view', 'privacy:view', 'chain:view', 'report:view', 'request:create'],
    visitor: []
  };
  return map[role] || [];
}

export function getRolePermissionMap(roleDefs = []) {
  const map = {};
  for (const role of roleDefs) {
    const key = role.key || (role.name || '').toLowerCase();
    map[key] = Array.isArray(role.permissions) && role.permissions.length ? role.permissions : getRolePermissions(key);
  }
  return map;
}
