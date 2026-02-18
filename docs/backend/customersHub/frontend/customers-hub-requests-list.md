# Customers Hub — Requests List API (V2)

**Audience:** Frontend (React) and AI agents. Use this document to integrate with the requests list endpoint.

**Base path:** `/api/v2/customers-hub/requests` (prefix with your API base URL).

**Auth:** Required. Send tenant/user auth (e.g. Bearer token) as per your app.

**Lead-based hub:** Appointments and reminders are **request-level** only (`request_appointment`, `request_reminder`). Stages are **pipeline** only (`property_request_statuses`). See [Customers Hub — Lead-based](customers-hub-lead-based.md) for the full model.

---

## 1. List requests

**Endpoint:** `POST /api/v2/customers-hub/requests/list`

**Content-Type:** `application/json`

Returns a paginated list of customer actions (inquiries, property matches, follow-ups, etc.) with optional filters and stats.

### 1.1 Request body (flat, no nested `filters`)

Send all parameters at the **root** of the JSON body. Do **not** wrap them in `filters`, `pagination`, or `sorting`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tab` | string | No | Preset: `inbox` \| `followups` \| `all` \| `completed` |
| `types` | string[] | No | Action types (see 1.3). Use key **`types`** (plural), not `type`. |
| `statuses` | string[] | No | `pending` \| `in_progress` \| `completed` \| `dismissed` |
| `sources` | string[] | No | Origin: `inquiry` \| `manual` \| `whatsapp` \| `import` \| `referral` \| `property_request` \| `website` \| `affiliate` |
| `objectTypes` | string[] | No | Kind of record: `inquiry` \| `property_request` \| `reminder` \| `request_appointment` \| `request_reminder` |
| `priorities` | string[] | No | `low` \| `medium` \| `high` \| `urgent` |
| `assignees` | number[] | No | Employee user IDs |
| `stages` | number[] | No | Pipeline stage IDs (`property_request_statuses.id`). When set, only **property request** actions are returned; other action types are excluded. |
| `customer_id` | number | No | Filter by one customer ID |
| `due_date_bucket` | string | No | `overdue` \| `today` \| `week` \| `no_date`. Use **`due_date_bucket`**, not `dueDate`. See **1.3.1** for how `today` works with requests and inquiries. |
| `property_categories` | string[] | No | Unit type: e.g. `villa`, `apartment`, `building`. Matches both inquiries and property requests. |
| `property_types` | string[] | No | Sector: `Residential` \| `Commercial` \| `Industrial` \| `Agricultural`. Only property requests have this; inquiries are excluded when this filter is used. |
| `cities` | string[] | No | Filter by city (request-level). Inquiries: `city`; property requests: city name from `user_cities`. Requests with no city are excluded when this filter is sent. |
| `states` | string[] | No | Filter by state/region (request-level). Inquiries: `region_name`; property requests: `region`. |
| `budget_min` | number | No | Min budget (request-level). Request’s budget range must overlap `[budget_min, budget_max]` (or `[budget_min, ∞)` if only `budget_min` is set). |
| `budget_max` | number | No | Max budget (request-level). Request’s budget range must overlap filter range. |
| `date_from` | string (date) | No | Filter by `createdAt >= date_from` |
| `date_to` | string (date) | No | Filter by `createdAt <= date_to` |
| `search` | string | No | Search in customer name, title, description, phone (max 255) |
| `sort_by` | string | No | `createdAt` \| `dueDate` \| `priority` \| `customerName`. Use **`sort_by`**, not `sorting.field`. |
| `sort_dir` | string | No | `asc` \| `desc`. Use **`sort_dir`**, not `sorting.order`. |
| `limit` | number | No | Page size 1–100. Default 50. Use **`limit`**, not `pagination.limit`. |
| `offset` | number | No | Offset for pagination. Default 0. Use **`offset`**, not `pagination.page`. |

### 1.2 Alternate parameter names (accepted by backend)

The backend accepts **either** the canonical names **or** these alternate names (merged before validation). Use one set consistently.

| Canonical | Alternate (e.g. from UI state) |
|-----------|--------------------------------|
| `tab` | `activeTab` |
| `types` | `selectedTypes` |
| `sources` | `selectedSources` |
| `objectTypes` | `selectedObjectTypes` |
| `priorities` | `selectedPriorities` |
| `assignees` | `selectedAssignees` |
| `due_date_bucket` | `dueDateFilter` |
| `property_categories` | `selectedPropertyTypes` |
| `cities` | `selectedCities` |
| `states` | `selectedStates` |
| `budget_min` | `budgetMin` |
| `budget_max` | `budgetMax` |

### 1.3.1 Due date buckets (`due_date_bucket`)

| Value | Meaning |
|-------|--------|
| `overdue` | Action has a due date in the past. |
| **`today`** | **Inquiry** and **property_request**: included if they have **at least one appointment** (from `inquiry_appointments` or `property_request_appointments`) whose date is **today**. **Reminder**, **request_appointment**, **request_reminder**: included if the action’s own `dueDate` is today. |
| `week` | Action has a due date from now through the next 7 days. |
| `no_date` | Action has no due date. |

Use `due_date_bucket: "today"` with `objectTypes: ["inquiry", "property_request"]` to get all requests and inquiries that have at least one appointment scheduled for today.

**Example: requests and inquiries with an appointment today**

```json
{
  "tab": "all",
  "statuses": ["pending", "in_progress"],
  "objectTypes": ["inquiry", "property_request"],
  "due_date_bucket": "today",
  "limit": 50,
  "offset": 0,
  "sort_by": "createdAt",
  "sort_dir": "desc"
}
```

### 1.3.2 Property filters: two distinct concepts

- **`property_categories`** — Unit type (villa, apartment, building, etc.).  
  - Use for: “Show me requests about villas/apartments.”  
  - Values: typically slugs/names from the tenant’s property categories (e.g. `villa`, `apartment`, `building`).  
  - Applied to: both **inquiries** and **property requests**.

- **`property_types`** — Sector (Residential, Commercial, etc.).  
  - Use for: “Show me residential/commercial requests.”  
  - Values: `Residential`, `Commercial`, `Industrial`, `Agricultural` (exact strings).  
  - Applied to: **property requests only**. Inquiries do not have this field; they are **excluded** when `property_types` is sent.

### 1.4 Action types (`types`)

Allowed values for `types` (array of strings):

- `new_inquiry`
- `callback_request`
- `whatsapp_incoming`
- `property_match`
- `follow_up`
- `site_visit`

### 1.5 Example request (React / fetch)

```json
{
  "tab": "inbox",
  "types": ["new_inquiry", "callback_request", "whatsapp_incoming"],
  "objectTypes": ["inquiry", "reminder", "request_appointment", "request_reminder"],
  "due_date_bucket": "overdue",
  "property_categories": ["villa"],
  "property_types": ["Residential"],
  "limit": 50,
  "offset": 0,
  "sort_by": "dueDate",
  "sort_dir": "asc"
}
```

```javascript
const response = await fetch('/api/v2/customers-hub/requests/list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    tab: 'inbox',
    types: ['new_inquiry', 'callback_request', 'whatsapp_incoming'],
    objectTypes: ['inquiry', 'reminder', 'request_appointment', 'request_reminder'],
    due_date_bucket: 'overdue',
    property_categories: ['villa'],
    limit: 50,
    offset: 0,
    sort_by: 'dueDate',
    sort_dir: 'asc',
  }),
});
const { data } = await response.json();
```

### 1.6 Response shape

```json
{
  "status": "success",
  "data": {
    "actions": [ /* see Action object below */ ],
    "stats": {
      "inbox": 9,
      "followups": 10,
      "pending": 31,
      "overdue": 2,
      "today": 0,
      "completed": 2
    },
    "stages": [
      {
        "stage_id": "new",
        "stage_name_ar": "عميل جديد",
        "stage_name_en": "New Lead",
        "color": "#3b82f6",
        "order": 1,
        "requestCount": 12,
        "percentage": 35.2
      },
      {
        "stage_id": "follow_up",
        "stage_name_ar": "متابعة",
        "stage_name_en": "Follow Up",
        "color": "#8b5cf6",
        "order": 2,
        "requestCount": 8,
        "percentage": 23.5
      }
    ],
    "pagination": {
      "total": 34,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

**`data.stages`** — Pipeline stage statistics only (from `property_request_statuses`). Counts are for **property requests** in each stage, for the same filtered set as the list. Every active pipeline stage is included; stages with no matching requests have `requestCount: 0` and `percentage: 0.0`. Use for pipeline-style breakdowns (e.g. funnel by stage). Percentages are based on the sum of all stage counts and round to one decimal.

### 1.6.1 Stage object (each item in `data.stages`)

| Field | Type | Description |
|-------|------|-------------|
| `stage_id` | string | Pipeline stage slug (e.g. `new`, `follow_up`, `property_found`, `contract_signed`, `cancelled`) from `property_request_statuses` |
| `stage_name_ar` | string | Arabic label |
| `stage_name_en` | string | English label |
| `color` | string | Hex color (e.g. `#3b82f6`) |
| `order` | number | Display order |
| `requestCount` | number | Number of requests in this stage (after applying the same filters as the list) |
| `percentage` | number | Share of total (0–100), one decimal place; `0.0` when total is 0 |

### 1.7 Action object (each item in `data.actions`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Composite id, e.g. `inquiry_41`, `property_request_89`, `reminder_1` |
| `customerId` | number \| null | Customer ID if linked |
| `customerName` | string | |
| `customerPhone` | string \| null | |
| `type` | string | One of the action types in 1.3 |
| `title` | string | |
| `description` | string \| null | |
| `priority` | string | `low` \| `medium` \| `high` \| `urgent` |
| `status` | string | `pending` \| `in_progress` \| `completed` \| `dismissed` |
| `source` | string | Origin: `manual`, `website`, `whatsapp`, `affiliate`, `inquiry`, etc. Empty string when not set. |
| `objectType` | string | Kind of record: `inquiry` \| `property_request` \| `reminder` \| `request_appointment` \| `request_reminder` |
| `dueDate` | string \| null | ISO 8601 datetime |
| `snoozedUntil` | string \| null | ISO 8601 datetime |
| `createdAt` | string | ISO 8601 datetime |
| `completedAt` | string \| null | ISO 8601 datetime |
| `completedBy` | mixed \| null | |
| `assignedTo` | string \| null | Employee ID |
| `assignedToName` | string | |
| **`propertyCategory`** | **string \| null** | Unit type: villa, apartment, building, etc. Inquiries and property requests; null for follow-ups/appointments. |
| **`propertyType`** | **string \| null** | Sector: Residential, Commercial, Industrial, Agricultural. Only set for property requests; null for inquiries. |
| `city` | string \| null | City (request-level). Inquiries and property requests; null for reminders and request-level appointment/reminder rows. |
| `state` | string \| null | State/region (request-level). Inquiries: region_name; property requests: region; null for others. |
| `budgetMin` | number \| null | Min budget (request-level). Single budget or range min. |
| `budgetMax` | number \| null | Max budget (request-level). Single budget or range max; null when not applicable. |
| `metadata` | object | Source-specific (e.g. inquiryId, propertyRequestId, budget, city). May also contain `propertyType`/`propertyCategory` for backward compatibility. |
| `sourceTable` | string | e.g. `api_customer_inquiry`, `users_property_requests`, `reminders` |
| `sourceId` | number | Source table primary key |
| **`stage_id`** | **number \| null** | **For `objectType === 'property_request'` only:** pipeline stage id (`property_request_statuses.id`); matches the stage set by `POST .../pipeline/move`. **For other types:** `null` (hub is lead-based; only property requests have a pipeline stage). |
| **`stage`** | **object \| null** | **For `objectType === 'property_request'` only:** `{ id, nameAr, nameEn }` (pipeline stage; same shape as move response). **For other types:** `null`. |

### 1.8 Pagination (React)

- Use `limit` and `offset` (not page number).  
- Next page: `offset = currentOffset + limit`.  
- Stop when `pagination.hasMore === false` or `data.actions.length === 0`.

---

## 2. Get filter options

**Endpoint:** `GET /api/v2/customers-hub/requests/filter-options`

Returns static options for types, statuses, priorities, sources, **objectTypes**, due-date buckets, and tenant-specific employees. No query params required.

**`data.objectTypes`** — Options for filtering by kind of record: `inquiry`, `property_request`, `reminder`, `request_appointment`, `request_reminder`. Each option has `id`, `label` (Arabic), `labelEn` (English). Appointments and reminders are request-level only (lead-based hub).

**Note:** This endpoint does **not** return `property_categories` or `property_types` options. Use tenant-specific property categories (e.g. from `user_property_categories` or your app config) for `property_categories`. For `property_types` use the fixed set: `Residential`, `Commercial`, `Industrial`, `Agricultural`.

---

## 3. Quick reference: parameter names

Use these exact names in the request body (common mistakes in parentheses). Alternates in 1.2 are also accepted.

- `types` (not `type`)
- `objectTypes` (or `selectedObjectTypes`) for filtering by kind of record
- `due_date_bucket` (not `dueDate`)
- `property_categories` (not `propertyType` for category filter)
- `property_types` (for sector filter)
- `cities`, `states`, `budget_min`, `budget_max` (or `selectedCities`, `selectedStates`, `budgetMin`, `budgetMax`)
- `sort_by` (not `sorting.field`)
- `sort_dir` (not `sorting.order`)
- `limit`, `offset` (not `pagination.page`, `pagination.limit`)

All filter and pagination fields are **top-level** keys in the JSON body; do not nest them under `filters`, `pagination`, or `sorting`.

---

*See also: `customers-hub-lead-based.md`, `pipeline-requests-frontend.md`, `bulk-actions-requests-frontend.md`, `property-request-appointments-reminders-frontend.md`.*
