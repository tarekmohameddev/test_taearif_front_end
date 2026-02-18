# Property Request and Inquiry Appointments and Reminders (V2 Frontend)

**Audience:** Frontend (React) and AI agents. Use this document to create and display appointments and reminders linked to a **property request** or an **inquiry** in the Customers Hub.

**Base path:** `/api/v2/customers-hub/requests` (prefix with your API base URL).

**Auth:** Required. Send Bearer token (tenant or employee) as per your app.

---

## 1. Create appointment for a property request or inquiry

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}/appointments`

`{requestId}` must be the **composite id** of a property request (e.g. `property_request_89`) or an inquiry (e.g. `inquiry_17`), not the numeric id alone.

### 1.1 Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | `site_visit` \| `office_meeting` \| `phone_call` \| `video_call` \| `contract_signing` \| `other` |
| `datetime` | string | Yes | ISO 8601 datetime; must be **in the future** |
| `duration` | number | No | Duration in minutes (default 30); min 1 |
| `notes` | string | No | Optional notes |
| `title` | string | No | Optional; if omitted, backend sets e.g. "معاينة عقار" for site_visit, "موعد طلب عقار" otherwise |
| `priority` | string | No | `low` \| `medium` \| `high` \| `urgent` (default medium) |

### 1.2 Example request

```json
{
  "type": "site_visit",
  "datetime": "2024-01-25T10:00:00Z",
  "duration": 30,
  "notes": "معاينة الوحدة 3",
  "title": "معاينة عقار"
}
```

```javascript
const requestId = 'property_request_89'; // from action.id
const response = await fetch(`/api/v2/customers-hub/requests/${requestId}/appointments`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    type: 'site_visit',
    datetime: '2024-01-25T10:00:00Z',
    duration: 30,
    notes: 'معاينة الوحدة 3',
    title: 'معاينة عقار',
  }),
});
const json = await response.json();
```

### 1.3 Success response (201)

```json
{
  "success": true,
  "data": {
    "appointment": {
      "id": 123,
      "requestId": "property_request_89",
      "customerId": null,
      "title": "معاينة عقار",
      "type": "site_visit",
      "datetime": "2024-01-25T10:00:00Z",
      "duration": 30,
      "status": "scheduled",
      "priority": "medium",
      "notes": "معاينة الوحدة 3",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

---

## 2. Create reminder for a property request or inquiry

**Endpoint:** `POST /api/v2/customers-hub/requests/{requestId}/reminders`

`{requestId}` must be the composite id of a property request (e.g. `property_request_89`) or an inquiry (e.g. `inquiry_17`).

### 2.1 Request body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Reminder title (e.g. "متابعة طلب العقار") |
| `description` | string | No | Optional description |
| `datetime` | string | Yes | ISO 8601 datetime; must be **in the future** |
| `priority` | string | Yes | `low` \| `medium` \| `high` \| `urgent` |
| `type` | string | Yes | `follow_up` \| `payment_due` \| `document_required` \| `other` |
| `notes` | string | No | Optional notes |

### 2.2 Example request

```json
{
  "title": "متابعة طلب العقار",
  "description": "اتصال بالمستأجر",
  "datetime": "2024-01-25T10:00:00Z",
  "priority": "high",
  "type": "follow_up",
  "notes": ""
}
```

```javascript
const requestId = 'property_request_89';
const response = await fetch(`/api/v2/customers-hub/requests/${requestId}/reminders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    title: 'متابعة طلب العقار',
    description: 'اتصال بالمستأجر',
    datetime: '2024-01-25T10:00:00Z',
    priority: 'high',
    type: 'follow_up',
  }),
});
const json = await response.json();
```

### 2.3 Success response (201)

```json
{
  "success": true,
  "data": {
    "reminder": {
      "id": 456,
      "requestId": "property_request_89",
      "customerId": null,
      "title": "متابعة طلب العقار",
      "description": "اتصال بالمستأجر",
      "datetime": "2024-01-25T10:00:00Z",
      "priority": "high",
      "type": "follow_up",
      "status": "pending",
      "notes": "",
      "isOverdue": false,
      "daysUntilDue": 5,
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

---

## 3. List and single request: appointments and reminders

When you call:

- **`POST /api/v2/customers-hub/requests/list`** — each item in `data.actions` has `appointments` and `reminders`.
- **`GET /api/v2/customers-hub/requests/{requestId}`** — `data.action` has `appointments` and `reminders`.

**For `objectType === 'property_request'`** the arrays are populated from `property_request_appointments` and `property_request_reminders`. **For `objectType === 'inquiry'`** they are populated from `inquiry_appointments` and `inquiry_reminders`. For `reminder`, `request_appointment`, and `request_reminder`, the action row is not a request/inquiry, so `appointments` and `reminders` are **empty arrays** `[]`. Note: actions with `objectType` `request_appointment` or `request_reminder` are the appointment/reminder row itself (they do not have nested `appointments`/`reminders` arrays).

### 3.1 Action object (extra fields)

For every action in the list or in the single-request response:

| Field | Type | Description |
|-------|------|-------------|
| `appointments` | array | For **property_request** or **inquiry**: array of appointment objects (see below). Otherwise `[]`. |
| `reminders` | array | For **property_request** or **inquiry**: array of reminder objects (see below). Otherwise `[]`. |

### 3.2 Appointment object (inside `appointments[]`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Appointment id |
| `title` | string | |
| `type` | string | site_visit, office_meeting, phone_call, video_call, contract_signing, other |
| `datetime` | string | ISO 8601 |
| `duration` | number | Minutes |
| `status` | string | scheduled, completed, cancelled, no_show |
| `priority` | string | low, medium, high, urgent |
| `notes` | string \| null | |
| `createdAt` | string | ISO 8601 |

### 3.3 Reminder object (inside `reminders[]`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Reminder id |
| `title` | string | |
| `description` | string \| null | |
| `datetime` | string | ISO 8601 |
| `priority` | string | low, medium, high, urgent |
| `type` | string | follow_up, payment_due, document_required, other |
| `status` | string | pending, completed, cancelled |
| `notes` | string \| null | |
| `isOverdue` | boolean | true if datetime is in the past |
| `daysUntilDue` | number | Days until datetime (0 when overdue) |
| `createdAt` | string | ISO 8601 |

### 3.4 Example list item (property_request with children)

```json
{
  "id": "property_request_89",
  "objectType": "property_request",
  "customerName": "samy smsm",
  "title": "عقار مطابق: samy smsm",
  "status": "pending",
  "appointments": [
    {
      "id": 123,
      "title": "معاينة عقار",
      "type": "site_visit",
      "datetime": "2024-01-25T10:00:00Z",
      "duration": 30,
      "status": "scheduled",
      "priority": "medium",
      "notes": "string",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ],
  "reminders": [
    {
      "id": 456,
      "title": "متابعة طلب العقار",
      "description": "string",
      "datetime": "2024-01-25T10:00:00Z",
      "priority": "high",
      "type": "follow_up",
      "status": "pending",
      "isOverdue": false,
      "daysUntilDue": 5,
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

## 4. Error handling

### 4.1 Property request not found (404)

When `{requestId}` is invalid, not a property request, or the property request does not belong to the tenant:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST_ID",
    "message": "Property request not found",
    "message_ar": "طلب العقار غير موجود"
  }
}
```

**When you get this:** Ensure you are using the **composite id** (e.g. `property_request_89`) from `action.id`, and that the action exists and is of type property request.

### 4.2 Datetime in the past (422)

When `datetime` is not in the future on create appointment or create reminder:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATETIME",
    "message": "Datetime must be in the future",
    "message_ar": "التاريخ والوقت يجب أن يكون في المستقبل"
  }
}
```

**When you get this:** Validate on the client that the chosen date/time is after now, or surface this message to the user.

### 4.3 Other validation errors (422)

Laravel validation (e.g. invalid `type`, missing required field) returns the usual 422 format with `message` and optionally `errors` object. Check response body for field-level errors.

---

## 5. Quick reference

- **Create appointment:** `POST .../requests/{requestId}/appointments` — body: `type`, `datetime` (future), optional `duration`, `title`, `notes`, `priority`.
- **Create reminder:** `POST .../requests/{requestId}/reminders` — body: `title`, `datetime` (future), `priority`, `type`, optional `description`, `notes`.
- **List / show:** Every action has `appointments` and `reminders`; non-empty for `objectType === 'property_request'` or `objectType === 'inquiry'`.
- **requestId:** Always use the composite id (e.g. `property_request_89`, `inquiry_17`) from `action.id`, not the numeric id alone.
