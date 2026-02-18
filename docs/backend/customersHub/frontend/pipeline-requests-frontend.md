# Customers Hub — Pipeline API (V2)

**Audience:** Frontend (React) and AI agents. Use this document to integrate with the pipeline (Kanban) endpoints.

**Base path:** `/api/v2/customers-hub/pipeline` (prefix with your API base URL).

**Auth:** Required. Send tenant/user auth (e.g. Bearer token).

---

## Overview

The pipeline displays **property requests** and **inquiries** grouped by **customers_hub_stages** (string `stage_id`, e.g. `new_lead`, `qualified`). Each card is either a request or an inquiry; the response includes a **source** field (`"request"` or `"inquiry"`) and the appropriate id (`requestId` or `inquiryId`) so you can call the move endpoint correctly. An **Unassigned** column holds items with no stage.

---

## 1. Get board (and optional analytics)

**Endpoint:** `POST /api/v2/customers-hub/pipeline`

**Content-Type:** `application/json`

### Request body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `action` | string | No | `board` \| `get_board` \| `analytics`. Default `board`. |
| `includeAnalytics` | boolean | No | When `true`, response includes `analytics` even if `action` is `board`. |
| `filters` | object | No | Filter the requests and inquiries shown on the board (and in analytics). |

### Filters (under `filters`)

| Key | Type | Description |
|-----|------|-------------|
| `stage_id` | array | Restrict to these stage identifiers: **strings** (e.g. `"new_lead"`, `"qualified"`) or **integers** (customers_hub_stages.id). |
| `status_id` | array | Same as `stage_id` (legacy). |
| `status` | integer[] | Legacy: resolved to customers_hub_stages by id. |
| `property_type` | string[] | Restrict to these property types (requests). |
| `city_id` | integer | Filter by city (requests). |
| `district_id` | integer | Filter by district (requests). |
| `districts_id` | integer | Same as `district_id`. |
| `budget_from` | number | Min budget (requests with budget_to or budget_from >= value). |
| `budget_to` | number | Max budget. |
| `assignedEmployeeId` | integer | Only items whose linked customer/assignee is this employee. |
| `search` | string | Search in name, phone, and (for inquiries) message (max 255). |

### Example request

```json
{
  "action": "board",
  "includeAnalytics": true,
  "filters": {
    "property_type": ["villa"],
    "stage_id": ["new_lead", "qualified"],
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
        "stage_id": "new_lead",
        "name": "عميل جديد",
        "nameEn": "New Lead",
        "color": "#3b82f6",
        "order": 1,
        "count": 12,
        "customers": [
          {
            "id": 123,
            "requestId": 123,
            "inquiryId": null,
            "source": "request",
            "name": "أحمد محمد",
            "phone": "+966501234567",
            "avatar": "أم",
            "totalDealValue": 2000000,
            "propertyType": ["villa"],
            "priority": { "id": "medium", "name": "متوسط", "color": "#ffc107" },
            "assignedEmployee": { "id": 5, "name": "محمد علي" },
            "lastContactAt": "2024-01-20T14:30:00+00:00",
            "createdAt": "2024-01-15T10:00:00+00:00"
          },
          {
            "id": 7514,
            "requestId": null,
            "inquiryId": 7514,
            "source": "inquiry",
            "name": "سارة علي",
            "phone": "+966509876543",
            "avatar": "سع",
            "totalDealValue": 1500000,
            "propertyType": ["apartment"],
            "priority": { "id": "medium", "name": "متوسط", "color": "#ffc107" },
            "assignedEmployee": null,
            "lastContactAt": "2024-01-19T09:00:00+00:00",
            "createdAt": "2024-01-18T12:00:00+00:00"
          }
        ]
      },
      {
        "id": null,
        "stage_id": null,
        "name": "غير معين",
        "nameEn": "Unassigned",
        "color": "#6b7280",
        "order": 999,
        "count": 0,
        "customers": []
      }
    ],
    "totalCustomers": 25
  }
}
```

- **stages[].id** — Numeric id from `customers_hub_stages` (null for Unassigned).
- **stages[].stage_id** — String identifier (e.g. `"new_lead"`, `"qualified"`). Use as `newStageId` when moving, or use numeric `id`.
- **stages[].customers** — Mix of **request cards** and **inquiry cards**. Each card has:
  - **source** — `"request"` or `"inquiry"`.
  - **requestId** — Set when `source === "request"`; use in move body as `requestId`.
  - **inquiryId** — Set when `source === "inquiry"`; use in move body as `inquiryId`.
- **totalCustomers** — Total count of cards (requests + inquiries) across all stages.

### Response (with analytics)

When `action` is `analytics` or `includeAnalytics` is true, the same `data` object also includes:

```json
{
  "analytics": {
    "conversionRate": 0,
    "avgDaysInPipeline": 12,
    "bottlenecks": [
      {
        "stageId": "qualified",
        "stageName": "مؤهل",
        "color": "#8b5cf6",
        "count": 45,
        "avgCustomersPerStage": 20
      }
    ]
  }
}
```

---

## 2. Move one request or inquiry

**Endpoint:** `POST /api/v2/customers-hub/pipeline/move`

**Content-Type:** `application/json`

Moves a single **property request** or **inquiry** to a new stage. You must send **either** `requestId` **or** `inquiryId` (not both). **newStageId** can be a **string** (e.g. `"qualified"`) or an **integer** (customers_hub_stages.id).

### Request body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requestId` | integer | Yes* | Property request ID to move. *Required when not using `inquiryId`. |
| `customerId` | integer | No | Backward compatibility: treated as request id when `requestId` is omitted. |
| `inquiryId` | integer | Yes* | Inquiry ID (api_customer_inquiry.id) to move. *Required when not using `requestId`/`customerId`. |
| `newStageId` | string \| integer | Yes | Target stage: **string** (e.g. `"qualified"`) or **integer** (customers_hub_stages.id). Must be active. |
| `notes` | string | No | Optional notes (max 500). |

- Exactly one of `requestId` (or `customerId`) or `inquiryId` must be provided.

### Example requests

Move a **request** (string stage):

```json
{
  "requestId": 123,
  "newStageId": "qualified",
  "notes": "متابعة هاتفية"
}
```

Move a **request** (integer stage):

```json
{
  "requestId": 123,
  "newStageId": 2
}
```

Move an **inquiry**:

```json
{
  "inquiryId": 7514,
  "newStageId": 3
}
```

### Response (success — request)

```json
{
  "status": "success",
  "data": {
    "message": "Request moved successfully",
    "source": "request",
    "requestId": 123,
    "inquiryId": null,
    "customerId": 228,
    "customerName": "أحمد محمد",
    "previousStage": {
      "id": 1,
      "stage_id": "new_lead",
      "nameAr": "عميل جديد",
      "nameEn": "New Lead"
    },
    "newStage": {
      "id": 2,
      "stage_id": "qualified",
      "nameAr": "مؤهل",
      "nameEn": "Qualified"
    },
    "movedAt": "2024-01-21T10:30:00+00:00",
    "movedBy": { "id": 1, "name": "محمد علي" },
    "notes": "متابعة هاتفية"
  }
}
```

### Response (success — inquiry)

```json
{
  "status": "success",
  "data": {
    "message": "Inquiry moved successfully",
    "source": "inquiry",
    "requestId": null,
    "inquiryId": 7514,
    "customerId": 3580,
    "customerName": "سارة علي",
    "previousStage": {
      "id": 1,
      "stage_id": "new_lead",
      "nameAr": "عميل جديد",
      "nameEn": "New Lead"
    },
    "newStage": {
      "id": 3,
      "stage_id": "negotiation",
      "nameAr": "تفاوض",
      "nameEn": "Negotiation"
    },
    "movedAt": "2024-01-21T10:30:00+00:00",
    "movedBy": { "id": 1, "name": "محمد علي" },
    "notes": null
  }
}
```

- **source** — `"request"` or `"inquiry"` so the client knows what was moved.
- **newStage** includes both **id** (numeric) and **stage_id** (string) for flexibility.

### Errors

- **404** — Request or inquiry not found (wrong id or wrong tenant).
- **422** — Validation failed: missing both requestId and inquiryId, or both provided, or invalid/inactive `newStageId`.

---

## 3. Bulk move requests

**Endpoint:** `POST /api/v2/customers-hub/pipeline/bulk-move`

**Content-Type:** `application/json`

Moves multiple **property requests** to a new stage. Accepts **requestIds** (preferred) or **customerIds** (backward compatibility). **Inquiries are not supported** in bulk-move; use single move with `inquiryId` for each.

### Request body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `requestIds` | integer[] | Yes* | Property request IDs to move. *Required unless `customerIds` is provided. |
| `customerIds` | integer[] | No | Backward compatibility: same as request IDs. |
| `newStageId` | string \| integer | Yes | Target stage (string stage_id or integer id). Must be active. |

### Example request

```json
{
  "requestIds": [101, 102, 103],
  "newStageId": "qualified"
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

Only **active, non-archived** requests that belong to the tenant are updated.

---

## 4. Testing checklist

- [ ] **Board** — `POST /api/v2/customers-hub/pipeline` with `action: "board"` returns stages from customers_hub_stages; each stage has both request and inquiry cards where applicable.
- [ ] **Card source** — Each card has `source` (`"request"` or `"inquiry"`), `requestId` and/or `inquiryId` so move can be called with the correct body.
- [ ] **Unassigned** — Last stage has `stage_id: null`, name "Unassigned" / "غير معين", for items with no stage.
- [ ] **Filters** — `stage_id` (and legacy `status_id` / `status`) filter by customers_hub stage; other filters narrow board and analytics.
- [ ] **Move request** — `POST .../pipeline/move` with `requestId` and `newStageId` (string or integer) updates the request’s stage; response has `source: "request"`.
- [ ] **Move inquiry** — `POST .../pipeline/move` with `inquiryId` and `newStageId` updates the inquiry’s stage; response has `source: "inquiry"`.
- [ ] **Move 404** — Non-existent or wrong-tenant request/inquiry returns 404.
- [ ] **Bulk move** — `POST .../pipeline/bulk-move` with `requestIds` and `newStageId` (string or integer) updates only active requests; `updated` is correct.
- [ ] **Tenant isolation** — Only data for the current tenant is returned or updated.
