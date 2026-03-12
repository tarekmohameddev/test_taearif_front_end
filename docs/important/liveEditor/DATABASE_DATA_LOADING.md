# Database Data Loading in Live Editor

## 🎯 Overview

This document explains how components should properly load and initialize data from the database when the Live Editor opens. This is critical for ensuring components display saved data instead of default values.

---

## 🚨 Common Problem

**Symptom**: Component shows default data in Live Editor instead of database data, even though the data exists in the database.

**Root Causes**:

1. Missing case in `loadFromDatabase` switch statement
2. Component's `useEffect` initializes before database data is loaded
3. `ensureComponentVariant` doesn't use database data when initializing

---

## ✅ Solution: Two-Step Integration

### Step 1: Add Case to `loadFromDatabase`

**Location**: `context-liveeditor/editorStore.ts`

**Required**: Add your component type to the `loadFromDatabase` function's switch statement.

```typescript
// In loadFromDatabase function (~line 1797-2042)
loadFromDatabase: (tenantData) =>
  set((state) => {
    // ... existing code ...

    // Load component data into respective stores
    Object.entries(tenantData.componentSettings).forEach(
      ([page, pageSettings]: [string, any]) => {
        if (pageSettings && typeof pageSettings === "object") {
          Object.entries(pageSettings).forEach(
            ([id, comp]: [string, any]) => {
              if (comp.data && comp.componentName) {
                switch (comp.type) {
                  // ... existing cases ...

                  case "partners":  // ✅ ADD THIS
                    newState.partnersStates = partnersFunctions.setData(
                      newState,
                      comp.id, // Use comp.id (UUID), not comp.componentName
                      comp.data,
                    ).partnersStates;
                    break;

                  // ... rest of cases ...
                }
              }
            },
          );
        }
      },
    );

    return newState;
  }),
```

**Critical Points**:

- ✅ Must use `comp.id` (the UUID), NOT `comp.componentName`
- ✅ Must call `{componentType}Functions.setData()` to properly initialize
- ✅ Must extract the state property (e.g., `.partnersStates`) from the returned object

---

### Step 2: Update Component's `useEffect` to Use Database Data

**Location**: `components/tenant/{componentType}/{componentType}1.tsx`

**Required**: Modify the initialization `useEffect` to check for and use database data.

#### Pattern A: Using `tenantComponentData` (Recommended)

```typescript
export default function Partners1(props: PartnersProps = {}) {
  const variantId = props.variant || "partners1";
  const uniqueId = props.id || variantId;

  // Subscribe to stores
  const ensureComponentVariant = useEditorStore(
    (s) => s.ensureComponentVariant,
  );
  const getComponentData = useEditorStore((s) => s.getComponentData);
  const partnersStates = useEditorStore((s) => s.partnersStates);

  // Get tenant data from store (fetched once by useTenantDataEffect in LiveEditorEffects)
  const tenantData = useTenantStore((s) => s.tenantData);
  const tenantId = useTenantStore((s) => s.tenantId);

  // Extract component data from tenantData
  const getTenantComponentData = () => {
    if (!tenantData) {
      return {};
    }

    // First, check new structure (tenantData.components)
    if (tenantData.components && Array.isArray(tenantData.components)) {
      for (const component of tenantData.components) {
        if (
          component.type === "partners" &&
          component.componentName === variantId
        ) {
          return component.data;
        }
      }
    }

    // Fallback: check old structure (tenantData.componentSettings)
    if (tenantData?.componentSettings) {
      for (const [pageSlug, pageComponents] of Object.entries(
        tenantData.componentSettings,
      )) {
        if (
          typeof pageComponents === "object" &&
          !Array.isArray(pageComponents)
        ) {
          for (const [componentId, component] of Object.entries(
            pageComponents as any,
          )) {
            if (
              (component as any).type === "partners" &&
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

  // ✅ CRITICAL: Use tenantComponentData in initialization
  useEffect(() => {
    if (props.useStore) {
      // If we have tenant data, use it; otherwise use props or defaults
      const initialData =
        tenantComponentData && Object.keys(tenantComponentData).length > 0
          ? {
              ...getDefaultPartnersData(),
              ...tenantComponentData, // ✅ Database data takes priority
              ...props,
            }
          : {
              ...getDefaultPartnersData(),
              ...props,
            };
      ensureComponentVariant("partners", uniqueId, initialData);
    }
  }, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]); // ✅ Add tenantComponentData as dependency

  // ... rest of component ...
}
```

**Key Changes**:

1. ✅ Move `getTenantComponentData()` function **before** the `useEffect`
2. ✅ Call `getTenantComponentData()` to extract database data
3. ✅ Use `tenantComponentData` in `initialData` when available
4. ✅ Add `tenantComponentData` to `useEffect` dependencies

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Opens Live Editor                                    │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. fetchTenantData(tenantId)                                │
│    → API call to get tenant data                            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. tenantData loaded into tenantStore                       │
│    tenantData = {                                            │
│      componentSettings: {                                    │
│        homepage: {                                           │
│          "uuid-123": {                                       │
│            type: "partners",                                 │
│            componentName: "partners1",                       │
│            data: { ... saved data ... }                     │
│          }                                                   │
│        }                                                     │
│      }                                                       │
│    }                                                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. editorStore.loadFromDatabase(tenantData)                  │
│    → Switch case "partners":                                │
│      partnersStates["uuid-123"] = comp.data                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Component renders (Partners1)                            │
│    → useEffect runs                                         │
│    → getTenantComponentData() extracts data                  │
│    → tenantComponentData = { ... saved data ... }           │
│    → ensureComponentVariant("partners", id, {               │
│        ...defaults,                                          │
│        ...tenantComponentData,  ✅ Database data            │
│        ...props                                              │
│      })                                                      │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Component displays database data ✅                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Verification Checklist

After implementing both steps, verify:

- [ ] Case added to `loadFromDatabase` switch statement
- [ ] `getTenantComponentData()` function exists in component
- [ ] `getTenantComponentData()` called before `useEffect`
- [ ] `tenantComponentData` used in `initialData`
- [ ] `tenantComponentData` added to `useEffect` dependencies
- [ ] Component shows database data (not defaults) in Live Editor
- [ ] EditorSidebar shows correct database data
- [ ] Both component and EditorSidebar show same data

---

## 🚨 Common Mistakes

### Mistake 1: Missing `loadFromDatabase` Case

❌ **Wrong**: Component type not in switch statement

```typescript
switch (comp.type) {
  case "hero": ...
  case "header": ...
  // Missing "partners" case!
}
```

✅ **Correct**: Component type included

```typescript
switch (comp.type) {
  case "hero": ...
  case "header": ...
  case "partners":  // ✅ Added
    newState.partnersStates = partnersFunctions.setData(...).partnersStates;
    break;
}
```

---

### Mistake 2: Using `componentName` Instead of `id`

❌ **Wrong**: Using componentName (variant name)

```typescript
case "partners":
  newState.partnersStates = partnersFunctions.setData(
    newState,
    comp.componentName,  // ❌ Wrong! This is "partners1"
    comp.data,
  ).partnersStates;
```

✅ **Correct**: Using id (UUID)

```typescript
case "partners":
  newState.partnersStates = partnersFunctions.setData(
    newState,
    comp.id,  // ✅ Correct! This is the UUID
    comp.data,
  ).partnersStates;
```

---

### Mistake 3: Not Using Database Data in `useEffect`

❌ **Wrong**: Only using defaults and props

```typescript
useEffect(() => {
  if (props.useStore) {
    const initialData = {
      ...getDefaultPartnersData(),
      ...props, // ❌ Missing database data!
    };
    ensureComponentVariant("partners", uniqueId, initialData);
  }
}, [uniqueId, props.useStore, ensureComponentVariant]);
```

✅ **Correct**: Including database data

```typescript
const tenantComponentData = getTenantComponentData();

useEffect(() => {
  if (props.useStore) {
    const initialData =
      tenantComponentData && Object.keys(tenantComponentData).length > 0
        ? {
            ...getDefaultPartnersData(),
            ...tenantComponentData, // ✅ Database data included
            ...props,
          }
        : {
            ...getDefaultPartnersData(),
            ...props,
          };
    ensureComponentVariant("partners", uniqueId, initialData);
  }
}, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]); // ✅ Dependency added
```

---

### Mistake 4: Calling `getTenantComponentData` After `useEffect`

❌ **Wrong**: Function defined after useEffect

```typescript
useEffect(() => {
  // ...
}, [uniqueId, props.useStore]);

// ❌ Function defined too late!
const getTenantComponentData = () => { ... };
```

✅ **Correct**: Function defined before useEffect

```typescript
// ✅ Function defined first
const getTenantComponentData = () => { ... };
const tenantComponentData = getTenantComponentData();

useEffect(() => {
  // Can now use tenantComponentData
}, [uniqueId, props.useStore, tenantComponentData]);
```

---

## 📝 Template for New Components

When adding a new component, use this template:

### 1. In `editorStore.ts` - `loadFromDatabase`:

```typescript
case "{componentType}":
  newState.{componentType}States = {componentType}Functions.setData(
    newState,
    comp.id,  // ✅ Always use comp.id (UUID)
    comp.data,
  ).{componentType}States;
  break;
```

### 2. In `{componentType}1.tsx`:

```typescript
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

  // Check new structure
  if (tenantData.components && Array.isArray(tenantData.components)) {
    for (const component of tenantData.components) {
      if (component.type === "{componentType}" &&
          component.componentName === variantId) {
        return component.data;
      }
    }
  }

  // Check old structure
  if (tenantData?.componentSettings) {
    for (const [pageSlug, pageComponents] of Object.entries(
      tenantData.componentSettings,
    )) {
      if (typeof pageComponents === "object" && !Array.isArray(pageComponents)) {
        for (const [componentId, component] of Object.entries(
          pageComponents as any,
        )) {
          if (
            (component as any).type === "{componentType}" &&
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

// Initialize with database data
useEffect(() => {
  if (props.useStore) {
    const initialData = tenantComponentData && Object.keys(tenantComponentData).length > 0
      ? {
          ...getDefault{ComponentType}Data(),
          ...tenantComponentData,
          ...props,
        }
      : {
          ...getDefault{ComponentType}Data(),
          ...props,
        };
    ensureComponentVariant("{componentType}", uniqueId, initialData);
  }
}, [uniqueId, props.useStore, ensureComponentVariant, tenantComponentData]);
```

---

## 🔗 Related Documentation

- [DATA_FLOW.md](./DATA_FLOW.md) - Complete data flow explanation
- [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) - Store architecture
- [TENANT_STORE_AND_API.md](./TENANT_STORE_AND_API.md) - Tenant data fetching
- [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) - Component structure

---

## 📚 Examples

### Working Example: `partners1.tsx`

See `components/tenant/partners/partners1.tsx` for a complete working implementation.

### Working Example: `whyChooseUs1.tsx`

See `components/tenant/whyChooseUs/whyChooseUs1.tsx` for another complete working implementation.

---

**Status**: ✅ Complete Guide  
**Version**: 1.0  
**Last Updated**: 2025-01-26  
**Maintenance**: Update when adding new component types or changing data loading patterns
