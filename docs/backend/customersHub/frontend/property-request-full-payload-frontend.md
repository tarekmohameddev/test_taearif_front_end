# Property Request Full Payload (V2 Frontend)

**Audience:** Frontend (React) and AI agents.

**Base path:** `/api/v2/customers-hub/requests`

**Auth:** Required (Bearer token).

---

## 1. Endpoint

**GET** `/api/v2/customers-hub/requests/{requestId}`

- Use composite id format: `property_request_{id}` (example: `property_request_123`).
- For property requests, response now returns:
  - existing action keys,
  - all `users_property_requests` columns (snake_case),
  - normalized fields (stage, priority, status, city, budgets, assignee, appointments/reminders, metadata).
- Non-property request ids keep existing response behavior.

---

## 2. Example Request

```http
GET /api/v2/customers-hub/requests/property_request_123
Authorization: Bearer <token>
Accept: application/json
```

```javascript
const requestId = 'property_request_123';
const res = await fetch(`/api/v2/customers-hub/requests/${requestId}`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  },
});
const json = await res.json();
```

---

## 3. Success Response (200)

```json
{
  "status": "success",
  "data": {
    "action": {
      "id": "property_request_123",
      "objectType": "property_request",
      "sourceTable": "users_property_requests",
      "sourceId": 123,

      "customerId": 88,
      "customerName": "Ahmed Ali",
      "customerPhone": "+966501234567",
      "type": "property_match",
      "title": "عقار مطابق: Ahmed Ali",
      "description": "Customer note",
      "source": "website",

      "area_from": 120,
      "area_to": 180,
      "budget_from": 150000,
      "budget_to": 350000,
      "category_id": 7,
      "city_id": 3,
      "contact_on_whatsapp": true,
      "created_at": "2026-02-17T05:00:00.000000Z",
      "districts_id": 21,
      "full_name": "Ahmed Ali",
      "is_active": 1,
      "is_archived": 0,
      "is_read": 1,
      "neighborhoods": null,
      "notes": "Customer note",
      "phone": "+966501234567",
      "property_type": "سكني",
      "purchase_goal": null,
      "purchase_method": null,
      "purpose": "sale",
      "region": "الرياض",
      "seriousness": "مستعد فورًا",
      "status_id": 2,
      "updated_at": "2026-02-17T05:00:00.000000Z",
      "user_id": 10,
      "wants_similar_offers": 0,

      "stage_id": 2,
      "stage": {
        "id": 2,
        "nameAr": "متابعة",
        "nameEn": "Follow Up"
      },
      "priority": "urgent",
      "status": "in_progress",
      "propertyCategory": "فيلا",
      "propertyType": "سكني",
      "city": "الرياض",
      "state": "الرياض",
      "budgetMin": 150000,
      "budgetMax": 350000,
      "assignedTo": 31,
      "assignedToName": "Sara Mohammed",
      "completedAt": null,
      "completedBy": null,
      "snoozedUntil": null,
      "dueDate": null,
      "appointments": [
        {
          "id": 501,
          "title": "Show Apt",
          "type": "office_meeting",
          "datetime": "2026-02-18T08:00:00+00:00",
          "duration": 60,
          "status": "scheduled",
          "priority": "medium",
          "notes": null,
          "createdAt": "2026-02-17T05:00:00+00:00"
        }
      ],
      "reminders": [
        {
          "id": 701,
          "title": "Follow up",
          "description": "Call customer",
          "datetime": "2026-02-18T08:00:00+00:00",
          "priority": "high",
          "type": "follow_up",
          "status": "pending",
          "notes": null,
          "isOverdue": false,
          "daysUntilDue": 1,
          "createdAt": "2026-02-17T05:00:00+00:00"
        }
      ],
      "metadata": {
        "propertyRequestId": 123,
        "propertyType": "سكني",
        "propertyCategory": 7,
        "budgetFrom": 150000,
        "budgetTo": 350000,
        "purpose": "sale",
        "seriousness": "مستعد فورًا"
      }
    },
    "related": []
  }
}
```

---

## 4. Error Responses

### 401 Unauthorized

```json
{
  "message": "Unauthenticated."
}
```

### 404 Not Found (invalid/cross-tenant/inactive property request)

```json
{
  "status": "error",
  "message": "Action not found",
  "errors": null
}
```

---

## 5. Frontend Notes

- Keep using `data.action` and `data.related` (no envelope change).
- Use `action.id` (composite id) for UI routing and follow-up actions.
- Prefer normalized fields for UI cards:
  - `priority`, `status`, `stage`, `city`, `state`, `budgetMin`, `budgetMax`, `assignedToName`.
- Raw snake_case table columns are included for full-detail screens and debugging.
