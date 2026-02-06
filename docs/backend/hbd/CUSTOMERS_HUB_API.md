# Customers Hub API Architecture

**Version:** 1.0.0  
**Last Updated:** February 2, 2026  
**Module:** Customers Hub - Real Estate Customer Management System  
**Region:** Saudi Arabia & Gulf Region

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Authentication & Authorization](#authentication--authorization)
4. [API Endpoints](#api-endpoints)
   - [Customer Management](#customer-management)
   - [Actions/Requests Management](#actionsrequests-management)
   - [Statistics & Analytics](#statistics--analytics)
   - [Filters & Search](#filters--search)
   - [Bulk Operations](#bulk-operations)
   - [Relationships Management](#relationships-management)
   - [Employee & Assignment](#employee--assignment)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Pagination Strategy](#pagination-strategy)
8. [Filtering Strategy](#filtering-strategy)
9. [Caching Strategy](#caching-strategy)
10. [Rate Limiting](#rate-limiting)
11. [Real-time Updates](#real-time-updates)
12. [Database Schema](#database-schema)
13. [Performance Optimization](#performance-optimization)
14. [OpenAPI Specification](#openapi-specification)

---

## Overview

The Customers Hub API provides comprehensive endpoints for managing real estate customers throughout their lifecycle, from initial inquiry to post-sale support. The system is designed specifically for Saudi Arabia and Gulf region real estate operations with built-in support for:

- **REGA/FAL** - Broker licensing and compliance
- **EJAR** - Rental contract management
- **Wafi** - Off-plan developer workflow
- **Sakani/NHC** - Housing program eligibility
- **Mortgage & Financing** - Integration with banks and REDF

### Key Features

- 9-stage customer lifecycle management
- AI-powered lead scoring and recommendations
- Multi-channel communication tracking (WhatsApp, phone, email, meetings)
- Property matching and interest tracking
- Appointment and reminder management
- Document management
- KSA-specific compliance workflows
- Real-time action/request management
- Advanced filtering and search
- Bulk operations support
- Role-based access control

---

## Architecture

### System Architecture

```
┌─────────────────┐
│   Frontend      │
│  (Next.js 14)   │
└────────┬────────┘
         │ HTTPS/REST
         │ WebSocket (real-time)
         │
┌────────▼────────┐
│   API Gateway   │
│  (Rate Limit,   │
│   Auth, Cache)  │
└────────┬────────┘
         │
┌────────▼────────────────────────┐
│     Application Server          │
│  (Node.js/Express or Laravel)   │
├─────────────────────────────────┤
│  Controllers  │  Services        │
│  Middleware   │  Business Logic  │
└────────┬────────────────────────┘
         │
┌────────▼────────────────────────┐
│      Database Layer             │
├─────────────────────────────────┤
│  PostgreSQL/MySQL (Primary)     │
│  Redis (Cache + Sessions)       │
│  Elasticsearch (Search)         │
└─────────────────────────────────┘
```

### Data Flow

```
User Action (Request Page Load)
    │
    ├─→ GET /api/customers/actions?filters...
    │   └─→ Returns filtered actions list
    │
    ├─→ GET /api/customers/actions/stats
    │   └─→ Returns statistics (counts, overdue, etc.)
    │
    └─→ GET /api/employees
        └─→ Returns employee list for assignment
```

---

## Authentication & Authorization

### Authentication

All API requests require JWT authentication.

**Headers:**
```http
Authorization: Bearer <JWT_TOKEN>
X-Organization-ID: org_123456
Content-Type: application/json
Accept: application/json
```

**JWT Payload Example:**
```json
{
  "userId": "user_001",
  "email": "agent@taearif.com",
  "role": "sales_agent",
  "organizationId": "org_123456",
  "permissions": [
    "customers.read",
    "customers.write",
    "actions.read",
    "actions.write",
    "customers.delete"
  ],
  "iat": 1706875200,
  "exp": 1706961600
}
```

### Authorization Levels

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all customers, actions, and settings |
| **Sales Manager** | View all team customers, assign/reassign, manage actions |
| **Sales Agent** | View assigned customers, manage own actions, limited bulk operations |
| **Viewer** | Read-only access to assigned customers |

### Permission Matrix

| Endpoint | Admin | Manager | Agent | Viewer |
|----------|-------|---------|-------|--------|
| GET /api/customers | ✅ All | ✅ Team | ✅ Assigned | ✅ Assigned |
| POST /api/customers | ✅ | ✅ | ✅ | ❌ |
| PUT /api/customers/:id | ✅ | ✅ Team | ✅ Assigned | ❌ |
| DELETE /api/customers/:id | ✅ | ✅ | ❌ | ❌ |
| POST /api/customers/actions/bulk | ✅ | ✅ | ⚠️ Limited | ❌ |

---

## API Endpoints

### Base URL

```
Production: https://api.taearif.com/v1
Staging: https://api-staging.taearif.com/v1
Development: http://localhost:3000/api/v1
```

---

## Customer Management

### 1. List Customers

Get a paginated list of customers with filtering.

**Endpoint:** `GET /api/customers`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 20, max: 100) |
| `search` | string | No | Search in name, phone, email |
| `stage` | string[] | No | Filter by lifecycle stage |
| `source` | string[] | No | Filter by customer source |
| `priority` | string[] | No | Filter by priority |
| `assignedEmployeeId` | string[] | No | Filter by assigned employee |
| `leadScoreMin` | integer | No | Minimum lead score (0-100) |
| `leadScoreMax` | integer | No | Maximum lead score (0-100) |
| `budgetMin` | number | No | Minimum budget |
| `budgetMax` | number | No | Maximum budget |
| `propertyType` | string[] | No | Property types (villa, apartment, land, commercial) |
| `preferredAreas` | string[] | No | Preferred areas/districts |
| `city` | string[] | No | Filter by city |
| `tags` | string[] | No | Filter by tags |
| `createdFrom` | datetime | No | Created date range start |
| `createdTo` | datetime | No | Created date range end |
| `lastContactFrom` | datetime | No | Last contact date range start |
| `lastContactTo` | datetime | No | Last contact date range end |
| `sortBy` | string | No | Sort field (name, createdAt, leadScore, lastContactAt, dealValue) |
| `sortOrder` | string | No | Sort order (asc, desc) |

**Request Example:**
```http
GET /api/customers?page=1&limit=20&stage=property_matching&stage=site_visit&priority=high&city=الرياض&sortBy=leadScore&sortOrder=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Organization-ID: org_123456
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "cust_001",
        "name": "محمد الفهد",
        "nameEn": "Mohammed Al-Fahd",
        "phone": "+966512345678",
        "whatsapp": "+966512345678",
        "email": "mohammed.fahd@email.com",
        "nationality": "Saudi",
        "gender": "male",
        "source": "inquiry",
        "sourceDetails": {
          "inquiryId": "inq_001",
          "landingPage": "/properties/villas-riyadh"
        },
        "stage": "property_matching",
        "stageHistory": [
          {
            "id": "stage_001_1",
            "fromStage": null,
            "toStage": "new_lead",
            "changedBy": "System",
            "changedById": "system",
            "changedAt": "2024-01-15T10:00:00Z",
            "autoGenerated": true
          },
          {
            "id": "stage_001_2",
            "fromStage": "new_lead",
            "toStage": "qualified",
            "changedBy": "أحمد السعيد",
            "changedById": "emp_001",
            "changedAt": "2024-01-16T14:30:00Z",
            "notes": "تم التأكد من الميزانية والجدول الزمني",
            "autoGenerated": false
          }
        ],
        "preferences": {
          "propertyType": ["villa"],
          "budgetMin": 1500000,
          "budgetMax": 2500000,
          "preferredAreas": ["الرياض - حي النرجس", "الرياض - حي الملقا"],
          "preferredCities": ["الرياض"],
          "bedrooms": 5,
          "bathrooms": 4,
          "minArea": 400,
          "purpose": "buy",
          "timeline": "1-3months",
          "amenities": ["pool", "garden", "majlis", "parking"],
          "furnishing": "unfurnished"
        },
        "leadScore": 85,
        "aiInsights": {
          "nextBestAction": "3 فلل تطابق تفضيلاته - أرسل توصيات",
          "nextBestActionEn": "3 villas match his preferences - send recommendations",
          "churnRisk": "low",
          "propertyMatches": ["prop_villa_001", "prop_villa_008", "prop_villa_012"],
          "predictedCloseDate": "2024-03-15",
          "recommendedFollowUpDate": "2024-01-22",
          "engagementLevel": "high",
          "conversionProbability": 78,
          "sentimentScore": 75
        },
        "priority": "high",
        "customerType": "individual",
        "tags": ["vip", "hot_lead", "cash_buyer"],
        "assignedEmployee": {
          "id": "emp_001",
          "name": "أحمد السعيد",
          "nameEn": "Ahmed Al-Saeed",
          "email": "ahmed@taearif.com",
          "phone": "+966501234567",
          "role": "Senior Sales Agent",
          "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
        },
        "assignedEmployeeId": "emp_001",
        "totalDealValue": 2200000,
        "expectedRevenue": 44000,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-20T15:30:00Z",
        "lastContactAt": "2024-01-20T14:00:00Z",
        "lastContactType": "whatsapp",
        "nextFollowUpDate": "2024-01-22",
        "city": "الرياض",
        "district": "حي النرجس",
        "totalInteractions": 5,
        "totalAppointments": 2,
        "totalPropertyViews": 8,
        "responseRate": 92,
        "avgResponseTime": 2.5
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 20,
      "totalPages": 5,
      "totalItems": 87,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "meta": {
    "timestamp": "2024-01-22T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

### 2. Get Customer by ID

Get detailed information for a specific customer.

**Endpoint:** `GET /api/customers/:id`

**Path Parameters:**
- `id` (string, required): Customer ID

**Query Parameters:**
- `include` (string[], optional): Related data to include (properties, interactions, appointments, reminders, documents, stageHistory, ksaCompliance)

**Request Example:**
```http
GET /api/customers/cust_001?include=properties&include=interactions&include=appointments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cust_001",
      "name": "محمد الفهد",
      "nameEn": "Mohammed Al-Fahd",
      "phone": "+966512345678",
      "email": "mohammed.fahd@email.com",
      "stage": "property_matching",
      "properties": [
        {
          "id": "prop_int_001",
          "propertyId": "prop_villa_001",
          "propertyTitle": "فيلا فاخرة في حي النرجس",
          "propertyTitleEn": "Luxury Villa in Al-Narjis",
          "propertyPrice": 2200000,
          "propertyType": "villa",
          "status": "interested",
          "addedAt": "2024-01-18T15:00:00Z",
          "rating": 5
        }
      ],
      "interactions": [
        {
          "id": "int_001_1",
          "type": "whatsapp",
          "direction": "inbound",
          "date": "2024-01-15T10:30:00Z",
          "notes": "استفسار عن فلل في شمال الرياض",
          "agentName": "أحمد السعيد",
          "agentId": "emp_001",
          "sentiment": "positive"
        }
      ],
      "appointments": [
        {
          "id": "apt_001_1",
          "title": "معاينة فيلا النرجس",
          "type": "site_visit",
          "date": "2024-01-25",
          "time": "10:00",
          "datetime": "2024-01-25T10:00:00Z",
          "status": "scheduled",
          "priority": "high"
        }
      ]
    }
  }
}
```

---

### 3. Create Customer

Create a new customer record.

**Endpoint:** `POST /api/customers`

**Required Permission:** `customers.write`

**Request Body:**

```json
{
  "name": "عبدالله الشمري",
  "nameEn": "Abdullah Al-Shammari",
  "phone": "+966551234567",
  "whatsapp": "+966551234567",
  "email": "abdullah@email.com",
  "nationality": "Saudi",
  "gender": "male",
  "source": "whatsapp",
  "sourceDetails": {
    "campaign": "ramadan_2024",
    "utmSource": "instagram"
  },
  "preferences": {
    "propertyType": ["apartment"],
    "budgetMin": 800000,
    "budgetMax": 1200000,
    "preferredAreas": ["جدة - حي الزهراء"],
    "bedrooms": 3,
    "bathrooms": 2,
    "purpose": "buy",
    "timeline": "immediate"
  },
  "priority": "high",
  "tags": ["hot_lead"],
  "assignedEmployeeId": "emp_002",
  "city": "جدة"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cust_new_001",
      "name": "عبدالله الشمري",
      "stage": "new_lead",
      "leadScore": 72,
      "createdAt": "2024-01-22T10:45:00Z",
      "updatedAt": "2024-01-22T10:45:00Z"
    }
  },
  "message": "Customer created successfully"
}
```

---

### 4. Update Customer

Update customer information.

**Endpoint:** `PUT /api/customers/:id`

**Required Permission:** `customers.write`

**Request Body:**

```json
{
  "preferences": {
    "budgetMin": 900000,
    "budgetMax": 1300000,
    "bedrooms": 4
  },
  "priority": "urgent",
  "tags": ["vip", "hot_lead", "ready_to_buy"],
  "notes": "العميل جاهز للشراء خلال أسبوعين"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cust_001",
      "updatedAt": "2024-01-22T11:00:00Z"
    }
  },
  "message": "Customer updated successfully"
}
```

---

### 5. Update Customer Stage

Move customer to a new lifecycle stage.

**Endpoint:** `PATCH /api/customers/:id/stage`

**Required Permission:** `customers.write`

**Request Body:**

```json
{
  "toStage": "site_visit",
  "notes": "تم جدولة معاينة لثلاث فلل",
  "reason": "scheduled_viewings"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cust_001",
      "stage": "site_visit",
      "stageHistory": [
        {
          "id": "stage_001_4",
          "fromStage": "property_matching",
          "toStage": "site_visit",
          "changedBy": "أحمد السعيد",
          "changedById": "emp_001",
          "changedAt": "2024-01-22T11:15:00Z",
          "notes": "تم جدولة معاينة لثلاث فلل",
          "reason": "scheduled_viewings",
          "autoGenerated": false
        }
      ]
    }
  }
}
```

---

### 6. Delete Customer

Soft delete a customer (marks as deleted, doesn't remove from database).

**Endpoint:** `DELETE /api/customers/:id`

**Required Permission:** `customers.delete`

**Query Parameters:**
- `permanent` (boolean, optional): Hard delete (requires admin role)

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Customer deleted successfully",
  "data": {
    "deletedAt": "2024-01-22T11:30:00Z"
  }
}
```

---

## Actions/Requests Management

### 7. List Customer Actions

Get customer actions/requests with filtering.

**Endpoint:** `GET /api/customers/actions`

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `limit` | integer | No | Items per page (default: 50) |
| `customerId` | string | No | Filter by customer ID |
| `status` | string[] | No | Filter by status (pending, in_progress, completed, dismissed, snoozed) |
| `type` | string[] | No | Filter by action type |
| `priority` | string[] | No | Filter by priority |
| `source` | string[] | No | Filter by source |
| `assignedTo` | string[] | No | Filter by assigned employee |
| `dueDate` | string | No | Filter by due date (overdue, today, week, no_date) |
| `city` | string[] | No | Filter by customer city |
| `state` | string[] | No | Filter by customer state/region |
| `budgetMin` | number | No | Filter by customer budget min |
| `budgetMax` | number | No | Filter by customer budget max |
| `propertyType` | string[] | No | Filter by customer property type preference |
| `search` | string | No | Search in customer name, title, description |
| `sortBy` | string | No | Sort field (createdAt, dueDate, priority) |
| `sortOrder` | string | No | Sort order (asc, desc) |

**Request Example:**
```http
GET /api/customers/actions?status=pending&status=in_progress&type=new_inquiry&type=callback_request&priority=high&priority=urgent&dueDate=today&sortBy=priority&sortOrder=desc
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "actions": [
      {
        "id": "action_001",
        "customerId": "cust_001",
        "customerName": "محمد الفهد",
        "type": "new_inquiry",
        "title": "استفسار عن فلل في شمال الرياض",
        "description": "العميل يبحث عن فيلا 5 غرف في حي النرجس أو الملقا، الميزانية 2-2.5 مليون",
        "priority": "high",
        "status": "pending",
        "source": "inquiry",
        "dueDate": "2024-01-22T23:59:59Z",
        "assignedTo": "emp_001",
        "assignedToName": "أحمد السعيد",
        "createdAt": "2024-01-15T10:30:00Z",
        "metadata": {
          "phoneNumber": "+966512345678",
          "preferredContactTime": "evening",
          "inquirySource": "website_form"
        }
      },
      {
        "id": "action_002",
        "customerId": "cust_002",
        "customerName": "فاطمة الزهراني",
        "type": "callback_request",
        "title": "طلب اتصال - معاينة شقة",
        "description": "العميلة طلبت الاتصال لجدولة معاينة للشقة في حي الزهراء",
        "priority": "urgent",
        "status": "pending",
        "source": "whatsapp",
        "dueDate": "2024-01-22T15:00:00Z",
        "assignedTo": "emp_002",
        "assignedToName": "فاطمة المحمد",
        "createdAt": "2024-01-22T09:15:00Z",
        "metadata": {
          "propertyId": "prop_apt_045",
          "requestedTime": "2024-01-22T15:00:00Z"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 50,
      "totalPages": 3,
      "totalItems": 142,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

---

### 8. Get Action by ID

Get detailed information for a specific action.

**Endpoint:** `GET /api/customers/actions/:id`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action_001",
      "customerId": "cust_001",
      "customerName": "محمد الفهد",
      "customer": {
        "id": "cust_001",
        "name": "محمد الفهد",
        "phone": "+966512345678",
        "email": "mohammed.fahd@email.com",
        "city": "الرياض",
        "preferences": {
          "propertyType": ["villa"],
          "budgetMin": 1500000,
          "budgetMax": 2500000
        }
      },
      "type": "new_inquiry",
      "title": "استفسار عن فلل في شمال الرياض",
      "status": "pending",
      "priority": "high",
      "notes": [
        {
          "id": "note_001",
          "content": "تم إرسال 3 عروض عقارية للعميل عبر الواتساب",
          "createdBy": "أحمد السعيد",
          "createdAt": "2024-01-20T14:30:00Z"
        }
      ]
    }
  }
}
```

---

### 9. Create Action

Create a new customer action/request.

**Endpoint:** `POST /api/customers/actions`

**Request Body:**

```json
{
  "customerId": "cust_001",
  "type": "follow_up",
  "title": "متابعة بعد إرسال العروض",
  "description": "الاتصال بالعميل للحصول على تعليقه على العروض المرسلة",
  "priority": "high",
  "dueDate": "2024-01-23T10:00:00Z",
  "assignedTo": "emp_001"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action_new_001",
      "customerId": "cust_001",
      "status": "pending",
      "createdAt": "2024-01-22T12:00:00Z"
    }
  }
}
```

---

### 10. Update Action

Update an action's details.

**Endpoint:** `PATCH /api/customers/actions/:id`

**Request Body:**

```json
{
  "priority": "urgent",
  "dueDate": "2024-01-22T16:00:00Z",
  "assignedTo": "emp_003",
  "notes": "العميل طلب الاتصال قبل نهاية اليوم"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action_001",
      "priority": "urgent",
      "updatedAt": "2024-01-22T12:15:00Z"
    }
  }
}
```

---

### 11. Complete Action

Mark an action as completed.

**Endpoint:** `POST /api/customers/actions/:id/complete`

**Request Body:**

```json
{
  "outcome": "تم إرسال العروض بنجاح والعميل مهتم بعقارين",
  "notes": "جدولة معاينة للعقارين يوم الخميس"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action_001",
      "status": "completed",
      "completedAt": "2024-01-22T12:30:00Z",
      "completedBy": "emp_001"
    }
  }
}
```

---

### 12. Dismiss Action

Dismiss/cancel an action.

**Endpoint:** `POST /api/customers/actions/:id/dismiss`

**Request Body:**

```json
{
  "reason": "العميل لم يعد مهتماً",
  "notes": "العميل قرر تأجيل الشراء لمدة 6 أشهر"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action_001",
      "status": "dismissed"
    }
  }
}
```

---

### 13. Snooze Action

Snooze an action until a later date.

**Endpoint:** `POST /api/customers/actions/:id/snooze`

**Request Body:**

```json
{
  "snoozedUntil": "2024-01-25T09:00:00Z",
  "notes": "العميل في سفر، سيعود يوم الخميس"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "action": {
      "id": "action_001",
      "status": "snoozed",
      "snoozedUntil": "2024-01-25T09:00:00Z"
    }
  }
}
```

---

### 14. Add Action Note

Add a note to an action.

**Endpoint:** `POST /api/customers/actions/:id/notes`

**Request Body:**

```json
{
  "content": "العميل طلب معلومات إضافية عن خيارات التمويل"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "note": {
      "id": "note_new_001",
      "actionId": "action_001",
      "content": "العميل طلب معلومات إضافية عن خيارات التمويل",
      "createdBy": "أحمد السعيد",
      "createdById": "emp_001",
      "createdAt": "2024-01-22T13:00:00Z"
    }
  }
}
```

---

## Statistics & Analytics

### 15. Get Actions Statistics

Get statistics for customer actions.

**Endpoint:** `GET /api/customers/actions/stats`

**Query Parameters:**
- `assignedTo` (string, optional): Filter stats by assigned employee
- `dateFrom` (datetime, optional): Start date for date range
- `dateTo` (datetime, optional): End date for date range

**Request Example:**
```http
GET /api/customers/actions/stats?assignedTo=emp_001&dateFrom=2024-01-01&dateTo=2024-01-31
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "stats": {
      "total": {
        "pending": 142,
        "inProgress": 23,
        "completed": 856,
        "dismissed": 47,
        "snoozed": 12
      },
      "byType": {
        "new_inquiry": 45,
        "callback_request": 38,
        "property_match": 21,
        "follow_up": 28,
        "document_required": 5,
        "payment_due": 3,
        "site_visit": 15,
        "whatsapp_incoming": 52,
        "ai_recommended": 18
      },
      "byPriority": {
        "urgent": 15,
        "high": 48,
        "medium": 67,
        "low": 12
      },
      "bySource": {
        "inquiry": 56,
        "whatsapp": 68,
        "manual": 12,
        "referral": 6,
        "import": 0
      },
      "dueDates": {
        "overdue": 8,
        "today": 23,
        "thisWeek": 45,
        "thisMonth": 89,
        "noDueDate": 12
      },
      "timeline": {
        "avgCompletionTime": 2.5,
        "avgResponseTime": 1.2,
        "completionRate": 85.7
      }
    }
  }
}
```

---

### 16. Get Customer Statistics

Get overall customer statistics.

**Endpoint:** `GET /api/customers/stats`

**Query Parameters:**
- `dateFrom` (datetime, optional): Start date
- `dateTo` (datetime, optional): End date
- `groupBy` (string, optional): Group by (stage, source, employee, city)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 1247,
      "byStage": {
        "new_lead": 187,
        "qualified": 142,
        "property_matching": 98,
        "site_visit": 76,
        "negotiation": 45,
        "contract_prep": 23,
        "down_payment": 12,
        "closing": 8,
        "post_sale": 656
      },
      "bySource": {
        "inquiry": 456,
        "whatsapp": 523,
        "manual": 178,
        "referral": 67,
        "import": 23
      },
      "byPriority": {
        "urgent": 45,
        "high": 178,
        "medium": 523,
        "low": 501
      },
      "leadScores": {
        "avg": 62.5,
        "median": 58,
        "above80": 234,
        "60to80": 445,
        "40to60": 389,
        "below40": 179
      },
      "financial": {
        "totalDealValue": 456750000,
        "totalExpectedRevenue": 9135000,
        "avgDealSize": 1875000
      },
      "conversion": {
        "conversionRate": 6.8,
        "avgDaysInPipeline": 45,
        "closedThisMonth": 12,
        "closedThisYear": 89
      },
      "engagement": {
        "activeCustomers": 547,
        "newThisMonth": 67,
        "avgInteractions": 5.6,
        "avgResponseRate": 78.5
      }
    }
  }
}
```

---

## Filters & Search

### 17. Get Filter Options

Get available filter options with counts.

**Endpoint:** `GET /api/customers/filters`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "filters": {
      "stages": [
        { "value": "new_lead", "label": "عميل جديد", "labelEn": "New Lead", "count": 187 },
        { "value": "qualified", "label": "مؤهل", "labelEn": "Qualified", "count": 142 },
        { "value": "property_matching", "label": "مطابقة العقارات", "labelEn": "Property Matching", "count": 98 }
      ],
      "sources": [
        { "value": "inquiry", "label": "استفسار", "labelEn": "Inquiry", "count": 456 },
        { "value": "whatsapp", "label": "واتساب", "labelEn": "WhatsApp", "count": 523 },
        { "value": "manual", "label": "يدوي", "labelEn": "Manual", "count": 178 }
      ],
      "cities": [
        { "value": "الرياض", "label": "الرياض", "count": 567 },
        { "value": "جدة", "label": "جدة", "count": 423 },
        { "value": "الدمام", "label": "الدمام", "count": 178 }
      ],
      "propertyTypes": [
        { "value": "villa", "label": "فيلا", "labelEn": "Villa", "count": 345 },
        { "value": "apartment", "label": "شقة", "labelEn": "Apartment", "count": 678 },
        { "value": "land", "label": "أرض", "labelEn": "Land", "count": 156 },
        { "value": "commercial", "label": "تجاري", "labelEn": "Commercial", "count": 68 }
      ],
      "employees": [
        { "id": "emp_001", "name": "أحمد السعيد", "nameEn": "Ahmed Al-Saeed", "count": 234 },
        { "id": "emp_002", "name": "فاطمة المحمد", "nameEn": "Fatima Al-Mohammed", "count": 189 }
      ]
    }
  }
}
```

---

### 18. Search Customers

Advanced search endpoint with fuzzy matching.

**Endpoint:** `POST /api/customers/search`

**Request Body:**

```json
{
  "query": "محمد",
  "filters": {
    "stage": ["property_matching", "site_visit"],
    "city": ["الرياض"]
  },
  "fuzzy": true,
  "limit": 20
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "customer": {
          "id": "cust_001",
          "name": "محمد الفهد",
          "phone": "+966512345678",
          "stage": "property_matching"
        },
        "score": 0.95,
        "matchedFields": ["name"]
      }
    ],
    "total": 45
  }
}
```

---

## Bulk Operations

### 19. Bulk Update Actions

Update multiple actions at once.

**Endpoint:** `POST /api/customers/actions/bulk`

**Request Body:**

```json
{
  "actionIds": ["action_001", "action_002", "action_003"],
  "operation": "update",
  "updates": {
    "priority": "high",
    "assignedTo": "emp_003"
  }
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "updatedCount": 3,
    "failed": [],
    "actions": [
      {
        "id": "action_001",
        "status": "success"
      },
      {
        "id": "action_002",
        "status": "success"
      },
      {
        "id": "action_003",
        "status": "success"
      }
    ]
  }
}
```

---

### 20. Bulk Complete Actions

Complete multiple actions at once.

**Endpoint:** `POST /api/customers/actions/bulk/complete`

**Request Body:**

```json
{
  "actionIds": ["action_001", "action_002"],
  "notes": "تم معالجة جميع الطلبات بنجاح"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "completedCount": 2,
    "failed": []
  }
}
```

---

### 21. Bulk Dismiss Actions

Dismiss multiple actions.

**Endpoint:** `POST /api/customers/actions/bulk/dismiss`

**Request Body:**

```json
{
  "actionIds": ["action_004", "action_005"],
  "reason": "العملاء غير مستجيبين"
}
```

**Response:** `200 OK`

---

### 22. Bulk Snooze Actions

Snooze multiple actions.

**Endpoint:** `POST /api/customers/actions/bulk/snooze`

**Request Body:**

```json
{
  "actionIds": ["action_006", "action_007"],
  "snoozedUntil": "2024-01-25T09:00:00Z"
}
```

**Response:** `200 OK`

---

### 23. Bulk Assign Actions

Assign multiple actions to an employee.

**Endpoint:** `POST /api/customers/actions/bulk/assign`

**Request Body:**

```json
{
  "actionIds": ["action_008", "action_009", "action_010"],
  "assignedTo": "emp_002",
  "assignedToName": "فاطمة المحمد"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "assignedCount": 3,
    "assignedTo": {
      "id": "emp_002",
      "name": "فاطمة المحمد"
    }
  }
}
```

---

## Relationships Management

### 24. Add Property Interest

Add a property to customer's interest list.

**Endpoint:** `POST /api/customers/:customerId/properties`

**Request Body:**

```json
{
  "propertyId": "prop_villa_023",
  "propertyTitle": "فيلا راقية في حي الياسمين",
  "propertyPrice": 2800000,
  "propertyType": "villa",
  "status": "interested",
  "notes": "العميل مهتم جداً بهذا العقار"
}
```

**Response:** `201 Created`

---

### 25. Add Interaction

Log a customer interaction.

**Endpoint:** `POST /api/customers/:customerId/interactions`

**Request Body:**

```json
{
  "type": "call",
  "direction": "outbound",
  "duration": 15,
  "notes": "مكالمة متابعة - العميل سيزور العقار يوم الأحد",
  "sentiment": "positive",
  "followUpRequired": true,
  "followUpDate": "2024-01-28T10:00:00Z"
}
```

**Response:** `201 Created`

---

### 26. Add Appointment

Schedule an appointment for a customer.

**Endpoint:** `POST /api/customers/:customerId/appointments`

**Request Body:**

```json
{
  "title": "معاينة فيلا الياسمين",
  "type": "site_visit",
  "date": "2024-01-28",
  "time": "11:00",
  "datetime": "2024-01-28T11:00:00Z",
  "duration": 60,
  "propertyId": "prop_villa_023",
  "priority": "high",
  "notes": "إحضار مخططات العقار"
}
```

**Response:** `201 Created`

---

### 27. Add Reminder

Create a reminder for a customer.

**Endpoint:** `POST /api/customers/:customerId/reminders`

**Request Body:**

```json
{
  "title": "متابعة بعد المعاينة",
  "description": "الاتصال بالعميل للحصول على رأيه في الفيلا",
  "datetime": "2024-01-28T16:00:00Z",
  "priority": "high",
  "type": "follow_up"
}
```

**Response:** `201 Created`

---

### 28. Upload Document

Upload a document for a customer.

**Endpoint:** `POST /api/customers/:customerId/documents`

**Content-Type:** `multipart/form-data`

**Request Body:**

```
file: [binary data]
name: "صورة الهوية"
type: "id_copy"
description: "صورة هوية العميل - وجه وظهر"
tags: ["identity", "kyc"]
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "document": {
      "id": "doc_001",
      "name": "صورة الهوية",
      "type": "id_copy",
      "fileUrl": "https://cdn.taearif.com/documents/cust_001/id_copy_abc123.pdf",
      "fileSize": 2456789,
      "mimeType": "application/pdf",
      "uploadedBy": "أحمد السعيد",
      "uploadedAt": "2024-01-22T14:00:00Z"
    }
  }
}
```

---

## Employee & Assignment

### 29. List Employees

Get list of employees for assignment.

**Endpoint:** `GET /api/employees`

**Query Parameters:**
- `role` (string, optional): Filter by role
- `isActive` (boolean, optional): Filter active employees
- `includeStats` (boolean, optional): Include workload statistics

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "emp_001",
        "name": "أحمد السعيد",
        "nameEn": "Ahmed Al-Saeed",
        "email": "ahmed@taearif.com",
        "phone": "+966501234567",
        "role": "Senior Sales Agent",
        "isActive": true,
        "stats": {
          "assignedCustomers": 234,
          "pendingActions": 45,
          "completedThisMonth": 67,
          "avgResponseTime": 2.3
        }
      }
    ]
  }
}
```

---

### 30. Assign Customer

Assign a customer to an employee.

**Endpoint:** `POST /api/customers/:customerId/assign`

**Request Body:**

```json
{
  "employeeId": "emp_002",
  "notes": "تحويل العميل بسبب التخصص في منطقة جدة"
}
```

**Response:** `200 OK`

---

## Data Models

### UnifiedCustomer Model

```typescript
interface UnifiedCustomer {
  // Core Identity
  id: string;
  name: string;
  nameEn?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  nationalId?: string;
  nationality?: string;
  gender?: 'male' | 'female';
  dateOfBirth?: string;
  
  // Source Tracking
  source: CustomerSource; // 'inquiry' | 'manual' | 'whatsapp' | 'import' | 'referral'
  sourceDetails?: SourceDetails;
  
  // Lifecycle
  stage: CustomerLifecycleStage;
  stageHistory: StageChange[];
  
  // Preferences
  preferences: CustomerPreferences;
  
  // AI & Scoring
  leadScore: number; // 0-100
  aiInsights: AIInsights;
  
  // Priority & Classification
  priority: Priority; // 'low' | 'medium' | 'high' | 'urgent'
  customerType?: string;
  tags: string[];
  
  // Relationships
  assignedEmployee?: Employee;
  assignedEmployeeId?: string;
  properties: PropertyInterest[];
  interactions: Interaction[];
  appointments: Appointment[];
  reminders: Reminder[];
  documents: Document[];
  
  // Financial
  totalDealValue?: number;
  expectedRevenue?: number;
  paidAmount?: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastContactAt?: string;
  lastContactType?: string;
  nextFollowUpDate?: string;
  
  // Location
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  
  // Stats
  totalInteractions?: number;
  totalAppointments?: number;
  totalPropertyViews?: number;
  responseRate?: number;
  avgResponseTime?: number;
  
  // KSA Compliance
  ksaCompliance?: KSACompliance;
}
```

### CustomerAction Model

```typescript
interface CustomerAction {
  id: string;
  customerId: string;
  customerName: string;
  type: CustomerActionType;
  title: string;
  description?: string;
  priority: Priority;
  status: CustomerActionStatus; // 'pending' | 'in_progress' | 'completed' | 'dismissed' | 'snoozed'
  source: CustomerSource;
  dueDate?: string;
  snoozedUntil?: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  completedAt?: string;
  completedBy?: string;
  metadata?: Record<string, any>;
}
```

### CustomerActionType

```typescript
type CustomerActionType = 
  | 'new_inquiry'        // New customer inquiry
  | 'callback_request'   // Customer requested callback
  | 'property_match'     // Property matches preferences
  | 'follow_up'          // Scheduled follow-up
  | 'document_required'  // Documents needed
  | 'payment_due'        // Payment reminder
  | 'site_visit'         // Site visit scheduled
  | 'whatsapp_incoming'  // WhatsApp message
  | 'ai_recommended';    // AI recommendation
```

### CustomerLifecycleStage

```typescript
type CustomerLifecycleStage =
  | 'new_lead'           // New lead
  | 'qualified'          // Qualified lead
  | 'property_matching'  // Finding properties
  | 'site_visit'         // Viewing properties
  | 'negotiation'        // Price negotiation
  | 'contract_prep'      // Contract preparation
  | 'down_payment'       // Down payment stage
  | 'closing'            // Deal closing
  | 'post_sale';         // Post-sale support
```

---

## Error Handling

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "phone",
        "message": "Phone number is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-22T15:00:00Z",
    "requestId": "req_xyz789"
  }
}
```

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE with no response body |
| 400 | Bad Request | Validation error, malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (duplicate) |
| 422 | Unprocessable Entity | Validation error with business logic |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Temporary service unavailable |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_FAILED` | Authentication failed |
| `PERMISSION_DENIED` | Insufficient permissions |
| `RESOURCE_NOT_FOUND` | Resource not found |
| `DUPLICATE_RESOURCE` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |
| `DATABASE_ERROR` | Database operation failed |
| `EXTERNAL_SERVICE_ERROR` | External service unavailable |

### Error Response Examples

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields",
    "details": [
      {
        "field": "preferences.budgetMin",
        "message": "Budget minimum must be greater than 0"
      },
      {
        "field": "phone",
        "message": "Invalid Saudi phone number format"
      }
    ]
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Invalid or expired authentication token"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You don't have permission to access this customer",
    "details": {
      "requiredPermission": "customers.delete",
      "currentRole": "sales_agent"
    }
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Customer not found",
    "details": {
      "resourceType": "customer",
      "resourceId": "cust_999"
    }
  }
}
```

**429 Rate Limit:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetAt": "2024-01-22T16:00:00Z"
    }
  }
}
```

---

## Pagination Strategy

### Cursor-Based Pagination (Recommended)

For large datasets and better performance.

**Request:**
```http
GET /api/customers?cursor=eyJpZCI6ImN1c3RfMTAwIn0&limit=20
```

**Response:**
```json
{
  "data": {
    "customers": [...],
    "pagination": {
      "nextCursor": "eyJpZCI6ImN1c3RfMTIwIn0",
      "prevCursor": "eyJpZCI6ImN1c3RfODAifQ",
      "hasNext": true,
      "hasPrevious": true,
      "limit": 20
    }
  }
}
```

### Offset-Based Pagination

For smaller datasets where page numbers are needed.

**Request:**
```http
GET /api/customers?page=3&limit=20
```

**Response:**
```json
{
  "data": {
    "customers": [...],
    "pagination": {
      "currentPage": 3,
      "pageSize": 20,
      "totalPages": 25,
      "totalItems": 487,
      "hasNextPage": true,
      "hasPreviousPage": true
    }
  }
}
```

---

## Filtering Strategy

### Query Parameter Format

**Single Value:**
```
?city=الرياض
```

**Multiple Values (Array):**
```
?stage=property_matching&stage=site_visit&stage=negotiation
```

**Range Queries:**
```
?budgetMin=1000000&budgetMax=3000000
?leadScoreMin=70&leadScoreMax=100
?createdFrom=2024-01-01&createdTo=2024-01-31
```

**Nested Filters (JSON in query param):**
```
?filters={"preferences.propertyType":["villa","apartment"],"city":"الرياض"}
```

### Advanced Filtering

**Request:**
```http
POST /api/customers/query
Content-Type: application/json

{
  "filters": {
    "stage": ["property_matching", "site_visit"],
    "preferences": {
      "budgetMin": { "gte": 1000000 },
      "budgetMax": { "lte": 3000000 },
      "propertyType": { "in": ["villa", "apartment"] }
    },
    "city": { "in": ["الرياض", "جدة"] },
    "leadScore": { "gte": 70 },
    "createdAt": {
      "gte": "2024-01-01T00:00:00Z",
      "lte": "2024-01-31T23:59:59Z"
    }
  },
  "sort": {
    "field": "leadScore",
    "order": "desc"
  },
  "limit": 20,
  "cursor": null
}
```

### Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equal | `{ "city": { "eq": "الرياض" } }` |
| `ne` | Not equal | `{ "stage": { "ne": "post_sale" } }` |
| `in` | In array | `{ "priority": { "in": ["high", "urgent"] } }` |
| `nin` | Not in array | `{ "source": { "nin": ["import"] } }` |
| `gt` | Greater than | `{ "leadScore": { "gt": 70 } }` |
| `gte` | Greater or equal | `{ "budgetMin": { "gte": 1000000 } }` |
| `lt` | Less than | `{ "leadScore": { "lt": 50 } }` |
| `lte` | Less or equal | `{ "budgetMax": { "lte": 5000000 } }` |
| `contains` | String contains | `{ "name": { "contains": "محمد" } }` |
| `startsWith` | String starts with | `{ "phone": { "startsWith": "+9665" } }` |

---

## Caching Strategy

### Cache Headers

**Response Headers:**
```http
Cache-Control: private, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Mon, 22 Jan 2024 12:00:00 GMT
```

### Cache Levels

**1. Browser Cache (Client-side):**
- Static data: 1 hour
- User profile: 5 minutes
- Dashboard stats: 1 minute

**2. CDN Cache:**
- Filter options: 1 hour
- Employee list: 15 minutes

**3. Application Cache (Redis):**
- Customer details: 5 minutes
- Actions list: 1 minute
- Statistics: 30 seconds

**4. Database Query Cache:**
- Complex aggregations: 5 minutes
- Frequently accessed customers: 2 minutes

### Cache Keys Pattern

```
customer:{customerId}
customer:list:{filters_hash}:{page}
actions:stats:{employeeId}:{date}
filters:options:{type}
```

### Cache Invalidation

**Invalidate on:**
- Customer update: Clear `customer:{customerId}`
- New action: Clear `actions:*` and `actions:stats:*`
- Customer assignment change: Clear `customer:list:*` for old and new employee
- Stage change: Clear customer cache and stats

**Example:**
```javascript
// After updating customer
await redis.del(`customer:${customerId}`);
await redis.del(`customer:list:*`); // Clear all list caches
await redis.del(`actions:stats:*`); // Clear stats
```

---

## Rate Limiting

### Rate Limit Rules

| Endpoint Category | Limit | Window | Burst |
|-------------------|-------|--------|-------|
| Authentication | 5 req/min | 1 min | 10 |
| Read (GET) | 100 req/min | 1 min | 150 |
| Write (POST/PUT) | 30 req/min | 1 min | 50 |
| Bulk Operations | 10 req/min | 1 min | 15 |
| Search | 20 req/min | 1 min | 30 |
| File Upload | 5 req/min | 1 min | 10 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1706876400
Retry-After: 60
```

### Rate Limit by Role

| Role | Read | Write | Bulk |
|------|------|-------|------|
| Admin | 200/min | 100/min | 50/min |
| Manager | 150/min | 50/min | 20/min |
| Agent | 100/min | 30/min | 10/min |
| Viewer | 50/min | 0/min | 0/min |

---

## Real-time Updates

### WebSocket Connection

**Connection URL:**
```
wss://api.taearif.com/v1/ws?token=<JWT_TOKEN>
```

**Connection Events:**

```javascript
// Client connects
socket.on('connect', () => {
  console.log('Connected to real-time updates');
});

// Subscribe to channels
socket.emit('subscribe', {
  channels: ['actions', 'customers', 'stats']
});
```

### Event Types

**1. New Action Created:**
```json
{
  "event": "action.created",
  "data": {
    "action": {
      "id": "action_new_001",
      "customerId": "cust_001",
      "type": "new_inquiry",
      "priority": "high"
    }
  },
  "timestamp": "2024-01-22T15:30:00Z"
}
```

**2. Action Updated:**
```json
{
  "event": "action.updated",
  "data": {
    "actionId": "action_001",
    "changes": {
      "status": "completed",
      "completedAt": "2024-01-22T15:30:00Z"
    }
  }
}
```

**3. Customer Stage Changed:**
```json
{
  "event": "customer.stage_changed",
  "data": {
    "customerId": "cust_001",
    "fromStage": "property_matching",
    "toStage": "site_visit",
    "changedBy": "emp_001"
  }
}
```

**4. Stats Updated:**
```json
{
  "event": "stats.updated",
  "data": {
    "stats": {
      "pending": 143,
      "overdue": 7,
      "today": 24
    }
  }
}
```

**5. Assignment Changed:**
```json
{
  "event": "customer.assigned",
  "data": {
    "customerId": "cust_001",
    "previousEmployee": "emp_001",
    "newEmployee": "emp_002"
  }
}
```

### Channels

| Channel | Description | Events |
|---------|-------------|--------|
| `actions` | Action updates | created, updated, completed, dismissed |
| `customers` | Customer updates | created, updated, stage_changed, assigned |
| `stats` | Statistics updates | stats.updated |
| `employee:{id}` | Employee-specific | actions assigned to employee |

---

## Database Schema

### Recommended Schema (PostgreSQL)

**Customers Table:**
```sql
CREATE TABLE customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    phone VARCHAR(20) NOT NULL UNIQUE,
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    national_id VARCHAR(20),
    nationality VARCHAR(50),
    gender VARCHAR(10),
    date_of_birth DATE,
    
    source VARCHAR(50) NOT NULL,
    source_details JSONB,
    
    stage VARCHAR(50) NOT NULL,
    
    preferences JSONB NOT NULL,
    
    lead_score INTEGER DEFAULT 50,
    ai_insights JSONB,
    
    priority VARCHAR(20) DEFAULT 'medium',
    customer_type VARCHAR(50),
    tags TEXT[],
    
    assigned_employee_id VARCHAR(50),
    
    total_deal_value DECIMAL(15,2),
    expected_revenue DECIMAL(15,2),
    paid_amount DECIMAL(15,2),
    
    city VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_contact_at TIMESTAMP,
    last_contact_type VARCHAR(50),
    next_follow_up_date DATE,
    
    deleted_at TIMESTAMP,
    
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(id)
);

-- Indexes for performance
CREATE INDEX idx_customers_stage ON customers(stage);
CREATE INDEX idx_customers_source ON customers(source);
CREATE INDEX idx_customers_priority ON customers(priority);
CREATE INDEX idx_customers_assigned ON customers(assigned_employee_id);
CREATE INDEX idx_customers_city ON customers(city);
CREATE INDEX idx_customers_lead_score ON customers(lead_score DESC);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX idx_customers_tags ON customers USING GIN(tags);
CREATE INDEX idx_customers_preferences ON customers USING GIN(preferences);

-- Full-text search index
CREATE INDEX idx_customers_search ON customers USING GIN(
    to_tsvector('arabic', name || ' ' || COALESCE(name_en, '') || ' ' || phone)
);
```

**Customer Actions Table:**
```sql
CREATE TABLE customer_actions (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    
    type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    source VARCHAR(50) NOT NULL,
    
    due_date TIMESTAMP,
    snoozed_until TIMESTAMP,
    
    assigned_to VARCHAR(50),
    assigned_to_name VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    completed_by VARCHAR(50),
    
    metadata JSONB,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES employees(id)
);

-- Indexes
CREATE INDEX idx_actions_customer ON customer_actions(customer_id);
CREATE INDEX idx_actions_status ON customer_actions(status);
CREATE INDEX idx_actions_type ON customer_actions(type);
CREATE INDEX idx_actions_priority ON customer_actions(priority);
CREATE INDEX idx_actions_assigned ON customer_actions(assigned_to);
CREATE INDEX idx_actions_due_date ON customer_actions(due_date);
CREATE INDEX idx_actions_created_at ON customer_actions(created_at DESC);
CREATE INDEX idx_actions_compound ON customer_actions(status, priority, due_date);
```

**Stage History Table:**
```sql
CREATE TABLE stage_history (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    changed_by VARCHAR(255) NOT NULL,
    changed_by_id VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(500),
    notes TEXT,
    auto_generated BOOLEAN DEFAULT false,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_stage_history_customer ON stage_history(customer_id);
CREATE INDEX idx_stage_history_changed_at ON stage_history(changed_at DESC);
```

**Property Interests Table:**
```sql
CREATE TABLE property_interests (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    property_id VARCHAR(50) NOT NULL,
    property_title VARCHAR(500),
    property_title_en VARCHAR(500),
    property_image TEXT,
    property_price DECIMAL(15,2),
    property_type VARCHAR(50),
    property_location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'interested',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    viewed_at TIMESTAMP,
    feedback TEXT,
    rating INTEGER,
    notes TEXT,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    UNIQUE(customer_id, property_id)
);

CREATE INDEX idx_property_interests_customer ON property_interests(customer_id);
CREATE INDEX idx_property_interests_property ON property_interests(property_id);
CREATE INDEX idx_property_interests_status ON property_interests(status);
```

**Interactions Table:**
```sql
CREATE TABLE interactions (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    direction VARCHAR(20),
    date TIMESTAMP NOT NULL,
    duration INTEGER,
    notes TEXT NOT NULL,
    outcome VARCHAR(500),
    agent_name VARCHAR(255) NOT NULL,
    agent_id VARCHAR(50) NOT NULL,
    sentiment VARCHAR(20),
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_interactions_customer ON interactions(customer_id);
CREATE INDEX idx_interactions_date ON interactions(date DESC);
CREATE INDEX idx_interactions_type ON interactions(type);
CREATE INDEX idx_interactions_agent ON interactions(agent_id);
```

**Appointments Table:**
```sql
CREATE TABLE appointments (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    title_en VARCHAR(500),
    type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    datetime TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    location VARCHAR(500),
    property_id VARCHAR(50),
    property_title VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
    priority VARCHAR(20) DEFAULT 'medium',
    notes TEXT,
    agent_name VARCHAR(255),
    agent_id VARCHAR(50),
    reminder_sent BOOLEAN DEFAULT false,
    outcome TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_appointments_customer ON appointments(customer_id);
CREATE INDEX idx_appointments_datetime ON appointments(datetime);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_agent ON appointments(agent_id);
```

**Reminders Table:**
```sql
CREATE TABLE reminders (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    title_en VARCHAR(500),
    description TEXT,
    datetime TIMESTAMP NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    type VARCHAR(50) NOT NULL,
    related_to VARCHAR(50),
    created_by VARCHAR(255) NOT NULL,
    created_by_id VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_reminders_customer ON reminders(customer_id);
CREATE INDEX idx_reminders_datetime ON reminders(datetime);
CREATE INDEX idx_reminders_status ON reminders(status);
CREATE INDEX idx_reminders_created_by ON reminders(created_by_id);
```

---

## Performance Optimization

### Database Optimization

**1. Query Optimization:**
```sql
-- Use indexes for filtering
EXPLAIN ANALYZE
SELECT * FROM customers
WHERE stage IN ('property_matching', 'site_visit')
  AND priority = 'high'
  AND city = 'الرياض'
ORDER BY lead_score DESC
LIMIT 20;

-- Use partial indexes for common queries
CREATE INDEX idx_customers_active_high_priority 
ON customers(lead_score DESC)
WHERE deleted_at IS NULL 
  AND priority IN ('high', 'urgent');
```

**2. Use Database Views for Complex Queries:**
```sql
CREATE MATERIALIZED VIEW customer_stats AS
SELECT 
    c.id,
    c.name,
    COUNT(DISTINCT a.id) as total_actions,
    COUNT(DISTINCT CASE WHEN a.status = 'pending' THEN a.id END) as pending_actions,
    COUNT(DISTINCT i.id) as total_interactions,
    COUNT(DISTINCT ap.id) as total_appointments
FROM customers c
LEFT JOIN customer_actions a ON c.id = a.customer_id
LEFT JOIN interactions i ON c.id = i.customer_id
LEFT JOIN appointments ap ON c.id = ap.customer_id
GROUP BY c.id, c.name;

-- Refresh periodically
REFRESH MATERIALIZED VIEW customer_stats;
```

**3. Partition Large Tables:**
```sql
-- Partition by date for actions
CREATE TABLE customer_actions_2024_01 PARTITION OF customer_actions
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### API Optimization

**1. Use Field Selection:**
```http
GET /api/customers?fields=id,name,phone,stage,leadScore
```

**2. Eager Loading:**
```http
GET /api/customers?include=assignedEmployee,properties
```

**3. Response Compression:**
```http
Accept-Encoding: gzip, deflate, br
```

**4. GraphQL Alternative (Optional):**
```graphql
query GetCustomers {
  customers(stage: ["property_matching", "site_visit"], limit: 20) {
    id
    name
    phone
    stage
    leadScore
    assignedEmployee {
      name
      email
    }
  }
}
```

### Caching Strategies

**1. Cache Complex Aggregations:**
```javascript
const cacheKey = `stats:${date}:${employeeId}`;
let stats = await redis.get(cacheKey);

if (!stats) {
  stats = await calculateStats(date, employeeId);
  await redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5 min
}
```

**2. Use ETags for Conditional Requests:**
```http
GET /api/customers/cust_001
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

Response: 304 Not Modified
```

---

## OpenAPI Specification

### OpenAPI 3.0 YAML

```yaml
openapi: 3.0.3
info:
  title: Taearif Customers Hub API
  description: Real Estate Customer Management System API for Saudi Arabia
  version: 1.0.0
  contact:
    name: Taearif API Support
    email: api@taearif.com
servers:
  - url: https://api.taearif.com/v1
    description: Production server
  - url: https://api-staging.taearif.com/v1
    description: Staging server
    
security:
  - BearerAuth: []

paths:
  /customers:
    get:
      summary: List customers
      tags:
        - Customers
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            maximum: 100
        - name: stage
          in: query
          schema:
            type: array
            items:
              type: string
              enum: [new_lead, qualified, property_matching, site_visit, negotiation, contract_prep, down_payment, closing, post_sale]
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      customers:
                        type: array
                        items:
                          $ref: '#/components/schemas/UnifiedCustomer'
                      pagination:
                        $ref: '#/components/schemas/Pagination'
    post:
      summary: Create customer
      tags:
        - Customers
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateCustomerRequest'
      responses:
        '201':
          description: Customer created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CustomerResponse'
                
  /customers/{customerId}:
    get:
      summary: Get customer by ID
      tags:
        - Customers
      parameters:
        - name: customerId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Customer details
          
  /customers/actions:
    get:
      summary: List customer actions
      tags:
        - Actions
      parameters:
        - name: status
          in: query
          schema:
            type: array
            items:
              type: string
              enum: [pending, in_progress, completed, dismissed, snoozed]
      responses:
        '200':
          description: Actions list

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      
  schemas:
    UnifiedCustomer:
      type: object
      required:
        - id
        - name
        - phone
        - source
        - stage
        - preferences
      properties:
        id:
          type: string
        name:
          type: string
        phone:
          type: string
        email:
          type: string
        source:
          type: string
          enum: [inquiry, manual, whatsapp, import, referral]
        stage:
          type: string
          enum: [new_lead, qualified, property_matching, site_visit, negotiation, contract_prep, down_payment, closing, post_sale]
        leadScore:
          type: integer
          minimum: 0
          maximum: 100
        priority:
          type: string
          enum: [low, medium, high, urgent]
          
    CustomerAction:
      type: object
      properties:
        id:
          type: string
        customerId:
          type: string
        customerName:
          type: string
        type:
          type: string
          enum: [new_inquiry, callback_request, property_match, follow_up, document_required, payment_due, site_visit, whatsapp_incoming, ai_recommended]
        status:
          type: string
          enum: [pending, in_progress, completed, dismissed, snoozed]
        priority:
          type: string
          enum: [low, medium, high, urgent]
          
    Pagination:
      type: object
      properties:
        currentPage:
          type: integer
        pageSize:
          type: integer
        totalPages:
          type: integer
        totalItems:
          type: integer
        hasNextPage:
          type: boolean
        hasPreviousPage:
          type: boolean
          
    Error:
      type: object
      properties:
        success:
          type: boolean
          default: false
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: array
              items:
                type: object
```

---

## Summary

This API architecture provides:

✅ **30+ RESTful endpoints** covering all customer hub operations  
✅ **Complete request/response examples** with realistic Saudi real estate data  
✅ **Authentication & authorization** with role-based access control  
✅ **Advanced filtering** with 20+ filter parameters  
✅ **Bulk operations** for efficient data management  
✅ **Real-time updates** via WebSocket  
✅ **Pagination strategies** (cursor and offset-based)  
✅ **Comprehensive error handling** with standard codes  
✅ **Caching strategy** with Redis integration  
✅ **Rate limiting** by role and endpoint  
✅ **Database schema** with optimized indexes  
✅ **Performance optimization** guidelines  
✅ **OpenAPI 3.0 specification** for documentation  

### Next Steps for Backend Implementation

1. **Set up project structure** (Node.js/Express or Laravel)
2. **Configure database** (PostgreSQL recommended)
3. **Implement authentication** (JWT with refresh tokens)
4. **Create models** based on schema above
5. **Implement controllers** for each endpoint group
6. **Add validation** using schemas (Joi, Zod, or Laravel validation)
7. **Set up Redis** for caching and rate limiting
8. **Implement WebSocket** for real-time updates
9. **Add logging** (Winston, Pino, or Monolog)
10. **Write tests** (Jest, Mocha, or PHPUnit)
11. **Deploy with monitoring** (PM2, Docker, Kubernetes)

---

**Document Version:** 1.0.0  
**Last Updated:** February 2, 2026  
**Maintained by:** Taearif Development Team
