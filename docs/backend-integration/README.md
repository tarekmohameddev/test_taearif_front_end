# Backend Integration Documentation

## Overview

This directory contains **complete backend integration specifications** for the Customers Hub system. These documents are designed for **AI systems** (like Cursor AI) and backend developers to implement the API endpoints.

## 📁 Directory Structure

```
docs/backend-integration/
├── rules.md                    ⭐ START HERE - Central rules and guidelines
├── README.md                   This file - Quick start guide
│
├── api/                        API Specifications
│   ├── requests/               Requests center endpoints
│   │   ├── customers-hub-requests-api-specification.md
│   │   └── customers-hub-request-detail-api-specification.md
│   ├── list/                   Customers list endpoints
│   │   └── customers-hub-list-api-specification.md
│   ├── analytics/              Analytics dashboard endpoints
│   │   └── customers-hub-analytics-api-specification.md
│   ├── pipeline/               Pipeline/kanban board endpoints
│   │   └── customers-hub-pipeline-api-specification.md
│   └── detail/                 Customer detail page endpoints
│       └── customers-hub-detail-api-specification.md
│
├── database/                   Database Integration
│   └── customers-hub-requests-database-integration.md  ⭐ Main DB guide
│
└── guides/                     Additional Guides
    └── customer_actions_integration_guide.md
```

## 📚 Document Index

### ⭐ Essential Documents (Read First)

1. **`rules.md`** - **MANDATORY READING**
   - Central rules and guidelines
   - Database compatibility requirements
   - Performance requirements
   - Implementation workflow

2. **`database/customers-hub-requests-database-integration.md`**
   - Complete database integration guide
   - All existing table structures
   - Data mapping between legacy tables and API requirements
   - SQL query examples for all operations

### API Specifications

- **`api/requests/`** - Requests center API specs
- **`api/list/`** - Customers list API specs
- **`api/analytics/`** - Analytics dashboard API specs
- **`api/pipeline/`** - Pipeline/kanban board API specs
- **`api/detail/`** - Customer detail page API specs

### Supporting Documentation

- **`guides/customer_actions_integration_guide.md`** - Additional integration notes

## 🚀 Quick Start for Backend Developers

### Step 1: Read Rules Document ⭐

**MANDATORY:** Read `rules.md` first

This document contains:
- ✅ Critical rules for database compatibility
- ✅ Data mapping strategy
- ✅ Performance requirements
- ✅ Implementation workflow
- ✅ Common pitfalls to avoid

### Step 2: Read Database Integration Document

**Then read:** `database/customers-hub-requests-database-integration.md`

This document contains:
- ✅ All existing database table structures
- ✅ Complete data mapping tables
- ✅ SQL query examples for all operations
- ✅ Performance optimization guidelines
- ✅ Implementation checklist

### Step 3: Read API Specification

**Then read:** Relevant API specification in `api/` folder

Each API spec contains:
- ✅ Complete API endpoint specifications
- ✅ Request/response formats
- ✅ Filter specifications
- ✅ Error handling

### Step 4: Implement

1. Follow rules in `rules.md`
2. Use SQL queries from database integration document
3. Implement API endpoints according to API specification
4. Handle NULL values gracefully (they are expected)
5. Always filter by `user_id` for tenant isolation
6. Follow performance optimization guidelines

## 📋 Key Points

### Database Integration

- ✅ **Work with existing schemas** - Located in `docs/ExcessFiles/test_big_schema.sql`
- ✅ **Modifications allowed** - Add new columns/tables, but NO breaking changes
- ✅ **NULL values allowed** - Missing data is expected and handled gracefully
- ✅ **Unified queries** - Use UNION ALL to combine multiple tables
- ✅ **Mapping tables** - Clear mapping between legacy data and API requirements
- ✅ **Zero conflicts** - Legacy systems continue to work unchanged

### API Design

- ✅ **RESTful endpoints** - GET for reads, POST/PUT/DELETE for writes
- ✅ **Consolidated endpoints** - Single GET endpoint returns all data
- ✅ **Filter in request body** - All filters sent in POST request body
- ✅ **Performance optimized** - Mandatory indexes and query optimization

### Performance Requirements

- ⚠️ **CRITICAL:** System handles **50+ million requests** and **20+ million customers**
- ⚠️ **NO CACHING** allowed - All queries must hit database directly
- ⚠️ **Response time targets:** < 100ms for customer details, < 150ms for lists
- ⚠️ **Mandatory indexes** - See database integration document

## 🎯 For AI Systems (Cursor AI)

These documents are designed to be **100% clear for AI systems**. They include:

- Complete table structures
- Data mapping tables
- SQL query examples
- Step-by-step implementation guides
- Clear specifications without ambiguity

**AI should:**
1. Read the database integration document first
2. Understand the existing table structures
3. Use the mapping tables to convert legacy data to API format
4. Implement queries based on the examples provided
5. Handle NULL values gracefully

## ✅ Implementation Checklist

- [ ] Read `rules.md` (MANDATORY)
- [ ] Read `database/customers-hub-requests-database-integration.md`
- [ ] Read relevant API specification in `api/` folder
- [ ] Review database schema: `docs/ExcessFiles/test_big_schema.sql`
- [ ] Verify all required tables exist in database
- [ ] Create required indexes (see database integration document)
- [ ] Implement UNION ALL queries for actions
- [ ] Implement customer preferences queries
- [ ] Implement stats calculation queries
- [ ] Implement filter handling
- [ ] Implement pagination
- [ ] Always filter by `user_id` (tenant isolation)
- [ ] Handle NULL values gracefully
- [ ] Test with real data
- [ ] Optimize based on performance metrics
- [ ] Verify no schema modifications to legacy tables

## 📞 Support

For questions or clarifications:
1. Review the database integration document first
2. Check the API specification document
3. Refer to the mapping tables in both documents

---

**Last Updated:** 2026-02-04
