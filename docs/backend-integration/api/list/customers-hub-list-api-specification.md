# Customers Hub List Page - Backend API Integration Specification

## Overview

This document provides complete technical specifications for integrating the **Customers Hub List Page** (`/dashboard/customers-hub/list`) with the backend API. This specification is designed for AI systems to implement the backend endpoints and data structures.

**Page Location:** `app/dashboard/customers-hub/list/page.tsx`  
**Component:** `components/customers-hub/page/EnhancedCustomersHubPage.tsx`

**CRITICAL PERFORMANCE REQUIREMENT:** This system handles **MILLIONS of records** (50+ million requests, 20+ million customers). **ALL** performance optimizations in Section 13 are **MANDATORY**. Response times must be **extremely fast** (< 100ms for list, < 200ms for stats). **NO CACHING** is allowed - all queries must hit database directly with optimal indexing and query optimization.

**CONSOLIDATED API DESIGN:** All operations use consolidated endpoints with the `action` field in the request body controlling the operation type. This reduces endpoint complexity and improves maintainability.

---

## API ENDPOINTS OVERVIEW

The API uses **8 consolidated endpoints** with action-based control via request body:

1. **`POST /api/v2/customers-hub/list`** - Main list endpoint (list, stats, AI insights, pending actions count)
2. **`POST /api/v2/customers-hub/list/saved-filters`** - Saved filters operations (save, get, update, delete)
3. **`POST /api/v2/customers-hub/list/bulk`** - Bulk operations (update_stage, update_priority, add_tags, assign_employee, send_email, archive, delete)
4. **`POST /api/v2/customers-hub/list/export-import`** - Export and import operations
5. **`POST /api/v2/customers-hub/assignment`** - Assignment operations (get_employees, get_unassigned_count, auto_assign, assign)
6. **`POST /api/v2/customers-hub/notifications`** - Notifications operations (get, mark_read, mark_all_read)
7. **`POST /api/v2/customers-hub/customers`** - Customer operations (create, add_appointment, add_reminder, add_note)
8. **`GET /api/v2/customers-hub/actions/pending-count`** - Get pending actions count (simple GET endpoint)

---

## Page Structure

The Customers Hub List page consists of the following main sections:

1. **Stats Cards Section** - Displays statistical cards (Section 1)
2. **Advanced Filters Section** - Contains dropdown filters and multi-select filters (Section 2)
3. **Saved Filters Section** - Save and apply saved filter configurations (Section 3)
4. **View Mode Tabs** - Table, Grid, and Map views (Sections 4, 5, 6)
5. **Search Functionality** - Search by name, phone, email (Section 7)
6. **Pagination** - Page-based pagination with configurable page size (Section 8)
7. **Bulk Actions Bar** - Bulk operations on selected customers (Section 9)
8. **Export Functionality** - Export customers to CSV, Excel, PDF (Section 10)
9. **Quick Actions** - Quick actions dropdown (add customer, import, export) (Section 11)
10. **Assignment Panel** - Auto-assignment rules and employee management (Section 12)
11. **Notifications Center** - Customer notifications and alerts (Section 13)
12. **Quick Add FAB** - Floating action button for quick additions (Section 14)
13. **Add Customer Dialog** - Dialog for adding new customers (Section 15)
14. **Pending Actions Count** - Badge showing pending actions count (Section 16)
15. **Selection Info** - Display selected customers count (Section 17)

---

## 1. STATS CARDS SECTION

### 1.1 Stats Cards Display

The page displays stats cards showing overall customer statistics.

**Stats Cards Data Structure:**

```typescript
interface CustomerStatistics {
  total: number;                    // Total customers count
  newThisMonth: number;             // New customers added this month
  totalDealValue: number;           // Total deal value in SAR
  closedThisMonth: number;          // Closed deals this month
  conversionRate: number;           // Conversion rate percentage
  avgDaysInPipeline: number;        // Average days in pipeline
  byStage: Record<string, number>;  // Count by lifecycle stage
}
```

### 1.2 Stats Cards Endpoint

**Endpoint:** `POST /api/v2/customers-hub/list`

**Request Body:** (All filters must be sent in request body, NOT query parameters)

**Option 1: Get stats only**

```json
{
  "action": "stats",
  "filters": {
    "searchTerm": "",
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"],
    "propertyType": ["villa", "apartment"],
    "budgetMin": 500000,
    "budgetMax": 2000000,
    "createdFrom": "2024-01-01T00:00:00Z",
    "createdTo": "2024-12-31T23:59:59Z",
    "assignedEmployeeId": "employee_123",
    "city": ["الرياض", "جدة"],
    "tags": ["vip", "investor"]
  }
}
```

**Option 2: Include stats in list response**

```json
{
  "action": "list",
  "includeStats": true,
  "filters": {
    /* Same filters */
  },
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

**Response (when action: "stats"):**

```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 125000,
      "newThisMonth": 1250,
      "totalDealValue": 2500000000,
      "closedThisMonth": 45,
      "conversionRate": 12.5,
      "avgDaysInPipeline": 28,
      "byStage": {
        "new_lead": 50000,
        "qualified": 25000,
        "property_matching": 20000,
        "site_visit": 15000,
        "negotiation": 10000,
        "contract_prep": 5000,
        "down_payment": 3000,
        "closing": 2000,
        "post_sale": 1000
      }
    }
  }
}
```

**Response (when action: "stats" and statsType: "ai_insights"):**

```json
{
  "success": true,
  "data": {
    "aiInsights": {
      "urgentActions": 125,
      "todayFollowUps": 45,
      "churnRiskHigh": 89,
      "topActions": [
        {
          "customerId": "customer_123",
          "customerName": "أحمد محمد",
          "stage": "negotiation",
          "nextBestAction": "اتصل بالعميل لتأكيد موعد توقيع العقد"
        }
      ]
    }
  }
}
```

**Calculation Logic:**

- `total`: Count customers matching all active filters
- `newThisMonth`: Count customers where `createdAt >= first day of current month` AND matches filters
- `totalDealValue`: Sum of `dealValue` from customers where `stage IN ['closing', 'post_sale']` AND matches filters
- `closedThisMonth`: Count customers where `stage = 'post_sale'` AND `updatedAt >= first day of current month` AND matches filters
- `conversionRate`: `(closedThisMonth / newThisMonth) * 100` (if newThisMonth > 0)
- `avgDaysInPipeline`: Average of `(updatedAt - createdAt)` in days for customers where `stage != 'post_sale'` AND matches filters
- `byStage`: Count customers grouped by `stage` field, filtered by all active filters

### 1.3 AI Insights Stats (Additional)

**Endpoint:** `POST /api/v2/customers-hub/list`

**Request Body:**

**Option 1: Get AI insights stats only**

```json
{
  "action": "stats",
  "statsType": "ai_insights",
  "filters": {
    /* Same filters as stats endpoint */
  }
}
```

**Option 2: Include AI insights in list response**

```json
{
  "action": "list",
  "includeAiInsights": true,
  "filters": {
    /* Same filters */
  },
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```


---

## 2. ADVANCED FILTERS SECTION

### 2.1 Filter Types

The page supports the following filter types:

**Filter Structure:**

```typescript
interface CustomerFilters {
  searchTerm?: string;                    // Search in name, phone, email
  stage?: CustomerLifecycleStage[];       // Multiple stages selection
  priority?: Priority[];                  // Multiple priorities selection
  source?: CustomerSource[];              // Multiple sources selection
  propertyType?: string[];                // ['villa', 'apartment', 'land', 'commercial']
  budgetMin?: number;                     // Minimum budget in SAR
  budgetMax?: number;                     // Maximum budget in SAR
  createdFrom?: string;                   // ISO 8601 date
  createdTo?: string;                     // ISO 8601 date
  assignedEmployeeId?: string;           // Single employee ID
  city?: string[];                        // Multiple cities
  tags?: string[];                        // Multiple tags
  hasAppointments?: boolean;              // Has upcoming appointments
  hasNotes?: boolean;                     // Has notes
  lastContactFrom?: string;               // ISO 8601 date
  lastContactTo?: string;                 // ISO 8601 date
}
```

### 2.2 Filter Application

**CRITICAL:** When ANY filter changes, send request to backend with ALL filters in request body.

**Endpoint:** `POST /api/v2/customers-hub/list`

**Request Body:**

```json
{
  "action": "list",  // Required: "list" | "stats"
  "filters": {
    "searchTerm": "أحمد",
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"],
    "propertyType": ["villa"],
    "budgetMin": 1000000,
    "budgetMax": 3000000,
    "createdFrom": "2024-01-01T00:00:00Z",
    "createdTo": "2024-12-31T23:59:59Z",
    "assignedEmployeeId": "employee_123",
    "city": ["الرياض"],
    "tags": ["vip"]
  },
  "pagination": {
    "page": 1,
    "limit": 50,
    "sortBy": "createdAt",
    "sortOrder": "desc"
  },
  "includeStats": true,  // Optional: include stats in response
  "includeAiInsights": true,  // Optional: include AI insights stats in response
  "includePendingActionsCount": true  // Optional: include pending actions count in response
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
        "nameEn": "Ahmed Mohammed",
        "phone": "+966501234567",
        "whatsapp": "+966501234567",
        "email": "ahmed@example.com",
        "city": "الرياض",
        "district": "حي النرجس",
        "stage": "qualified",
        "priority": "high",
        "source": "whatsapp",
        "assignedEmployeeId": "employee_123",
        "assignedEmployee": {
          "id": "employee_123",
          "name": "محمد العلي"
        },
        "totalInteractions": 5,
        "lastContactAt": "2024-01-15T10:30:00Z",
        "lastContactType": "call",
        "nextFollowUpDate": "2024-01-20T10:00:00Z",
        "createdAt": "2024-01-10T08:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "preferences": {
          "propertyType": ["villa"],
          "budgetMin": 1500000,
          "budgetMax": 2500000,
          "preferredAreas": ["حي النرجس", "حي العليا"],
          "preferredCities": ["الرياض"],
          "bedrooms": 4,
          "purpose": "buy",
          "timeline": "1-3months"
        },
        "aiInsights": {
          "churnRisk": "low",
          "conversionProbability": 75,
          "nextBestAction": "اتصل بالعميل لتأكيد موعد المعاينة",
          "propertyMatches": ["property_001", "property_002"]
        },
        "tags": ["vip", "investor"],
        "latitude": 24.7136,
        "longitude": 46.6753
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250,
      "totalPages": 25
    },
    "stats": {
      /* Stats object if includeStats=true - See Section 1.2 */
    },
    "aiInsights": {
      /* AI Insights stats if includeAiInsights=true - See Section 1.3 */
    },
    "pendingActionsCount": {
      /* Pending actions count if includePendingActionsCount=true - See Section 16 */
      "pendingCount": 25,
      "urgentCount": 5,
      "overdueCount": 3
    }
  }
}
```

---

## 3. SAVED FILTERS SECTION

### 3.1 Saved Filters Operations

**Endpoint:** `POST /api/v2/customers-hub/list/saved-filters`

**All saved filter operations use the same endpoint with `filterAction` field:**

#### 3.1.1 Save Filter

**Request Body:**

```json
{
  "filterAction": "save",
  "name": "عملاء الرياض - ميزانية عالية",
  "filters": {
    "city": ["الرياض"],
    "budgetMin": 2000000,
    "stage": ["qualified", "property_matching"]
  },
  "isFavorite": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "filter_123",
    "name": "عملاء الرياض - ميزانية عالية",
    "filters": {
      "city": ["الرياض"],
      "budgetMin": 2000000,
      "stage": ["qualified", "property_matching"]
    },
    "isFavorite": false,
    "createdAt": "2024-01-15T10:00:00Z",
    "usageCount": 0
  }
}
```

#### 3.1.2 Get Saved Filters

**Request Body:**

```json
{
  "filterAction": "get"
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "filter_123",
      "name": "عملاء الرياض - ميزانية عالية",
      "filters": { /* ... */ },
      "isFavorite": true,
      "createdAt": "2024-01-15T10:00:00Z",
      "usageCount": 15
    }
  ]
}
```

#### 3.1.3 Update Saved Filter

**Request Body:**

```json
{
  "filterAction": "update",
  "filterId": "filter_123",
  "name": "Updated filter name",
  "isFavorite": true
}
```

#### 3.1.4 Delete Saved Filter

**Request Body:**

```json
{
  "filterAction": "delete",
  "filterId": "filter_123"
}
```

---

## 4. TABLE VIEW

### 4.1 Table Columns

The table displays the following columns:

1. **العميل (Customer)** - Name and phone number
2. **المرحلة (Stage)** - Lifecycle stage badge
3. **الأولوية (Priority)** - Priority badge
4. **المصدر (Source)** - Source badge
5. **الموظف المسؤول (Assigned Employee)** - Employee name with assignment dropdown
6. **آخر تواصل (Last Contact)** - Last contact date and type
7. **الإجراءات (Actions)** - View details button

### 4.2 Table Data Requirements

**Required Customer Fields for Table:**

- `id`: Customer ID
- `name`: Customer name (Arabic)
- `phone`: Phone number
- `stage`: Lifecycle stage
- `priority`: Priority level
- `source`: Customer source
- `assignedEmployeeId`: Assigned employee ID
- `assignedEmployee.name`: Assigned employee name
- `lastContactAt`: Last contact date (ISO 8601)
- `lastContactType`: Last contact type ('call', 'whatsapp', 'email', etc.)

### 4.3 Table Sorting

**Default Sorting:** `createdAt DESC` (latest created first)

**Sortable Columns:**
- `createdAt` - Creation date
- `updatedAt` - Last update date
- `name` - Customer name
- `lastContactAt` - Last contact date
- `priority` - Priority level
- `stage` - Lifecycle stage

**Sort Request:**

```json
{
  "pagination": {
    "sortBy": "lastContactAt",
    "sortOrder": "desc"
  }
}
```

---

## 5. GRID VIEW

### 5.1 Grid Card Data

Each grid card displays:

- **Avatar** - Initials with stage color background
- **Name** - Customer name (clickable link)
- **Stage Badge** - Lifecycle stage
- **Priority Icon** - Visual priority indicator
- **Phone** - Phone number
- **Budget** - Budget range (if available)
- **Property Type** - Property type badges
- **Preferred Areas** - Location preferences
- **Timeline** - Purchase timeline
- **Last Contact** - Days since last contact
- **Conversion Probability** - AI conversion probability (if available)
- **View Details Button**

### 5.2 Grid Data Requirements

**Required Customer Fields for Grid:**

- All fields from Table View PLUS:
- `preferences.budgetMax`: Maximum budget
- `preferences.propertyType`: Array of property types
- `preferences.preferredAreas`: Array of preferred areas
- `preferences.timeline`: Purchase timeline
- `aiInsights.conversionProbability`: Conversion probability percentage

---

## 6. MAP VIEW

### 6.1 Map Data Requirements

**Required Customer Fields for Map:**

- All fields from Table View PLUS:
- `latitude`: Latitude coordinate (required for map display)
- `longitude`: Longitude coordinate (required for map display)
- `city`: City name
- `district`: District name
- `preferences.propertyType`: For popup display
- `preferences.budgetMin`: For popup display
- `preferences.budgetMax`: For popup display
- `nextFollowUpDate`: For popup display

### 6.2 Map Filtering

**Map-specific filters:**

- Filter by stage (multiple selection)
- Search by name/phone/city
- Filter customers with coordinates only

**Map Query:**

```json
{
  "filters": {
    "stage": ["qualified", "property_matching"],
    "hasCoordinates": true  // Only customers with latitude/longitude
  },
  "pagination": {
    "page": 1,
    "limit": 1000  // Higher limit for map view
  }
}
```

---

## 7. SEARCH FUNCTIONALITY

### 7.1 Search Fields

Search applies to:
- Customer name (Arabic and English)
- Phone number
- Email address
- Customer ID

**Search Query:**

```json
{
  "filters": {
    "searchTerm": "أحمد"
  }
}
```

**Backend Implementation:**

```sql
WHERE (
  name ILIKE '%أحمد%' OR
  name_en ILIKE '%أحمد%' OR
  phone LIKE '%أحمد%' OR
  email ILIKE '%أحمد%' OR
  id = 'أحمد'
)
```

---

## 8. PAGINATION

### 8.1 Pagination Structure

**Request:**

```json
{
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
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "totalPages": 25
  }
}
```

### 8.2 Pagination Limits

- **Minimum limit:** 10
- **Maximum limit:** 500
- **Default limit:** 50
- **Map view limit:** Up to 1000

---

## 9. BULK ACTIONS

### 9.1 Bulk Operations Endpoint

**Endpoint:** `POST /api/v2/customers-hub/list/bulk`

**All bulk operations use the same endpoint with `bulkAction` field:**

#### 9.1.1 Bulk Update Stage

**Request Body:**

```json
{
  "bulkAction": "update_stage",
  "customerIds": ["customer_1", "customer_2", "customer_3"],
  "data": {
    "stage": "qualified",
    "reason": "Bulk update",
    "changedBy": "employee_123"
  }
}
```

#### 9.1.2 Bulk Update Priority

**Request Body:**

```json
{
  "bulkAction": "update_priority",
  "customerIds": ["customer_1", "customer_2"],
  "data": {
    "priority": "high",
    "updatedBy": "employee_123"
  }
}
```

#### 9.1.3 Bulk Add Tags

**Request Body:**

```json
{
  "bulkAction": "add_tags",
  "customerIds": ["customer_1", "customer_2"],
  "data": {
    "tags": ["vip", "investor"],
    "addedBy": "employee_123"
  }
}
```

#### 9.1.4 Bulk Assign Employee

**Request Body:**

```json
{
  "bulkAction": "assign_employee",
  "customerIds": ["customer_1", "customer_2"],
  "data": {
    "employeeId": "employee_123",
    "assignedBy": "employee_456",
    "reason": "Bulk assignment"
  }
}
```

#### 9.1.5 Bulk Send Email

**Request Body:**

```json
{
  "bulkAction": "send_email",
  "customerIds": ["customer_1", "customer_2"],
  "data": {
    "subject": "Email subject",
    "body": "Email body with {customerName} variable",
    "sentBy": "employee_123"
  }
}
```

#### 9.1.6 Bulk Archive

**Request Body:**

```json
{
  "bulkAction": "archive",
  "customerIds": ["customer_1", "customer_2"],
  "data": {
    "archivedBy": "employee_123",
    "reason": "Bulk archive"
  }
}
```

#### 9.1.7 Bulk Delete

**Request Body:**

```json
{
  "bulkAction": "delete",
  "customerIds": ["customer_1", "customer_2"],
  "data": {
    "deletedBy": "employee_123",
    "reason": "Bulk delete"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "actionId": "bulk_action_123",
    "processedCount": 2,
    "failedCount": 0,
    "failedIds": []
  }
}
```

---

## 10. EXPORT/IMPORT FUNCTIONALITY

### 10.1 Export/Import Endpoint

**Endpoint:** `POST /api/v2/customers-hub/list/export-import`

**All export/import operations use the same endpoint with `operation` field:**

#### 10.1.1 Export Customers

**Request Body:**

```json
{
  "operation": "export",
  "filters": {
    /* All filters */
  },
  "format": "csv | excel | pdf",
  "fields": [
    "name",
    "phone",
    "email",
    "stage",
    "priority",
    "source",
    "propertyType",
    "budget",
    "preferredAreas",
    "timeline",
    "totalDealValue",
    "lastContactAt",
    "nextFollowUpDate",
    "assignedEmployee",
    "createdAt",
    "tags",
    "interactions",
    "appointments",
    "properties"
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "exportId": "export_123",
    "downloadUrl": "https://example.com/exports/export_123.csv",
    "expiresAt": "2024-01-16T10:00:00Z"
  }
}
```

### 10.2 Available Export Fields

**All Available Fields:**

- `name`: Customer name (Arabic)
- `phone`: Phone number
- `email`: Email address
- `stage`: Lifecycle stage
- `priority`: Priority level
- `source`: Customer source
- `propertyType`: Property types (comma-separated)
- `budget`: Budget range (min - max)
- `preferredAreas`: Preferred areas (comma-separated)
- `timeline`: Purchase timeline
- `totalDealValue`: Total deal value
- `lastContactAt`: Last contact date
- `nextFollowUpDate`: Next follow-up date
- `assignedEmployee`: Assigned employee name
- `createdAt`: Creation date
- `tags`: Tags (comma-separated)
- `interactions`: Total interactions count
- `appointments`: Total appointments count
- `properties`: Total properties count

---

## 11. QUICK ACTIONS

### 11.1 Quick Actions Component

The Quick Actions dropdown provides quick access to:
- Add customer manually
- Import from file
- Export to Excel

#### 10.1.2 Import Customers

**Request Body (multipart/form-data):**

```
operation: "import"
file: File (CSV or Excel)
format: "csv" | "excel"
mapping: {
  "name": "column_name",
  "phone": "column_name",
  "email": "column_name",
  ...
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "importId": "import_123",
    "totalRows": 1000,
    "validRows": 950,
    "invalidRows": 50,
    "importedCount": 950,
    "errors": [
      {
        "row": 5,
        "field": "phone",
        "message": "Invalid phone number format"
      }
    ]
  }
}
```

---

## 12. ASSIGNMENT PANEL

### 12.1 Get Employees Endpoint

**Endpoint:** `GET /api/v2/customers-hub/assignment/employees`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "employee_123",
      "name": "محمد العلي",
      "role": "Sales Agent",
      "customerCount": 45,
      "maxCapacity": 100,
      "activeCount": 30,
      "isActive": true,
      "loadPercentage": 45
    }
  ]
}
```

### 12.2 Get Unassigned Customers Count

**Endpoint:** `GET /api/v2/customers-hub/assignment/unassigned-count`

**Response:**

```json
{
  "success": true,
  "data": {
    "unassignedCount": 125
  }
}
```

### 12.3 Auto-Assignment Endpoint

**Endpoint:** `POST /api/v2/customers-hub/assignment/auto-assign`

**Request Body:**

```json
{
  "employeeRules": [
    {
      "employeeId": "employee_123",
      "isActive": true,
      "rules": [
        {
          "field": "budgetMin",
          "operator": "greaterThan",
          "value": "1000000"
        },
        {
          "field": "city",
          "operator": "equals",
          "value": "الرياض"
        }
      ]
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "assignedCount": 25,
    "failedCount": 0,
    "assignments": [
      {
        "customerId": "customer_123",
        "employeeId": "employee_123",
        "assignedAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

### 12.4 Manual Assignment Endpoint

**Endpoint:** `POST /api/v2/customers-hub/assignment/assign`

**Request Body:**

```json
{
  "customerIds": ["customer_1", "customer_2"],
  "employeeId": "employee_123",
  "reason": "Manual assignment",
  "assignedBy": "employee_456"
}
```

---

## 13. NOTIFICATIONS CENTER

### 13.1 Notifications Operations Endpoint

**Endpoint:** `POST /api/v2/customers-hub/notifications`

**All notifications operations use the same endpoint with `notificationAction` field:**

#### 13.1.1 Get Notifications

**Request Body:**

```json
{
  "notificationAction": "get",
  "filters": {
    "type": "all | reminder | appointment | payment | alert | message",
    "priority": "all | urgent | high | medium | low",
    "read": false
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
    "notifications": [
      {
        "id": "notif_123",
        "type": "reminder",
        "title": "تذكير متأخر",
        "message": "أحمد محمد - متابعة العميل",
        "customerId": "customer_123",
        "customerName": "أحمد محمد",
        "timestamp": "2024-01-15T10:00:00Z",
        "read": false,
        "priority": "high",
        "actionUrl": "/ar/dashboard/customers-hub/customer_123?tab=reminders"
      }
    ],
    "unreadCount": 15,
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "totalPages": 3
    }
  }
}
```

#### 13.1.2 Mark Notification as Read

**Request Body:**

```json
{
  "notificationAction": "mark_read",
  "notificationId": "notif_123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "notificationId": "notif_123",
    "read": true,
    "readAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 13.1.3 Mark All Notifications as Read

**Request Body:**

```json
{
  "notificationAction": "mark_all_read"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "markedCount": 15
  }
}
```

### 13.4 Notification Types

- `reminder`: Overdue reminders
- `appointment`: Upcoming appointments (within 24 hours)
- `payment`: Overdue payments
- `alert`: High churn risk alerts
- `message`: Follow-up needed (no contact in 7+ days)
- `stage_change`: Stage change notifications

---

## 14. QUICK ADD FAB

### 14.1 Customer Operations Endpoint

**Endpoint:** `POST /api/v2/customers-hub/customers`

**All customer operations use the same endpoint with `customerAction` field:**

#### 14.1.1 Quick Add Customer

**Request Body:**

```json
{
  "customerAction": "create",
  "name": "أحمد محمد",
  "phone": "+966501234567",
  "email": "ahmed@example.com",
  "source": "manual",
  "stage": "new_lead",
  "priority": "medium",
  "notes": "Quick add from FAB"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "customer_123",
      /* Full customer object */
    }
  }
}
```

#### 14.1.2 Quick Add Appointment

**Request Body:**

```json
{
  "customerAction": "add_appointment",
  "customerId": "customer_123",
  "title": "معاينة عقار",
  "type": "site_visit",
  "date": "2024-01-20T10:00:00Z",
  "duration": 60,
  "propertyId": "property_123",
  "notes": "Quick add from FAB"
}
```

#### 14.1.3 Quick Add Reminder

**Request Body:**

```json
{
  "customerAction": "add_reminder",
  "customerId": "customer_123",
  "title": "متابعة العميل",
  "description": "اتصال متابعة",
  "datetime": "2024-01-18T10:00:00Z",
  "priority": "high",
  "type": "follow_up"
}
```

#### 14.1.4 Quick Add Note

**Request Body:**

```json
{
  "customerAction": "add_note",
  "customerId": "customer_123",
  "note": "ملاحظة سريعة",
  "addedBy": "employee_123"
}
```

---

## 15. ADD CUSTOMER DIALOG

### 15.1 Create Customer (Full Form)

**Endpoint:** `POST /api/v2/customers-hub/customers`

**Request Body:**

```json
{
  "customerAction": "create",
  "name": "أحمد محمد",
  "nameEn": "Ahmed Mohammed",
  "phone": "+966501234567",
  "whatsapp": "+966501234567",
  "email": "ahmed@example.com",
  "city": "الرياض",
  "district": "حي النرجس",
  "source": "manual",
  "stage": "new_lead",
  "priority": "medium",
  "preferences": {
    "propertyType": ["villa"],
    "budgetMin": 1500000,
    "budgetMax": 2500000,
    "preferredAreas": ["حي النرجس"],
    "purpose": "buy",
    "timeline": "1-3months"
  },
  "notes": "عميل محتمل",
  "tags": ["vip"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "customer_123",
      /* Full customer object */
    },
    "action": {
      "id": "action_123",
      "type": "new_inquiry",
      "customerId": "customer_123"
    }
  }
}
```

---

## 16. PENDING ACTIONS COUNT

### 16.1 Get Pending Actions Count

**Endpoint:** `GET /api/v2/customers-hub/actions/pending-count`

**OR** include in main list response:

**Request Body:**

```json
{
  "action": "list",
  "includePendingActionsCount": true,
  "filters": {
    /* Optional filters */
  }
}
```

**Response (standalone endpoint):**

```json
{
  "success": true,
  "data": {
    "pendingCount": 25,
    "urgentCount": 5,
    "overdueCount": 3
  }
}
```

**Response (when included in list):**

```json
{
  "success": true,
  "data": {
    "customers": [ /* ... */ ],
    "pendingActionsCount": {
      "pendingCount": 25,
      "urgentCount": 5,
      "overdueCount": 3
    }
  }
}
```

**Calculation Logic:**

- `pendingCount`: Count actions where `status IN ('pending', 'in_progress')`
- `urgentCount`: Count actions where `status IN ('pending', 'in_progress')` AND `priority = 'urgent'`
- `overdueCount`: Count actions where `status IN ('pending', 'in_progress')` AND `dueDate < NOW()`

---

## 17. SELECTION INFO

### 17.1 Selection Display

The selection info displays: "تم تحديد {selectedCount} من {totalCount} عميل"

**No backend endpoint required** - this is calculated on frontend from selected customer IDs and total filtered customers count.

---

## 18. DATA STRUCTURES

### 11.1 Complete Customer Object

```typescript
interface UnifiedCustomer {
  id: string;
  name: string;
  nameEn?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city?: string;
  district?: string;
  stage: CustomerLifecycleStage;
  priority: Priority;
  source: CustomerSource;
  sourceDetails?: SourceDetails;
  assignedEmployeeId?: string;
  assignedEmployee?: {
    id: string;
    name: string;
  };
  totalInteractions: number;
  lastContactAt?: string;
  lastContactType?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
  preferences: CustomerPreferences;
  aiInsights: AIInsights;
  tags: string[];
  latitude?: number;
  longitude?: number;
  dealValue?: number;
  stageHistory: StageChange[];
  properties: PropertyInterest[];
  interactions: Interaction[];
  appointments: Appointment[];
  reminders: Reminder[];
}
```

### 11.2 Required Fields by View

**Table View Minimum:**
- id, name, phone, stage, priority, source, assignedEmployeeId, assignedEmployee.name, lastContactAt, lastContactType

**Grid View Minimum:**
- All Table View fields PLUS: preferences.budgetMax, preferences.propertyType, preferences.preferredAreas, preferences.timeline, aiInsights.conversionProbability

**Map View Minimum:**
- All Table View fields PLUS: latitude, longitude, city, district, preferences.propertyType, preferences.budgetMin, preferences.budgetMax, nextFollowUpDate

---

## 12. ERROR HANDLING

### 12.1 Error Response Format

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

### 12.2 Common Error Codes

- `INVALID_FILTERS`: Invalid filter values
- `INVALID_PAGINATION`: Invalid pagination parameters
- `EXPORT_FAILED`: Export generation failed
- `BULK_ACTION_FAILED`: Bulk action failed
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `INTERNAL_ERROR`: Server error

---

## 13. PERFORMANCE OPTIMIZATION - CRITICAL FOR MILLIONS OF RECORDS

**MANDATORY:** This section contains **REQUIRED** optimizations for handling 50+ million requests and 20+ million customers. **ALL** optimizations must be implemented for maximum performance.

### 13.1 Database Indexing (MANDATORY)

**CRITICAL:** The following indexes are **REQUIRED** and must be created with optimal configuration:

```sql
-- Primary index for customer lookup (CRITICAL - used in every request)
CREATE UNIQUE INDEX idx_customers_id ON customers(id);

-- Composite index for stage filtering (CRITICAL - most common filter)
CREATE INDEX idx_customers_stage_created ON customers(stage, created_at DESC);

-- Composite index for priority filtering
CREATE INDEX idx_customers_priority_created ON customers(priority, created_at DESC);

-- Composite index for source filtering
CREATE INDEX idx_customers_source_created ON customers(source, created_at DESC);

-- Composite index for assigned employee filtering
CREATE INDEX idx_customers_assigned_created ON customers(assigned_employee_id, created_at DESC)
WHERE assigned_employee_id IS NOT NULL;

-- Composite index for city filtering
CREATE INDEX idx_customers_city_created ON customers(city, created_at DESC)
WHERE city IS NOT NULL;

-- Composite index for date range filtering
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);

-- Composite index for last contact filtering
CREATE INDEX idx_customers_last_contact ON customers(last_contact_at DESC)
WHERE last_contact_at IS NOT NULL;

-- Full-text search index for name, phone, email
CREATE INDEX idx_customers_search ON customers USING gin(
  to_tsvector('arabic', coalesce(name, '') || ' ' || coalesce(name_en, '') || ' ' || coalesce(phone, '') || ' ' || coalesce(email, ''))
);

-- Covering index for list queries (includes all commonly selected fields)
CREATE INDEX idx_customers_list_covering ON customers(stage, created_at DESC)
INCLUDE (id, name, name_en, phone, email, priority, source, assigned_employee_id, last_contact_at, last_contact_type, city, district);

-- Budget range filtering index
CREATE INDEX idx_customers_budget ON customers((preferences->>'budgetMin')::numeric, (preferences->>'budgetMax')::numeric)
WHERE preferences->>'budgetMin' IS NOT NULL OR preferences->>'budgetMax' IS NOT NULL;

-- Property type filtering index (GIN index for array)
CREATE INDEX idx_customers_property_type ON customers USING gin((preferences->'propertyType'));

-- Tags filtering index (GIN index for array)
CREATE INDEX idx_customers_tags ON customers USING gin(tags);

-- Coordinates index for map view (spatial index)
CREATE INDEX idx_customers_coordinates ON customers USING gist(
  ll_to_earth(latitude, longitude)
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Composite index for complex filters (stage + priority + source)
CREATE INDEX idx_customers_complex_filter ON customers(stage, priority, source, created_at DESC);

-- Partial index for active customers (not archived)
CREATE INDEX idx_customers_active ON customers(created_at DESC)
WHERE archived_at IS NULL;
```

### 13.2 Query Optimization (MANDATORY)

**CRITICAL Query Execution Order:**

1. **Apply filters FIRST** (use indexed columns):
   ```sql
   WHERE stage IN (?, ?)  -- Use idx_customers_stage_created
     AND priority IN (?, ?)  -- Use idx_customers_priority_created
     AND source IN (?, ?)  -- Use idx_customers_source_created
     AND created_at >= ? AND created_at <= ?  -- Use idx_customers_created_at
   ```

2. **Apply search term SECOND** (use full-text index):
   ```sql
   AND to_tsvector('arabic', name || ' ' || coalesce(name_en, '') || ' ' || phone || ' ' || coalesce(email, ''))
       @@ plainto_tsquery('arabic', ?)  -- Use idx_customers_search
   ```

3. **Apply budget filter THIRD** (use budget index):
   ```sql
   AND (preferences->>'budgetMax')::numeric >= ?  -- Use idx_customers_budget
   ```

4. **Apply property type filter FOURTH** (use GIN index):
   ```sql
   AND (preferences->'propertyType')::jsonb ?| ARRAY[?, ?]  -- Use idx_customers_property_type
   ```

5. **Apply tags filter FIFTH** (use GIN index):
   ```sql
   AND tags && ARRAY[?, ?]  -- Use idx_customers_tags
   ```

6. **Sort and paginate LAST**:
   ```sql
   ORDER BY created_at DESC  -- Use covering index
   LIMIT ? OFFSET ?
   ```

**MANDATORY Query Hints:**

```sql
-- Force index usage for optimal performance
SELECT /*+ INDEX(customers idx_customers_stage_created) */
  id, name, phone, stage, priority, source, created_at
FROM customers 
WHERE stage IN (?, ?)
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

### 13.3 Field Selection (MANDATORY)

**CRITICAL:** Only select fields that are actually needed. Do NOT use `SELECT *`.

**Table View Fields Only:**

```sql
SELECT 
  id, name, phone, stage, priority, source, 
  assigned_employee_id, last_contact_at, last_contact_type, created_at
FROM customers 
WHERE /* filters */
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

**Grid View Fields Only:**

```sql
SELECT 
  id, name, phone, stage, priority, source,
  assigned_employee_id, last_contact_at, last_contact_type, created_at,
  preferences->>'budgetMax' as budget_max,
  preferences->'propertyType' as property_type,
  preferences->'preferredAreas' as preferred_areas,
  preferences->>'timeline' as timeline,
  ai_insights->>'conversionProbability' as conversion_probability
FROM customers 
WHERE /* filters */
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

**Map View Fields Only:**

```sql
SELECT 
  id, name, phone, stage, priority, source,
  assigned_employee_id, last_contact_at, created_at,
  latitude, longitude, city, district,
  preferences->'propertyType' as property_type,
  preferences->>'budgetMin' as budget_min,
  preferences->>'budgetMax' as budget_max,
  next_follow_up_date
FROM customers 
WHERE /* filters */
  AND latitude IS NOT NULL 
  AND longitude IS NOT NULL
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

**DO NOT SELECT:**
- Unused JSON fields (interactions, appointments, reminders arrays)
- Large text fields (notes, descriptions)
- Historical data (stage_history array)
- Unused preferences fields

### 13.4 Read Replicas (MANDATORY)

**CRITICAL:** All read operations MUST use read replicas.

**Implementation:**
- Primary database: Write operations only (create, update, delete, bulk operations)
- Read replica(s): All SELECT queries
- Load balance across multiple read replicas
- Monitor replica lag (must be < 1 second)

**Query Routing:**
```sql
-- All SELECT queries go to read replica
SELECT ... FROM customers ...  -- → Read Replica

-- All write operations go to primary
INSERT/UPDATE/DELETE ...  -- → Primary Database
```

### 13.5 Database Connection Pooling (MANDATORY)

**REQUIRED Configuration:**
- **Connection pool size:** Minimum 100, Maximum 500 connections
- **Idle timeout:** 30 seconds
- **Max connection lifetime:** 1 hour
- **Connection timeout:** 5 seconds
- **Use read replicas** for all SELECT queries

### 13.6 Query Timeout Limits (MANDATORY)

**STRICT TIMEOUTS:**
- **List query timeout:** 100ms maximum
- **Stats query timeout:** 200ms maximum
- **Search query timeout:** 150ms maximum
- **Export query timeout:** 5 seconds maximum
- **Bulk operation timeout:** 500ms per 100 customers

**If timeout exceeded:**
- Return error: `QUERY_TIMEOUT`
- Log query for optimization
- Consider adding more indexes or optimizing query

### 13.7 Parallel Query Execution (MANDATORY)

**For Stats Calculation:**

Execute stats queries in parallel:

```sql
-- Parallel execution for stats (all queries at once)
-- Query 1: Total count
SELECT COUNT(*) FROM customers WHERE /* filters */;

-- Query 2: New this month count
SELECT COUNT(*) FROM customers WHERE /* filters */ AND created_at >= ?;

-- Query 3: Total deal value
SELECT SUM(deal_value) FROM customers WHERE /* filters */ AND stage IN ('closing', 'post_sale');

-- Query 4: Closed this month count
SELECT COUNT(*) FROM customers WHERE /* filters */ AND stage = 'post_sale' AND updated_at >= ?;

-- Query 5: Average days in pipeline
SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 86400) 
FROM customers WHERE /* filters */ AND stage != 'post_sale';

-- Query 6: Count by stage (single query with GROUP BY)
SELECT stage, COUNT(*) 
FROM customers 
WHERE /* filters */
GROUP BY stage;
```

**Execute all 6 queries in parallel** (not sequentially) to reduce total execution time.

### 13.8 Response Size Optimization (MANDATORY)

**MANDATORY Limits:**
- **Maximum response size:** 1MB
- **Compress responses** using gzip/brotli
- **Remove null/undefined fields** from JSON response
- **Minify JSON** (remove unnecessary whitespace)
- **Limit array sizes** (max 500 customers per page for list, 1000 for map)

### 13.9 Database Query Monitoring (MANDATORY)

**REQUIRED Monitoring:**
- Log all queries taking > 50ms
- Monitor slow query log
- Track index usage statistics
- Alert on queries taking > 100ms
- Regular query plan analysis
- Track query execution times by endpoint

### 13.10 Index Maintenance (MANDATORY)

**REQUIRED Operations:**
- **Regular index maintenance:** Weekly
- **Update statistics:** Daily
- **Rebuild indexes:** Monthly (if fragmentation > 30%)
- **Monitor index bloat:** Alert if > 20%
- **Vacuum analyze:** Weekly

### 13.11 Performance Targets (MANDATORY)

**REQUIRED Response Times:**
- **List query:** < 100ms (p95)
- **Stats query:** < 200ms (p95) - all stats in parallel
- **Search query:** < 150ms (p95)
- **Bulk operation:** < 500ms per 100 customers (p95)
- **Export generation:** < 5 seconds for 10K customers (p95)

**Monitoring:**
- Track p50, p95, p99 response times
- Alert if p95 exceeds targets
- Daily performance reports
- Track query performance by filter combination

### 13.12 NO CACHING Policy

**NOTE:** User specified NO CACHING. However, for reference:
- **DO NOT cache** query results
- **DO NOT cache** stats calculations
- **DO NOT cache** filter results
- All queries must hit database directly

### 13.13 Search Query Optimization

**CRITICAL:** When searching by name/phone/email:

```sql
-- Use full-text search index (faster than ILIKE)
SELECT * FROM customers 
WHERE to_tsvector('arabic', name || ' ' || coalesce(name_en, '') || ' ' || phone || ' ' || coalesce(email, ''))
      @@ plainto_tsquery('arabic', ?)
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

**For phone number search (exact match):**
```sql
-- Use regular index for phone (faster than ILIKE)
SELECT * FROM customers 
WHERE phone = ? OR phone LIKE ? || '%'
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

### 13.14 Pagination Optimization

**CRITICAL:** Use cursor-based pagination for large datasets:

```sql
-- Cursor-based pagination (faster than OFFSET for large datasets)
SELECT * FROM customers 
WHERE /* filters */
  AND created_at < ?  -- Cursor value from previous page
ORDER BY created_at DESC
LIMIT ?;
```

**For OFFSET-based pagination (current implementation):**
```sql
-- Use covering index to avoid table lookup
SELECT id, name, phone, stage, priority, source, created_at
FROM customers 
WHERE /* filters */
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

### 13.15 Stats Query Optimization

**CRITICAL:** Stats queries must be optimized for speed:

```sql
-- Use COUNT(*) with indexed WHERE clause (faster than COUNT(id))
SELECT COUNT(*) FROM customers 
WHERE stage IN (?, ?)  -- Use idx_customers_stage_created
  AND priority IN (?, ?)  -- Use idx_customers_priority_created
  AND created_at >= ? AND created_at <= ?;  -- Use idx_customers_created_at
```

**For stage distribution:**
```sql
-- Single query with GROUP BY (faster than multiple queries)
SELECT stage, COUNT(*) as count
FROM customers 
WHERE /* filters */
GROUP BY stage;
```

### 13.16 Bulk Operations Optimization

**CRITICAL:** Bulk operations must be optimized:

```sql
-- Use batch updates (faster than individual updates)
UPDATE customers 
SET stage = ?, updated_at = NOW()
WHERE id = ANY(ARRAY[?, ?, ?])  -- Use array for IN clause
RETURNING id;
```

**For bulk tag addition:**
```sql
-- Use array concatenation (faster than individual updates)
UPDATE customers 
SET tags = tags || ARRAY[?, ?]::text[]
WHERE id = ANY(ARRAY[?, ?, ?])
RETURNING id;
```

### 13.17 Database Partitioning (HIGHLY RECOMMENDED)

**Partition Customers Table by Created Date:**

```sql
-- Partition by created date (for time-based queries)
CREATE TABLE customers_2024_01 PARTITION OF customers
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE customers_2024_02 PARTITION OF customers
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- ... continue for each month
```

**Benefits:**
- Faster queries (only scan relevant partitions)
- Easier maintenance (drop old partitions)
- Better index performance per partition
- Faster stats calculations (partition pruning)

### 13.18 Materialized Views for Stats (HIGHLY RECOMMENDED)

**For frequently accessed stats:**

```sql
-- Create materialized view for stage distribution
CREATE MATERIALIZED VIEW mv_customers_by_stage AS
SELECT stage, COUNT(*) as count
FROM customers
WHERE archived_at IS NULL
GROUP BY stage;

-- Refresh materialized view periodically (every 5 minutes)
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_customers_by_stage;
```

**Note:** Materialized views are NOT caching - they are pre-computed aggregations stored in the database.

---

## 14. VERIFICATION CHECKLIST

### 14.1 All Page Components Covered

✅ **Stats Cards Section** - Section 1 (with filters in request body)
✅ **Advanced Filters Section** - Section 2 (all filter types documented)
✅ **Saved Filters Section** - Section 3 (save, load, update, delete)
✅ **Table View** - Section 4 (all columns and data requirements)
✅ **Grid View** - Section 5 (all card fields documented)
✅ **Map View** - Section 6 (coordinates and map-specific data)
✅ **Search Functionality** - Section 7 (search fields and implementation)
✅ **Pagination** - Section 8 (pagination structure and limits)
✅ **Bulk Actions** - Section 9 (all bulk operations documented)
✅ **Export Functionality** - Section 10 (export formats and fields)
✅ **Quick Actions** - Section 11 (import, export quick actions)
✅ **Assignment Panel** - Section 12 (auto-assignment, employee management)
✅ **Notifications Center** - Section 13 (notifications and alerts)
✅ **Quick Add FAB** - Section 14 (quick add customer, appointment, reminder, note)
✅ **Add Customer Dialog** - Section 15 (create customer endpoint)
✅ **Pending Actions Count** - Section 16 (pending actions badge)
✅ **Selection Info** - Section 17 (selected customers count display)

### 14.2 All Data Fields Documented

✅ **Customer Fields:** All fields from UnifiedCustomer interface
✅ **Filter Types:** All filter types from CustomerFilters interface
✅ **Stats Fields:** All statistics fields documented
✅ **Pagination Fields:** Page, limit, total, totalPages
✅ **Sort Fields:** All sortable columns documented

### 14.3 All Endpoints Documented

**CONSOLIDATED ENDPOINTS (8 endpoints total):**

✅ **`POST /api/v2/customers-hub/list`** - Main list endpoint
   - `action: "list"` - Get customers list (with filters, pagination, sorting)
   - `action: "stats"` - Get statistics only
   - `statsType: "ai_insights"` - Get AI insights stats
   - `includeStats: true` - Include stats in list response
   - `includeAiInsights: true` - Include AI insights in list response
   - `includePendingActionsCount: true` - Include pending actions count in list response

✅ **`POST /api/v2/customers-hub/list/saved-filters`** - Saved filters operations
   - `filterAction: "save"` - Save filter
   - `filterAction: "get"` - Get all saved filters
   - `filterAction: "update"` - Update saved filter
   - `filterAction: "delete"` - Delete saved filter

✅ **`POST /api/v2/customers-hub/list/bulk`** - Bulk operations
   - `bulkAction: "update_stage"` - Bulk update stage
   - `bulkAction: "update_priority"` - Bulk update priority
   - `bulkAction: "add_tags"` - Bulk add tags
   - `bulkAction: "assign_employee"` - Bulk assign employee
   - `bulkAction: "send_email"` - Bulk send email
   - `bulkAction: "archive"` - Bulk archive
   - `bulkAction: "delete"` - Bulk delete

✅ **`POST /api/v2/customers-hub/list/export-import`** - Export/Import operations
   - `operation: "export"` - Export customers (CSV, Excel, PDF)
   - `operation: "import"` - Import customers from file

✅ **`POST /api/v2/customers-hub/assignment`** - Assignment operations
   - `assignmentAction: "get_employees"` - Get employees list
   - `assignmentAction: "get_unassigned_count"` - Get unassigned customers count
   - `assignmentAction: "auto_assign"` - Auto-assign customers
   - `assignmentAction: "assign"` - Manual assignment

✅ **`POST /api/v2/customers-hub/notifications`** - Notifications operations
   - `notificationAction: "get"` - Get notifications
   - `notificationAction: "mark_read"` - Mark notification as read
   - `notificationAction: "mark_all_read"` - Mark all notifications as read

✅ **`POST /api/v2/customers-hub/customers`** - Customer operations
   - `customerAction: "create"` - Create customer
   - `customerAction: "add_appointment"` - Add appointment
   - `customerAction: "add_reminder"` - Add reminder
   - `customerAction: "add_note"` - Add note

✅ **`GET /api/v2/customers-hub/actions/pending-count`** - Get pending actions count (simple GET endpoint)

### 14.4 Performance Requirements Covered

✅ **Database Indexing:** 15+ indexes documented
✅ **Query Optimization:** Query execution order and hints
✅ **Field Selection:** Field selection by view type
✅ **Read Replicas:** Read replica usage
✅ **Connection Pooling:** Pool configuration
✅ **Query Timeouts:** Strict timeout limits
✅ **Parallel Execution:** Parallel stats queries
✅ **Response Size:** Size limits and optimization
✅ **Monitoring:** Query monitoring requirements
✅ **Index Maintenance:** Maintenance schedule
✅ **Performance Targets:** Response time targets
✅ **No Caching:** Explicit no-caching policy

**END OF SPECIFICATION**
