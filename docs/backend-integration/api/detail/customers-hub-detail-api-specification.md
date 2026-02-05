# Customers Hub Customer Detail Page - Backend API Integration Specification

## Overview

This document provides complete technical specifications for integrating the **Customers Hub Customer Detail Page** (`/dashboard/customers-hub/[id]`) with the backend API. This specification is designed for AI systems to implement the backend endpoints and data structures.

**Page Location:** `app/dashboard/customers-hub/[id]/page.tsx`  
**Component:** `components/customers-hub/detail/CustomerDetailPageSimple.tsx`

**CRITICAL PERFORMANCE REQUIREMENT:** This system handles **MILLIONS of records** (50+ million requests, 20+ million customers). **ALL** performance optimizations in Section 12 are **MANDATORY**. Response times must be **extremely fast** (< 100ms for customer details, < 150ms for tasks/properties). **NO CACHING** is allowed - all queries must hit database directly with optimal indexing and query optimization.

**CONSOLIDATED API DESIGN:** The API uses a **single GET endpoint** to fetch all customer data when the page loads (customer info + tasks + properties + preferences). Write operations (POST/PUT/DELETE) use separate RESTful endpoints.

---

## API ENDPOINTS OVERVIEW

The API uses **RESTful endpoints** with a consolidated GET endpoint for initial page load:

**READ ENDPOINT (GET):**
1. **`GET /api/v2/customers-hub/customers/{customerId}`** - Get all customer data (customer info + tasks + properties + preferences) in one request

**WRITE ENDPOINTS (POST/PUT/DELETE):**
2. **`PUT /api/v2/customers-hub/customers/{customerId}`** - Update customer
3. **`POST /api/v2/customers-hub/customers/{customerId}/tasks`** - Add task
4. **`PUT /api/v2/customers-hub/customers/{customerId}/tasks/{taskId}`** - Update task
5. **`DELETE /api/v2/customers-hub/customers/{customerId}/tasks/{taskId}`** - Delete task
6. **`POST /api/v2/customers-hub/customers/{customerId}/properties`** - Add property
7. **`PUT /api/v2/customers-hub/customers/{customerId}/properties/{propertyId}`** - Update property
8. **`DELETE /api/v2/customers-hub/customers/{customerId}/properties/{propertyId}`** - Delete property
9. **`PUT /api/v2/customers-hub/customers/{customerId}/preferences`** - Update preferences

---

## Page Structure

The Customers Hub Customer Detail page consists of the following main sections:

1. **Header Section** - Page title, back button, edit button (Section 1)
2. **Customer Info Card** - Always visible customer information card (Section 2)
3. **Tasks Section** - Tasks management with add/edit/delete functionality (Section 3)
4. **Properties Section** - Properties with 3 categories (website, AI-matched, manual) (Section 4)
5. **Customer Requests Section** - Customer preferences and requirements (Section 5)
6. **Collapsible Sections** - Collapsible UI component for sections (Section 6)
7. **Error State** - Customer not found state (Section 7)

---

## 1. HEADER SECTION

### 1.1 Header Display

The page displays a header with:
- Back button (links to `/dashboard/customers-hub`)
- Page title: "تفاصيل العميل" (Customer Details)
- Edit button

**Header Data Structure:**

```typescript
interface CustomerDetailHeader {
  customerId: string;
  customerName: string;        // For page title (optional, can be in customer info)
}
```

**Note:** Header is frontend-only. No backend endpoint required for header data.

---

## 2. CUSTOMER INFO CARD

### 2.1 Customer Info Card Display

The Customer Info Card is always visible and displays:
- **Avatar** - First letter of customer name in a circular badge
- **Name** - Customer full name
- **Stage Badge** - Current lifecycle stage with color
- **Contact Info** - Phone (clickable tel:), WhatsApp (clickable wa.me link), Email (clickable mailto:)
- **Location** - City and District
- **Occupation** - Customer occupation
- **Family Size** - Number of family members
- **Stats** - Total interactions count, Total appointments count
- **Tags** - Customer tags array

**Customer Info Card Data Structure:**

```typescript
interface CustomerInfoCardData {
  id: string;
  name: string;
  stage: string;                    // Lifecycle stage ID
  phone: string;
  whatsapp?: string;                // WhatsApp number
  email?: string;
  city?: string;
  district?: string;
  occupation?: string;
  familySize?: number;
  totalInteractions: number;        // Total interactions count
  totalAppointments: number;        // Total appointments count
  tags: string[];                   // Customer tags
}
```

### 2.2 Customer Info Card Endpoint

**Note:** Customer info is included in the main GET endpoint (Section 8). See Section 8 for the complete endpoint specification.

---

## 3. TASKS SECTION

### 3.1 Tasks Section Display

The Tasks Section displays:
- **Header** with title "المهام" and "+" button to add new task
- **Add Task Form** (inline, appears when "+" is clicked):
  - Task type selection (3 types: contact, office_visit, property_viewing)
  - Date and time input (datetime-local)
  - Property title input (for property_viewing type only)
  - Notes input
  - Save and Cancel buttons
- **Quick Stats** - Overdue count, Today count
- **Active Tasks List** - Pending tasks sorted by datetime
- **Completed Tasks Toggle** - Show/hide completed and cancelled tasks
- **Task Item** - Each task shows:
  - Task type icon and name
  - Date and time (formatted: "اليوم HH:mm", "غداً HH:mm", or "DD MMM HH:mm")
  - Property title (if applicable)
  - Notes
  - Overdue badge (if overdue)
  - Complete button
  - Delete button

**Task Data Structure:**

```typescript
interface CustomerTask {
  id: string;
  type: "contact" | "office_visit" | "property_viewing";
  datetime: string;                 // ISO 8601 format, UTC timezone
  notes?: string;
  status: "pending" | "completed" | "cancelled";
  propertyId?: string;              // For property_viewing type
  propertyTitle?: string;           // For property_viewing type
  createdAt: string;                // ISO 8601 format, UTC timezone
  updatedAt?: string;               // ISO 8601 format, UTC timezone
}
```

### 3.2 Get Tasks Endpoint

**Note:** Tasks are included in the main GET endpoint (Section 8). See Section 8 for the complete endpoint specification.

### 3.3 Add Task Endpoint

**Endpoint:** `POST /api/v2/customers-hub/customers/{customerId}/tasks`

**Request Body:**

```json
{
  "type": "property_viewing",
  "datetime": "2024-01-25T15:00:00Z",
  "notes": "معاينة فيلا جديدة",
  "propertyId": "property_789",
  "propertyTitle": "فيلا في النرجس"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_456",
      "type": "property_viewing",
      "datetime": "2024-01-25T15:00:00Z",
      "notes": "معاينة فيلا جديدة",
      "status": "pending",
      "propertyId": "property_789",
      "propertyTitle": "فيلا في النرجس",
      "createdAt": "2024-01-20T10:30:00Z"
    }
  }
}
```

**Validation:**
- `type` must be one of: "contact", "office_visit", "property_viewing"
- `datetime` must be in ISO 8601 format, UTC timezone
- `datetime` must be in the future (for pending tasks)
- `propertyId` and `propertyTitle` are optional but recommended for "property_viewing" type

### 3.4 Update Task Endpoint

**Endpoint:** `PUT /api/v2/customers-hub/customers/{customerId}/tasks/{taskId}`

**Request Body:**

```json
{
  "status": "completed"
}
```

**Alternative (if updating multiple fields):**

```json
{
  "status": "completed",
  "datetime": "2024-01-25T16:00:00Z",
  "notes": "تمت المعاينة بنجاح"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "task_123",
      "type": "property_viewing",
      "datetime": "2024-01-21T14:30:00Z",
      "notes": "معاينة فيلا في العليا",
      "status": "completed",
      "propertyId": "property_456",
      "propertyTitle": "فيلا فاخرة في العليا",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-21T15:00:00Z"
    }
  }
}
```

**Allowed Updates:**
- `status`: "pending" | "completed" | "cancelled"
- `datetime`: ISO 8601 format, UTC timezone
- `notes`: string
- `propertyId`: string (for property_viewing type)
- `propertyTitle`: string (for property_viewing type)

### 3.5 Delete Task Endpoint

**Endpoint:** `DELETE /api/v2/customers-hub/customers/{customerId}/tasks/{taskId}`

**Request Body:** None (taskId is in URL path)

**Response:**

```json
{
  "success": true,
  "data": {
    "deleted": true,
    "taskId": "task_123"
  }
}
```

---

## 4. PROPERTIES SECTION

### 4.1 Properties Section Display

The Properties Section displays:
- **Preferences Summary** (always visible):
  - Property types (badges)
  - Budget range (min - max)
  - Bedrooms count
  - Preferred areas (first 2)
- **Property Categories** (3 categories):
  1. **من الموقع الإلكتروني** (From Website) - Properties with status "interested" and not AI/manual
  2. **مطابقة الذكاء الاصطناعي** (AI Matched) - Properties with notes containing "AI" or status "viewing_scheduled"
  3. **أضافها الفريق** (Manual) - Properties with notes containing "manual" or status "offer_made"
- **Property Cards** - Each card shows:
  - Property image (if available)
  - Property title
  - Property location
  - Status badge (interested, viewing_scheduled, viewed, liked, rejected, offer_made)
  - Property price
  - "عرض التفاصيل" (View Details) button
- **Expand/Collapse** - Each category can expand to show all properties or collapse to show first 2
- **Add Property Button** - Button to add new property

**Property Data Structure:**

```typescript
interface PropertyInterest {
  id: string;
  propertyTitle: string;
  propertyLocation?: string;
  propertyImage?: string;           // Image URL
  propertyPrice?: number;            // Price in SAR
  status: "interested" | "viewing_scheduled" | "viewed" | "liked" | "rejected" | "offer_made";
  notes?: string;                    // May contain "AI" or "manual" for categorization
  propertyId?: string;               // Reference to property database ID
  addedAt: string;                   // ISO 8601 format, UTC timezone
  updatedAt?: string;                // ISO 8601 format, UTC timezone
}
```

### 4.2 Get Properties Endpoint

**Note:** Properties are included in the main GET endpoint (Section 8). See Section 8 for the complete endpoint specification.

**Categorization Logic:**
- `website`: `status = 'interested'` AND `notes` does NOT contain "AI" AND `notes` does NOT contain "manual"
- `aiMatched`: `notes` contains "AI" OR `status = 'viewing_scheduled'`
- `manual`: `notes` contains "manual" OR `status = 'offer_made'`

### 4.3 Add Property Endpoint

**Endpoint:** `POST /api/v2/customers-hub/customers/{customerId}/properties`

**Request Body:**

```json
{
  "propertyTitle": "فيلا جديدة في العليا",
  "propertyLocation": "الرياض - العليا",
  "propertyImage": "https://cdn.example.com/properties/villa-new.jpg",
  "propertyPrice": 1800000,
  "status": "interested",
  "notes": "manual",
  "propertyId": "prop_db_999"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "property": {
      "id": "property_999",
      "propertyTitle": "فيلا جديدة في العليا",
      "propertyLocation": "الرياض - العليا",
      "propertyImage": "https://cdn.example.com/properties/villa-new.jpg",
      "propertyPrice": 1800000,
      "status": "interested",
      "notes": "manual",
      "propertyId": "prop_db_999",
      "addedAt": "2024-01-20T10:30:00Z"
    }
  }
}
```

### 4.4 Update Property Endpoint

**Endpoint:** `PUT /api/v2/customers-hub/customers/{customerId}/properties/{propertyId}`

**Request Body:**

```json
{
  "status": "viewed",
  "notes": "العميل أعجب بالعقار"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "property": {
      "id": "property_123",
      "propertyTitle": "فيلا فاخرة في العليا",
      "status": "viewed",
      "notes": "العميل أعجب بالعقار",
      "updatedAt": "2024-01-21T14:30:00Z"
    }
  }
}
```

### 4.5 Delete Property Endpoint

**Endpoint:** `DELETE /api/v2/customers-hub/customers/{customerId}/properties/{propertyId}`

**Request Body:** None (propertyId is in URL path)

**Response:**

```json
{
  "success": true,
  "data": {
    "deleted": true,
    "propertyId": "property_123"
  }
}
```

---

## 5. CUSTOMER REQUESTS SECTION

### 5.1 Customer Requests Section Display

The Customer Requests Section displays:
- **Main Request Card** - Shows customer purpose (buy/rent/invest) and property types
- **Budget Card** - Shows budget range (min - max) or "حتى Xk ريال"
- **Timeline Card** - Shows timeline preference (فوري, 1-3 أشهر, 3-6 أشهر, 6+ أشهر)
- **Specifications Card** - Shows:
  - Bedrooms count
  - Bathrooms count
  - Area range (min - max) in m²
- **Preferred Areas Card** - Shows preferred areas as badges
- **Additional Notes Card** - Shows customer notes (if available)
- **Source Info** - Shows campaign, landing page, inquiry ID (if available)

**Customer Preferences Data Structure:**

```typescript
interface CustomerPreferences {
  propertyType: string[];           // ['villa', 'apartment', 'land', 'commercial']
  budgetMin?: number;               // Minimum budget in SAR
  budgetMax?: number;               // Maximum budget in SAR
  preferredAreas: string[];        // City - District format
  preferredCities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;                 // in square meters
  maxArea?: number;                 // in square meters
  purpose: "buy" | "rent" | "invest";
  timeline: "immediate" | "1-3months" | "3-6months" | "6months+";
  amenities?: string[];
  floorPreference?: string;
  furnishing?: "furnished" | "unfurnished" | "semi-furnished" | "any";
  notes?: string;
}

interface SourceDetails {
  inquiryId?: string;
  referredBy?: string;
  referrerName?: string;
  campaign?: string;
  landingPage?: string;
  utmSource?: string;
  notes?: string;
}
```

### 5.2 Get Customer Preferences Endpoint

**Note:** Preferences are included in the main GET endpoint (Section 8). See Section 8 for the complete endpoint specification.

### 5.3 Update Customer Preferences Endpoint

**Endpoint:** `PUT /api/v2/customers-hub/customers/{customerId}/preferences`

**Request Body:**

```json
{
  "budgetMax": 2500000,
  "bedrooms": 5,
  "notes": "تحديث: يريد فيلا أكبر"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "preferences": {
      "propertyType": ["villa", "apartment"],
      "budgetMin": 500000,
      "budgetMax": 2500000,
      "bedrooms": 5,
      "notes": "تحديث: يريد فيلا أكبر"
    }
  }
}
```

---

## 6. COLLAPSIBLE SECTIONS

### 6.1 Collapsible Section Component

The page uses a `CollapsibleSection` component for:
- Properties Section
- Customer Requests Section

**Collapsible Section Features:**
- Toggle open/close state
- Icon and title
- Optional badge (showing count)
- Optional header action button (e.g., "+" for add)

**Note:** This is a **frontend-only component**. **NO backend endpoint is required** for collapsible functionality.

---

## 7. ERROR STATE

### 7.1 Customer Not Found State

When customer ID is invalid or customer doesn't exist, the page displays:
- Message: "العميل غير موجود" (Customer not found)
- Back button linking to `/dashboard/customers-hub`

**Error Response:**

**Endpoint:** `GET /api/v2/customers-hub/customers/{customerId}`

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer not found",
    "details": {
      "customerId": "customer_123"
    }
  }
}
```

---

## 8. CONSOLIDATED CUSTOMER DETAIL ENDPOINT (MAIN GET ENDPOINT)

### 8.1 Get All Customer Data Endpoint

**Endpoint:** `GET /api/v2/customers-hub/customers/{customerId}`

This endpoint returns **ALL** customer data in a single request (customer info + tasks + properties + preferences). This is the **primary endpoint** called when the page loads.

**Query Parameters (optional):**

```
?includeTasks=true&includeProperties=true&includePreferences=true
```

**Default Behavior:**
- If no query parameters are provided, returns **ALL** data (customer + tasks + properties + preferences)
- Query parameters can be used to exclude sections if needed:
  - `?includeTasks=false` - Exclude tasks
  - `?includeProperties=false` - Exclude properties
  - `?includePreferences=false` - Exclude preferences

**Response:**

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "customer_123",
      "name": "أحمد محمد",
      "stage": "qualified",
      "phone": "+966501234567",
      "whatsapp": "+966501234567",
      "email": "ahmed@example.com",
      "city": "الرياض",
      "district": "العليا",
      "occupation": "مهندس",
      "familySize": 4,
      "totalInteractions": 25,
      "totalAppointments": 8,
      "tags": ["vip", "investor", "urgent"]
    },
    "tasks": {
      "items": [
        {
          "id": "task_123",
          "type": "property_viewing",
          "datetime": "2024-01-21T14:30:00Z",
          "notes": "معاينة فيلا في العليا",
          "status": "pending",
          "propertyId": "property_456",
          "propertyTitle": "فيلا فاخرة في العليا",
          "createdAt": "2024-01-15T10:00:00Z"
        }
        // ... more tasks
      ],
      "stats": {
        "overdueCount": 2,
        "todayCount": 3,
        "totalActive": 8,
        "totalCompleted": 12
      }
    },
    "properties": {
      "preferences": {
        "propertyType": ["villa", "apartment"],
        "budgetMin": 500000,
        "budgetMax": 2000000,
        "bedrooms": 4,
        "preferredAreas": ["الرياض - العليا", "الرياض - النرجس"]
      },
      "items": [
        {
          "id": "property_123",
          "propertyTitle": "فيلا فاخرة في العليا",
          "propertyLocation": "الرياض - العليا",
          "propertyImage": "https://cdn.example.com/properties/villa-123.jpg",
          "propertyPrice": 1500000,
          "status": "interested",
          "notes": "من الموقع",
          "propertyId": "prop_db_123",
          "addedAt": "2024-01-15T10:00:00Z"
        }
        // ... more properties
      ],
      "categories": {
        "website": [
          {
            "id": "property_123",
            "propertyTitle": "فيلا فاخرة في العليا",
            "status": "interested"
          }
        ],
        "aiMatched": [
          {
            "id": "property_456",
            "propertyTitle": "شقة في النرجس",
            "status": "viewing_scheduled"
          }
        ],
        "manual": [
          {
            "id": "property_789",
            "propertyTitle": "أرض في الياسمين",
            "status": "offer_made"
          }
        ]
      }
    },
    "preferences": {
      "propertyType": ["villa", "apartment"],
      "budgetMin": 500000,
      "budgetMax": 2000000,
      "preferredAreas": ["الرياض - العليا", "الرياض - النرجس"],
      "preferredCities": ["الرياض"],
      "bedrooms": 4,
      "bathrooms": 3,
      "minArea": 300,
      "maxArea": 500,
      "purpose": "buy",
      "timeline": "1-3months",
      "amenities": ["pool", "garage", "garden"],
      "floorPreference": "ground",
      "furnishing": "furnished",
      "notes": "يريد فيلا مع حديقة كبيرة"
    },
    "sourceDetails": {
      "inquiryId": "INQ-12345",
      "campaign": "Summer Sale 2024",
      "landingPage": "/properties/villas",
      "utmSource": "google_ads"
    }
  }
}
```

**Calculation Logic:**

- `customer.totalInteractions`: Count of all interactions (calls, WhatsApp, emails) for this customer
- `customer.totalAppointments`: Count of all appointments (completed + pending) for this customer
- `tasks.stats.overdueCount`: Count tasks where `status = 'pending'` AND `datetime < NOW()`
- `tasks.stats.todayCount`: Count tasks where `status = 'pending'` AND `DATE(datetime) = CURRENT_DATE`
- `tasks.stats.totalActive`: Count tasks where `status = 'pending'`
- `tasks.stats.totalCompleted`: Count tasks where `status IN ('completed', 'cancelled')`
- `properties.categories`: Categorize properties based on status and notes (see Section 4.2)

**Field Selection:**

**MANDATORY:** Select only required fields:
- Customer: `id`, `name`, `stage`, `phone`, `whatsapp`, `email`, `city`, `district`, `occupation`, `familySize`, `tags`
- Tasks: `id`, `type`, `datetime`, `notes`, `status`, `propertyId`, `propertyTitle`, `createdAt`, `updatedAt`
- Properties: `id`, `propertyTitle`, `propertyLocation`, `propertyImage`, `propertyPrice`, `status`, `notes`, `propertyId`, `addedAt`

**Performance Note:** Backend should execute all queries (customer, tasks, properties, preferences) in **parallel** for optimal performance. Response time target: **< 150ms**.

---

## 9. UPDATE CUSTOMER ENDPOINT

### 9.1 Update Customer Endpoint

**Endpoint:** `PUT /api/v2/customers-hub/customers/{customerId}`

**Request Body:**

```json
{
  "name": "أحمد محمد علي",
  "phone": "+966501234568",
  "email": "ahmed.new@example.com",
  "city": "جدة",
  "district": "الكورنيش",
  "occupation": "مهندس معماري",
  "familySize": 5,
  "tags": ["vip", "investor", "urgent", "premium"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "customer_123",
      "name": "أحمد محمد علي",
      "phone": "+966501234568",
      "email": "ahmed.new@example.com",
      "city": "جدة",
      "district": "الكورنيش",
      "occupation": "مهندس معماري",
      "familySize": 5,
      "tags": ["vip", "investor", "urgent", "premium"],
      "updatedAt": "2024-01-21T14:30:00Z"
    }
  }
}
```

**Allowed Updates:**
- `name`, `phone`, `whatsapp`, `email`, `city`, `district`, `occupation`, `familySize`, `tags`, `stage`, `priority`

---

## 10. PERFORMANCE OPTIMIZATION

### 10.1 CRITICAL PERFORMANCE REQUIREMENTS

**MANDATORY:** This system handles **MILLIONS of records** (50+ million requests, 20+ million customers). **ALL** performance optimizations below are **MANDATORY**. Response times must be **extremely fast** (< 100ms for customer details, < 150ms for tasks/properties). **NO CACHING** is allowed - all queries must hit database directly with optimal indexing and query optimization.

### 10.2 Database Indexing Strategy

**MANDATORY INDEXES (PostgreSQL example):**

```sql
-- Customers table indexes for detail page
CREATE INDEX CONCURRENTLY idx_customers_id_covering ON customers(id) INCLUDE (name, stage, phone, whatsapp, email, city, district, occupation, family_size, tags);
CREATE INDEX CONCURRENTLY idx_customers_id_created_at ON customers(id, created_at DESC);

-- Tasks/Appointments/Reminders indexes
CREATE INDEX CONCURRENTLY idx_tasks_customer_id_datetime ON tasks(customer_id, datetime DESC) WHERE status = 'pending';
CREATE INDEX CONCURRENTLY idx_tasks_customer_id_status ON tasks(customer_id, status, datetime DESC);
CREATE INDEX CONCURRENTLY idx_appointments_customer_id ON appointments(customer_id, datetime DESC);
CREATE INDEX CONCURRENTLY idx_reminders_customer_id ON reminders(customer_id, datetime DESC);

-- Properties indexes
CREATE INDEX CONCURRENTLY idx_properties_customer_id ON customer_properties(customer_id, added_at DESC);
CREATE INDEX CONCURRENTLY idx_properties_customer_status ON customer_properties(customer_id, status);
CREATE INDEX CONCURRENTLY idx_properties_customer_notes ON customer_properties(customer_id) WHERE notes IS NOT NULL;

-- Preferences indexes
CREATE INDEX CONCURRENTLY idx_customers_preferences ON customers USING GIN(preferences);
CREATE INDEX CONCURRENTLY idx_customers_source_details ON customers USING GIN(source_details);

-- Interactions indexes
CREATE INDEX CONCURRENTLY idx_interactions_customer_id ON interactions(customer_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_interactions_customer_type ON interactions(customer_id, type, created_at DESC);

-- Stats calculation indexes
CREATE INDEX CONCURRENTLY idx_interactions_customer_count ON interactions(customer_id) WHERE created_at >= NOW() - INTERVAL '1 year';
CREATE INDEX CONCURRENTLY idx_appointments_customer_count ON appointments(customer_id) WHERE created_at >= NOW() - INTERVAL '1 year';

-- Full-text search indexes
CREATE INDEX CONCURRENTLY idx_customers_name_search ON customers USING GIN(to_tsvector('arabic', name));
CREATE INDEX CONCURRENTLY idx_properties_title_search ON customer_properties USING GIN(to_tsvector('arabic', property_title));
```

### 10.3 Query Optimization Rules

**MANDATORY QUERY OPTIMIZATION:**

1. **Primary Key Lookup:** Use `WHERE id = ?` for customer lookups (fastest possible query)

2. **Field Selection:** NEVER use `SELECT *`. Always select only required fields:
   ```sql
   -- ❌ BAD
   SELECT * FROM customers WHERE id = ?;
   
   -- ✅ GOOD
   SELECT id, name, stage, phone, whatsapp, email, city, district, occupation, family_size, tags
   FROM customers WHERE id = ?;
   ```

3. **Stats Calculation:** Use separate COUNT queries with indexes:
   ```sql
   SELECT COUNT(*) FROM interactions WHERE customer_id = ?;
   SELECT COUNT(*) FROM appointments WHERE customer_id = ?;
   ```

4. **Tasks Query:** Use indexed query with status filter:
   ```sql
   SELECT * FROM tasks 
   WHERE customer_id = ? AND status = ?
   ORDER BY datetime DESC
   LIMIT 100;
   ```

5. **Properties Query:** Use indexed query with categorization:
   ```sql
   SELECT * FROM customer_properties 
   WHERE customer_id = ?
   ORDER BY added_at DESC;
   ```

6. **JSON Field Queries:** Use JSONB indexes for `preferences` and `source_details`:
   ```sql
   SELECT preferences, source_details FROM customers WHERE id = ?;
   ```

7. **Avoid N+1 Queries:** Use JOINs or batch queries when fetching related data:
   ```sql
   -- ✅ GOOD: Single query with JOIN
   SELECT c.*, COUNT(t.id) as task_count
   FROM customers c
   LEFT JOIN tasks t ON t.customer_id = c.id
   WHERE c.id = ?
   GROUP BY c.id;
   ```

8. **Limit Result Sets:** Always use `LIMIT` for lists. Maximum `limit` = 1000.

### 10.4 Pagination Limits

**STRICT LIMITS:**

- Maximum `limit` for tasks: **100**
- Maximum `limit` for properties: **100**
- Default `limit`: **50**
- Maximum `offset`: **1000000** (1 million)
- **RECOMMENDATION:** Use cursor-based pagination for large datasets (using `createdAt` or `id` as cursor)

### 10.5 Field Selection

**MANDATORY:** Always select only required fields. Never use `SELECT *`.

**Required Fields for Customer Info Card:**
- `id`, `name`, `stage`, `phone`, `whatsapp`, `email`, `city`, `district`, `occupation`, `familySize`, `tags`

**Required Fields for Tasks:**
- `id`, `type`, `datetime`, `notes`, `status`, `propertyId`, `propertyTitle`, `createdAt`, `updatedAt`

**Required Fields for Properties:**
- `id`, `propertyTitle`, `propertyLocation`, `propertyImage`, `propertyPrice`, `status`, `notes`, `propertyId`, `addedAt`

### 10.6 Read Replicas

**MANDATORY:** Use read replicas for ALL `SELECT` queries. Route all customer detail queries to read replicas.

### 10.7 Database Partitioning

**MANDATORY:** Partition large tables by date range.

**Example (PostgreSQL):**
```sql
-- Partition tasks table by month
CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,
    datetime TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL,
    -- ... other columns
) PARTITION BY RANGE (datetime);

-- Create monthly partitions
CREATE TABLE tasks_2024_01 PARTITION OF tasks
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE tasks_2024_02 PARTITION OF tasks
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- ... more partitions
```

### 10.8 Parallel Query Execution

**MANDATORY:** Execute multiple customer detail queries in parallel when `include` array has multiple items.

**Example:**
- If `include: ["basic_info", "stats", "preferences"]`, execute all 3 queries in parallel using database connection pooling or async query execution.

### 10.9 Strict Query Timeout Limits

**MANDATORY:** Enforce strict query timeouts:

- Customer detail queries: **Maximum 500ms**
- Tasks queries: **Maximum 1 second**
- Properties queries: **Maximum 1 second**
- Stats calculation queries: **Maximum 500ms**
- Update queries: **Maximum 500ms**

**If query exceeds timeout, return partial results or error immediately.**

### 10.10 Database Query Monitoring

**MANDATORY:** Log and monitor all queries:

- Log all queries exceeding 100ms
- Alert on queries exceeding 500ms
- Track query execution times
- Monitor index usage
- Track slow query patterns

### 10.11 Response Size Optimization

**MANDATORY:**

- Limit response size: **Maximum 10MB per response**
- Remove null values from JSON responses
- Use compression (gzip) for responses > 1MB
- Minify JSON responses (remove unnecessary whitespace)
- Limit tasks per response: **Maximum 100**
- Limit properties per response: **Maximum 100**

### 10.12 Index Maintenance

**MANDATORY:** Regular index maintenance:

- Rebuild indexes weekly: `REINDEX INDEX CONCURRENTLY index_name;`
- Update statistics daily: `ANALYZE customers; ANALYZE tasks; ANALYZE customer_properties;`
- Monitor index bloat: Use `pg_stat_user_indexes` to track index usage

### 10.13 Materialized Views (NOT CACHING)

**ALLOWED:** Use materialized views for pre-computed aggregations. **This is NOT caching** - it's a database optimization technique.

**Example:**
```sql
-- Materialized view for customer stats
CREATE MATERIALIZED VIEW mv_customer_stats AS
SELECT 
    customer_id,
    COUNT(*) FILTER (WHERE type = 'call') AS call_count,
    COUNT(*) FILTER (WHERE type = 'whatsapp') AS whatsapp_count,
    COUNT(*) FILTER (WHERE type = 'email') AS email_count,
    COUNT(*) AS total_interactions
FROM interactions
WHERE created_at >= NOW() - INTERVAL '1 year'
GROUP BY customer_id;

-- Refresh materialized view every hour (NOT caching - database optimization)
CREATE INDEX ON mv_customer_stats(customer_id);
```

**Refresh Strategy:**
- Refresh materialized views every hour (or more frequently if needed)
- Use `REFRESH MATERIALIZED VIEW CONCURRENTLY` to avoid locking

### 10.14 Full-Text Search Optimization

**For search functionality (if added):**

- Use PostgreSQL full-text search indexes for name, property title search
- Use `tsvector` and `tsquery` for efficient text search
- Index: `CREATE INDEX idx_customers_name_search ON customers USING GIN(to_tsvector('arabic', name));`

### 10.15 Batch Updates

**For bulk operations (if added):**

- Use batch updates (e.g., `UPDATE ... WHERE id IN (...)` with batches of 1000)
- Use transactions for consistency
- Use `RETURNING` clause to get updated rows

### 10.16 Task/Property Update Optimization

**For task and property updates:**

- Use single `UPDATE` statement: `UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ? AND customer_id = ?`
- Use `RETURNING` clause to get updated data
- Use connection pooling for concurrent updates
- Validate `customer_id` to prevent unauthorized updates

### 10.17 Performance Targets

**MANDATORY RESPONSE TIME TARGETS:**

- Customer detail (basic info): **< 50ms**
- Customer detail (with stats): **< 100ms**
- Customer detail (consolidated): **< 150ms**
- Tasks list: **< 100ms**
- Add/Update/Delete task: **< 200ms**
- Properties list: **< 100ms**
- Add/Update/Delete property: **< 200ms**
- Customer preferences: **< 50ms**
- Update customer: **< 200ms**

### 10.18 NO CACHING POLICY

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

## 11. ERROR HANDLING

### 11.1 Standard Error Response Format

All endpoints must return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer not found",
    "details": {
      "field": "customerId",
      "value": "customer_123",
      "reason": "Customer does not exist in database"
    }
  }
}
```

### 11.2 Error Codes

**Customer Errors:**
- `CUSTOMER_NOT_FOUND` - Customer ID not found
- `CUSTOMER_UPDATE_FAILED` - Failed to update customer
- `CUSTOMER_INVALID_DATA` - Invalid customer data provided

**Task Errors:**
- `TASK_NOT_FOUND` - Task ID not found
- `TASK_INVALID_TYPE` - Invalid task type
- `TASK_INVALID_DATETIME` - Invalid datetime (must be in future for pending tasks)
- `TASK_UPDATE_FAILED` - Failed to update task
- `TASK_DELETE_FAILED` - Failed to delete task

**Property Errors:**
- `PROPERTY_NOT_FOUND` - Property ID not found
- `PROPERTY_INVALID_STATUS` - Invalid property status
- `PROPERTY_UPDATE_FAILED` - Failed to update property
- `PROPERTY_DELETE_FAILED` - Failed to delete property

**Preferences Errors:**
- `PREFERENCES_UPDATE_FAILED` - Failed to update preferences
- `PREFERENCES_INVALID_DATA` - Invalid preferences data

**Query Errors:**
- `QUERY_TIMEOUT` - Query exceeded timeout limit
- `QUERY_FAILED` - Database query failed
- `INSUFFICIENT_PERMISSIONS` - User lacks permissions

---

## 12. DATA TYPES

### 12.1 Customer Types

```typescript
interface Customer {
  id: string;
  name: string;
  stage: CustomerLifecycleStage;
  phone: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  district?: string;
  occupation?: string;
  familySize?: number;
  tags: string[];
  totalInteractions: number;
  totalAppointments: number;
}
```

### 12.2 Task Types

```typescript
type TaskType = "contact" | "office_visit" | "property_viewing";

interface CustomerTask {
  id: string;
  type: TaskType;
  datetime: string;                 // ISO 8601 format, UTC timezone
  notes?: string;
  status: "pending" | "completed" | "cancelled";
  propertyId?: string;
  propertyTitle?: string;
  createdAt: string;                // ISO 8601 format, UTC timezone
  updatedAt?: string;               // ISO 8601 format, UTC timezone
}
```

### 12.3 Property Types

```typescript
interface PropertyInterest {
  id: string;
  propertyTitle: string;
  propertyLocation?: string;
  propertyImage?: string;
  propertyPrice?: number;
  status: "interested" | "viewing_scheduled" | "viewed" | "liked" | "rejected" | "offer_made";
  notes?: string;
  propertyId?: string;
  addedAt: string;                  // ISO 8601 format, UTC timezone
  updatedAt?: string;               // ISO 8601 format, UTC timezone
}
```

### 12.4 Preferences Types

```typescript
interface CustomerPreferences {
  propertyType: string[];
  budgetMin?: number;
  budgetMax?: number;
  preferredAreas: string[];
  preferredCities?: string[];
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  purpose: "buy" | "rent" | "invest";
  timeline: "immediate" | "1-3months" | "3-6months" | "6months+";
  amenities?: string[];
  floorPreference?: string;
  furnishing?: "furnished" | "unfurnished" | "semi-furnished" | "any";
  notes?: string;
}
```

---

## 13. DATE/TIME HANDLING

### 13.1 Date Format

**MANDATORY:** All dates must be in **ISO 8601 format** with **UTC timezone**.

**Format:** `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ`

**Examples:**
- `2024-01-15T10:30:00Z`
- `2024-01-15T10:30:00.000Z`

### 13.2 DateTime Formatting (Frontend)

**Note:** DateTime formatting (e.g., "اليوم HH:mm", "غداً HH:mm") is handled by frontend. Backend should return ISO 8601 format only.

---

## 14. VERIFICATION CHECKLIST

### 14.1 Page Components Coverage

- ✅ Header Section (Section 1)
- ✅ Customer Info Card (Section 2)
- ✅ Tasks Section (Section 3)
- ✅ Properties Section (Section 4)
- ✅ Customer Requests Section (Section 5)
- ✅ Collapsible Sections (Section 6 - frontend only)
- ✅ Error State (Section 7)

### 14.2 Data Fields Coverage

- ✅ Customer basic info (name, stage, contact, location, occupation, family size)
- ✅ Customer stats (totalInteractions, totalAppointments)
- ✅ Customer tags
- ✅ Tasks (type, datetime, notes, status, property info)
- ✅ Task stats (overdue, today, active, completed)
- ✅ Properties (title, location, image, price, status, notes)
- ✅ Property categories (website, AI-matched, manual)
- ✅ Customer preferences (property type, budget, areas, specifications)
- ✅ Source details (campaign, landing page, inquiry ID)

### 14.3 Endpoints Coverage

- ✅ Main GET endpoint (`GET /api/v2/customers-hub/customers/{customerId}`) - Returns all data
- ✅ Update customer endpoint (`PUT /api/v2/customers-hub/customers/{customerId}`)
- ✅ Add task endpoint (`POST /api/v2/customers-hub/customers/{customerId}/tasks`)
- ✅ Update task endpoint (`PUT /api/v2/customers-hub/customers/{customerId}/tasks/{taskId}`)
- ✅ Delete task endpoint (`DELETE /api/v2/customers-hub/customers/{customerId}/tasks/{taskId}`)
- ✅ Add property endpoint (`POST /api/v2/customers-hub/customers/{customerId}/properties`)
- ✅ Update property endpoint (`PUT /api/v2/customers-hub/customers/{customerId}/properties/{propertyId}`)
- ✅ Delete property endpoint (`DELETE /api/v2/customers-hub/customers/{customerId}/properties/{propertyId}`)
- ✅ Update preferences endpoint (`PUT /api/v2/customers-hub/customers/{customerId}/preferences`)

### 14.4 Performance Requirements Coverage

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

## 15. IMPLEMENTATION NOTES

### 15.1 Request Body vs Query Parameters

**MANDATORY:** 
- **GET requests:** Use query parameters for optional filters (e.g., `?includeTasks=false`)
- **POST/PUT requests:** All data MUST be sent in the request body
- **DELETE requests:** No request body needed (ID in URL path)

### 15.2 Customer ID Validation

**MANDATORY:** Always validate that `customerId` exists and user has permission to access it before processing any request.

### 15.3 Task DateTime Validation

**MANDATORY:** For pending tasks, validate that `datetime` is in the future. Reject tasks with past datetime for pending status.

### 15.4 Property Categorization

**MANDATORY:** Backend must categorize properties based on:
- `status` field
- `notes` field (checking for "AI" or "manual" strings)

### 15.5 Parallel Query Execution

**RECOMMENDED:** When `include` array has multiple items, execute all queries in parallel for optimal performance.

### 15.6 Error Handling

**MANDATORY:** All endpoints must return standardized error responses with error codes, messages, and details.

### 15.7 Date/Time Format

**MANDATORY:** All dates must be in ISO 8601 format with UTC timezone.

### 15.8 Field Selection

**MANDATORY:** Only select required fields to minimize response size and improve performance.

---

## 16. TESTING SCENARIOS

### 16.1 Main GET Endpoint Request

**Test:** Request all customer data (page load)

**Request:**
```
GET /api/v2/customers-hub/customers/{customerId}
```

**Expected:** Response with customer + tasks + properties + preferences in < 150ms

### 16.2 Main GET Endpoint with Filters

**Test:** Request customer data excluding some sections

**Request:**
```
GET /api/v2/customers-hub/customers/{customerId}?includeTasks=false&includeProperties=false
```

**Expected:** Response with customer + preferences only in < 100ms

### 16.3 Add Task Request

**Test:** Add new task

**Request:**
```
POST /api/v2/customers-hub/customers/{customerId}/tasks
```

**Request Body:**
```json
{
  "type": "property_viewing",
  "datetime": "2024-01-25T15:00:00Z",
  "notes": "معاينة فيلا جديدة",
  "propertyTitle": "فيلا في النرجس"
}
```

**Expected:** Response with created task in < 200ms

### 16.4 Update Task Request

**Test:** Update task status

**Request:**
```
PUT /api/v2/customers-hub/customers/{customerId}/tasks/{taskId}
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Expected:** Response with updated task in < 200ms

### 16.5 Delete Task Request

**Test:** Delete task

**Request:**
```
DELETE /api/v2/customers-hub/customers/{customerId}/tasks/{taskId}
```

**Expected:** Success response in < 200ms

### 16.6 Add Property Request

**Test:** Add new property

**Request:**
```
POST /api/v2/customers-hub/customers/{customerId}/properties
```

**Request Body:**
```json
{
  "propertyTitle": "فيلا جديدة في العليا",
  "propertyLocation": "الرياض - العليا",
  "propertyPrice": 1800000,
  "status": "interested",
  "notes": "manual"
}
```

**Expected:** Response with created property in < 200ms

### 16.7 Update Customer Request

**Test:** Update customer information

**Request:**
```
PUT /api/v2/customers-hub/customers/{customerId}
```

**Request Body:**
```json
{
  "name": "أحمد محمد علي",
  "phone": "+966501234568"
}
```

**Expected:** Response with updated customer in < 200ms

### 16.8 Update Preferences Request

**Test:** Update customer preferences

**Request:**
```
PUT /api/v2/customers-hub/customers/{customerId}/preferences
```

**Request Body:**
```json
{
  "budgetMax": 2500000,
  "bedrooms": 5
}
```

**Expected:** Response with updated preferences in < 200ms

### 16.9 Customer Not Found

**Test:** Request non-existent customer

**Request:**
```
GET /api/v2/customers-hub/customers/invalid_id
```

**Expected:** Error response with `CUSTOMER_NOT_FOUND` code

### 16.8 Performance Test

**Test:** Request customer detail with millions of records

**Expected:** Response time < 100ms for basic info, < 150ms for consolidated detail

---

## END OF SPECIFICATION

This specification provides complete technical details for implementing the backend API for the Customers Hub Customer Detail page. All endpoints, data structures, performance optimizations, and error handling requirements are documented above.

**CRITICAL REMINDER:** This system handles **MILLIONS of records**. **ALL** performance optimizations in Section 10 are **MANDATORY**. **NO CACHING** is allowed. Response times must be **extremely fast**.
