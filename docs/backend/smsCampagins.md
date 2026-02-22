# Communication API — Frontend Guide (V1)

**Audience:** Frontend (Next.js) and AI agents. Use this document to integrate with the Communication API (conversations, messages, WhatsApp, SMS, ops).

**Base path:** `/api/v1` (prefix with your API base URL, e.g. `process.env.NEXT_PUBLIC_API_URL`).

**Auth:** Required. Send `Authorization: Bearer {token}`. How the frontend obtains the token is out of scope.

**Content-Type:** `application/json` for request bodies.

---

## Response format (all endpoints)

- **Success:** `{ "status": "success", "code": 200, "message": "...", "data": { ... }, "timestamp": "..." }`
- **Error:** `{ "status": "error", "code": 4xx|5xx, "message": "...", "timestamp": "...", "errors": []? }`

Always check `status` and use `data` for payload on success.

---

## Quick reference

| Section | Prefix | Description |
|--------|--------|-------------|
| Credits | `/api/v1/credits/*` | Balance, packages, purchase (auth for balance/purchase; packages public) |
| Core | `/api/v1/conversations`, `/api/v1/messages` | Conversations (list, show), messages (list, send) |
| WhatsApp | `/api/v1/whatsapp/*` | Numbers, conversations, messages, templates, automation, AI config |
| SMS | `/api/v1/sms/*` | Campaigns, templates, single send, logs, stats |
| Ops | `/api/v1/communication/ops/*` | Health, reconciliation, delivery attempts, webhook events, stuck items |

---

## 1. Credits and balance

All credit endpoints use base path `/api/v1/credits`. **Balance** and **purchase** require auth (`Authorization: Bearer {token}`). **Packages** are public (no auth).

### 1.1 Get current balance

**Endpoint:** `GET /api/v1/credits/balance`  
**Auth:** Required.

**Response (success, 200):** `data` shape:

```json
{
  "user_id": 1,
  "current_balance": 450,
  "available_credits": 450,
  "used_credits": 0,
  "monthly_limit": null,
  "monthly_usage_percentage": null,
  "average_cost_per_credit": 0.5,
  "reset_date": null,
  "is_active": true
}
```

Use `current_balance` or `available_credits` for display and for checking if the user can send messages.

**Client example:**

```ts
export function useCredits() {
  return useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const res = await fetch('/api/v1/credits/balance', {
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
      return json.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });
}
```

### 1.2 Get available packages

**Endpoint:** `GET /api/v1/credits/packages`  
**Auth:** Not required (public).

**Query parameters:** `locale` (optional, e.g. `en` or `ar`) for localized `name` and `description`.

**Response (success, 200):** `data` is an array of packages with `id`, `name`, `description`, `credits`, `price`, `currency`, `discounted_price`, `savings_amount`, `savings_percentage`, `price_per_credit`, `is_popular`, `features`, `is_recommended`.

### 1.3 Purchase package

**Endpoint:** `POST /api/v1/credits/purchase`  
**Auth:** Required.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `package_id` | number | Yes | Credit package ID (from packages list). |
| `payment_method` | string | Yes | Payment gateway identifier (e.g. `stripe`, `myfatoorah`). |

**Response (success, 200):** Either:

- **Redirect required:** `data` includes `payment_status: "redirect_required"`, `redirect_url`, optional `payment_token`. User should be sent to `redirect_url` to complete payment.
- **Completed:** `data` includes `transaction_id`, `reference_number`, `credits_added`, `amount_paid`, `new_balance`, `payment_status: "completed"`.

---

## 2. Core — Conversations and messages

### 2.1 List conversations

**Endpoint:** `GET /api/v1/conversations`

Returns conversations for the authenticated tenant (tenant-scoped). Supports pagination and optional search.

**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `per_page` | number | No | Items per page (default 20, max 100). |
| `search` | string | No | Search in external party identifier or message content. |

**Response (success, 200):** `data` shape:

```json
{
  "conversations": [
    {
      "id": "uuid",
      "user_id": 1,
      "channel": "whatsapp",
      "external_party_identifier": "+966501234567",
      "last_message_at": "2024-01-20T15:30:00Z",
      "message_count": 42,
      "latest_message_preview": {
        "content": "Preview text...",
        "direction": "inbound",
        "created_at": "2024-01-20T15:30:00Z"
      },
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 50,
    "last_page": 3
  }
}
```

**Server example (Next.js):**

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function getConversations(token: string, params?: { per_page?: number; search?: string }) {
  const q = new URLSearchParams();
  if (params?.per_page) q.set('per_page', String(params.per_page));
  if (params?.search) q.set('search', params.search);
  const res = await fetch(`${API_BASE}/api/v1/conversations?${q}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message ?? 'Failed to fetch conversations');
  return json.data as { conversations: Conversation[]; pagination: Pagination };
}
```

**Client example (React Query):**

```ts
'use client';
import { useQuery } from '@tanstack/react-query';

async function fetchConversations(params?: { per_page?: number; search?: string }) {
  const q = new URLSearchParams(params as Record<string, string>);
  const res = await fetch(`/api/v1/conversations?${q}`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message);
  return json.data;
}

export function useConversations(params?: { per_page?: number; search?: string }) {
  return useQuery({
    queryKey: ['communication', 'conversations', params],
    queryFn: () => fetchConversations(params),
  });
}
```

---

### 2.2 Get one conversation

**Endpoint:** `GET /api/v1/conversations/{id}`

**Response (success, 200):** `data` is the conversation object (same fields as list items, with optional `latest_message_preview`). Returns 404 if not owned by tenant.

---

### 2.3 List messages for a conversation

**Endpoint:** `GET /api/v1/conversations/{id}/messages`

**Query parameters:** `per_page` (1–100, default 20).

**Response (success, 200):** `data` shape:

```json
{
  "messages": [
    {
      "id": "uuid",
      "direction": "outbound",
      "status": "delivered",
      "content": "Message text",
      "provider_message_id": "wamid.xxx",
      "meta": {},
      "created_at": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 42,
    "last_page": 3
  }
}
```

---

### 2.4 Send message

**Endpoint:** `POST /api/v1/messages/send`

**Headers:** `Idempotency-Key` is **required** (unique string per logical send attempt, e.g. UUID). Use `crypto.randomUUID()` or `uuidv4()`. Store key client-side for retry safety.

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `conversation_id` | number | Yes | Conversation ID (integer). |
| `content` | string | Yes | Message text. |
| `channel` | string | No | Channel, e.g. `whatsapp` (default). |

**Response (success, 200/201):** `data` contains the created message and related fields. Errors: 422 (validation, missing Idempotency-Key), 404 (conversation not found), 400 (e.g. insufficient credits), 409 (idempotency conflict), 502 (provider send failed).

**Server example:**

```ts
export async function sendMessage(
  token: string,
  payload: { conversation_id: number; content: string; channel?: string },
  idempotencyKey: string
) {
  const res = await fetch(`${API_BASE}/api/v1/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.message ?? 'Send failed');
  return json.data;
}
```

**Client example (mutation):**

```ts
const { mutateAsync: sendMessage } = useMutation({
  mutationFn: async (payload: { conversation_id: number; content: string; channel?: string }) => {
    const res = await fetch('/api/v1/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.status !== 'success') throw new Error(json.message);
    return json.data;
  },
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['communication', 'conversations'] }),
});
```

**Idempotency best practice:**

```ts
import { v4 as uuidv4 } from 'uuid';

// Generate once per send intent
const idempotencyKey = uuidv4();

// Store for potential retry
localStorage.setItem(`send-key-${conversationId}`, idempotencyKey);

// Send with key
await sendMessage({ conversation_id: 123, content: 'Hello' }, idempotencyKey);

// On success, clear
localStorage.removeItem(`send-key-${conversationId}`);
```

---

## 3. WhatsApp

Base path: `/api/v1/whatsapp`. All endpoints require auth and are tenant-scoped.

### 3.1 Numbers

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/whatsapp/numbers` | List numbers. Query: `per_page`, `status`. |
| GET | `/api/v1/whatsapp/numbers/{id}` | Get one number. |
| POST | `/api/v1/whatsapp/numbers` | Register number. Body: `provider` (meta\|evolution), `phone_number`, optional `phone_number_id`, `provider_account_id`, `name`, `status`, `quota_limit`, `meta`. |
| PUT | `/api/v1/whatsapp/numbers/{id}` | Update number. |

**Server example — list numbers:**

```ts
export async function getWhatsAppNumbers(token: string, params?: { per_page?: number; status?: string }) {
  const q = new URLSearchParams(params as Record<string, string>);
  const res = await fetch(`${API_BASE}/api/v1/whatsapp/numbers?${q}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.status !== 'success' && json.status !== true) throw new Error(json.message ?? 'Failed to fetch numbers');
  return (json.data ?? json) as { data?: unknown[]; pagination?: Pagination };
}
```

**Client example — list numbers (React Query):**

```ts
export function useWhatsAppNumbers(params?: { per_page?: number; status?: string }) {
  return useQuery({
    queryKey: ['whatsapp', 'numbers', params],
    queryFn: async () => {
      const q = new URLSearchParams(params as Record<string, string>);
      const res = await fetch(`/api/v1/whatsapp/numbers?${q}`, {
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (json.status !== 'success' && json.status !== true) throw new Error(json.message);
      return json.data ?? json;
    },
  });
}
```

### 3.2 WhatsApp conversations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/whatsapp/conversations` | List. Query: filters, pagination. |
| GET | `/api/v1/whatsapp/conversations/{id}` | Get one. |
| POST | `/api/v1/whatsapp/conversations` | Create or get (e.g. by contact). |
| PATCH | `/api/v1/whatsapp/conversations/{id}` | Update. |
| POST | `/api/v1/whatsapp/conversations/{id}/read` | Mark as read. |
| POST | `/api/v1/whatsapp/conversations/{id}/star` | Toggle star. |

### 3.3 WhatsApp messages

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/whatsapp/conversations/{id}/messages` | List messages. |
| POST | `/api/v1/whatsapp/conversations/{id}/messages` | Send text/media. |
| POST | `/api/v1/whatsapp/conversations/{id}/messages/template` | Send template message. |

### 3.4 WhatsApp templates

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/whatsapp/templates` | List. |
| GET | `/api/v1/whatsapp/templates/{id}` | Get one. |
| POST | `/api/v1/whatsapp/templates` | Create. |
| PUT | `/api/v1/whatsapp/templates/{id}` | Update. |
| DELETE | `/api/v1/whatsapp/templates/{id}` | Delete. |

### 3.5 WhatsApp automation rules

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/whatsapp/automation/rules` | List. Query: `is_active`, `trigger`. |
| GET | `/api/v1/whatsapp/automation/rules/{id}` | Get one. |
| POST | `/api/v1/whatsapp/automation/rules` | Create (trigger: e.g. new_inquiry, no_response_24h/48h/72h, follow_up, appointment_reminder, property_match, price_change). |
| PUT | `/api/v1/whatsapp/automation/rules/{id}` | Update. |
| PATCH | `/api/v1/whatsapp/automation/rules/{id}/toggle` | Enable/disable. |
| DELETE | `/api/v1/whatsapp/automation/rules/{id}` | Delete. |
| GET | `/api/v1/whatsapp/automation/stats` | Aggregated stats. |

### 3.6 WhatsApp AI config

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/whatsapp/ai/config/{numberId}` | Get AI config for a number. |
| PUT | `/api/v1/whatsapp/ai/config/{numberId}` | Create/update (enabled, business hours, timezone, scenarios, tone, language, custom_instructions, fallback). |
| PATCH | `/api/v1/whatsapp/ai/config/{numberId}/toggle` | Toggle AI on/off. |
| GET | `/api/v1/whatsapp/ai/stats` | AI usage/stats for tenant. |

---

## 4. SMS

Base path: `/api/v1/sms`. All endpoints require auth and are tenant-scoped.

### 4.1 Campaigns

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/sms/campaigns` | List (paginated). |
| GET | `/api/v1/sms/campaigns/{id}` | Get one. |
| POST | `/api/v1/sms/campaigns` | Create. |
| PATCH | `/api/v1/sms/campaigns/{id}` | Update. |
| DELETE | `/api/v1/sms/campaigns/{id}` | Delete. |
| POST | `/api/v1/sms/campaigns/{id}/send` | Trigger send (now or scheduled). |

### 4.2 Templates

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/sms/templates` | List. |
| GET | `/api/v1/sms/templates/{id}` | Get one. |
| POST | `/api/v1/sms/templates` | Create. |
| PATCH | `/api/v1/sms/templates/{id}` | Update. |
| DELETE | `/api/v1/sms/templates/{id}` | Delete. |

### 4.3 Single message and logs/stats

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/sms/messages/send` | Send single SMS (Idempotency-Key when applicable). |
| GET | `/api/v1/sms/logs` | List SMS message logs (paginated). |
| GET | `/api/v1/sms/stats` | SMS stats for tenant. |

---

## 5. Communication ops (reliability)

Base path: `/api/v1/communication/ops`. All GET, auth required, tenant-scoped. Behavior depends on `communication.reliability.enabled`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/communication/ops/health` | 24h metrics: attempts_total, attempts_failed, failure_ratio, due_retry_backlog. |
| GET | `/api/v1/communication/ops/reconciliation-summary` | Reconciliation state summary. |
| GET | `/api/v1/communication/ops/delivery-attempts` | List delivery attempts (pagination, filters). |
| GET | `/api/v1/communication/ops/webhook-events` | List webhook events (journal). |
| GET | `/api/v1/communication/ops/stuck-items` | Items stuck in retry or unresolved. |

**Server example — health:**

```ts
export async function getCommunicationHealth(token: string) {
  const res = await fetch(`${API_BASE}/api/v1/communication/ops/health`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.status !== 'success' && json.status !== true) throw new Error(json.message);
  return json.data ?? json;
}
```

**Client example (React Query):**

```ts
export function useCommunicationHealth() {
  return useQuery({
    queryKey: ['communication', 'ops', 'health'],
    queryFn: async () => {
      const res = await fetch('/api/v1/communication/ops/health', {
        headers: { Accept: 'application/json' },
        credentials: 'include',
      });
      const json = await res.json();
      if (json.status !== 'success' && json.status !== true) throw new Error(json.message);
      return json.data ?? json;
    },
  });
}
```

---

## 6. Complete component examples

### 6.1 Chat component with credit check

```tsx
'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';

export default function Chat({ conversationId }: { conversationId: number }) {
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const res = await fetch(`/api/v1/conversations/${conversationId}/messages`);
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
      return json.data;
    },
    refetchInterval: 5000, // Poll every 5s for new messages
  });

  // Check credits
  const { data: credits } = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const res = await fetch('/api/v1/credits/balance');
      const json = await res.json();
      return json.data;
    },
  });

  // Send message
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/v1/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': uuidv4(),
        },
        credentials: 'include',
        body: JSON.stringify({ conversation_id: conversationId, content, channel: 'whatsapp' }),
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      setMessage('');
    },
  });

  const canSend = (credits?.current_balance ?? 0) >= 2; // WhatsApp = 2 credits

  return (
    <div>
      <div className="messages">
        {messages?.messages.map((msg: any) => (
          <div key={msg.id} className={msg.direction}>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); sendMessage.mutate(message); }}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} disabled={!canSend} />
        <button type="submit" disabled={!canSend || sendMessage.isPending}>
          {canSend ? 'Send' : `Low credits (${credits?.current_balance ?? 0})`}
        </button>
      </form>
    </div>
  );
}
```

### 6.2 Credit balance widget

```tsx
export function CreditBalance() {
  const { data } = useQuery({
    queryKey: ['credits'],
    queryFn: async () => {
      const res = await fetch('/api/v1/credits/balance');
      const json = await res.json();
      return json.data;
    },
    refetchInterval: 60000,
  });

  const balance = data?.current_balance ?? 0;
  const isLow = balance < 50;

  return (
    <div className={isLow ? 'credit-low' : 'credit-ok'}>
      <span>Credits: {balance}</span>
      {isLow && <a href="/packages">Buy More</a>}
    </div>
  );
}
```

---

## 7. Best practices

### 7.1 Always use idempotency for charged operations

```ts
// ✅ Good: Generate unique key per send
const key = uuidv4();
await sendMessage({ ... }, key);

// ❌ Bad: No idempotency key
await sendMessage({ ... }); // May charge twice on retry
```

### 7.2 Check credits before sending

```ts
const { data: credits } = useCredits();
const canSend = credits?.current_balance >= 2; // WhatsApp cost

if (!canSend) {
  toast.error('Insufficient credits');
  router.push('/packages');
  return;
}
```

### 7.3 Poll for updates (or use WebSockets)

```ts
// Poll conversations every 5s
useQuery({
  queryKey: ['messages', conversationId],
  queryFn: fetchMessages,
  refetchInterval: 5000,
  refetchIntervalInBackground: true,
});
```

### 7.4 Handle errors gracefully

```ts
try {
  await sendMessage.mutateAsync({ ... });
} catch (error: any) {
  if (error.message.includes('INSUFFICIENT_CREDITS')) {
    router.push('/packages');
  } else if (error.message.includes('KEY_HASH_MISMATCH')) {
    toast.error('Duplicate request detected');
  } else {
    toast.error('Failed to send message');
  }
}
```

### 7.5 Optimistic updates for better UX

```ts
const sendMessage = useMutation({
  mutationFn: sendMessageApi,
  onMutate: async (newMessage) => {
    await queryClient.cancelQueries({ queryKey: ['messages'] });
    const previous = queryClient.getQueryData(['messages']);
    queryClient.setQueryData(['messages'], (old: any) => ({
      ...old,
      messages: [newMessage, ...old.messages]
    }));
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['messages'], context?.previous);
  },
});
```

---

## 8. Error handling

- **200/201:** Success; use `data` for payload.
- **207:** Partial success (if applicable); check `data` for success/failed counts and per-ID failures.
- **400:** Bad request (e.g. insufficient credits).
- **401/403:** Unauthorized or forbidden.
- **404:** Resource not found (e.g. conversation, number, template).
- **409:** Conflict (e.g. idempotency key already used).
- **422:** Validation failed; optional `errors` array with field details.
- **502:** Provider send failed.

Error body: `{ "status": "error", "code": number, "message": "...", "timestamp": "...", "errors": []? }`. Use `message` (and `errors` when present) for UI feedback.

---

## 9. Related docs

- **General API frontend:** [BUILDING_API_FRONTEND.md](../BUILDING_API_FRONTEND.md) in `docs/` for overall API integration guidance.
- Backend route definitions live in `routes/api.php` (prefix `v1` for conversations, messages, credits, whatsapp, sms, communication/ops).
