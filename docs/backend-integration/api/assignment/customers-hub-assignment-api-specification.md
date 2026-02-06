# Customers Hub Assignment API - Backend Integration Specification

## Overview

This document provides complete technical specifications for the **Customers Hub Assignment API** endpoints. This specification is designed for backend developers to implement the assignment functionality for automatically and manually assigning customers to employees.

**Base URL:** `/api/v2/customers-hub/assignment`  
**Authentication:** Bearer Token (Laravel Sanctum)

---

## Table of Contents

- [Authentication](#authentication)
- [1. Get Employees](#1-get-employees)
- [2. Get Unassigned Count](#2-get-unassigned-count)
- [3. Auto Assign Customers](#3-auto-assign-customers)
- [4. Manual Assign Customers](#4-manual-assign-customers)
- [5. Save Assignment Rules](#5-save-assignment-rules)
- [6. Get Assignment Rules](#6-get-assignment-rules)
- [Error Responses](#error-responses)

---

## Authentication

All requests require authentication header:

```http
Authorization: Bearer {your_token_here}
Content-Type: application/json
Accept: application/json
```

---

## 1. Get Employees

**Endpoint:** `GET /api/v2/customers-hub/assignment/employees`

**Description:** Retrieves a list of all employees with their current workload, capacity, and assignment statistics.

**Request:** None (GET request)

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Employees retrieved successfully",
  "data": {
    "employees": [
      {
        "id": "15",
        "name": "Ahmed Ali",
        "role": "Sales Agent",
        "email": "ahmed@example.com",
        "phone": "+966501111111",
        "customerCount": 25,
        "activeCount": 20,
        "maxCapacity": 50,
        "isActive": true,
        "loadPercentage": 50
      },
      {
        "id": "22",
        "name": "Sara Mohammed",
        "role": "Senior Sales Agent",
        "email": "sara@example.com",
        "phone": "+966502222222",
        "customerCount": 30,
        "activeCount": 28,
        "maxCapacity": 60,
        "isActive": true,
        "loadPercentage": 50
      },
      {
        "id": "31",
        "name": "Mohammed Hassan",
        "role": "Sales Agent",
        "email": "mohammed@example.com",
        "phone": "+966503333333",
        "customerCount": 15,
        "activeCount": 12,
        "maxCapacity": 40,
        "isActive": false,
        "loadPercentage": 37.5
      }
    ]
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Response Fields:**
- `id` (string) - Employee ID
- `name` (string) - Employee full name
- `role` (string) - Employee role/title
- `email` (string, optional) - Employee email address
- `phone` (string, optional) - Employee phone number
- `customerCount` (number) - Total number of customers assigned to this employee
- `activeCount` (number) - Number of active customers (not archived/completed)
- `maxCapacity` (number) - Maximum number of customers this employee can handle
- `isActive` (boolean) - Whether the employee is currently active for assignments
- `loadPercentage` (number) - Current workload percentage (customerCount / maxCapacity * 100)

---

## 2. Get Unassigned Count

**Endpoint:** `GET /api/v2/customers-hub/assignment/unassigned-count`

**Description:** Returns the total count of customers that are not assigned to any employee.

**Request:** None (GET request)

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Unassigned count retrieved successfully",
  "data": {
    "unassignedCount": 45
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Response Fields:**
- `unassignedCount` (number) - Total number of customers without an assigned employee

---

## 3. Auto Assign Customers

**Endpoint:** `POST /api/v2/customers-hub/assignment/auto-assign`

**Description:** Automatically assigns unassigned customers to employees based on the provided assignment rules. The system matches customers to employees based on their rules (budget, property type, city, source, etc.) and assigns them accordingly.

**Request Body:**

```json
{
  "employeeRules": [
    {
      "employeeId": "15",
      "isActive": true,
      "rules": [
        {
          "id": "rule_1",
          "field": "budgetMin",
          "operator": "greaterThan",
          "value": "2000000"
        },
        {
          "id": "rule_2",
          "field": "city",
          "operator": "equals",
          "value": "الرياض"
        }
      ]
    },
    {
      "employeeId": "22",
      "isActive": true,
      "rules": [
        {
          "id": "rule_3",
          "field": "propertyType",
          "operator": "equals",
          "value": "villa"
        },
        {
          "id": "rule_4",
          "field": "source",
          "operator": "equals",
          "value": "website"
        }
      ]
    },
    {
      "employeeId": "31",
      "isActive": false,
      "rules": []
    }
  ]
}
```

**Request Fields:**
- `employeeRules` (array) - Array of employee configuration objects
  - `employeeId` (string) - ID of the employee
  - `isActive` (boolean) - Whether this employee should receive assignments
  - `rules` (array) - Array of assignment rules for this employee
    - `id` (string) - Unique identifier for the rule
    - `field` (string) - Field to match against. Options: `"budgetMin"`, `"budgetMax"`, `"propertyType"`, `"city"`, `"source"`
    - `operator` (string) - Comparison operator. Options: `"equals"`, `"greaterThan"`, `"lessThan"`, `"contains"`
    - `value` (string) - Value to compare against

**Rule Matching Logic:**
- All rules for an employee must match (AND logic)
- Only customers without an assigned employee are considered
- Only active employees (`isActive: true`) receive assignments
- Customers are matched to the first employee whose rules they satisfy
- If multiple employees match, the one with the lowest current load percentage is selected

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Customers assigned successfully",
  "data": {
    "assignedCount": 12,
    "failedCount": 2,
    "assignments": [
      {
        "customerId": "228",
        "employeeId": "15",
        "assignedAt": "2026-02-05T10:30:00Z"
      },
      {
        "customerId": "229",
        "employeeId": "15",
        "assignedAt": "2026-02-05T10:30:00Z"
      },
      {
        "customerId": "230",
        "employeeId": "22",
        "assignedAt": "2026-02-05T10:30:00Z"
      }
    ]
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Response Fields:**
- `assignedCount` (number) - Number of customers successfully assigned
- `failedCount` (number) - Number of customers that failed to assign (e.g., validation errors, employee at capacity)
- `assignments` (array) - Array of successful assignment records
  - `customerId` (string) - ID of the assigned customer
  - `employeeId` (string) - ID of the employee who received the assignment
  - `assignedAt` (string) - ISO 8601 timestamp of when the assignment occurred

---

## 4. Manual Assign Customers

**Endpoint:** `POST /api/v2/customers-hub/assignment/assign`

**Description:** Manually assigns specific customers to a specific employee. This is used for manual assignment operations where an admin or manager wants to assign customers directly.

**Request Body:**

```json
{
  "customerIds": ["228", "229", "230"],
  "employeeId": "15"
}
```

**Request Fields:**
- `customerIds` (array of strings) - Array of customer IDs to assign
- `employeeId` (string) - ID of the employee to assign customers to

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Customers assigned successfully",
  "data": {
    "assignedCount": 3,
    "assignments": [
      {
        "customerId": "228",
        "employeeId": "15",
        "assignedAt": "2026-02-05T10:30:00Z"
      },
      {
        "customerId": "229",
        "employeeId": "15",
        "assignedAt": "2026-02-05T10:30:00Z"
      },
      {
        "customerId": "230",
        "employeeId": "15",
        "assignedAt": "2026-02-05T10:30:00Z"
      }
    ]
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Response Fields:**
- `assignedCount` (number) - Number of customers successfully assigned
- `assignments` (array) - Array of successful assignment records
  - `customerId` (string) - ID of the assigned customer
  - `employeeId` (string) - ID of the employee who received the assignment
  - `assignedAt` (string) - ISO 8601 timestamp of when the assignment occurred

**Notes:**
- If a customer is already assigned to another employee, the assignment will be updated to the new employee
- If a customer ID doesn't exist, it will be skipped (not included in assignedCount)
- If the employee doesn't exist or is inactive, an error will be returned

---

## 5. Save Assignment Rules

**Endpoint:** `POST /api/v2/customers-hub/assignment/rules`

**Description:** Saves or updates assignment rules for employees. These rules are used by the auto-assign functionality to automatically match customers to employees.

**Request Body:**

```json
{
  "employeeRules": [
    {
      "employeeId": "15",
      "isActive": true,
      "rules": [
        {
          "id": "rule_1",
          "field": "budgetMin",
          "operator": "greaterThan",
          "value": "2000000"
        },
        {
          "id": "rule_2",
          "field": "city",
          "operator": "equals",
          "value": "الرياض"
        },
        {
          "id": "rule_3",
          "field": "propertyType",
          "operator": "equals",
          "value": "villa"
        }
      ]
    },
    {
      "employeeId": "22",
      "isActive": true,
      "rules": [
        {
          "id": "rule_4",
          "field": "source",
          "operator": "equals",
          "value": "website"
        },
        {
          "id": "rule_5",
          "field": "budgetMax",
          "operator": "lessThan",
          "value": "5000000"
        }
      ]
    },
    {
      "employeeId": "31",
      "isActive": false,
      "rules": []
    }
  ]
}
```

**Request Fields:**
- `employeeRules` (array) - Array of employee configuration objects
  - `employeeId` (string) - ID of the employee
  - `isActive` (boolean) - Whether this employee should receive assignments
  - `rules` (array) - Array of assignment rules for this employee
    - `id` (string) - Unique identifier for the rule (can be generated by backend if not provided)
    - `field` (string) - Field to match against. Options: `"budgetMin"`, `"budgetMax"`, `"propertyType"`, `"city"`, `"source"`
    - `operator` (string) - Comparison operator. Options: `"equals"`, `"greaterThan"`, `"lessThan"`, `"contains"`
    - `value` (string) - Value to compare against

**Field Mapping:**
- `budgetMin` - Maps to customer's minimum budget preference
- `budgetMax` - Maps to customer's maximum budget preference
- `propertyType` - Maps to customer's preferred property type (villa, apartment, land, commercial)
- `city` - Maps to customer's city preference
- `source` - Maps to customer's source (website, referral, whatsapp, manual, etc.)

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Assignment rules saved successfully",
  "data": {
    "savedCount": 3,
    "rules": [
      {
        "employeeId": "15",
        "isActive": true,
        "rules": [
          {
            "id": "rule_1",
            "field": "budgetMin",
            "operator": "greaterThan",
            "value": "2000000"
          },
          {
            "id": "rule_2",
            "field": "city",
            "operator": "equals",
            "value": "الرياض"
          },
          {
            "id": "rule_3",
            "field": "propertyType",
            "operator": "equals",
            "value": "villa"
          }
        ]
      },
      {
        "employeeId": "22",
        "isActive": true,
        "rules": [
          {
            "id": "rule_4",
            "field": "source",
            "operator": "equals",
            "value": "website"
          },
          {
            "id": "rule_5",
            "field": "budgetMax",
            "operator": "lessThan",
            "value": "5000000"
          }
        ]
      },
      {
        "employeeId": "31",
        "isActive": false,
        "rules": []
      }
    ]
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Response Fields:**
- `savedCount` (number) - Number of employee rule configurations saved
- `rules` (array) - Array of saved employee rule configurations (same structure as request)

**Notes:**
- This endpoint replaces all existing rules for the provided employees
- Rules for employees not included in the request remain unchanged
- Empty rules array removes all rules for that employee
- If an employee ID doesn't exist, it will be skipped

---

## 6. Get Assignment Rules

**Endpoint:** `GET /api/v2/customers-hub/assignment/rules`

**Description:** Retrieves all saved assignment rules for all employees.

**Request:** None (GET request)

**Response:**

```json
{
  "status": "success",
  "code": 200,
  "message": "Assignment rules retrieved successfully",
  "data": {
    "rules": [
      {
        "employeeId": "15",
        "isActive": true,
        "rules": [
          {
            "id": "rule_1",
            "field": "budgetMin",
            "operator": "greaterThan",
            "value": "2000000"
          },
          {
            "id": "rule_2",
            "field": "city",
            "operator": "equals",
            "value": "الرياض"
          }
        ]
      },
      {
        "employeeId": "22",
        "isActive": true,
        "rules": [
          {
            "id": "rule_4",
            "field": "source",
            "operator": "equals",
            "value": "website"
          }
        ]
      },
      {
        "employeeId": "31",
        "isActive": false,
        "rules": []
      }
    ]
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

**Response Fields:**
- `rules` (array) - Array of employee rule configurations
  - `employeeId` (string) - ID of the employee
  - `isActive` (boolean) - Whether this employee is active for assignments
  - `rules` (array) - Array of assignment rules for this employee
    - `id` (string) - Unique identifier for the rule
    - `field` (string) - Field to match against
    - `operator` (string) - Comparison operator
    - `value` (string) - Value to compare against

**Notes:**
- Returns rules for all employees, even if they have no rules configured
- If no rules exist, returns an empty array

---

## Error Responses

### Validation Error (422)

```json
{
  "status": "error",
  "code": 422,
  "message": "Validation failed",
  "errors": {
    "employeeId": ["The employee id field is required."],
    "employeeRules": ["The employee rules must be an array."],
    "customerIds": ["The customer ids field is required."]
  },
  "timestamp": "2026-02-05T10:30:00Z"
}
```

### Unauthorized Error (401)

```json
{
  "status": "error",
  "code": 401,
  "message": "Unauthenticated",
  "timestamp": "2026-02-05T10:30:00Z"
}
```

### Not Found Error (404)

```json
{
  "status": "error",
  "code": 404,
  "message": "Employee not found",
  "timestamp": "2026-02-05T10:30:00Z"
}
```

### Server Error (500)

```json
{
  "status": "error",
  "code": 500,
  "message": "Internal server error",
  "timestamp": "2026-02-05T10:30:00Z"
}
```

---

## Quick Reference

### Base URL
```
/api/v2/customers-hub/assignment
```

### Authentication Header
```
Authorization: Bearer {token}
```

### Content Type
```
Content-Type: application/json
Accept: application/json
```

### Date Format
All dates use ISO 8601 format with UTC timezone:
```
2026-02-05T10:30:00Z
```

---

## Implementation Notes

### Rule Operators

1. **`equals`** - Exact match (case-insensitive for strings)
   - Used for: `propertyType`, `city`, `source`
   - Example: `city equals "الرياض"`

2. **`greaterThan`** - Numeric greater than comparison
   - Used for: `budgetMin`
   - Example: `budgetMin greaterThan "2000000"`

3. **`lessThan`** - Numeric less than comparison
   - Used for: `budgetMax`
   - Example: `budgetMax lessThan "5000000"`

4. **`contains`** - String contains substring (case-insensitive)
   - Used for: `city`, `source`
   - Example: `city contains "رياض"`

### Assignment Priority

When multiple employees match a customer's criteria:
1. Employees with lower `loadPercentage` are prioritized
2. If load percentages are equal, employees with fewer total customers are prioritized
3. If still equal, the employee with the lowest ID is selected

### Capacity Management

- Employees cannot receive assignments if `customerCount >= maxCapacity`
- The `loadPercentage` is calculated as: `(customerCount / maxCapacity) * 100`
- Only active employees (`isActive: true`) receive assignments

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
