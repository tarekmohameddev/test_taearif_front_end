# Backend Prompt - Fix Notes Retrieval for Property Requests and Inquiries

**Issue:** Notes are being added successfully but not returned in GET response.

**Current Behavior:**
1. POST `/v2/customers-hub/requests/property_request_43/notes` with body `{"note": "hey", "addedBy": "1430"}` returns success.
2. GET `/v2/customers-hub/requests/property_request_43` does not include the added notes in response.

**Problem:** Either notes are not being saved correctly, or they are not being fetched from the correct location in the GET endpoint.

**Required Fix:**
- Investigate the POST endpoint: verify notes are saved to `crm_hub_notes` table (polymorphic relationship) for both `property_request_{id}` and `inquiry_{id}`.
- Update GET endpoint `/v2/customers-hub/requests/{requestId}` to include `notes` array in response.
- Notes should be returned as array of objects with fields: `id`, `note`, `addedBy`, `createdAt`, etc.

**Expected Response Structure:**
```json
{
  "status": "success",
  "data": {
    "action": {
      "id": "property_request_43",
      // ... other fields ...
      "notes": [
        {
          "id": 1,
          "note": "hey",
          "addedBy": "1430",
          "createdAt": "2026-02-18T03:22:03+03:00"
        }
      ]
    }
  }
}
```

**Test Cases:**
- Add note to property request → GET should return it
- Add note to inquiry → GET should return it
- Multiple notes should all be returned in chronological order
