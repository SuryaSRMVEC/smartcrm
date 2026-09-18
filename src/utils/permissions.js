const permissions = {
  Admin: [
    "dashboard",
    "customers",
    "leads",
    "deals",
    "contacts",
    "tasks",
    "reports",
    "team-members",
    "settings",
  ],

  Manager: [
    "dashboard",
    "customers",
    "leads",
    "deals",
    "contacts",
    "tasks",
    "reports",
    "team-members",
    "settings",
  ],

  Sales: [
    "dashboard",
    "customers",
    "leads",
    "deals",
    "tasks",
    "settings",
  ],

  Support: [
    "dashboard",
    "customers",
    "contacts",
    "tasks",
    "settings",
  ],

  Marketing: [
    "dashboard",
    "customers",
    "leads",
    "reports",
    "settings",
  ],
};

export const hasPermission = (role, page) => {
  return permissions[role]?.includes(page) ?? false;
};