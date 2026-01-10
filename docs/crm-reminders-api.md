# CRM Reminders API Documentation

This document describes the API endpoints for managing CRM Reminder Types and Reminders.

## Base URL

All endpoints are prefixed with: `/api/crm`

## Authentication

All endpoints require authentication via Sanctum token. Include the token in the Authorization header:

```
Authorization: Bearer {your_token}
```

## Common Response Format

### Success Response

```json
{
  "status": "success",
  "message": "English message",
  "message_ar": "Arabic message",
  "data": { ... }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "English error message",
  "message_ar": "Arabic error message",
  "error_code": "ERROR_CODE",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

## Reminder Types Endpoints

Reminder Types are templates/categories for reminders (e.g., "Call", "Meeting", "Follow-up").

---

### 1. Create Reminder Type

**POST** `/api/crm/reminder-types`

Creates a new reminder type template.

#### Request Body

```json
{
  "name": "Follow-up Call",
  "name_ar": "مكالمة متابعة",
  "description": "Follow-up call reminder",
  "color": "#10b981",
  "icon": "Phone",
  "order": 1,
  "is_active": true
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Type name (max 255 chars, unique per user) |
| `name_ar` | string | No | Arabic name (max 255 chars) |
| `description` | string | No | Description text |
| `color` | string | No | Hex color code (e.g., #10b981 or #f00) |
| `icon` | string | No | Icon name (max 100 chars) |
| `order` | integer | No | Display order (default: 0) |
| `is_active` | boolean | No | Active status (default: true) |

#### Success Response (201)

```json
{
  "status": "success",
  "message": "Reminder type created successfully",
  "message_ar": "تم إنشاء نوع التذكير بنجاح",
  "data": {
    "id": 7,
    "user_id": 1037,
    "name": "Follow-up Call",
    "name_ar": "مكالمة متابعة",
    "description": "Follow-up call reminder",
    "color": "#10b981",
    "icon": "Phone",
    "order": 1,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z",
    "reminders_count": 0
  }
}
```

#### React Example

```javascript
const createReminderType = async (data) => {
  const response = await fetch('/api/crm/reminder-types', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  return result;
};

// Usage
const newType = await createReminderType({
  name: 'Follow-up Call',
  name_ar: 'مكالمة متابعة',
  color: '#10b981',
  icon: 'Phone',
  order: 1
});
```

---

### 2. Get All Reminder Types

**GET** `/api/crm/reminder-types`

Retrieves all reminder types with pagination and filtering.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `per_page` | integer | 50 | Items per page (max: 100) |
| `page` | integer | 1 | Page number |
| `search` | string | - | Search in name and name_ar |
| `is_active` | boolean | - | Filter by active status |

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Reminder types retrieved successfully",
  "message_ar": "تم استرجاع أنواع التذكير بنجاح",
  "data": {
    "reminder_types": [
      {
        "id": 7,
        "user_id": 1037,
        "name": "Follow-up Call",
        "name_ar": "مكالمة متابعة",
        "description": "Follow-up call reminder",
        "color": "#10b981",
        "icon": "Phone",
        "order": 1,
        "is_active": true,
        "created_at": "2024-01-15T10:30:00.000000Z",
        "updated_at": "2024-01-15T10:30:00.000000Z",
        "reminders_count": 15
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 50,
      "total": 1,
      "last_page": 1,
      "from": 1,
      "to": 1
    }
  }
}
```

#### React Example

```javascript
const getReminderTypes = async (filters = {}) => {
  const params = new URLSearchParams({
    per_page: filters.perPage || 50,
    page: filters.page || 1,
    ...(filters.search && { search: filters.search }),
    ...(filters.isActive !== undefined && { is_active: filters.isActive }),
  });
  
  const response = await fetch(`/api/crm/reminder-types?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  return result;
};

// Usage
const { data } = await getReminderTypes({
  perPage: 20,
  page: 1,
  search: 'Call',
  isActive: true
});
```

---

### 3. Get Single Reminder Type

**GET** `/api/crm/reminder-types/{id}`

Retrieves a single reminder type by ID.

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Reminder type retrieved successfully",
  "message_ar": "تم استرجاع نوع التذكير بنجاح",
  "data": {
    "id": 7,
    "user_id": 1037,
    "name": "Follow-up Call",
    "name_ar": "مكالمة متابعة",
    "description": "Follow-up call reminder",
    "color": "#10b981",
    "icon": "Phone",
    "order": 1,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z",
    "reminders_count": 15
  }
}
```

#### React Example

```javascript
const getReminderType = async (id) => {
  const response = await fetch(`/api/crm/reminder-types/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  return result;
};
```

---

### 4. Update Reminder Type

**PUT** `/api/crm/reminder-types/{id}`

Updates an existing reminder type. All fields are optional.

#### Request Body

```json
{
  "name": "Updated Name",
  "name_ar": "اسم محدث",
  "description": "Updated description",
  "color": "#ef4444",
  "icon": "Calendar",
  "order": 2,
  "is_active": false
}
```

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Reminder type updated successfully",
  "message_ar": "تم تحديث نوع التذكير بنجاح",
  "data": {
    "id": 7,
    "user_id": 1037,
    "name": "Updated Name",
    "name_ar": "اسم محدث",
    "description": "Updated description",
    "color": "#ef4444",
    "icon": "Calendar",
    "order": 2,
    "is_active": false,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T11:00:00.000000Z",
    "reminders_count": 15
  }
}
```

#### React Example

```javascript
const updateReminderType = async (id, data) => {
  const response = await fetch(`/api/crm/reminder-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  return result;
};
```

---

### 5. Delete Reminder Type

**DELETE** `/api/crm/reminder-types/{id}`

Deletes a reminder type. Cannot delete if there are reminders using this type.

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Reminder type deleted successfully",
  "message_ar": "تم حذف نوع التذكير بنجاح",
  "data": null
}
```

#### Error Response (422) - Type in Use

```json
{
  "status": "error",
  "message": "Cannot delete reminder type. There are active reminders using this type. Please delete or update those reminders first.",
  "message_ar": "لا يمكن حذف نوع التذكير. هناك تذكيرات نشطة تستخدم هذا النوع. يرجى حذف أو تحديث تلك التذكيرات أولاً",
  "error_code": "REMINDER_TYPE_IN_USE"
}
```

#### React Example

```javascript
const deleteReminderType = async (id) => {
  const response = await fetch(`/api/crm/reminder-types/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  return result;
};
```

---

## Reminders Endpoints

Reminders are actual reminder instances linked to customers and reminder types.

---

### 6. Create Reminder

**POST** `/api/crm/reminders`

Creates a new reminder.

#### Request Body

```json
{
  "customer_id": 2081,
  "reminder_type_id": 7,
  "title": "Follow up with customer",
  "description": "Call customer to discuss property details",
  "datetime": "2026-11-11 11:11:00",
  "priority": 2,
  "notes": "Customer prefers morning calls"
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer_id` | integer | Yes | Customer ID (must belong to user) |
| `reminder_type_id` | integer | Yes | Reminder type ID (must be active and belong to user) |
| `title` | string | Yes | Reminder title (max 255 chars) |
| `description` | string | No | Description text |
| `datetime` | string | Yes | Date and time in format: `Y-m-d H:i:s` (must be future) |
| `priority` | integer | No | Priority: 0=Low, 1=Medium, 2=High (default: 1) |
| `notes` | string | No | Additional notes |

#### Success Response (201)

```json
{
  "status": "success",
  "message": "Reminder created successfully",
  "message_ar": "تم إنشاء التذكير بنجاح",
  "data": {
    "id": 123,
    "user_id": 1037,
    "customer_id": 2081,
    "reminder_type_id": 7,
    "reminder_type": {
      "id": 7,
      "user_id": 1037,
      "name": "Follow-up Call",
      "name_ar": "مكالمة متابعة",
      "description": "Follow-up call reminder",
      "color": "#10b981",
      "icon": "Phone",
      "order": 1,
      "is_active": true,
      "created_at": "2024-01-15T09:00:00.000000Z",
      "updated_at": "2024-01-15T09:00:00.000000Z"
    },
    "customer": {
      "id": 2081,
      "name": "Ahmed Ali",
      "name_ar": null,
      "phone_number": "+966501234567",
      "email": "ahmed@example.com",
      "city": "Riyadh",
      "district": "Al Olaya",
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    },
    "title": "Follow up with customer",
    "description": "Call customer to discuss property details",
    "datetime": "2026-11-11 11:11:00",
    "priority": 2,
    "priority_label": "High",
    "priority_label_ar": "عالية",
    "status": "pending",
    "status_label": "Pending",
    "status_label_ar": "قيد الانتظار",
    "notes": "Customer prefers morning calls",
    "is_overdue": false,
    "days_until_due": 665,
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

#### React Example

```javascript
const createReminder = async (data) => {
  const response = await fetch('/api/crm/reminders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  return result;
};

// Usage
const newReminder = await createReminder({
  customer_id: 2081,
  reminder_type_id: 7,
  title: 'Follow up with customer',
  description: 'Call customer to discuss property details',
  datetime: '2026-11-11 11:11:00',
  priority: 2,
  notes: 'Customer prefers morning calls'
});
```

---

### 7. Get All Reminders

**GET** `/api/crm/reminders`

Retrieves all reminders with pagination and filtering.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `per_page` | integer | Items per page (default: 50, max: 100) |
| `page` | integer | Page number (default: 1) |
| `customer_id` | integer | Filter by customer |
| `reminder_type_id` | integer | Filter by reminder type |
| `status` | string | Filter by status: `pending`, `completed`, `overdue`, `cancelled` |
| `priority` | integer | Filter by priority: `0`, `1`, `2` |
| `date_from` | date | Filter from date (format: `Y-m-d`) |
| `date_to` | date | Filter to date (format: `Y-m-d`) |
| `search` | string | Search in title, description, customer name |

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Reminders retrieved successfully",
  "message_ar": "تم استرجاع التذكيرات بنجاح",
  "data": {
    "reminders": [
      {
        "id": 123,
        "user_id": 1037,
        "customer_id": 2081,
        "reminder_type_id": 7,
        "reminder_type": {
          "id": 7,
          "user_id": 1037,
          "name": "Follow-up Call",
          "name_ar": "مكالمة متابعة",
          "description": "Follow-up call reminder",
          "color": "#10b981",
          "icon": "Phone",
          "order": 1,
          "is_active": true,
          "created_at": "2024-01-15T09:00:00.000000Z",
          "updated_at": "2024-01-15T09:00:00.000000Z"
        },
        "customer": {
          "id": 2081,
          "name": "Ahmed Ali",
          "name_ar": null,
          "phone_number": "+966501234567",
          "email": "ahmed@example.com",
          "city": "Riyadh",
          "district": "Al Olaya",
          "created_at": "2024-01-01T00:00:00.000000Z",
          "updated_at": "2024-01-01T00:00:00.000000Z"
        },
        "title": "Follow up with customer",
        "description": "Call customer to discuss property details",
        "datetime": "2026-11-11 11:11:00",
        "priority": 2,
        "priority_label": "High",
        "priority_label_ar": "عالية",
        "status": "pending",
        "status_label": "Pending",
        "status_label_ar": "قيد الانتظار",
        "notes": "Customer prefers morning calls",
        "is_overdue": false,
        "days_until_due": 665,
        "created_at": "2024-01-15T10:30:00.000000Z",
        "updated_at": "2024-01-15T10:30:00.000000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 50,
      "total": 100,
      "last_page": 2,
      "from": 1,
      "to": 50
    }
  }
}
```

#### React Example

```javascript
const getReminders = async (filters = {}) => {
  const params = new URLSearchParams({
    per_page: filters.perPage || 50,
    page: filters.page || 1,
    ...(filters.customerId && { customer_id: filters.customerId }),
    ...(filters.reminderTypeId && { reminder_type_id: filters.reminderTypeId }),
    ...(filters.status && { status: filters.status }),
    ...(filters.priority !== undefined && { priority: filters.priority }),
    ...(filters.dateFrom && { date_from: filters.dateFrom }),
    ...(filters.dateTo && { date_to: filters.dateTo }),
    ...(filters.search && { search: filters.search }),
  });
  
  const response = await fetch(`/api/crm/reminders?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  return result;
};

// Usage
const { data } = await getReminders({
  perPage: 20,
  page: 1,
  status: 'pending',
  priority: 2,
  dateFrom: '2026-01-01',
  dateTo: '2026-12-31',
  search: 'customer'
});
```

---

### 8. Get Single Reminder

**GET** `/api/crm/reminders/{id}`

Retrieves a single reminder by ID.

#### Success Response (200)

Same format as reminder in the list response.

#### React Example

```javascript
const getReminder = async (id) => {
  const response = await fetch(`/api/crm/reminders/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  return result;
};
```

---

### 9. Update Reminder

**PUT** `/api/crm/reminders/{id}`

Updates an existing reminder. All fields are optional.

#### Request Body

```json
{
  "customer_id": 2082,
  "reminder_type_id": 8,
  "title": "Updated reminder title",
  "description": "Updated description",
  "datetime": "2026-12-12 14:00:00",
  "priority": 1,
  "status": "completed",
  "notes": "Updated notes"
}
```

#### Success Response (200)

Same format as create reminder response.

#### React Example

```javascript
const updateReminder = async (id, data) => {
  const response = await fetch(`/api/crm/reminders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  const result = await response.json();
  return result;
};

// Usage - Mark reminder as completed
await updateReminder(123, {
  status: 'completed'
});
```

---

### 10. Delete Reminder

**DELETE** `/api/crm/reminders/{id}`

Deletes a reminder (soft delete).

#### Success Response (200)

```json
{
  "status": "success",
  "message": "Reminder deleted successfully",
  "message_ar": "تم حذف التذكير بنجاح",
  "data": null
}
```

#### React Example

```javascript
const deleteReminder = async (id) => {
  const response = await fetch(`/api/crm/reminders/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const result = await response.json();
  return result;
};
```

---

## Error Handling

### Common Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required |
| `AUTH_INVALID` | 401 | Invalid or expired token |
| `FORBIDDEN` | 403 | No permission to access resource |
| `RESOURCE_OWNERSHIP` | 403 | Resource doesn't belong to user |
| `VALIDATION_FAILED` | 422 | Validation errors |
| `REMINDER_TYPE_NOT_FOUND` | 404 | Reminder type not found |
| `REMINDER_NOT_FOUND` | 404 | Reminder not found |
| `CUSTOMER_NOT_FOUND` | 404 | Customer not found |
| `REMINDER_TYPE_IN_USE` | 422 | Cannot delete/deactivate type in use |
| `REMINDER_TYPE_INACTIVE` | 422 | Reminder type is inactive |
| `INVALID_CUSTOMER` | 422 | Customer doesn't exist or doesn't belong to user |
| `INVALID_REMINDER_TYPE` | 422 | Reminder type doesn't exist or doesn't belong to user |
| `PAST_DATETIME` | 422 | Datetime must be in future |
| `DUPLICATE_NAME` | 422 | Reminder type name already exists |
| `DATABASE_ERROR` | 500 | Database connection error |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

### Example Error Responses

#### Validation Error (422)

```json
{
  "status": "error",
  "message": "Validation failed",
  "message_ar": "فشل التحقق من صحة البيانات",
  "error_code": "VALIDATION_FAILED",
  "errors": {
    "customer_id": [
      "The customer ID field is required."
    ],
    "datetime": [
      "The reminder datetime must be a future date and time."
    ]
  }
}
```

#### Not Found Error (404)

```json
{
  "status": "error",
  "message": "Reminder not found.",
  "message_ar": "التذكير غير موجود",
  "error_code": "REMINDER_NOT_FOUND"
}
```

#### Business Logic Error (422)

```json
{
  "status": "error",
  "message": "Cannot delete reminder type. There are active reminders using this type. Please delete or update those reminders first.",
  "message_ar": "لا يمكن حذف نوع التذكير. هناك تذكيرات نشطة تستخدم هذا النوع. يرجى حذف أو تحديث تلك التذكيرات أولاً",
  "error_code": "REMINDER_TYPE_IN_USE"
}
```

---

## React Hook Examples

### Custom Hook for Reminder Types

```javascript
import { useState, useEffect } from 'react';

const useReminderTypes = (filters = {}) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          per_page: filters.perPage || 50,
          page: filters.page || 1,
          ...(filters.search && { search: filters.search }),
          ...(filters.isActive !== undefined && { is_active: filters.isActive }),
        });

        const response = await fetch(`/api/crm/reminder-types?${params}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        });

        const result = await response.json();
        
        if (result.status === 'success') {
          setTypes(result.data.reminder_types);
          setPagination(result.data.pagination);
          setError(null);
        } else {
          setError(result);
        }
      } catch (err) {
        setError({ message: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, [filters.perPage, filters.page, filters.search, filters.isActive]);

  return { types, loading, pagination, error };
};
```

### Custom Hook for Reminders

```javascript
import { useState, useEffect } from 'react';

const useReminders = (filters = {}) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          per_page: filters.perPage || 50,
          page: filters.page || 1,
          ...(filters.customerId && { customer_id: filters.customerId }),
          ...(filters.reminderTypeId && { reminder_type_id: filters.reminderTypeId }),
          ...(filters.status && { status: filters.status }),
          ...(filters.priority !== undefined && { priority: filters.priority }),
          ...(filters.dateFrom && { date_from: filters.dateFrom }),
          ...(filters.dateTo && { date_to: filters.dateTo }),
          ...(filters.search && { search: filters.search }),
        });

        const response = await fetch(`/api/crm/reminders?${params}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
          },
        });

        const result = await response.json();
        
        if (result.status === 'success') {
          setReminders(result.data.reminders);
          setPagination(result.data.pagination);
          setError(null);
        } else {
          setError(result);
        }
      } catch (err) {
        setError({ message: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [
    filters.perPage,
    filters.page,
    filters.customerId,
    filters.reminderTypeId,
    filters.status,
    filters.priority,
    filters.dateFrom,
    filters.dateTo,
    filters.search,
  ]);

  return { reminders, loading, pagination, error };
};
```

### Usage in Component

```javascript
import React from 'react';
import { useReminders } from './hooks/useReminders';

const RemindersList = () => {
  const [filters, setFilters] = useState({
    status: 'pending',
    perPage: 20,
    page: 1,
  });

  const { reminders, loading, pagination, error } = useReminders(filters);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Reminders</h1>
      {reminders.map(reminder => (
        <div key={reminder.id}>
          <h3>{reminder.title}</h3>
          <p>Customer: {reminder.customer.name}</p>
          <p>Type: {reminder.reminder_type.name}</p>
          <p>Date: {reminder.datetime}</p>
          <p>Status: {reminder.status_label}</p>
          <p>Priority: {reminder.priority_label}</p>
          {reminder.is_overdue && <span>Overdue!</span>}
        </div>
      ))}
      
      {pagination && (
        <div>
          <button 
            disabled={pagination.current_page === 1}
            onClick={() => setFilters({...filters, page: filters.page - 1})}
          >
            Previous
          </button>
          <span>Page {pagination.current_page} of {pagination.last_page}</span>
          <button 
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => setFilters({...filters, page: filters.page + 1})}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
```

---

## Priority and Status Values

### Priority

| Value | Label (EN) | Label (AR) |
|-------|------------|------------|
| `0` | Low | منخفضة |
| `1` | Medium | متوسطة |
| `2` | High | عالية |

### Status

| Value | Label (EN) | Label (AR) |
|-------|------------|------------|
| `pending` | Pending | قيد الانتظار |
| `completed` | Completed | مكتمل |
| `overdue` | Overdue | متأخر |
| `cancelled` | Cancelled | ملغي |

---

## Notes

1. **Datetime Format**: Always use `Y-m-d H:i:s` format (e.g., `2026-11-11 11:11:00`)
2. **Auto-Overdue**: Reminders with past datetime and `pending` status are automatically marked as `overdue` when fetched
3. **Calculated Fields**: `is_overdue` and `days_until_due` are automatically calculated based on current datetime
4. **Soft Deletes**: Deleted reminders and reminder types are soft-deleted and can be restored
5. **Ownership**: All resources are scoped to the authenticated user's tenant
6. **Pagination**: Maximum `per_page` is 100
