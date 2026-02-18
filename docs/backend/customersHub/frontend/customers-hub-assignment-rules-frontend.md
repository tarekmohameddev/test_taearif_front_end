# Customers Hub — Assignment Rules API (V2)

**Audience:** Frontend (Next.js) and AI agents. Use this document to integrate with the assignment rules endpoints.

**Base path:** `/api/v2/customers-hub/assignment` (prefix with your API base URL).

**Auth:** Required. Send Bearer token (e.g. Sanctum) as per your app. The tenant/user is derived from the authenticated user.

---

## Response format (all endpoints)

- **Success:** `{ "status": "success", "code": 200, "message": "...", "data": { ... }, "timestamp": "..." }`
- **Error:** `{ "status": "error", "code": 4xx|5xx, "message": "...", "timestamp": "...", "errors": []? }`

Always check `status` and use `data` for payload on success.

---

## 1. Get assignment rules

**Endpoint:** `GET /api/v2/customers-hub/assignment/rules`

Returns the saved assignment rules for all employees (for the current tenant).

### 1.1 Request

No body. Send auth headers only.

### 1.2 Response (success, 200)

`data` shape:

```json
{
  "rules": [
    {
      "employeeId": "123",
      "isActive": true,
      "rules": [
        {
          "id": "rule-1",
          "field": "budgetMin",
          "operator": "greaterThan",
          "value": "500000"
        },
        {
          "id": "rule-2",
          "field": "propertyType",
          "operator": "contains",
          "value": "villa"
        }
      ]
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `rules` | array | List of per-employee rule sets. |
| `rules[].employeeId` | string | User ID of the employee. |
| `rules[].isActive` | boolean | Whether this employee's rules are active for auto-assign. |
| `rules[].rules` | array | List of condition objects. |
| `rules[].rules[].id` | string | Optional client-generated rule id. |
| `rules[].rules[].field` | string | One of: `budgetMin`, `budgetMax`, `propertyType`, `city`, `source`. |
| `rules[].rules[].operator` | string | One of: `equals`, `greaterThan`, `lessThan`, `contains`. |
| `rules[].rules[].value` | string | Value to compare (e.g. number as string, or text). |

### 1.3 Next.js example — fetch (Server Component or Route Handler)

```ts
// app/api/assignment-rules/route.ts (Route Handler) or server action
const API_BASE = process.env.NEXT_PUBLIC_API_URL; // e.g. https://api.example.com

export async function getAssignmentRules(token: string) {
  const res = await fetch(`${API_BASE}/api/v2/customers-hub/assignment/rules`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store', // or use revalidate
  });

  const json = await res.json();
  if (json.status !== 'success') {
    throw new Error(json.message ?? 'Failed to fetch rules');
  }
  return json.data as { rules: AssignmentRuleSet[] };
}

// Types
export interface AssignmentRuleCondition {
  id?: string;
  field: 'budgetMin' | 'budgetMax' | 'propertyType' | 'city' | 'source';
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'contains';
  value: string;
}

export interface AssignmentRuleSet {
  employeeId: string;
  isActive: boolean;
  rules: AssignmentRuleCondition[];
}
```

### 1.4 Next.js example — client (React Query)

```ts
// hooks/useAssignmentRules.ts
'use client';

import { useQuery } from '@tanstack/react-query';

type RulesResponse = { rules: AssignmentRuleSet[] }; // use your types

async function fetchRules(): Promise<RulesResponse> {
  const res = await fetch('/api/v2/customers-hub/assignment/rules', {
    headers: { Accept: 'application/json' },
    credentials: 'include', // if using cookie-based auth proxy
  });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message);
  return json.data;
}

export function useAssignmentRules() {
  return useQuery({
    queryKey: ['customers-hub', 'assignment', 'rules'],
    queryFn: fetchRules,
  });
}
```

### 1.5 Next.js example — client (SWR)

```ts
// hooks/useAssignmentRules.ts
'use client';

import useSWR from 'swr';

async function fetcher(url: string) {
  const res = await fetch(url, { credentials: 'include' });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message);
  return json.data;
}

export function useAssignmentRules() {
  const { data, error, mutate } = useSWR(
    '/api/v2/customers-hub/assignment/rules',
    fetcher
  );
  return { rules: data?.rules ?? [], error, mutate };
}
```

---

## 2. Save assignment rules

**Endpoint:** `POST /api/v2/customers-hub/assignment/rules`

Saves assignment rules per employee. Existing rules for each employee are replaced by the payload you send.

### 2.1 Request body

**Content-Type:** `application/json`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `employeeRules` | array | Yes (min 1) | One entry per employee. |
| `employeeRules[].employeeId` | string | Yes | User ID of the employee. |
| `employeeRules[].isActive` | boolean | Yes | Whether this employee's rules are active. |
| `employeeRules[].rules` | array | Yes | Array of rule conditions (can be empty). |
| `employeeRules[].rules[].id` | string | No | Optional client id for the rule. |
| `employeeRules[].rules[].field` | string | Yes | `budgetMin` \| `budgetMax` \| `propertyType` \| `city` \| `source`. |
| `employeeRules[].rules[].operator` | string | Yes | `equals` \| `greaterThan` \| `lessThan` \| `contains`. |
| `employeeRules[].rules[].value` | string | Yes | Value (e.g. `"500000"`, `"villa"`). |

### 2.2 Example request body

```json
{
  "employeeRules": [
    {
      "employeeId": "123",
      "isActive": true,
      "rules": [
        {
          "id": "r1",
          "field": "budgetMin",
          "operator": "greaterThan",
          "value": "500000"
        },
        {
          "field": "propertyType",
          "operator": "contains",
          "value": "villa"
        }
      ]
    },
    {
      "employeeId": "456",
      "isActive": false,
      "rules": []
    }
  ]
}
```

### 2.3 Response (success, 200)

`data` shape:

```json
{
  "savedCount": 2,
  "rules": [
    {
      "employeeId": "123",
      "isActive": true,
      "rules": [ ... ]
    },
    {
      "employeeId": "456",
      "isActive": false,
      "rules": []
    }
  ]
}
```

### 2.4 Next.js example — save (client with React Query)

```ts
// hooks/useSaveAssignmentRules.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

type SaveRulesPayload = {
  employeeRules: Array<{
    employeeId: string;
    isActive: boolean;
    rules: Array<{
      id?: string;
      field: string;
      operator: string;
      value: string;
    }>;
  }>;
};

async function saveRules(payload: SaveRulesPayload) {
  const res = await fetch('/api/v2/customers-hub/assignment/rules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message);
  return json.data;
}

export function useSaveAssignmentRules() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveRules,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-hub', 'assignment', 'rules'] });
    },
  });
}

// Usage in component:
// const { mutateAsync } = useSaveAssignmentRules();
// await mutateAsync({ employeeRules: [...] });
```

### 2.5 Next.js example — Server Action

```ts
// app/actions/assignment-rules.ts
'use server';

import { cookies } from 'next/headers'; // or your auth method

export async function saveAssignmentRules(employeeRules: SaveRulesPayload['employeeRules']) {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) throw new Error('Unauthorized');

  const res = await fetch(`${process.env.API_BASE}/api/v2/customers-hub/assignment/rules`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ employeeRules }),
  });

  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message ?? 'Failed to save rules');
  return json.data;
}
```

---

## 3. Rule fields and operators (reference)

| Field | Description | Example values |
|-------|-------------|----------------|
| `budgetMin` | Customer budget min | `"500000"` |
| `budgetMax` | Customer budget max | `"2000000"` |
| `propertyType` | Property type/category | `"villa"`, `"apartment"` |
| `city` | City (e.g. name or id) | `"Riyadh"` |
| `source` | Lead source | `"inquiry"`, `"whatsapp"` |

| Operator | Description |
|----------|-------------|
| `equals` | Exact match. |
| `greaterThan` | Numeric/lexicographic greater than. |
| `lessThan` | Numeric/lexicographic less than. |
| `contains` | Value contained in field (e.g. substring or array membership). |

---

## 4. Related endpoints (same base path)

- `GET /api/v2/customers-hub/assignment/employees` — Employees with workload stats (for dropdowns and capacity).
- `GET /api/v2/customers-hub/assignment/unassigned-count` — Count of unassigned customers.
- `POST /api/v2/customers-hub/assignment/auto-assign` — Run auto-assignment using current rules (same `employeeRules` shape as save).
- `POST /api/v2/customers-hub/assignment/assign` — Manually assign customers: body `{ "customerIds": string[], "employeeId": string }`.

Use the same auth and response format as above for these endpoints.
