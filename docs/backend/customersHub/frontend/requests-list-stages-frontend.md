# Requests List – Stages (requestCount and percentage) (V2 Frontend)

**Audience:** Frontend (React) and AI agents. Use this document to display **stage pipeline** data (request count and percentage per stage) in the Customers Hub requests list.

**Base path:** `/api/v2/customers-hub/requests` (prefix with your API base URL).

**Auth:** Required. Send Bearer token (tenant or employee) as per your app.

---

## 1. Where stages come from

The **list** endpoint returns a `stages` array. The hub is **lead-based**: stages are always **pipeline** stages (`property_request_statuses`). There is no separate “customer hub stage” for the requests list.

| Request | Stages source | `stage_id` values | Use case |
|--------|----------------|-------------------|----------|
| All | **Property request statuses** (pipeline) | `new`, `follow_up`, `property_found`, `contract_signed`, `cancelled` (or tenant slugs) | Pipeline bar: count and % per stage for **property requests** only |

Counts are for **property requests** in each pipeline stage. **Property request** and **inquiry** actions have `stage_id` and `stage` when the backend has a pipeline stage set; other action types (reminder, request_appointment, request_reminder) have `stage_id` and `stage` null in the list. Use the returned `stages` to show a bar (or tabs) with **requestCount** and **percentage** per stage. Counts and percentages respect the same filters as the list (tab, priorities, cities, stages, etc.) and are computed over the **full** filtered set (not the current page).

---

## 2. List endpoint (stages in response)

**Endpoint:** `POST /api/v2/customers-hub/requests/list`

### 2.1 Request body (relevant for stages)

Send at least:

| Field | Type | Description |
|-------|------|-------------|
| `objectTypes` | string[] | Optional. Use `["property_request"]` to restrict the list to property requests; stage counts always reflect property requests only. |
| `tab` | string | Optional. `all` \| `inbox` \| `followups` \| `completed`. Affects which requests are counted (e.g. `completed` = archived for property requests). |
| `limit` | number | Optional. Page size (default 50). |
| `offset` | number | Optional. Pagination offset (default 0). |

Other filters (priorities, cities, states, budget, search, etc.) also apply to stage counts when `objectTypes: ["property_request"]`.

### 2.2 Example request (property-request pipeline)

```json
{
  "tab": "all",
  "objectTypes": ["property_request"],
  "limit": 50,
  "offset": 0,
  "sort_by": "createdAt",
  "sort_dir": "desc"
}
```

```javascript
const response = await fetch('/api/v2/customers-hub/requests/list', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    tab: 'all',
    objectTypes: ['property_request'],
    limit: 50,
    offset: 0,
    sort_by: 'createdAt',
    sort_dir: 'desc',
  }),
});
const json = await response.json();
```

### 2.3 Success response – stages (property-request only)

When `objectTypes` is exactly `["property_request"]`, `data.stages` looks like:

```json
{
  "status": "success",
  "data": {
    "actions": [ ... ],
    "stats": { ... },
    "stages": [
      {
        "stage_id": "new",
        "stage_name_ar": "جديد",
        "stage_name_en": "New",
        "color": "#3b82f6",
        "order": 1,
        "requestCount": 3,
        "percentage": 25.0
      },
      {
        "stage_id": "follow_up",
        "stage_name_ar": "متابعة",
        "stage_name_en": "Follow Up",
        "color": "#8b5cf6",
        "order": 2,
        "requestCount": 2,
        "percentage": 16.7
      },
      {
        "stage_id": "property_found",
        "stage_name_ar": "تم العثور على عقار",
        "stage_name_en": "Property Found",
        "color": "#f59e0b",
        "order": 3,
        "requestCount": 4,
        "percentage": 33.3
      },
      {
        "stage_id": "contract_signed",
        "stage_name_ar": "تم التعاقد",
        "stage_name_en": "Contract Signed",
        "color": "#22c55e",
        "order": 4,
        "requestCount": 3,
        "percentage": 25.0
      },
      {
        "stage_id": "cancelled",
        "stage_name_ar": "ملغي",
        "stage_name_en": "Cancelled",
        "color": "#6b7280",
        "order": 5,
        "requestCount": 0,
        "percentage": 0
      }
    ],
    "pagination": {
      "total": 12,
      "limit": 50,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

### 2.4 Stage object fields (property-request pipeline)

| Field | Type | Description |
|-------|------|-------------|
| `stage_id` | string | Slug: `new`, `follow_up`, `property_found`, `contract_signed`, `cancelled` |
| `stage_name_ar` | string | Arabic label |
| `stage_name_en` | string | English label |
| `color` | string | Hex color for UI (e.g. `#3b82f6`) |
| `order` | number | Display order (1-based) |
| `requestCount` | number | Number of property requests in this stage (matches current filters) |
| `percentage` | number | Percentage of total (0–100), one decimal. Sum of all percentages ≈ 100. |

### 2.5 Validation

- **Sum of requestCount** across stages equals the total number of property requests matching the same filters (same as `pagination.total` when only property requests are returned).
- **Sum of percentage** is approximately 100 (within rounding).
- **Empty result:** When no requests match, every stage has `requestCount: 0` and `percentage: 0`.

---

## 3. Tab and filters (property-request only)

Stage counts use the **same** filters as the list:

- **tab**
  - `all`: non-archived requests (`is_archived = 0`).
  - `completed`: archived requests (`is_archived = 1`).
  - `inbox` / `followups`: for property-request-only list, treated like `all`.
- **Priorities, cities, states, budget, property types, search, etc.** all narrow the set of requests used for counts and percentages.

---

## 4. Error handling

- Same as general list endpoint: 401 if not authenticated, 422 on validation errors. Stages are always returned when the list call succeeds (possibly an empty array if no active stages).
