# Customers Hub — Assigned Properties (V2)

**Audience:** Frontend and AI agents. Use this document to assign and list properties (listings) for a customer via the pivot `api_customer_assigned_property`.

**Base path:** `/api/v2/customers-hub` (prefix with your API base URL).

**Auth:** Required. Send `Authorization: Bearer {token}` (Sanctum). Tenant/user context is derived from the authenticated user.

---

## 1. Overview

- **Purpose:** One customer can have **many** properties (listings from `user_properties`) assigned. Each assignment is one row in the pivot table `api_customer_assigned_property` (no new column on the customer table).
- **Endpoints:** Assign one property per request (accumulative), list all assigned properties with optional pagination, and optionally remove one assignment.
- **IDs:** `customerId` = `api_customers.id`, `propertyId` = `user_properties.id`. Both must belong to the authenticated tenant.

---

## 2. Endpoints

| Method | Path | Description |
|--------|------|--------------|
| POST | `/customers/{customerId}/properties` | Assign one property to the customer |
| GET | `/customers/{customerId}/properties` | List all assigned properties (optional pagination) |
| DELETE | `/customers/{customerId}/properties/{propertyId}` | Remove one assignment |

Full URL example: `POST {base}/api/v2/customers-hub/customers/10/properties`

---

## 3. POST — Assign one property

**Request**

- **URL:** `POST /api/v2/customers-hub/customers/{customerId}/properties`
- **Body (JSON):**

```json
{
  "propertyId": 42
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| propertyId | integer | Yes | `user_properties.id`; must belong to the tenant |

**Success (201)**

```json
{
  "status": "success",
  "data": {
    "customerId": 10,
    "propertyId": 42,
    "attachedAt": "2026-02-18T14:30:00.000000Z",
    "message": "Property assigned to customer successfully"
  }
}
```

**Duplicate (409)** — same property already assigned to this customer:

```json
{
  "status": "error",
  "message": "This property is already assigned to this customer."
}
```

**Not found (404)**

- Customer: `"message": "Customer not found."`
- Property: `"message": "Property not found or does not belong to your account."`

---

## 4. GET — List assigned properties

**Request**

- **URL:** `GET /api/v2/customers-hub/customers/{customerId}/properties`
- **Query (optional):**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 100 | Max 500. Number of items per page. |
| offset | integer | 0 | Offset for pagination. |

Example: `GET /api/v2/customers-hub/customers/10/properties?limit=50&offset=0`

**Success (200)** — no pagination (total ≤ limit):

```json
{
  "status": "success",
  "data": {
    "customerId": 10,
    "properties": [
      {
        "id": 1,
        "title": "Villa in Riyadh",
        "price": 1500000,
        "purpose": "sale",
        "type": "villa",
        "attachedAt": "2026-02-18T14:30:00.000000Z"
      },
      {
        "id": 5,
        "title": "Apartment Downtown",
        "price": 800000,
        "purpose": "sale",
        "type": "apartment",
        "attachedAt": "2026-02-17T09:00:00.000000Z"
      }
    ],
    "total": 2
  }
}
```

**Success (200)** — with pagination (when total > limit):

```json
{
  "status": "success",
  "data": {
    "customerId": 10,
    "properties": [ ... ],
    "total": 150,
    "pagination": {
      "total": 150,
      "limit": 50,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

**Not found (404):** `"message": "Customer not found."`

---

## 5. DELETE — Remove one assignment

**Request**

- **URL:** `DELETE /api/v2/customers-hub/customers/{customerId}/properties/{propertyId}`
- **Body:** None.

Example: `DELETE /api/v2/customers-hub/customers/10/properties/42`

**Success (200)**

```json
{
  "status": "success",
  "data": {
    "message": "Property unassigned from customer successfully.",
    "customerId": 10,
    "propertyId": 42
  }
}
```

**Not found (404)**

- Customer: `"message": "Customer not found."`
- Property: `"message": "Property not found or does not belong to your account."`
- Assignment already removed: `"message": "Assignment not found or already removed."`

---

## 6. Error response shape

All error responses use:

```json
{
  "status": "error",
  "message": "Human-readable message.",
  "errors": null
}
```

Use HTTP status and `message` for user-facing feedback.
