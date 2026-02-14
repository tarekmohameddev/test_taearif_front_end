# Bulk Actions – Customers Hub Requests (Frontend)

API v2 frontend doc for **bulk actions** on Customers Hub requests. Use the unified bulk endpoint instead of multiple single-action requests.

**Base URL:** `/api/v2/customers-hub/requests`  
**Authentication:** Bearer Token (Laravel Sanctum)  
**Content-Type:** `application/json`

**Unified endpoint:** `POST /api/v2/customers-hub/requests/bulk` (implemented). Legacy `POST .../bulk-complete` and `POST .../bulk-dismiss` remain available.

---

## Why use the bulk endpoint?

- One HTTP request for many actions (1–1000 IDs).
- Faster and less load than N single requests.
- Response includes success/failed counts and per-ID failure reasons (207 partial success).

---

## Request

**Method:** `POST`  
**URL:** `/api/v2/customers-hub/requests/bulk`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
Accept: application/json
```

**Body:**
```json
{
  "action": "complete | dismiss | snooze | assign | change_priority",
  "actionIds": ["inquiry_1", "reminder_2", "request_appointment_3", "request_reminder_4", ...],
  "data": { }
}
```

- `action` (required): one of `complete`, `dismiss`, `snooze`, `assign`, `change_priority`.
- `actionIds` (required): array of 1–1000 action IDs (e.g. `inquiry_123`, `reminder_456`, `request_appointment_789`, `request_reminder_101`).
- `data` (required): object with fields below per action.

### Data by action

| Action           | Required in `data`     | Optional in `data` |
|------------------|------------------------|---------------------|
| `complete`       | `completedBy` (user id)| `notes`             |
| `dismiss`        | `dismissedBy` (user id)| `reason`            |
| `snooze`         | `snoozedUntil` (ISO date), `snoozedBy` (user id) | `reason` |
| `assign`         | `assignedTo`, `assignedBy` (user ids) | — |
| `change_priority`| `priority`, `changedBy` (user id)     | — |

`priority`: `"urgent" | "high" | "medium" | "low"`.

**Example – bulk complete:**
```json
{
  "action": "complete",
  "actionIds": ["inquiry_1", "reminder_2"],
  "data": {
    "notes": "تم إكمال جميع الإجراءات المحددة",
    "completedBy": 123
  }
}
```

**Example – bulk snooze:**
```json
{
  "action": "snooze",
  "actionIds": ["reminder_1", "request_appointment_2", "request_reminder_3"],
  "data": {
    "snoozedUntil": "2024-01-25T10:00:00Z",
    "reason": "انتظار رد العميل",
    "snoozedBy": 123
  }
}
```

---

## Response

**Success (200):**
```json
{
  "status": "success",
  "code": 200,
  "message": "تم إكمال 3 إجراءات بنجاح",
  "data": {
    "action": "complete",
    "updatedCount": 3,
    "successCount": 3,
    "failedCount": 0,
    "actionIds": ["inquiry_1", "inquiry_2", "inquiry_3"],
    "failedActionIds": [],
    "completedAt": "2024-01-20T10:30:00Z",
    "completedBy": { "id": 123, "name": "أحمد محمد" }
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Partial success (207):**
```json
{
  "status": "partial_success",
  "code": 207,
  "message": "تم تحديث 2 من 3 إجراءات",
  "data": {
    "action": "complete",
    "updatedCount": 2,
    "successCount": 2,
    "failedCount": 1,
    "actionIds": ["inquiry_1", "inquiry_2"],
    "failedActionIds": ["inquiry_999"],
    "failures": [
      { "actionId": "inquiry_999", "reason": "ACTION_NOT_FOUND_OR_INVALID_STATE" }
    ]
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Error (4xx/5xx):** `status: "error"`, `code`, `message`, optional `error.details` for validation.

---

## Error handling

- **200:** All requested actions processed successfully.
- **207:** Some succeeded, some failed; use `data.failedActionIds` and `data.failures` to show which failed and why.
- **400:** Validation (e.g. invalid action, missing/invalid `data`).
- **404:** All action IDs invalid or not found.
- **401/403:** Auth or permission.

Handle both `success` and `partial_success` when updating UI; only remove or update items in `data.actionIds` as successful.

---

## Frontend integration (copy-paste ready)

### Types

```typescript
export type BulkActionType = 'complete' | 'dismiss' | 'snooze' | 'assign' | 'change_priority';

export interface BulkActionRequest {
  action: BulkActionType;
  actionIds: string[];
  data: {
    notes?: string;
    reason?: string;
    snoozedUntil?: string;
    assignedTo?: number;
    priority?: 'urgent' | 'high' | 'medium' | 'low';
    completedBy?: number;
    dismissedBy?: number;
    snoozedBy?: number;
    assignedBy?: number;
    changedBy?: number;
  };
}

export interface BulkActionResponse {
  status: 'success' | 'error' | 'partial_success';
  code: number;
  message: string;
  data: {
    action: string;
    updatedCount: number;
    successCount: number;
    failedCount: number;
    actionIds: string[];
    failedActionIds?: string[];
    failures?: Array<{ actionId: string; reason: string }>;
  };
  timestamp: string;
}
```

### API call

```typescript
const BASE_URL = '/api/v2/customers-hub/requests';

export async function bulkActions(
  request: BulkActionRequest
): Promise<BulkActionResponse> {
  const response = await axiosInstance.post<BulkActionResponse>(
    `${BASE_URL}/bulk`,
    request
  );
  return response.data;
}

export async function bulkCompleteActions(
  actionIds: string[],
  completedBy: number,
  notes?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'complete',
    actionIds,
    data: { notes, completedBy },
  });
}

export async function bulkDismissActions(
  actionIds: string[],
  dismissedBy: number,
  reason?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'dismiss',
    actionIds,
    data: { reason, dismissedBy },
  });
}

export async function bulkSnoozeActions(
  actionIds: string[],
  snoozedUntil: string,
  snoozedBy: number,
  reason?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'snooze',
    actionIds,
    data: { snoozedUntil, reason, snoozedBy },
  });
}

export async function bulkAssignActions(
  actionIds: string[],
  assignedTo: number,
  assignedBy: number
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'assign',
    actionIds,
    data: { assignedTo, assignedBy },
  });
}

export async function bulkChangePriority(
  actionIds: string[],
  priority: BulkActionRequest['data']['priority'],
  changedBy: number
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'change_priority',
    actionIds,
    data: { priority, changedBy },
  });
}
```

### Hook usage

```typescript
const completeMultipleActions = useCallback(
  async (actionIds: string[], notes?: string) => {
    if (!user?.id) return false;
    try {
      const response = await bulkCompleteActions(actionIds, user.id, notes);
      if (response.status === 'success' || response.status === 'partial_success') {
        setActions((prev) =>
          prev.map((action) =>
            response.data.actionIds.includes(action.id)
              ? { ...action, status: 'completed', completedAt: new Date().toISOString() }
              : action
          )
        );
        return true;
      }
      throw new Error(response.message);
    } catch (err) {
      console.error('Bulk complete failed:', err);
      throw err;
    }
  },
  [user?.id]
);
```

---

For backend details (validation, error codes, DB, performance), see **backend:** [bulk-actions-requests-backend.md](../backend/bulk-actions-requests-backend.md).
