# Customers Hub Request Detail Page - Backend API Integration Specification

## Overview

This document provides complete technical specifications for integrating the **Customers Hub Request Detail Page** (`/dashboard/customers-hub/requests/[requestId]`) with the backend API. This specification is designed for AI systems to implement the backend endpoints and data structures.

**Page Location:** `app/dashboard/customers-hub/requests/[requestId]/page.tsx`  
**Component:** `components/customers-hub/requests/RequestDetailPage.tsx`

**CRITICAL PERFORMANCE REQUIREMENT:** This system handles **MILLIONS of records** (actions, customers, property interests). **ALL** performance optimizations in Section 11 are **MANDATORY**. Response times must be **extremely fast** (< 50ms for detail, < 200ms for stats). **NO CACHING** is allowed - all queries must hit database directly with optimal indexing and query optimization.

---

## Page Structure

The Request Detail page consists of the following main sections:

1. **Stats Cards Section** - Displays statistical cards at the top (see Section 1)
2. **Filters Section** - Contains dropdown filters and tab filters (see Section 2)
3. **Related Actions Grid** - Displays related actions for the same customer in a grid (see Section 3)
4. **Request Information Card** - Displays action details and metadata (see Section 4)
5. **Property/Preferences Information Card** - Shows property info or customer preferences (see Section 6)
6. **AI Matching Section** - Displays matched properties in a grid layout (see Section 7)
7. **Notes Section** - Action notes and ability to add new notes (see Section 4.2)
8. **Customer Summary Card (Sidebar)** - Customer information and contact details (see Section 4.2)
9. **Action Buttons (Sidebar)** - Complete, schedule, snooze, dismiss actions (see Section 8)

---

## 1. STATS CARDS SECTION

### 1.1 Stats Cards Display

The page displays stats cards showing related statistics for the current request/action.

**Stats Cards Data Structure:**

```typescript
interface RequestDetailStats {
  relatedActions: number;      // Count of related actions for same customer
  totalInteractions: number;    // Total customer interactions
  appointmentsCount: number;    // Count of customer appointments
  matchedProperties: number;    // Count of AI-matched properties
  pendingActions: number;       // Count of pending actions for customer
  completedActions: number;     // Count of completed actions for customer
}
```

### 1.2 Stats Cards Endpoint

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}/stats`

**Request Body:** (All filters must be sent in request body, NOT query parameters)

```json
{
  "filters": {
    "selectedSources": ["whatsapp", "inquiry", "manual", "referral", "import"],
    "selectedPriorities": ["urgent", "high", "medium", "low"],
    "selectedTypes": [
      "new_inquiry",
      "callback_request",
      "property_match",
      "follow_up",
      "document_required",
      "payment_due",
      "site_visit",
      "whatsapp_incoming",
      "ai_recommended"
    ],
    "selectedStatuses": ["pending", "in_progress", "completed", "dismissed", "snoozed"],
    "dateRange": {
      "from": "2024-01-01T00:00:00Z",
      "to": "2024-12-31T23:59:59Z"
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "relatedActions": 5,
    "totalInteractions": 12,
    "appointmentsCount": 3,
    "matchedProperties": 3,
    "pendingActions": 2,
    "completedActions": 8
  }
}
```

**Calculation Logic:**

- `relatedActions`: Count actions where `customerId = request.customerId` AND matches all active filters
- `totalInteractions`: Count from `customer.interactions` array
- `appointmentsCount`: Count from `customer.appointments` array where `status != 'cancelled'`
- `matchedProperties`: Count of property IDs in `customer.aiInsights.propertyMatches`
- `pendingActions`: Count actions where `customerId = request.customerId` AND `status IN ['pending', 'in_progress']` AND matches all active filters
- `completedActions`: Count actions where `customerId = request.customerId` AND `status = 'completed'` AND matches all active filters

---

## 2. FILTERS SECTION

### 2.1 Filter Types

The page contains two types of filters:

#### A. Dropdown Filters (Multiple Selection)
- **Source Filter** (`selectedSources`): Array of `CustomerSource` values
- **Priority Filter** (`selectedPriorities`): Array of `Priority` values
- **Type Filter** (`selectedTypes`): Array of `CustomerActionType` values
- **Status Filter** (`selectedStatuses`): Array of `CustomerActionStatus` values

#### B. Tab Filters (Single Selection)
- **Active Tab** (`activeTab`): One of `"all" | "pending" | "completed" | "related"`

#### C. Special Filters
- **Date Range Filter** (`dateRange`): Object with `from` and `to` ISO 8601 datetime strings

### 2.2 Filter Change Behavior

**CRITICAL:** When ANY filter changes (dropdown selection, tab change, date range change, etc.), the frontend MUST send a new request to the backend with ALL current filter values in the request body.

**Filter Change Trigger Events:**
- User selects/deselects items in any dropdown filter
- User changes active tab
- User changes date range
- User clears all filters

**Request Format:** All filters are sent in the request body, NOT as URL query parameters.

---

## 3. GRID SECTION - RELATED ACTIONS

### 3.1 Grid Layout

The grid displays related action cards in a responsive layout:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

### 3.2 Action Card Data Structure

Each card in the grid represents a related `CustomerAction` for the same customer.

**Required Data for Each Card:**

```typescript
interface RelatedActionCardData {
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
    dueDate?: string;
    assignedToName?: string;
    createdAt: string;
  };
}
```

---

## 4. MAIN ENDPOINT - GET REQUEST DETAIL

### 4.1 Endpoint Specification

**Endpoint:** `GET /api/v2/customers-hub/requests/{requestId}`

**Method:** `GET`

**Path Parameters:**
- `requestId`: string (required) - The action/request ID

**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action_123",
      "customerId": "customer_456",
      "customerName": "أحمد محمد",
      "type": "new_inquiry",
      "title": "استفسار عن فيلا",
      "description": "يريد فيلا في الرياض بمساحة كبيرة",
      "priority": "high",
      "status": "pending",
      "source": "whatsapp",
      "dueDate": "2024-01-20T10:00:00Z",
      "snoozedUntil": null,
      "assignedTo": "employee_789",
      "assignedToName": "محمد العلي",
      "createdAt": "2024-01-15T08:30:00Z",
      "completedAt": null,
      "completedBy": null,
      "metadata": {
        "propertyTitle": "فيلا للبيع",
        "propertyType": "villa",
        "propertyPrice": 1500000,
        "propertyLocation": "الرياض، حي النرجس",
        "notes": "العميل مهتم جداً"
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
      "totalInteractions": 5,
      "preferences": {
        "propertyType": ["villa"],
        "budgetMin": 1000000,
        "budgetMax": 2000000,
        "preferredAreas": ["حي النرجس", "حي العليا"],
        "preferredCities": ["الرياض"],
        "bedrooms": 4
      },
      "aiInsights": {
        "propertyMatches": ["property_001", "property_002", "property_003"]
      },
      "properties": [
        {
          "id": "prop_int_001",
          "propertyId": "property_001",
          "propertyTitle": "فيلا فاخرة في حي النرجس",
          "propertyTitleEn": "Luxury Villa in Al-Nargis District",
          "propertyImage": "https://example.com/property1.jpg",
          "propertyPrice": 1500000,
          "propertyType": "villa",
          "propertyLocation": "الرياض، حي النرجس",
          "status": "interested",
          "addedAt": "2024-01-16T10:00:00Z",
          "viewedAt": null,
          "feedback": null,
          "rating": null,
          "notes": null
        },
        {
          "id": "prop_int_002",
          "propertyId": "property_002",
          "propertyTitle": "فيلا حديثة في حي العليا",
          "propertyTitleEn": "Modern Villa in Al-Olya District",
          "propertyImage": "https://example.com/property2.jpg",
          "propertyPrice": 1800000,
          "propertyType": "villa",
          "propertyLocation": "الرياض، حي العليا",
          "status": "viewing_scheduled",
          "addedAt": "2024-01-17T14:00:00Z",
          "viewedAt": null,
          "feedback": null,
          "rating": null,
          "notes": null
        }
      ]
    }
  }
}
```

### 4.2 Required Data Structure

**CRITICAL:** The following data structure must be returned exactly as specified. All fields listed are required for proper page rendering.

**Action Data (Required):**
- All fields from `CustomerAction` type (see types reference):
  - `id`: Action ID
  - `customerId`: Customer ID
  - `customerName`: Customer name
  - `type`: Action type (CustomerActionType)
  - `title`: Action title
  - `description`: Action description (optional)
  - `priority`: Priority level (urgent, high, medium, low)
  - `status`: Action status (pending, in_progress, completed, dismissed, snoozed)
  - `source`: Action source (CustomerSource)
  - `dueDate`: Due date (ISO 8601, optional) - used to calculate `isOverdue` on frontend
  - `snoozedUntil`: Snoozed until date (ISO 8601, optional)
  - `assignedTo`: Assigned employee ID (optional)
  - `assignedToName`: Assigned employee name (optional) - **REQUIRED if assignedTo exists**
  - `createdAt`: Creation date (ISO 8601)
  - `completedAt`: Completion date (ISO 8601, optional)
  - `completedBy`: Employee ID who completed (optional)
- `metadata` object with property information (if available):
  - `propertyTitle` or `property_title`: Property title
  - `propertyType` or `property_type`: Property type
  - `propertyPrice` or `property_price`: Property price
  - `propertyLocation` or `property_location`: Property location
  - `notes`: Action notes (stored in metadata.notes)

**Customer Data (Required):**
- Core customer information:
  - `id`: Customer ID
  - `name`: Customer name (used for avatar initial - first character)
  - `phone`: Phone number (required)
  - `whatsapp`: WhatsApp number (optional)
  - `email`: Email address (optional)
  - `city`: City name (optional)
  - `stage`: Customer lifecycle stage (required for badge display)
- `totalInteractions`: Total interactions count (number, required for stats display)
- `preferences` object with property preferences:
  - `propertyType`: Array of property types (e.g., ["villa", "apartment"])
  - `budgetMin`: Minimum budget (number, optional)
  - `budgetMax`: Maximum budget (number, optional)
  - `preferredAreas`: Array of preferred areas (strings, optional)
  - `preferredCities`: Array of preferred cities (strings, optional)
  - `bedrooms`: Number of bedrooms (number, optional)
- `aiInsights.propertyMatches`: Array of property IDs (string[], required for AI matching)
- `properties`: Array of `PropertyInterest` objects (filtered by AI matches - see below)

**Property Interest Data (Required for AI Matching Grid):**
- `id`: Property interest ID (required)
- `propertyId`: Property ID (required, must be in `aiInsights.propertyMatches` array)
- `propertyTitle`: Property title in Arabic (required, displayed as heading)
- `propertyTitleEn`: Property title in English (optional)
- `propertyImage`: Property image URL (optional, displayed as background image in card if available)
- `propertyPrice`: Property price in SAR (number, optional, displayed as "Xk ر.س" format)
- `propertyType`: Property type (string, optional, displayed as badge)
- `propertyLocation`: Property location (string, optional, displayed with MapPin icon)
- `status`: Interest status (required, displayed as badge with Arabic labels):
  - `interested`: "مهتم"
  - `viewing_scheduled`: "معاينة مجدولة"
  - `viewed`: "تمت المعاينة"
  - `liked`: "معجب"
  - `rejected`: "مرفوض"
  - `offer_made`: "عرض مقدم"
- `addedAt`: When property was added to customer interests (ISO 8601, required, displayed as "أضيف: [date]")
- `viewedAt`: When customer viewed property (ISO 8601, optional)
- `feedback`: Customer feedback (string, optional)
- `rating`: Customer rating 1-5 (number, optional)
- `notes`: Additional notes (string, optional)

---

## 5. GET RELATED ACTIONS (FOR GRID)

### 5.1 Endpoint Specification

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}/related`

**Method:** `POST` (using POST to send filters in body)

**Path Parameters:**
- `requestId`: string (required) - The action/request ID

**Request Body:**

```json
{
  "filters": {
    "selectedSources": ["whatsapp", "inquiry"],
    "selectedPriorities": ["urgent", "high"],
    "selectedTypes": ["new_inquiry", "callback_request"],
    "selectedStatuses": ["pending", "in_progress"],
    "dateRange": {
      "from": "2024-01-01T00:00:00Z",
      "to": "2024-12-31T23:59:59Z"
    }
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "actions": [
      {
        "action": {
          "id": "action_124",
          "customerId": "customer_456",
          "customerName": "أحمد محمد",
          "type": "follow_up",
          "title": "متابعة الطلب",
          "description": "متابعة مع العميل",
          "priority": "medium",
          "status": "pending",
          "source": "manual",
          "dueDate": "2024-01-22T10:00:00Z",
          "assignedToName": "محمد العلي",
          "createdAt": "2024-01-18T08:30:00Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

**Filtering Logic:**
- Base query: Actions where `customerId = request.customerId` AND `id != requestId`
- Apply all filters from request body
- Sort by `createdAt DESC` (latest first) by default
- Apply pagination

---

## 6. PROPERTY DATA RESOLUTION

### 6.1 Property Information Priority

Property information can come from two sources (in priority order):

1. **Action Metadata** (`action.metadata`):
   - Check for: `propertyTitle`, `property_title`
   - Check for: `propertyType`, `property_type`
   - Check for: `propertyPrice`, `property_price`
   - Check for: `propertyLocation`, `property_location`
   - If found, display as "معلومات العقار" (Property Information)

2. **Customer Preferences** (fallback):
   - Extract from `customer.preferences`
   - Build property type from `preferences.propertyType` array
   - Build budget range from `preferences.budgetMin` and `preferences.budgetMax`
   - Build location from `preferences.preferredAreas`
   - Extract bedrooms from `preferences.bedrooms`
   - If used, display as "تفضيلات العميل" (Customer Preferences)

---

## 7. AI MATCHING SECTION

### 7.1 AI Matching Status

The page displays an AI matching section that shows properties matched to customer preferences.

**AI Matching Logic:**
- Customer can be matched if:
  - `customer.preferences.propertyType` has at least one value
  - AND (`customer.preferences.budgetMin > 0` OR `customer.preferences.preferredAreas.length > 0`)
- Match count: Number of property IDs in `customer.aiInsights.propertyMatches` array

**Matched Properties Display:**
- Filter `customer.properties` array to only include properties where `propertyId` is in `customer.aiInsights.propertyMatches`
- Display in grid layout (2 columns on desktop, 1 column on mobile)
- Each property card shows:
  - Property image (if available)
  - Property title
  - Property location
  - Property type badge
  - Property status badge
  - Property price
  - Added date
  - "View Details" button

**Property Status Values:**
- `interested`: "مهتم"
- `viewing_scheduled`: "معاينة مجدولة"
- `viewed`: "تمت المعاينة"
- `liked`: "معجب"
- `rejected`: "مرفوض"
- `offer_made`: "عرض مقدم"

---

## 8. ACTION OPERATIONS

### 8.1 Complete Action

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}`

**Request Body:**
```json
{
  "action": "complete",
  "data": {
    "completedBy": "employee_id"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "actionId": "action_123",
    "status": "completed",
    "completedAt": "2024-01-20T10:00:00Z",
    "completedBy": "employee_id"
  }
}
```

### 8.2 Dismiss Action

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}`

**Request Body:**
```json
{
  "action": "dismiss",
  "data": {
    "dismissedBy": "employee_id",
    "reason": "string (optional)"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "actionId": "action_123",
    "status": "dismissed",
    "dismissedAt": "2024-01-20T10:00:00Z",
    "dismissedBy": "employee_id"
  }
}
```

### 8.3 Snooze Action

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}`

**Request Body:**
```json
{
  "action": "snooze",
  "data": {
    "snoozedUntil": "2024-01-25T10:00:00Z",
    "snoozedBy": "employee_id"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "actionId": "action_123",
    "status": "snoozed",
    "snoozedUntil": "2024-01-25T10:00:00Z",
    "snoozedBy": "employee_id"
  }
}
```

### 8.4 Add Note to Action

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}`

**Request Body:**
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
    "note": "string",
    "addedAt": "2024-01-20T10:00:00Z",
    "addedBy": "employee_id"
  }
}
```

**Note:** The note is stored in `action.metadata.notes` field.

### 8.5 Schedule Appointment

**Endpoint:** `POST /api/v2/customers-hub/customers/{customerId}/appointments`

**Request Body:**
```json
{
  "type": "site_visit | office_meeting | phone_call | video_call | contract_signing | other",
  "date": "2024-01-25T10:00:00Z",
  "time": "10:00",
  "datetime": "2024-01-25T10:00:00Z",
  "duration": 30,
  "notes": "string (optional)",
  "propertyId": "property_id (optional)",
  "propertyTitle": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": "apt_123",
      "title": "معاينة عقار",
      "type": "site_visit",
      "date": "2024-01-25T10:00:00Z",
      "time": "10:00",
      "datetime": "2024-01-25T10:00:00Z",
      "duration": 30,
      "status": "scheduled",
      "priority": "medium",
      "notes": "string",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

---

## 9. DATA TYPES REFERENCE

### 9.1 CustomerActionType

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

### 9.2 CustomerActionStatus

```typescript
type CustomerActionStatus = 'pending' | 'in_progress' | 'completed' | 'dismissed' | 'snoozed';
```

### 9.3 Priority

```typescript
type Priority = 'low' | 'medium' | 'high' | 'urgent';
```

### 9.4 PropertyInterest Status

```typescript
type PropertyInterestStatus = 
  | 'interested'         // Customer is interested
  | 'viewing_scheduled'  // Viewing appointment scheduled
  | 'viewed'             // Customer has viewed property
  | 'liked'              // Customer liked the property
  | 'rejected'            // Customer rejected the property
  | 'offer_made';        // Offer has been made
```

### 9.5 Appointment Type

```typescript
type AppointmentType = 
  | 'site_visit'         // Property viewing
  | 'office_meeting'     // Office meeting
  | 'phone_call'         // Phone call
  | 'video_call'         // Video call
  | 'contract_signing'   // Contract signing
  | 'other';             // Other
```

---

## 10. ERROR HANDLING

### 10.1 Error Response Format

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

### 10.2 Common Error Codes

- `REQUEST_NOT_FOUND`: Request/action ID not found
- `CUSTOMER_NOT_FOUND`: Customer ID not found
- `INVALID_ACTION_TYPE`: Invalid action type in request body
- `INVALID_APPOINTMENT_DATA`: Invalid appointment data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `INTERNAL_ERROR`: Server error

---

## 11. PERFORMANCE OPTIMIZATION - CRITICAL FOR MILLIONS OF RECORDS

**MANDATORY:** This section contains **REQUIRED** optimizations for handling millions of actions, customers, and property interests. **ALL** optimizations must be implemented for maximum performance.

### 11.1 Database Indexing (MANDATORY)

**CRITICAL:** The following indexes are **REQUIRED** and must be created with optimal configuration:

```sql
-- Primary index for action lookup (CRITICAL - used in every request)
CREATE UNIQUE INDEX idx_actions_id ON actions(id);

-- Customer ID index for joins (CRITICAL - used in every request)
CREATE INDEX idx_actions_customer_id ON actions(customer_id);

-- Customer ID primary index (CRITICAL - used in every request)
CREATE UNIQUE INDEX idx_customers_id ON customers(id);

-- Property interests index for customer (CRITICAL - used for AI matching grid)
CREATE INDEX idx_property_interests_customer ON property_interests(customer_id);

-- Property interests index for property ID (CRITICAL - used for filtering)
CREATE INDEX idx_property_interests_property ON property_interests(property_id);

-- Composite index for related actions query (CRITICAL - used in related actions endpoint)
CREATE INDEX idx_actions_customer_status_created ON actions(customer_id, status, created_at DESC);

-- Composite index for stats calculation (CRITICAL - used in stats endpoint)
CREATE INDEX idx_actions_customer_status_type ON actions(customer_id, status, type) 
WHERE status IN ('pending', 'in_progress', 'completed');

-- Covering index for related actions (includes all needed fields)
CREATE INDEX idx_actions_customer_covering ON actions(customer_id, status, created_at DESC)
INCLUDE (id, customer_name, type, title, priority, source, due_date, assigned_to_name)
WHERE customer_id IS NOT NULL;
```

### 11.2 Query Optimization (MANDATORY)

**CRITICAL Query Execution Order:**

1. **Fetch action by ID FIRST** (use primary key - fastest):
   ```sql
   SELECT * FROM actions WHERE id = ?  -- Use idx_actions_id (instant)
   ```

2. **Fetch customer by ID SECOND** (use primary key - fastest):
   ```sql
   SELECT * FROM customers WHERE id = ?  -- Use idx_customers_id (instant)
   ```

3. **Fetch property interests THIRD** (use indexed join):
   ```sql
   SELECT * FROM property_interests 
   WHERE customer_id = ? 
     AND property_id IN (?, ?, ?)  -- Use idx_property_interests_customer (fast)
   ```

4. **For related actions query** (use composite index):
   ```sql
   SELECT * FROM actions 
   WHERE customer_id = ? 
     AND id != ?  -- Exclude current action
     AND status IN (?, ?)  -- Apply status filter
   ORDER BY created_at DESC  -- Use idx_actions_customer_status_created (fast)
   LIMIT 50;
   ```

5. **For stats calculation** (use composite index):
   ```sql
   SELECT COUNT(*) FROM actions 
   WHERE customer_id = ? 
     AND status IN (?, ?)  -- Use idx_actions_customer_status_type (fast)
   ```

**MANDATORY Query Hints:**
```sql
-- Force index usage for optimal performance
SELECT /*+ INDEX(actions idx_actions_id) */
  * FROM actions WHERE id = ?;

SELECT /*+ INDEX(customers idx_customers_id) */
  * FROM customers WHERE id = ?;

SELECT /*+ INDEX(property_interests idx_property_interests_customer) */
  * FROM property_interests WHERE customer_id = ?;
```

### 11.3 Field Selection (MANDATORY)

**CRITICAL:** Only select fields that are actually needed. Do NOT use `SELECT *`.

**Required Fields Only for Request Detail:**
```sql
-- Actions table - select only required fields
SELECT 
  id, customer_id, customer_name, type, title, description,
  priority, status, source, due_date, snoozed_until,
  assigned_to, assigned_to_name, created_at, completed_at, completed_by,
  metadata
FROM actions WHERE id = ?;
```

```sql
-- Customers table - select only required fields
SELECT 
  id, name, phone, whatsapp, email, city, stage, total_interactions,
  preferences, ai_insights
FROM customers WHERE id = ?;
```

```sql
-- Property interests - select only required fields
SELECT 
  id, property_id, property_title, property_title_en, property_image,
  property_price, property_type, property_location, status, added_at
FROM property_interests 
WHERE customer_id = ? AND property_id IN (?, ?, ?);
```

**DO NOT SELECT:**
- Unused customer fields (address, notes, interactions array, appointments array, etc.)
- Historical data (stage_history, etc.)
- Large text fields unless needed
- JSON fields unless needed

### 11.4 Read Replicas (MANDATORY)

**CRITICAL:** All read operations MUST use read replicas.

**Implementation:**
- Primary database: Write operations only (create, update, delete)
- Read replica(s): All SELECT queries
- Load balance across multiple read replicas
- Monitor replica lag (must be < 1 second)

**Query Routing:**
```sql
-- All SELECT queries go to read replica
SELECT ... FROM actions ...  -- → Read Replica
SELECT ... FROM customers ...  -- → Read Replica
SELECT ... FROM property_interests ...  -- → Read Replica

-- All write operations go to primary
INSERT/UPDATE/DELETE ...  -- → Primary Database
```

### 11.5 Database Connection Pooling (MANDATORY)

**REQUIRED Configuration:**
- **Connection pool size:** Minimum 50, Maximum 200 connections
- **Idle timeout:** 30 seconds
- **Max connection lifetime:** 1 hour
- **Connection timeout:** 5 seconds
- **Use read replicas** for all SELECT queries

### 11.6 Query Timeout Limits (MANDATORY)

**STRICT TIMEOUTS:**
- **Get request detail timeout:** 100ms maximum
- **Get stats timeout:** 200ms maximum
- **Get related actions timeout:** 300ms maximum
- **Action operation timeout:** 200ms maximum
- **Schedule appointment timeout:** 200ms maximum

**If timeout exceeded:**
- Return error: `QUERY_TIMEOUT`
- Log query for optimization
- Consider adding more indexes or optimizing query

### 11.7 Parallel Query Execution (MANDATORY)

**For Stats Calculation:**

Execute stats queries in parallel:

```sql
-- Parallel execution for stats (all 6 queries at once)
-- Query 1: Related actions count
SELECT COUNT(*) FROM actions WHERE customer_id = ? AND ...;

-- Query 2: Total interactions count
SELECT COUNT(*) FROM customer_interactions WHERE customer_id = ?;

-- Query 3: Appointments count
SELECT COUNT(*) FROM appointments WHERE customer_id = ? AND status != 'cancelled';

-- Query 4: Matched properties count
SELECT array_length(ai_insights->'propertyMatches', 1) FROM customers WHERE id = ?;

-- Query 5: Pending actions count
SELECT COUNT(*) FROM actions WHERE customer_id = ? AND status IN ('pending', 'in_progress') AND ...;

-- Query 6: Completed actions count
SELECT COUNT(*) FROM actions WHERE customer_id = ? AND status = 'completed' AND ...;
```

**Execute all 6 queries in parallel** (not sequentially) to reduce total execution time.

### 11.8 Response Size Optimization (MANDATORY)

**MANDATORY Limits:**
- **Maximum response size:** 500KB
- **Compress responses** using gzip/brotli
- **Remove null/undefined fields** from JSON response
- **Minify JSON** (remove unnecessary whitespace)
- **Limit property interests array** to maximum 20 items (if more, paginate)

### 11.9 Database Query Monitoring (MANDATORY)

**REQUIRED Monitoring:**
- Log all queries taking > 50ms
- Monitor slow query log
- Track index usage statistics
- Alert on queries taking > 100ms
- Regular query plan analysis

### 11.10 Index Maintenance (MANDATORY)

**REQUIRED Operations:**
- **Regular index maintenance:** Weekly
- **Update statistics:** Daily
- **Rebuild indexes:** Monthly (if fragmentation > 30%)
- **Monitor index bloat:** Alert if > 20%

### 11.11 Performance Targets (MANDATORY)

**REQUIRED Response Times:**
- **Get request detail:** < 50ms (p95)
- **Get stats:** < 200ms (p95) - all 6 stats in parallel
- **Get related actions:** < 150ms (p95)
- **Action operation:** < 100ms (p95)
- **Schedule appointment:** < 100ms (p95)

**Monitoring:**
- Track p50, p95, p99 response times
- Alert if p95 exceeds targets
- Daily performance reports

### 11.12 NO CACHING Policy

**NOTE:** User specified NO CACHING. However, for reference:
- **DO NOT cache** query results
- **DO NOT cache** stats calculations
- **DO NOT cache** related actions
- All queries must hit database directly

### 11.13 Property Interests Query Optimization

**CRITICAL:** When fetching property interests for AI matching grid:

```sql
-- Optimized query with IN clause (faster than multiple OR conditions)
SELECT * FROM property_interests 
WHERE customer_id = ? 
  AND property_id = ANY(ARRAY[?, ?, ?])  -- Use array for IN clause
ORDER BY added_at DESC
LIMIT 20;  -- Limit to 20 properties maximum
```

**Use array parameter binding** instead of string concatenation for IN clause.

### 11.14 Related Actions Query Optimization

**CRITICAL:** When fetching related actions:

```sql
-- Use covering index to avoid table lookup
SELECT 
  id, customer_id, customer_name, type, title, priority, 
  status, source, due_date, assigned_to_name, created_at
FROM actions 
WHERE customer_id = ? 
  AND id != ?  -- Exclude current action
  AND status IN (?, ?)  -- Apply status filter
ORDER BY created_at DESC
LIMIT 50 OFFSET ?;
```

**Use covering index** (`idx_actions_customer_covering`) to avoid table lookup.

### 11.15 Stats Query Optimization

**CRITICAL:** Stats queries must be optimized for speed:

```sql
-- Use COUNT(*) with indexed WHERE clause (faster than COUNT(id))
SELECT COUNT(*) FROM actions 
WHERE customer_id = ? 
  AND status IN (?, ?)  -- Use idx_actions_customer_status_type
  AND type IN (?, ?, ?);  -- Apply type filter if needed
```

**Use COUNT(*)** instead of COUNT(id) for better performance.

**For array length (matched properties):**
```sql
-- Extract array length directly (faster than counting)
SELECT 
  jsonb_array_length(ai_insights->'propertyMatches') as match_count
FROM customers 
WHERE id = ?;
```

### 11.16 Response Streaming (RECOMMENDED)

**For Large Property Interests Arrays:**

- Stream response data as it's fetched (don't wait for all results)
- Use database cursors for large result sets
- Send response chunks as they're ready
- Client can start processing data immediately

### 11.17 Database Partitioning (HIGHLY RECOMMENDED)

**Partition Actions Table by Customer ID or Date:**

```sql
-- Partition by customer_id hash (for millions of customers)
CREATE TABLE actions_customer_1 PARTITION OF actions
FOR VALUES WITH (MODULUS 10, REMAINDER 0);

-- Or partition by created date (for time-based queries)
CREATE TABLE actions_2024_01 PARTITION OF actions
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

**Benefits:**
- Faster queries (only scan relevant partitions)
- Easier maintenance (drop old partitions)
- Better index performance per partition

---

## 12. SUMMARY

### 12.1 Required Endpoints

1. `GET /api/v2/customers-hub/requests/{requestId}` - Get request detail with action, customer, and matched properties
2. `POST /api/v2/customers-hub/requests/{requestId}/stats` - Get statistics for stats cards (with filters in request body)
3. `POST /api/v2/customers-hub/requests/{requestId}/related` - Get related actions for grid (with filters in request body)
4. `POST /api/v2/customers-hub/requests/{requestId}` - Action operations (complete, dismiss, snooze, add_note)
5. `POST /api/v2/customers-hub/customers/{customerId}/appointments` - Schedule appointment

### 12.2 Key Requirements

- **ALL filters must be sent in request body, NOT query parameters**
- **Request must be sent on EVERY filter change**
- **Response must include complete action data + customer data + matched properties**
- **Stats endpoint must calculate counts based on active filters**
- **Related actions endpoint must filter by customer ID and apply all filters**
- **Property information resolved from action metadata OR customer preferences**
- **AI matching section shows properties filtered by `aiInsights.propertyMatches`**
- **All action operations use single endpoint with action type in request body**
- **Support appointment scheduling with full appointment data**
- **Handle all edge cases gracefully (missing data, deleted records, etc.)**

### 12.3 Performance Requirements (CRITICAL - Millions of Records)

**MANDATORY:** All performance optimizations from Section 11 must be implemented:

- **Database Indexing:** All indexes from section 11.1 are REQUIRED
- **Query Optimization:** Follow exact query execution order from section 11.2
- **Field Selection:** Only select required fields, never use SELECT *
- **Read Replicas:** All SELECT queries must use read replicas
- **Connection Pooling:** Minimum 50, maximum 200 connections
- **Parallel Execution:** Stats queries must execute in parallel
- **Query Timeouts:** Strict timeout limits (100ms for detail, 200ms for stats)
- **Response Times:** p95 < 50ms for detail, < 200ms for stats
- **NO CACHING:** All queries must hit database directly (no caching allowed)
- **Response Size:** Maximum 500KB, compress responses

**See Section 11 for complete performance optimization requirements.**

### 12.4 Complete Data Checklist

**For Request Information Card:**
- ✅ Action: id, customerId, customerName, type, title, description, priority, status, source
- ✅ Action: dueDate (for overdue calculation), assignedToName, createdAt, completedAt
- ✅ Action: metadata.notes (for notes display)

**For Property/Preferences Card:**
- ✅ Either: action.metadata.propertyTitle, propertyType, propertyPrice, propertyLocation
- ✅ Or: customer.preferences.propertyType, budgetMin, budgetMax, preferredAreas, bedrooms

**For AI Matching Grid:**
- ✅ customer.properties array (filtered by aiInsights.propertyMatches)
- ✅ Each property: id, propertyId, propertyTitle, propertyImage, propertyPrice, propertyType, propertyLocation, status, addedAt

**For Customer Summary Card:**
- ✅ Customer: id, name, phone, whatsapp, email, stage, totalInteractions

**For Notes Section:**
- ✅ action.metadata.notes (if exists)
- ✅ action.createdAt (for note timestamp display)

**For Action Buttons:**
- ✅ All action operations endpoints (complete, dismiss, snooze, add_note, schedule appointment)

---

---

## 13. VERIFICATION CHECKLIST

### 13.1 All Page Components Covered

✅ **Stats Cards Section** - Section 1 (with filters in request body)
✅ **Filters Section** - Section 2 (dropdown and tab filters)
✅ **Related Actions Grid** - Section 3 (with filters and pagination)
✅ **Request Information Card** - Section 4 (all fields specified)
✅ **Property/Preferences Card** - Section 6 (metadata or preferences resolution)
✅ **AI Matching Grid** - Section 7 (all property fields specified)
✅ **Notes Section** - Section 4.2 (metadata.notes with timestamp)
✅ **Customer Summary Card** - Section 4.2 (all customer fields specified)
✅ **Action Buttons** - Section 8 (all operations documented)

### 13.2 All Data Fields Documented

✅ **Action Fields:** id, customerId, customerName, type, title, description, priority, status, source, dueDate, snoozedUntil, assignedTo, assignedToName, createdAt, completedAt, completedBy, metadata
✅ **Customer Fields:** id, name, phone, whatsapp, email, city, stage, totalInteractions, preferences, aiInsights, properties
✅ **Property Interest Fields:** id, propertyId, propertyTitle, propertyTitleEn, propertyImage, propertyPrice, propertyType, propertyLocation, status, addedAt, viewedAt, feedback, rating, notes
✅ **All Filter Types:** Source, Priority, Type, Status, Date Range, Tab selection
✅ **All Action Operations:** Complete, Dismiss, Snooze, Add Note, Schedule Appointment

### 13.3 All Endpoints Documented

✅ `GET /api/v2/customers-hub/requests/{requestId}` - Get request detail
✅ `POST /api/v2/customers-hub/requests/{requestId}/stats` - Get stats (with filters)
✅ `POST /api/v2/customers-hub/requests/{requestId}/related` - Get related actions (with filters)
✅ `POST /api/v2/customers-hub/requests/{requestId}` - Action operations
✅ `POST /api/v2/customers-hub/customers/{customerId}/appointments` - Schedule appointment

**END OF SPECIFICATION**
