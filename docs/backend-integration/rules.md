# Backend Integration Rules & Guidelines

## 🎯 Purpose

**MANDATORY rules** for implementing Customers Hub backend API. Central reference for connecting API specifications with **existing database schemas** (`docs/ExcessFiles/test_big_schema.sql`) while ensuring **zero conflicts** with legacy systems.

**Target:** Backend developers and AI systems (Cursor AI)

---

## 📚 Document Structure

- **`rules.md`** (this file) - Central rules ⭐
- **`README.md`** - Quick start guide
- **`api/`** - API specifications (requests, list, analytics, pipeline, detail)
- **`database/`** - Database integration guides
- **`guides/`** - Additional integration notes

---

## 🔴 CRITICAL RULES

### Rule 1: Database Schema Compatibility

**MANDATORY:** Work with **existing schemas** in `docs/ExcessFiles/test_big_schema.sql` with **modifications allowed** but **NO conflicts**.

**Requirements:**
- ✅ **NO breaking changes** to legacy tables (no rename/delete columns, no type changes)
- ✅ **NULL values allowed** - Missing data expected, handle gracefully
- ✅ **Backward compatible** - Existing queries must continue working

**Allowed:**
- ✅ Add new columns (with DEFAULT values)
- ✅ Create new tables/indexes
- ✅ Create views (prefer queries)

**Forbidden:**
- ❌ Rename/delete existing columns
- ❌ Change column types/constraints
- ❌ Break existing foreign keys

---

### Rule 2: Data Mapping Strategy

**MANDATORY:** Use mapping tables to convert legacy data to API format.

**Process:**
1. Read table structure from `test_big_schema.sql`
2. Use mapping tables in `database/customers-hub-requests-database-integration.md`
3. Map legacy fields → API requirements
4. Handle NULL gracefully (return NULL, don't throw errors)
5. Use UNION ALL to combine multiple legacy tables

**Examples:**
- `api_customer_inquiry.is_read = 0` → `status = 'pending'`
- `api_customer_inquiry.is_read = 1` → `status = 'in_progress'`
- `reminders.priority = 2` → `priority = 'high'`

---

### Rule 3: Tenant Isolation

**MANDATORY:** ALL queries MUST filter by `user_id` (tenant ID) first.

```sql
-- ✅ CORRECT
WHERE user_id = ? AND ...

-- ❌ WRONG
WHERE customer_id = ?  -- Missing user_id
```

**Always:** Filter by `user_id`, validate from authenticated session.

---

### Rule 4: Performance Requirements

**MANDATORY:** System handles **50+ million requests**, **20+ million customers**.

**Requirements:**
- ⚠️ **NO CACHING** - All queries hit database directly
- ⚠️ **Response targets:** Details < 100ms, Lists < 150ms, Stats < 200ms
- ⚠️ **Mandatory indexes** - See database integration docs
- ⚠️ **Pagination:** Max limit 100, default 50, max offset 1M

**Allowed:** Database indexes, materialized views (NOT caching), read replicas, connection pooling

**Forbidden:** Application caching (Redis/Memcached), HTTP caching, query result caching

---

### Rule 5: API Design Standards

**MANDATORY:** RESTful with consolidated endpoints.

**Read (GET):**
- ✅ Single GET returns all data (customer + tasks + properties + preferences)
- ✅ Query params for optional filters: `?includeTasks=false`
- ✅ Default: Return all if no params

**Write:**
- ✅ POST (create), PUT (update), DELETE (delete)
- ✅ Resource IDs in URL: `/api/v2/customers-hub/customers/{customerId}/tasks/{taskId}`

**Filters:**
- ✅ All filters in POST request body (NOT query params)
- ✅ Filter changes trigger new request with all current filters

---

### Rule 6: Error Handling & Formats

**Error Format:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

**Common Codes:** `CUSTOMER_NOT_FOUND`, `ACTION_NOT_FOUND`, `INVALID_FILTERS`, `UNAUTHORIZED`, `QUERY_TIMEOUT`

**NULL Values:** ✅ Return NULL for missing optional fields, ❌ Don't throw errors

**Date Format:** ISO 8601 UTC: `YYYY-MM-DDTHH:mm:ssZ` (e.g., `2024-01-15T10:30:00Z`)

**Action ID Format:** `{source_table}_{id}` (e.g., `inquiry_123`, `property_request_456`)

---

## 📖 Implementation Workflow

1. **Read Database Schema:** `docs/ExcessFiles/test_big_schema.sql` - Identify tables, note missing fields
2. **Read API Spec:** Relevant file in `api/` folder - Understand request/response formats
3. **Read DB Integration:** `database/customers-hub-requests-database-integration.md` - Review mapping tables, SQL examples
4. **Implement:** Write UNION ALL queries, map legacy fields, handle NULL, filter by `user_id`, add indexes, test, optimize

---

## 🔗 Document References

**Requests:** `api/requests/` + `database/customers-hub-requests-database-integration.md`  
**List:** `api/list/` + Same database tables  
**Analytics:** `api/analytics/` + Aggregate queries  
**Pipeline:** `api/pipeline/` + `api_customers.stage_id`  
**Detail:** `api/detail/` + Single customer queries

---

## ✅ Verification Checklist

- [ ] Filter by `user_id` (tenant isolation)
- [ ] NULL values handled gracefully
- [ ] Required indexes created
- [ ] Response times meet targets
- [ ] No schema modifications to legacy tables
- [ ] Error handling implemented
- [ ] Dates in ISO 8601 format
- [ ] Action IDs properly prefixed
- [ ] Tested with real data

---

## 🚨 Common Pitfalls

**❌ Missing tenant filter:** `WHERE id = ?` → **✅ Always:** `WHERE user_id = ? AND id = ?`  
**❌ Throwing errors for NULL:** `if (!whatsapp) throw Error` → **✅ Return:** `whatsapp: customer.whatsapp || null`  
**❌ Modifying legacy tables:** `DROP COLUMN` → **✅ Add new:** `ADD COLUMN ... DEFAULT NULL`  
**❌ Using caching:** `redis.get()` → **✅ Query directly:** `db.query()`

---

## 📞 Quick Reference

**Schema:** `docs/ExcessFiles/test_big_schema.sql`  
**Main Tables:** `api_customers`, `api_customer_inquiry`, `users_property_requests`, `reminders`, `users_api_customers_appointments`  
**Key Fields:** `user_id` (ALWAYS filter), `customer_id`, `created_at`, `is_read`, `is_archived`  
**Response:** Success: `{ "success": true, "data": {...} }`, Error: `{ "success": false, "error": {...} }`

---

**Last Updated:** 2026-02-04 | **Version:** 1.0
