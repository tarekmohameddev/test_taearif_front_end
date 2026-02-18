# Customers Hub — Pipeline API (V2)

**Audience:** Frontend (React) and AI agents. Use this document to integrate with the pipeline (Kanban) endpoints.

**Base path:** `/api/v2/customers-hub/pipeline` (prefix with your API base URL).

**Auth:** Required. Send tenant/user auth (e.g. Bearer token).

---

## Overview

The pipeline is **request-based**: it displays **property requests** (`users_property_requests`) grouped by **request lifecycle stages** (`property_request_statuses`). Each card is a property request, not a customer. The response shape is kept compatible with a customer-style board (e.g. `stages[].customers` contains request cards with the same field names).

---

## 1. Get board (and optional analytics)

**Endpoint:** `POST /api/v2/customers-hub/pipeline`

**Content-Type:** `application/json`

### Request body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | No | `board` \| `get_board` \| `analytics`. Default `board`. |
| `includeAnalytics` | boolean | No | When `true`, response includes `analytics` even if `action` is `board`. |
| `filters` | object | No | Filter the requests shown on the board (and in analytics). |

### Filters (under `filters`)

| Key | Type | Description |
|-----|------|-------------|
| `status` | integer[] | Restrict to these stage IDs (`property_request_statuses.id`). |
| `status_id` | integer[] | Same as `status`. |
| `property_type` | string[] | Restrict to these property types. |
| `city_id` | integer | Filter by city. |
| `district_id` | integer | Filter by district. |
| `districts_id` | integer | Same as `district_id`. |
| `budget_from` | number | Min budget (requests with budget_to or budget_from >= value). |
| `budget_to` | number | Max budget. |
| `assignedEmployeeId` | integer | Only requests whose linked customer is assigned to this employee. |
| `search` | string | Search in `full_name` and `phone` (max 255). |

### Example request

```json
{
  "action": "board",
  "includeAnalytics": true,
  "filters": {
    "property_type": ["villa"],
    "city_id": 1,
    "search": "أحمد"
  }
}
```

### Response (board)

```json
{
  "status": "success",
  "data": {
    "stages": [
      {
        "id": 1,
        "stage_id": 1,
        "name": "جديد",
        "nameEn": "New",
        "color": "#3b82f6",
        "order": 1,
        "count": 10,
        "customers": [
          {
            "id": 123,
            "name": "أحمد محمد",
            "phone": "+966501234567",
            "avatar": "أم",
            "totalDealValue": 2000000,
            "propertyType": ["villa"],
            "priority": { "id": "medium", "name": "متوسط", "color": "#ffc107" },
            "assignedEmployee": { "id": 5, "name": "محمد علي" },
            "lastContactAt": "2024-01-20T14:30:00+00:00",
            "createdAt": "2024-01-15T10:00:00+00:00"
          }
        ]
      }
    ],
    "totalCustomers": 25
  }
}
```

- `stages[].id` and `stages[].stage_id` are **integer** (property_request_statuses.id). Use them as `newStageId` when moving requests.
- `stages[].customers` are **request cards** (each `id` is a property request id).
- `totalCustomers` is the total **request** count across stages.

### Response (with analytics)

When `action` is `analytics` or `includeAnalytics` is true, the same `data` object also includes:

```json
{
  "analytics": {
    "conversionRate": 15.5,
    "avgDaysInPipeline": 12,
    "bottlenecks": [
      {
        "stageId": 2,
        "stageName": "متابعة",
        "color": "#8b5cf6",
        "count": 45,
        "avgCustomersPerStage": 20
      }
    ]
  }
}
```

---

## 2. Move one request

**Endpoint:** `POST /api/v2/customers-hub/pipeline/move`

**Content-Type:** `application/json`

Moves a single property request to a new stage. Use **requestId** (property request id). For backward compatibility, **customerId** is also accepted and treated as the request id when `requestId` is not provided.

### Request body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requestId` | integer | Yes* | Property request ID to move. *Required unless `customerId` is provided. |
| `customerId` | integer | No | Deprecated: same as request id. Use only for backward compatibility when `requestId` is omitted. |
| `newStageId` | integer | Yes | Target stage ID (`property_request_statuses.id`). Must be active. |
| `notes` | string | No | Optional notes (max 500). |

### Example request

```json
{
  "requestId": 123,
  "newStageId": 2,
  "notes": "متابعة هاتفية"
}
```

### Response (success)

```json
{
  "status": "success",
  "data": {
    "message": "Request moved successfully",
    "requestId": 123,
    "customerId": 228,
    "customerName": "أحمد محمد",
    "previousStage": {
      "id": 1,
      "nameAr": "جديد",
      "nameEn": "New"
    },
    "newStage": {
      "id": 2,
      "nameAr": "متابعة",
      "nameEn": "Follow Up"
    },
    "movedAt": "2024-01-21T10:30:00+00:00",
    "movedBy": { "id": 1, "name": "محمد علي" },
    "notes": "متابعة هاتفية"
  }
}
```

- **requestId** — The property request that was moved.
- **customerId** — The linked customer id (api_customers.id) for reference; may be `null` if no customer record exists for this request.
- **customerName** — Request contact name (full_name).

### Errors

- **404** — Request not found (wrong id, wrong tenant, or request inactive/archived).
- **422** — Validation failed (missing requestId/customerId, invalid type, or invalid/inactive `newStageId`).

---

## 3. Bulk move requests

**Endpoint:** `POST /api/v2/customers-hub/pipeline/bulk-move`

**Content-Type:** `application/json`

Accepts **requestIds** (preferred) or **customerIds** (backward compatibility). If both are sent, **requestIds** is used.

### Request body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requestIds` | integer[] | Yes* | Property request IDs to move. *Required unless `customerIds` is provided. |
| `customerIds` | integer[] | No | Deprecated: same as request IDs. Use only for backward compatibility when `requestIds` is omitted. |
| `newStageId` | integer | Yes | Target stage ID (`property_request_statuses.id`). Must be active. |

### Example request

```json
{
  "requestIds": [101, 102, 103],
  "newStageId": 3
}
```

### Response (success)

```json
{
  "status": "success",
  "data": {
    "updated": 3,
    "message": "3 request(s) moved successfully"
  }
}
```

Only **active, non-archived** requests that belong to the tenant are updated. `updated` may be less than the number of IDs sent if some are invalid or archived.

---

## 4. Testing checklist

After implementation, verify:

- [ ] **Board** — `POST /api/v2/customers-hub/pipeline` with `action: "board"` returns property requests grouped by stages.
- [ ] **Counts** — Request count per stage matches the number of items in `stages[].customers` (subject to per-stage limit).
- [ ] **Cards** — Each card shows correct request data: name (`full_name`), phone, property type, budget (`totalDealValue`), priority (from seriousness), assignee when present.
- [ ] **Filters** — Filters (property type, city, budget range, assignee, search) correctly narrow the board and analytics.
- [ ] **Move** — `POST .../pipeline/move` with valid `requestId` and `newStageId` updates the request’s `status_id` and returns requestId, customerId (or null), customerName, previousStage, newStage, movedAt, movedBy.
- [ ] **Move 404** — `POST .../pipeline/move` with non-existent or wrong-tenant `requestId` returns 404 (Request not found).
- [ ] **Bulk move** — `POST .../pipeline/bulk-move` with `requestIds` (or `customerIds`) and `newStageId` updates only active, non-archived requests; response `updated` is correct.
- [ ] **Active only** — Only requests with `is_active = 1` and `is_archived = 0` appear on the board and can be moved.
- [ ] **Tenant isolation** — Only requests for the current tenant (`user_id`) are returned or updated.
- [ ] **Performance** — Board load remains acceptable (e.g. under 100ms with typical data and per-stage limit).
