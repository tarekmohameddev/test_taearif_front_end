# Ready-to-Use Prompts for Adding New Components

## 🎯 Purpose

Copy-paste these prompts directly into Cursor AI to automatically create new components.

---

## 📋 Prompt Template 1: Simple Component (Single Variant)

```
Create a new component called "{COMPONENT_NAME}" following the guide in @docs/important/components/ADD_NEW_COMPONENT.md

Component Details:
- Type: {COMPONENT_NAME}
- Variants: 1 ({COMPONENT_NAME}1)
- Category: marketing
- Description: {BRIEF_DESCRIPTION}

Default Data Structure:
{
  visible: true,
  content: {
    title: "{DEFAULT_TITLE}",
    subtitle: "{DEFAULT_SUBTITLE}"
  },
  styling: {
    backgroundColor: "#ffffff",
    titleColor: "#1f2937"
  }
}

Follow ALL 9 steps in the guide:
1. Create {COMPONENT_NAME}Functions.ts
2. Create {COMPONENT_NAME}.ts structure
3. Update editorStore.ts
4. Update ComponentsList.tsx
5. Update componentsStructure/index.ts
6. Create {COMPONENT_NAME}1.tsx component
7. Update editorStoreFunctions/index.ts
8. Add translations
9. Verify integration

Use the exact templates from the guide and replace all instances of:
- "pricing" with "{COMPONENT_NAME}"
- "Pricing" with "{ComponentName}"

Reference these files for examples:
@context-liveeditor/editorStoreFunctions/heroFunctions.ts
@componentsStructure/hero.ts
@components/tenant/hero/hero1.tsx
```

**Replace**:

- `{COMPONENT_NAME}`: pricing, testimonials, gallery, etc.
- `{ComponentName}`: Pricing, Testimonials, Gallery, etc.
- `{BRIEF_DESCRIPTION}`: Short description of component
- `{DEFAULT_TITLE}`: Default title text
- `{DEFAULT_SUBTITLE}`: Default subtitle text

---

## 📋 Prompt Template 2: Complex Component (Multiple Variants)

```
Create a new component called "{COMPONENT_NAME}" with MULTIPLE variants following @docs/important/components/ADD_NEW_COMPONENT.md

Component Details:
- Type: {COMPONENT_NAME}
- Variants: {NUMBER} ({COMPONENT_NAME}1, {COMPONENT_NAME}2, ...)
- Category: {CATEGORY}
- Description: {DETAILED_DESCRIPTION}

Variant 1 - {VARIANT1_NAME}:
- Description: {VARIANT1_DESCRIPTION}
- Default data: {VARIANT1_DATA_STRUCTURE}

Variant 2 - {VARIANT2_NAME}:
- Description: {VARIANT2_DESCRIPTION}
- Default data: {VARIANT2_DATA_STRUCTURE}

Follow Pattern 1 from "Common Patterns" section:
1. Create separate getDefault{ComponentName}Data() for each variant
2. Add variant detection in ensureVariant
3. Create separate component files for each variant
4. Define separate fields in structure for each variant

Reference these multi-variant examples:
@context-liveeditor/editorStoreFunctions/heroFunctions.ts (2 variants)
@context-liveeditor/editorStoreFunctions/halfTextHalfImageFunctions.ts (3 variants)
@componentsStructure/hero.ts
```

---

## 📋 Prompt Template 3: Component with Array/List Items

```
Create a new component called "{COMPONENT_NAME}" with ARRAY of items following @docs/important/components/ADD_NEW_COMPONENT.md

Component Details:
- Type: {COMPONENT_NAME}
- Variants: 1
- Main Feature: Array of {ITEM_NAME} items
- Category: {CATEGORY}

Default Data Structure:
{
  visible: true,
  content: {
    title: "{TITLE}",
    subtitle: "{SUBTITLE}"
  },
  {ITEMS_ARRAY_NAME}: [
    {
      id: "1",
      {ITEM_FIELDS}
    }
  ]
}

Array Item Structure:
Each item in {ITEMS_ARRAY_NAME} should have:
- {FIELD1}: {TYPE1}
- {FIELD2}: {TYPE2}
- {FIELD3}: {TYPE3}

In the structure file, define the array field as:
{
  key: "{ITEMS_ARRAY_NAME}",
  label: "{ITEMS_LABEL}",
  type: "array",
  addLabel: "Add {ITEM_NAME}",
  itemLabel: "{ITEM_NAME}",
  of: [
    { key: "{FIELD1}", label: "{LABEL1}", type: "{TYPE1}" },
    { key: "{FIELD2}", label: "{LABEL2}", type: "{TYPE2}" },
    ...
  ]
}

Reference these array-based examples:
@context-liveeditor/editorStoreFunctions/testimonialsFunctions.ts
@context-liveeditor/editorStoreFunctions/contactCardsFunctions.ts
@componentsStructure/testimonials.ts
```

---

## 📋 Prompt Template 4: Form/Input Component

```
Create a new FORM component called "{COMPONENT_NAME}" following @docs/important/components/ADD_NEW_COMPONENT.md

Component Details:
- Type: {COMPONENT_NAME}
- Variants: 1
- Purpose: {FORM_PURPOSE}
- Submit Action: {API_ENDPOINT or ACTION}

Form Fields:
1. {FIELD1_NAME}: {FIELD1_TYPE} - {FIELD1_DESCRIPTION}
2. {FIELD2_NAME}: {FIELD2_TYPE} - {FIELD2_DESCRIPTION}
3. {FIELD3_NAME}: {FIELD3_TYPE} - {FIELD3_DESCRIPTION}

Default Data Structure:
{
  visible: true,
  fields: [
    {
      id: "{FIELD1_ID}",
      type: "{FIELD1_TYPE}",
      label: "{FIELD1_LABEL}",
      placeholder: "{FIELD1_PLACEHOLDER}",
      required: {true/false}
    }
  ],
  submitButton: {
    text: "{BUTTON_TEXT}",
    apiEndpoint: "{API_URL}",
    backgroundColor: "#059669"
  }
}

Reference this form example:
@context-liveeditor/editorStoreFunctions/inputs2Functions.ts
@componentsStructure/inputs2.ts
```

---

## 📋 Prompt Template 5: Global Component (Header/Footer Style)

```
Create a new GLOBAL component called "{COMPONENT_NAME}" following @docs/important/components/ADD_NEW_COMPONENT.md

Component Details:
- Type: {COMPONENT_NAME}
- Variants: 1
- Scope: GLOBAL (shared across all pages)
- Category: global

IMPORTANT - Global Component Requirements:
1. In editorStore.ts, add:
   - global{ComponentName}Data: ComponentData
   - setGlobal{ComponentName}Data()
   - updateGlobal{ComponentName}ByPath()

2. In component file, use globalData in merge:
   const mergedData = {
     ...getDefault{ComponentName}Data(),
     ...storeData,
     ...global{ComponentName}Data,  // Global data priority
     ...props
   };

3. In EditorSidebar, update global data instead of component data

Reference these global examples:
@context-liveeditor/editorStoreFunctions/headerFunctions.ts
@context-liveeditor/editorStoreFunctions/footerFunctions.ts
@components/tenant/header/header1.tsx

Follow Pattern 3 from "Common Patterns" section in the guide.
```

---

## 🎯 Example: Creating a "Pricing" Component

### Prompt for Cursor AI

```
Create a new component called "pricing" following the complete guide in @docs/important/components/ADD_NEW_COMPONENT.md

Component Details:
- Type: pricing
- Variants: 1 (pricing1)
- Category: marketing
- Description: Pricing plans section with card grid layout

Default Data Structure:
{
  visible: true,
  layout: {
    maxWidth: "1600px",
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: "2rem"
  },
  content: {
    title: "Our Pricing Plans",
    subtitle: "Choose the perfect plan for your needs"
  },
  plans: [
    {
      id: "basic",
      name: "Basic",
      price: 99,
      currency: "$",
      period: "month",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      highlighted: false
    }
  ],
  styling: {
    backgroundColor: "#ffffff",
    titleColor: "#1f2937",
    cardBackgroundColor: "#f9fafb",
    highlightColor: "#059669"
  }
}

Execute ALL 9 steps from the guide:

STEP 1: Create context-liveeditor/editorStoreFunctions/pricingFunctions.ts
- Use the complete template from Step 1
- Export getDefaultPricingData() with the structure above
- Export pricingFunctions with all 4 functions

STEP 2: Create componentsStructure/pricing.ts
- Use the complete template from Step 2
- Define fields for all data properties
- Plans array should use type: "array" with proper field definitions

STEP 3: Update context-liveeditor/editorStore.ts
- Import pricingFunctions
- Add pricingStates to interface
- Initialize pricingStates: {}
- Add "pricing" case to all 4 switch statements
- **CRITICAL**: Add "pricing" case to loadFromDatabase switch (use comp.id, not comp.componentName)
- Add specific functions (ensurePricingVariant, etc.)

STEP 4: Update lib-liveeditor/ComponentsList.tsx
- Import pricingStructure
- Add pricing to getComponents function
- Add pricing to COMPONENTS constant
- Add to homepage section components list

STEP 5: Update componentsStructure/index.ts
- Add: export { pricingStructure } from "./pricing";

STEP 6: Create components/tenant/pricing/pricing1.tsx
- Use the complete template from Step 6
- Follow 7-step component pattern
- **CRITICAL**: Include database data loading:
  - Create getTenantComponentData() function BEFORE useEffect
  - Use tenantComponentData in initialData
  - Add tenantComponentData to useEffect dependencies
- Render pricing cards grid
- Use mergedData for all values

STEP 7: Update context-liveeditor/editorStoreFunctions/index.ts
- Add: export * from "./pricingFunctions";

STEP 8: Add translations
- Add to lib/i18n/locales/ar.json: "pricing": {"display_name": "الأسعار"}
- Add to lib/i18n/locales/en.json: "pricing": {"display_name": "Pricing"}

Reference Files:
@docs/important/components/ADD_NEW_COMPONENT.md (main guide)
@docs/important/liveEditor/DATABASE_DATA_LOADING.md (database data loading guide)
@context-liveeditor/editorStoreFunctions/heroFunctions.ts (example functions)
@componentsStructure/hero.ts (example structure)
@components/tenant/hero/hero1.tsx (example component)
@components/tenant/partners/partners1.tsx (example with database loading)
@components/tenant/whyChooseUs/whyChooseUs1.tsx (example with database loading)

After completion, verify:
- Component appears in Live Editor
- Can add to canvas
- EditorSidebar works
- Can edit and save
```

---

## 🎯 Example: Creating a "Gallery" Component with Multiple Variants

### Prompt for Cursor AI

```
Create a new component called "gallery" with 2 variants following @docs/important/components/ADD_NEW_COMPONENT.md

Component Details:
- Type: gallery
- Variants: 2
  - gallery1: Grid layout (3 columns)
  - gallery2: Masonry layout
- Category: content
- Description: Image gallery with lightbox

Variant 1 (Gallery Grid):
{
  visible: true,
  layout: {
    type: "grid",
    columns: { mobile: 1, tablet: 2, desktop: 3 },
    gap: "1rem"
  },
  content: {
    title: "Our Gallery"
  },
  images: [
    {
      id: "1",
      src: "image.jpg",
      alt: "Image",
      caption: "Caption"
    }
  ]
}

Variant 2 (Gallery Masonry):
{
  visible: true,
  layout: {
    type: "masonry",
    columnWidth: "300px",
    gap: "1rem"
  },
  content: {
    title: "Our Gallery"
  },
  images: [...]  // Same structure
}

Follow Pattern 1 from "Common Patterns":
1. Create getDefaultGalleryData() for variant 1
2. Create getDefaultGallery2Data() for variant 2
3. Add variant detection in galleryFunctions.ensureVariant:
   const defaultData = variantId === "gallery2"
     ? getDefaultGallery2Data()
     : getDefaultGalleryData();
4. Create gallery1.tsx and gallery2.tsx separately
5. In galleryStructure, add both variants with different fields

Execute all 9 steps for BOTH variants.

Reference multi-variant examples:
@context-liveeditor/editorStoreFunctions/heroFunctions.ts
@context-liveeditor/editorStoreFunctions/halfTextHalfImageFunctions.ts
```

---

## 💡 Tips for Using These Prompts

### 1. **Be Specific**

Replace all `{PLACEHOLDERS}` with actual values before sending to Cursor

### 2. **Attach Reference Files**

Use `@filename` to attach example files for Cursor to reference

### 3. **One Step at a Time (Optional)**

For complex components, you can break it down:

```
First, create only Step 1: pricingFunctions.ts following @docs/important/components/ADD_NEW_COMPONENT.md
```

Then after reviewing:

```
Now create Step 2: pricing.ts structure following @docs/important/components/ADD_NEW_COMPONENT.md
```

### 4. **Verify After Each Major Step**

After Steps 1-7, run:

```
Verify the integration by checking:
1. No TypeScript errors
2. All imports resolve
3. Component type appears in COMPONENTS list
```

### 5. **Use Composer for Multi-File Changes**

For Steps 3-7 (updating existing files), use Cursor Composer (Ctrl+I / Cmd+I) to make changes across multiple files at once.

---

## 📊 Expected Results

### Files Created (Typical Simple Component)

```
✅ context-liveeditor/editorStoreFunctions/pricingFunctions.ts (150 lines)
✅ componentsStructure/pricing.ts (300 lines)
✅ components/tenant/pricing/pricing1.tsx (200 lines)
```

### Files Modified

```
✅ context-liveeditor/editorStore.ts (+20 lines)
✅ lib-liveeditor/ComponentsList.tsx (+25 lines)
✅ componentsStructure/index.ts (+1 line)
✅ context-liveeditor/editorStoreFunctions/index.ts (+1 line)
✅ lib/i18n/locales/ar.json (+3 lines)
✅ lib/i18n/locales/en.json (+3 lines)
```

### Total Time with AI

- **Simple component**: 5-10 minutes
- **Multi-variant component**: 10-15 minutes
- **Complex component with extended features**: 15-20 minutes

---

## 🚨 Common AI Mistakes to Watch For

### 1. **Forgetting Switch Cases**

AI might add import and state but forget one of the 4 switch cases. Verify all 4:

- ensureComponentVariant
- getComponentData
- setComponentData
- updateComponentByPath

### 2. **Wrong Naming Convention**

Ensure consistent naming:

- `pricingFunctions` (not `pricingFunction` or `PricingFunctions`)
- `pricingStates` (not `pricingState`)
- `pricingStructure` (not `PricingStructure`)

### 3. **Missing simpleFields in Structure**

AI might create only `fields` but forget `simpleFields`. Remind it:

```
Don't forget to add simpleFields array for simple editing mode
```

### 4. **Not Following 7-Step Pattern in Component**

The React component MUST follow the exact 7-step pattern. If AI deviates, ask:

```
Rewrite the component following the exact 7-step pattern from Step 6 in the guide
```

---

## ✅ Final Verification Prompt

After AI completes all steps, use this to verify:

```
Verify the "pricing" component integration:

1. Check TypeScript errors:
   - Run TypeScript check
   - Ensure no import errors
   - Ensure no type errors

2. Check file structure:
   - Confirm all 3 new files exist
   - Confirm all 4 files were updated correctly

3. Check naming consistency:
   - Search for "pricing" in all files
   - Ensure no typos (pricng, Pricing where should be pricing, etc.)

4. Check switch cases in editorStore.ts:
   - Confirm "pricing" case in ensureComponentVariant
   - Confirm "pricing" case in getComponentData
   - Confirm "pricing" case in setComponentData
   - Confirm "pricing" case in updateComponentByPath

5. Check ComponentsList.tsx:
   - Confirm pricing in getComponents
   - Confirm pricing in COMPONENTS
   - Confirm pricing in section.components array

Report any issues found.
```

---
