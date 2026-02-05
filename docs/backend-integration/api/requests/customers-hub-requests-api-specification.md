# Customers Hub Requests Center - Backend API Integration Specification

## Overview

This document provides complete technical specifications for integrating the **Customers Hub Requests Center** page (`/dashboard/customers-hub/requests/`) with the backend API. This specification is designed for AI systems to implement the backend endpoints and data structures.

**Page Location:** `app/dashboard/customers-hub/requests/page.tsx`  
**Component:** `components/customers-hub/requests/RequestsCenterPage.tsx`

---

## Page Structure

The Requests Center page consists of three main sections:

1. **Stats Cards Section** - Displays 6 statistical cards at the top
2. **Filters Section** - Contains dropdown filters and tab filters
3. **Grid Section** - Displays action cards in a responsive grid layout

---

## 1. STATS CARDS SECTION

### 1.1 Stats Cards Display

The page displays 6 stats cards in a single row (responsive grid: 2 columns on mobile, 6 columns on desktop).

**Stats Cards Data Structure:**

```typescript
interface RequestsStats {
  inbox: number;           // Count of incoming requests (new_inquiry, callback_request, whatsapp_incoming)
  followups: number;        // Count of follow-up requests (follow_up, site_visit)
  pending: number;         // Total count of pending + in_progress actions
  overdue: number;         // Count of actions with dueDate < current date
  today: number;           // Count of actions with dueDate = today
  completed: number;       // Count of completed actions
}
```

### 1.2 Stats Cards Endpoint

**Note:** Stats are now included in the main list endpoint. See section 4.1 for details.

**To get stats only:** Use `POST /api/v2/customers-hub/requests/list` with `includeStats: true` and `includeActions: false` in request body.

**Response structure:** Same as list endpoint stats section (see section 4.1).

**Calculation Logic:**

- `inbox`: Count actions where `type IN ['new_inquiry', 'callback_request', 'whatsapp_incoming']` AND `status IN ['pending', 'in_progress']` AND matches all active filters
- `followups`: Count actions where `type IN ['follow_up', 'site_visit']` AND `status IN ['pending', 'in_progress']` AND matches all active filters
- `pending`: Count all actions where `status IN ['pending', 'in_progress']` AND matches all active filters
- `overdue`: Count actions where `dueDate < current_date` AND `status IN ['pending', 'in_progress']` AND matches all active filters
- `today`: Count actions where `dueDate = current_date` AND `status IN ['pending', 'in_progress']` AND matches all active filters
- `completed`: Count actions where `status = 'completed'` AND matches all active filters (excluding searchQuery filter for completed tab)

---

## 2. FILTERS SECTION

### 2.1 Filter Types

The page contains two types of filters:

#### A. Dropdown Filters (Multiple Selection)
- **Source Filter** (`selectedSources`): Array of `CustomerSource` values
- **Priority Filter** (`selectedPriorities`): Array of `Priority` values
- **Type Filter** (`selectedTypes`): Array of `CustomerActionType` values
- **Assignee Filter** (`selectedAssignees`): Array of employee/user IDs
- **City Filter** (`selectedCities`): Array of city names (strings)
- **State/Region Filter** (`selectedStates`): Array of region names (strings)
- **Property Type Filter** (`selectedPropertyTypes`): Array of property type values

#### B. Tab Filters (Single Selection)
- **Active Tab** (`activeTab`): One of `"inbox" | "followups" | "all" | "completed"`

#### C. Special Filters
- **Search Query** (`searchQuery`): String - searches in `customerName`, `title`, `description`
- **Due Date Filter** (`dueDateFilter`): One of `"all" | "overdue" | "today" | "week" | "no_date"`
- **Budget Range** (`budgetMin`, `budgetMax`): Numbers - filters by customer preferences budget range

### 2.2 Filter Change Behavior

**CRITICAL:** When ANY filter changes (dropdown selection, tab change, search input, etc.), the frontend MUST send a new request to the backend with ALL current filter values in the request body.

**Filter Change Trigger Events:**
- User selects/deselects items in any dropdown filter
- User changes active tab
- User types in search input (with debounce - typically 300-500ms)
- User changes due date filter
- User changes budget min/max values
- User clears all filters

**Request Format:** All filters are sent in the request body, NOT as URL query parameters.

---

## 3. GRID SECTION - ACTION CARDS

### 3.1 Grid Layout

The grid displays action cards in a responsive layout:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Compact view: 1 column (when user toggles compact view)

### 3.2 Action Card Data Structure

Each card in the grid represents a `CustomerAction` with associated customer data.

**Required Data for Each Card:**

```typescript
interface ActionCardData {
  // Action Core Data
  action: {
    id: string;
    customerId: string;
    customerName: string;
    type: CustomerActionType;
    title: string;
    description?: string;
    priority: "urgent" | "high" | "medium" | "low";
    status: "pending" | "in_progress" | "completed" | "dismissed" | "snoozed";
    source: CustomerSource;
    dueDate?: string;  // ISO 8601 datetime string
    snoozedUntil?: string;  // ISO 8601 datetime string
    assignedTo?: string;  // Employee ID
    assignedToName?: string;  // Employee display name
    createdAt: string;  // ISO 8601 datetime string
    completedAt?: string;  // ISO 8601 datetime string
    completedBy?: string;  // Employee ID
    metadata?: Record<string, any>;  // Additional action-specific data
  };
  
  // Customer Data (Required for card display)
  customer: {
    id: string;
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    city?: string;
    stage: CustomerLifecycleStage;
    
    // Customer Preferences (for property request display)
    preferences?: {
      propertyType?: string[];  // ["villa", "apartment", "land", "commercial"]
      budgetMin?: number;
      budgetMax?: number;
      preferredAreas?: string[];
      preferredCities?: string[];
    };
    
    // AI Insights (for matching indicator)
    aiInsights?: {
      propertyMatches?: string[];  // Array of property IDs
    };
  };
  
  // Property Data (if action has associated property)
  property?: {
    title?: string;
    type?: string;
    price?: number;
    location?: string;
    fromPreferences?: boolean;  // true if derived from customer preferences, false if specific property
  };
}
```

### 3.3 Property Data Resolution

Property data can come from two sources (in priority order):

1. **Action Metadata** (`action.metadata`):
   - Check for: `propertyTitle`, `property_title`, `title`
   - Check for: `propertyType`, `property_type`, `type`
   - Check for: `propertyPrice`, `property_price`, `price`
   - Check for: `propertyLocation`, `property_location`, `location`, `address`
   - If found, set `fromPreferences: false`

2. **Customer Preferences** (fallback):
   - Extract from `customer.preferences`
   - Build property type from `preferences.propertyType` array (join with comma)
   - Build budget range from `preferences.budgetMin` and `preferences.budgetMax`
   - Build location from `preferences.preferredAreas` or `preferences.preferredCities`
   - If used, set `fromPreferences: true`

### 3.4 AI Matching Status

Each card displays an AI matching indicator:
- **Display:** `✨ {count}` if customer can be matched (has required fields)
- **Display:** `✨ —` if customer cannot be matched (missing required fields)

**Required Fields for AI Matching:**
- `propertyType` OR `purpose` (from customer preferences)
- `budgetMin` OR `budgetMax` (from customer preferences)
- `preferredAreas` OR `preferredCities` (from customer preferences)

**AI Matching Count:** Number of property IDs in `customer.aiInsights.propertyMatches` array.

---

## 4. MAIN ENDPOINT - GET FILTERED ACTIONS

### 4.1 Endpoint Specification

**Endpoint:** `POST /api/v2/customers-hub/requests/list`

**Method:** `POST` (using POST to send filters in body, not GET with query params)

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**

```json
{
  "filters": {
    "searchQuery": "string | null",
    "activeTab": "inbox | followups | all | completed",
    "selectedSources": ["whatsapp", "inquiry"],
    "selectedPriorities": ["urgent", "high"],
    "selectedTypes": ["new_inquiry", "callback_request"],
    "selectedAssignees": ["employee_id_1"],
    "dueDateFilter": "overdue | today | week | no_date | all",
    "selectedCities": ["الرياض", "جدة"],
    "selectedStates": ["الرياض", "مكة المكرمة"],
    "budgetMin": 500000,
    "budgetMax": 2000000,
    "selectedPropertyTypes": ["villa", "apartment"]
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "sortBy": "priority | dueDate | createdAt",
    "sortOrder": "asc | desc"
  },
  "includeStats": true,
  "includeActions": true
}
```

**Request Body Fields:**
- `filters`: Object containing all filter criteria (required)
- `pagination`: Object containing pagination and sorting (optional, defaults applied if not provided)
- `includeStats`: Boolean - If `true`, includes stats in response (default: `true`)
- `includeActions`: Boolean - If `true`, includes actions array in response (default: `true`)
  - Set `includeActions: false` to get only stats
  - Set `includeStats: false` to get only actions (without stats)

**Field Descriptions:**

**Filters:**
- `searchQuery`: Optional string. Searches in `action.customerName`, `action.title`, `action.description`. If null or empty, ignore this filter.
- `activeTab`: Required string. Determines which actions to return:
  - `"inbox"`: Return actions where `type IN ['new_inquiry', 'callback_request', 'whatsapp_incoming']` AND `status IN ['pending', 'in_progress']`
  - `"followups"`: Return actions where `type IN ['follow_up', 'site_visit']` AND `status IN ['pending', 'in_progress']`
  - `"all"`: Return all actions where `status IN ['pending', 'in_progress']`
  - `"completed"`: Return all actions where `status = 'completed'`
- `selectedSources`: Optional array. Filter by `action.source`. If empty array, ignore this filter.
- `selectedPriorities`: Optional array. Filter by `action.priority`. If empty array, ignore this filter.
- `selectedTypes`: Optional array. Filter by `action.type`. If empty array, ignore this filter.
- `selectedAssignees`: Optional array. Filter by `action.assignedTo`. If empty array, ignore this filter.
- `dueDateFilter`: Required string. Filter by due date:
  - `"all"`: No date filtering
  - `"overdue"`: `action.dueDate < current_date`
  - `"today"`: `action.dueDate = current_date` (same day)
  - `"week"`: `action.dueDate >= current_date AND action.dueDate <= current_date + 7 days`
  - `"no_date"`: `action.dueDate IS NULL`
- `selectedCities`: Optional array. Filter by `customer.city`. If empty array, ignore this filter.
- `selectedStates`: Optional array. Filter by customer's region/state (map city to region). If empty array, ignore this filter.
- `budgetMin`: Optional number. Filter customers where `customer.preferences.budgetMax >= budgetMin` OR `customer.preferences.budgetMin >= budgetMin`. If null, ignore this filter.
- `budgetMax`: Optional number. Filter customers where `customer.preferences.budgetMin <= budgetMax` OR `customer.preferences.budgetMax <= budgetMax`. If null, ignore this filter.
- `selectedPropertyTypes`: Optional array. Filter customers where `customer.preferences.propertyType` contains at least one of the selected types. If empty array, ignore this filter.

**Pagination:**
- `page`: Page number (1-indexed)
- `limit`: Items per page (default: 50, max: 100)
- `sortBy`: Sort field (optional). If not provided or null, defaults to `"createdAt"` (latest created first)
- `sortOrder`: Sort direction (optional). If not provided or null, defaults to `"desc"` (descending - newest first)

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "inbox": 15,
      "followups": 8,
      "pending": 23,
      "overdue": 3,
      "today": 5,
      "completed": 42
    },
    "actions": [
      {
        "action": {
          "id": "action_123",
          "customerId": "customer_456",
          "customerName": "أحمد محمد",
          "type": "new_inquiry",
          "title": "استفسار عن فيلا",
          "description": "يريد فيلا في الرياض",
          "priority": "high",
          "status": "pending",
          "source": "whatsapp",
          "dueDate": "2024-01-20T10:00:00Z",
          "assignedTo": "employee_789",
          "assignedToName": "محمد العلي",
          "createdAt": "2024-01-15T08:30:00Z",
          "metadata": {
            "propertyTitle": "فيلا للبيع",
            "propertyType": "villa",
            "propertyPrice": 1500000,
            "propertyLocation": "الرياض، حي النرجس"
          }
        },
        "customer": {
          "id": "customer_456",
          "name": "أحمد محمد",
          "phone": "+966501234567",
          "whatsapp": "+966501234567",
          "email": "ahmed@example.com",
          "city": "الرياض",
          "stage": "new_lead",
          "preferences": {
            "propertyType": ["villa"],
            "budgetMin": 1000000,
            "budgetMax": 2000000,
            "preferredAreas": ["حي النرجس", "حي العليا"],
            "preferredCities": ["الرياض"]
          },
          "aiInsights": {
            "propertyMatches": ["property_001", "property_002", "property_003"]
          }
        },
        "property": {
          "title": "فيلا للبيع",
          "type": "villa",
          "price": 1500000,
          "location": "الرياض، حي النرجس",
          "fromPreferences": false
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 23,
      "totalPages": 1
    }
  }
}
```

**Response Structure Notes:**
- `stats`: Included only if `includeStats: true` (default: true)
- `actions`: Included only if `includeActions: true` (default: true)
- `pagination`: Always included when `includeActions: true`
- If both `includeStats: false` and `includeActions: false`, return error

### 4.2 Filtering Logic Implementation

**Backend Filtering Steps:**

1. **Base Query:** Start with actions table joined with customers table
2. **Tab Filter:** Apply `activeTab` filter first to determine base action set
3. **Status Filter:** Apply status filter based on tab:
   - `inbox`, `followups`, `all`: `status IN ['pending', 'in_progress']`
   - `completed`: `status = 'completed'`
4. **Type Filter:** Apply type filter based on tab:
   - `inbox`: `type IN ['new_inquiry', 'callback_request', 'whatsapp_incoming']`
   - `followups`: `type IN ['follow_up', 'site_visit']`
   - `all`: No type restriction
   - `completed`: No type restriction
5. **Search Filter:** If `searchQuery` provided, search in:
   - `action.customerName` (LIKE/ILIKE)
   - `action.title` (LIKE/ILIKE)
   - `action.description` (LIKE/ILIKE)
6. **Source Filter:** If `selectedSources` not empty, filter by `action.source IN selectedSources`
7. **Priority Filter:** If `selectedPriorities` not empty, filter by `action.priority IN selectedPriorities`
8. **Type Filter:** If `selectedTypes` not empty, filter by `action.type IN selectedTypes`
9. **Assignee Filter:** If `selectedAssignees` not empty, filter by `action.assignedTo IN selectedAssignees`
10. **Due Date Filter:** Apply date filtering based on `dueDateFilter` value
11. **City Filter:** If `selectedCities` not empty, filter by `customer.city IN selectedCities`
12. **State Filter:** If `selectedStates` not empty, map cities to regions and filter
13. **Budget Filter:** If `budgetMin` or `budgetMax` provided, filter by customer preferences budget range
14. **Property Type Filter:** If `selectedPropertyTypes` not empty, filter by customer preferences property types
15. **Sorting:** Apply sorting based on `sortBy` and `sortOrder`:
   - If `sortBy` is not provided or null, default to `"createdAt"` with `sortOrder = "desc"` (latest created first)
   - If `sortOrder` is not provided or null, use default based on `sortBy` field
16. **Pagination:** Apply pagination based on `page` and `limit`

### 4.3 Sorting Priority

**Default Sorting (when sortBy is not provided or null):**
- Default: `sortBy = "createdAt"` with `sortOrder = "desc"`
- This means: **Latest created actions appear first** (newest to oldest)
- This is the natural/default behavior when no sorting is explicitly requested

**When `sortBy = "priority"`:**
- Use this order:
  1. `urgent` (highest)
  2. `high`
  3. `medium`
  4. `low` (lowest)
- Default `sortOrder` for priority: `"desc"` (highest priority first)

**When `sortBy = "dueDate"`:**
- Sort by `action.dueDate`
- Nulls last for ascending, nulls first for descending
- Default `sortOrder` for dueDate: `"asc"` (earliest due date first)

**When `sortBy = "createdAt"`:**
- Sort by `action.createdAt`
- Default `sortOrder` for createdAt: `"desc"` (newest first - latest created first)

---

## 5. SUPPORTING ENDPOINTS

### 5.1 Get Unique Filter Options

**Endpoint:** `GET /api/v2/customers-hub/requests/filter-options`

**Purpose:** Get available options for dropdown filters (cities, assignees, etc.)

**Request:** No body required (or optional tenant/context in headers)

**Response:**

```json
{
  "success": true,
  "data": {
    "cities": ["الرياض", "جدة", "الدمام", "الخبر"],
    "states": ["الرياض", "مكة المكرمة", "الشرقية"],
    "assignees": [
      {
        "id": "employee_789",
        "name": "محمد العلي",
        "email": "mohammed@example.com"
      }
    ],
    "propertyTypes": ["villa", "apartment", "land", "commercial"]
  }
}
```

### 5.2 Action Operations

**Single Action Operation:**

**Endpoint:** `POST /api/v2/customers-hub/requests/{actionId}`

**Request Body:**

```json
{
  "action": "complete | dismiss | snooze | add_note",
  "data": {
    // Operation-specific data (see below)
  }
}
```

**Action Types and Required Data:**

1. **Complete Action:**
   ```json
   {
     "action": "complete",
     "data": {
       "completedBy": "employee_id"
     }
   }
   ```

2. **Dismiss Action:**
   ```json
   {
     "action": "dismiss",
     "data": {
       "dismissedBy": "employee_id",
       "reason": "string (optional)"
     }
   }
   ```

3. **Snooze Action:**
   ```json
   {
     "action": "snooze",
     "data": {
       "snoozedUntil": "2024-01-25T10:00:00Z",
       "snoozedBy": "employee_id"
     }
   }
   ```

4. **Add Note:**
   ```json
   {
     "action": "add_note",
     "data": {
       "note": "string",
       "addedBy": "employee_id"
     }
   }
   ```

**Response:**
```json
{
  "success": true,
  "data": {
    "actionId": "action_123",
    "action": "complete",
    "updatedAt": "2024-01-20T10:00:00Z"
  }
}
```

**Bulk Operations:**

**Endpoint:** `POST /api/v2/customers-hub/requests/bulk`

**Request Body:**

```json
{
  "action": "complete | dismiss | snooze | assign | change_priority",
  "actionIds": ["action_1", "action_2", "action_3"],
  "data": {
    // Operation-specific data (see below)
  }
}
```

**Bulk Action Types and Required Data:**

1. **Bulk Complete:**
   ```json
   {
     "action": "complete",
     "actionIds": ["action_1", "action_2"],
     "data": {
       "completedBy": "employee_id"
     }
   }
   ```

2. **Bulk Dismiss:**
   ```json
   {
     "action": "dismiss",
     "actionIds": ["action_1", "action_2"],
     "data": {
       "dismissedBy": "employee_id",
       "reason": "string (optional)"
     }
   }
   ```

3. **Bulk Snooze:**
   ```json
   {
     "action": "snooze",
     "actionIds": ["action_1", "action_2"],
     "data": {
       "snoozedUntil": "2024-01-25T10:00:00Z",
       "snoozedBy": "employee_id"
     }
   }
   ```

4. **Bulk Assign:**
   ```json
   {
     "action": "assign",
     "actionIds": ["action_1", "action_2"],
     "data": {
       "assignedTo": "employee_id",
       "assignedToName": "employee_name"
     }
   }
   ```

5. **Bulk Change Priority:**
   ```json
   {
     "action": "change_priority",
     "actionIds": ["action_1", "action_2"],
     "data": {
       "priority": "urgent | high | medium | low"
     }
   }
   ```

**Response:**
```json
{
  "success": true,
  "data": {
    "action": "complete",
    "updatedCount": 3,
    "actionIds": ["action_1", "action_2", "action_3"]
  }
}
```

---

## 6. DATA TYPES REFERENCE

### 6.1 CustomerActionType

```typescript
type CustomerActionType = 
  | 'new_inquiry'        // New customer interested in property
  | 'callback_request'   // Customer requested callback
  | 'property_match'     // New property matches customer preferences
  | 'follow_up'          // Scheduled follow-up
  | 'document_required'  // Documents pending
  | 'payment_due'        // Payment reminder
  | 'site_visit'         // Site visit to schedule/confirm
  | 'whatsapp_incoming'  // New WhatsApp message
  | 'ai_recommended';    // AI-generated recommendation
```

### 6.2 CustomerSource

```typescript
type CustomerSource = 
  | 'inquiry'      // From website inquiry form
  | 'manual'       // Manually added by agent
  | 'whatsapp'     // From WhatsApp conversation
  | 'import'       // Bulk import
  | 'referral';    // Customer referral
```

### 6.3 Priority

```typescript
type Priority = 'low' | 'medium' | 'high' | 'urgent';
```

### 6.4 CustomerActionStatus

```typescript
type CustomerActionStatus = 'pending' | 'in_progress' | 'completed' | 'dismissed' | 'snoozed';
```

### 6.5 CustomerLifecycleStage

```typescript
type CustomerLifecycleStage =
  | 'new_lead'           // عميل جديد
  | 'qualified'          // مؤهل
  | 'property_matching'  // مطابقة العقارات
  | 'site_visit'         // معاينة
  | 'negotiation'        // تفاوض
  | 'contract_prep'      // إعداد العقد
  | 'down_payment'       // الدفعة الأولى
  | 'closing'            // إتمام الصفقة
  | 'post_sale';         // ما بعد البيع
```

---

## 7. ERROR HANDLING

### 7.1 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### 7.2 Common Error Codes

- `INVALID_FILTERS`: Invalid filter values provided
- `INVALID_PAGINATION`: Invalid pagination parameters
- `ACTION_NOT_FOUND`: Action ID not found
- `CUSTOMER_NOT_FOUND`: Customer ID not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `INTERNAL_ERROR`: Server error

---

## 8. IMPLEMENTATION NOTES

### 8.1 Request Frequency

- The frontend will send requests on every filter change
- Implement debouncing on the backend if needed (recommended: 100-200ms)
- **NO CACHING ALLOWED** - All requests must hit the database directly

### 8.2 Data Consistency

- Ensure customer data is always included with action data
- If customer is deleted, handle gracefully (return action with minimal customer data)
- If action is deleted, exclude from results

### 8.3 Date/Time Handling

- All dates must be in ISO 8601 format: `YYYY-MM-DDTHH:mm:ssZ`
- Use UTC timezone for all datetime fields
- When filtering by "today", use server's current date in appropriate timezone
- When filtering by "week", calculate 7 days from current date

---

## 9. PERFORMANCE OPTIMIZATION - CRITICAL FOR 50M+ ACTIONS

**MANDATORY:** This section contains **REQUIRED** optimizations for handling 50+ million actions and 20+ million customers. **ALL** optimizations must be implemented.

### 9.1 Database Indexing Strategy (MANDATORY)

**CRITICAL:** The following indexes are **REQUIRED** and must be created with optimal configuration:

#### 9.1.1 Actions Table Indexes

```sql
-- Primary composite index for main query pattern (status + type + createdAt)
CREATE INDEX idx_actions_status_type_created ON actions(status, type, created_at DESC) 
WHERE status IN ('pending', 'in_progress');

-- Priority-based query index
CREATE INDEX idx_actions_priority_created ON actions(priority, created_at DESC) 
WHERE status IN ('pending', 'in_progress');

-- Due date filtering index
CREATE INDEX idx_actions_due_date_status ON actions(due_date, status) 
WHERE due_date IS NOT NULL AND status IN ('pending', 'in_progress');

-- Assignee filtering index
CREATE INDEX idx_actions_assigned_status ON actions(assigned_to, status, created_at DESC) 
WHERE assigned_to IS NOT NULL AND status IN ('pending', 'in_progress');

-- Source filtering index
CREATE INDEX idx_actions_source_status ON actions(source, status, created_at DESC) 
WHERE status IN ('pending', 'in_progress');

-- Completed actions index (for completed tab)
CREATE INDEX idx_actions_completed_created ON actions(created_at DESC) 
WHERE status = 'completed';

-- Customer ID index (for joins)
CREATE INDEX idx_actions_customer_id ON actions(customer_id);

-- Composite index for tab-based queries (CRITICAL)
CREATE INDEX idx_actions_inbox ON actions(type, status, created_at DESC) 
WHERE type IN ('new_inquiry', 'callback_request', 'whatsapp_incoming') 
  AND status IN ('pending', 'in_progress');

CREATE INDEX idx_actions_followups ON actions(type, status, created_at DESC) 
WHERE type IN ('follow_up', 'site_visit') 
  AND status IN ('pending', 'in_progress');
```

#### 9.1.2 Customers Table Indexes

```sql
-- City filtering index
CREATE INDEX idx_customers_city ON customers(city) WHERE city IS NOT NULL;

-- Customer ID primary index (should already exist, but verify)
CREATE UNIQUE INDEX idx_customers_id ON customers(id);

-- Composite index for customer preferences filtering
CREATE INDEX idx_customers_prefs_budget ON customers(id) 
INCLUDE (preferences_budget_min, preferences_budget_max);

-- Property type filtering (if stored as JSONB or array)
CREATE INDEX idx_customers_prefs_property_type ON customers USING GIN(preferences_property_type);
```

#### 9.1.3 Join Optimization Indexes

```sql
-- Covering index for action-customer joins
CREATE INDEX idx_actions_customer_covering ON actions(customer_id, status, type, created_at DESC) 
INCLUDE (id, customer_name, priority, source, due_date, assigned_to, assigned_to_name)
WHERE status IN ('pending', 'in_progress');
```

### 9.2 Query Optimization Rules (MANDATORY)

#### 9.2.1 Query Execution Order

**CRITICAL:** Execute queries in this exact order for optimal performance:

1. **Apply status filter FIRST** (most selective)
   ```sql
   WHERE status IN ('pending', 'in_progress')  -- Use index idx_actions_status_type_created
   ```

2. **Apply type filter SECOND** (if tab-based)
   ```sql
   AND type IN ('new_inquiry', 'callback_request', 'whatsapp_incoming')  -- Use idx_actions_inbox
   ```

3. **Apply date filters THIRD** (if applicable)
   ```sql
   AND due_date < CURRENT_DATE  -- Use idx_actions_due_date_status
   ```

4. **Join with customers table** (use indexed join)
   ```sql
   INNER JOIN customers ON actions.customer_id = customers.id  -- Use idx_customers_id
   ```

5. **Apply customer-based filters** (city, state, budget, property type)
   ```sql
   AND customers.city IN ('الرياض', 'جدة')  -- Use idx_customers_city
   ```

6. **Apply remaining filters** (source, priority, assignee)
   ```sql
   AND actions.source IN ('whatsapp', 'inquiry')  -- Use idx_actions_source_status
   AND actions.priority IN ('urgent', 'high')  -- Use idx_actions_priority_created
   ```

7. **Apply search query LAST** (least selective, most expensive)
   ```sql
   AND (
     actions.customer_name ILIKE '%search%' OR
     actions.title ILIKE '%search%' OR
     actions.description ILIKE '%search%'
   )
   ```

8. **Sort and paginate**
   ```sql
   ORDER BY actions.created_at DESC  -- Use index for sorting
   LIMIT 50 OFFSET 0
   ```

#### 9.2.2 Query Hints and Execution Plans

**MANDATORY:** Use query hints to force optimal index usage:

```sql
-- Force index usage for main query
SELECT /*+ INDEX(actions idx_actions_status_type_created) */
  actions.*, customers.*
FROM actions
INNER JOIN customers ON actions.customer_id = customers.id
WHERE actions.status IN ('pending', 'in_progress')
  AND actions.type IN ('new_inquiry', 'callback_request')
ORDER BY actions.created_at DESC
LIMIT 50;
```

**REQUIRED:** Analyze query execution plans and ensure:
- Index scans (not table scans)
- Index-only scans when possible
- Join operations use indexed columns
- No sequential scans on large tables
- Query execution time < 100ms for typical queries

### 9.3 Pagination Limits (MANDATORY)

**STRICT LIMITS:**
- **Maximum page size:** 50 items (hard limit, cannot be exceeded)
- **Default page size:** 50 items
- **Maximum offset:** 10,000 (page 200 with limit 50)
  - If offset > 10,000, return error: `OFFSET_TOO_LARGE`
  - Recommend using cursor-based pagination for deep pagination

**Cursor-Based Pagination (Recommended for deep pages):**

```json
{
  "pagination": {
    "limit": 50,
    "cursor": "action_id_12345_created_at_2024-01-20T10:00:00Z"
  }
}
```

**Implementation:**
```sql
WHERE actions.created_at < '2024-01-20T10:00:00Z'
  OR (actions.created_at = '2024-01-20T10:00:00Z' AND actions.id < 'action_id_12345')
ORDER BY actions.created_at DESC, actions.id DESC
LIMIT 50;
```

### 9.4 Field Selection (MANDATORY)

**CRITICAL:** Only select fields that are actually needed. Do NOT use `SELECT *`.

**Required Fields Only:**

```sql
-- Actions table - select only required fields
SELECT 
  actions.id,
  actions.customer_id,
  actions.customer_name,
  actions.type,
  actions.title,
  actions.description,
  actions.priority,
  actions.status,
  actions.source,
  actions.due_date,
  actions.snoozed_until,
  actions.assigned_to,
  actions.assigned_to_name,
  actions.created_at,
  actions.completed_at,
  actions.completed_by,
  actions.metadata
FROM actions
```

```sql
-- Customers table - select only required fields
SELECT 
  customers.id,
  customers.name,
  customers.phone,
  customers.whatsapp,
  customers.email,
  customers.city,
  customers.stage,
  customers.preferences,
  customers.ai_insights
FROM customers
```

**DO NOT SELECT:**
- Unused customer fields (address, notes, interactions, appointments, etc.)
- Historical data (stage_history, etc.)
- Large text fields unless needed
- JSON fields unless needed

### 9.5 Database Connection Pooling (MANDATORY)

**REQUIRED Configuration:**
- **Connection pool size:** Minimum 50, Maximum 200 connections
- **Idle timeout:** 30 seconds
- **Max connection lifetime:** 1 hour
- **Connection timeout:** 5 seconds
- **Use read replicas** for all SELECT queries (see section 9.6)

### 9.6 Read Replicas (MANDATORY)

**CRITICAL:** All read operations (list, stats, filter-options) MUST use read replicas.

**Implementation:**
- Primary database: Write operations only (create, update, delete)
- Read replica(s): All SELECT queries
- Load balance across multiple read replicas
- Monitor replica lag (must be < 1 second)

**Query Routing:**
```sql
-- All SELECT queries go to read replica
SELECT ... FROM actions ...  -- → Read Replica

-- All write operations go to primary
INSERT/UPDATE/DELETE ...  -- → Primary Database
```

### 9.7 Database Partitioning (HIGHLY RECOMMENDED)

**Partition Actions Table by Created Date:**

```sql
-- Partition by month (recommended for 50M+ rows)
CREATE TABLE actions_2024_01 PARTITION OF actions
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE actions_2024_02 PARTITION OF actions
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- ... continue for each month
```

**Benefits:**
- Faster queries (only scan relevant partitions)
- Easier maintenance (drop old partitions)
- Better index performance per partition

**Query Optimization:**
- Add partition pruning to WHERE clause:
  ```sql
  WHERE created_at >= '2024-01-01' AND created_at < '2024-02-01'
  ```

### 9.8 Parallel Query Execution (MANDATORY)

**For Stats Calculation:**

Execute stats queries in parallel:

```sql
-- Parallel execution for stats
-- Query 1: Inbox count
SELECT COUNT(*) FROM actions WHERE ... AND type IN ('new_inquiry', ...);

-- Query 2: Followups count  
SELECT COUNT(*) FROM actions WHERE ... AND type IN ('follow_up', ...);

-- Query 3: Pending count
SELECT COUNT(*) FROM actions WHERE ... AND status IN ('pending', 'in_progress');

-- Query 4: Overdue count
SELECT COUNT(*) FROM actions WHERE ... AND due_date < CURRENT_DATE;

-- Query 5: Today count
SELECT COUNT(*) FROM actions WHERE ... AND due_date::date = CURRENT_DATE;

-- Query 6: Completed count
SELECT COUNT(*) FROM actions WHERE ... AND status = 'completed';
```

**Execute all 6 queries in parallel** (not sequentially) to reduce total execution time.

### 9.9 Response Streaming (RECOMMENDED)

**For Large Result Sets:**

- Stream response data as it's fetched (don't wait for all results)
- Use database cursors for large result sets
- Send response chunks as they're ready
- Client can start processing data immediately

### 9.10 Query Timeout Limits (MANDATORY)

**STRICT TIMEOUTS:**
- **List query timeout:** 2 seconds maximum
- **Stats query timeout:** 1 second maximum (per parallel query)
- **Filter options timeout:** 500ms maximum
- **Action operation timeout:** 1 second maximum

**If timeout exceeded:**
- Return error: `QUERY_TIMEOUT`
- Log query for optimization
- Consider adding more indexes or optimizing query

### 9.11 Database Query Monitoring (MANDATORY)

**REQUIRED Monitoring:**
- Log all queries taking > 100ms
- Monitor slow query log
- Track index usage statistics
- Alert on queries taking > 1 second
- Regular query plan analysis

### 9.12 Response Size Optimization

**MANDATORY Limits:**
- **Maximum response size:** 1MB
- **Compress responses** using gzip/brotli
- **Remove null/undefined fields** from JSON response
- **Minify JSON** (remove unnecessary whitespace)

### 9.13 Index Maintenance (MANDATORY)

**REQUIRED Operations:**
- **Regular index maintenance:** Weekly
- **Update statistics:** Daily
- **Rebuild indexes:** Monthly (if fragmentation > 30%)
- **Monitor index bloat:** Alert if > 20%

### 9.14 Query Result Caching Strategy

**NOTE:** User specified NO CACHING. However, for reference:
- **DO NOT cache** query results
- **DO NOT cache** stats calculations
- **DO NOT cache** filter options
- All queries must hit database directly

### 9.15 Performance Targets (MANDATORY)

**REQUIRED Response Times:**
- **List endpoint (50 items):** < 200ms (p95)
- **Stats endpoint:** < 300ms (p95) - all 6 stats in parallel
- **Filter options:** < 100ms (p95)
- **Action operation:** < 100ms (p95)
- **Bulk operation (100 items):** < 500ms (p95)

**Monitoring:**
- Track p50, p95, p99 response times
- Alert if p95 exceeds targets
- Daily performance reports

---

## 10. TESTING SCENARIOS

### 9.1 Filter Combinations

Test these filter combinations:

1. **Empty filters** - Return all actions for active tab
2. **Single filter** - Each filter type individually
3. **Multiple filters** - Combinations of 2-3 filters
4. **All filters** - All filters applied simultaneously
5. **Search + filters** - Search query with other filters
6. **Tab switching** - Different tabs with same filters
7. **Pagination** - Multiple pages with filters applied

### 9.2 Edge Cases

1. **No results** - Return empty array with `total: 0`
2. **Invalid filter values** - Return error with `INVALID_FILTERS`
3. **Missing customer data** - Return action with minimal customer data
4. **Null/undefined values** - Handle gracefully (ignore filter if null)
5. **Large result sets** - Ensure pagination works correctly
6. **Concurrent updates** - Handle action status changes during filtering

---

## 11. SUMMARY

### 10.1 Required Endpoints

1. `POST /api/v2/customers-hub/requests/list` - Get filtered actions with customer data and stats (use `includeStats` and `includeActions` flags)
2. `GET /api/v2/customers-hub/requests/filter-options` - Get available filter options
3. `POST /api/v2/customers-hub/requests/{actionId}` - Single action operation (complete, dismiss, snooze, add_note) - action type in request body
4. `POST /api/v2/customers-hub/requests/bulk` - Bulk operations (complete, dismiss, snooze, assign, change_priority) - action type in request body

### 10.2 Key Requirements

- **ALL filters must be sent in request body, NOT query parameters**
- **Request must be sent on EVERY filter change**
- **Response must include complete action data + customer data + property data**
- **Stats are included in list endpoint response (use `includeStats` flag)**
- **Action operations use single endpoint with action type in request body**
- **Bulk operations use single endpoint with action type in request body**
- **Support pagination, sorting, and all filter types**
- **Handle all edge cases gracefully**

### 11.3 Performance Requirements (CRITICAL - 50M+ Actions)

**MANDATORY:** All performance optimizations from Section 9 must be implemented:

- **Database Indexing:** All indexes from section 9.1 are REQUIRED
- **Query Optimization:** Follow exact query execution order from section 9.2
- **Pagination Limits:** Maximum 50 items per page, maximum offset 10,000
- **Field Selection:** Only select required fields, never use SELECT *
- **Read Replicas:** All SELECT queries must use read replicas
- **Connection Pooling:** Minimum 50, maximum 200 connections
- **Parallel Execution:** Stats queries must execute in parallel
- **Query Timeouts:** Strict timeout limits (2s for list, 1s for stats)
- **Response Times:** p95 < 200ms for list, < 300ms for stats
- **NO CACHING:** All queries must hit database directly (no caching allowed)

**See Section 9 for complete performance optimization requirements.**

---

**END OF SPECIFICATION**
