// config/roles.ts

export const rolePermissions: Record<number, string[]> = {
    100: ['read', 'print_bills','print_lists'],
    200: ['read', 'insert', 'update',  'print_bills','print_lists'],//todo to complete
    300: ['manage_users', 'delete_users', 'view_logs'],
  };
  