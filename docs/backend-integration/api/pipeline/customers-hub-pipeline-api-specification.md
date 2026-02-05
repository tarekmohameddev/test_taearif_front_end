# Customers Hub Pipeline Page - Backend API Integration Specification

## Overview

This document provides complete technical specifications for integrating the **Customers Hub Pipeline Page** (`/dashboard/customers-hub/pipeline`) with the backend API. This specification is designed for AI systems to implement the backend endpoints and data structures.

**Page Location:** `app/dashboard/customers-hub/pipeline/page.tsx`  
**Component:** `components/customers-hub/pipeline/PipelinePage.tsx`

**CRITICAL PERFORMANCE REQUIREMENT:** This system handles **MILLIONS of records** (50+ million requests, 20+ million customers). **ALL** performance optimizations in Section 12 are **MANDATORY**. Response times must be **extremely fast** (< 100ms for pipeline board, < 150ms for stage analytics). **NO CACHING** is allowed - all queries must hit database directly with optimal indexing and query optimization.

**CONSOLIDATED API DESIGN:** All operations use consolidated endpoints with the `action` field in the request body controlling the operation type. This reduces endpoint complexity and improves maintainability.

---

## API ENDPOINTS OVERVIEW

The API uses **8 consolidated endpoints** with action-based control via request body:

1. **`POST /api/v2/customers-hub/pipeline`** - Main pipeline endpoint (board data, stage analytics, customer cards)
2. **`POST /api/v2/customers-hub/pipeline/stage`** - Stage operations (get customers, update stage, bulk update)
3. **`POST /api/v2/customers-hub/pipeline/customer`** - Customer operations (get details, update, move between stages)
4. **`POST /api/v2/customers-hub/pipeline/analytics`** - Pipeline analytics (conversion rates, bottlenecks, average time)
5. **`POST /api/v2/customers-hub/pipeline/filters`** - Filter options and metadata (available stages, employees, etc.)
6. **`POST /api/v2/customers-hub/pipeline/bulk`** - Bulk operations (bulk stage update, bulk assign, bulk archive)
7. **`POST /api/v2/customers-hub/pipeline/search`** - Search customers within pipeline
8. **`POST /api/v2/customers-hub/pipeline/export`** - Export pipeline data (CSV, Excel, PDF)

---

## Page Structure

The Customers Hub Pipeline page consists of the following main sections:

1. **Header Section** - Page title, total customers count, view selector (enhanced/classic), fullscreen toggle (Section 1)
2. **Stage Analytics Section** - 3 analytics cards (conversion rate, average time, bottlenecks) (Section 2)
3. **Enhanced Pipeline Board** - Kanban board with drag-and-drop functionality (Section 3)
4. **Customer Cards** - Individual customer cards within each stage column (Section 4)
5. **Drag and Drop Operations** - Stage update via drag and drop (Section 5)
6. **Instructions Card** - User instructions card (frontend only, no backend endpoint required) (Section 6)

---

## 1. HEADER SECTION

### 1.1 Header Display

The page displays a header with:
- Page title: "مسار المبيعات" (Sales Pipeline)
- Total customers count
- View selector (Enhanced/Classic)
- Fullscreen toggle button

**Header Data Structure:**

```typescript
interface PipelineHeader {
  totalCustomers: number;        // Total customers count (filtered by active filters)
}
```

### 1.2 Header Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline`

**Request Body:**

```json
{
  "action": "get_header",
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"],
    "propertyType": ["villa", "apartment"],
    "budgetMin": 500000,
    "budgetMax": 2000000,
    "assignedEmployeeId": "employee_123",
    "city": ["الرياض", "جدة"],
    "tags": ["vip", "investor"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "header": {
      "totalCustomers": 125000
    }
  }
}
```

**Calculation Logic:**

- `totalCustomers`: Count customers matching all active filters (regardless of stage)

---

## 2. STAGE ANALYTICS SECTION

### 2.1 Stage Analytics Display

The page displays 3 analytics cards:
1. **Conversion Rate** - From "qualified" to "closing" stage
2. **Average Time** - Average days in pipeline (from start to closing)
3. **Bottlenecks** - Stages with more than 1.5x average customers per stage

**Stage Analytics Data Structure:**

```typescript
interface StageAnalytics {
  conversionRate: number;              // Conversion rate from qualified to closing (%)
  avgDaysInPipeline: number;            // Average days from start to closing
  bottlenecks: Array<{                  // Stages with bottlenecks
    stageId: string;
    stageName: string;
    stageNameEn: string;
    count: number;
    avgCustomersPerStage: number;
    color: string;
  }>;
}
```

### 2.2 Stage Analytics Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline/analytics`

**Request Body:**

```json
{
  "action": "get_analytics",
  "filters": {
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "analytics": {
      "conversionRate": 45.5,
      "avgDaysInPipeline": 28,
      "bottlenecks": [
        {
          "stageId": "negotiation",
          "stageName": "تفاوض",
          "stageNameEn": "Negotiation",
          "count": 15000,
          "avgCustomersPerStage": 10000,
          "color": "#f59e0b"
        }
      ]
    }
  }
}
```

**Calculation Logic:**

- `conversionRate`: `(closingCount / qualifiedCount) * 100` where:
  - `qualifiedCount`: Count customers with `stage = 'qualified'` AND matches filters
  - `closingCount`: Count customers with `stage = 'closing'` AND matches filters
- `avgDaysInPipeline`: Average of `(updatedAt - createdAt)` in days for customers where `stage = 'post_sale'` AND matches filters
- `bottlenecks`: Stages where `count > (totalCustomers / totalStages) * 1.5` AND matches filters

---

## 3. ENHANCED PIPELINE BOARD

### 3.1 Pipeline Board Display

The page displays a Kanban board with columns for each lifecycle stage. Each column shows:
- Stage name (Arabic and English)
- Stage color indicator
- Customer count in this stage
- Total deal value for this stage
- List of customer cards (draggable)

**Pipeline Board Data Structure:**

```typescript
interface PipelineBoard {
  stages: Array<{
    stageId: string;                    // Lifecycle stage ID
    stageName: string;                  // Stage name (Arabic)
    stageNameEn: string;                // Stage name (English)
    color: string;                      // Stage color (hex code)
    order: number;                      // Stage order
    customerCount: number;              // Number of customers in this stage
    totalDealValue: number;             // Total deal value for customers in this stage
    customers: Array<CustomerCardData>; // Customer cards (see Section 4)
  }>;
}
```

### 3.2 Pipeline Board Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline`

**Request Body:**

```json
{
  "action": "get_board",
  "filters": {
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"],
    "propertyType": ["villa", "apartment"],
    "budgetMin": 500000,
    "budgetMax": 2000000,
    "assignedEmployeeId": "employee_123",
    "city": ["الرياض", "جدة"],
    "tags": ["vip", "investor"]
  },
  "sortBy": "priority",
  "sortOrder": "desc"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "board": {
      "stages": [
        {
          "stageId": "new_lead",
          "stageName": "عميل جديد",
          "stageNameEn": "New Lead",
          "color": "#3b82f6",
          "order": 1,
          "customerCount": 50000,
          "totalDealValue": 0,
          "customers": [
            {
              "id": "customer_123",
              "name": "أحمد محمد",
              "phone": "+966501234567",
              "avatar": "AM",
              "totalDealValue": 2000000,
              "propertyType": ["villa", "apartment"],
              "priority": "urgent",
              "assignedEmployee": {
                "id": "employee_123",
                "name": "محمد علي"
              },
              "lastContactAt": "2024-01-20T14:30:00Z",
              "createdAt": "2024-01-15T10:00:00Z"
            }
            // ... more customers (paginated)
          ]
        }
        // ... all other stages
      ]
    }
  }
}
```

**Calculation Logic:**

- For each stage:
  - `customerCount`: Count customers where `stage = stageId` AND matches all filters
  - `totalDealValue`: Sum of `dealValue` for customers in this stage matching filters
  - `customers`: List of customers in this stage (paginated, sorted by `sortBy` and `sortOrder`)

**Sorting Options:**
- `sortBy`: `"priority"`, `"createdAt"`, `"lastContactAt"`, `"totalDealValue"`, `"name"`
- `sortOrder`: `"asc"` or `"desc"`

**Pagination:**
- Default limit: 50 customers per stage
- Maximum limit: 200 customers per stage
- Use cursor-based pagination for large datasets

---

## 4. CUSTOMER CARDS

### 4.1 Customer Card Display

Each customer card in the pipeline board displays:
- Customer name with avatar (initials)
- Phone number
- Total deal value
- Property type preferences (first 2 types)
- Priority badge (if urgent or high)
- "View" button to open customer details

**Customer Card Data Structure:**

```typescript
interface CustomerCardData {
  id: string;                          // Customer ID
  name: string;                        // Customer name
  phone: string;                       // Phone number
  avatar: string;                      // Avatar initials (e.g., "AM")
  totalDealValue?: number;             // Total deal value in SAR
  propertyType: string[];              // Property type preferences (first 2)
  priority: "low" | "medium" | "high" | "urgent";
  assignedEmployee?: {
    id: string;
    name: string;
  };
  lastContactAt?: string;              // ISO 8601 format, UTC timezone
  createdAt: string;                   // ISO 8601 format, UTC timezone
}
```

### 4.2 Customer Card Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline/stage`

**Request Body:**

```json
{
  "action": "get_customers",
  "stageId": "qualified",
  "filters": {
    "priority": ["urgent", "high"],
    "source": ["whatsapp"]
  },
  "sortBy": "priority",
  "sortOrder": "desc",
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "customer_123",
        "name": "أحمد محمد",
        "phone": "+966501234567",
        "avatar": "AM",
        "totalDealValue": 2000000,
        "propertyType": ["villa", "apartment"],
        "priority": "urgent",
        "assignedEmployee": {
          "id": "employee_123",
          "name": "محمد علي"
        },
        "lastContactAt": "2024-01-20T14:30:00Z",
        "createdAt": "2024-01-15T10:00:00Z"
      }
      // ... more customers
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 25000,
      "totalPages": 500
    }
  }
}
```

**Field Selection:**

**MANDATORY:** Select only required fields for customer cards:
- `id`, `name`, `phone`, `totalDealValue`, `preferences.propertyType` (first 2), `priority`, `assignedEmployee`, `lastContactAt`, `createdAt`

**Avatar Calculation:**
- Extract first letter of each word from `name`
- Convert to uppercase
- Take first 2 letters
- Example: "أحمد محمد" → "AM"

---

## 5. DRAG AND DROP OPERATIONS

### 5.1 Stage Update via Drag and Drop

When a user drags a customer card from one stage to another, the backend must update the customer's stage.

**Stage Update Data Structure:**

```typescript
interface StageUpdate {
  customerId: string;
  fromStageId: string;                 // Previous stage
  toStageId: string;                   // New stage
  updatedBy: string;                    // Employee ID who performed the update
  updateReason?: string;                // Optional reason for stage change
}
```

### 5.2 Stage Update Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline/stage`

**Request Body:**

```json
{
  "action": "update_stage",
  "customerId": "customer_123",
  "fromStageId": "qualified",
  "toStageId": "property_matching",
  "updatedBy": "employee_123",
  "updateReason": "Customer approved property match"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "customer_123",
      "stage": "property_matching",
      "stageHistory": [
        {
          "stage": "property_matching",
          "changedAt": "2024-01-21T10:30:00Z",
          "changedBy": "employee_123",
          "reason": "Customer approved property match"
        }
        // ... previous stage history entries
      ],
      "updatedAt": "2024-01-21T10:30:00Z"
    }
  }
}
```

**Update Logic:**

1. Validate that `customerId` exists and `fromStageId` matches current customer stage
2. Validate that `toStageId` is a valid lifecycle stage
3. Update customer `stage` field to `toStageId`
4. Add entry to `stageHistory` array:
   - `stage`: New stage ID
   - `changedAt`: Current timestamp (UTC)
   - `changedBy`: Employee ID
   - `reason`: Optional update reason
5. Update `updatedAt` timestamp
6. Return updated customer data

**Stage History Structure:**

```typescript
interface StageHistoryEntry {
  stage: string;                       // Stage ID
  changedAt: string;                   // ISO 8601 format, UTC timezone
  changedBy: string;                    // Employee ID
  reason?: string;                      // Optional reason
}
```

### 5.3 Bulk Stage Update

**Endpoint:** `POST /api/v2/customers-hub/pipeline/bulk`

**Request Body:**

```json
{
  "action": "bulk_update_stage",
  "customerIds": ["customer_123", "customer_456", "customer_789"],
  "toStageId": "property_matching",
  "updatedBy": "employee_123",
  "updateReason": "Bulk move to property matching"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "updated": 3,
    "failed": 0,
    "customers": [
      {
        "id": "customer_123",
        "stage": "property_matching"
      }
      // ... other updated customers
    ]
  }
}
```

**Bulk Update Logic:**

- Update all customers in `customerIds` array to `toStageId`
- Use batch update (UPDATE ... WHERE id IN (...)) for optimal performance
- Return count of updated customers and list of updated customer IDs

---

## 6. CONSOLIDATED PIPELINE ENDPOINT

### 6.1 Main Pipeline Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline`

This endpoint can return multiple pipeline sections in a single request using the `include` field.

**Request Body:**

```json
{
  "action": "get_pipeline",
  "include": [
    "header",
    "board",
    "analytics"
  ],
  "filters": {
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"],
    "propertyType": ["villa", "apartment"],
    "budgetMin": 500000,
    "budgetMax": 2000000,
    "assignedEmployeeId": "employee_123",
    "city": ["الرياض", "جدة"],
    "tags": ["vip", "investor"]
  },
  "sortBy": "priority",
  "sortOrder": "desc",
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "header": {
      "totalCustomers": 125000
    },
    "board": {
      "stages": [
        /* Stage data */
      ]
    },
    "analytics": {
      "conversionRate": 45.5,
      "avgDaysInPipeline": 28,
      "bottlenecks": [
        /* Bottleneck data */
      ]
    }
  }
}
```

**Performance Note:** Backend should execute all requested queries in parallel for optimal performance.

---

## 7. FILTER OPTIONS ENDPOINT

### 7.1 Filter Options Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline/filters`

**Request Body:**

```json
{
  "action": "get_filter_options"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stages": [
      {
        "id": "new_lead",
        "name": "عميل جديد",
        "nameEn": "New Lead",
        "color": "#3b82f6",
        "order": 1
      }
      // ... all stages
    ],
    "priorities": [
      {
        "id": "urgent",
        "name": "عاجل",
        "nameEn": "Urgent"
      }
      // ... all priorities
    ],
    "sources": [
      {
        "id": "whatsapp",
        "name": "واتساب",
        "nameEn": "WhatsApp"
      }
      // ... all sources
    ],
    "propertyTypes": [
      {
        "id": "villa",
        "name": "فيلا",
        "nameEn": "Villa"
      }
      // ... all property types
    ],
    "employees": [
      {
        "id": "employee_123",
        "name": "محمد علي",
        "customerCount": 5000
      }
      // ... all employees
    ],
    "cities": [
      {
        "id": "الرياض",
        "name": "الرياض",
        "customerCount": 60000
      }
      // ... all cities
    ]
  }
}
```

---

## 8. SEARCH FUNCTIONALITY

### 8.1 Search Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline/search`

**Request Body:**

```json
{
  "action": "search_customers",
  "query": "أحمد",
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"]
  },
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "customer_123",
        "name": "أحمد محمد",
        "phone": "+966501234567",
        "stage": "qualified",
        "priority": "urgent"
      }
      // ... more customers
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 125,
      "totalPages": 3
    }
  }
}
```

**Search Logic:**

- Search in `name`, `phone`, `email` fields
- Use full-text search indexes for optimal performance
- Filter results by active filters
- Return paginated results

---

## 9. INSTRUCTIONS CARD

### 9.1 Instructions Card Display

The page displays an instructions card at the bottom of the pipeline board showing user instructions:
- "اسحب البطاقات بين الأعمدة لتغيير المرحلة" (Drag cards between columns to change stage)
- "انقر على 'عرض' لفتح صفحة التفاصيل" (Click 'View' to open details page)

**Note:** This is a **frontend-only component** with static content. **NO backend endpoint is required** for this component.

---

## 10. EXPORT FUNCTIONALITY

### 9.1 Export Endpoint

**Endpoint:** `POST /api/v2/customers-hub/pipeline/export`

**Request Body:**

```json
{
  "action": "export_pipeline",
  "format": "excel",
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"]
  },
  "includeFields": [
    "name",
    "phone",
    "email",
    "stage",
    "priority",
    "totalDealValue",
    "assignedEmployee",
    "createdAt"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "exportUrl": "https://cdn.example.com/exports/pipeline_20240121_103000.xlsx",
    "expiresAt": "2024-01-22T10:30:00Z"
  }
}
```

**Export Formats:**
- `csv` - CSV format
- `excel` - Excel format (.xlsx)
- `pdf` - PDF format

---

## 11. PERFORMANCE OPTIMIZATION

### 11.1 CRITICAL PERFORMANCE REQUIREMENTS

**MANDATORY:** This system handles **MILLIONS of records** (50+ million requests, 20+ million customers). **ALL** performance optimizations below are **MANDATORY**. Response times must be **extremely fast** (< 100ms for pipeline board, < 150ms for stage analytics). **NO CACHING** is allowed - all queries must hit database directly with optimal indexing and query optimization.

### 11.2 Database Indexing Strategy

**MANDATORY INDEXES (PostgreSQL example):**

```sql
-- Customers table indexes for pipeline
CREATE INDEX CONCURRENTLY idx_customers_stage_priority ON customers(stage, priority DESC);
CREATE INDEX CONCURRENTLY idx_customers_stage_created_at ON customers(stage, created_at DESC);
CREATE INDEX CONCURRENTLY idx_customers_stage_last_contact ON customers(stage, last_contact_at DESC) WHERE last_contact_at IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_customers_stage_deal_value ON customers(stage, total_deal_value DESC) WHERE total_deal_value > 0;
CREATE INDEX CONCURRENTLY idx_customers_stage_assigned_employee ON customers(stage, assigned_employee_id) WHERE assigned_employee_id IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_customers_stage_history ON customers USING GIN(stage_history);

-- Composite covering indexes for pipeline board queries
CREATE INDEX CONCURRENTLY idx_customers_pipeline_covering ON customers(stage, priority DESC, created_at DESC) INCLUDE (id, name, phone, total_deal_value, assigned_employee_id, last_contact_at);

-- Stage update indexes
CREATE INDEX CONCURRENTLY idx_customers_stage_updated_at ON customers(stage, updated_at DESC);

-- Filter indexes
CREATE INDEX CONCURRENTLY idx_customers_priority_stage ON customers(priority, stage);
CREATE INDEX CONCURRENTLY idx_customers_source_stage ON customers(source, stage);
CREATE INDEX CONCURRENTLY idx_customers_property_type ON customers USING GIN(preferences->'propertyType');
CREATE INDEX CONCURRENTLY idx_customers_city_stage ON customers(city, stage);
CREATE INDEX CONCURRENTLY idx_customers_tags ON customers USING GIN(tags);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY idx_customers_name_search ON customers USING GIN(to_tsvector('arabic', name));
CREATE INDEX CONCURRENTLY idx_customers_phone_search ON customers(phone);
CREATE INDEX CONCURRENTLY idx_customers_email_search ON customers(email) WHERE email IS NOT NULL;
```

### 11.3 Query Optimization Rules

**MANDATORY QUERY OPTIMIZATION:**

1. **Filter Order:** Apply filters in this order for optimal index usage:
   - Stage - Uses stage indexes (MOST SELECTIVE)
   - Priority - Uses priority indexes
   - Source - Uses source indexes
   - Employee - Uses employee indexes
   - City - Uses city indexes
   - Property type - Uses GIN index
   - Tags - Uses GIN index
   - Budget range - Uses budget index
   - Date range - Uses date indexes

2. **Query Hints:** Use query hints to force index usage:
   ```sql
   SELECT /*+ INDEX(customers idx_customers_stage_priority) */ ...
   ```

3. **Avoid Full Table Scans:** NEVER allow full table scans. All queries MUST use indexes.

4. **Limit Result Sets:** Always use `LIMIT` for customer cards. Maximum `limit` = 200 per stage.

5. **Field Selection:** NEVER use `SELECT *`. Always select only required fields for customer cards.

6. **Stage Grouping:** Use `GROUP BY stage` with indexed columns for stage counts.

7. **Aggregation Optimization:** Use `COUNT(*)` instead of `COUNT(column)` when possible. Use `SUM()` with indexed columns.

8. **Subquery Optimization:** Use `EXISTS` instead of `IN` for large subqueries. Use `JOIN` instead of subqueries when possible.

9. **JSON Field Queries:** Use JSONB indexes for `preferences` field queries. Use `->>` operator for text extraction.

10. **Stage Update Optimization:** Use single `UPDATE` statement with `WHERE id = ?` for stage updates. Use batch updates for bulk operations.

### 11.4 Pagination Limits

**STRICT LIMITS:**

- Maximum `limit` per stage: **200**
- Default `limit` per stage: **50**
- Maximum `offset`: **1000000** (1 million)
- **RECOMMENDATION:** Use cursor-based pagination for large datasets (using `createdAt` or `id` as cursor)

### 11.5 Field Selection

**MANDATORY:** Always select only required fields for customer cards. Never use `SELECT *`.

**Required Fields for Customer Cards:**
- `id`, `name`, `phone`, `totalDealValue`, `preferences.propertyType` (first 2), `priority`, `assignedEmployee`, `lastContactAt`, `createdAt`

**Example:**
```sql
-- ❌ BAD
SELECT * FROM customers WHERE stage = ? AND ...

-- ✅ GOOD
SELECT id, name, phone, total_deal_value, 
       preferences->'propertyType' as property_type,
       priority, assigned_employee_id, last_contact_at, created_at
FROM customers WHERE stage = ? AND ...
```

### 11.6 Read Replicas

**MANDATORY:** Use read replicas for ALL `SELECT` queries. Route all pipeline queries to read replicas.

### 11.7 Database Partitioning

**MANDATORY:** Partition large tables by date range.

**Example (PostgreSQL):**
```sql
-- Partition customers table by month
CREATE TABLE customers (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    stage VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    -- ... other columns
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE customers_2024_01 PARTITION OF customers
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE customers_2024_02 PARTITION OF customers
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- ... more partitions
```

### 11.8 Parallel Query Execution

**MANDATORY:** Execute multiple pipeline queries in parallel when `include` array has multiple items.

**Example:**
- If `include: ["header", "board", "analytics"]`, execute all 3 queries in parallel using database connection pooling or async query execution.

### 11.9 Strict Query Timeout Limits

**MANDATORY:** Enforce strict query timeouts:

- Pipeline board queries: **Maximum 1 second**
- Stage analytics queries: **Maximum 1.5 seconds**
- Stage update queries: **Maximum 500ms**
- Search queries: **Maximum 1 second**
- Filter options queries: **Maximum 500ms**

**If query exceeds timeout, return partial results or error immediately.**

### 11.10 Database Query Monitoring

**MANDATORY:** Log and monitor all queries:

- Log all queries exceeding 100ms
- Alert on queries exceeding 500ms
- Track query execution times
- Monitor index usage
- Track slow query patterns

### 11.11 Response Size Optimization

**MANDATORY:**

- Limit response size: **Maximum 10MB per response**
- Remove null values from JSON responses
- Use compression (gzip) for responses > 1MB
- Minify JSON responses (remove unnecessary whitespace)
- Limit customer cards per stage: **Maximum 200**

### 11.12 Index Maintenance

**MANDATORY:** Regular index maintenance:

- Rebuild indexes weekly: `REINDEX INDEX CONCURRENTLY index_name;`
- Update statistics daily: `ANALYZE customers;`
- Monitor index bloat: Use `pg_stat_user_indexes` to track index usage

### 11.13 Materialized Views (NOT CACHING)

**ALLOWED:** Use materialized views for pre-computed aggregations. **This is NOT caching** - it's a database optimization technique.

**Example:**
```sql
-- Materialized view for stage counts
CREATE MATERIALIZED VIEW mv_stage_counts AS
SELECT 
    stage,
    COUNT(*) AS count,
    SUM(total_deal_value) AS total_value,
    AVG(EXTRACT(EPOCH FROM (NOW() - created_at)) / 86400) AS avg_days
FROM customers
WHERE stage IS NOT NULL
GROUP BY stage;

-- Refresh materialized view every hour (NOT caching - database optimization)
CREATE INDEX ON mv_stage_counts(stage);
```

**Refresh Strategy:**
- Refresh materialized views every hour (or more frequently if needed)
- Use `REFRESH MATERIALIZED VIEW CONCURRENTLY` to avoid locking

### 11.14 Full-Text Search Optimization

**For search functionality:**

- Use PostgreSQL full-text search indexes for name, phone, email search
- Use `tsvector` and `tsquery` for efficient text search
- Index: `CREATE INDEX idx_customers_name_search ON customers USING GIN(to_tsvector('arabic', name));`

### 11.15 Batch Updates

**For bulk operations:**

- Use batch updates (e.g., `UPDATE ... WHERE id IN (...)` with batches of 1000)
- Use transactions for consistency
- Use `RETURNING` clause to get updated rows

### 11.16 Stage Update Optimization

**For drag-and-drop stage updates:**

- Use single `UPDATE` statement: `UPDATE customers SET stage = ?, updated_at = NOW() WHERE id = ?`
- Update `stageHistory` array in same transaction
- Use `RETURNING` clause to get updated customer data
- Use connection pooling for concurrent updates

### 11.17 Performance Targets

**MANDATORY RESPONSE TIME TARGETS:**

- Pipeline board (all stages): **< 100ms**
- Stage analytics: **< 150ms**
- Customer cards (per stage): **< 100ms**
- Stage update (drag and drop): **< 200ms**
- Bulk stage update: **< 500ms**
- Search: **< 200ms**
- Filter options: **< 100ms**
- Consolidated pipeline (all sections): **< 200ms**

### 11.18 NO CACHING POLICY

**STRICTLY FORBIDDEN:**

- ❌ **NO** application-level caching (Redis, Memcached, etc.)
- ❌ **NO** HTTP caching headers (`Cache-Control`, `ETag`, etc.)
- ❌ **NO** query result caching
- ❌ **NO** computed value caching

**ALLOWED:**

- ✅ Database indexes (mandatory)
- ✅ Materialized views (database optimization, NOT caching)
- ✅ Connection pooling (infrastructure optimization)
- ✅ Read replicas (infrastructure optimization)
- ✅ Query optimization (mandatory)

---

## 12. ERROR HANDLING

### 12.1 Standard Error Response Format

All endpoints must return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "PIPELINE_INVALID_STAGE",
    "message": "Invalid stage ID specified",
    "details": {
      "field": "toStageId",
      "value": "invalid_stage",
      "allowedValues": ["new_lead", "qualified", "property_matching", ...]
    }
  }
}
```

### 12.2 Error Codes

**Stage Errors:**
- `PIPELINE_INVALID_STAGE` - Invalid stage ID
- `PIPELINE_STAGE_UPDATE_FAILED` - Failed to update customer stage
- `PIPELINE_CUSTOMER_NOT_FOUND` - Customer not found
- `PIPELINE_STAGE_MISMATCH` - Customer's current stage doesn't match `fromStageId`

**Filter Errors:**
- `PIPELINE_INVALID_FILTER` - Invalid filter value
- `PIPELINE_INVALID_PRIORITY` - Invalid priority value
- `PIPELINE_INVALID_SOURCE` - Invalid source value

**Query Errors:**
- `PIPELINE_QUERY_TIMEOUT` - Query exceeded timeout limit
- `PIPELINE_QUERY_FAILED` - Database query failed
- `PIPELINE_INSUFFICIENT_PERMISSIONS` - User lacks permissions

**Pagination Errors:**
- `PIPELINE_INVALID_PAGE` - Invalid page number (< 1)
- `PIPELINE_INVALID_LIMIT` - Invalid limit (> 200 or < 1)
- `PIPELINE_OFFSET_TOO_LARGE` - Offset exceeds maximum (1 million)

**Bulk Operation Errors:**
- `PIPELINE_BULK_UPDATE_FAILED` - Bulk update failed
- `PIPELINE_BULK_UPDATE_PARTIAL` - Some customers failed to update

---

## 13. DATA TYPES

### 13.1 Lifecycle Stage Types

```typescript
type CustomerLifecycleStage =
  | "new_lead"           // عميل جديد
  | "qualified"          // مؤهل
  | "property_matching"  // مطابقة العقارات
  | "site_visit"         // معاينة
  | "negotiation"        // تفاوض
  | "contract_prep"      // إعداد العقد
  | "down_payment"       // الدفعة الأولى
  | "closing"            // إتمام الصفقة
  | "post_sale";         // ما بعد البيع
```

### 13.2 Filter Types

```typescript
interface PipelineFilters {
  stage?: string[];                // Lifecycle stage IDs
  priority?: string[];             // Priority values: "urgent", "high", "medium", "low"
  source?: string[];               // Source values: "whatsapp", "inquiry", "referral", etc.
  propertyType?: string[];         // Property type IDs
  budgetMin?: number;              // Minimum budget in SAR
  budgetMax?: number;              // Maximum budget in SAR
  assignedEmployeeId?: string;     // Employee ID
  city?: string[];                 // City names (Arabic)
  tags?: string[];                 // Tag values
}
```

### 13.3 Sort Types

```typescript
type SortBy = "priority" | "createdAt" | "lastContactAt" | "totalDealValue" | "name";
type SortOrder = "asc" | "desc";
```

---

## 14. DATE/TIME HANDLING

### 14.1 Date Format

**MANDATORY:** All dates must be in **ISO 8601 format** with **UTC timezone**.

**Format:** `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ`

**Examples:**
- `2024-01-15T10:30:00Z`
- `2024-01-15T10:30:00.000Z`

---

## 15. VERIFICATION CHECKLIST

### 15.1 Page Components Coverage

- ✅ Header Section (Section 1)
- ✅ Stage Analytics Section (Section 2)
- ✅ Enhanced Pipeline Board (Section 3)
- ✅ Customer Cards (Section 4)
- ✅ Drag and Drop Operations (Section 5)
- ✅ Instructions Card (Section 9 - frontend only, no backend endpoint)

### 15.2 Data Fields Coverage

- ✅ Total customers count
- ✅ Stage analytics (conversion rate, average time, bottlenecks)
- ✅ Pipeline board (all stages with customer counts and deal values)
- ✅ Customer cards (name, phone, avatar, deal value, property type, priority, assigned employee)
- ✅ Stage update via drag and drop
- ✅ Bulk stage update
- ✅ Search functionality
- ✅ Export functionality

### 15.3 Endpoints Coverage

- ✅ Main pipeline endpoint (`POST /api/v2/customers-hub/pipeline`)
- ✅ Stage operations endpoint (`POST /api/v2/customers-hub/pipeline/stage`)
- ✅ Customer operations endpoint (`POST /api/v2/customers-hub/pipeline/customer`)
- ✅ Analytics endpoint (`POST /api/v2/customers-hub/pipeline/analytics`)
- ✅ Filter options endpoint (`POST /api/v2/customers-hub/pipeline/filters`)
- ✅ Bulk operations endpoint (`POST /api/v2/customers-hub/pipeline/bulk`)
- ✅ Search endpoint (`POST /api/v2/customers-hub/pipeline/search`)
- ✅ Export endpoint (`POST /api/v2/customers-hub/pipeline/export`)

### 15.4 Performance Requirements Coverage

- ✅ Database indexing strategy
- ✅ Query optimization rules
- ✅ Pagination limits
- ✅ Field selection
- ✅ Read replicas
- ✅ Database partitioning
- ✅ Parallel query execution
- ✅ Query timeout limits
- ✅ Query monitoring
- ✅ Response size optimization
- ✅ Index maintenance
- ✅ Materialized views (NOT caching)
- ✅ Performance targets
- ✅ NO CACHING policy

---

## 16. IMPLEMENTATION NOTES

### 16.1 Request Body vs Query Parameters

**MANDATORY:** All filter parameters MUST be sent in the request body, NOT query parameters. This allows for complex filter structures and better performance.

### 16.2 Drag and Drop Stage Updates

**MANDATORY:** When a customer is moved between stages via drag and drop:
1. Validate `fromStageId` matches current customer stage
2. Validate `toStageId` is a valid lifecycle stage
3. Update customer stage and add to `stageHistory`
4. Return updated customer data immediately

### 16.3 Parallel Query Execution

**RECOMMENDED:** When `include` array has multiple items, execute all queries in parallel for optimal performance.

### 16.4 Error Handling

**MANDATORY:** All endpoints must return standardized error responses with error codes, messages, and details.

### 16.5 Date/Time Format

**MANDATORY:** All dates must be in ISO 8601 format with UTC timezone.

### 16.6 Customer Card Field Selection

**MANDATORY:** Only select required fields for customer cards to minimize response size and improve performance.

---

## 17. TESTING SCENARIOS

### 17.1 Basic Pipeline Board Request

**Test:** Request pipeline board for all stages

**Request:**
```json
{
  "action": "get_board",
  "filters": {},
  "sortBy": "priority",
  "sortOrder": "desc"
}
```

**Expected:** Response with all stages and customer cards in < 100ms

### 17.2 Filtered Pipeline Board

**Test:** Request pipeline board with filters

**Request:**
```json
{
  "action": "get_board",
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"]
  },
  "sortBy": "priority",
  "sortOrder": "desc"
}
```

**Expected:** Response with filtered stages and customers

### 17.3 Stage Update via Drag and Drop

**Test:** Update customer stage via drag and drop

**Request:**
```json
{
  "action": "update_stage",
  "customerId": "customer_123",
  "fromStageId": "qualified",
  "toStageId": "property_matching",
  "updatedBy": "employee_123"
}
```

**Expected:** Response with updated customer data in < 200ms

### 17.4 Bulk Stage Update

**Test:** Bulk update multiple customers to new stage

**Request:**
```json
{
  "action": "bulk_update_stage",
  "customerIds": ["customer_123", "customer_456"],
  "toStageId": "property_matching",
  "updatedBy": "employee_123"
}
```

**Expected:** Response with updated count and customer IDs in < 500ms

### 17.5 Stage Analytics

**Test:** Request stage analytics

**Request:**
```json
{
  "action": "get_analytics",
  "filters": {}
}
```

**Expected:** Response with conversion rate, average time, and bottlenecks in < 150ms

### 17.6 Consolidated Pipeline Request

**Test:** Request all pipeline sections in one request

**Request:**
```json
{
  "action": "get_pipeline",
  "include": ["header", "board", "analytics"],
  "filters": {},
  "sortBy": "priority",
  "sortOrder": "desc"
}
```

**Expected:** Response with all sections in < 200ms

### 17.7 Performance Test

**Test:** Request pipeline board with millions of records

**Expected:** Response time < 100ms for pipeline board, < 200ms for consolidated pipeline

---

## END OF SPECIFICATION

This specification provides complete technical details for implementing the backend API for the Customers Hub Pipeline page. All endpoints, data structures, performance optimizations, and error handling requirements are documented above.

**CRITICAL REMINDER:** This system handles **MILLIONS of records**. **ALL** performance optimizations in Section 11 are **MANDATORY**. **NO CACHING** is allowed. Response times must be **extremely fast**.
