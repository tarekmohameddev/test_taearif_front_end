# Customers Hub Requests - Database Integration Specification

## Overview

This document provides **complete database integration specifications** for implementing the **Customers Hub Requests API** (`/api/v2/customers-hub/requests/`) based on the existing database schema. This specification is designed for **AI systems** (like Cursor AI) to understand how to map the API requirements to the existing database tables **without modifying legacy tables**.

**Purpose:** Enable backend developers to implement the API endpoints by understanding:
- What tables exist in the database
- What data is required by the API
- How to map between existing tables and API requirements
- How to handle missing data (NULL values allowed)
- SQL query examples for all operations

---

## Table of Contents

1. [Existing Database Tables](#existing-database-tables)
2. [API Requirements](#api-requirements)
3. [Data Mapping Strategy](#data-mapping-strategy)
4. [SQL Query Examples](#sql-query-examples)
5. [Missing Data Handling](#missing-data-handling)
6. [Performance Optimization](#performance-optimization)
7. [Implementation Checklist](#implementation-checklist)

---

## 1. Existing Database Tables

### 1.1 Core Customer Table

**Table:** `api_customers`

**Structure:**
```sql
CREATE TABLE `api_customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `property_request_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `stage_id` bigint(20) UNSIGNED DEFAULT NULL,
  `procedure_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `priority_id` bigint(20) UNSIGNED DEFAULT NULL,
  `responsible_employee_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `district_id` bigint(20) UNSIGNED DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `source` varchar(50) DEFAULT NULL COMMENT 'Source: manual, property_request, whatsapp, import, etc.',
  `source_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by_type` enum('user','employee','system') NOT NULL DEFAULT 'system',
  `created_by_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);
```

**Key Fields:**
- `id` - Customer ID (primary key)
- `user_id` - Tenant/User ID (for multi-tenant isolation)
- `name` - Customer name
- `phone_number` - Customer phone (can be used for both phone and WhatsApp)
- `email` - Customer email
- `responsible_employee_id` - Assigned employee ID
- `source` - Customer source (manual, property_request, whatsapp, etc.)
- `stage_id` - Lifecycle stage ID (references `users_api_customers_stages`)
- `priority_id` - Priority ID (references `users_api_customers_priorities`)

**Missing Fields (API requires but not in table):**
- `whatsapp` - Not separate field (use `phone_number` for both)
- `preferences` - Not in table (must be derived from other tables)

---

### 1.2 Customer Inquiry Table

**Table:** `api_customer_inquiry`

**Structure:**
```sql
CREATE TABLE `api_customer_inquiry` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `inquiry_type` varchar(255) DEFAULT NULL,
  `property_type` varchar(255) DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `currency` varchar(8) DEFAULT NULL,
  `bedrooms` tinyint(3) UNSIGNED DEFAULT NULL,
  `bathrooms` tinyint(3) UNSIGNED DEFAULT NULL,
  `min_area_sqm` decimal(10,2) DEFAULT NULL,
  `max_area_sqm` decimal(10,2) DEFAULT NULL,
  `furnished` tinyint(1) DEFAULT NULL,
  `urgency` varchar(16) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `city` varchar(128) DEFAULT NULL,
  `district` varchar(128) DEFAULT NULL,
  `source_channel` varchar(32) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);
```

**Key Fields:**
- `id` - Inquiry ID
- `customer_id` - References `api_customers.id`
- `inquiry_type` - Type of inquiry (can be 'callback', 'whatsapp', or NULL for regular inquiry)
- `message` - Inquiry message/description
- `is_read` - Read status (0 = unread, 1 = read)
- `is_archived` - Archived status (0 = active, 1 = archived)
- `urgency` - Urgency level (can be 'urgent', 'high', 'medium', 'low', or NULL)
- `property_type`, `budget`, `bedrooms`, `bathrooms` - Property preferences

**Use Cases:**
- Maps to API action types: `new_inquiry`, `callback_request`, `whatsapp_incoming`
- Contains property preferences data

---

### 1.3 Property Requests Table

**Table:** `users_property_requests`

**Structure:**
```sql
CREATE TABLE `users_property_requests` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  `property_type` varchar(255) DEFAULT NULL,
  `purpose` enum('rent','sale') DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `city_id` bigint(20) UNSIGNED DEFAULT NULL,
  `districts_id` bigint(20) UNSIGNED DEFAULT NULL,
  `category` enum('سكني','تجاري','صناعي','زراعي') DEFAULT NULL,
  `neighborhoods` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`neighborhoods`)),
  `area_from` int(11) DEFAULT NULL,
  `area_to` int(11) DEFAULT NULL,
  `purchase_method` enum('كاش','تمويل بنكي') DEFAULT NULL,
  `budget_from` decimal(15,2) DEFAULT NULL,
  `budget_to` decimal(15,2) DEFAULT NULL,
  `seriousness` enum('مستعد فورًا','خلال شهر','خلال 3 أشهر','لاحقًا / استكشاف فقط') DEFAULT NULL,
  `purchase_goal` enum('سكن خاص','استثمار وتأجير','بناء وبيع','مشروع تجاري') DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `contact_on_whatsapp` tinyint(1) NOT NULL DEFAULT 1,
  `notes` text DEFAULT NULL,
  `status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_archived` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);
```

**Key Fields:**
- `id` - Property request ID
- `user_id` - Tenant/User ID
- `full_name` - Customer name
- `phone` - Customer phone
- `property_type` - Type of property
- `budget_from`, `budget_to` - Budget range
- `neighborhoods` - JSON array of preferred neighborhoods
- `is_read`, `is_archived`, `is_active` - Status flags

**Use Cases:**
- Maps to API action type: `property_match`
- Contains detailed property preferences

**Note:** This table is **NOT directly linked** to `api_customers` by foreign key. Must match by `user_id` + `phone` number.

---

### 1.4 Reminders Table

**Table:** `reminders`

**Structure:**
```sql
CREATE TABLE `reminders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `reminder_type_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `datetime` datetime NOT NULL,
  `priority` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0=Low, 1=Medium, 2=High',
  `status` enum('pending','completed','overdue','cancelled') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
);
```

**Key Fields:**
- `id` - Reminder ID
- `customer_id` - References `api_customers.id`
- `title` - Reminder title
- `description` - Reminder description
- `datetime` - Due date/time
- `priority` - Priority (0=Low, 1=Medium, 2=High)
- `status` - Status (pending, completed, overdue, cancelled)

**Use Cases:**
- Maps to API action type: `follow_up`
- Has `dueDate` (datetime field)
- Has status field

---

### 1.5 Customer Appointments Table

**Table:** `users_api_customers_appointments`

**Structure:**
```sql
CREATE TABLE `users_api_customers_appointments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `priority` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1=low, 2=medium, 3=high',
  `note` text DEFAULT NULL,
  `datetime` datetime NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);
```

**Key Fields:**
- `id` - Appointment ID
- `customer_id` - References `api_customers.id`
- `title` - Appointment title
- `type` - Appointment type
- `datetime` - Appointment date/time (use as `dueDate`)
- `priority` - Priority (1=low, 2=medium, 3=high)

**Use Cases:**
- Maps to API action type: `site_visit`
- Has `dueDate` (datetime field)

---

### 1.6 Customer Reminders Table

**Table:** `users_api_customers_reminders`

**Structure:**
```sql
CREATE TABLE `users_api_customers_reminders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `priority` tinyint(4) DEFAULT NULL COMMENT '1=low, 2=medium, 3=high',
  `datetime` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
);
```

**Key Fields:**
- `id` - Reminder ID
- `customer_id` - References `api_customers.id`
- `title` - Reminder title
- `datetime` - Due date/time
- `priority` - Priority (1=low, 2=medium, 3=high)

**Use Cases:**
- Maps to API action type: `follow_up`
- Has `dueDate` (datetime field)

---

### 1.7 Users Table (for Employee Names)

**Table:** `users`

**Structure:**
```sql
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  -- ... other fields
);
```

**Use Cases:**
- Used to get employee names for `assignedToName` field
- Join with `api_customers.responsible_employee_id = users.id`

---

### 1.8 Reference Tables

**Table:** `users_api_customers_stages`
- Contains lifecycle stage definitions
- Join with `api_customers.stage_id` to get stage name

**Table:** `users_api_customers_priorities`
- Contains priority definitions
- Join with `api_customers.priority_id` to get priority details

---

## 2. API Requirements

### 2.1 Action Card Data Structure

The API requires the following structure for each action:

```typescript
interface ActionCardData {
  action: {
    id: string;
    customerId: string;
    customerName: string;
    type: CustomerActionType;  // 'new_inquiry' | 'callback_request' | 'property_match' | 'follow_up' | 'site_visit' | 'whatsapp_incoming' | 'ai_recommended'
    title: string;
    description?: string;
    priority: "urgent" | "high" | "medium" | "low";
    status: "pending" | "in_progress" | "completed" | "dismissed" | "snoozed";
    source: CustomerSource;  // 'inquiry' | 'manual' | 'whatsapp' | 'import' | 'referral'
    dueDate?: string;  // ISO 8601 datetime
    snoozedUntil?: string;  // ISO 8601 datetime
    assignedTo?: string;  // Employee ID
    assignedToName?: string;  // Employee display name
    createdAt: string;  // ISO 8601 datetime
    completedAt?: string;  // ISO 8601 datetime
    completedBy?: string;  // Employee ID
    metadata?: Record<string, any>;  // Additional data
  };
  customer: {
    id: string;
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    city?: string;
    stage: CustomerLifecycleStage;
    preferences?: {
      propertyType?: string[];
      budgetMin?: number;
      budgetMax?: number;
      preferredAreas?: string[];
    };
  };
  property?: {
    id: string;
    title: string;
    location?: string;
    image?: string;
    price?: number;
  };
}
```

### 2.2 Stats Requirements

The API requires stats counts:

```typescript
interface RequestsStats {
  inbox: number;        // new_inquiry + callback_request + whatsapp_incoming (pending/in_progress)
  followups: number;    // follow_up + site_visit (pending/in_progress)
  pending: number;       // All pending + in_progress
  overdue: number;      // Actions with dueDate < now (pending/in_progress)
  today: number;        // Actions with dueDate = today (pending/in_progress)
  completed: number;    // All completed actions
}
```

---

## 3. Data Mapping Strategy

### 3.1 Action Type Mapping

| API Action Type | Source Table | Condition/Logic |
|----------------|-------------|-----------------|
| `new_inquiry` | `api_customer_inquiry` | `inquiry_type IS NULL OR inquiry_type = 'inquiry'` |
| `callback_request` | `api_customer_inquiry` | `inquiry_type = 'callback'` |
| `whatsapp_incoming` | `api_customer_inquiry` | `inquiry_type = 'whatsapp'` |
| `property_match` | `users_property_requests` | `is_active = 1 AND is_archived = 0` |
| `follow_up` | `reminders` | `deleted_at IS NULL` |
| `follow_up` | `users_api_customers_reminders` | All records |
| `site_visit` | `users_api_customers_appointments` | All records |

**Important:** Multiple tables can map to the same action type. Use UNION ALL to combine them.

### 3.2 Status Mapping

| Source Table | Source Field | API Status | Mapping Logic |
|-------------|-------------|-----------|---------------|
| `api_customer_inquiry` | `is_read`, `is_archived` | `pending` | `is_read = 0 AND is_archived = 0` |
| `api_customer_inquiry` | `is_read`, `is_archived` | `in_progress` | `is_read = 1 AND is_archived = 0` |
| `api_customer_inquiry` | `is_archived` | `dismissed` | `is_archived = 1` |
| `users_property_requests` | `is_read`, `is_archived` | `pending` | `is_read = 0 AND is_archived = 0` |
| `users_property_requests` | `is_read`, `is_archived` | `in_progress` | `is_read = 1 AND is_archived = 0` |
| `users_property_requests` | `is_archived` | `dismissed` | `is_archived = 1` |
| `reminders` | `status` | `pending` | `status = 'pending'` |
| `reminders` | `status` | `completed` | `status = 'completed'` |
| `reminders` | `status` | `dismissed` | `status = 'cancelled'` |
| `reminders` | `status` | `pending` | `status = 'overdue'` (treat as pending) |
| `users_api_customers_appointments` | `datetime` | `pending` | `datetime >= NOW()` |
| `users_api_customers_appointments` | `datetime` | `completed` | `datetime < NOW()` |

**Note:** API has `in_progress` status, but some legacy tables don't. Map `is_read = 1` to `in_progress`.

### 3.3 Priority Mapping

| Source Table | Source Field | API Priority | Mapping Logic |
|-------------|-------------|-------------|---------------|
| `api_customer_inquiry` | `urgency` | `urgent` | `urgency = 'urgent'` |
| `api_customer_inquiry` | `urgency` | `high` | `urgency = 'high'` |
| `api_customer_inquiry` | `urgency` | `medium` | `urgency = 'medium'` |
| `api_customer_inquiry` | `urgency` | `low` | `urgency = 'low' OR urgency IS NULL` |
| `reminders` | `priority` | `high` | `priority = 2` |
| `reminders` | `priority` | `medium` | `priority = 1` |
| `reminders` | `priority` | `low` | `priority = 0` |
| `users_api_customers_appointments` | `priority` | `high` | `priority = 3` |
| `users_api_customers_appointments` | `priority` | `medium` | `priority = 2` |
| `users_api_customers_appointments` | `priority` | `low` | `priority = 1` |
| Default | - | `low` | When priority not available |

### 3.4 Source Mapping

| Source Table | API Source | Logic |
|-------------|-----------|-------|
| `api_customer_inquiry` | `inquiry` | Default for inquiries |
| `api_customer_inquiry` | `whatsapp` | When `inquiry_type = 'whatsapp'` |
| `users_property_requests` | `property_request` | Default |
| `reminders` | `manual` | Default |
| `users_api_customers_appointments` | `manual` | Default |
| `users_api_customers_reminders` | `manual` | Default |
| `api_customers.source` | Use as-is | If available |

### 3.5 Customer Preferences Mapping

| API Field | Source Table | Source Field | Notes |
|----------|-------------|-------------|-------|
| `propertyType` | `api_customer_inquiry` | `property_type` | Can be array (JSON_ARRAYAGG) |
| `propertyType` | `users_property_requests` | `property_type` | Fallback |
| `budgetMin` | `api_customer_inquiry` | `budget` | Use MIN if multiple |
| `budgetMin` | `users_property_requests` | `budget_from` | Fallback |
| `budgetMax` | `api_customer_inquiry` | `budget` | Use MAX if multiple |
| `budgetMax` | `users_property_requests` | `budget_to` | Fallback |
| `preferredAreas` | `users_property_requests` | `neighborhoods` | JSON array |
| `preferredAreas` | `api_customer_inquiry` | `district` | Fallback (convert to array) |

---

## 4. SQL Query Examples

### 4.1 Get All Actions for a Customer (Unified Query)

```sql
-- This query combines all action types using UNION ALL
-- Each SELECT represents one action type from one table

SELECT 
    -- Action ID (prefixed by source)
    CONCAT('inquiry_', aci.id) AS `id`,
    
    -- Customer Information
    aci.customer_id AS `customerId`,
    ac.name AS `customerName`,
    
    -- Action Type
    CASE 
        WHEN aci.inquiry_type = 'callback' THEN 'callback_request'
        WHEN aci.inquiry_type = 'whatsapp' THEN 'whatsapp_incoming'
        ELSE 'new_inquiry'
    END AS `type`,
    
    -- Title and Description
    COALESCE(CONCAT('استفسار جديد من ', ac.name), 'استفسار جديد') AS `title`,
    aci.message AS `description`,
    
    -- Priority
    CASE 
        WHEN aci.urgency = 'urgent' THEN 'urgent'
        WHEN aci.urgency = 'high' THEN 'high'
        WHEN aci.urgency = 'medium' THEN 'medium'
        ELSE 'low'
    END AS `priority`,
    
    -- Status
    CASE 
        WHEN aci.is_archived = 1 THEN 'dismissed'
        WHEN aci.is_read = 1 THEN 'in_progress'
        ELSE 'pending'
    END AS `status`,
    
    -- Source
    COALESCE(ac.source, 'inquiry') AS `source`,
    
    -- Dates (NULL allowed - not available in this table)
    NULL AS `dueDate`,
    NULL AS `snoozedUntil`,
    aci.created_at AS `createdAt`,
    NULL AS `completedAt`,
    NULL AS `completedBy`,
    
    -- Assignment
    ac.responsible_employee_id AS `assignedTo`,
    CONCAT(COALESCE(u.first_name, ''), ' ', COALESCE(u.last_name, '')) AS `assignedToName`,
    
    -- Metadata (JSON)
    JSON_OBJECT(
        'inquiryId', aci.id,
        'propertyType', aci.property_type,
        'budget', aci.budget,
        'bedrooms', aci.bedrooms,
        'bathrooms', aci.bathrooms,
        'location', aci.location,
        'city', aci.city,
        'district', aci.district
    ) AS `metadata`,
    
    -- Source identifier
    'api_customer_inquiry' AS `sourceTable`,
    aci.id AS `sourceId`,
    aci.user_id AS `userId`
    
FROM `api_customer_inquiry` aci
INNER JOIN `api_customers` ac ON aci.customer_id = ac.id
LEFT JOIN `users` u ON ac.responsible_employee_id = u.id
WHERE aci.is_archived = 0
  AND aci.user_id = ?  -- Filter by tenant

UNION ALL

-- Property Requests
SELECT 
    CONCAT('property_request_', upr.id) AS `id`,
    COALESCE(ac.id, 0) AS `customerId`,  -- May not have customer record
    COALESCE(ac.name, upr.full_name) AS `customerName`,
    'property_match' AS `type`,
    CONCAT('عقار مطابق: ', COALESCE(upr.property_type, 'عقار')) AS `title`,
    upr.notes AS `description`,
    'medium' AS `priority`,
    CASE 
        WHEN upr.is_archived = 1 THEN 'dismissed'
        WHEN upr.is_read = 1 THEN 'in_progress'
        ELSE 'pending'
    END AS `status`,
    'property_request' AS `source`,
    NULL AS `dueDate`,
    NULL AS `snoozedUntil`,
    upr.created_at AS `createdAt`,
    NULL AS `completedAt`,
    NULL AS `completedBy`,
    COALESCE(ac.responsible_employee_id, NULL) AS `assignedTo`,
    CONCAT(COALESCE(u2.first_name, ''), ' ', COALESCE(u2.last_name, '')) AS `assignedToName`,
    JSON_OBJECT(
        'propertyRequestId', upr.id,
        'propertyType', upr.property_type,
        'budgetFrom', upr.budget_from,
        'budgetTo', upr.budget_to,
        'purpose', upr.purpose,
        'seriousness', upr.seriousness
    ) AS `metadata`,
    'users_property_requests' AS `sourceTable`,
    upr.id AS `sourceId`,
    upr.user_id AS `userId`
    
FROM `users_property_requests` upr
LEFT JOIN `api_customers` ac ON upr.user_id = ac.user_id 
    AND upr.phone = ac.phone_number
LEFT JOIN `users` u2 ON ac.responsible_employee_id = u2.id
WHERE upr.is_archived = 0 
  AND upr.is_active = 1
  AND upr.user_id = ?  -- Filter by tenant

UNION ALL

-- Reminders
SELECT 
    CONCAT('reminder_', r.id) AS `id`,
    r.customer_id AS `customerId`,
    ac.name AS `customerName`,
    'follow_up' AS `type`,
    r.title AS `title`,
    r.description AS `description`,
    CASE 
        WHEN r.priority = 2 THEN 'high'
        WHEN r.priority = 1 THEN 'medium'
        ELSE 'low'
    END AS `priority`,
    CASE 
        WHEN r.status = 'completed' THEN 'completed'
        WHEN r.status = 'cancelled' THEN 'dismissed'
        WHEN r.status = 'overdue' THEN 'pending'
        ELSE r.status
    END AS `status`,
    'manual' AS `source`,
    r.datetime AS `dueDate`,
    NULL AS `snoozedUntil`,
    r.created_at AS `createdAt`,
    CASE WHEN r.status = 'completed' THEN r.updated_at ELSE NULL END AS `completedAt`,
    NULL AS `completedBy`,
    NULL AS `assignedTo`,
    NULL AS `assignedToName`,
    JSON_OBJECT(
        'reminderId', r.id,
        'reminderTypeId', r.reminder_type_id,
        'notes', r.notes
    ) AS `metadata`,
    'reminders' AS `sourceTable`,
    r.id AS `sourceId`,
    r.user_id AS `userId`
    
FROM `reminders` r
INNER JOIN `api_customers` ac ON r.customer_id = ac.id
WHERE r.deleted_at IS NULL
  AND r.user_id = ?  -- Filter by tenant

UNION ALL

-- Appointments
SELECT 
    CONCAT('appointment_', uaca.id) AS `id`,
    uaca.customer_id AS `customerId`,
    ac.name AS `customerName`,
    'site_visit' AS `type`,
    uaca.title AS `title`,
    uaca.note AS `description`,
    CASE 
        WHEN uaca.priority = 3 THEN 'high'
        WHEN uaca.priority = 2 THEN 'medium'
        ELSE 'low'
    END AS `priority`,
    CASE 
        WHEN uaca.datetime < NOW() THEN 'completed'
        ELSE 'pending'
    END AS `status`,
    'manual' AS `source`,
    uaca.datetime AS `dueDate`,
    NULL AS `snoozedUntil`,
    uaca.created_at AS `createdAt`,
    CASE WHEN uaca.datetime < NOW() THEN uaca.updated_at ELSE NULL END AS `completedAt`,
    NULL AS `completedBy`,
    NULL AS `assignedTo`,
    NULL AS `assignedToName`,
    JSON_OBJECT(
        'appointmentId', uaca.id,
        'type', uaca.type,
        'duration', uaca.duration
    ) AS `metadata`,
    'users_api_customers_appointments' AS `sourceTable`,
    uaca.id AS `sourceId`,
    uaca.user_id AS `userId`
    
FROM `users_api_customers_appointments` uaca
INNER JOIN `api_customers` ac ON uaca.customer_id = ac.id
WHERE uaca.user_id = ?  -- Filter by tenant

UNION ALL

-- Customer Reminders
SELECT 
    CONCAT('customer_reminder_', uacr.id) AS `id`,
    uacr.customer_id AS `customerId`,
    ac.name AS `customerName`,
    'follow_up' AS `type`,
    uacr.title AS `title`,
    NULL AS `description`,
    CASE 
        WHEN uacr.priority = 3 THEN 'high'
        WHEN uacr.priority = 2 THEN 'medium'
        ELSE 'low'
    END AS `priority`,
    CASE 
        WHEN uacr.datetime < NOW() THEN 'pending'  -- Overdue treated as pending
        ELSE 'pending'
    END AS `status`,
    'manual' AS `source`,
    uacr.datetime AS `dueDate`,
    NULL AS `snoozedUntil`,
    uacr.created_at AS `createdAt`,
    NULL AS `completedAt`,
    NULL AS `completedBy`,
    NULL AS `assignedTo`,
    NULL AS `assignedToName`,
    JSON_OBJECT('reminderId', uacr.id) AS `metadata`,
    'users_api_customers_reminders' AS `sourceTable`,
    uacr.id AS `sourceId`,
    uacr.user_id AS `userId`
    
FROM `users_api_customers_reminders` uacr
INNER JOIN `api_customers` ac ON uacr.customer_id = ac.id
WHERE uacr.user_id = ?  -- Filter by tenant

-- Order and limit
ORDER BY `createdAt` DESC
LIMIT ? OFFSET ?;
```

### 4.2 Get Actions with Filters

```sql
-- Apply filters based on API request body
-- This is a simplified example - you'll need to build dynamic WHERE clauses

SELECT * FROM (
    -- Use the UNION ALL query from 4.1 here
    -- ... (same as above)
) AS all_actions
WHERE 
    -- Tab filter
    (
        ? = 'inbox' AND type IN ('new_inquiry', 'callback_request', 'whatsapp_incoming') AND status IN ('pending', 'in_progress')
        OR ? = 'followups' AND type IN ('follow_up', 'site_visit') AND status IN ('pending', 'in_progress')
        OR ? = 'all' AND status IN ('pending', 'in_progress')
        OR ? = 'completed' AND status = 'completed'
    )
    -- Source filter
    AND (? IS NULL OR source IN (?))  -- selectedSources array
    -- Priority filter
    AND (? IS NULL OR priority IN (?))  -- selectedPriorities array
    -- Type filter
    AND (? IS NULL OR type IN (?))  -- selectedTypes array
    -- Assignee filter
    AND (? IS NULL OR assignedTo IN (?))  -- selectedAssignees array
    -- Due date filter
    AND (
        ? = 'all' OR
        (? = 'overdue' AND dueDate < NOW()) OR
        (? = 'today' AND DATE(dueDate) = CURRENT_DATE) OR
        (? = 'week' AND dueDate >= NOW() AND dueDate <= DATE_ADD(NOW(), INTERVAL 7 DAY)) OR
        (? = 'no_date' AND dueDate IS NULL)
    )
    -- Search query
    AND (
        ? IS NULL OR
        customerName LIKE CONCAT('%', ?, '%') OR
        title LIKE CONCAT('%', ?, '%') OR
        description LIKE CONCAT('%', ?, '%')
    )
ORDER BY createdAt DESC
LIMIT ? OFFSET ?;
```

### 4.3 Get Stats

```sql
SELECT 
    -- Inbox count
    COUNT(*) FILTER (
        WHERE type IN ('new_inquiry', 'callback_request', 'whatsapp_incoming') 
        AND status IN ('pending', 'in_progress')
    ) AS inbox,
    
    -- Followups count
    COUNT(*) FILTER (
        WHERE type IN ('follow_up', 'site_visit') 
        AND status IN ('pending', 'in_progress')
    ) AS followups,
    
    -- Pending count
    COUNT(*) FILTER (
        WHERE status IN ('pending', 'in_progress')
    ) AS pending,
    
    -- Overdue count
    COUNT(*) FILTER (
        WHERE dueDate < NOW() 
        AND status IN ('pending', 'in_progress')
    ) AS overdue,
    
    -- Today count
    COUNT(*) FILTER (
        WHERE DATE(dueDate) = CURRENT_DATE 
        AND status IN ('pending', 'in_progress')
    ) AS today,
    
    -- Completed count
    COUNT(*) FILTER (
        WHERE status = 'completed'
    ) AS completed
    
FROM (
    -- Use the UNION ALL query from 4.1 here
    -- ... (same as above)
) AS all_actions
WHERE userId = ?;  -- Filter by tenant
```

### 4.4 Get Customer Preferences

```sql
SELECT 
    ac.id AS `customerId`,
    ac.user_id AS `userId`,
    
    -- Property Type (from inquiry or property request)
    COALESCE(
        (SELECT JSON_ARRAYAGG(DISTINCT property_type) 
         FROM api_customer_inquiry 
         WHERE customer_id = ac.id 
         AND property_type IS NOT NULL),
        (SELECT JSON_ARRAYAGG(DISTINCT property_type) 
         FROM users_property_requests upr
         WHERE upr.user_id = ac.user_id 
         AND upr.phone = ac.phone_number
         AND property_type IS NOT NULL),
        JSON_ARRAY()
    ) AS `propertyType`,
    
    -- Budget Range
    COALESCE(
        (SELECT MIN(budget) FROM api_customer_inquiry WHERE customer_id = ac.id AND budget IS NOT NULL),
        (SELECT MIN(budget_from) FROM users_property_requests upr 
         WHERE upr.user_id = ac.user_id AND upr.phone = ac.phone_number AND budget_from IS NOT NULL)
    ) AS `budgetMin`,
    
    COALESCE(
        (SELECT MAX(budget) FROM api_customer_inquiry WHERE customer_id = ac.id AND budget IS NOT NULL),
        (SELECT MAX(budget_to) FROM users_property_requests upr 
         WHERE upr.user_id = ac.user_id AND upr.phone = ac.phone_number AND budget_to IS NOT NULL)
    ) AS `budgetMax`,
    
    -- Bedrooms and Bathrooms
    (SELECT bedrooms FROM api_customer_inquiry 
     WHERE customer_id = ac.id AND bedrooms IS NOT NULL 
     ORDER BY created_at DESC LIMIT 1) AS `bedrooms`,
     
    (SELECT bathrooms FROM api_customer_inquiry 
     WHERE customer_id = ac.id AND bathrooms IS NOT NULL 
     ORDER BY created_at DESC LIMIT 1) AS `bathrooms`,
    
    -- Preferred Areas
    COALESCE(
        (SELECT neighborhoods FROM users_property_requests upr
         WHERE upr.user_id = ac.user_id 
         AND upr.phone = ac.phone_number
         AND neighborhoods IS NOT NULL
         ORDER BY created_at DESC LIMIT 1),
        JSON_ARRAY()
    ) AS `preferredAreas`
    
FROM `api_customers` ac
WHERE ac.id = ? AND ac.user_id = ?;
```

### 4.5 Update Action Status (Complete/Dismiss/Snooze)

```sql
-- Complete action (example for inquiry)
UPDATE `api_customer_inquiry`
SET `is_read` = 1, `is_archived` = 0, `updated_at` = NOW()
WHERE `id` = ? AND `user_id` = ?;

-- Dismiss action (example for inquiry)
UPDATE `api_customer_inquiry`
SET `is_archived` = 1, `updated_at` = NOW()
WHERE `id` = ? AND `user_id` = ?;

-- Complete reminder
UPDATE `reminders`
SET `status` = 'completed', `updated_at` = NOW()
WHERE `id` = ? AND `user_id` = ?;

-- Note: snoozedUntil is not available in legacy tables
-- You may need to add a new column or use a separate table
```

---

## 5. Missing Data Handling

### 5.1 Allowed NULL Values

The following fields **MUST be allowed to be NULL** (no conflicts):

- `dueDate` - Not available in `api_customer_inquiry` or `users_property_requests`
- `snoozedUntil` - Not available in ANY legacy table
- `completedAt` - Not available in `api_customer_inquiry` or `users_property_requests`
- `completedBy` - Not available in ANY legacy table
- `assignedToName` - May be NULL if employee not found or not assigned
- `whatsapp` - Not separate field in `api_customers` (use `phone_number` for both)
- `description` - May be NULL in some tables
- `property` - May not have associated property

### 5.2 Default Values

When data is missing, use these defaults:

- **Priority**: `'low'` (if not specified)
- **Status**: `'pending'` (for new records)
- **Source**: Based on table (see mapping table)
- **Type**: Based on table and conditions (see mapping table)

### 5.3 Handling Property Requests Without Customer Record

`users_property_requests` may not have a corresponding `api_customers` record. In this case:

- Use `full_name` from `users_property_requests` as `customerName`
- Use `phone` from `users_property_requests` as customer phone
- Set `customerId` to NULL or 0 (or create customer record if needed)
- Use LEFT JOIN instead of INNER JOIN

---

## 6. Performance Optimization

### 6.1 Required Indexes

Ensure these indexes exist on the underlying tables:

```sql
-- api_customer_inquiry
CREATE INDEX idx_inquiry_customer_created ON api_customer_inquiry(customer_id, created_at);
CREATE INDEX idx_inquiry_user_created ON api_customer_inquiry(user_id, created_at);
CREATE INDEX idx_inquiry_user_read_archived ON api_customer_inquiry(user_id, is_read, is_archived);

-- users_property_requests
CREATE INDEX idx_property_requests_user_created ON users_property_requests(user_id, created_at);
CREATE INDEX idx_property_requests_user_phone ON users_property_requests(user_id, phone);
CREATE INDEX idx_property_requests_user_active ON users_property_requests(user_id, is_active, is_archived);

-- reminders
CREATE INDEX idx_reminders_customer_datetime ON reminders(customer_id, datetime);
CREATE INDEX idx_reminders_user_customer ON reminders(user_id, customer_id);
CREATE INDEX idx_reminders_user_status ON reminders(user_id, status, deleted_at);

-- users_api_customers_appointments
CREATE INDEX idx_appointments_customer_datetime ON users_api_customers_appointments(customer_id, datetime);
CREATE INDEX idx_appointments_user_customer ON users_api_customers_appointments(user_id, customer_id);

-- users_api_customers_reminders
CREATE INDEX idx_customer_reminders_customer_datetime ON users_api_customers_reminders(customer_id, datetime);
CREATE INDEX idx_customer_reminders_user_customer ON users_api_customers_reminders(user_id, customer_id);

-- api_customers
CREATE INDEX idx_customers_user_id ON api_customers(user_id);
CREATE INDEX idx_customers_employee_id ON api_customers(responsible_employee_id);
```

### 6.2 Query Optimization Tips

1. **Always filter by `user_id` first** (tenant isolation) - This is CRITICAL for performance
2. **Use LIMIT and OFFSET** for pagination
3. **Filter by status/type before joining** when possible
4. **Use covering indexes** for frequently queried fields
5. **Consider materialized views** for stats (refresh periodically, NOT caching)

### 6.3 Pagination

```sql
-- Always use LIMIT and OFFSET
LIMIT ? OFFSET ?;

-- Maximum limit: 100
-- Default limit: 50
-- Maximum offset: 1,000,000
```

---

## 7. Implementation Checklist

### 7.1 Database Setup

- [ ] Verify all required tables exist
- [ ] Create required indexes (see Section 6.1)
- [ ] Test UNION ALL query performance
- [ ] Verify tenant isolation (user_id filtering)

### 7.2 API Endpoint Implementation

- [ ] Implement `POST /api/v2/customers-hub/requests/list` endpoint
- [ ] Handle all filter types (tabs, dropdowns, search, date, budget)
- [ ] Implement stats calculation
- [ ] Implement pagination
- [ ] Handle NULL values gracefully
- [ ] Return proper error responses

### 7.3 Action Operations

- [ ] Implement `POST /api/v2/customers-hub/requests/{actionId}` for single actions
- [ ] Map action types to correct source tables
- [ ] Handle complete/dismiss/snooze operations
- [ ] Update correct table based on `sourceTable` field

### 7.4 Bulk Operations

- [ ] Implement `POST /api/v2/customers-hub/requests/bulk` endpoint
- [ ] Handle bulk complete/dismiss/snooze/assign/change_priority
- [ ] Update multiple source tables if needed
- [ ] Use transactions for consistency

### 7.5 Testing

- [ ] Test with customer that has all action types
- [ ] Test with customer that has missing data (NULL values)
- [ ] Test with property request without customer record
- [ ] Test all filter combinations
- [ ] Test pagination
- [ ] Test stats calculation
- [ ] Test performance with large datasets

---

## 8. Important Notes

### 8.1 Tenant Isolation

**CRITICAL:** Always filter by `user_id` (tenant ID) in ALL queries. Never return data from other tenants.

### 8.2 NULL Values

**ALLOWED:** NULL values are expected and allowed. Do NOT throw errors for missing data.

### 8.3 Action ID Format

Action IDs are prefixed by source table:
- `inquiry_123` - From `api_customer_inquiry`
- `property_request_456` - From `users_property_requests`
- `reminder_789` - From `reminders`
- `appointment_101` - From `users_api_customers_appointments`
- `customer_reminder_202` - From `users_api_customers_reminders`

When updating actions, parse the prefix to determine which table to update.

### 8.4 Date/Time Format

All dates must be returned in **ISO 8601 format** with **UTC timezone**:
- Format: `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ`
- Example: `2024-01-15T10:30:00Z`

### 8.5 JSON Fields

- `metadata` - Must be valid JSON object
- `preferredAreas` - Must be valid JSON array
- `propertyType` - Must be valid JSON array

---

## 9. Example Response Structure

```json
{
  "success": true,
  "data": {
    "stats": {
      "inbox": 25,
      "followups": 12,
      "pending": 37,
      "overdue": 5,
      "today": 8,
      "completed": 150
    },
    "actions": [
      {
        "action": {
          "id": "inquiry_123",
          "customerId": "456",
          "customerName": "أحمد محمد",
          "type": "new_inquiry",
          "title": "استفسار جديد من أحمد محمد",
          "description": "أريد فيلا في العليا",
          "priority": "high",
          "status": "pending",
          "source": "inquiry",
          "dueDate": null,
          "snoozedUntil": null,
          "assignedTo": "789",
          "assignedToName": "محمد علي",
          "createdAt": "2024-01-15T10:30:00Z",
          "completedAt": null,
          "completedBy": null,
          "metadata": {
            "inquiryId": 123,
            "propertyType": "villa",
            "budget": 1500000,
            "bedrooms": 4,
            "bathrooms": 3,
            "city": "الرياض",
            "district": "العليا"
          }
        },
        "customer": {
          "id": "456",
          "name": "أحمد محمد",
          "phone": "+966501234567",
          "whatsapp": "+966501234567",
          "email": "ahmed@example.com",
          "city": "الرياض",
          "stage": "qualified",
          "preferences": {
            "propertyType": ["villa"],
            "budgetMin": 1000000,
            "budgetMax": 2000000,
            "preferredAreas": ["الرياض - العليا"]
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 187,
      "totalPages": 4
    }
  }
}
```

---

## 10. Summary

This document provides complete specifications for implementing the Customers Hub Requests API using existing database tables **without modifying legacy tables**. Key points:

- ✅ **No schema changes** - Use existing tables as-is
- ✅ **NULL values allowed** - Missing data is expected and handled gracefully
- ✅ **Unified query** - Use UNION ALL to combine multiple tables
- ✅ **Mapping tables** - Clear mapping between legacy data and API requirements
- ✅ **Performance optimized** - Indexes and query optimization included
- ✅ **Tenant isolation** - Always filter by `user_id`

**Next Steps:**
1. Review this document with your backend team
2. Implement the SQL queries in your backend code
3. Test with real data
4. Optimize based on performance metrics

---

**END OF DOCUMENTATION**
