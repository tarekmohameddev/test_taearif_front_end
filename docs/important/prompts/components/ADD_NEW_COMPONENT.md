# Adding a New Component - Complete Guide

## 🎯 Purpose

This document provides a **COMPLETE, STEP-BY-STEP guide** for adding a brand-new component type to the Live Editor system from scratch.

**For AI**: Follow these steps EXACTLY in order to integrate a new component seamlessly.

---

## ⚡ Quick Start (For AI)

**To add a new component (e.g., "pricing"), execute these steps in order:**

### Step-by-Step Execution Order

```
STEP 1: Create pricingFunctions.ts
→ Location: context-liveeditor/editorStoreFunctions/pricingFunctions.ts
→ Template: See Step 1 below
→ Required: getDefaultPricingData() + pricingFunctions object

STEP 2: Create pricing.ts
→ Location: componentsStructure/pricing.ts
→ Template: See Step 2 below
→ Required: pricingStructure with fields

STEP 3: Update editorStore.ts
→ Add: import, state property, initialization, 4 switch cases, specific functions
→ Search for: "import { heroFunctions" to find import location
→ Search for: "heroStates:" to find state property location

STEP 4: Update ComponentsList.tsx
→ Add: import, getComponents entry, COMPONENTS entry
→ Search for: "import { heroStructure" to find import location

STEP 5: Update componentsStructure/index.ts
→ Add: export { pricingStructure } from "./pricing";

STEP 6: Create pricing1.tsx
→ Location: components/tenant/pricing/pricing1.tsx
→ Template: See Step 6 below
→ Required: Follow 7-step component pattern

STEP 7: Update editorStoreFunctions/index.ts
→ Add: export * from "./pricingFunctions";

STEP 8: Add translations (optional)
→ Update: lib/i18n/locales/ar.json and en.json

STEP 9: Test
→ Verify in Live Editor
```

### Key Variables to Replace

When using templates, replace these variables:

| Variable                   | Example            | Description                    |
| -------------------------- | ------------------ | ------------------------------ |
| `{ComponentType}`          | `pricing`          | Lowercase component type name  |
| `{ComponentTypeCamel}`     | `Pricing`          | PascalCase component type name |
| `{componentType}States`    | `pricingStates`    | State property name            |
| `{ComponentType}Functions` | `pricingFunctions` | Functions object name          |
| `{componentType}Structure` | `pricingStructure` | Structure object name          |
| `{ComponentType}1`         | `Pricing1`         | Component React name           |

### Files You'll Create (3 new files)

1. `context-liveeditor/editorStoreFunctions/pricingFunctions.ts` (~150 lines)
2. `componentsStructure/pricing.ts` (~300 lines)
3. `components/tenant/pricing/pricing1.tsx` (~200 lines)

### Files You'll Update (4 existing files)

1. `context-liveeditor/editorStore.ts` (~20 additions)
2. `lib-liveeditor/ComponentsList.tsx` (~25 additions)
3. `componentsStructure/index.ts` (~1 line)
4. `context-liveeditor/editorStoreFunctions/index.ts` (~1 line)

### Estimated Time

- **With this guide**: 30-60 minutes
- **For AI with access to templates**: 5-10 minutes

### Verification Checklist

After completing all steps, verify:

- [ ] Component appears in Live Editor component list
- [ ] Can drag and drop to canvas
- [ ] Component renders correctly
- [ ] EditorSidebar opens when selected
- [ ] Can edit fields and see changes
- [ ] Can save and reload with preserved data
- [ ] Multiple instances work independently

---

## 📋 Prerequisites

Before adding a new component, ensure you understand:

1. **Component architecture** - Read `docs/important/liveEditor/COMPONENT_ARCHITECTURE.md`
2. **State management** - Read `docs/important/liveEditor/STATE_MANAGEMENT.md`
3. **Context integration** - Read `docs/important/liveEditor/context/COMPONENT_INTEGRATION.md`
4. **Component structures** - Read existing files in `componentsStructure/`

---

## 🗺️ Overview - What You'll Create

When adding a new component type (e.g., "pricing"), you will create:

1. **Component function file** - `context-liveeditor/editorStoreFunctions/pricingFunctions.ts`
2. **Component structure file** - `componentsStructure/pricing.ts`
3. **Component React file(s)** - `components/tenant/pricing/pricing1.tsx`
4. **EditorStore integration** - Update `context-liveeditor/editorStore.ts`
5. **ComponentsList integration** - Update `lib-liveeditor/ComponentsList.tsx`
6. **Structure index** - Update `componentsStructure/index.ts`

**Total**: 3 new files + 3 updated files

---

## 📊 File Creation Order

**CRITICAL**: Follow this exact order to avoid dependency errors.

```
Step 1: Component Functions (context-liveeditor/editorStoreFunctions/)
   ↓
Step 2: Component Structure (componentsStructure/)
   ↓
Step 3: EditorStore Integration (context-liveeditor/editorStore.ts)
   ↓
Step 4: ComponentsList Integration (lib-liveeditor/ComponentsList.tsx)
   ↓
Step 5: Structure Export (componentsStructure/index.ts)
   ↓
Step 6: Component React File (components/tenant/)
   ↓
Step 7: Test Integration
```

---

## 🔧 Step 1: Create Component Functions File

**Location**: `context-liveeditor/editorStoreFunctions/pricingFunctions.ts`

### Template

```typescript
import { ComponentData } from "@/lib/types";
import { ComponentState, createDefaultData, updateDataByPath } from "./types";

// ═══════════════════════════════════════════════════════════
// DEFAULT DATA - Define your component's data structure
// ═══════════════════════════════════════════════════════════

export const getDefaultPricingData = (): ComponentData => ({
  visible: true,

  // Layout configuration
  layout: {
    maxWidth: "1600px",
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    gap: "2rem",
    padding: {
      top: "4rem",
      bottom: "4rem",
    },
  },

  // Content
  content: {
    title: "Our Pricing Plans",
    subtitle: "Choose the perfect plan for your needs",
    ctaText: "Get Started",
    ctaUrl: "#",
  },

  // Pricing plans array
  plans: [
    {
      id: "basic",
      name: "Basic",
      price: 99,
      currency: "$",
      period: "month",
      description: "Perfect for individuals",
      features: ["Feature 1", "Feature 2", "Feature 3"],
      highlighted: false,
      buttonText: "Choose Plan",
      buttonUrl: "#",
    },
    {
      id: "pro",
      name: "Professional",
      price: 199,
      currency: "$",
      period: "month",
      description: "Best for professionals",
      features: ["Everything in Basic", "Feature 4", "Feature 5", "Feature 6"],
      highlighted: true,
      buttonText: "Choose Plan",
      buttonUrl: "#",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 499,
      currency: "$",
      period: "month",
      description: "For large teams",
      features: [
        "Everything in Pro",
        "Feature 7",
        "Feature 8",
        "Feature 9",
        "Feature 10",
      ],
      highlighted: false,
      buttonText: "Contact Us",
      buttonUrl: "#",
    },
  ],

  // Styling
  styling: {
    backgroundColor: "#ffffff",
    titleColor: "#1f2937",
    subtitleColor: "#6b7280",
    cardBackgroundColor: "#f9fafb",
    cardBorderColor: "#e5e7eb",
    highlightColor: "#059669",
    priceColor: "#1f2937",
    featureColor: "#6b7280",
  },

  // Typography
  typography: {
    title: {
      fontSize: {
        mobile: "2xl",
        tablet: "3xl",
        desktop: "4xl",
      },
      fontWeight: "bold",
      fontFamily: "Tajawal",
    },
    subtitle: {
      fontSize: {
        mobile: "base",
        tablet: "lg",
        desktop: "xl",
      },
      fontWeight: "normal",
      fontFamily: "Tajawal",
    },
  },

  // Responsive behavior
  responsive: {
    mobileBreakpoint: "640px",
    tabletBreakpoint: "1024px",
    desktopBreakpoint: "1280px",
  },

  // Animations
  animations: {
    header: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 200,
    },
    cards: {
      enabled: true,
      type: "fade-up",
      duration: 600,
      delay: 300,
      stagger: 100,
    },
  },
});

// If you have multiple variants, create more default data functions:
// export const getDefaultPricing2Data = (): ComponentData => ({...});

// ═══════════════════════════════════════════════════════════
// COMPONENT FUNCTIONS - Standard 4 functions
// ═══════════════════════════════════════════════════════════

export const pricingFunctions = {
  /**
   * ensureVariant - Initialize component in store if not exists
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID (UUID)
   * @param initial - Optional initial data to override defaults
   * @returns New state object or empty object if already exists
   */
  ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {
    // Check if variant already exists
    if (
      state.pricingStates[variantId] &&
      Object.keys(state.pricingStates[variantId]).length > 0
    ) {
      return {} as any; // Already exists, skip initialization
    }

    // Determine default data
    // If you have multiple variants, add logic here:
    // const defaultData = variantId === "pricing2"
    //   ? getDefaultPricing2Data()
    //   : getDefaultPricingData();
    const defaultData = getDefaultPricingData();

    // Use provided initial data, else tempData, else defaults
    const data: ComponentData = initial || state.tempData || defaultData;

    // Return new state
    return {
      pricingStates: { ...state.pricingStates, [variantId]: data },
    } as any;
  },

  /**
   * getData - Retrieve component data from store
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @returns Component data or default data if not found
   */
  getData: (state: any, variantId: string) =>
    state.pricingStates[variantId] || getDefaultPricingData(),

  /**
   * setData - Set/replace component data completely
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param data - New component data
   * @returns New state object
   */
  setData: (state: any, variantId: string, data: ComponentData) => ({
    pricingStates: { ...state.pricingStates, [variantId]: data },
  }),

  /**
   * updateByPath - Update specific field in component data
   *
   * @param state - Current editorStore state
   * @param variantId - Unique component ID
   * @param path - Dot-separated path to field (e.g., "content.title")
   * @param value - New value for the field
   * @returns New state object
   */
  updateByPath: (state: any, variantId: string, path: string, value: any) => {
    const source = state.pricingStates[variantId] || getDefaultPricingData();
    const newData = updateDataByPath(source, path, value);

    return {
      pricingStates: { ...state.pricingStates, [variantId]: newData },
    } as any;
  },
};
```

### Important Notes

1. **Default data structure** should match your component's needs
2. **All 4 functions are REQUIRED** (ensureVariant, getData, setData, updateByPath)
3. **Use updateDataByPath** from types.ts for nested updates
4. **Return type** should be `as any` for compatibility
5. **Multiple variants**: Add variant detection in ensureVariant

---

## 🔧 Step 2: Create Component Structure File

**Location**: `componentsStructure/pricing.ts`

### Template

```typescript
import { ComponentStructure } from "./types";

export const pricingStructure: ComponentStructure = {
  componentType: "pricing",
  variants: [
    {
      id: "pricing1",
      name: "Pricing 1 - Three Column Layout",
      fields: [
        // ═══════════════════════════════════════════════════════════
        // BASIC FIELDS
        // ═══════════════════════════════════════════════════════════
        {
          key: "visible",
          label: "Visible",
          type: "boolean",
        },

        // ═══════════════════════════════════════════════════════════
        // LAYOUT CONFIGURATION
        // ═══════════════════════════════════════════════════════════
        {
          key: "layout",
          label: "Layout",
          type: "object",
          fields: [
            {
              key: "maxWidth",
              label: "Max Width",
              type: "text",
              placeholder: "1600px",
            },
            {
              key: "columns",
              label: "Grid Columns",
              type: "object",
              fields: [
                {
                  key: "mobile",
                  label: "Mobile Columns",
                  type: "number",
                  placeholder: "1",
                },
                {
                  key: "tablet",
                  label: "Tablet Columns",
                  type: "number",
                  placeholder: "2",
                },
                {
                  key: "desktop",
                  label: "Desktop Columns",
                  type: "number",
                  placeholder: "3",
                },
              ],
            },
            {
              key: "gap",
              label: "Gap Between Cards",
              type: "text",
              placeholder: "2rem",
            },
            {
              key: "padding",
              label: "Section Padding",
              type: "object",
              fields: [
                {
                  key: "top",
                  label: "Top Padding",
                  type: "text",
                  placeholder: "4rem",
                },
                {
                  key: "bottom",
                  label: "Bottom Padding",
                  type: "text",
                  placeholder: "4rem",
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // CONTENT
        // ═══════════════════════════════════════════════════════════
        {
          key: "content",
          label: "Content",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Section Title",
              type: "text",
              placeholder: "Our Pricing Plans",
            },
            {
              key: "subtitle",
              label: "Section Subtitle",
              type: "text",
              placeholder: "Choose the perfect plan",
            },
            {
              key: "ctaText",
              label: "CTA Button Text",
              type: "text",
              placeholder: "Get Started",
            },
            {
              key: "ctaUrl",
              label: "CTA Button URL",
              type: "text",
              placeholder: "#",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // PRICING PLANS - ARRAY OF OBJECTS
        // ═══════════════════════════════════════════════════════════
        {
          key: "plans",
          label: "Pricing Plans",
          type: "array",
          addLabel: "Add Plan",
          itemLabel: "Plan",
          of: [
            {
              key: "id",
              label: "Plan ID",
              type: "text",
              placeholder: "basic",
            },
            {
              key: "name",
              label: "Plan Name",
              type: "text",
              placeholder: "Basic",
            },
            {
              key: "price",
              label: "Price",
              type: "number",
              placeholder: "99",
            },
            {
              key: "currency",
              label: "Currency",
              type: "text",
              placeholder: "$",
            },
            {
              key: "period",
              label: "Billing Period",
              type: "text",
              placeholder: "month",
            },
            {
              key: "description",
              label: "Plan Description",
              type: "text",
              placeholder: "Perfect for individuals",
            },
            {
              key: "features",
              label: "Features List",
              type: "array",
              addLabel: "Add Feature",
              itemLabel: "Feature",
              of: [
                {
                  key: "value",
                  label: "Feature Text",
                  type: "text",
                  placeholder: "Feature description",
                },
              ],
            },
            {
              key: "highlighted",
              label: "Highlight This Plan",
              type: "boolean",
            },
            {
              key: "buttonText",
              label: "Button Text",
              type: "text",
              placeholder: "Choose Plan",
            },
            {
              key: "buttonUrl",
              label: "Button URL",
              type: "text",
              placeholder: "#",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // STYLING
        // ═══════════════════════════════════════════════════════════
        {
          key: "styling",
          label: "Styling",
          type: "object",
          fields: [
            {
              key: "backgroundColor",
              label: "Background Color",
              type: "color",
            },
            {
              key: "titleColor",
              label: "Title Color",
              type: "color",
            },
            {
              key: "subtitleColor",
              label: "Subtitle Color",
              type: "color",
            },
            {
              key: "cardBackgroundColor",
              label: "Card Background",
              type: "color",
            },
            {
              key: "cardBorderColor",
              label: "Card Border",
              type: "color",
            },
            {
              key: "highlightColor",
              label: "Highlight Color",
              type: "color",
            },
            {
              key: "priceColor",
              label: "Price Color",
              type: "color",
            },
            {
              key: "featureColor",
              label: "Feature Text Color",
              type: "color",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // TYPOGRAPHY
        // ═══════════════════════════════════════════════════════════
        {
          key: "typography",
          label: "Typography",
          type: "object",
          fields: [
            {
              key: "title",
              label: "Title Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "2xl",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "3xl",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "4xl",
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "bold",
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                },
              ],
            },
            {
              key: "subtitle",
              label: "Subtitle Typography",
              type: "object",
              fields: [
                {
                  key: "fontSize",
                  label: "Font Size",
                  type: "object",
                  fields: [
                    {
                      key: "mobile",
                      label: "Mobile",
                      type: "text",
                      placeholder: "base",
                    },
                    {
                      key: "tablet",
                      label: "Tablet",
                      type: "text",
                      placeholder: "lg",
                    },
                    {
                      key: "desktop",
                      label: "Desktop",
                      type: "text",
                      placeholder: "xl",
                    },
                  ],
                },
                {
                  key: "fontWeight",
                  label: "Font Weight",
                  type: "text",
                  placeholder: "normal",
                },
                {
                  key: "fontFamily",
                  label: "Font Family",
                  type: "text",
                  placeholder: "Tajawal",
                },
              ],
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // RESPONSIVE
        // ═══════════════════════════════════════════════════════════
        {
          key: "responsive",
          label: "Responsive Breakpoints",
          type: "object",
          fields: [
            {
              key: "mobileBreakpoint",
              label: "Mobile Breakpoint",
              type: "text",
              placeholder: "640px",
            },
            {
              key: "tabletBreakpoint",
              label: "Tablet Breakpoint",
              type: "text",
              placeholder: "1024px",
            },
            {
              key: "desktopBreakpoint",
              label: "Desktop Breakpoint",
              type: "text",
              placeholder: "1280px",
            },
          ],
        },

        // ═══════════════════════════════════════════════════════════
        // ANIMATIONS
        // ═══════════════════════════════════════════════════════════
        {
          key: "animations",
          label: "Animations",
          type: "object",
          fields: [
            {
              key: "header",
              label: "Header Animation",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Enabled",
                  type: "boolean",
                },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "text",
                  placeholder: "fade-up",
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "600",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "200",
                },
              ],
            },
            {
              key: "cards",
              label: "Cards Animation",
              type: "object",
              fields: [
                {
                  key: "enabled",
                  label: "Enabled",
                  type: "boolean",
                },
                {
                  key: "type",
                  label: "Animation Type",
                  type: "text",
                  placeholder: "fade-up",
                },
                {
                  key: "duration",
                  label: "Duration (ms)",
                  type: "number",
                  placeholder: "600",
                },
                {
                  key: "delay",
                  label: "Delay (ms)",
                  type: "number",
                  placeholder: "300",
                },
                {
                  key: "stagger",
                  label: "Stagger (ms)",
                  type: "number",
                  placeholder: "100",
                },
              ],
            },
          ],
        },
      ],

      // ═══════════════════════════════════════════════════════════
      // SIMPLE FIELDS - For basic/simple editing mode
      // ═══════════════════════════════════════════════════════════
      simpleFields: [
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "content.title", label: "Title", type: "text" },
        { key: "content.subtitle", label: "Subtitle", type: "text" },
        { key: "plans", label: "Pricing Plans", type: "array" },
      ],
    },

    // If you have multiple variants, add them here:
    // {
    //   id: "pricing2",
    //   name: "Pricing 2 - Comparison Table",
    //   fields: [...]
    // }
  ],
};
```

### Important Notes

1. **componentType** must match your function file name (without "Functions")
2. **variants array** can have multiple design variations
3. **fields** define ALL editable properties (advanced mode)
4. **simpleFields** define subset for simple editing mode
5. **Nested objects** use `type: "object"` with `fields: [...]`
6. **Arrays** use `type: "array"` with `of: [...]`

---

## 🔧 Step 3: Update EditorStore

**Location**: `context-liveeditor/editorStore.ts`

### 3.1: Import the Functions

```typescript
// Add to imports section (around line 46-68)
import { pricingFunctions } from "./editorStoreFunctions/pricingFunctions";
```

### 3.2: Add State Property to Interface

```typescript
// Add to EditorStore interface (around line 82-200)
interface EditorStore {
  // ... existing properties ...

  // Add your component state
  pricingStates: Record<string, ComponentData>;
  ensurePricingVariant: (variantId: string, initial?: ComponentData) => void;
  getPricingData: (variantId: string) => ComponentData;
  setPricingData: (variantId: string, data: ComponentData) => void;
  updatePricingByPath: (variantId: string, path: string, value: any) => void;

  // ... rest of properties ...
}
```

### 3.3: Initialize State in Store

```typescript
// In the create() function (around line 300-400)
export const useEditorStore = create<EditorStore>((set, get) => ({
  // ... existing state ...

  // Add your component state initialization
  pricingStates: {},

  // ... rest of state ...
}));
```

### 3.4: Add Generic Function Cases

```typescript
// In ensureComponentVariant function (around line 600-700)
ensureComponentVariant: (componentType, variantId, initial?) => {
  const state = get();

  switch (componentType) {
    // ... existing cases ...

    case "pricing":
      set(pricingFunctions.ensureVariant(state, variantId, initial));
      break;

    // ... rest of cases ...
  }
};

// In getComponentData function (around line 750-850)
getComponentData: (componentType, variantId) => {
  const state = get();

  switch (componentType) {
    // ... existing cases ...

    case "pricing":
      return pricingFunctions.getData(state, variantId);

    // ... rest of cases ...
  }
};

// In setComponentData function (around line 900-1000)
setComponentData: (componentType, variantId, data) => {
  const state = get();

  switch (componentType) {
    // ... existing cases ...

    case "pricing":
      set(pricingFunctions.setData(state, variantId, data));
      break;

    // ... rest of cases ...
  }
};

// In updateComponentByPath function (around line 1050-1150)
updateComponentByPath: (componentType, variantId, path, value) => {
  const state = get();

  switch (componentType) {
    // ... existing cases ...

    case "pricing":
      set(pricingFunctions.updateByPath(state, variantId, path, value));
      break;

    // ... rest of cases ...
  }
};
```

### 3.5: Add Specific Component Functions (Legacy Support)

```typescript
// Add after generic functions (around line 1200+)
// Pricing specific functions
ensurePricingVariant: (variantId, initial?) => {
  const state = get();
  set(pricingFunctions.ensureVariant(state, variantId, initial));
},

getPricingData: (variantId) => {
  const state = get();
  return pricingFunctions.getData(state, variantId);
},

setPricingData: (variantId, data) => {
  const state = get();
  set(pricingFunctions.setData(state, variantId, data));
},

updatePricingByPath: (variantId, path, value) => {
  const state = get();
  set(pricingFunctions.updateByPath(state, variantId, path, value));
},
```

---

## 🔧 Step 4: Update ComponentsList.tsx

**Location**: `lib-liveeditor/ComponentsList.tsx`

### 4.1: Import the Structure

```typescript
// Add to imports (around line 24-43)
import { pricingStructure } from "@/componentsStructure/pricing";
```

### 4.2: Add to getComponents Function

```typescript
// In getComponents function (around line 70-200)
export const getComponents = (
  t: (key: string) => string,
): Record<string, any> => ({
  // ... existing components ...

  pricing: {
    id: "pricing",
    name: "pricing",
    displayName: t("components.pricing.display_name"),
    description: t("components.pricing.description"),
    category: "marketing",
    section: "homepage",
    subPath: "/pricing",
    variants: pricingStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/pricing/${variant.id}.tsx`,
    })),
    icon: "💰",
    hasStore: true,
    hasStructure: true,
    defaultTheme: "pricing1",
    ...pricingStructure,
  },

  // ... rest of components ...
});
```

### 4.3: Add to COMPONENTS Constant

```typescript
// In COMPONENTS constant (around line 400-600)
export const COMPONENTS: Record<string, any> = {
  // ... existing components ...

  pricing: {
    id: "pricing",
    name: "pricing",
    displayName: "Pricing",
    description: "Pricing plans section",
    category: "marketing",
    section: "homepage",
    subPath: "/pricing",
    variants: pricingStructure.variants.map((variant) => ({
      ...variant,
      componentPath: `components/tenant/pricing/${variant.id}.tsx`,
    })),
    icon: "💰",
    hasStore: true,
    hasStructure: true,
    defaultTheme: "pricing1",
    ...pricingStructure,
  },

  // ... rest of components ...
};
```

### 4.4: Add to Sections (if creating new page type)

```typescript
// In getSections or SECTIONS constant
homepage: {
  id: "homepage",
  name: "homepage",
  displayName: t("sections.homepage.display_name"),
  path: "homepage",
  description: t("sections.homepage.description"),
  icon: "🏠",
  components: [
    "header",
    "hero",
    "pricing",  // Add here
    // ... other components
  ]
}
```

---

## 🔧 Step 5: Update componentsStructure/index.ts

**Location**: `componentsStructure/index.ts`

### Add Export

```typescript
export { heroStructure } from "./hero";
export { headerStructure } from "./header";
// ... existing exports ...

// Add your component export
export { pricingStructure } from "./pricing";

// ... rest of exports ...
```

---

## 🔧 Step 6: Create Component React File

**Location**: `components/tenant/pricing/pricing1.tsx`

### Template

```typescript
"use client";

import { useEffect } from "react";
import { useEditorStore } from "@/context-liveeditor/editorStore";
import useTenantStore from "@/context-liveeditor/tenantStore";
import { getDefaultPricingData } from "@/context-liveeditor/editorStoreFunctions/pricingFunctions";

// ═══════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════
interface PricingProps {
  // Component-specific props (match your default data structure)
  visible?: boolean;
  layout?: {
    maxWidth?: string;
    columns?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
    gap?: string;
    padding?: {
      top?: string;
      bottom?: string;
    };
  };
  content?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
  plans?: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    period: string;
    description: string;
    features: string[];
    highlighted: boolean;
    buttonText: string;
    buttonUrl: string;
  }>;
  styling?: {
    backgroundColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    cardBackgroundColor?: string;
    cardBorderColor?: string;
    highlightColor?: string;
    priceColor?: string;
    featureColor?: string;
  };
  typography?: any;
  responsive?: any;
  animations?: any;

  // Editor props (always include these)
  variant?: string;
  useStore?: boolean;
  id?: string;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
export default function Pricing1(props: PricingProps) {
  // ─────────────────────────────────────────────────────────
  // 1. EXTRACT UNIQUE ID
  // ─────────────────────────────────────────────────────────
  const variantId = props.variant || "pricing1";
  const uniqueId = props.id || variantId;

  // ─────────────────────────────────────────────────────────
  // 2. CONNECT TO STORES
  // ─────────────────────────────────────────────────────────
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  const getComponentData = useEditorStore(s => s.getComponentData);
  const pricingStates = useEditorStore(s => s.pricingStates);

  const tenantData = useTenantStore(s => s.tenantData);

  // ─────────────────────────────────────────────────────────
  // 3. INITIALIZE IN STORE (on mount)
  // ─────────────────────────────────────────────────────────
  // Get tenant data FIRST
  const tenantData = useTenantStore((s) => s.tenantData);
  const fetchTenantData = useTenantStore((s) => s.fetchTenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  useEffect(() => {
    if (tenantId) {
      fetchTenantData(tenantId);
    }
  }, [tenantId, fetchTenantData]);

  // Extract component data from tenantData (BEFORE useEffect)
  const getTenantComponentData = () => {
    if (!tenantData) return {};

    // Check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (component.type === "pricing" && component.componentName === variantId) {
          return component.data;
        }
      }
    }

    // Check old structure (tenantData.componentSettings)
    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "pricing" &&
              (component as any).componentName === variantId
            ) {
              return (component as any).data;
            }
          }
        }
      }
    }

    return {};
  };

  const tenantComponentData = getTenantComponentData();

  useEffect(() => {
    if (props.useStore) {
      // ✅ Use database data if available
      const initialData = tenantComponentData && Object.keys(tenantComponentData).length > 0
        ? {
            ...getDefaultPricingData(),
            ...tenantComponentData,  // Database data takes priority
            ...props
          }
        : {
            ...getDefaultPricingData(),
            ...props
          };

      // Initialize in store
      ensureComponentVariant("pricing", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);  // ✅ Add tenantComponentData dependency

  // ─────────────────────────────────────────────────────────
  // 4. RETRIEVE DATA FROM STORE
  // ─────────────────────────────────────────────────────────
  const storeData = pricingStates[uniqueId];
  const currentStoreData = getComponentData("pricing", uniqueId);

  // ─────────────────────────────────────────────────────────
  // 5. MERGE DATA (PRIORITY ORDER)
  // ─────────────────────────────────────────────────────────
  const mergedData = {
    ...getDefaultPricingData(),    // 1. Defaults (lowest priority)
    ...storeData,                   // 2. Store state
    ...currentStoreData,            // 3. Current store data
    ...props                        // 4. Props (highest priority)
  };

  // ─────────────────────────────────────────────────────────
  // 6. EARLY RETURN IF NOT VISIBLE
  // ─────────────────────────────────────────────────────────
  if (!mergedData.visible) {
    return null;
  }

  // ─────────────────────────────────────────────────────────
  // 7. RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <section
      className="pricing-section"
      style={{
        backgroundColor: mergedData.styling?.backgroundColor,
        paddingTop: mergedData.layout?.padding?.top,
        paddingBottom: mergedData.layout?.padding?.bottom
      }}
    >
      <div
        className="container mx-auto px-4"
        style={{ maxWidth: mergedData.layout?.maxWidth }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            style={{
              color: mergedData.styling?.titleColor,
              fontSize: mergedData.typography?.title?.fontSize?.desktop
            }}
          >
            {mergedData.content?.title}
          </h2>
          <p
            style={{
              color: mergedData.styling?.subtitleColor,
              fontSize: mergedData.typography?.subtitle?.fontSize?.desktop
            }}
          >
            {mergedData.content?.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: `repeat(${mergedData.layout?.columns?.desktop || 3}, 1fr)`,
            gap: mergedData.layout?.gap
          }}
        >
          {mergedData.plans?.map((plan: any, index: number) => (
            <div
              key={plan.id || index}
              className="pricing-card"
              style={{
                backgroundColor: mergedData.styling?.cardBackgroundColor,
                borderColor: mergedData.styling?.cardBorderColor,
                border: plan.highlighted
                  ? `2px solid ${mergedData.styling?.highlightColor}`
                  : `1px solid ${mergedData.styling?.cardBorderColor}`,
                borderRadius: "0.5rem",
                padding: "2rem",
                position: "relative"
              }}
            >
              {/* Highlight Badge */}
              {plan.highlighted && (
                <div
                  className="absolute top-0 right-0 px-4 py-1 rounded-bl-lg"
                  style={{
                    backgroundColor: mergedData.styling?.highlightColor,
                    color: "#ffffff"
                  }}
                >
                  Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

              {/* Plan Description */}
              <p
                className="text-sm mb-4"
                style={{ color: mergedData.styling?.subtitleColor }}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span
                  className="text-4xl font-bold"
                  style={{ color: mergedData.styling?.priceColor }}
                >
                  {plan.currency}{plan.price}
                </span>
                <span
                  className="text-sm ml-2"
                  style={{ color: mergedData.styling?.subtitleColor }}
                >
                  / {plan.period}
                </span>
              </div>

              {/* Features List */}
              <ul className="mb-6 space-y-3">
                {plan.features?.map((feature: string, fIndex: number) => (
                  <li
                    key={fIndex}
                    className="flex items-start"
                    style={{ color: mergedData.styling?.featureColor }}
                  >
                    <span className="mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={plan.buttonUrl}
                className="block text-center py-3 rounded-md font-semibold transition-colors"
                style={{
                  backgroundColor: plan.highlighted
                    ? mergedData.styling?.highlightColor
                    : "transparent",
                  color: plan.highlighted
                    ? "#ffffff"
                    : mergedData.styling?.highlightColor,
                  border: `2px solid ${mergedData.styling?.highlightColor}`
                }}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Important Notes

1. **Props interface** must match your default data structure
2. **Always include** `variant`, `useStore`, and `id` props
3. **Follow the 7-step pattern** exactly
4. **Use mergedData** for all rendered values
5. **Add responsive classes** as needed
6. **Handle animations** if defined in your data

---

## 🔧 Step 7: Update editorStoreFunctions/index.ts

**Location**: `context-liveeditor/editorStoreFunctions/index.ts`

### Add Export

```typescript
export * from "./types";
export * from "./heroFunctions";
// ... existing exports ...

// Add your component export
export * from "./pricingFunctions";

// ... rest of exports ...
```

---

## 🔧 Step 8: Add Translations (Optional but Recommended)

**Location**: `lib/i18n/locales/ar.json` and `en.json`

### Add to ar.json

```json
{
  "components": {
    "pricing": {
      "display_name": "الأسعار",
      "description": "قسم عرض خطط الأسعار"
    }
  }
}
```

### Add to en.json

```json
{
  "components": {
    "pricing": {
      "display_name": "Pricing",
      "description": "Pricing plans section"
    }
  }
}
```

---

## ✅ Step 9: Test Integration

### 9.1: Test in Live Editor

1. Open Live Editor
2. Click "Add Component"
3. Find your component in the list
4. Drag and drop to canvas
5. Verify it renders correctly

### 9.2: Test EditorSidebar

1. Select your component
2. EditorSidebar should open
3. Try editing fields
4. Verify changes reflect in component

### 9.3: Test Save/Load

1. Make changes to your component
2. Click "Save"
3. Refresh page
4. Verify component loads with saved data

### 9.4: Test Multiple Instances

1. Add 2-3 instances of your component
2. Edit each differently
3. Verify they maintain separate data

---

## 📊 Complete Checklist

Use this checklist to ensure you've completed all steps:

- [ ] Step 1: Created `context-liveeditor/editorStoreFunctions/pricingFunctions.ts`
  - [ ] Exported `getDefaultPricingData` function
  - [ ] Exported `pricingFunctions` object with 4 functions
  - [ ] All functions follow the template
- [ ] Step 2: Created `componentsStructure/pricing.ts`
  - [ ] Exported `pricingStructure` object
  - [ ] Defined `componentType`
  - [ ] Defined all `fields` for advanced mode
  - [ ] Defined `simpleFields` for simple mode
- [ ] Step 3: Updated `context-liveeditor/editorStore.ts`
  - [ ] Imported `pricingFunctions`
  - [ ] Added `pricingStates` to interface
  - [ ] Initialized `pricingStates: {}`
  - [ ] Added case to `ensureComponentVariant`
  - [ ] Added case to `getComponentData`
  - [ ] Added case to `setComponentData`
  - [ ] Added case to `updateComponentByPath`
  - [ ] Added specific functions (ensurePricingVariant, etc.)
- [ ] Step 4: Updated `lib-liveeditor/ComponentsList.tsx`
  - [ ] Imported `pricingStructure`
  - [ ] Added to `getComponents` function
  - [ ] Added to `COMPONENTS` constant
  - [ ] Added to relevant section
- [ ] Step 5: Updated `componentsStructure/index.ts`
  - [ ] Exported `pricingStructure`
- [ ] Step 6: Created `components/tenant/pricing/pricing1.tsx`
  - [ ] Defined props interface
  - [ ] Followed 7-step component pattern
  - [ ] Used `mergedData` for rendering
- [ ] Step 7: Updated `context-liveeditor/editorStoreFunctions/index.ts`
  - [ ] Exported `pricingFunctions`
- [ ] Step 8: Added translations
  - [ ] Updated `ar.json`
  - [ ] Updated `en.json`
- [ ] Step 9: Tested integration
  - [ ] Component appears in Live Editor
  - [ ] Can add to canvas
  - [ ] EditorSidebar works
  - [ ] Can save/load
  - [ ] Multiple instances work

---

## 🎯 Common Patterns

### Pattern 1: Component with Multiple Variants

If your component has multiple design variations:

**In pricingFunctions.ts**:

```typescript
export const getDefaultPricing2Data = (): ComponentData => ({
  // Different structure for variant 2
});

export const pricingFunctions = {
  ensureVariant: (state, variantId, initial?) => {
    // Variant detection
    const defaultData =
      variantId === "pricing2"
        ? getDefaultPricing2Data()
        : getDefaultPricingData();
    // ...
  },
  // ... rest of functions
};
```

**In pricing.ts**:

```typescript
export const pricingStructure: ComponentStructure = {
  componentType: "pricing",
  variants: [
    {
      id: "pricing1",
      name: "Pricing 1 - Three Column",
      fields: [...]
    },
    {
      id: "pricing2",
      name: "Pricing 2 - Comparison Table",
      fields: [...]  // Different fields
    }
  ]
};
```

**Create separate component files**:

- `components/tenant/pricing/pricing1.tsx`
- `components/tenant/pricing/pricing2.tsx`

---

### Pattern 2: Component with Extended Helper Functions

If you need validation, manipulation, etc. (like contactCardsFunctions):

**In pricingFunctions.ts**:

```typescript
export const pricingFunctions = {
  // Standard 4 functions
  ensureVariant: (...) => {...},
  getData: (...) => {...},
  setData: (...) => {...},
  updateByPath: (...) => {...},

  // Extended helper functions
  addPlan: (currentData, plan) => ({
    ...currentData,
    plans: [...(currentData.plans || []), plan]
  }),

  removePlan: (currentData, index) => ({
    ...currentData,
    plans: (currentData.plans || []).filter((_, i) => i !== index)
  }),

  updatePlan: (currentData, index, updates) => ({
    ...currentData,
    plans: (currentData.plans || []).map((plan, i) =>
      i === index ? { ...plan, ...updates } : plan
    )
  }),

  validate: (data) => {
    const errors = [];
    if (!data.plans || data.plans.length === 0) {
      errors.push("At least one plan is required");
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
```

---

### Pattern 3: Global Component (Like Header/Footer)

If your component should be shared across all pages:

**In editorStore.ts**:

```typescript
interface EditorStore {
  // Add global component data
  globalPricingData: ComponentData;
  setGlobalPricingData: (data: ComponentData) => void;
  updateGlobalPricingByPath: (path: string, value: any) => void;
}

// In store creation
globalPricingData: getDefaultPricingData(),

setGlobalPricingData: (data) => {
  set({ globalPricingData: data });
},

updateGlobalPricingByPath: (path, value) => {
  const current = get().globalPricingData;
  const updated = updateDataByPath(current, path, value);
  set({ globalPricingData: updated });
}
```

**In component**:

```typescript
const globalPricingData = useEditorStore((s) => s.globalPricingData);

const mergedData = {
  ...getDefaultPricingData(),
  ...storeData,
  ...globalPricingData, // Global data priority
  ...props,
};
```

---

### Pattern 4: Component with Dynamic Data Source

If your component fetches data from API:

**In default data**:

```typescript
export const getDefaultPricingData = (): ComponentData => ({
  // ... other data ...

  dataSource: {
    type: "api", // or "static"
    apiUrl: "/api/pricing/plans",
    enabled: true,
    cache: {
      enabled: true,
      duration: 3600, // seconds
    },
  },
});
```

**In component**:

```typescript
const [apiData, setApiData] = useState(null);

useEffect(() => {
  if (mergedData.dataSource?.enabled && mergedData.dataSource?.type === "api") {
    fetch(mergedData.dataSource.apiUrl)
      .then((res) => res.json())
      .then((data) => setApiData(data));
  }
}, [mergedData.dataSource]);

const finalData =
  mergedData.dataSource?.enabled && apiData
    ? { ...mergedData, plans: apiData }
    : mergedData;
```

---

## 🚨 Common Mistakes to Avoid

### Mistake 1: Wrong Component Type Name

❌ **Wrong**:

```typescript
// pricingFunctions.ts
export const priceFunctions = {  // Wrong name!
  ensureVariant: ...
};

// ComponentsList.tsx
pricing: {
  ...priceStructure  // Wrong structure name!
}
```

✅ **Correct**:

```typescript
// pricingFunctions.ts
export const pricingFunctions = {  // Matches componentType!
  ensureVariant: ...
};

// ComponentsList.tsx
pricing: {
  ...pricingStructure  // Matches componentType!
}
```

---

### Mistake 2: Forgetting to Update All Switch Cases

❌ **Wrong**:

```typescript
// Updated getComponentData but forgot setComponentData
getComponentData: (type, id) => {
  switch (type) {
    case "pricing": // Added
      return pricingFunctions.getData(state, id);
  }
};

setComponentData: (type, id, data) => {
  switch (
    type
    // Missing "pricing" case!
  ) {
  }
};
```

✅ **Correct**:

```typescript
// Add to ALL 4 switch statements
ensureComponentVariant: ...case "pricing"...
getComponentData: ...case "pricing"...
setComponentData: ...case "pricing"...
updateComponentByPath: ...case "pricing"...
```

---

### Mistake 3: Not Matching Structure to Default Data

❌ **Wrong**:

```typescript
// Default data has "plans" array
getDefaultPricingData = () => ({
  plans: [...]
});

// But structure defines "pricingPlans"
fields: [
  {
    key: "pricingPlans",  // Wrong key!
    type: "array"
  }
]
```

✅ **Correct**:

```typescript
// Keys must match exactly
getDefaultPricingData = () => ({
  plans: [...]
});

fields: [
  {
    key: "plans",  // Correct!
    type: "array"
  }
]
```

---

### Mistake 4: Not Following Component Pattern

❌ **Wrong**:

```typescript
export default function Pricing1(props) {
  // Directly using props
  return <div>{props.content?.title}</div>;
}
```

✅ **Correct**:

```typescript
export default function Pricing1(props) {
  // Follow 7-step pattern
  const uniqueId = props.id || "pricing1";
  const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
  // ... rest of pattern

  const mergedData = {...};  // Merge data

  return <div>{mergedData.content?.title}</div>;  // Use mergedData
}
```

---

## 🎓 Advanced Topics

### Topic 1: Updating pageComponentsByPage

Some components (like halfTextHalfImage) update `pageComponentsByPage` in addition to their state:

```typescript
updateByPath: (state, variantId, path, value) => {
  const source = state.pricingStates[variantId] || {};
  const newData = updateDataByPath(source, path, value);

  // Update pageComponentsByPage too
  const currentPage = state.currentPage;
  const updatedComponents = state.pageComponentsByPage[currentPage].map(
    (comp) => {
      if (comp.type === "pricing" && comp.id === variantId) {
        return { ...comp, data: newData };
      }
      return comp;
    },
  );

  return {
    pricingStates: { ...state.pricingStates, [variantId]: newData },
    pageComponentsByPage: {
      ...state.pageComponentsByPage,
      [currentPage]: updatedComponents,
    },
  };
};
```

**When to use**: If your component's save payload needs immediate sync.

---

### Topic 2: Debug Logging

For complex components, add logging (like halfTextHalfImage):

```typescript
import { logEditorStore } from "@/lib-liveeditor/debugLogger";

ensureVariant: (state, variantId, initial?) => {
  logEditorStore("ENSURE_VARIANT_CALLED", variantId, "pricing", {
    variantId,
    hasInitial: !!(initial && Object.keys(initial).length > 0),
    initialKeys: initial ? Object.keys(initial) : [],
  });

  // ... rest of function

  logEditorStore("ENSURE_VARIANT_RESULT", variantId, "pricing", {
    finalData: data,
  });
};
```

---

### Topic 3: Conditional Fields in Structure

Show/hide fields based on other field values:

```typescript
fields: [
  {
    key: "dataSource.type",
    label: "Data Source",
    type: "select",
    options: [
      { value: "static", label: "Static" },
      { value: "api", label: "API" },
    ],
  },
  {
    key: "dataSource.apiUrl",
    label: "API URL",
    type: "text",
    condition: {
      field: "dataSource.type",
      value: "api",
    },
  },
];
```

The field `dataSource.apiUrl` only shows when `dataSource.type === "api"`.

---

## 📖 Additional Resources

### Related Documentation

- [Component Architecture](./liveEditor/COMPONENT_ARCHITECTURE.md) - Component system overview
- [State Management](./liveEditor/STATE_MANAGEMENT.md) - Store architecture
- [Component Integration](./liveEditor/context/COMPONENT_INTEGRATION.md) - Integration patterns
- [Editor Store Functions](./liveEditor/context/EDITOR_STORE_FUNCTIONS.md) - Function reference
- [Database Data Loading](./liveEditor/DATABASE_DATA_LOADING.md) - **CRITICAL**: How to load database data in Live Editor

### Example Components to Study

**Simple Component**: `testimonials`

- Single variant
- Basic array handling
- Good starting point

**Complex Component**: `halfTextHalfImage`

- Multiple variants (3)
- Extensive logging
- Updates pageComponentsByPage

**Extended Functions**: `contactCards`

- Helper functions for manipulation
- Validation
- Reordering

**Form Builder**: `inputs2`

- Most complex default data
- Dynamic form generation
- Visibility controls

---

## 🎯 Summary

To add a new component:

1. **Create functions file** with default data + 4 functions
2. **Create structure file** with fields definition
3. **Update editorStore** with state + 4 switch cases + specific functions
4. **Update ComponentsList** with imports + getComponents + COMPONENTS
5. **Update structure index** with export
6. **Create React component** following 7-step pattern
7. **Update functions index** with export
8. **Add translations** (optional)
9. **Test thoroughly** in Live Editor

**Total Time**: 2-4 hours for a complete component with all features

---

**For AI**: This guide provides COMPLETE coverage for adding any new component type. Follow each step exactly to ensure seamless integration with the Live Editor system.

---

**Status**: ✅ Complete Guide  
**Version**: 1.0  
**Last Updated**: 2025-10-26  
**Maintenance**: Update when adding new integration points
