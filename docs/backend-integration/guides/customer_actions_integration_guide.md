# Customer Actions Integration Guide

## Overview

This guide explains how to integrate the Customers Hub Requests API with the existing database schema **without modifying legacy tables**. This document provides specifications for backend developers to implement the API using SQL queries that combine data from multiple legacy tables.

**Note:** This is a **documentation-only** guide. No SQL files are provided. Backend developers should implement the queries based on the specifications in this document and the main database integration document: `docs/backend-integration/customers-hub-requests-database-integration.md`

## Architecture

### Approach: Query-Based Integration

Instead of modifying existing tables, backend developers should use **SQL UNION ALL queries** to:
- ✅ Unify data from multiple legacy tables
- ✅ Map old data structures to new API requirements
- ✅ Allow NULL values for missing data (no conflicts)
- ✅ Maintain backward compatibility with existing code

### Query Structure

Backend should implement queries that combine:
1. **Customer Actions** - From multiple tables using UNION ALL
2. **Customer Preferences** - Derived from inquiry and property request tables

## Data Mapping

### Action Types Mapping

| API Type | Source Table | Source Field |
|----------|-------------|--------------|
| `new_inquiry` | `api_customer_inquiry` | `inquiry_type = 'inquiry'` |
| `callback_request` | `api_customer_inquiry` | `inquiry_type = 'callback'` |
| `whatsapp_incoming` | `api_customer_inquiry` | `inquiry_type = 'whatsapp'` |
| `property_match` | `users_property_requests` | All active requests |
| `follow_up` | `reminders` | All reminders |
| `follow_up` | `users_api_customers_reminders` | All customer reminders |
| `site_visit` | `users_api_customers_appointments` | All appointments |

### Status Mapping

| Legacy Status | API Status | Notes |
|--------------|-----------|-------|
| `is_read = 0, is_archived = 0` | `pending` | New/unread |
| `is_read = 1, is_archived = 0` | `in_progress` | Read but not archived |
| `is_archived = 1` | `dismissed` | Archived |
| `status = 'completed'` | `completed` | From reminders/appointments |
| `status = 'cancelled'` | `dismissed` | From reminders |
| `datetime < NOW()` | `completed` | For appointments |

### Priority Mapping

| Legacy Priority | API Priority | Source |
|----------------|-------------|--------|
| `urgency = 'urgent'` | `urgent` | `api_customer_inquiry` |
| `urgency = 'high'` | `high` | `api_customer_inquiry` |
| `priority = 2` | `high` | `reminders` |
| `priority = 3` | `high` | `users_api_customers_appointments` |
| `priority = 1` | `medium` | `reminders` |
| `priority = 2` | `medium` | `users_api_customers_appointments` |
| Default | `low` | All other cases |

## Missing Data Handling

### Allowed NULL Values

The following fields may be NULL in the view (no conflicts):

- `dueDate` - Not available in `api_customer_inquiry`
- `snoozedUntil` - Not available in any legacy table
- `completedAt` - Not available in `api_customer_inquiry`
- `completedBy` - Not available in any legacy table
- `assignedToName` - Requires JOIN with `users` table (can be added)
- `whatsapp` - Not in `api_customers` (can use `phone_number`)

### Default Values

- **Priority**: Defaults to `'low'` if not specified
- **Status**: Defaults to `'pending'` for new records
- **Source**: Defaults to `'inquiry'` or `'manual'` based on table

## Usage in Backend API

### Implementation Reference

**See main documentation:** `docs/backend-integration/customers-hub-requests-database-integration.md`

This document contains:
- Complete SQL query examples
- All table structures
- Data mapping tables
- Performance optimization guidelines
- Implementation checklist

### Example Query: Get Actions for Customer

Refer to Section 4.1 in the main database integration document for the complete UNION ALL query that combines all action types.

### Example Query: Filter by Type and Status

```sql
SELECT * FROM customer_actions_view
WHERE type = 'new_inquiry'
AND status = 'pending'
AND userId = ?
ORDER BY createdAt DESC
LIMIT 50;
```

### Example Query: Get Stats

```sql
SELECT 
    COUNT(*) FILTER (WHERE type IN ('new_inquiry', 'callback_request', 'whatsapp_incoming') 
                     AND status IN ('pending', 'in_progress')) AS inbox,
    COUNT(*) FILTER (WHERE type IN ('follow_up', 'site_visit') 
                     AND status IN ('pending', 'in_progress')) AS followups,
    COUNT(*) FILTER (WHERE status IN ('pending', 'in_progress')) AS pending,
    COUNT(*) FILTER (WHERE dueDate < NOW() 
                     AND status IN ('pending', 'in_progress')) AS overdue,
    COUNT(*) FILTER (WHERE DATE(dueDate) = CURRENT_DATE 
                     AND status IN ('pending', 'in_progress')) AS today,
    COUNT(*) FILTER (WHERE status = 'completed') AS completed
FROM customer_actions_view
WHERE userId = ?;
```

## Performance Considerations

### Indexes Required

Ensure these indexes exist on underlying tables:

```sql
-- For api_customer_inquiry
CREATE INDEX idx_inquiry_customer_created ON api_customer_inquiry(customer_id, created_at);
CREATE INDEX idx_inquiry_user_created ON api_customer_inquiry(user_id, created_at);

-- For users_property_requests
CREATE INDEX idx_property_requests_user_created ON users_property_requests(user_id, created_at);
CREATE INDEX idx_property_requests_user_phone ON users_property_requests(user_id, phone);

-- For reminders
CREATE INDEX idx_reminders_customer_datetime ON reminders(customer_id, datetime);
CREATE INDEX idx_reminders_user_customer ON reminders(user_id, customer_id);

-- For appointments
CREATE INDEX idx_appointments_customer_datetime ON users_api_customers_appointments(customer_id, datetime);
CREATE INDEX idx_appointments_user_customer ON users_api_customers_appointments(user_id, customer_id);
```

### Query Optimization

1. **Always filter by `userId`** first (tenant isolation)
2. **Use `LIMIT`** for pagination
3. **Filter by `status`** before joining preferences
4. **Use `createdAt DESC`** for default sorting

## Backward Compatibility

### Existing Code

✅ **No changes required** - All existing queries on legacy tables continue to work

### New Code

✅ **Use views** - New API endpoints should query `customer_actions_view` instead of individual tables

### Migration Path

1. **Phase 1**: Deploy views (no breaking changes)
2. **Phase 2**: Update API endpoints to use views
3. **Phase 3**: (Optional) Create new `customer_actions` table for future actions
4. **Phase 4**: (Optional) Migrate old data to new table gradually

## Implementation Notes

### Backend Implementation

Backend developers should:
1. Read the main database integration document: `docs/backend-integration/customers-hub-requests-database-integration.md`
2. Implement the UNION ALL queries provided in that document
3. Handle NULL values gracefully (they are expected)
4. Always filter by `user_id` for tenant isolation
5. Use the mapping tables to convert legacy data to API format

### Future Enhancements

### Optional: New Table for Actions

If needed in the future, backend can create a new table:

```sql
CREATE TABLE `customer_actions` (
    `id` BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'low',
    `status` ENUM('pending', 'in_progress', 'completed', 'dismissed', 'snoozed') DEFAULT 'pending',
    `source` VARCHAR(50),
    `due_date` DATETIME,
    `snoozed_until` DATETIME,
    `assigned_to` BIGINT UNSIGNED,
    `completed_at` DATETIME,
    `completed_by` BIGINT UNSIGNED,
    `metadata` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_customer_actions_user_customer` (`user_id`, `customer_id`),
    INDEX `idx_customer_actions_type_status` (`type`, `status`),
    INDEX `idx_customer_actions_due_date` (`due_date`),
    FOREIGN KEY (`customer_id`) REFERENCES `api_customers`(`id`) ON DELETE CASCADE
);
```

Then update the view to UNION with this new table:

```sql
-- Add to customer_actions_view
UNION ALL
SELECT 
    CONCAT('action_', ca.id) AS `id`,
    ca.customer_id AS `customerId`,
    ac.name AS `customerName`,
    ca.type AS `type`,
    ca.title AS `title`,
    ca.description AS `description`,
    ca.priority AS `priority`,
    ca.status AS `status`,
    ca.source AS `source`,
    ca.due_date AS `dueDate`,
    ca.snoozed_until AS `snoozedUntil`,
    ca.created_at AS `createdAt`,
    ca.completed_at AS `completedAt`,
    ca.completed_by AS `completedBy`,
    ca.assigned_to AS `assignedTo`,
    u.first_name AS `assignedToName`,
    ca.metadata AS `metadata`,
    'customer_actions' AS `sourceTable`,
    ca.id AS `sourceId`,
    ca.user_id AS `userId`
FROM `customer_actions` ca
INNER JOIN `api_customers` ac ON ca.customer_id = ac.id
LEFT JOIN `users` u ON ca.assigned_to = u.id;
```

## Testing

### Test Queries

```sql
-- Test 1: Get all actions for a customer
SELECT * FROM customer_actions_view 
WHERE customerId = 1 
ORDER BY createdAt DESC 
LIMIT 10;

-- Test 2: Get pending actions
SELECT * FROM customer_actions_view 
WHERE status = 'pending' 
AND userId = 1
ORDER BY createdAt DESC;

-- Test 3: Get actions by type
SELECT * FROM customer_actions_view 
WHERE type = 'new_inquiry' 
AND userId = 1
ORDER BY createdAt DESC;

-- Test 4: Get customer preferences
SELECT * FROM customer_preferences_view 
WHERE customerId = 1;
```

## Troubleshooting

### Common Issues

1. **Missing data in view**: Check if source tables have data
2. **Performance issues**: Ensure indexes are created
3. **NULL values**: Expected for missing fields (no conflict)

### Debug Queries

```sql
-- Check if customer exists
SELECT * FROM api_customers WHERE id = ?;

-- Check source tables
SELECT COUNT(*) FROM api_customer_inquiry WHERE customer_id = ?;
SELECT COUNT(*) FROM users_property_requests WHERE user_id = ? AND phone = ?;
SELECT COUNT(*) FROM reminders WHERE customer_id = ?;
```

## Summary

✅ **No breaking changes** - Legacy tables remain unchanged  
✅ **Unified interface** - Single view for all action types  
✅ **NULL values allowed** - Missing data doesn't cause conflicts  
✅ **Backward compatible** - Existing code continues to work  
✅ **Performance optimized** - Uses indexes on underlying tables  
