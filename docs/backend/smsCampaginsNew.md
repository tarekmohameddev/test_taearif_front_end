# SMS Campaign Send — AI-Agent Workflow

**Purpose:** This document describes the exact workflow for sending an SMS campaign to selected customers (or manual phone numbers) so an AI agent can perform it reliably. All endpoints require authentication: `Authorization: Bearer {token}`. Base URL: `/api/v1` or `/api/v2` as indicated.

**Related:** [communication-GUIDE-Frontend.md](./communication-GUIDE-Frontend.md) (full API reference).

---

## 1. Prerequisites

| Check | How |
|-------|-----|
| User is authenticated | Token must be for a tenant user (Sanctum). |
| Campaign exists and is sendable | Status must be `draft` or `scheduled`. Get campaign id from `GET /api/v1/sms/campaigns` or from user input. |
| Recipients are chosen | Either **customer_ids** (from customers list) and/or **manual_phones** (array of phone strings). At least one must have at least one value. |
| Idempotency key | Generate once per logical “send” (e.g. UUID). Reuse the same key for retries of the same request. |

---

## 2. Workflow Summary

1. **Get customers list** (optional) — `POST /api/v2/customers-hub/list` to obtain customer `id` and `phone` for selection.
2. **Resolve recipients** — Build `customer_ids` (array of integer ids) and/or `manual_phones` (array of strings, 8–16 digits).
3. **Send campaign** — `POST /api/v1/sms/campaigns/{campaign_id}/send` with header `Idempotency-Key` and body containing at least one of `customer_ids`, `manual_phones`.
4. **Handle response** — 202 = success; 4xx = handle as below.

---

## 3. Step 1 — Get Customers List (for recipient selection)

**When:** Use this when the user or agent needs to pick recipients from the tenant’s customer list. If the user only provides manual phone numbers, skip to Step 3.

**Endpoint:** `POST /api/v2/customers-hub/list`  
**Auth:** Required.  
**Content-Type:** `application/json`

**Request body (minimal):**

```json
{
  "action": "list",
  "filters": {},
  "pagination": { "page": 1, "limit": 100 }
}
```

**Optional filters (examples):** `filters` can include `search`, `stage`, `priority`, `type`, `source`, `assignedEmployeeId`, `city`, `createdFrom`, `createdTo`, `sort_by`, `sort_dir`. Omit or use `{}` for no filter.

**Success response (200):**

```json
{
  "status": "success",
  "data": {
    "customers": [
      {
        "id": 1,
        "name": "Customer Name",
        "phone": "+966501234567",
        "email": "customer@example.com",
        "stage": { "id": "...", "name": "...", ... },
        "priority": { "id": 1, "name": "...", ... },
        "type": { "id": 1, "name": "...", ... },
        "assignedTo": { "id": 5, "name": "...", ... },
        "createdAt": "2024-01-15T10:00:00+00:00",
        "updatedAt": "2024-01-20T15:30:00+00:00"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 50,
      "totalPages": 1,
      "hasMore": false
    }
  }
}
```

**Fields used for send:**

- **`id`** (integer) — Use in `customer_ids` when calling campaign send.
- **`phone`** (string) — For display or validation; backend resolves phone from customer record when you send `customer_ids`.

**Pagination:** To fetch more customers, increment `page` (e.g. `page: 2`) until `hasMore` is false or you have enough ids.

---

## 4. Step 2 — Build Send Payload

**Rules:**

- At least **one** of `customer_ids` or `manual_phones` must be present.
- Each array that is present must have **at least one** value.
- **customer_ids:** array of integers; each id must be from the tenant’s customers (e.g. from Step 1). Backend resolves to phone; invalid or missing phones are dropped.
- **manual_phones:** array of strings; each must be a valid phone (8–16 digits after normalization). Example: `["+966501234567", "966501234568"]`.

**Valid payload examples:**

```json
{ "customer_ids": [1, 5, 12] }
```

```json
{ "manual_phones": ["+966501234567", "966509999999"] }
```

```json
{
  "customer_ids": [1, 5],
  "manual_phones": ["+966509999999"]
}
```

**Invalid (will return 422):**

- `{}` — no recipients
- `{ "customer_ids": [], "manual_phones": [] }` — both empty
- `{ "customer_ids": [999999] }` — if id does not exist or has no valid phone (may still 422 after backend validation)

---

## 5. Step 3 — Send Campaign

**Endpoint:** `POST /api/v1/sms/campaigns/{campaign_id}/send`  
**Auth:** Required.  
**Content-Type:** `application/json`  
**Required header:** `Idempotency-Key: <unique-string>` (e.g. UUID). Use the same key when retrying the **exact same** request.

**Request body:** The payload built in Step 2, e.g.:

```json
{
  "customer_ids": [1, 5, 12],
  "manual_phones": []
}
```

Omit `manual_phones` if not used, or omit `customer_ids` if sending only to manual numbers.

**Success response (202):**

```json
{
  "status": true,
  "data": {
    "campaign_id": 42,
    "status": "in_progress",
    "recipient_count": 3,
    "dispatch_reference": "uuid-or-reference",
    "queued_at": "2024-01-20T15:30:00.000000Z",
    "scheduled_at": null
  }
}
```

**Note:** The response does **not** echo back `customer_ids` or `manual_phones`. Use `recipient_count` and `dispatch_reference` for confirmation.

---

## 6. Error Handling

| HTTP | Condition | Response body | Agent action |
|------|-----------|---------------|--------------|
| **400** | Insufficient credits | `code: "INSUFFICIENT_CREDITS"`, `message` | Tell user to purchase credits; do not retry send. |
| **404** | Campaign not found | `code: "CAMPAIGN_NOT_FOUND"` | Confirm campaign id (e.g. from `GET /api/v1/sms/campaigns`); ask user to choose a valid campaign. |
| **409** | Idempotency conflict | `code: "KEY_HASH_MISMATCH"` or similar | Same Idempotency-Key was used with a **different** body. Generate a **new** key for this new payload, or use the same body if retrying. |
| **422** | Validation | `message` and optional `errors` | Missing recipients: ensure at least one of `customer_ids` or `manual_phones` has at least one value. Invalid phones: ensure customer ids exist with valid phone (8–16 digits) and manual_phones are 8–16 digits. Show `message` to user. |

**Typical 422 messages:**

- *"At least one of customer_ids or manual_phones must be provided with at least one value."* → Add non-empty `customer_ids` and/or `manual_phones`.
- *"No valid phone numbers from the given customer_ids or manual_phones. Ensure customer IDs exist and have a valid phone (8–16 digits), and that manual_phones are valid (8–16 digits)."* → Fix or remove invalid ids/phones.

---

## 7. Idempotency

- **One key per “send” intent:** Generate a new Idempotency-Key for each distinct send (e.g. new campaign or new recipient set).
- **Retries:** For the **same** request (same key + same body), you may retry; the server returns **202** with the same `data` and does **not** double-charge.
- **Different payload:** If you change `customer_ids` or `manual_phones` and reuse the same key, the server returns **409**. Use a **new** key for the new payload.

---

## 8. Flow (High Level)

```
1. Optional: POST /api/v2/customers-hub/list → get customers[].id, customers[].phone
2. Build body: { customer_ids: [...], manual_phones?: [...] }  (at least one non-empty)
3. POST /api/v1/sms/campaigns/{id}/send
   - Header: Idempotency-Key: <uuid>
   - Body: from step 2
4. If 202 → success (use data.campaign_id, data.recipient_count)
   If 4xx → see Error Handling table above
```

---

## 9. Quick Reference

| What | Value |
|------|--------|
| List customers | `POST /api/v2/customers-hub/list` — body: `{ "action": "list", "filters": {}, "pagination": { "page": 1, "limit": 100 } }` |
| Customer id for send | From `data.customers[].id` (integer) |
| Send campaign | `POST /api/v1/sms/campaigns/{campaign_id}/send` — header: `Idempotency-Key`; body: `customer_ids` and/or `manual_phones` |
| Phone format | 8–16 digits (with or without + prefix); backend normalizes. |

This workflow is **SMS only**. WhatsApp campaign send is not part of this flow.