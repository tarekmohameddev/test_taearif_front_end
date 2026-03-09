# WhatsApp Campaign Send — AI-Agent Workflow

**Purpose:** This document describes the exact workflow for sending a WhatsApp campaign to selected customers (or manual phone numbers) so an AI agent can perform it reliably. All endpoints require authentication: `Authorization: Bearer {token}`. Base URL: `/api/v1` or `/api/v2` as indicated.

**Related:** [communication-GUIDE-Frontend.md](../communication-GUIDE-Frontend.md) (full API reference).

---

## 1. Prerequisites

| Check | How |
|-------|-----|
| User is authenticated | Token must be for a tenant user (Sanctum). |
| WhatsApp number exists and is usable | Get `wa_number_id` from `GET /api/v1/whatsapp/numbers`. Number must be owned by tenant; if `require_active_wa_number` is true (default), number must be **active**. |
| Campaign exists and is sendable | Status must be `draft` or `scheduled`. Get campaign id from `GET /api/v1/whatsapp/campaigns` or from user input. Campaign must have exactly one of **message** or **template_id** (content contract). |
| Recipients are chosen | Either **customer_ids** (from customers list) and/or **manual_phones** (array of phone strings). At least one must have at least one value. |
| Idempotency key | Generate once per logical "send" (e.g. UUID). Reuse the same key for retries of the same request. |

---

## 2. Workflow Summary

1. **Get WhatsApp numbers** (optional) — `GET /api/v1/whatsapp/numbers` to choose `wa_number_id` for campaign create.
2. **Get customers list** (optional) — `POST /api/v2/customers-hub/list` to obtain customer `id` and `phone` for recipient selection.
3. **Create campaign** (if needed) — `POST /api/v1/whatsapp/campaigns` with `wa_number_id`, `name`, and exactly one of `message` or `template_id`; optional `meta.variables` for template.
4. **Resolve recipients** — Build `customer_ids` (array of integer ids) and/or `manual_phones` (array of strings, 8–16 digits).
5. **Send campaign** — `POST /api/v1/whatsapp/campaigns/{campaign_id}/send` with header `Idempotency-Key` and body containing at least one of `customer_ids`, `manual_phones`.
6. **Handle response** — 202 = success; 4xx = handle as below.

---

## 3. Step 1 — Get WhatsApp Numbers (for campaign create)

**When:** Required when creating a new campaign. The campaign must have a valid `wa_number_id` owned by the tenant.

**Endpoint:** `GET /api/v1/whatsapp/numbers`  
**Auth:** Required.  
**Query:** Optional `per_page`, `status` (e.g. `active`).

**Success response (200):** `data` contains a list of numbers; each has `id`, `phone_number`, `name`, `status`, `provider`, etc. Use `id` as `wa_number_id` when creating a campaign.

---

## 4. Step 2 — Get Customers List (for recipient selection)

**When:** Use when the user or agent needs to pick recipients from the tenant's customer list. If the user only provides manual phone numbers, skip to Step 5.

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

**Success response (200):** Same shape as in [sms-campaign-send-workflow-AI.md](../sms/sms-campaign-send-workflow-AI.md). Use `data.customers[].id` for `customer_ids`; backend resolves to phone for WhatsApp.

---

## 5. Step 3 — Create Campaign (if needed)

**When:** Use when the user wants to create a new WhatsApp campaign. If the campaign already exists (e.g. from `GET /api/v1/whatsapp/campaigns`), skip to Step 6.

**Endpoint:** `POST /api/v1/whatsapp/campaigns`  
**Auth:** Required.  
**Content-Type:** `application/json`

**Request body (content contract — exactly one of message or template_id):**

**Option A — Plain message:**

```json
{
  "wa_number_id": 1,
  "name": "My WhatsApp campaign",
  "message": "Hello, this is a broadcast message.",
  "description": "Optional description",
  "status": "draft"
}
```

**Option B — Template:**

```json
{
  "wa_number_id": 1,
  "name": "Template campaign",
  "template_id": 5,
  "meta": { "variables": { "name": "Customer", "offer": "20% off" } },
  "status": "draft"
}
```

**Invalid (422):** Both `message` and `template_id` set → `WA_CAMPAIGN_CONTENT_CONFLICT`. Neither set → `WA_CAMPAIGN_CONTENT_REQUIRED`. Invalid or not-owned `wa_number_id` → 404 `WA_NUMBER_NOT_FOUND`. Inactive number when config requires active → 422 `WA_NUMBER_NOT_ACTIVE`.

**Success response (201):** `data` includes the created campaign with `id`. Use this `id` for send.

---

## 6. Step 4 — Build Send Payload

**Rules:**

- At least **one** of `customer_ids` or `manual_phones` must be present.
- Each array that is present must have **at least one** value.
- **customer_ids:** array of integers; each id must be from the tenant's customers. Backend resolves to phone; invalid or missing phones are dropped.
- **manual_phones:** array of strings; each must be a valid phone (8–16 digits after normalization). Example: `["+966501234567", "966501234568"]`.

**Valid payload examples:** Same as SMS — see [sms-campaign-send-workflow-AI.md](../sms/sms-campaign-send-workflow-AI.md) Step 2.

---

## 7. Step 5 — Send Campaign

**Endpoint:** `POST /api/v1/whatsapp/campaigns/{campaign_id}/send`  
**Auth:** Required.  
**Content-Type:** `application/json`  
**Required header:** `Idempotency-Key: <unique-string>` (e.g. UUID). Use the same key when retrying the **exact same** request.

**Request body:** The payload from Step 4, e.g.:

```json
{
  "customer_ids": [1, 5, 12],
  "manual_phones": []
}
```

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

## 8. Error Handling

| HTTP | Condition | Response body | Agent action |
|------|-----------|---------------|--------------|
| **400** | Insufficient credits | `code: "INSUFFICIENT_CREDITS"`, `message` | Tell user to purchase credits; do not retry send. |
| **404** | Campaign not found | `code: "CAMPAIGN_NOT_FOUND"` | Confirm campaign id (e.g. from `GET /api/v1/whatsapp/campaigns`). |
| **404** | WhatsApp number not found / not owned | `code: "WA_NUMBER_NOT_FOUND"` | Confirm `wa_number_id` from `GET /api/v1/whatsapp/numbers`. |
| **409** | Idempotency conflict | `code` e.g. `IN_PROGRESS` or hash mismatch | Same key was used with different body or campaign already in progress. Use new key for new payload. |
| **422** | Validation / content / sender policy | `code`, `message` | Missing recipients: ensure at least one of `customer_ids` or `manual_phones` has at least one value. `WA_NUMBER_NOT_ACTIVE`: number is inactive and config requires active — choose another number or contact admin. `WA_CAMPAIGN_CONTENT_REQUIRED` / `WA_CAMPAIGN_CONTENT_CONFLICT`: fix campaign content (exactly one of message or template_id). Show `message` to user. |

---

## 9. Pause and Resume

**Pause:** `POST /api/v1/whatsapp/campaigns/{id}/pause` — no body. Only in-progress or scheduled campaigns. Returns 200 with `data` (campaign_id, status, sent_count, paused_count, credit_info).

**Resume:** `POST /api/v1/whatsapp/campaigns/{id}/resume` — **Idempotency-Key** required. Body: `{ "mode": "continue" }` or `{ "mode": "restart", "customer_ids": [...], "manual_phones": [...] }`. Returns 202 with `data` (campaign_id, status, mode, recipient_count, credit_info).

---

## 10. Idempotency

- **One key per "send" intent:** Generate a new Idempotency-Key for each distinct send (e.g. new campaign or new recipient set).
- **Retries:** For the **same** request (same key + same body), you may retry; the server returns **202** with the same `data` and does **not** double-charge.
- **Different payload:** If you change `customer_ids` or `manual_phones` and reuse the same key, the server may return **409**. Use a **new** key for the new payload.

---

## 11. Flow (High Level)

```
1. Optional: GET /api/v1/whatsapp/numbers → choose wa_number_id
2. Optional: POST /api/v1/whatsapp/campaigns → create (wa_number_id, message XOR template_id)
3. Optional: POST /api/v2/customers-hub/list → get customers[].id
4. Build body: { customer_ids: [...], manual_phones?: [...] }  (at least one non-empty)
5. POST /api/v1/whatsapp/campaigns/{id}/send
   - Header: Idempotency-Key: <uuid>
   - Body: from step 4
6. If 202 → success (use data.campaign_id, data.recipient_count)
   If 4xx → see Error Handling table above
```

---

## 12. Quick Reference

| What | Value |
|------|--------|
| List WhatsApp numbers | `GET /api/v1/whatsapp/numbers` — use `data[].id` as `wa_number_id` |
| List campaigns | `GET /api/v1/whatsapp/campaigns` — use `data[].id` for send |
| Create campaign | `POST /api/v1/whatsapp/campaigns` — body: `wa_number_id`, `name`, **message** XOR **template_id** |
| List customers | `POST /api/v2/customers-hub/list` — body: `{ "action": "list", "filters": {}, "pagination": { "page": 1, "limit": 100 } }` |
| Send campaign | `POST /api/v1/whatsapp/campaigns/{campaign_id}/send` — header: `Idempotency-Key`; body: `customer_ids` and/or `manual_phones` |
| Phone format | 8–16 digits (with or without + prefix); backend normalizes. |

This workflow is **WhatsApp campaign only**. For SMS campaign send, see [sms-campaign-send-workflow-AI.md](../sms/sms-campaign-send-workflow-AI.md). For email, see [email-campaign-send-workflow-AI.md](../email/email-campaign-send-workflow-AI.md).
