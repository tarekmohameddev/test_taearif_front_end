# Backend Implementation: Dynamic Stages System for Customers Hub

## Overview

Implement a dynamic stages management system for the Customers Hub. Replace hardcoded stages with a database-driven system that allows creating, updating, and deleting stages. Integrate this system with the existing requests table and analytics endpoints.

---

## 1. Database Schema: Create Stages Table

### 1.1 Create `customers_hub_stages` Table

Create a new table with the following structure:

**Table Name:** `customers_hub_stages`

**Columns:**
- `id` (Primary Key, Auto Increment, Integer)
- `stage_id` (VARCHAR(50), UNIQUE, NOT NULL) - Unique identifier like "new_lead", "qualified", etc.
- `stage_name_ar` (VARCHAR(255), NOT NULL) - Arabic stage name
- `stage_name_en` (VARCHAR(255), NOT NULL) - English stage name
- `color` (VARCHAR(7), NOT NULL) - Hex color code (e.g., "#3b82f6")
- `order` (INTEGER, NOT NULL) - Display order (1, 2, 3, etc.)
- `description` (TEXT, NULLABLE) - Optional description
- `is_active` (BOOLEAN, DEFAULT true) - Whether stage is active
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

**Indexes:**
- Primary key on `id`
- Unique index on `stage_id`
- Index on `order` for sorting
- Index on `is_active` for filtering

### 1.2 Insert Default Stages

Insert 4 default stages when creating the table:

```sql
INSERT INTO customers_hub_stages (stage_id, stage_name_ar, stage_name_en, color, `order`, description, is_active) VALUES
('new_lead', 'عميل جديد', 'New Lead', '#3b82f6', 1, 'Initial inquiry from any source', true),
('qualified', 'مؤهل', 'Qualified', '#8b5cf6', 2, 'Budget, timeline, and preferences confirmed', true),
('negotiation', 'تفاوض', 'Negotiation', '#f59e0b', 3, 'Price and terms discussion', true),
('closing', 'إتمام الصفقة', 'Closing', '#22c55e', 4, 'Final transaction completion', true);
```

---

## 2. Modify Requests Table Schema

### 2.1 Add `stage_id` Column

Add a new column to the existing requests table (or customers table if requests are stored there):

**Column Details:**
- `stage_id` (VARCHAR(50), NULLABLE)
- Foreign key constraint: References `customers_hub_stages.stage_id`
- Default: `NULL` (for backward compatibility with existing records)

**Migration Script:**
```sql
ALTER TABLE [requests_table_name] 
ADD COLUMN stage_id VARCHAR(50) NULL;

ALTER TABLE [requests_table_name]
ADD CONSTRAINT fk_stage_id 
FOREIGN KEY (stage_id) REFERENCES customers_hub_stages(stage_id) 
ON DELETE SET NULL;

CREATE INDEX idx_stage_id ON [requests_table_name](stage_id);
```

**Note:** Replace `[requests_table_name]` with the actual table name (e.g., `customers_hub_requests`, `customer_requests`, etc.)

### 2.2 Update Existing Records (Optional)

Set default stage for existing records that have `NULL` stage_id:

```sql
UPDATE [requests_table_name] 
SET stage_id = 'new_lead' 
WHERE stage_id IS NULL;
```

---

## 3. Stage Management Endpoints

### 3.1 Create Stage Endpoint

**Endpoint:** `POST /api/v2/customers-hub/stages`

**Request Body:**
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

**Validation Rules:**
- `stage_id`: Required, string, unique, alphanumeric + underscore only, max 50 chars
- `stage_name_ar`: Required, string, max 255 chars
- `stage_name_en`: Required, string, max 255 chars
- `color`: Required, string, valid hex color format (#RRGGBB)
- `order`: Required, integer, positive
- `description`: Optional, text
- `is_active`: Optional, boolean, default true

**Response (Success - 201):**
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
    "created_at": "2024-01-31T12:00:00Z",
    "updated_at": "2024-01-31T12:00:00Z"
  },
  "timestamp": "2024-01-31T12:00:00Z"
}
```

**Error Responses:**
- 400: Validation error (missing required fields, invalid format)
- 409: Conflict (stage_id already exists)
- 500: Server error

---

### 3.2 Update Stage Endpoint

**Endpoint:** `PUT /api/v2/customers-hub/stages/{stage_id}`

**Path Parameter:**
- `stage_id`: The unique stage identifier (string)

**Request Body:**
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

**Validation Rules:**
- All fields are optional (only include fields to update)
- Same validation rules as create endpoint
- Cannot update `stage_id` (it's the identifier)

**Response (Success - 200):**
```json
{
  "success": true,
  "status": "success",
  "code": 200,
  "message": "Stage updated successfully",
  "data": {
    "id": 5,
    "stage_id": "custom_stage",
    "stage_name_ar": "مرحلة محدثة",
    "stage_name_en": "Updated Stage",
    "color": "#00ff00",
    "order": 6,
    "description": "Updated description",
    "is_active": false,
    "created_at": "2024-01-31T12:00:00Z",
    "updated_at": "2024-01-31T12:30:00Z"
  },
  "timestamp": "2024-01-31T12:30:00Z"
}
```

**Error Responses:**
- 404: Stage not found
- 400: Validation error
- 500: Server error

---

### 3.3 Delete Stage Endpoint

**Endpoint:** `DELETE /api/v2/customers-hub/stages/{stage_id}`

**Path Parameter:**
- `stage_id`: The unique stage identifier (string)

**Validation:**
- Check if any requests are using this stage_id
- If requests exist, return error (cannot delete stage in use)
- If no requests use it, proceed with deletion

**Response (Success - 200):**
```json
{
  "success": true,
  "status": "success",
  "code": 200,
  "message": "Stage deleted successfully",
  "data": null,
  "timestamp": "2024-01-31T12:30:00Z"
}
```

**Error Responses:**
- 404: Stage not found
- 409: Conflict - Stage is in use by requests (cannot delete)
- 500: Server error

**Error Response Example (409):**
```json
{
  "success": false,
  "status": "error",
  "code": 409,
  "message": "Cannot delete stage: 150 requests are using this stage",
  "data": {
    "requests_count": 150
  },
  "timestamp": "2024-01-31T12:30:00Z"
}
```

---

### 3.4 Get All Stages Endpoint

**Endpoint:** `GET /api/v2/customers-hub/stages`

**Query Parameters (Optional):**
- `active_only`: Boolean (default: false) - If true, return only active stages
- `order_by`: String (default: "order") - Sort by "order" or "created_at"

**Response (Success - 200):**
```json
{
  "success": true,
  "status": "success",
  "code": 200,
  "message": "Stages retrieved successfully",
  "data": {
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
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
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
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
      // ... more stages
    ],
    "total": 4
  },
  "timestamp": "2024-01-31T12:30:00Z"
}
```

**Notes:**
- Return stages ordered by `order` field (ascending)
- If `active_only=true`, filter by `is_active = true`
- Always return in order specified by `order` field

---

## 4. Modify Existing Request Endpoints

### 4.1 Update Request Endpoint (v2)

**Endpoint:** `PUT /api/v2/customers-hub/requests/{request_id}` (or existing update endpoint)

**Modification Required:**
Add `stage_id` as an optional field in the request body.

**Request Body (Example):**
```json
{
  "stage_id": "qualified",
  // ... other existing fields
}
```

**Validation:**
- If `stage_id` is provided, validate it exists in `customers_hub_stages` table
- If `stage_id` doesn't exist, return 400 error
- If `stage_id` is null or not provided, keep existing value (no change)

**Response:**
Include `stage_id` in the response:
```json
{
  "success": true,
  "data": {
    "id": "request_123",
    "stage_id": "qualified",
    // ... other fields
  }
}
```

**Error Response (Invalid stage_id):**
```json
{
  "success": false,
  "status": "error",
  "code": 400,
  "message": "Invalid stage_id: 'invalid_stage' does not exist",
  "data": null
}
```

---

### 4.2 Get Requests Endpoint

**Endpoint:** `GET /api/v2/customers-hub/requests` (or existing get endpoint)

**Modification Required:**
Include `stage_id` and optionally full stage information in the response.

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "request_123",
        "stage_id": "qualified",
        "stage": {
          "stage_id": "qualified",
          "stage_name_ar": "مؤهل",
          "stage_name_en": "Qualified",
          "color": "#8b5cf6",
          "order": 2
        },
        // ... other existing request fields
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150
    }
  }
}
```

**Implementation Notes:**
- Join with `customers_hub_stages` table to get stage information
- If `stage_id` is NULL, return `stage_id: null` and `stage: null`
- Include stage data in the response (don't require separate API call)

**Query Optimization:**
- Use LEFT JOIN to include requests without stages
- Use single query with JOIN instead of N+1 queries

---

## 5. Modify Pipeline Health Analytics Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics`

**Action:** `pipeline_health`

### 5.1 Dynamic Stages Implementation

**Current Behavior (to be replaced):**
- Hardcoded stages array

**New Behavior:**
- Fetch stages dynamically from `customers_hub_stages` table
- Only include stages where `is_active = true`
- Order by `order` field (ascending)

### 5.2 Request Structure (Unchanged)

```json
{
  "action": "pipeline_health",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"]
  }
}
```

### 5.3 Response Structure (Modified)

```json
{
  "success": true,
  "status": "success",
  "code": 200,
  "message": "Pipeline health data retrieved successfully",
  "data": {
    "pipelineHealth": {
      "stages": [
        {
          "stageId": "new_lead",
          "stageName": "عميل جديد",
          "stageNameEn": "New Lead",
          "count": 50000,
          "percentage": 40.0,
          "totalValue": 0,
          "avgDays": 5,
          "color": "#3b82f6"
        },
        {
          "stageId": "qualified",
          "stageName": "مؤهل",
          "stageNameEn": "Qualified",
          "count": 25000,
          "percentage": 20.0,
          "totalValue": 500000000,
          "avgDays": 12,
          "color": "#8b5cf6"
        }
        // ... all active stages from database
      ],
      "total": 125000
    },
    "timeRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z"
    }
  },
  "timestamp": "2024-01-31T12:00:00Z"
}
```

### 5.4 Implementation Logic

**Step 1: Fetch Active Stages**
```sql
SELECT stage_id, stage_name_ar, stage_name_en, color, `order`
FROM customers_hub_stages
WHERE is_active = true
ORDER BY `order` ASC;
```

**Step 2: For Each Stage, Calculate Statistics**

For each stage returned from Step 1:

1. **Count Calculation:**
   ```sql
   SELECT COUNT(*) as count
   FROM [requests_table_name]
   WHERE stage_id = ?
     AND created_at >= ? AND created_at <= ?
     AND (priority IN (?) OR ? IS NULL)
     AND (source IN (?) OR ? IS NULL)
     -- Apply all filters from request
   ```

2. **Total Value Calculation:**
   ```sql
   SELECT COALESCE(SUM(deal_value), 0) as total_value
   FROM [requests_table_name]
   WHERE stage_id = ?
     AND created_at >= ? AND created_at <= ?
     -- Apply all filters
   ```

3. **Average Days Calculation:**
   ```sql
   SELECT AVG(DATEDIFF(NOW(), stage_changed_at)) as avg_days
   FROM [requests_table_name]
   WHERE stage_id = ?
     AND created_at >= ? AND created_at <= ?
     -- Apply all filters
     -- Note: stage_changed_at should be when customer entered this stage
   ```

4. **Percentage Calculation:**
   - Calculate after getting all stage counts
   - `percentage = (stage_count / total_count) * 100`
   - Round to 1 decimal place

**Step 3: Build Response**
- Map database stage data to response format:
  - `stageId` ← `stage_id`
  - `stageName` ← `stage_name_ar`
  - `stageNameEn` ← `stage_name_en`
  - `color` ← `color`
  - `count` ← calculated count
  - `percentage` ← calculated percentage
  - `totalValue` ← calculated total value
  - `avgDays` ← calculated average days

**Step 4: Total Calculation**
- Sum all `count` values from all stages
- This equals total customers matching filters

### 5.5 Important Notes

- Always return all active stages, even if count is 0
- Maintain order from database (`order` field)
- If a stage has no requests, return:
  ```json
  {
    "stageId": "some_stage",
    "stageName": "...",
    "stageNameEn": "...",
    "count": 0,
    "percentage": 0.0,
    "totalValue": 0,
    "avgDays": 0,
    "color": "#..."
  }
  ```
- Ensure `total` equals sum of all stage counts
- Round `percentage` to 1 decimal place
- Round `avgDays` to nearest integer

---

## 6. Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "status": "error",
  "code": 400,
  "message": "Validation error: [specific error message]",
  "data": {
    "errors": {
      "stage_id": "Stage ID is required",
      "color": "Invalid hex color format"
    }
  },
  "timestamp": "2024-01-31T12:00:00Z"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "status": "error",
  "code": 404,
  "message": "Stage not found: 'invalid_stage_id'",
  "data": null,
  "timestamp": "2024-01-31T12:00:00Z"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "status": "error",
  "code": 409,
  "message": "Stage ID already exists",
  "data": null,
  "timestamp": "2024-01-31T12:00:00Z"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "status": "error",
  "code": 500,
  "message": "Internal server error",
  "data": null,
  "timestamp": "2024-01-31T12:00:00Z"
}
```

---

## 7. Performance Requirements

### Database Optimization

1. **Indexes:**
   - `customers_hub_stages.stage_id` (UNIQUE)
   - `customers_hub_stages.order` (for sorting)
   - `customers_hub_stages.is_active` (for filtering)
   - `[requests_table].stage_id` (for joins and filtering)
   - `[requests_table].created_at` (for time range filtering)

2. **Query Optimization:**
   - Use aggregation queries (GROUP BY) for pipeline health
   - Use JOINs instead of multiple queries
   - Cache stage metadata if possible (stages don't change frequently)

3. **Response Time:**
   - Stage management endpoints: < 100ms
   - Get requests with stages: < 200ms
   - Pipeline health: < 300ms (with proper indexing)

---

## 8. Testing Requirements

### Test Scenarios

1. **Stage Management:**
   - Create stage with valid data
   - Create stage with duplicate stage_id (should fail)
   - Update stage
   - Delete stage with no requests (should succeed)
   - Delete stage with requests (should fail)
   - Get all stages (active only and all)

2. **Request Integration:**
   - Update request with valid stage_id
   - Update request with invalid stage_id (should fail)
   - Get requests and verify stage data is included
   - Get requests with NULL stage_id (should work)

3. **Pipeline Health:**
   - Test with all active stages
   - Test with some stages having 0 counts
   - Test with time range filters
   - Test with priority/source filters
   - Verify percentages sum to ~100%
   - Verify total equals sum of counts

4. **Edge Cases:**
   - Empty stages table
   - All stages inactive
   - Requests with NULL stage_id
   - Very large datasets (performance)

---

## 9. Migration Strategy

### Recommended Steps

1. Create `customers_hub_stages` table
2. Insert 4 default stages
3. Add `stage_id` column to requests table (nullable)
4. Update existing endpoints to support `stage_id`
5. Test thoroughly
6. Optionally: Update existing records with default stage

### Rollback Plan

- Keep old code until new system is verified
- Migration scripts should be reversible
- Test in staging environment first

---

## 10. Summary Checklist

**Database:**
- [ ] Create `customers_hub_stages` table with all required columns
- [ ] Insert 4 default stages
- [ ] Add `stage_id` column to requests table
- [ ] Add foreign key constraint
- [ ] Create necessary indexes

**Endpoints:**
- [ ] POST `/api/v2/customers-hub/stages` (Create)
- [ ] PUT `/api/v2/customers-hub/stages/{stage_id}` (Update)
- [ ] DELETE `/api/v2/customers-hub/stages/{stage_id}` (Delete)
- [ ] GET `/api/v2/customers-hub/stages` (Get All)
- [ ] Modify PUT `/api/v2/customers-hub/requests/{id}` (Add stage_id)
- [ ] Modify GET `/api/v2/customers-hub/requests` (Include stage data)
- [ ] Modify POST `/api/v2/customers-hub/analytics` with action `pipeline_health` (Dynamic stages)

**Validation:**
- [ ] All validations implemented
- [ ] Error handling for all cases
- [ ] Foreign key constraints working

**Testing:**
- [ ] All endpoints tested
- [ ] Edge cases covered
- [ ] Performance verified

---

**Please implement this complete system following all specifications above. The frontend depends on this exact structure and will break if keys are missing or have incorrect data types. Ensure backward compatibility with existing requests that may not have stage_id set.**
