# Access Control Page Refactoring

## Summary

`app/dashboard/access-control/page.tsx` was refactored from a single ~1900-line file into a modular structure following **Clean Code** and **Best Practices**.

## New Structure

### Types (`app/dashboard/access-control/types/index.ts`)

- Single source of truth for domain types: `Employee`, `Role`, `Permission`, and all API request/response shapes.
- Removed duplicate `Permission` interface; all types exported from one file.

### API Layer (`lib/services/access-control-api.ts`)

- All HTTP calls for employees, roles, permissions, and addons in one service.
- Typed responses; no business logic in the page.

### Utils (`app/dashboard/access-control/utils/`)

- **index.ts**: Pure helpers: `formatDate`, `getInitials`, `translatePermission`, `getStatusLabel`, `getStatusVariant`, `getApiErrorMessage`, `DEFAULT_ERROR_MESSAGES`.
- **role-error-messages.ts**: Maps API/validation errors to Arabic for role create flow (SRP).

### Hooks (`app/dashboard/access-control/hooks/`)

- **useAccessControlEmployees**: Employees list, fetch, delete-dialog state, payment popup, navigate-to-create, isAtLimit.
- **useAvailablePermissions**: Available permissions for translation and fetch.
- **useRoleDetailsDialog**: Role details dialog state and fetch.
- **useCreateRoleDialog**: Create role form state and submit.
- **useEditRoleDialog**: Edit role form state, open with role data, submit.
- **useDeleteRoleDialog**: Delete role confirmation state and submit.
- **useDeletePermissionDialog**: Delete permission confirmation state and submit.
- **useAccessControlPermissionsForRole**: Fetches grouped permissions when create/edit role dialog is open.

### Components (`app/dashboard/access-control/components/`)

- **AccessControlStatsCards**: Stats cards (quota, total, active, usage %) with loading skeleton.
- **AddEmployeeButton**: Conditional button (add employee vs purchase addon) with loading state.
- **EmployeesTable**: Table with loading/error states, retry, and actions.
- **EmployeeTableRow**: Single row (avatar, email, phone, roles, status, actions).
- **StatusBadge**: Renders status label with correct styling.
- **dialogs/**:
  - **DeleteEmployeeDialog**
  - **RoleDetailsDialog**
  - **CreateRoleDialog**
  - **EditRoleDialog**
  - **DeleteRoleDialog**
  - **DeletePermissionDialog**

### Page (`app/dashboard/access-control/page.tsx`)

- Thin orchestrator: composes hooks and components only.
- No business logic; auth check, then render stats, table, and dialogs.
- Payment popup rendered when `payment.popupOpen` is true.

## Principles Applied

1. **Single Responsibility**: Each file has one clear purpose.
2. **DRY**: Types and API in one place; error messages and translation in utils.
3. **Separation of Concerns**: API vs state (hooks) vs UI (components).
4. **Testability**: Pure utils and service layer are easy to unit test.
5. **Naming**: Clear, consistent names (e.g. `openDialog`, `confirmDelete`, `translatePermission`).
6. **No console.log in production path**: Removed debug logs from permission translation and fetches.
7. **Controlled components**: Dialogs receive `open`, `onOpenChange`, and callbacks; state lives in hooks.

## Migration Notes

- Create/Edit Employee flows remain on separate routes (`create-employee`, `edit-employee/[id]`); only the list and delete/payment logic live on this page.
- Role/Permission dialogs are still rendered on this page (state and handlers ready); they can be opened from a future “Roles” tab or button.
- `useUserStore` and `useAuthStore` are used only in the page and in `useAccessControlEmployees` for quota and auth checks.
