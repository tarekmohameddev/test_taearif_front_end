# Customers Hub — Dynamic Stages API (V2)

**Audience:** Frontend (e.g. Next.js) and AI agents. Use this document to integrate with the stages CRUD and related behavior (pipeline, list, requests).

**Base path:** `/api/v2/customers-hub/stages` (prefix with your API base URL).

**Auth:** Required. Send Bearer token (e.g. Laravel Sanctum) as per your app. The tenant/user is derived from the authenticated user.

---

## Response format (stages endpoints)

- **Success:** `{ "success": true, "status": "success", "code": 200|201, "message": "...", "data": { ... }, "timestamp": "..." }`
- **Error:** `{ "success": false, "status": "error", "code": 4xx|5xx, "message": "...", "data": null|{ ... }, "timestamp": "..." }`

Always check `status === "success"` and use `data` for the payload. On error, use `message` and optionally `data` (e.g. `data.requests_count` for delete conflict).

---

## 1. Get all stages

**Endpoint:** `GET /api/v2/customers-hub/stages`

Returns all stages (or only active ones), ordered by `order` or `created_at`.

### 1.1 Query parameters (optional)

| Parameter     | Type    | Default   | Description                          |
|---------------|---------|-----------|--------------------------------------|
| `active_only` | boolean | false     | If `true`, only stages with `is_active: true`. |
| `order_by`    | string  | `"order"` | Sort key: `"order"` or `"created_at"`. |

### 1.2 Request

No body. Send auth headers only.

Example:

```http
GET /api/v2/customers-hub/stages?active_only=true&order_by=order
Authorization: Bearer <token>
```

### 1.3 Response (success, 200)

`data` shape:

```json
{
  "stages": [
    {
      "id": 1,
      "stage_id": "new_lead",
      "stage_name_ar": "عميل جديد",
      "stage_name_en": "New Lead",
      "color": "#3b82f6",
      "order": 1,
      "description": "Initial inquiry from any source",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    {
      "id": 2,
      "stage_id": "qualified",
      "stage_name_ar": "مؤهل",
      "stage_name_en": "Qualified",
      "color": "#8b5cf6",
      "order": 2,
      "description": "Budget, timeline, and preferences confirmed",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "total": 4
}
```

| Field        | Type   | Description |
|-------------|--------|-------------|
| `data.stages` | array  | List of stage objects. |
| `data.total`  | number | Number of stages returned. |
| `stages[].id` | number | Internal DB id. |
| `stages[].stage_id` | string | Unique slug (e.g. `new_lead`, `qualified`). Use this when updating customer stage or calling update/delete. |
| `stages[].stage_name_ar` | string | Arabic label. |
| `stages[].stage_name_en` | string | English label. |
| `stages[].color` | string | Hex color (e.g. `#3b82f6`). |
| `stages[].order` | number | Display order. |
| `stages[].description` | string \| null | Optional description. |
| `stages[].is_active` | boolean | Whether the stage is active. |
| `stages[].created_at`, `updated_at` | string | ISO 8601 timestamps. |

---

## 2. Create stage

**Endpoint:** `POST /api/v2/customers-hub/stages`

Creates a new stage.

### 2.1 Request body

```json
{
  "stage_id": "custom_stage",
  "stage_name_ar": "مرحلة مخصصة",
  "stage_name_en": "Custom Stage",
  "color": "#ff0000",
  "order": 5,
  "description": "Optional description",
  "is_active": true
}
```

| Field            | Type    | Required | Rules |
|------------------|---------|----------|--------|
| `stage_id`       | string  | yes      | Alphanumeric + underscore only, max 50 chars, unique. |
| `stage_name_ar`  | string  | yes      | Max 255. |
| `stage_name_en`  | string  | yes      | Max 255. |
| `color`          | string  | yes      | Hex format: `#RRGGBB` (e.g. `#3b82f6`). |
| `order`          | integer | yes      | Min 1. |
| `description`    | string  | no       | Optional. |
| `is_active`      | boolean | no       | Default `true`. |

### 2.2 Response (success, 201)

`data` is the created stage object (same shape as one element of `stages` in the list response), e.g.:

```json
{
  "success": true,
  "status": "success",
  "code": 201,
  "message": "Stage created successfully",
  "data": {
    "id": 5,
    "stage_id": "custom_stage",
    "stage_name_ar": "مرحلة مخصصة",
    "stage_name_en": "Custom Stage",
    "color": "#ff0000",
    "order": 5,
    "description": "Optional description",
    "is_active": true,
    "created_at": "2024-01-31T12:00:00.000000Z",
    "updated_at": "2024-01-31T12:00:00.000000Z"
  },
  "timestamp": "2024-01-31T12:00:00.000000Z"
}
```

### 2.3 Error responses

- **400** — Validation error (e.g. invalid `stage_id` format, missing required fields, invalid `color`).
- **409** — `stage_id` already exists.
- **500** — Server error.

---

## 3. Update stage

**Endpoint:** `PUT /api/v2/customers-hub/stages/{stage_id}`

Updates an existing stage. `stage_id` in the URL is the string identifier (e.g. `qualified`, `custom_stage`).

### 3.1 Path parameter

| Parameter   | Type   | Description |
|------------|--------|-------------|
| `stage_id` | string | Unique stage identifier (e.g. `new_lead`, `qualified`). |

### 3.2 Request body (all fields optional)

Send only the fields you want to change. `stage_id` cannot be updated.

```json
{
  "stage_name_ar": "مرحلة محدثة",
  "stage_name_en": "Updated Stage",
  "color": "#00ff00",
  "order": 6,
  "description": "Updated description",
  "is_active": false
}
```

Validation rules are the same as create (where applicable); all fields are optional.

### 3.3 Response (success, 200)

`data` is the updated stage object (same shape as in list/create).

### 3.4 Error responses

- **404** — Stage not found (e.g. invalid `stage_id` in URL).
- **400** — Validation error.
- **500** — Server error.

---

## 4. Delete stage

**Endpoint:** `DELETE /api/v2/customers-hub/stages/{stage_id}`

Deletes a stage. Fails if any customer is currently in this stage.

### 4.1 Path parameter

| Parameter   | Type   | Description |
|------------|--------|-------------|
| `stage_id` | string | Unique stage identifier. |

### 4.2 Request

No body. Send auth headers only.

### 4.3 Response (success, 200)

```json
{
  "success": true,
  "status": "success",
  "code": 200,
  "message": "Stage deleted successfully",
  "data": null,
  "timestamp": "2024-01-31T12:30:00.000000Z"
}
```

### 4.4 Error responses

- **404** — Stage not found.
- **409** — Stage is in use; cannot delete. Response includes how many customers use it:

```json
{
  "success": false,
  "status": "error",
  "code": 409,
  "message": "Cannot delete stage: 150 customers are using this stage",
  "data": {
    "requests_count": 150
  },
  "timestamp": "2024-01-31T12:30:00.000000Z"
}
```

- **500** — Server error.

---

## 5. Where stages are used (frontend integration)

- **Pipeline (kanban) — requests:** `POST /api/v2/customers-hub/pipeline` is **request-based** (lead-based hub). It returns `stages` with `id` and `stage_id` as **integer** (`property_request_statuses.id`). Move uses `POST /api/v2/customers-hub/pipeline/move` or `bulk-move` with `newStageId` (integer). See [pipeline-requests-frontend.md](pipeline-requests-frontend.md).
- **Customers list (customer-stage):** Filter options (e.g. `GET /api/v2/customers-hub/list/filter-options`) may include `stages` with `id` = `stage_id` (string) for **customer** hub stages. List filter by customer stage uses these string ids.
- **Customer detail:** `GET /api/v2/customers-hub/customers/{customerId}` returns `customer.stage` with `id` (string), `name`, `nameEn`, `color`. Update customer with `PUT /api/v2/customers-hub/customers/{customerId}` and optional `customers_hub_stage_id` (string).
- **Requests (actions):** The **Customers Hub requests list and pipeline** are **lead-based**: they use **pipeline** stages only (`property_request_statuses`). In the list, only property request actions have `stage_id` and `stage` (integer id and `{ id, nameAr, nameEn }`); other action types have `stage_id` and `stage` null. Update property request stage via `PATCH /api/v2/customers-hub/requests/{requestId}` with `status_id` (pipeline stage id). Customer hub stages (`customers_hub_stage_id`, `new_lead`, `qualified`, etc.) apply to **customer** detail/list APIs above, not to the hub requests list.

Use the appropriate `stage_id` or `status_id` per endpoint: pipeline stages (integer) for requests list and pipeline move; string `stage_id` for customer-stage endpoints where applicable.

---

## 6. Default stages (out of the box)

After migration, four default stages exist:

| stage_id    | stage_name_ar   | stage_name_en | color    | order |
|-------------|-----------------|---------------|----------|-------|
| new_lead    | عميل جديد       | New Lead      | #3b82f6  | 1     |
| qualified   | مؤهل            | Qualified     | #8b5cf6  | 2     |
| negotiation | تفاوض           | Negotiation   | #f59e0b  | 3     |
| closing     | إتمام الصفقة    | Closing       | #22c55e  | 4     |

You can add more via POST and edit/delete (delete only when no customer is in that stage).
