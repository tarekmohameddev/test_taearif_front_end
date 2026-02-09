# Ready-to-Use Prompts for Adding New Static Pages

## 🎯 Purpose

Copy-paste these prompts directly into Cursor AI to automatically create new static pages.

**⚠️ CRITICAL**: Before executing, you MUST provide the page path. The AI will ask for it if not provided.

---

## 📋 Prompt Template 1: Simple Static Page (Single Component)

```
Create a new static page following the guide in @docs/important/components/ADD_NEW_STATIC_PAGE.md

⚠️ REQUIRED: Provide the page path first!
Page Path: {PAGE_PATH}
Example: "property-requests/create" or "products/list" or "about/team"

Component Details:
- Page Path: {PAGE_PATH}
- Component Type: {COMPONENT_TYPE}
- Component Name: {COMPONENT_NAME}
- Description: {BRIEF_DESCRIPTION}

Default Component Data:
{
  // Use existing component data as reference
  // Or specify the component structure here
}

Meta Tags:
- Title (Ar): {ARABIC_TITLE}
- Title (En): {ENGLISH_TITLE}
- Description (Ar): {ARABIC_DESCRIPTION}
- Description (En): {ENGLISH_DESCRIPTION}
- Keywords (Ar): {ARABIC_KEYWORDS}
- Keywords (En): {ENGLISH_KEYWORDS}

Follow ALL 7 steps in the guide:
1. Modify app/[...slug]/page.tsx (if multi-segment path)
2. Add default component in staticPageHelpers.ts
3. Add StaticPages data in defaultData.json
4. Add meta tags in defaultData.json
5. Verify TenantPageWrapper.tsx
6. Add page to Live Editor navigation (app/live-editor/layout.tsx)
7. Test integration

Reference these files for examples:
@components/tenant/live-editor/effects/utils/staticPageHelpers.ts
@lib/defaultData.json (StaticPages section)
@app/TenantPageWrapper.tsx
```

**Replace**:

- `{PAGE_PATH}`: Full path like "property-requests/create" or "products/list"
- `{COMPONENT_TYPE}`: Component type (e.g., "inputs2", "hero", "grid")
- `{COMPONENT_NAME}`: Component variant name (e.g., "inputs2", "hero1")
- `{BRIEF_DESCRIPTION}`: Short description of the page
- `{ARABIC_TITLE}`, `{ENGLISH_TITLE}`, etc.: Meta tag values

---

## 📋 Prompt Template 2: Static Page with Existing Component Data

```
Create a new static page using existing component data from {SOURCE_PAGE} following @docs/important/components/ADD_NEW_STATIC_PAGE.md

⚠️ REQUIRED: Provide the page path first!
Page Path: {PAGE_PATH}

Component Source:
- Copy component data from: {SOURCE_PAGE} in componentSettings
- Component Type: {COMPONENT_TYPE}
- Component Name: {COMPONENT_NAME}

Meta Tags:
- Title (Ar): {ARABIC_TITLE}
- Title (En): {ENGLISH_TITLE}
- Description (Ar): {ARABIC_DESCRIPTION}
- Description (En): {ENGLISH_DESCRIPTION}

Steps:
1. Find {SOURCE_PAGE} in defaultData.json componentSettings
2. Copy the component data structure
3. Add to StaticPages in defaultData.json
4. Add to getDefaultComponentForStaticPage() in staticPageHelpers.ts
5. Add meta tags
6. Test

Reference:
@lib/defaultData.json (componentSettings.{SOURCE_PAGE})
```

**Replace**:

- `{PAGE_PATH}`: New static page path
- `{SOURCE_PAGE}`: Existing page to copy from (e.g., "create-request")
- `{COMPONENT_TYPE}`: Component type
- `{COMPONENT_NAME}`: Component name

---

## 📋 Prompt Template 3: Multi-Component Static Page

```
Create a new static page with MULTIPLE components following @docs/important/components/ADD_NEW_STATIC_PAGE.md

⚠️ REQUIRED: Provide the page path first!
Page Path: {PAGE_PATH}

Components:
1. Component 1:
   - Type: {COMPONENT1_TYPE}
   - Name: {COMPONENT1_NAME}
   - Position: 0
   - Data: {COMPONENT1_DATA}

2. Component 2:
   - Type: {COMPONENT2_TYPE}
   - Name: {COMPONENT2_NAME}
   - Position: 1
   - Data: {COMPONENT2_DATA}

Meta Tags:
- Title (Ar): {ARABIC_TITLE}
- Title (En): {ENGLISH_TITLE}

Follow Pattern 2 from the guide (Multi-Component Static Page).

Don't forget to add the page to Live Editor navigation in app/live-editor/layout.tsx (Step 6).

Reference:
@lib/defaultData.json (StaticPages structure)
@app/live-editor/layout.tsx (for navigation)
```

---

## 🎯 Example: Creating "property-requests/create" Static Page

### Prompt for Cursor AI

```
Create a new static page "property-requests/create" following the complete guide in @docs/important/components/ADD_NEW_STATIC_PAGE.md

Page Path: property-requests/create

Component Details:
- Component Type: inputs2
- Component Name: inputs2
- Description: Property request creation form page

Component Data Source:
- Copy from: "create-request" in componentSettings
- Use the inputs2 component data structure

Meta Tags:
- Title (Ar): "إنشاء طلب عقار"
- Title (En): "Create Property Request"
- Description (Ar): "إنشاء طلب جديد للحصول على عقار يناسب احتياجاتك"
- Description (En): "Create a new property request to find the property that suits your needs"
- Keywords (Ar): "إنشاء طلب, طلب عقار, عقارات, طلب جديد"
- Keywords (En): "create request, property request, real estate, new request"

Execute ALL 7 steps from the guide:

STEP 1: Modify app/[...slug]/page.tsx
- Ensure it handles multi-segment paths
- Join ["property-requests", "create"] to "property-requests/create"
- Preserve multi-level page behavior

STEP 2: Add default component in staticPageHelpers.ts
- Add "property-requests/create" to getDefaultComponentForStaticPage()
- Use inputs2 component data from create-request as reference
- Include all required fields

STEP 3: Add StaticPages data in defaultData.json
- Add "property-requests/create" to StaticPages object
- Copy component data from componentSettings.create-request
- Set position: 0, layout: { row: 0, col: 0, span: 2 }

STEP 4: Add meta tags in defaultData.json
- Add to WebsiteLayout.metaTags.pages
- Use the meta tag values provided above

STEP 5: Verify TenantPageWrapper.tsx
- Check slugExists handles the page (should already work)
- Check componentsList handles the page (should already work)
- Verify fallback mechanism works

STEP 6: Add page to Live Editor navigation
- Add to app/live-editor/layout.tsx in availablePages
- Follow the pattern used for "project" and "property" pages
- Set isStatic: true flag
- Add SEO data handling
- Place after property page section (around line 1538)

STEP 7: Test
- Verify page loads at /property-requests/create
- Verify works without tenant data
- Verify default component appears
- Verify page appears in Live Editor navigation menu

Reference Files:
@docs/important/components/ADD_NEW_STATIC_PAGE.md (main guide)
@components/tenant/live-editor/effects/utils/staticPageHelpers.ts
@lib/defaultData.json (componentSettings.create-request)
@app/TenantPageWrapper.tsx
@app/live-editor/layout.tsx (for Step 6 - navigation)
```

---

## 💡 Tips for Using These Prompts

### 1. **Always Provide Page Path First**

The AI MUST know the page path before starting. If you forget, the AI will ask:

```
⚠️ REQUIRED: Please provide the page path.
Example: "property-requests/create" or "products/list"
```

### 2. **Be Specific About Component**

Specify which component to use:

```
Component Type: inputs2
Component Name: inputs2
```

Or reference an existing page:

```
Copy component data from: "create-request" in componentSettings
```

### 3. **Use Existing Data as Reference**

If you want to use data from an existing page:

```
Component Data Source:
- Copy from: "create-request" in componentSettings
- Component: inputs2
```

### 4. **One Step at a Time (Optional)**

For complex pages, you can break it down:

```
First, modify app/[...slug]/page.tsx to handle multi-segment paths
following @docs/important/components/ADD_NEW_STATIC_PAGE.md Step 1
```

Then after reviewing:

```
Now add default component in staticPageHelpers.ts
following @docs/important/components/ADD_NEW_STATIC_PAGE.md Step 2
```

### 5. **Verify After Each Major Step**

After Steps 1-4, run:

```
Verify the static page integration:
1. Check TypeScript errors
2. Verify JSON syntax in defaultData.json
3. Test page loads correctly
4. Verify default component appears
```

---

## 📊 Expected Results

### Files Modified (Typical Static Page)

```
✅ app/[...slug]/page.tsx (~10 lines modified - if multi-segment)
✅ components/tenant/live-editor/effects/utils/staticPageHelpers.ts (~100 lines added)
✅ lib/defaultData.json (~200+ lines added)
✅ app/TenantPageWrapper.tsx (verification only, usually no changes needed)
```

### Total Time with AI

- **Simple static page**: 5-10 minutes
- **Complex static page (multi-component)**: 10-15 minutes
- **With custom component data**: 10-15 minutes

---

## 🚨 Common AI Mistakes to Watch For

### 1. **Forgetting to Join Path Segments**

AI might forget to join segments in `app/[...slug]/page.tsx`. Verify:

```typescript
// Should join segments for non-multi-level pages
const slug = isMultiLevel
  ? firstSegment
  : slugArray?.join("/") || "";
```

### 2. **Wrong Slug Format**

Ensure consistent slug format:

- `staticPageHelpers.ts`: `"property-requests/create"`
- `defaultData.json StaticPages`: `"property-requests/create"`
- `defaultData.json metaTags`: `"property-requests/create"`

### 3. **Missing Default Component**

AI might add to `defaultData.json` but forget `staticPageHelpers.ts`. Remind it:

```
Don't forget to add the default component in staticPageHelpers.ts
for the fallback mechanism to work
```

### 4. **Incomplete Component Data**

AI might copy partial component data. Verify:

```
Ensure all required fields are included in the component data
structure. Compare with the source component in componentSettings.
```

### 5. **Forgetting Live Editor Navigation**

AI might forget to add the page to Live Editor navigation. Remind it:

```
Don't forget Step 6: Add the page to app/live-editor/layout.tsx
following the pattern used for project and property pages.
The page should appear in the navigation menu.
```

---

## ✅ Final Verification Prompt

After AI completes all steps, use this to verify:

```
Verify the static page "{PAGE_PATH}" integration:

1. Check TypeScript errors:
   - Run TypeScript check
   - Ensure no import errors
   - Ensure no type errors

2. Check JSON syntax:
   - Verify defaultData.json is valid JSON
   - Check StaticPages structure
   - Check metaTags structure

3. Check slug consistency:
   - Verify same slug used everywhere
   - Check path format matches

4. Check Live Editor navigation:
   - Verify page added to app/live-editor/layout.tsx
   - Verify page appears in navigation menu
   - Verify isStatic: true flag is set
   - Verify SEO data handling works

5. Test page access:
5. Check Live Editor navigation:
   - Verify page added to app/live-editor/layout.tsx
   - Verify page appears in navigation menu
   - Verify isStatic: true flag is set
   - Verify SEO data handling works

6. Test page access:
   - Navigate to /{PAGE_PATH}
   - Verify page loads
   - Verify default component appears
   - Verify works without tenant data

7. Test with tenant:
   - Access with tenant subdomain
   - Verify page works
   - Verify can edit in Live Editor (if applicable)

Report any issues found.
```

---

## 🎯 Quick Reference

### Required Information Before Starting

1. **Page Path** (REQUIRED)
   - Example: `"property-requests/create"`
   - Can be multi-segment: `"products/category/item"`

2. **Component Type**
   - Example: `"inputs2"`, `"hero"`, `"grid"`

3. **Component Name**
   - Example: `"inputs2"`, `"hero1"`

4. **Meta Tags** (optional but recommended)
   - Arabic and English titles
   - Descriptions
   - Keywords

### File Locations

- Route handler: `app/[...slug]/page.tsx`
- Default component: `components/tenant/live-editor/effects/utils/staticPageHelpers.ts`
- Default data: `lib/defaultData.json`
- Page wrapper: `app/TenantPageWrapper.tsx`
- Live Editor navigation: `app/live-editor/layout.tsx` (Step 6 - add to availablePages)

---

**Status**: ✅ Complete Prompt Guide  
**Version**: 1.0  
**Last Updated**: 2025-01-XX

