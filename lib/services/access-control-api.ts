/**
 * Access Control API service.
 * All HTTP calls for employees, roles, and permissions.
 */

import axiosInstance from "@/lib/axiosInstance";
import type {
  Employee,
  EmployeesResponse,
  EmployeeDetailsResponse,
  PermissionsResponse,
  RolesResponse,
  AvailableRolesResponse,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  Role,
} from "@/app/dashboard/access-control/types";

const EMPLOYEES_BASE = "/v1/employees";
const ROLES_BASE = "/v1/roles";
const PERMISSIONS_BASE = "/v1/permissions";

export const accessControlApi = {
  employees: {
    list: () =>
      axiosInstance.get<EmployeesResponse>(EMPLOYEES_BASE).then((r) => r.data),

    getById: (id: number) =>
      axiosInstance
        .get<EmployeeDetailsResponse>(`${EMPLOYEES_BASE}/${id}`)
        .then((r) => r.data),

    create: (data: CreateEmployeeRequest) =>
      axiosInstance.post(EMPLOYEES_BASE, data),

    update: (id: number, data: UpdateEmployeeRequest) =>
      axiosInstance.put(`${EMPLOYEES_BASE}/${id}`, data),

    delete: (id: number) =>
      axiosInstance.delete(`${EMPLOYEES_BASE}/${id}`),
  },

  roles: {
    list: () =>
      axiosInstance.get<RolesResponse>(ROLES_BASE).then((r) => r.data),

    getById: (id: number) =>
      axiosInstance.get(`${ROLES_BASE}/${id}`).then((r) => r.data),

    create: (payload: { name: string; permissions: string[] }) =>
      axiosInstance.post(ROLES_BASE, payload),

    update: (id: number, payload: { name: string; permissions: string[] }) =>
      axiosInstance.put(`${ROLES_BASE}/${id}`, payload),

    delete: (id: number) =>
      axiosInstance.delete(`${ROLES_BASE}/${id}`),
  },

  permissions: {
    list: () =>
      axiosInstance
        .get<PermissionsResponse>(PERMISSIONS_BASE)
        .then((r) => r.data),

    delete: (id: number) =>
      axiosInstance.delete(`${PERMISSIONS_BASE}/${id}`),
  },

  available: {
    permissions: () =>
      axiosInstance.get<{ status?: string; data: unknown }>(
        `${EMPLOYEES_BASE}/available-permissions`
      ).then((r) => r.data),

    roles: () =>
      axiosInstance
        .get<AvailableRolesResponse>(`${EMPLOYEES_BASE}/available-roles`)
        .then((r) => r.data),
  },

  addons: {
    purchase: (qty: number, planId: number) =>
      axiosInstance.post("/employee/addons", { qty, plan_id: planId }),
  },
};

export type { Employee, Role };
