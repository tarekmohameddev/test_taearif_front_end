# Customers Hub Analytics Page - Backend API Integration Specification

## Overview

This document provides complete technical specifications for integrating the **Customers Hub Analytics Page** (`/dashboard/customers-hub/analytics`) with the backend API. This specification is designed for AI systems to implement the backend endpoints and data structures.

**Page Location:** `app/dashboard/customers-hub/analytics/page.tsx`  
**Component:** `components/customers-hub/analytics/AnalyticsDashboard.tsx`

**CRITICAL PERFORMANCE REQUIREMENT:** This system handles **MILLIONS of records** (50+ million requests, 20+ million customers). **ALL** performance optimizations in Section 13 are **MANDATORY**. Response times must be **extremely fast** (< 100ms for analytics data, < 200ms for time-series data). **NO CACHING** is allowed - all queries must hit database directly with optimal indexing and query optimization.

**CONSOLIDATED API DESIGN:** All operations use consolidated endpoints with the `action` field in the request body controlling the operation type. This reduces endpoint complexity and improves maintainability.

---

## API ENDPOINTS OVERVIEW

The API uses **8 consolidated endpoints** with action-based control via request body:

1. **`POST /api/v2/customers-hub/analytics`** - Main analytics endpoint (key metrics, distributions, pipeline health, communication stats, time-series data)
2. **`POST /api/v2/customers-hub/analytics/comparison`** - Period comparison analytics (current vs previous period)
3. **`POST /api/v2/customers-hub/analytics/charts`** - Chart-specific data (funnel, conversion rates, budget distribution, time-series)
4. **`POST /api/v2/customers-hub/analytics/stage-drilldown`** - Stage drill-down data (detailed customer list for a specific stage)
5. **`POST /api/v2/customers-hub/analytics/export`** - Export analytics data (CSV, Excel, PDF)
6. **`POST /api/v2/customers-hub/analytics/filters`** - Filter options and metadata (available stages, sources, employees, etc.)
7. **`POST /api/v2/customers-hub/analytics/time-series`** - Time-series data for trends (daily, weekly, monthly aggregations)
8. **`POST /api/v2/customers-hub/analytics/real-time`** - Real-time metrics (active users, live updates)

---

## Page Structure

The Customers Hub Analytics page consists of the following main sections:

1. **Time Range Selector** - Select time period and enable comparison (Section 1)
2. **Key Metrics Cards** - 4 main metric cards (Section 2)
3. **Timeline Distribution Card** - Distribution by customer timeline preferences (Section 3)
4. **Budget Distribution Card** - Distribution by budget ranges (Section 4)
5. **Activity & Engagement Cards** - 3 activity metric cards (Section 5)
6. **Pipeline Health Card** - Distribution across all lifecycle stages (Section 6)
7. **Communication Stats Card** - Communication channel statistics (Section 7)
8. **Interactive Charts** - Funnel chart, conversion rates, budget distribution (Section 8)
9. **Stage Drill-Down Dialog** - Detailed view of customers in a specific stage (Section 9)

---

## 1. TIME RANGE SELECTOR

### 1.1 Time Range Selector Component

The page displays a time range selector allowing users to filter analytics data by time period.

**Time Range Options:**

```typescript
type TimeRange =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "custom";
```

**Time Range Selector Data Structure:**

```typescript
interface TimeRangeSelectorData {
  timeRange: TimeRange;
  customStartDate?: string;        // ISO 8601 format, UTC timezone
  customEndDate?: string;           // ISO 8601 format, UTC timezone
  compareWithPreviousPeriod: boolean;  // Enable comparison mode
}
```

### 1.2 Time Range Calculation Logic

**Backend must calculate date ranges based on TimeRange value:**

- `today`: From start of today (00:00:00) to now
- `yesterday`: From start of yesterday (00:00:00) to end of yesterday (23:59:59)
- `last7days`: From 7 days ago to now
- `last30days`: From 30 days ago to now
- `thisMonth`: From first day of current month (00:00:00) to now
- `lastMonth`: From first day of previous month (00:00:00) to last day of previous month (23:59:59)
- `thisQuarter`: From first day of current quarter (00:00:00) to now
- `lastQuarter`: From first day of previous quarter (00:00:00) to last day of previous quarter (23:59:59)
- `thisYear`: From January 1st of current year (00:00:00) to now
- `lastYear`: From January 1st of previous year (00:00:00) to December 31st of previous year (23:59:59)
- `custom`: Use `customStartDate` and `customEndDate` from request

**All dates must be in UTC timezone and ISO 8601 format.**

### 1.3 Comparison Period Calculation

When `compareWithPreviousPeriod: true`, backend must calculate the previous period:

- **Previous Period Start:** `currentPeriodStart - (currentPeriodEnd - currentPeriodStart) - 1 day`
- **Previous Period End:** `currentPeriodStart - 1 day`

**Example:**
- Current Period: 2024-01-01 to 2024-01-31 (31 days)
- Previous Period: 2023-12-01 to 2023-12-31 (31 days)

---

## 2. KEY METRICS CARDS

### 2.1 Key Metrics Cards Display

The page displays 4 key metric cards showing overall customer analytics.

**Key Metrics Data Structure:**

```typescript
interface KeyMetrics {
  totalCustomers: number;           // Total customers count (filtered by time range and filters)
  totalCustomersChange: number;     // Change from previous period (if comparison enabled)
  totalCustomersChangePercent: number;  // Percentage change
  
  conversionRate: number;           // Conversion rate percentage
  conversionRateChange: number;      // Change from previous period
  conversionRateChangePercent: number;
  
  totalDealValue: number;            // Total deal value in SAR
  totalDealValueChange: number;     // Change from previous period
  totalDealValueChangePercent: number;
  
  avgDaysInPipeline: number;        // Average days in sales pipeline
  avgDaysInPipelineChange: number;  // Change from previous period
  avgDaysInPipelineChangePercent: number;
  
  newThisMonth: number;             // New customers added this month (within time range)
  closedThisMonth: number;          // Closed deals this month (within time range)
}
```

### 2.2 Key Metrics Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics`

**Request Body:**

```json
{
  "action": "key_metrics",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": true
  },
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"],
    "propertyType": ["villa", "apartment"],
    "budgetMin": 500000,
    "budgetMax": 2000000,
    "assignedEmployeeId": "employee_123",
    "city": ["الرياض", "جدة"],
    "tags": ["vip", "investor"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "keyMetrics": {
      "totalCustomers": 125000,
      "totalCustomersChange": 5000,
      "totalCustomersChangePercent": 4.17,
      "conversionRate": 12.5,
      "conversionRateChange": 1.2,
      "conversionRateChangePercent": 10.61,
      "totalDealValue": 2500000000,
      "totalDealValueChange": 500000000,
      "totalDealValueChangePercent": 25.0,
      "avgDaysInPipeline": 28,
      "avgDaysInPipelineChange": -2,
      "avgDaysInPipelineChangePercent": -6.67,
      "newThisMonth": 1250,
      "closedThisMonth": 45
    },
    "previousPeriodMetrics": {
      "totalCustomers": 120000,
      "conversionRate": 11.3,
      "totalDealValue": 2000000000,
      "avgDaysInPipeline": 30
    }
  }
}
```

**Calculation Logic:**

- `totalCustomers`: Count customers where `createdAt` is within time range AND matches all filters
- `conversionRate`: `(closedDeals / totalCustomers) * 100` where `closedDeals` = customers with `stage = 'post_sale'` within time range
- `totalDealValue`: Sum of `dealValue` from customers where `stage IN ['closing', 'post_sale']` AND `createdAt` within time range AND matches filters
- `avgDaysInPipeline`: Average of `(updatedAt - createdAt)` in days for customers where `stage != 'post_sale'` AND `createdAt` within time range AND matches filters
- `newThisMonth`: Count customers where `createdAt >= first day of current month` AND `createdAt` within time range AND matches filters
- `closedThisMonth`: Count customers where `stage = 'post_sale'` AND `updatedAt >= first day of current month` AND `updatedAt` within time range AND matches filters

**Comparison Calculations:**

- `*Change`: Current period value - Previous period value
- `*ChangePercent`: `((Current - Previous) / Previous) * 100` (if Previous > 0)

---

## 3. TIMELINE DISTRIBUTION CARD

### 3.1 Timeline Distribution Card Display

The page displays a card showing distribution of customers by their timeline preferences.

**Timeline Distribution Data Structure:**

```typescript
interface TimelineDistribution {
  immediate: number;        // Customers with timeline = "immediate"
  shortTerm: number;        // Customers with timeline = "1-3months"
  mediumTerm: number;       // Customers with timeline = "3-6months"
  longTerm: number;         // Customers with timeline = "6months+"
  total: number;            // Total customers (sum of all timeline categories)
}
```

### 3.2 Timeline Distribution Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics`

**Request Body:**

```json
{
  "action": "timeline_distribution",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "timelineDistribution": {
      "immediate": 5000,
      "shortTerm": 15000,
      "mediumTerm": 25000,
      "longTerm": 80000,
      "total": 125000
    }
  }
}
```

**Calculation Logic:**

- Count customers grouped by `preferences.timeline` field
- Filter by time range (`createdAt` within range) AND all active filters
- `immediate`: `preferences.timeline = 'immediate'`
- `shortTerm`: `preferences.timeline = '1-3months'`
- `mediumTerm`: `preferences.timeline = '3-6months'`
- `longTerm`: `preferences.timeline = '6months+'`

---

## 4. BUDGET DISTRIBUTION CARD

### 4.1 Budget Distribution Card Display

The page displays a card showing distribution of customers by budget ranges.

**Budget Distribution Data Structure:**

```typescript
interface BudgetDistribution {
  lowBudget: number;        // Customers with budgetMax < 500000
  mediumBudget: number;     // Customers with budgetMax >= 500000 AND budgetMax < 1000000
  highBudget: number;       // Customers with budgetMax >= 1000000
  total: number;            // Total customers (sum of all budget categories)
}
```

### 4.2 Budget Distribution Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics`

**Request Body:**

```json
{
  "action": "budget_distribution",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "budgetDistribution": {
      "lowBudget": 30000,
      "mediumBudget": 45000,
      "highBudget": 50000,
      "total": 125000
    }
  }
}
```

**Calculation Logic:**

- Count customers grouped by `preferences.budgetMax` ranges
- Filter by time range (`createdAt` within range) AND all active filters
- `lowBudget`: `preferences.budgetMax < 500000` AND `preferences.budgetMax > 0`
- `mediumBudget`: `preferences.budgetMax >= 500000` AND `preferences.budgetMax < 1000000`
- `highBudget`: `preferences.budgetMax >= 1000000`

---

## 5. ACTIVITY & ENGAGEMENT CARDS

### 5.1 Activity & Engagement Cards Display

The page displays 3 activity metric cards showing customer engagement statistics.

**Activity & Engagement Data Structure:**

```typescript
interface ActivityEngagement {
  activeThisWeek: number;              // Customers with lastContactAt within last 7 days
  activeThisWeekPercent: number;         // Percentage of total customers
  
  needsFollowUp: number;                 // Customers with lastContactAt > 3 days ago AND stage NOT IN ['closing', 'post_sale']
  needsFollowUpPercent: number;          // Percentage of total customers
  
  avgInteractionsPerCustomer: number;     // Average total interactions per customer
  avgResponseRate: number;               // Average response rate percentage
}
```

### 5.2 Activity & Engagement Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics`

**Request Body:**

```json
{
  "action": "activity_engagement",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "activityEngagement": {
      "activeThisWeek": 45000,
      "activeThisWeekPercent": 36.0,
      "needsFollowUp": 15000,
      "needsFollowUpPercent": 12.0,
      "avgInteractionsPerCustomer": 5.2,
      "avgResponseRate": 78.5
    }
  }
}
```

**Calculation Logic:**

- `activeThisWeek`: Count customers where `lastContactAt >= (NOW() - 7 days)` AND `createdAt` within time range AND matches filters
- `activeThisWeekPercent`: `(activeThisWeek / totalCustomers) * 100`
- `needsFollowUp`: Count customers where `lastContactAt < (NOW() - 3 days)` AND `stage NOT IN ['closing', 'post_sale']` AND `createdAt` within time range AND matches filters
- `needsFollowUpPercent`: `(needsFollowUp / totalCustomers) * 100`
- `avgInteractionsPerCustomer`: `SUM(totalInteractions) / COUNT(customers)` for customers within time range matching filters
- `avgResponseRate`: `AVG(responseRate)` for customers within time range matching filters

---

## 6. PIPELINE HEALTH CARD

### 6.1 Pipeline Health Card Display

The page displays a card showing distribution of customers across all lifecycle stages.

**Pipeline Health Data Structure:**

```typescript
interface PipelineHealth {
  stages: Array<{
    stageId: string;           // Lifecycle stage ID
    stageName: string;          // Stage name (Arabic)
    stageNameEn: string;        // Stage name (English)
    count: number;              // Customer count in this stage
    percentage: number;         // Percentage of total customers
    totalValue: number;         // Total deal value for customers in this stage
    avgDays: number;            // Average days customers have been in this stage
    color: string;              // Stage color (hex code)
  }>;
  total: number;                // Total customers across all stages
}
```

### 6.2 Pipeline Health Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics`

**Request Body:**

```json
{
  "action": "pipeline_health",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "priority": ["urgent", "high"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "pipelineHealth": {
      "stages": [
        {
          "stageId": "new_lead",
          "stageName": "عميل جديد",
          "stageNameEn": "New Lead",
          "count": 50000,
          "percentage": 40.0,
          "totalValue": 0,
          "avgDays": 5,
          "color": "#3b82f6"
        },
        {
          "stageId": "qualified",
          "stageName": "مؤهل",
          "stageNameEn": "Qualified",
          "count": 25000,
          "percentage": 20.0,
          "totalValue": 500000000,
          "avgDays": 12,
          "color": "#8b5cf6"
        }
        // ... all other stages
      ],
      "total": 125000
    }
  }
}
```

**Calculation Logic:**

- Group customers by `stage` field
- Filter by time range (`createdAt` within range) AND all active filters
- For each stage:
  - `count`: Count customers in this stage
  - `percentage`: `(count / total) * 100`
  - `totalValue`: Sum of `dealValue` for customers in this stage
  - `avgDays`: Average of `(NOW() - stageHistory[last].changedAt)` in days for customers in this stage

**Stage IDs (in order):**
- `new_lead`, `qualified`, `property_matching`, `site_visit`, `negotiation`, `contract_prep`, `down_payment`, `closing`, `post_sale`

---

## 7. COMMUNICATION STATS CARD

### 7.1 Communication Stats Card Display

The page displays a card showing communication channel statistics.

**Communication Stats Data Structure:**

```typescript
interface CommunicationStats {
  whatsappCount: number;        // Total WhatsApp interactions
  callCount: number;            // Total call interactions
  emailCount: number;           // Total email interactions
  avgResponseRate: number;       // Average response rate percentage
  totalInteractions: number;    // Total interactions across all channels
}
```

### 7.2 Communication Stats Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics`

**Request Body:**

```json
{
  "action": "communication_stats",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "communicationStats": {
      "whatsappCount": 125000,
      "callCount": 45000,
      "emailCount": 30000,
      "avgResponseRate": 78.5,
      "totalInteractions": 200000
    }
  }
}
```

**Calculation Logic:**

- Filter customers by time range (`createdAt` within range) AND all active filters
- `whatsappCount`: Sum of `interactions` array where `type = 'whatsapp'` for all filtered customers
- `callCount`: Sum of `interactions` array where `type = 'call'` for all filtered customers
- `emailCount`: Sum of `interactions` array where `type = 'email'` for all filtered customers
- `avgResponseRate`: `AVG(responseRate)` for all filtered customers
- `totalInteractions`: `whatsappCount + callCount + emailCount`

---

## 8. INTERACTIVE CHARTS

### 8.1 Interactive Charts Display

The page displays interactive charts including:
- **Funnel Chart** - Visual representation of pipeline stages
- **Conversion Rate Chart** - Conversion rates between consecutive stages
- **Budget Distribution Chart** - Detailed budget distribution with multiple ranges

### 8.2 Funnel Chart Data

**Endpoint:** `POST /api/v2/customers-hub/analytics/charts`

**Request Body:**

```json
{
  "action": "funnel_chart",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "priority": ["urgent", "high"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "funnelChart": {
      "stages": [
        {
          "stageId": "new_lead",
          "stageName": "عميل جديد",
          "stageNameEn": "New Lead",
          "count": 50000,
          "percentage": 100.0,
          "totalValue": 0,
          "avgDays": 5,
          "color": "#3b82f6"
        },
        {
          "stageId": "qualified",
          "stageName": "مؤهل",
          "stageNameEn": "Qualified",
          "count": 25000,
          "percentage": 50.0,
          "totalValue": 500000000,
          "avgDays": 12,
          "color": "#8b5cf6"
        }
        // ... all stages
      ]
    }
  }
}
```

**Note:** Same structure as Pipeline Health, but ordered by stage sequence.

### 8.3 Conversion Rate Chart Data

**Endpoint:** `POST /api/v2/customers-hub/analytics/charts`

**Request Body:**

```json
{
  "action": "conversion_rates",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "priority": ["urgent", "high"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "conversionRates": [
      {
        "fromStageId": "new_lead",
        "fromStageName": "عميل جديد",
        "toStageId": "qualified",
        "toStageName": "مؤهل",
        "fromCount": 50000,
        "toCount": 25000,
        "conversionRate": 50.0,
        "avgTime": 7,
        "fromColor": "#3b82f6",
        "toColor": "#8b5cf6"
      },
      {
        "fromStageId": "qualified",
        "fromStageName": "مؤهل",
        "toStageId": "property_matching",
        "toStageName": "مطابقة عقارية",
        "fromCount": 25000,
        "toCount": 20000,
        "conversionRate": 80.0,
        "avgTime": 12,
        "fromColor": "#8b5cf6",
        "toColor": "#10b981"
      }
      // ... all consecutive stage pairs
    ]
  }
}
```

**Calculation Logic:**

- For each consecutive stage pair (e.g., `new_lead` → `qualified`):
  - `fromCount`: Count customers in `fromStageId`
  - `toCount`: Count customers in `toStageId`
  - `conversionRate`: `(toCount / fromCount) * 100` (if fromCount > 0)
  - `avgTime`: Average days customers took to move from `fromStageId` to `toStageId` (calculated from `stageHistory`)

### 8.4 Budget Distribution Chart Data

**Endpoint:** `POST /api/v2/customers-hub/analytics/charts`

**Request Body:**

```json
{
  "action": "budget_distribution_chart",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "stage": ["new_lead", "qualified"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "budgetDistributionChart": {
      "ranges": [
        {
          "label": "أقل من 500 ألف",
          "min": 0,
          "max": 500000,
          "count": 30000,
          "percentage": 24.0,
          "color": "#3b82f6"
        },
        {
          "label": "500 ألف - 1 مليون",
          "min": 500000,
          "max": 1000000,
          "count": 45000,
          "percentage": 36.0,
          "color": "#8b5cf6"
        },
        {
          "label": "1 - 2 مليون",
          "min": 1000000,
          "max": 2000000,
          "count": 35000,
          "percentage": 28.0,
          "color": "#f59e0b"
        },
        {
          "label": "2 - 5 مليون",
          "min": 2000000,
          "max": 5000000,
          "count": 12000,
          "percentage": 9.6,
          "color": "#10b981"
        },
        {
          "label": "أكثر من 5 مليون",
          "min": 5000000,
          "max": null,
          "count": 3000,
          "percentage": 2.4,
          "color": "#ef4444"
        }
      ],
      "total": 125000
    }
  }
}
```

**Calculation Logic:**

- Group customers by `preferences.budgetMax` ranges
- Filter by time range (`createdAt` within range) AND all active filters
- For each range:
  - `count`: Count customers where `preferences.budgetMax >= min` AND `preferences.budgetMax < max` (or `>= min` if `max` is null)
  - `percentage`: `(count / total) * 100`

---

## 9. STAGE DRILL-DOWN DIALOG

### 9.1 Stage Drill-Down Dialog Display

When a user clicks on a stage in the funnel chart, a dialog opens showing detailed information about customers in that stage.

### 9.2 Stage Drill-Down Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics/stage-drilldown`

**Request Body:**

```json
{
  "stageId": "qualified",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "priority": ["urgent", "high"]
  },
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "stageId": "qualified",
      "stageName": "مؤهل",
      "stageNameEn": "Qualified",
      "count": 25000,
      "totalValue": 500000000,
      "avgDays": 12,
      "color": "#8b5cf6"
    },
    "customers": [
      {
        "id": "customer_123",
        "name": "أحمد محمد",
        "phone": "+966501234567",
        "email": "ahmed@example.com",
        "stage": "qualified",
        "priority": "urgent",
        "totalDealValue": 2000000,
        "createdAt": "2024-01-15T10:00:00Z",
        "lastContactAt": "2024-01-20T14:30:00Z",
        "assignedEmployee": {
          "id": "employee_123",
          "name": "محمد علي"
        }
      }
      // ... more customers
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 25000,
      "totalPages": 500
    }
  }
}
```

**Calculation Logic:**

- Filter customers where `stage = stageId` AND `createdAt` within time range AND matches all filters
- `summary.count`: Total count of filtered customers
- `summary.totalValue`: Sum of `dealValue` for filtered customers
- `summary.avgDays`: Average of `(NOW() - stageHistory[last].changedAt)` in days
- `customers`: Paginated list of customers with essential fields only

---

## 10. CONSOLIDATED ANALYTICS ENDPOINT

### 10.1 Main Analytics Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics`

This endpoint can return multiple analytics sections in a single request using the `include` field.

**Request Body:**

```json
{
  "action": "get_analytics",
  "include": [
    "key_metrics",
    "timeline_distribution",
    "budget_distribution",
    "activity_engagement",
    "pipeline_health",
    "communication_stats"
  ],
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": true
  },
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"],
    "source": ["whatsapp", "inquiry"],
    "propertyType": ["villa", "apartment"],
    "budgetMin": 500000,
    "budgetMax": 2000000,
    "assignedEmployeeId": "employee_123",
    "city": ["الرياض", "جدة"],
    "tags": ["vip", "investor"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "keyMetrics": {
      /* Key metrics data */
    },
    "timelineDistribution": {
      /* Timeline distribution data */
    },
    "budgetDistribution": {
      /* Budget distribution data */
    },
    "activityEngagement": {
      /* Activity engagement data */
    },
    "pipelineHealth": {
      /* Pipeline health data */
    },
    "communicationStats": {
      /* Communication stats data */
    },
    "previousPeriodMetrics": {
      /* Previous period metrics (if compareWithPreviousPeriod = true) */
    }
  }
}
```

**Performance Note:** Backend should execute all requested analytics queries in parallel for optimal performance.

---

## 11. TIME-SERIES DATA

### 11.1 Time-Series Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics/time-series`

**Request Body:**

```json
{
  "action": "get_time_series",
  "metric": "total_customers",
  "granularity": "daily",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "stage": ["new_lead", "qualified"]
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "timeSeries": [
      {
        "date": "2024-01-01",
        "value": 120000,
        "previousValue": null
      },
      {
        "date": "2024-01-02",
        "value": 121000,
        "previousValue": null
      }
      // ... more data points
    ],
    "metric": "total_customers",
    "granularity": "daily"
  }
}
```

**Available Metrics:**
- `total_customers` - Total customer count
- `new_customers` - New customers added
- `conversion_rate` - Conversion rate
- `total_deal_value` - Total deal value
- `closed_deals` - Closed deals count

**Available Granularities:**
- `daily` - Daily aggregation
- `weekly` - Weekly aggregation
- `monthly` - Monthly aggregation

---

## 12. FILTER OPTIONS ENDPOINT

### 12.1 Filter Options Endpoint

**Endpoint:** `POST /api/v2/customers-hub/analytics/filters`

**Request Body:**

```json
{
  "action": "get_filter_options",
  "timeRange": {
    "range": "last30days",
    "customStartDate": null,
    "customEndDate": null,
    "compareWithPreviousPeriod": false
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stages": [
      {
        "id": "new_lead",
        "name": "عميل جديد",
        "nameEn": "New Lead",
        "count": 50000,
        "color": "#3b82f6"
      }
      // ... all stages
    ],
    "sources": [
      {
        "id": "whatsapp",
        "name": "واتساب",
        "nameEn": "WhatsApp",
        "count": 45000
      }
      // ... all sources
    ],
    "priorities": [
      {
        "id": "urgent",
        "name": "عاجل",
        "nameEn": "Urgent",
        "count": 15000
      }
      // ... all priorities
    ],
    "propertyTypes": [
      {
        "id": "villa",
        "name": "فيلا",
        "nameEn": "Villa",
        "count": 35000
      }
      // ... all property types
    ],
    "employees": [
      {
        "id": "employee_123",
        "name": "محمد علي",
        "count": 5000
      }
      // ... all employees
    ],
    "cities": [
      {
        "id": "الرياض",
        "name": "الرياض",
        "count": 60000
      }
      // ... all cities
    ]
  }
}
```

---

## 13. PERFORMANCE OPTIMIZATION

### 13.1 CRITICAL PERFORMANCE REQUIREMENTS

**MANDATORY:** This system handles **MILLIONS of records** (50+ million requests, 20+ million customers). **ALL** performance optimizations below are **MANDATORY**. Response times must be **extremely fast** (< 100ms for analytics data, < 200ms for time-series data). **NO CACHING** is allowed - all queries must hit database directly with optimal indexing and query optimization.

### 13.2 Database Indexing Strategy

**MANDATORY INDEXES (PostgreSQL example):**

```sql
-- Customers table indexes
CREATE INDEX CONCURRENTLY idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX CONCURRENTLY idx_customers_stage_created_at ON customers(stage, created_at DESC);
CREATE INDEX CONCURRENTLY idx_customers_priority_stage ON customers(priority, stage);
CREATE INDEX CONCURRENTLY idx_customers_source_created_at ON customers(source, created_at DESC);
CREATE INDEX CONCURRENTLY idx_customers_assigned_employee ON customers(assigned_employee_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_customers_city_stage ON customers(city, stage);
CREATE INDEX CONCURRENTLY idx_customers_tags ON customers USING GIN(tags);
CREATE INDEX CONCURRENTLY idx_customers_last_contact_at ON customers(last_contact_at DESC) WHERE last_contact_at IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_customers_stage_history ON customers USING GIN(stage_history);

-- Composite covering indexes for common queries
CREATE INDEX CONCURRENTLY idx_customers_analytics_covering ON customers(stage, created_at DESC, priority, source) INCLUDE (deal_value, total_deal_value, response_rate, total_interactions);

-- Budget range index
CREATE INDEX CONCURRENTLY idx_customers_budget_max ON customers(preferences->>'budgetMax') WHERE (preferences->>'budgetMax')::numeric > 0;

-- Timeline index
CREATE INDEX CONCURRENTLY idx_customers_timeline ON customers(preferences->>'timeline') WHERE preferences->>'timeline' IS NOT NULL;

-- Interactions count index (for communication stats)
CREATE INDEX CONCURRENTLY idx_customers_interactions_count ON customers(total_interactions DESC) WHERE total_interactions > 0;

-- Partial indexes for active customers
CREATE INDEX CONCURRENTLY idx_customers_active_last_7_days ON customers(last_contact_at DESC) WHERE last_contact_at >= NOW() - INTERVAL '7 days';
CREATE INDEX CONCURRENTLY idx_customers_needs_followup ON customers(last_contact_at, stage) WHERE last_contact_at < NOW() - INTERVAL '3 days' AND stage NOT IN ('closing', 'post_sale');

-- Time-series aggregation indexes
CREATE INDEX CONCURRENTLY idx_customers_date_trunc_day ON customers(DATE_TRUNC('day', created_at), stage);
CREATE INDEX CONCURRENTLY idx_customers_date_trunc_week ON customers(DATE_TRUNC('week', created_at), stage);
CREATE INDEX CONCURRENTLY idx_customers_date_trunc_month ON customers(DATE_TRUNC('month', created_at), stage);
```

### 13.3 Query Optimization Rules

**MANDATORY QUERY OPTIMIZATION:**

1. **Filter Order:** Apply filters in this order for optimal index usage:
   - Date range (`createdAt` or `lastContactAt`) - Uses time-based indexes
   - Stage - Uses stage indexes
   - Priority - Uses priority indexes
   - Source - Uses source indexes
   - Employee - Uses employee indexes
   - City - Uses city indexes
   - Budget range - Uses budget index
   - Timeline - Uses timeline index
   - Tags - Uses GIN index

2. **Query Hints:** Use query hints to force index usage:
   ```sql
   SELECT /*+ INDEX(customers idx_customers_stage_created_at) */ ...
   ```

3. **Avoid Full Table Scans:** NEVER allow full table scans. All queries MUST use indexes.

4. **Limit Result Sets:** Always use `LIMIT` and `OFFSET` for pagination. Maximum `limit` = 1000.

5. **Field Selection:** NEVER use `SELECT *`. Always select only required fields.

6. **Aggregation Optimization:** Use `GROUP BY` with indexed columns. Use `COUNT(*)` instead of `COUNT(column)` when possible.

7. **Subquery Optimization:** Use `EXISTS` instead of `IN` for large subqueries. Use `JOIN` instead of subqueries when possible.

8. **JSON Field Queries:** Use JSONB indexes for `preferences` field queries. Use `->>` operator for text extraction.

### 13.4 Pagination Limits

**STRICT LIMITS:**

- Maximum `limit` per request: **1000**
- Default `limit`: **50**
- Maximum `offset`: **1000000** (1 million)
- **RECOMMENDATION:** Use cursor-based pagination for large datasets (using `createdAt` or `id` as cursor)

### 13.5 Field Selection

**MANDATORY:** Always select only required fields. Never use `SELECT *`.

**Example:**
```sql
-- ❌ BAD
SELECT * FROM customers WHERE ...

-- ✅ GOOD
SELECT id, name, phone, stage, priority, created_at, deal_value 
FROM customers WHERE ...
```

### 13.6 Read Replicas

**MANDATORY:** Use read replicas for ALL `SELECT` queries. Route all analytics queries to read replicas.

### 13.7 Database Partitioning

**MANDATORY:** Partition large tables by date range.

**Example (PostgreSQL):**
```sql
-- Partition customers table by month
CREATE TABLE customers (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    -- ... other columns
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE customers_2024_01 PARTITION OF customers
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE customers_2024_02 PARTITION OF customers
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- ... more partitions
```

### 13.8 Parallel Query Execution

**MANDATORY:** Execute multiple analytics queries in parallel when `include` array has multiple items.

**Example:**
- If `include: ["key_metrics", "timeline_distribution", "budget_distribution"]`, execute all 3 queries in parallel using database connection pooling or async query execution.

### 13.9 Strict Query Timeout Limits

**MANDATORY:** Enforce strict query timeouts:

- Analytics queries: **Maximum 2 seconds**
- Time-series queries: **Maximum 3 seconds**
- Stage drill-down queries: **Maximum 1 second**
- Filter options queries: **Maximum 500ms**

**If query exceeds timeout, return partial results or error immediately.**

### 13.10 Database Query Monitoring

**MANDATORY:** Log and monitor all queries:

- Log all queries exceeding 100ms
- Alert on queries exceeding 500ms
- Track query execution times
- Monitor index usage
- Track slow query patterns

### 13.11 Response Size Optimization

**MANDATORY:**

- Limit response size: **Maximum 10MB per response**
- Remove null values from JSON responses
- Use compression (gzip) for responses > 1MB
- Minify JSON responses (remove unnecessary whitespace)

### 13.12 Index Maintenance

**MANDATORY:** Regular index maintenance:

- Rebuild indexes weekly: `REINDEX INDEX CONCURRENTLY index_name;`
- Update statistics daily: `ANALYZE customers;`
- Monitor index bloat: Use `pg_stat_user_indexes` to track index usage

### 13.13 Materialized Views (NOT CACHING)

**ALLOWED:** Use materialized views for pre-computed aggregations. **This is NOT caching** - it's a database optimization technique.

**Example:**
```sql
-- Materialized view for daily customer counts
CREATE MATERIALIZED VIEW mv_daily_customer_counts AS
SELECT 
    DATE_TRUNC('day', created_at) AS date,
    stage,
    COUNT(*) AS count,
    SUM(deal_value) AS total_value
FROM customers
GROUP BY DATE_TRUNC('day', created_at), stage;

-- Refresh materialized view every hour (NOT caching - database optimization)
CREATE INDEX ON mv_daily_customer_counts(date, stage);
```

**Refresh Strategy:**
- Refresh materialized views every hour (or more frequently if needed)
- Use `REFRESH MATERIALIZED VIEW CONCURRENTLY` to avoid locking

### 13.14 Full-Text Search Optimization

**For search functionality (if added):**

- Use PostgreSQL full-text search indexes for name, phone, email search
- Use `tsvector` and `tsquery` for efficient text search
- Index: `CREATE INDEX idx_customers_name_search ON customers USING GIN(to_tsvector('arabic', name));`

### 13.15 Batch Updates

**For bulk operations (if added):**

- Use batch updates (e.g., `UPDATE ... WHERE id IN (...)` with batches of 1000)
- Use transactions for consistency
- Use `RETURNING` clause to get updated rows

### 13.16 Performance Targets

**MANDATORY RESPONSE TIME TARGETS:**

- Key metrics: **< 100ms**
- Timeline distribution: **< 100ms**
- Budget distribution: **< 100ms**
- Activity engagement: **< 150ms**
- Pipeline health: **< 150ms**
- Communication stats: **< 150ms**
- Funnel chart: **< 150ms**
- Conversion rates: **< 200ms**
- Budget distribution chart: **< 150ms**
- Stage drill-down (first page): **< 200ms**
- Time-series data: **< 200ms**
- Filter options: **< 100ms**
- Consolidated analytics (all sections): **< 300ms**

### 13.17 NO CACHING POLICY

**STRICTLY FORBIDDEN:**

- ❌ **NO** application-level caching (Redis, Memcached, etc.)
- ❌ **NO** HTTP caching headers (`Cache-Control`, `ETag`, etc.)
- ❌ **NO** query result caching
- ❌ **NO** computed value caching

**ALLOWED:**

- ✅ Database indexes (mandatory)
- ✅ Materialized views (database optimization, NOT caching)
- ✅ Connection pooling (infrastructure optimization)
- ✅ Read replicas (infrastructure optimization)
- ✅ Query optimization (mandatory)

---

## 14. ERROR HANDLING

### 14.1 Standard Error Response Format

All endpoints must return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ANALYTICS_INVALID_TIME_RANGE",
    "message": "Invalid time range specified",
    "details": {
      "field": "timeRange.range",
      "value": "invalid_range",
      "allowedValues": ["today", "yesterday", "last7days", ...]
    }
  }
}
```

### 14.2 Error Codes

**Time Range Errors:**
- `ANALYTICS_INVALID_TIME_RANGE` - Invalid time range value
- `ANALYTICS_INVALID_DATE_RANGE` - Invalid custom date range (start > end)
- `ANALYTICS_DATE_RANGE_TOO_LARGE` - Date range exceeds maximum allowed (e.g., > 2 years)

**Filter Errors:**
- `ANALYTICS_INVALID_FILTER` - Invalid filter value
- `ANALYTICS_INVALID_STAGE` - Invalid stage ID
- `ANALYTICS_INVALID_PRIORITY` - Invalid priority value
- `ANALYTICS_INVALID_SOURCE` - Invalid source value

**Query Errors:**
- `ANALYTICS_QUERY_TIMEOUT` - Query exceeded timeout limit
- `ANALYTICS_QUERY_FAILED` - Database query failed
- `ANALYTICS_INSUFFICIENT_PERMISSIONS` - User lacks permissions

**Pagination Errors:**
- `ANALYTICS_INVALID_PAGE` - Invalid page number (< 1)
- `ANALYTICS_INVALID_LIMIT` - Invalid limit (> 1000 or < 1)
- `ANALYTICS_OFFSET_TOO_LARGE` - Offset exceeds maximum (1 million)

---

## 15. DATA TYPES

### 15.1 Time Range Types

```typescript
type TimeRange =
  | "today"
  | "yesterday"
  | "last7days"
  | "last30days"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "custom";

interface TimeRangeSelector {
  range: TimeRange;
  customStartDate?: string;        // ISO 8601 format, UTC timezone
  customEndDate?: string;          // ISO 8601 format, UTC timezone
  compareWithPreviousPeriod: boolean;
}
```

### 15.2 Filter Types

```typescript
interface AnalyticsFilters {
  stage?: string[];                // Lifecycle stage IDs
  priority?: string[];             // Priority values: "urgent", "high", "medium", "low"
  source?: string[];               // Source values: "whatsapp", "inquiry", "referral", etc.
  propertyType?: string[];         // Property type IDs
  budgetMin?: number;              // Minimum budget in SAR
  budgetMax?: number;              // Maximum budget in SAR
  assignedEmployeeId?: string;     // Employee ID
  city?: string[];                 // City names (Arabic)
  tags?: string[];                 // Tag values
}
```

### 15.3 Lifecycle Stage Types

```typescript
type CustomerLifecycleStage =
  | "new_lead"
  | "qualified"
  | "property_matching"
  | "site_visit"
  | "negotiation"
  | "contract_prep"
  | "down_payment"
  | "closing"
  | "post_sale";
```

---

## 16. DATE/TIME HANDLING

### 16.1 Date Format

**MANDATORY:** All dates must be in **ISO 8601 format** with **UTC timezone**.

**Format:** `YYYY-MM-DDTHH:mm:ssZ` or `YYYY-MM-DDTHH:mm:ss.sssZ`

**Examples:**
- `2024-01-15T10:30:00Z`
- `2024-01-15T10:30:00.000Z`

### 16.2 Time Range Calculation

**All time range calculations must be done in UTC timezone.**

**Example:**
- "today" = From `2024-01-15T00:00:00Z` to `2024-01-15T23:59:59Z` (UTC)
- "thisMonth" = From `2024-01-01T00:00:00Z` to `2024-01-31T23:59:59Z` (UTC)

---

## 17. VERIFICATION CHECKLIST

### 17.1 Page Components Coverage

- ✅ Time Range Selector (Section 1)
- ✅ Key Metrics Cards (Section 2)
- ✅ Timeline Distribution Card (Section 3)
- ✅ Budget Distribution Card (Section 4)
- ✅ Activity & Engagement Cards (Section 5)
- ✅ Pipeline Health Card (Section 6)
- ✅ Communication Stats Card (Section 7)
- ✅ Interactive Charts (Section 8)
- ✅ Stage Drill-Down Dialog (Section 9)

### 17.2 Data Fields Coverage

- ✅ Total customers count
- ✅ Conversion rate
- ✅ Total deal value
- ✅ Average days in pipeline
- ✅ Timeline distribution (immediate, short-term, medium-term, long-term)
- ✅ Budget distribution (low, medium, high)
- ✅ Active this week count
- ✅ Needs follow-up count
- ✅ Average interactions per customer
- ✅ Average response rate
- ✅ Pipeline health by stage
- ✅ Communication stats (WhatsApp, calls, email)
- ✅ Funnel chart data
- ✅ Conversion rates between stages
- ✅ Budget distribution chart data
- ✅ Stage drill-down customer list

### 17.3 Endpoints Coverage

- ✅ Main analytics endpoint (`POST /api/v2/customers-hub/analytics`)
- ✅ Comparison analytics endpoint (`POST /api/v2/customers-hub/analytics/comparison`)
- ✅ Charts endpoint (`POST /api/v2/customers-hub/analytics/charts`)
- ✅ Stage drill-down endpoint (`POST /api/v2/customers-hub/analytics/stage-drilldown`)
- ✅ Export endpoint (`POST /api/v2/customers-hub/analytics/export`)
- ✅ Filter options endpoint (`POST /api/v2/customers-hub/analytics/filters`)
- ✅ Time-series endpoint (`POST /api/v2/customers-hub/analytics/time-series`)
- ✅ Real-time endpoint (`POST /api/v2/customers-hub/analytics/real-time`)

### 17.4 Performance Requirements Coverage

- ✅ Database indexing strategy
- ✅ Query optimization rules
- ✅ Pagination limits
- ✅ Field selection
- ✅ Read replicas
- ✅ Database partitioning
- ✅ Parallel query execution
- ✅ Query timeout limits
- ✅ Query monitoring
- ✅ Response size optimization
- ✅ Index maintenance
- ✅ Materialized views (NOT caching)
- ✅ Performance targets
- ✅ NO CACHING policy

---

## 18. IMPLEMENTATION NOTES

### 18.1 Request Body vs Query Parameters

**MANDATORY:** All filter parameters MUST be sent in the request body, NOT query parameters. This allows for complex filter structures and better performance.

### 18.2 Time Range Handling

**MANDATORY:** Backend must calculate date ranges based on `TimeRange` value. Do NOT rely on frontend to send exact dates for predefined ranges (today, yesterday, etc.).

### 18.3 Comparison Period Calculation

**MANDATORY:** When `compareWithPreviousPeriod: true`, backend must calculate the previous period automatically based on the current period duration.

### 18.4 Parallel Query Execution

**RECOMMENDED:** When `include` array has multiple items, execute all queries in parallel for optimal performance.

### 18.5 Error Handling

**MANDATORY:** All endpoints must return standardized error responses with error codes, messages, and details.

### 18.6 Date/Time Format

**MANDATORY:** All dates must be in ISO 8601 format with UTC timezone.

---

## 19. TESTING SCENARIOS

### 19.1 Basic Analytics Request

**Test:** Request key metrics for last 30 days

**Request:**
```json
{
  "action": "key_metrics",
  "timeRange": {
    "range": "last30days",
    "compareWithPreviousPeriod": false
  },
  "filters": {}
}
```

**Expected:** Response with key metrics data in < 100ms

### 19.2 Comparison Mode

**Test:** Request key metrics with comparison enabled

**Request:**
```json
{
  "action": "key_metrics",
  "timeRange": {
    "range": "last30days",
    "compareWithPreviousPeriod": true
  },
  "filters": {}
}
```

**Expected:** Response with current and previous period metrics

### 19.3 Custom Date Range

**Test:** Request analytics with custom date range

**Request:**
```json
{
  "action": "key_metrics",
  "timeRange": {
    "range": "custom",
    "customStartDate": "2024-01-01T00:00:00Z",
    "customEndDate": "2024-01-31T23:59:59Z",
    "compareWithPreviousPeriod": false
  },
  "filters": {}
}
```

**Expected:** Response with metrics for custom date range

### 19.4 Filtered Analytics

**Test:** Request analytics with multiple filters

**Request:**
```json
{
  "action": "key_metrics",
  "timeRange": {
    "range": "last30days",
    "compareWithPreviousPeriod": false
  },
  "filters": {
    "stage": ["new_lead", "qualified"],
    "priority": ["urgent", "high"],
    "source": ["whatsapp"]
  }
}
```

**Expected:** Response with filtered metrics

### 19.5 Consolidated Analytics

**Test:** Request multiple analytics sections in one request

**Request:**
```json
{
  "action": "get_analytics",
  "include": [
    "key_metrics",
    "timeline_distribution",
    "budget_distribution",
    "pipeline_health"
  ],
  "timeRange": {
    "range": "last30days",
    "compareWithPreviousPeriod": false
  },
  "filters": {}
}
```

**Expected:** Response with all requested sections in < 300ms

### 19.6 Stage Drill-Down

**Test:** Request customer list for a specific stage

**Request:**
```json
{
  "stageId": "qualified",
  "timeRange": {
    "range": "last30days",
    "compareWithPreviousPeriod": false
  },
  "filters": {},
  "pagination": {
    "page": 1,
    "limit": 50
  }
}
```

**Expected:** Response with stage summary and paginated customer list in < 200ms

### 19.7 Time-Series Data

**Test:** Request time-series data for total customers

**Request:**
```json
{
  "action": "get_time_series",
  "metric": "total_customers",
  "granularity": "daily",
  "timeRange": {
    "range": "last30days",
    "compareWithPreviousPeriod": false
  },
  "filters": {}
}
```

**Expected:** Response with daily time-series data in < 200ms

### 19.8 Performance Test

**Test:** Request analytics with millions of records

**Expected:** Response time < 100ms for key metrics, < 300ms for consolidated analytics

---

## END OF SPECIFICATION

This specification provides complete technical details for implementing the backend API for the Customers Hub Analytics page. All endpoints, data structures, performance optimizations, and error handling requirements are documented above.

**CRITICAL REMINDER:** This system handles **MILLIONS of records**. **ALL** performance optimizations in Section 13 are **MANDATORY**. **NO CACHING** is allowed. Response times must be **extremely fast**.
