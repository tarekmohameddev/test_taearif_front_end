# Adding a New Static Page - Complete Guide

## 🎯 Purpose

This document provides a **COMPLETE, STEP-BY-STEP guide** for adding a brand-new static page to the Live Editor system.

**For AI**: Follow these steps EXACTLY in order to integrate a new static page seamlessly.

**IMPORTANT**: Static pages are **always available** to all tenants, even if they don't exist in tenant data. They use default components and can be customized in the Live Editor.

---

## ⚡ Quick Start (For AI)

**To add a new static page (e.g., "property-requests/create"), execute these steps in order:**

### Step-by-Step Execution Order

```
STEP 1: Modify app/[...slug]/page.tsx
→ Handle multi-segment paths (e.g., ["property-requests", "create"])
→ Join segments to create slug: "property-requests/create"

STEP 2: Add default component in staticPageHelpers.ts
→ Add page slug to getDefaultComponentForStaticPage()
→ Define default component data structure

STEP 3: Add StaticPages data in defaultData.json
→ Add page to StaticPages object
→ Include all component data

STEP 4: Add meta tags in defaultData.json
→ Add page to WebsiteLayout.metaTags.pages

STEP 5: Update TenantPageWrapper.tsx (if needed)
→ Verify slugExists handles the new page
→ Verify componentsList handles the new page

STEP 6: Add page to Live Editor navigation
→ Add page to app/live-editor/layout.tsx in availablePages
→ Follow the pattern used for "project" and "property" pages
→ Set isStatic: true flag

STEP 7: Test
→ Verify page loads correctly
→ Verify default component appears
→ Verify page works without tenant data
→ Verify page appears in Live Editor navigation
```

### Key Variables to Replace

When using templates, replace these variables:

| Variable              | Example                    | Description                    |
| --------------------- | -------------------------- | ------------------------------ |
| `{PAGE_PATH}`         | `property-requests/create` | Full page path (can be multi-segment) |
| `{PAGE_SLUG}`         | `property-requests/create` | Slug used in code (joined segments) |
| `{COMPONENT_TYPE}`    | `inputs2`                  | Component type to use          |
| `{COMPONENT_NAME}`    | `inputs2`                  | Component name (variant)       |

### Files You'll Modify (5 existing files)

1. `app/[...slug]/page.tsx` (~10 lines modified)
2. `components/tenant/live-editor/effects/utils/staticPageHelpers.ts` (~100 lines added)
3. `lib/defaultData.json` (~200+ lines added)
4. `app/TenantPageWrapper.tsx` (~10 lines modified, if needed)
5. `app/live-editor/layout.tsx` (~50 lines added)

### Estimated Time

- **With this guide**: 30-45 minutes
- **For AI with access to templates**: 5-10 minutes

### Verification Checklist

After completing all steps, verify:

- [ ] Page URL works (e.g., `/property-requests/create`)
- [ ] Page loads without tenant data
- [ ] Default component appears correctly
- [ ] Page appears in Live Editor (if applicable)
- [ ] Can edit and save page data
- [ ] Meta tags work correctly

---

## 📋 Prerequisites

Before adding a new static page, ensure you understand:

1. **Static Pages System** - Read `docs/important/liveEditor/STATIC_PAGES_SYSTEM.md`
2. **Multi-level Pages** - Understand `lib-liveeditor/multiLevelPages.ts`
3. **Component Architecture** - Read `docs/important/liveEditor/COMPONENT_ARCHITECTURE.md`

---

## 🗺️ Overview - What You'll Modify

When adding a new static page (e.g., "property-requests/create"), you will modify:

1. **Route handler** - `app/[...slug]/page.tsx` (handle multi-segment paths)
2. **Default component helper** - `components/tenant/live-editor/effects/utils/staticPageHelpers.ts`
3. **Default data** - `lib/defaultData.json` (StaticPages + meta tags)
4. **Page wrapper** - `app/TenantPageWrapper.tsx` (fallback support)
5. **Live Editor navigation** - `app/live-editor/layout.tsx` (add to availablePages)

**Total**: 5 files to modify

---

## 📊 File Modification Order

**CRITICAL**: Follow this exact order to avoid dependency errors.

```
Step 1: Modify route handler (app/[...slug]/page.tsx)
   ↓
Step 2: Add default component (staticPageHelpers.ts)
   ↓
Step 3: Add default data (defaultData.json)
   ↓
Step 4: Verify TenantPageWrapper (app/TenantPageWrapper.tsx)
   ↓
Step 5: Add to Live Editor navigation (app/live-editor/layout.tsx)
   ↓
Step 6: Test
```

---

## 🔧 Step 1: Modify Route Handler

**Location**: `app/[...slug]/page.tsx`

### Purpose

Handle multi-segment paths like `["property-requests", "create"]` and convert them to a single slug `"property-requests/create"`.

### Template

```typescript
// Handle complex paths: ["property-requests", "create"] -> slug: "property-requests/create"
// Or single slug: ["about"] -> slug: "about"
// Or multi-level: ["project", "samy"] -> slug: "project", dynamicSlug: "samy"
const firstSegment = slugArray?.[0] || "";
const isMultiLevel = isMultiLevelPage(firstSegment);

// For multi-level pages, keep the original behavior
// For other paths, join all segments to support complex paths like "property-requests/create"
const slug = isMultiLevel
  ? firstSegment
  : slugArray?.join("/") || "";
const dynamicSlug =
  isMultiLevel && slugArray?.length > 1 ? slugArray[1] : undefined;
```

### Important Notes

1. **Multi-level pages** (project, property, blog) keep original behavior
2. **Other paths** are joined with "/" to support complex paths
3. **Dynamic slug** is only used for multi-level pages

---

## 🔧 Step 2: Add Default Component

**Location**: `components/tenant/live-editor/effects/utils/staticPageHelpers.ts`

### Purpose

Define the default component that will be used when the static page has no data in tenant database.

### Template

```typescript
export function getDefaultComponentForStaticPage(slug: string) {
  const defaults: Record<string, any> = {
    // ... existing pages ...

    "{PAGE_SLUG}": {
      id: "{COMPONENT_NAME}",
      type: "{COMPONENT_TYPE}",
      name: "{Component Display Name}",
      componentName: "{COMPONENT_NAME}",
      data: {
        // Component data structure
        // Use existing component data as reference
        // Example: Copy from componentSettings in defaultData.json
      },
      position: 0,
      layout: { row: 0, col: 0, span: 2 },
    },
  };

  return defaults[slug] || null;
}
```

### Example: property-requests/create

```typescript
"property-requests/create": {
  id: "inputs2",
  type: "inputs2",
  name: "Inputs2",
  componentName: "inputs2",
  data: {
    id: "component",
    type: "unknown",
    visible: true,
    variant: "0",
    useStore: true,
    texts: {
      title: "Advanced Inputs System Title",
      subtitle: "This is a sample subtitle for the section.",
    },
    // ... rest of component data
  },
  position: 0,
  layout: { row: 0, col: 0, span: 2 },
},
```

### Important Notes

1. **Use existing component data** from `defaultData.json` as reference
2. **Match component structure** exactly
3. **Set position to 0** for single-component pages
4. **Include all required fields** for the component

---

## 🔧 Step 3: Add StaticPages Data

**Location**: `lib/defaultData.json`

### Purpose

Add the static page to the `StaticPages` object so it's available by default for all tenants.

### Template

```json
{
  "componentSettings": { ... },
  "globalComponentsData": { ... },
  "StaticPages": {
    "{PAGE_SLUG}": {
      "slug": "{PAGE_SLUG}",
      "components": [
        {
          "id": "{COMPONENT_ID}",
          "type": "{COMPONENT_TYPE}",
          "name": "{Component Name}",
          "componentName": "{COMPONENT_NAME}",
          "data": {
            // Full component data structure
            // Copy from componentSettings or create new
          },
          "position": 0,
          "layout": {
            "row": 0,
            "col": 0,
            "span": 2
          }
        }
      ]
    }
  },
  "WebsiteLayout": { ... }
}
```

### Example: property-requests/create

```json
"StaticPages": {
  "property-requests/create": {
    "slug": "property-requests/create",
    "components": [
      {
        "id": "0",
        "type": "inputs2",
        "name": "Inputs2",
        "componentName": "inputs2",
        "data": {
          "id": "component",
          "type": "unknown",
          "visible": true,
          "variant": "0",
          "useStore": true,
          "texts": {
            "title": "Advanced Inputs System Title",
            "subtitle": "This is a sample subtitle for the section."
          },
          // ... full component data
        },
        "position": 0,
        "layout": {
          "row": 0,
          "col": 0,
          "span": 2
        }
      }
    ]
  }
}
```

### Important Notes

1. **Place after `globalComponentsData`** and before `WebsiteLayout`
2. **Use same data structure** as in `componentSettings` if copying
3. **Include all required fields** for the component
4. **Set position to 0** for first component

---

## 🔧 Step 4: Add Meta Tags

**Location**: `lib/defaultData.json` → `WebsiteLayout.metaTags.pages`

### Purpose

Add SEO meta tags for the static page.

### Template

```json
"WebsiteLayout": {
  "metaTags": {
    "pages": [
      {
        // ... existing pages ...
        "{PAGE_SLUG}": {
          "TitleAr": "{Arabic Title}",
          "TitleEn": "{English Title}",
          "DescriptionAr": "{Arabic Description}",
          "DescriptionEn": "{English Description}",
          "KeywordsAr": "{Arabic Keywords}",
          "KeywordsEn": "{English Keywords}",
          "Author": "الموقع",
          "AuthorEn": "Website",
          "Robots": "index, follow",
          "RobotsEn": "index, follow",
          "og:title": "{OG Title}",
          "og:description": "{OG Description}",
          "og:keywords": "{OG Keywords}",
          "og:author": "الموقع",
          "og:robots": "index, follow",
          "og:url": "",
          "og:image": "",
          "og:type": "website",
          "og:locale": "ar",
          "og:locale:alternate": "en",
          "og:site_name": "الموقع",
          "og:image:width": null,
          "og:image:height": null,
          "og:image:type": null,
          "og:image:alt": "{Image Alt Text}"
        }
      }
    ]
  }
}
```

### Example: property-requests/create

```json
"property-requests/create": {
  "TitleAr": "إنشاء طلب عقار",
  "TitleEn": "Create Property Request",
  "DescriptionAr": "إنشاء طلب جديد للحصول على عقار يناسب احتياجاتك",
  "DescriptionEn": "Create a new property request to find the property that suits your needs",
  "KeywordsAr": "إنشاء طلب, طلب عقار, عقارات, طلب جديد",
  "KeywordsEn": "create request, property request, real estate, new request",
  "Author": "الموقع",
  "AuthorEn": "Website",
  "Robots": "index, follow",
  "RobotsEn": "index, follow",
  "og:title": "إنشاء طلب عقار",
  "og:description": "إنشاء طلب جديد للحصول على عقار يناسب احتياجاتك",
  "og:keywords": "إنشاء طلب, طلب عقار, عقارات",
  "og:author": "الموقع",
  "og:robots": "index, follow",
  "og:url": "",
  "og:image": "",
  "og:type": "website",
  "og:locale": "ar",
  "og:locale:alternate": "en",
  "og:site_name": "الموقع",
  "og:image:width": null,
  "og:image:height": null,
  "og:image:type": null,
  "og:image:alt": "إنشاء طلب عقار"
}
```

### Important Notes

1. **Add to pages array** in `WebsiteLayout.metaTags.pages`
2. **Use page slug as key** (e.g., "property-requests/create")
3. **Provide both Arabic and English** translations
4. **Set appropriate SEO values**

---

## 🔧 Step 5: Verify TenantPageWrapper

**Location**: `app/TenantPageWrapper.tsx`

### Purpose

Ensure `TenantPageWrapper` handles the new static page correctly, especially the fallback mechanism.

### Check slugExists

The `slugExists` function should already handle static pages with fallback:

```typescript
// ⭐ Priority 2.5: Check if it's a known static page (has default component)
// This ensures static pages are always available even if not in tenantData
const defaultStaticComponent = getDefaultComponentForStaticPage(slug);
if (defaultStaticComponent) {
  return true;
}
```

### Check componentsList

The `componentsList` function should already handle static pages with fallback:

```typescript
// ⭐ Priority 3.5: Check if it's a known static page (has default component)
// This ensures static pages are always available even if not in tenantData
const defaultStaticComponent = getDefaultComponentForStaticPage(slug);
if (defaultStaticComponent) {
  return [
    {
      id: defaultStaticComponent.id,
      componentName: defaultStaticComponent.componentName,
      data: defaultStaticComponent.data,
      position: defaultStaticComponent.position || 0,
    },
  ];
}
```

### Important Notes

1. **These fallbacks should already exist** from previous implementation
2. **If missing**, add them following the pattern above
3. **Import required function**: `getDefaultComponentForStaticPage`

---

## 🔧 Step 6: Add Page to Live Editor Navigation

**Location**: `app/live-editor/layout.tsx`

### Purpose

Add the static page to the `availablePages` list in Live Editor so it appears in the navigation menu, similar to "صفحة المشروع" (Project Page) and "صفحة العقار" (Property Page).

### Template

Add the page after the property page section (around line 1538):

```typescript
// ⭐ إضافة صفحة {PAGE_NAME} بشكل إجباري
const {PAGE_SLUG}PageExists = pages.some(
  (page) => page.slug === "{PAGE_SLUG}" || page.path === "/{PAGE_SLUG}",
);
if (!{PAGE_SLUG}PageExists) {
  // البحث عن بيانات SEO لصفحة {PAGE_SLUG} في WebsiteLayout
  let {PAGE_SLUG}SeoData = null;
  if (websiteLayout?.metaTags?.pages) {
    {PAGE_SLUG}SeoData = websiteLayout.metaTags.pages.find(
      (page: any) => page.path === "/{PAGE_SLUG}" || page.path === "{PAGE_SLUG}",
    );
  }

  const has{PAGE_SLUG}SeoData =
    {PAGE_SLUG}SeoData &&
    ({PAGE_SLUG}SeoData.TitleAr ||
      {PAGE_SLUG}SeoData.TitleEn ||
      {PAGE_SLUG}SeoData.DescriptionAr ||
      {PAGE_SLUG}SeoData.DescriptionEn);

  pages.push({
    slug: "{PAGE_SLUG}",
    name: locale === "ar" ? "{ARABIC_PAGE_NAME}" : "{ENGLISH_PAGE_NAME}",
    path: "/{PAGE_SLUG}",
    isStatic: true, // ⭐ علامة للصفحات الثابتة
    seo: has{PAGE_SLUG}SeoData
      ? {
          TitleAr: {PAGE_SLUG}SeoData.TitleAr,
          TitleEn: {PAGE_SLUG}SeoData.TitleEn,
          DescriptionAr: {PAGE_SLUG}SeoData.DescriptionAr,
          DescriptionEn: {PAGE_SLUG}SeoData.DescriptionEn,
          KeywordsAr: {PAGE_SLUG}SeoData.KeywordsAr,
          KeywordsEn: {PAGE_SLUG}SeoData.KeywordsEn,
          Author: {PAGE_SLUG}SeoData.Author,
          AuthorEn: {PAGE_SLUG}SeoData.AuthorEn,
          Robots: {PAGE_SLUG}SeoData.Robots,
          RobotsEn: {PAGE_SLUG}SeoData.RobotsEn,
          "og:title": {PAGE_SLUG}SeoData["og:title"],
          "og:description": {PAGE_SLUG}SeoData["og:description"],
          "og:keywords": {PAGE_SLUG}SeoData["og:keywords"],
          "og:author": {PAGE_SLUG}SeoData["og:author"],
          "og:robots": {PAGE_SLUG}SeoData["og:robots"],
          "og:url": {PAGE_SLUG}SeoData["og:url"],
          "og:image": {PAGE_SLUG}SeoData["og:image"],
          "og:type": {PAGE_SLUG}SeoData["og:type"],
          "og:locale": {PAGE_SLUG}SeoData["og:locale"],
          "og:locale:alternate": {PAGE_SLUG}SeoData["og:locale:alternate"],
          "og:site_name": {PAGE_SLUG}SeoData["og:site_name"],
          "og:image:width": {PAGE_SLUG}SeoData["og:image:width"],
          "og:image:height": {PAGE_SLUG}SeoData["og:image:height"],
          "og:image:type": {PAGE_SLUG}SeoData["og:image:type"],
          "og:image:alt": {PAGE_SLUG}SeoData["og:image:alt"],
        }
      : getDefaultSeoData("{PAGE_SLUG}"),
  });
}
```

### Example: property-requests/create

```typescript
// ⭐ إضافة صفحة إنشاء طلب عقار بشكل إجباري
const propertyRequestsCreatePageExists = pages.some(
  (page) => page.slug === "property-requests/create" || page.path === "/property-requests/create",
);
if (!propertyRequestsCreatePageExists) {
  // البحث عن بيانات SEO لصفحة property-requests/create في WebsiteLayout
  let propertyRequestsCreateSeoData = null;
  if (websiteLayout?.metaTags?.pages) {
    propertyRequestsCreateSeoData = websiteLayout.metaTags.pages.find(
      (page: any) => page.path === "/property-requests/create" || page.path === "property-requests/create",
    );
  }

  const hasPropertyRequestsCreateSeoData =
    propertyRequestsCreateSeoData &&
    (propertyRequestsCreateSeoData.TitleAr ||
      propertyRequestsCreateSeoData.TitleEn ||
      propertyRequestsCreateSeoData.DescriptionAr ||
      propertyRequestsCreateSeoData.DescriptionEn);

  pages.push({
    slug: "property-requests/create",
    name: locale === "ar" ? "إنشاء طلب عقار" : "Create Property Request",
    path: "/property-requests/create",
    isStatic: true, // ⭐ علامة للصفحات الثابتة
    seo: hasPropertyRequestsCreateSeoData
      ? {
          TitleAr: propertyRequestsCreateSeoData.TitleAr,
          TitleEn: propertyRequestsCreateSeoData.TitleEn,
          DescriptionAr: propertyRequestsCreateSeoData.DescriptionAr,
          DescriptionEn: propertyRequestsCreateSeoData.DescriptionEn,
          KeywordsAr: propertyRequestsCreateSeoData.KeywordsAr,
          KeywordsEn: propertyRequestsCreateSeoData.KeywordsEn,
          Author: propertyRequestsCreateSeoData.Author,
          AuthorEn: propertyRequestsCreateSeoData.AuthorEn,
          Robots: propertyRequestsCreateSeoData.Robots,
          RobotsEn: propertyRequestsCreateSeoData.RobotsEn,
          "og:title": propertyRequestsCreateSeoData["og:title"],
          "og:description": propertyRequestsCreateSeoData["og:description"],
          "og:keywords": propertyRequestsCreateSeoData["og:keywords"],
          "og:author": propertyRequestsCreateSeoData["og:author"],
          "og:robots": propertyRequestsCreateSeoData["og:robots"],
          "og:url": propertyRequestsCreateSeoData["og:url"],
          "og:image": propertyRequestsCreateSeoData["og:image"],
          "og:type": propertyRequestsCreateSeoData["og:type"],
          "og:locale": propertyRequestsCreateSeoData["og:locale"],
          "og:locale:alternate": propertyRequestsCreateSeoData["og:locale:alternate"],
          "og:site_name": propertyRequestsCreateSeoData["og:site_name"],
          "og:image:width": propertyRequestsCreateSeoData["og:image:width"],
          "og:image:height": propertyRequestsCreateSeoData["og:image:height"],
          "og:image:type": propertyRequestsCreateSeoData["og:image:type"],
          "og:image:alt": propertyRequestsCreateSeoData["og:image:alt"],
        }
      : getDefaultSeoData("property-requests/create"),
  });
}
```

### Important Notes

1. **Place after property page section** (around line 1538)
2. **Use same pattern** as project and property pages
3. **Set isStatic: true** to mark it as a static page
4. **Check for existing page** before adding
5. **Use SEO data** from WebsiteLayout if available
6. **Fallback to getDefaultSeoData** if no SEO data found
7. **Handle multi-segment paths** correctly in slug and path

### Location in File

Find the section after property page (around line 1538) and add your page there:

```typescript
// After property page section...

// ⭐ إضافة صفحة {YOUR_PAGE} بشكل إجباري
// ... your code here ...
```

---

## ✅ Step 7: Test Integration

### 6.1: Test Page Access

1. Navigate to the page URL (e.g., `/property-requests/create`)
2. Verify page loads without errors
3. Verify default component appears
4. Verify page works without tenant data

### 6.2: Test with Tenant

1. Access page with tenant subdomain
2. Verify page loads correctly
3. Verify can edit in Live Editor (if applicable)
4. Verify changes save correctly

### 6.3: Test Meta Tags

1. Check page source
2. Verify meta tags are correct
3. Verify Open Graph tags work

---

## 📊 Complete Checklist

Use this checklist to ensure you've completed all steps:

- [ ] Step 1: Modified `app/[...slug]/page.tsx`
  - [ ] Handles multi-segment paths
  - [ ] Joins segments correctly
  - [ ] Preserves multi-level page behavior
- [ ] Step 2: Added default component in `staticPageHelpers.ts`
  - [ ] Added page slug to `getDefaultComponentForStaticPage()`
  - [ ] Defined complete component data structure
  - [ ] Matched existing component structure
- [ ] Step 3: Added StaticPages data in `defaultData.json`
  - [ ] Added page to `StaticPages` object
  - [ ] Included all component data
  - [ ] Set correct position and layout
- [ ] Step 4: Added meta tags in `defaultData.json`
  - [ ] Added to `WebsiteLayout.metaTags.pages`
  - [ ] Provided Arabic and English translations
  - [ ] Set appropriate SEO values
- [ ] Step 5: Verified `TenantPageWrapper.tsx`
  - [ ] `slugExists` handles the page
  - [ ] `componentsList` handles the page
  - [ ] Fallback mechanism works
- [ ] Step 6: Added page to Live Editor navigation
  - [ ] Added to `app/live-editor/layout.tsx`
  - [ ] Followed project/property page pattern
  - [ ] Set isStatic: true flag
  - [ ] Added SEO data handling
  - [ ] Page appears in navigation menu
- [ ] Step 7: Tested integration
  - [ ] Page loads correctly
  - [ ] Default component appears
  - [ ] Works without tenant data
  - [ ] Meta tags work correctly
  - [ ] Page appears in Live Editor navigation

---

## 🎯 Common Patterns

### Pattern 1: Single Component Static Page

Most static pages use a single component:

```typescript
// In staticPageHelpers.ts
"{PAGE_SLUG}": {
  id: "{COMPONENT_NAME}",
  type: "{COMPONENT_TYPE}",
  name: "{Component Name}",
  componentName: "{COMPONENT_NAME}",
  data: { /* component data */ },
  position: 0,
  layout: { row: 0, col: 0, span: 2 },
}
```

### Pattern 2: Multi-Component Static Page

Some static pages may need multiple components:

```typescript
// In defaultData.json
"StaticPages": {
  "{PAGE_SLUG}": {
    "slug": "{PAGE_SLUG}",
    "components": [
      {
        "id": "0",
        "type": "hero",
        "componentName": "hero1",
        "data": { /* hero data */ },
        "position": 0
      },
      {
        "id": "1",
        "type": "inputs2",
        "componentName": "inputs2",
        "data": { /* form data */ },
        "position": 1
      }
    ]
  }
}
```

### Pattern 3: Using Existing Component Data

If you want to use data from an existing page:

1. Find the page in `componentSettings` in `defaultData.json`
2. Copy the component data structure
3. Use it in `StaticPages` and `staticPageHelpers.ts`

---

## 🚨 Common Mistakes to Avoid

### Mistake 1: Wrong Path Format

❌ **Wrong**:

```typescript
// In app/[...slug]/page.tsx
const slug = slugArray?.[0] || ""; // Only first segment!
```

✅ **Correct**:

```typescript
// Join all segments for non-multi-level pages
const slug = isMultiLevel
  ? firstSegment
  : slugArray?.join("/") || "";
```

---

### Mistake 2: Missing Default Component

❌ **Wrong**:

```typescript
// Only added to defaultData.json, forgot staticPageHelpers.ts
// Page won't work without tenant data!
```

✅ **Correct**:

```typescript
// Add to BOTH:
// 1. staticPageHelpers.ts (for fallback)
// 2. defaultData.json (for default data)
```

---

### Mistake 3: Wrong Slug Format

❌ **Wrong**:

```typescript
// In staticPageHelpers.ts
"property-requests/create": { ... } // Correct
// But in defaultData.json
"propertyRequestsCreate": { ... } // Wrong! Doesn't match!
```

✅ **Correct**:

```typescript
// Use EXACT same slug everywhere:
// - staticPageHelpers.ts: "property-requests/create"
// - defaultData.json StaticPages: "property-requests/create"
// - defaultData.json metaTags: "property-requests/create"
```

---

### Mistake 4: Not Testing Without Tenant Data

❌ **Wrong**:

```typescript
// Only tested with tenant that has the page in database
// Page breaks for new tenants!
```

✅ **Correct**:

```typescript
// Test with:
// 1. New tenant (no data)
// 2. Existing tenant (with data)
// 3. Existing tenant (without page data)
```

---

## 🎓 Advanced Topics

### Topic 1: Multi-Segment Paths

The system now supports paths with multiple segments:

- `["property-requests", "create"]` → `"property-requests/create"`
- `["products", "category", "item"]` → `"products/category/item"`
- `["about", "team"]` → `"about/team"`

**Important**: Multi-level pages (project, property, blog) keep their original behavior where the first segment is the page type and the second is the dynamic slug.

---

### Topic 2: Default Component Priority

The system checks for static page data in this order:

1. `editorStore.staticPagesData[slug]` (from database)
2. `tenantData.StaticPages[slug]` (from getTenant)
3. `getDefaultComponentForStaticPage(slug)` (fallback)
4. Regular page data (componentSettings)

This ensures static pages **always work** even without tenant data.

---

### Topic 3: Live Editor Integration

Static pages can be edited in Live Editor:

1. Navigate to the page in Live Editor
2. Page loads with default component
3. Can add/remove/edit components
4. Changes save to `staticPagesData`
5. Changes persist across sessions

---

## 📖 Additional Resources

### Related Documentation

- [Static Pages System](./liveEditor/STATIC_PAGES_SYSTEM.md) - Static pages overview
- [Multi-Level Pages](../lib-liveeditor/multiLevelPages.ts) - Multi-level page handling
- [Component Architecture](./liveEditor/COMPONENT_ARCHITECTURE.md) - Component system
- [State Management](./liveEditor/STATE_MANAGEMENT.md) - Store architecture

### Example Static Pages to Study

**Simple Static Page**: `property-requests/create`

- Single component (inputs2)
- Multi-segment path
- Default component fallback

**Multi-Level Static Page**: `project`, `property`

- Dynamic slug support
- Always available
- Default component fallback

---

## 🎯 Summary

To add a new static page:

1. **Modify route handler** to support multi-segment paths
2. **Add default component** in `staticPageHelpers.ts`
3. **Add StaticPages data** in `defaultData.json`
4. **Add meta tags** in `defaultData.json`
5. **Verify TenantPageWrapper** handles the page
6. **Test thoroughly** with and without tenant data

**Total Time**: 30-45 minutes for a complete static page

---

## 📝 Step 6 Details: Live Editor Navigation

### Why This Step is Important

Adding the static page to `app/live-editor/layout.tsx` ensures:

1. **Page appears in Live Editor navigation** - Users can see and access the page
2. **Consistent with other static pages** - Follows the same pattern as project/property pages
3. **SEO data integration** - Uses meta tags from WebsiteLayout
4. **Visual indicator** - Shows static page badge (🔒) in navigation

### Finding the Right Location

The code should be added in the `availablePages` useMemo function, after the property page section:

```typescript
// Around line 1426-1538
// ⭐ إضافة صفحة المشروع بشكل إجباري
// ... project page code ...

// ⭐ إضافة صفحة العقار بشكل إجباري
// ... property page code ...

// ⭐ إضافة صفحة {YOUR_PAGE} بشكل إجباري
// ... your page code here ...
```

### Variable Naming

For multi-segment paths like "property-requests/create", use camelCase for variable names:

```typescript
// Good: propertyRequestsCreatePageExists
// Good: propertyRequestsCreateSeoData
// Good: hasPropertyRequestsCreateSeoData

// Bad: property-requests-create-page-exists (hyphens not allowed)
// Bad: propertyRequestsCreate-pageExists (mixed styles)
```

### Handling Multi-Segment Paths

For paths with "/" (like "property-requests/create"):

```typescript
// Check both slug and path formats
const pageExists = pages.some(
  (page) => 
    page.slug === "property-requests/create" || 
    page.path === "/property-requests/create"
);

// Use same format in push
pages.push({
  slug: "property-requests/create",
  path: "/property-requests/create",
  // ...
});
```

---

**For AI**: This guide provides COMPLETE coverage for adding any new static page. Follow each step exactly to ensure the page works for all tenants, even without database data.

---

**Status**: ✅ Complete Guide  
**Version**: 1.0  
**Last Updated**: 2025-01-XX  
**Maintenance**: Update when adding new integration points

