import { ROLES } from './constants.js';

export function canAccessRoute(role, route) {
  if (!role) return false;

  const routePermissions = {
    '/': 'public',
    '/login': 'public',
    '/cashier': [ROLES.CASHIER, ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
    '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    '/driver': [ROLES.DRIVER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  };

  const required = routePermissions[route];
  if (!required) return true;
  if (required === 'public') return true;
  return required.includes(role);
}

export function isAdmin(role) {
  return [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function canManageOrders(role) {
  return [ROLES.CASHIER, ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function canViewBranchOrders(role) {
  return [ROLES.CASHIER, ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function canManageDrivers(role) {
  return [ROLES.BRANCH_MANAGER, ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
}

export function getHomeRouteForRole(role) {
  switch (role) {
    case ROLES.CASHIER:
    case ROLES.BRANCH_MANAGER:
      return '/cashier';
    case ROLES.DRIVER:
      return '/driver';
    case ROLES.ADMIN:
    case ROLES.SUPER_ADMIN:
      return '/admin';
    default:
      return '/';
  }
}
