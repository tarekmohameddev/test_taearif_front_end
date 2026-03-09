# Email Campaign Send — AI-Agent Workflow

**Purpose:** This document describes the exact workflow for sending an email campaign to selected customers (or manual email addresses) so an AI agent can perform it reliably. All endpoints require authentication: `Authorization: Bearer {token}`. Base URL: `/api/v1` or `/api/v2` as indicated.

**Related:** [communication-GUIDE-Frontend.md](../communication-GUIDE-Frontend.md) (full API reference).

---

## 1. Prerequisites

| Check | How |
|-------|-----|
| User is authenticated | Token must be for a tenant user (Sanctum). |
| Campaign exists and is sendable | Status must be `draft` or `scheduled`. Get campaign id from `GET /api/v1/email/campaigns` or from user input. |
| Recipients are chosen | Either **customer_ids** (from customers list) and/or **manual_emails** (array of valid email strings). At least one must have at least one value. |
| Idempotency key | Generate once per logical "send" (e.g. UUID). Reuse the same key for retries of the same request. |

---

## 2. Workflow Summary

1. **Get customers list** (optional) — `POST /api/v2/customers-hub/list` to obtain customer `id` and `email` for selection.
2. **Resolve recipients** — Build `customer_ids` (array of integer ids) and/or `manual_emails` (array of valid email strings).
3. **Send campaign** — `POST /api/v1/email/campaigns/{campaign_id}/send` with header `Idempotency-Key` and body containing at least one of `customer_ids`, `manual_emails`.
4. **Handle response** — 202 = success; 4xx = handle as below.

---

## 3. Step 1 — Get Customers List (for recipient selection)

**When:** Use when the user or agent needs to pick recipients from the tenant's customer list. If the user only provides manual email addresses, skip to Step 4.

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

**Success response (200):** Same shape as in [sms-campaign-send-workflow-AI.md](../sms/sms-campaign-send-workflow-AI.md). Use `data.customers[].id` for `customer_ids`; backend resolves to email for email campaigns.

---

## 4. Step 2 — Build Send Payload

**Rules:**

- At least **one** of `customer_ids` or `manual_emails` must be present.
- Each array that is present must have **at least one** value.
- **customer_ids:** array of integers; each id must be from the tenant's customers. Backend resolves to email; invalid or missing emails are dropped.
- **manual_emails:** array of strings; each must be a valid email address (backend validates).

**Valid payload examples:**

```json
{ "customer_ids": [1, 5, 12] }
```

```json
{ "manual_emails": ["user@example.com", "other@domain.com"] }
```

```json
{
  "customer_ids": [1, 5],
  "manual_emails": ["extra@example.com"]
}
```

**Invalid (will return 422):**

- `{}` — no recipients
- `{ "customer_ids": [], "manual_emails": [] }` — both empty
- Invalid email format in `manual_emails`

---

## 5. Step 3 — Send Campaign

**Endpoint:** `POST /api/v1/email/campaigns/{campaign_id}/send`  
**Auth:** Required.  
**Content-Type:** `application/json`  
**Required header:** `Idempotency-Key: <unique-string>` (e.g. UUID). Use the same key when retrying the **exact same** request.

**Request body:** The payload from Step 2, e.g.:

```json
{
  "customer_ids": [1, 5, 12],
  "manual_emails": []
}
```

Omit `manual_emails` if not used, or omit `customer_ids` if sending only to manual addresses.

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

---

## 6. Error Handling

| HTTP | Condition | Response body | Agent action |
|------|-----------|---------------|--------------|
| **400** | Insufficient credits | `code: "INSUFFICIENT_CREDITS"`, `message` | Tell user to purchase credits; do not retry send. |
| **404** | Campaign not found | `code: "CAMPAIGN_NOT_FOUND"` | Confirm campaign id (e.g. from `GET /api/v1/email/campaigns`); ask user to choose a valid campaign. |
| **409** | Idempotency conflict | `code` e.g. hash mismatch or IN_PROGRESS | Same Idempotency-Key was used with a **different** body. Generate a **new** key for this new payload, or use the same body if retrying. |
| **422** | Validation | `message` and optional `errors` | Missing recipients: ensure at least one of `customer_ids` or `manual_emails` has at least one value. No valid emails: ensure customer ids exist with valid email and manual_emails are valid. Show `message` to user. |

**Typical 422 messages:**

- *"At least one of customer_ids or manual_emails must be provided with at least one value."* → Add non-empty `customer_ids` and/or `manual_emails`.
- *"No valid email addresses from the given customer_ids or manual_emails."* → Fix or remove invalid ids/emails.

---

## 7. Pause and Resume

**Pause:** `POST /api/v1/email/campaigns/{id}/pause` — no body. Only in-progress or scheduled campaigns. Returns 200 with `data` (campaign_id, status, sent_count, paused_count, credit_info).

**Resume:** `POST /api/v1/email/campaigns/{id}/resume` — **Idempotency-Key** required. Body: `{ "mode": "continue" }` or `{ "mode": "restart", "customer_ids": [...], "manual_emails": [...] }`. Returns 202 with `data` (campaign_id, status, mode, recipient_count, credit_info).

---

## 8. Idempotency

- **One key per "send" intent:** Generate a new Idempotency-Key for each distinct send (e.g. new campaign or new recipient set).
- **Retries:** For the **same** request (same key + same body), you may retry; the server returns **202** with the same `data` and does **not** double-charge.
- **Different payload:** If you change `customer_ids` or `manual_emails` and reuse the same key, the server returns **409**. Use a **new** key for the new payload.

---

## 9. Flow (High Level)

```
1. Optional: POST /api/v2/customers-hub/list → get customers[].id, customers[].email
2. Build body: { customer_ids: [...], manual_emails?: [...] }  (at least one non-empty)
3. POST /api/v1/email/campaigns/{id}/send
   - Header: Idempotency-Key: <uuid>
   - Body: from step 2
4. If 202 → success (use data.campaign_id, data.recipient_count)
   If 4xx → see Error Handling table above
```

---

## 10. Quick Reference

| What | Value |
|------|--------|
| List campaigns | `GET /api/v1/email/campaigns` — use `data[].id` for send |
| List customers | `POST /api/v2/customers-hub/list` — body: `{ "action": "list", "filters": {}, "pagination": { "page": 1, "limit": 100 } }` |
| Customer id for send | From `data.customers[].id` (integer) |
| Send campaign | `POST /api/v1/email/campaigns/{campaign_id}/send` — header: `Idempotency-Key`; body: `customer_ids` and/or `manual_emails` |
| Email format | Valid email strings; backend normalizes and validates. |

This workflow is **email only**. For SMS or WhatsApp campaign send, see [sms-campaign-send-workflow-AI.md](../sms/sms-campaign-send-workflow-AI.md) or [wa-campaign-send-workflow-AI.md](../whatsapp/wa-campaign-send-workflow-AI.md).
