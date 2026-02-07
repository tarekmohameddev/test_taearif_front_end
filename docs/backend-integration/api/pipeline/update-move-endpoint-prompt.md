# Backend API Update Request: Modify Pipeline Move Endpoint

## Overview

I need to modify the existing endpoint `/api/v2/customers-hub/pipeline/move` to change the property request stage using the **request ID** instead of the **customer ID**.

## Current Implementation

**Endpoint:** `POST /api/v2/customers-hub/pipeline/move`

**Current Request Body:**
```json
{
  "customerId": 228,
  "newStageId": 136,
  "notes": "Customer showed strong interest in the property during call"
}
```

**Current Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Customer moved successfully",
  "data": {
    "customerId": 228,
    "customerName": "John Doe",
    "previousStage": {
      "id": 135,
      "name": "New"
    },
    "newStage": {
      "id": 136,
      "name": "Contacted"
    },
    "movedAt": "2026-02-05T10:30:00Z",
    "movedBy": {
      "id": 15,
      "name": "Ahmed Ali"
    },
    "notes": "Customer showed strong interest in the property during call"
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

## Required Changes

### 1. Request Body Modification

**Change the request parameter from `customerId` to `requestId`:**

**New Request Body:**
```json
{
  "requestId": 1234,
  "newStageId": 136,
  "notes": "Customer showed strong interest in the property during call"
}
```

**Request Fields:**
- `requestId` (integer, required) - The ID of the property request to move (replaces `customerId`)
- `newStageId` (integer, required) - The ID of the new stage to move the property request to
- `notes` (string, optional) - Optional notes about the stage change

### 2. Backend Logic Update

**Required Changes:**

1. **Accept `requestId` instead of `customerId`** in the request body
2. **Update the database query** to find the property request by `requestId` instead of `customerId`
3. **Update the request's `stage_id`** field in the database
4. **Maintain backward compatibility** (optional but recommended): If `customerId` is provided, you can still support it for a transition period, but `requestId` should be the primary method

### 3. Response Modification

**Update the response to include property request information:**

**New Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Request moved successfully",
  "data": {
    "requestId": 1234,
    "customerId": 228,
    "customerName": "John Doe",
    "previousStage": {
      "id": 135,
      "name": "New"
    },
    "newStage": {
      "id": 136,
      "name": "Contacted"
    },
    "movedAt": "2026-02-05T10:30:00Z",
    "movedBy": {
      "id": 15,
      "name": "Ahmed Ali"
    },
    "notes": "Customer showed strong interest in the property during call"
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Response Fields:**
- `requestId` (integer) - The ID of the property request that was moved
- `customerId` (integer) - The ID of the customer associated with this request (for reference)
- `customerName` (string) - The name of the customer (for reference)
- `previousStage` (object) - Information about the previous stage
- `newStage` (object) - Information about the new stage
- `movedAt` (string) - ISO 8601 timestamp of when the move occurred
- `movedBy` (object) - Information about the user who performed the move
- `notes` (string, optional) - Notes about the move

### 4. Database Schema Considerations

**Assumptions about the database structure:**

- There should be a `requests` table (or similar) with:
  - `id` (primary key) - The property request ID
  - `customer_id` - Foreign key to the customers table
  - `stage_id` - Foreign key to the stages table
  - `updated_at` - Timestamp field
  - Other request-specific fields

**Update Query Example (pseudo-code):**
```sql
UPDATE requests 
SET stage_id = :newStageId, 
    updated_at = NOW()
WHERE id = :requestId
```

### 5. Validation Requirements

**Add the following validations:**

1. **`requestId` must exist** - Return 404 if request not found
2. **`newStageId` must be valid** - Return 422 if stage doesn't exist
3. **User must have permission** - Return 403 if user doesn't have permission to move requests
4. **Request must not be archived/completed** - Return 422 if request is in a final state (if applicable)

### 6. Error Responses

**Update error responses to reflect request-based operations:**

**Request Not Found (404):**
```json
{
  "status": "error",
  "code": 404,
  "message": "Request not found",
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Validation Error (422):**
```json
{
  "status": "error",
  "code": 422,
  "message": "Validation failed",
  "errors": {
    "requestId": ["The request id field is required."],
    "newStageId": ["The new stage id field is required."]
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Invalid Stage (422):**
```json
{
  "status": "error",
  "code": 422,
  "message": "Invalid stage",
  "errors": {
    "newStageId": ["The specified stage does not exist or is not active."]
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

## Implementation Checklist

- [ ] Update request body validation to accept `requestId` instead of `customerId`
- [ ] Modify database query to find request by `requestId`
- [ ] Update the request's `stage_id` in the database
- [ ] Update response to include `requestId` and maintain `customerId` for reference
- [ ] Add validation for request existence
- [ ] Add validation for stage validity
- [ ] Update error messages to reflect request-based operations
- [ ] Test with valid `requestId`
- [ ] Test with invalid `requestId` (should return 404)
- [ ] Test with invalid `newStageId` (should return 422)
- [ ] Test with missing required fields (should return 422)
- [ ] Verify that the request's stage is actually updated in the database
- [ ] Verify that stage history is logged (if applicable)
- [ ] Update API documentation

## Testing Scenarios

1. **Valid Request:**
   - Send `requestId: 1234` and `newStageId: 136`
   - Verify request stage is updated
   - Verify response includes correct `requestId` and `customerId`

2. **Invalid Request ID:**
   - Send `requestId: 99999` (non-existent)
   - Should return 404 error

3. **Invalid Stage ID:**
   - Send valid `requestId` but invalid `newStageId: 99999`
   - Should return 422 validation error

4. **Missing Required Fields:**
   - Send request without `requestId`
   - Should return 422 validation error

5. **Request Already in Target Stage:**
   - Send `requestId` and `newStageId` where request is already in that stage
   - Should still return success (idempotent operation)

## Notes

- The endpoint should maintain the same authentication and authorization requirements
- The endpoint should log the stage change in the request's history (if history tracking exists)
- Consider updating any related webhooks or notifications to use `requestId` instead of `customerId`
- If there are any background jobs or processes that depend on this endpoint, they may need updates

## Migration Considerations

If you want to support both `customerId` and `requestId` during a transition period:

1. Accept both parameters in the request
2. If `requestId` is provided, use it (preferred)
3. If only `customerId` is provided, find the most recent active request for that customer
4. Log a deprecation warning when `customerId` is used
5. Document that `customerId` will be removed in a future version

---

**Priority:** High  
**Estimated Complexity:** Medium  
**Breaking Change:** Yes (for frontend, but can be mitigated with backward compatibility)
