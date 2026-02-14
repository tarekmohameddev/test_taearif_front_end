# Customers Hub — Lead-Based Model (V2)

**Audience:** Frontend and AI agents. Use this document to integrate with the lead-based Customers Hub (requests center, pipeline, assignment).

**Base path:** `/api/v2/customers-hub` (prefix with your API base URL).

**Auth:** Required. Send `Authorization: Bearer {token}` (Sanctum). Tenant/user context is derived from the authenticated user.

---

## 1. Lead-based model (summary)

- **Lead entity:** A **property request** (`users_property_requests`). The hub centers on leads (requests), not customers.
- **Request IDs in URLs/bodies:** Use the **action ID** string, e.g. `property_request_123`, `inquiry_456`, `request_appointment_789`, `request_reminder_101`.
- **Appointments and reminders:** Only **request-level** (linked to a property request). Object types in the feed: `request_appointment`, `request_reminder` (IDs: `request_appointment_{id}`, `request_reminder_{id}`). Customer-level appointments/reminders are not used by the hub.
- **Pipeline stages:** Only **property request stages** (`property_request_statuses`). The list "stages" filter and stats use pipeline stage IDs (integers). When you filter by `stages`, only **property request** actions are returned; inquiries and other types are excluded.
- **Assignment:** Assignment is **request-level**. Unassigned count = property requests whose linked customer has no assignee. Assign endpoint accepts `requestIds` (property request IDs) or `customerIds` (backward compat). Workload stats are request counts per employee.
- **Notes:** Notes for **property requests** and **inquiries** are stored in `crm_hub_notes`. You can **add** a note with `POST /requests/{requestId}/notes`. Reading notes back in the hub response is not yet implemented (notes are not returned in `GET /requests/{requestId}`).

---

## 2. Request ID format (action ID)

Use these **exact** strings when calling endpoints that take `{requestId}` or when referring to an action in the list:

| Prefix | Meaning | Example |
|--------|---------|---------|
| `property_request_` | Property request (lead) | `property_request_42` |
| `inquiry_` | Customer inquiry | `inquiry_17` |
| `reminder_` | Follow-up reminder (legacy) | `reminder_5` |
| `request_appointment_` | Request-level appointment | `request_appointment_99` |
| `request_reminder_` | Request-level reminder | `request_reminder_12` |

Examples:

- Get single action: `GET /api/v2/customers-hub/requests/property_request_42`
- Complete: `POST /api/v2/customers-hub/requests/property_request_42/complete`
- Add note: `POST /api/v2/customers-hub/requests/inquiry_17/notes`
- Create appointment (only for property requests): `POST /api/v2/customers-hub/requests/property_request_42/appointments`

---

## 3. List: object types and stages

### 3.1 Object types (`objectTypes` filter and filter-options)

Use these values when filtering or displaying the kind of record:

| Value | Description (EN) |
|-------|------------------|
| `inquiry` | Inquiry |
| `property_request` | Property request (lead) |
| `reminder` | Follow-up reminder |
| `request_appointment` | Request appointment (site visit, etc.) |
| `request_reminder` | Request reminder |

**Filter options:** `GET /api/v2/customers-hub/requests/filter-options` returns `stages` as **pipeline stages** (from `property_request_statuses`). Each stage has `id` (integer), `label`, `labelEn`. Use `id` in the list body as `stages` (array of integers).

### 3.2 Stages filter (list body)

- **Parameter:** `stages` — array of **integers** (pipeline stage IDs from `property_request_statuses`).
- **Effect:** When `stages` is present, the list returns **only property request** actions in those stages. Inquiries, reminders, request_appointment, and request_reminder rows are **excluded**.
- **Example:**

```json
{
  "stages": [1, 2, 3],
  "limit": 50,
  "offset": 0
}
```

### 3.3 List response `stages` (stats)

The list response includes `stages`: array of pipeline stages with `stage_id` (slug), `stage_name_ar`, `stage_name_en`, `color`, `order`, `requestCount`, `percentage`. These are the same pipeline stages; counts reflect the current list filters.

---

## 4. Single action: update pipeline stage

To move a **property request** to another pipeline stage via the requests API (without using the pipeline board):

**Endpoint:** `PATCH /api/v2/customers-hub/requests/{requestId}`

**Body (optional fields):**

```json
{
  "status_id": 2,
  "priority": "high",
  "notes": "Optional note"
}
```

- **`status_id`:** Integer, must exist in `property_request_statuses` and be active. Only applied when the action is a property request (`property_request_{id}`). This is the **pipeline stage** (e.g. "Follow up", "Contract signed").

---

## 5. Notes

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}/notes`

**Body:**

```json
{
  "note": "Required note text",
  "addedBy": "Optional display name"
}
```

- **Supported for:** `property_request_{id}` and `inquiry_{id}`. Notes are stored in `crm_hub_notes` (polymorphic). For other action types (e.g. reminder, request_appointment), the backend may append to the row’s notes column where supported.
- **Reading notes:** The hub does **not** return notes in `GET /api/v2/customers-hub/requests/{requestId}`. If you need to display notes, you must add an endpoint or response field later.

---

## 6. Assignment (request-level)

### 6.1 Unassigned count

**Endpoint:** `GET /api/v2/customers-hub/assignment/unassigned-count`

**Response:** `unassignedCount` = number of **property requests** that have a linked customer with no assignee.

### 6.2 Employees (workload)

**Endpoint:** `GET /api/v2/customers-hub/assignment/employees`

**Response:** For each employee, `customerCount` / `activeCount` are **request counts** (property requests assigned via the linked customer), not raw customer counts.

### 6.3 Manual assign

**Endpoint:** `POST /api/v2/customers-hub/assignment/assign`

**Body (prefer request IDs):**

```json
{
  "requestIds": [10, 20, 30],
  "employeeId": "5"
}
```

- **`requestIds`:** Array of **property request IDs** (integers). Optional if `customerIds` is provided.
- **`customerIds`:** Optional; backward compatibility. When used, IDs are resolved (as request or customer) by the backend.
- **Effect:** For each request, the backend resolves the linked customer and sets `responsible_employee_id` on that customer. So assignment is logically per-request but stored on the customer.

### 6.4 Auto-assign

**Endpoint:** `POST /api/v2/customers-hub/assignment/auto-assign`

**Body:** Same as before (e.g. `employeeRules`). The backend now operates on **unassigned property requests** (with linked customer and request data) and assigns by updating the linked customer’s `responsible_employee_id`. Response can include `requestId` and `customerId` per assignment.

---

## 7. Pipeline (board)

- **Board:** `POST /api/v2/customers-hub/pipeline` — returns stages from `property_request_statuses`; each stage contains property requests (cards). No customer-level stages.
- **Move:** `POST /api/v2/customers-hub/pipeline/move` — body: `requestId` (or `customerId` as request id), `newStageId` (integer, must be active in `property_request_statuses`).
- **Bulk move:** `POST /api/v2/customers-hub/pipeline/bulk-move` — body: `requestIds` (or `customerIds`), `newStageId`.

---

## 8. Appointments and reminders (request-level)

- **Create appointment:** `POST /api/v2/customers-hub/requests/{requestId}/appointments` — only when `{requestId}` is `property_request_{id}`. Body: `type`, `datetime`, `duration`, `notes`, `title`, `priority`, etc.
- **Create reminder:** `POST /api/v2/customers-hub/requests/{requestId}/reminders` — only when `{requestId}` is `property_request_{id}`. Body: `title`, `description`, `datetime`, `priority`, `type`, `notes`.

List and show responses attach `appointments` and `reminders` arrays to **property request** actions (from `property_request_appointments` and `property_request_reminders`). Actions that are themselves `request_appointment` or `request_reminder` do not have nested arrays; they are the appointment/reminder row.

---

## 9. Error handling

- **404:** Action not found (invalid or wrong-tenant `requestId`).
- **422:** Validation error (e.g. invalid `status_id`, missing required body field) or operation not supported for this action type (e.g. notes not supported, or assign failed).
- Response shape: follow the same error format as other v2 endpoints (e.g. `message`, optional `errors`).

---

*See also: `customers-hub-requests-list.md`, `pipeline-requests-frontend.md`, `bulk-actions-requests-frontend.md`, `property-request-appointments-reminders-frontend.md`.*
