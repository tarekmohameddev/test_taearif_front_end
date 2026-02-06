# Bulk Actions Endpoints - Customers Hub Requests

## Overview

This document provides detailed specifications for **Bulk Actions Endpoints** for the Customers Hub Requests system. These endpoints allow performing operations on multiple actions (requests) in a single API call, instead of sending individual requests for each action.

**Base URL:** `/api/v2/customers-hub/requests`  
**Authentication:** Bearer Token (Laravel Sanctum)  
**Content-Type:** `application/json`

---

## Why Bulk Endpoints?

### Current Problem

Currently, when performing bulk operations (e.g., completing 10 selected actions), the frontend sends **10 separate API requests** - one for each action:

```typescript
// ❌ Current approach (INEFFICIENT)
const promises = actionIds.map((id) => apiCompleteAction(id, notes));
await Promise.all(promises);
```

**Issues:**
- Multiple HTTP requests (network overhead)
- Multiple database queries (performance overhead)
- Slower response times
- Higher server load
- No atomic transaction (partial failures possible)

### Solution: Bulk Endpoints

With bulk endpoints, the frontend sends **1 single API request** for all selected actions:

```typescript
// ✅ New approach (EFFICIENT)
await apiBulkCompleteActions(actionIds, notes);
```

**Benefits:**
- Single HTTP request (reduced network overhead)
- Single database transaction (better performance)
- Faster response times
- Lower server load
- Atomic transaction (all or nothing)

---

## Endpoint: Bulk Operations

### Endpoint Specification

**Endpoint:** `POST /api/v2/customers-hub/requests/bulk`

**Method:** `POST`

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
Accept: application/json
```

**Request Body Structure:**
```json
{
  "action": "complete | dismiss | snooze | assign | change_priority",
  "actionIds": ["action_id_1", "action_id_2", "action_id_3", ...],
  "data": {
    // Operation-specific data (see below)
  }
}
```

**Request Body Fields:**
- `action` (required): The type of bulk operation to perform
- `actionIds` (required): Array of action IDs to process (minimum 1, maximum 1000)
- `data` (required): Object containing operation-specific parameters

---

## Bulk Action Types

### 1. Bulk Complete Actions

**Action Type:** `complete`

**Purpose:** Mark multiple actions as completed in a single request.

**Request Body:**
```json
{
  "action": "complete",
  "actionIds": [
    "action_123",
    "action_456",
    "action_789"
  ],
  "data": {
    "notes": "تم إكمال جميع الإجراءات المحددة",
    "completedBy": "employee_id_123"
  }
}
```

**Data Fields:**
- `notes` (optional): Notes to add to all completed actions
- `completedBy` (required): ID of the employee performing the action

**Response:**
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
    "actionIds": [
      "action_123",
      "action_456",
      "action_789"
    ],
    "failedActionIds": [],
    "completedAt": "2024-01-20T10:30:00Z",
    "completedBy": {
      "id": "employee_id_123",
      "name": "أحمد محمد"
    }
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Response Fields:**
- `updatedCount`: Number of actions successfully updated
- `successCount`: Number of actions that were successfully completed
- `failedCount`: Number of actions that failed to complete
- `actionIds`: Array of all action IDs that were processed
- `failedActionIds`: Array of action IDs that failed (if any)
- `completedAt`: Timestamp when the bulk operation was completed
- `completedBy`: Employee information who performed the operation

**Database Changes:**
- Update `status` to `"completed"` for all specified actions
- Set `completed_at` to current timestamp
- Set `completed_by` to the employee ID
- Add notes to action history if provided

---

### 2. Bulk Dismiss Actions

**Action Type:** `dismiss`

**Purpose:** Dismiss (reject) multiple actions in a single request.

**Request Body:**
```json
{
  "action": "dismiss",
  "actionIds": [
    "action_123",
    "action_456",
    "action_789"
  ],
  "data": {
    "reason": "غير مناسب",
    "dismissedBy": "employee_id_123"
  }
}
```

**Data Fields:**
- `reason` (optional): Reason for dismissing the actions
- `dismissedBy` (required): ID of the employee performing the action

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "تم رفض 3 إجراءات بنجاح",
  "data": {
    "action": "dismiss",
    "updatedCount": 3,
    "successCount": 3,
    "failedCount": 0,
    "actionIds": [
      "action_123",
      "action_456",
      "action_789"
    ],
    "failedActionIds": [],
    "dismissedAt": "2024-01-20T10:30:00Z",
    "dismissedBy": {
      "id": "employee_id_123",
      "name": "أحمد محمد"
    },
    "reason": "غير مناسب"
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Database Changes:**
- Update `status` to `"dismissed"` for all specified actions
- Set `dismissed_at` to current timestamp
- Set `dismissed_by` to the employee ID
- Store `reason` in action metadata or notes

---

### 3. Bulk Snooze Actions

**Action Type:** `snooze`

**Purpose:** Snooze (postpone) multiple actions until a specific date/time.

**Request Body:**
```json
{
  "action": "snooze",
  "actionIds": [
    "action_123",
    "action_456",
    "action_789"
  ],
  "data": {
    "snoozedUntil": "2024-01-25T10:00:00Z",
    "reason": "انتظار رد العميل",
    "snoozedBy": "employee_id_123"
  }
}
```

**Data Fields:**
- `snoozedUntil` (required): ISO 8601 datetime string - when to resume the actions
- `reason` (optional): Reason for snoozing
- `snoozedBy` (required): ID of the employee performing the action

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "تم تأجيل 3 إجراءات بنجاح",
  "data": {
    "action": "snooze",
    "updatedCount": 3,
    "successCount": 3,
    "failedCount": 0,
    "actionIds": [
      "action_123",
      "action_456",
      "action_789"
    ],
    "failedActionIds": [],
    "snoozedUntil": "2024-01-25T10:00:00Z",
    "snoozedAt": "2024-01-20T10:30:00Z",
    "snoozedBy": {
      "id": "employee_id_123",
      "name": "أحمد محمد"
    },
    "reason": "انتظار رد العميل"
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Database Changes:**
- Update `status` to `"snoozed"` for all specified actions
- Set `snoozed_until` to the provided datetime
- Set `snoozed_at` to current timestamp
- Set `snoozed_by` to the employee ID
- Store `reason` in action metadata or notes
- Update `due_date` to `snoozed_until` (optional, based on business logic)

---

### 4. Bulk Assign Actions

**Action Type:** `assign`

**Purpose:** Assign multiple actions to a specific employee.

**Request Body:**
```json
{
  "action": "assign",
  "actionIds": [
    "action_123",
    "action_456",
    "action_789"
  ],
  "data": {
    "assignedTo": "employee_id_456",
    "assignedBy": "employee_id_123"
  }
}
```

**Data Fields:**
- `assignedTo` (required): ID of the employee to assign actions to
- `assignedBy` (required): ID of the employee performing the assignment

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "تم تعيين 3 إجراءات بنجاح",
  "data": {
    "action": "assign",
    "updatedCount": 3,
    "successCount": 3,
    "failedCount": 0,
    "actionIds": [
      "action_123",
      "action_456",
      "action_789"
    ],
    "failedActionIds": [],
    "assignedAt": "2024-01-20T10:30:00Z",
    "assignedTo": {
      "id": "employee_id_456",
      "name": "فاطمة علي",
      "email": "fatima@example.com"
    },
    "assignedBy": {
      "id": "employee_id_123",
      "name": "أحمد محمد"
    }
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Database Changes:**
- Update `assigned_to` to the new employee ID for all specified actions
- Update `assigned_to_name` to the new employee name
- Set `assigned_at` to current timestamp
- Set `assigned_by` to the employee ID who performed the assignment
- Add assignment history entry

---

### 5. Bulk Change Priority

**Action Type:** `change_priority`

**Purpose:** Change priority level for multiple actions.

**Request Body:**
```json
{
  "action": "change_priority",
  "actionIds": [
    "action_123",
    "action_456",
    "action_789"
  ],
  "data": {
    "priority": "urgent",
    "changedBy": "employee_id_123"
  }
}
```

**Data Fields:**
- `priority` (required): New priority level (`"urgent" | "high" | "medium" | "low"`)
- `changedBy` (required): ID of the employee performing the change

**Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "تم تغيير أولوية 3 إجراءات بنجاح",
  "data": {
    "action": "change_priority",
    "updatedCount": 3,
    "successCount": 3,
    "failedCount": 0,
    "actionIds": [
      "action_123",
      "action_456",
      "action_789"
    ],
    "failedActionIds": [],
    "priority": "urgent",
    "changedAt": "2024-01-20T10:30:00Z",
    "changedBy": {
      "id": "employee_id_123",
      "name": "أحمد محمد"
    }
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

**Database Changes:**
- Update `priority` to the new value for all specified actions
- Set `priority_changed_at` to current timestamp (if field exists)
- Set `priority_changed_by` to the employee ID (if field exists)
- Add priority change history entry

---

## Request Validation

### Required Validations

1. **Authentication:**
   - User must be authenticated (valid Bearer token)
   - User must have permission to perform bulk operations

2. **Action IDs:**
   - `actionIds` array must not be empty
   - Minimum: 1 action ID
   - Maximum: 1000 action IDs per request
   - All action IDs must be valid (exist in database)
   - All action IDs must belong to the same tenant/organization

3. **Action Type:**
   - `action` must be one of: `complete`, `dismiss`, `snooze`, `assign`, `change_priority`
   - Invalid action type returns error: `INVALID_ACTION_TYPE`

4. **Data Fields:**
   - Required fields must be present based on action type
   - Field types must be correct (e.g., `snoozedUntil` must be valid ISO 8601 datetime)
   - Employee IDs must exist and be valid

5. **Business Rules:**
   - Cannot complete already completed actions (unless business rule allows)
   - Cannot dismiss already dismissed actions
   - Cannot assign to inactive employees
   - Cannot change priority if action is in invalid state

### Validation Error Response

```json
{
  "status": "error",
  "code": 400,
  "message": "خطأ في التحقق من البيانات",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "البيانات المرسلة غير صحيحة",
    "details": {
      "actionIds": ["يجب أن تحتوي على عنصر واحد على الأقل"],
      "data.snoozedUntil": ["يجب أن يكون تاريخ صحيح"]
    }
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## Error Handling

### Error Response Format

```json
{
  "status": "error",
  "code": 400,
  "message": "Human-readable error message",
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message",
    "details": {}
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### Common Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `INVALID_ACTION_TYPE` | 400 | Invalid action type provided |
| `INVALID_ACTION_IDS` | 400 | Invalid or empty actionIds array |
| `TOO_MANY_ACTIONS` | 400 | More than 1000 action IDs provided |
| `ACTION_NOT_FOUND` | 404 | One or more action IDs not found |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `INVALID_EMPLOYEE` | 400 | Invalid employee ID provided |
| `INVALID_DATE` | 400 | Invalid date format (for snooze) |
| `INVALID_PRIORITY` | 400 | Invalid priority value |
| `PARTIAL_FAILURE` | 207 | Some actions succeeded, some failed |
| `TRANSACTION_FAILED` | 500 | Database transaction failed |
| `INTERNAL_ERROR` | 500 | Server error |

### Partial Failure Handling

If some actions succeed and some fail, the response includes details:

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
    "actionIds": [
      "action_123",
      "action_456",
      "action_789"
    ],
    "failedActionIds": [
      "action_789"
    ],
    "failures": [
      {
        "actionId": "action_789",
        "reason": "ACTION_NOT_FOUND"
      }
    ]
  },
  "timestamp": "2024-01-20T10:30:00Z"
}
```

---

## Database Transaction

### Transaction Requirements

**CRITICAL:** All bulk operations MUST use database transactions to ensure atomicity:

1. **All or Nothing:**
   - If all actions succeed → commit transaction
   - If any action fails → rollback entire transaction (unless partial failure is allowed)

2. **Transaction Isolation:**
   - Use `READ COMMITTED` or `REPEATABLE READ` isolation level
   - Prevent concurrent modifications during bulk operation

3. **Lock Strategy:**
   - Lock all affected action rows at the start of transaction
   - Release locks after transaction completes

### Implementation Example (Pseudocode)

```sql
BEGIN TRANSACTION;

-- Lock all action rows
SELECT * FROM actions 
WHERE id IN (action_ids) 
FOR UPDATE;

-- Perform bulk update
UPDATE actions 
SET status = 'completed',
    completed_at = NOW(),
    completed_by = employee_id
WHERE id IN (action_ids)
  AND status IN ('pending', 'in_progress');

-- Check if all actions were updated
IF (updated_count != expected_count) THEN
  ROLLBACK;
  RETURN ERROR;
END IF;

COMMIT;
```

---

## Performance Requirements

### Response Time Targets

- **Bulk Complete (100 actions):** < 500ms (p95)
- **Bulk Dismiss (100 actions):** < 500ms (p95)
- **Bulk Snooze (100 actions):** < 500ms (p95)
- **Bulk Assign (100 actions):** < 500ms (p95)
- **Bulk Change Priority (100 actions):** < 500ms (p95)

### Optimization Strategies

1. **Batch Updates:**
   - Use single `UPDATE` query with `WHERE id IN (...)` instead of multiple queries
   - Use database bulk update operations

2. **Index Usage:**
   - Ensure `actions.id` is indexed (primary key)
   - Ensure `actions.status` is indexed for filtering

3. **Connection Pooling:**
   - Use connection pooling for database connections
   - Reuse connections efficiently

4. **Transaction Optimization:**
   - Minimize transaction duration
   - Lock only necessary rows
   - Avoid long-running operations inside transaction

---

## Frontend Integration

### Current Implementation (Before Bulk Endpoints)

```typescript
// ❌ OLD: Multiple requests
const completeMultipleActions = async (actionIds: string[], notes?: string) => {
  const promises = actionIds.map((id) => apiCompleteAction(id, notes));
  await Promise.all(promises);
};
```

### New Implementation (With Bulk Endpoints)

```typescript
// ✅ NEW: Single request
const completeMultipleActions = async (actionIds: string[], notes?: string) => {
  const response = await axiosInstance.post('/v2/customers-hub/requests/bulk', {
    action: 'complete',
    actionIds: actionIds,
    data: {
      notes: notes,
      completedBy: currentUser.id
    }
  });
  return response.data;
};
```

### API Service Function

```typescript
// lib/services/customers-hub-requests-api.ts

export interface BulkActionRequest {
  action: 'complete' | 'dismiss' | 'snooze' | 'assign' | 'change_priority';
  actionIds: string[];
  data: {
    // Operation-specific data
    notes?: string;
    reason?: string;
    snoozedUntil?: string;
    assignedTo?: string;
    priority?: Priority;
    completedBy?: string;
    dismissedBy?: string;
    snoozedBy?: string;
    assignedBy?: string;
    changedBy?: string;
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
    failures?: Array<{
      actionId: string;
      reason: string;
    }>;
  };
  timestamp: string;
}

export async function bulkActions(
  request: BulkActionRequest
): Promise<BulkActionResponse> {
  const response = await axiosInstance.post<BulkActionResponse>(
    `${BASE_URL}/bulk`,
    request
  );
  return response.data;
}

// Convenience functions
export async function bulkCompleteActions(
  actionIds: string[],
  notes?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'complete',
    actionIds,
    data: {
      notes,
      completedBy: getCurrentUserId(),
    },
  });
}

export async function bulkDismissActions(
  actionIds: string[],
  reason?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'dismiss',
    actionIds,
    data: {
      reason,
      dismissedBy: getCurrentUserId(),
    },
  });
}

export async function bulkSnoozeActions(
  actionIds: string[],
  snoozedUntil: string,
  reason?: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'snooze',
    actionIds,
    data: {
      snoozedUntil,
      reason,
      snoozedBy: getCurrentUserId(),
    },
  });
}

export async function bulkAssignActions(
  actionIds: string[],
  employeeId: string
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'assign',
    actionIds,
    data: {
      assignedTo: employeeId,
      assignedBy: getCurrentUserId(),
    },
  });
}

export async function bulkChangePriority(
  actionIds: string[],
  priority: Priority
): Promise<BulkActionResponse> {
  return bulkActions({
    action: 'change_priority',
    actionIds,
    data: {
      priority,
      changedBy: getCurrentUserId(),
    },
  });
}
```

### Hook Update

```typescript
// hooks/useCustomersHubRequests.ts

// ✅ NEW: Use bulk endpoints
const completeMultipleActions = useCallback(
  async (actionIds: string[], notes?: string) => {
    if (authLoading || !userData?.token) {
      return false;
    }

    try {
      const response = await bulkCompleteActions(actionIds, notes);
      
      if (response.status === 'success' || response.status === 'partial_success') {
        // Update local state
        setActions((prev) =>
          prev.map((action) =>
            response.data.actionIds.includes(action.id)
              ? { ...action, status: 'completed' as const, completedAt: new Date().toISOString() }
              : action
          )
        );
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      console.error('Error completing multiple actions:', err);
      throw err;
    }
  },
  [userData?.token, authLoading]
);

// Similar updates for other bulk operations...
```

---

## Testing Scenarios

### 1. Success Scenarios

- ✅ Complete 1 action
- ✅ Complete 10 actions
- ✅ Complete 100 actions (maximum recommended)
- ✅ Complete 1000 actions (maximum allowed)
- ✅ Dismiss multiple actions with reason
- ✅ Snooze multiple actions until future date
- ✅ Assign multiple actions to employee
- ✅ Change priority for multiple actions

### 2. Validation Error Scenarios

- ❌ Empty actionIds array
- ❌ More than 1000 action IDs
- ❌ Invalid action type
- ❌ Missing required data fields
- ❌ Invalid date format for snooze
- ❌ Invalid priority value
- ❌ Invalid employee ID

### 3. Business Rule Error Scenarios

- ❌ Complete already completed actions
- ❌ Dismiss already dismissed actions
- ❌ Assign to inactive employee
- ❌ Snooze with past date
- ❌ Change priority for completed actions

### 4. Partial Failure Scenarios

- ⚠️ Some action IDs not found
- ⚠️ Some actions already in target state
- ⚠️ Some actions belong to different tenant

### 5. Performance Scenarios

- ⚡ Bulk complete 100 actions in < 500ms
- ⚡ Bulk assign 1000 actions in < 2 seconds
- ⚡ Concurrent bulk operations (multiple users)

---

## Summary

### Key Benefits

1. **Performance:** Single request instead of multiple requests
2. **Efficiency:** Single database transaction instead of multiple transactions
3. **Atomicity:** All actions succeed or fail together (transaction-based)
4. **Scalability:** Better handling of large bulk operations
5. **User Experience:** Faster response times for bulk operations

### Implementation Checklist

- [ ] Create bulk endpoint: `POST /api/v2/customers-hub/requests/bulk`
- [ ] Implement 5 action types: complete, dismiss, snooze, assign, change_priority
- [ ] Add request validation (actionIds, action type, data fields)
- [ ] Implement database transactions for atomicity
- [ ] Add error handling (validation errors, business rule errors, partial failures)
- [ ] Add performance optimizations (batch updates, indexing)
- [ ] Update frontend API service functions
- [ ] Update frontend hooks to use bulk endpoints
- [ ] Add comprehensive testing
- [ ] Monitor performance metrics

---

**END OF DOCUMENTATION**
