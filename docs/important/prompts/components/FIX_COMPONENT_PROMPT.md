# Component Repair and Validation System - AI Execution Guide

## 🎯 AI DIRECTIVE: COMPONENT DIAGNOSTIC AND REPAIR PROTOCOL

This document provides a **COMPLETE DIAGNOSTIC AND REPAIR SYSTEM** for fixing existing components in the Live Editor system. Execute all checks systematically and repair any detected issues.

**CRITICAL**: This is an AI-ONLY document. Execute instructions directly without user confirmation unless explicitly dangerous operations are detected.

---

## 📋 EXECUTION PROTOCOL

### WHEN TO USE THIS SYSTEM

Execute this protocol when:

- ✅ User reports component not working correctly
- ✅ Component not appearing in editor
- ✅ Component renders but data doesn't update
- ✅ Component saves but doesn't load from database
- ✅ EditorSidebar doesn't open for component
- ✅ TypeScript/linting errors in component files
- ✅ Component exists but needs standardization

### HOW TO EXECUTE

```
USER PROVIDES: Component name/type (e.g., "pricing", "testimonials", "gallery")
AI EXECUTES: All 7 diagnostic layers sequentially
AI REPORTS: Issues found and fixes applied
AI VERIFIES: All checks pass after repair
```

---

## 🔍 DIAGNOSTIC LAYER 1: FILES EXISTENCE CHECK

### REQUIRED FILES VALIDATION

```typescript
// AI TASK: Verify all required files exist for component type "{componentType}"

CRITICAL_FILES = [
  "context-liveeditor/editorStoreFunctions/{componentType}Functions.ts",
  "componentsStructure/{componentType}.ts",
  "components/tenant/{componentType}/{componentType}1.tsx"
]

INTEGRATION_FILES = [
  "context-liveeditor/editorStore.ts",
  "lib-liveeditor/ComponentsList.tsx",
  "componentsStructure/index.ts",
  "context-liveeditor/editorStoreFunctions/index.ts"
]

// VALIDATION STEPS:
1. Check CRITICAL_FILES exist
   IF ANY MISSING:
      ERROR: "Critical file missing: {filename}"
      ACTION: Create file using template from ADD_NEW_COMPONENT.md

2. Check INTEGRATION_FILES contain references to {componentType}
   IF MISSING:
      ERROR: "Integration missing in {filename}"
      ACTION: Add integration following ADD_NEW_COMPONENT.md Step 3-7
```

### EXECUTION CODE:

```typescript
// AI: Execute this check pattern

const componentType = "{USER_PROVIDED_COMPONENT_TYPE}";

// Check 1.1: Functions file
const functionsPath = `context-liveeditor/editorStoreFunctions/${componentType}Functions.ts`;
if (!fileExists(functionsPath)) {
  ISSUE_DETECTED = "MISSING_FUNCTIONS_FILE";
  SEVERITY = "CRITICAL";
  FIX_ACTION = "Create functions file with 4 required functions";
}

// Check 1.2: Structure file
const structurePath = `componentsStructure/${componentType}.ts`;
if (!fileExists(structurePath)) {
  ISSUE_DETECTED = "MISSING_STRUCTURE_FILE";
  SEVERITY = "CRITICAL";
  FIX_ACTION = "Create structure file with fields definition";
}

// Check 1.3: React component file
const componentPath = `components/tenant/${componentType}/${componentType}1.tsx`;
if (!fileExists(componentPath)) {
  ISSUE_DETECTED = "MISSING_REACT_COMPONENT";
  SEVERITY = "CRITICAL";
  FIX_ACTION = "Create React component following 7-step pattern";
}

// Check 1.4: Integration in editorStore
const editorStoreContent = readFile("context-liveeditor/editorStore.ts");
if (!editorStoreContent.includes(`import { ${componentType}Functions }`)) {
  ISSUE_DETECTED = "MISSING_EDITORSTORE_IMPORT";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add import to editorStore.ts";
}

if (
  !editorStoreContent.includes(
    `${componentType}States: Record<string, ComponentData>`,
  )
) {
  ISSUE_DETECTED = "MISSING_EDITORSTORE_STATE";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add state property to EditorStore interface";
}

// Check 1.5: Integration in ComponentsList
const componentsListContent = readFile("lib-liveeditor/ComponentsList.tsx");
if (!componentsListContent.includes(`import { ${componentType}Structure }`)) {
  ISSUE_DETECTED = "MISSING_COMPONENTSLIST_IMPORT";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add import to ComponentsList.tsx";
}

// AI: Report all detected issues from Layer 1
REPORT_LAYER_1_RESULTS();
```

---

## 🔍 DIAGNOSTIC LAYER 2: FUNCTIONS FILE VALIDATION

### STRUCTURE VALIDATION

```typescript
// AI TASK: Validate {componentType}Functions.ts has correct structure

REQUIRED_EXPORTS = [
  `getDefault${ComponentTypeCamel}Data`,  // e.g., getDefaultPricingData
  `${componentType}Functions`              // e.g., pricingFunctions
]

REQUIRED_FUNCTIONS_IN_OBJECT = [
  "ensureVariant",
  "getData",
  "setData",
  "updateByPath"
]

// VALIDATION STEPS:

1. Check file imports types correctly
   EXPECTED_IMPORTS = [
     "import { ComponentData } from '@/lib/types'",
     "import { ComponentState, createDefaultData, updateDataByPath } from './types'"
   ]

2. Check default data function exists and returns ComponentData
   EXPECTED_SIGNATURE = "export const getDefault{ComponentType}Data = (): ComponentData => ({...})"
   VALIDATION:
     - Returns object with "visible: true" at minimum
     - Has proper TypeScript return type
     - Exports as named export

3. Check functions object has all 4 required functions
   EXPECTED_STRUCTURE:
```

export const {componentType}Functions = {
ensureVariant: (state: any, variantId: string, initial?: ComponentData) => {...},
getData: (state: any, variantId: string) => {...},
setData: (state: any, variantId: string, data: ComponentData) => {...},
updateByPath: (state: any, variantId: string, path: string, value: any) => {...}
};

```

4. Validate ensureVariant function logic
CRITICAL_CHECKS:
  ✓ Checks if state.{componentType}States[variantId] already exists
  ✓ Returns empty object {} if exists
  ✓ Uses getDefault{ComponentType}Data() for defaults
  ✓ Prioritizes: initial || state.tempData || defaultData
  ✓ Returns { {componentType}States: { [variantId]: data } }

5. Validate getData function logic
CRITICAL_CHECKS:
  ✓ Returns state.{componentType}States[variantId]
  ✓ Fallbacks to getDefault{ComponentType}Data() or {}

6. Validate setData function logic
CRITICAL_CHECKS:
  ✓ Returns { {componentType}States: { ...state.{componentType}States, [variantId]: data } }
  ✓ Properly spreads existing states

7. Validate updateByPath function logic
CRITICAL_CHECKS:
  ✓ Gets source from state.{componentType}States[variantId]
  ✓ Uses updateDataByPath(source, path, value) from types.ts
  ✓ Returns updated {componentType}States
  ✓ May also update pageComponentsByPage (optional but recommended)
```

### EXECUTION CODE:

```typescript
// AI: Execute this validation

const functionsFile = readFile(
  `context-liveeditor/editorStoreFunctions/${componentType}Functions.ts`,
);

// Check 2.1: Imports
if (!functionsFile.includes("import { ComponentData } from")) {
  ISSUE_DETECTED = "MISSING_IMPORT_COMPONENTDATA";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add: import { ComponentData } from '@/lib/types'";
}

if (!functionsFile.includes("updateDataByPath")) {
  ISSUE_DETECTED = "MISSING_IMPORT_UPDATEDATABYPATH";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add: import { updateDataByPath } from './types'";
}

// Check 2.2: Default data function
const defaultDataFunctionName = `getDefault${capitalize(componentType)}Data`;
if (!functionsFile.includes(`export const ${defaultDataFunctionName}`)) {
  ISSUE_DETECTED = "MISSING_DEFAULT_DATA_FUNCTION";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Create function: export const ${defaultDataFunctionName} = (): ComponentData => ({...})`;
}

// Check 2.3: Functions object existence
const functionsObjectName = `${componentType}Functions`;
if (!functionsFile.includes(`export const ${functionsObjectName}`)) {
  ISSUE_DETECTED = "MISSING_FUNCTIONS_OBJECT";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Create object: export const ${functionsObjectName} = {...}`;
}

// Check 2.4: All 4 functions exist
const requiredFunctions = [
  "ensureVariant",
  "getData",
  "setData",
  "updateByPath",
];
for (const funcName of requiredFunctions) {
  if (!functionsFile.includes(`${funcName}:`)) {
    ISSUE_DETECTED = `MISSING_FUNCTION_${funcName.toUpperCase()}`;
    SEVERITY = "CRITICAL";
    FIX_ACTION = `Add ${funcName} function to ${functionsObjectName}`;
  }
}

// Check 2.5: ensureVariant logic validation
const ensureVariantCode = extractFunctionCode(functionsFile, "ensureVariant");
if (!ensureVariantCode.includes(`state.${componentType}States[variantId]`)) {
  ISSUE_DETECTED = "INCORRECT_ENSUREVARIANT_STATE_CHECK";
  SEVERITY = "HIGH";
  FIX_ACTION = `Fix ensureVariant to check: state.${componentType}States[variantId]`;
}

if (!ensureVariantCode.includes(`${defaultDataFunctionName}()`)) {
  ISSUE_DETECTED = "ENSUREVARIANT_NOT_USING_DEFAULT_DATA";
  SEVERITY = "MEDIUM";
  FIX_ACTION = `Use ${defaultDataFunctionName}() in ensureVariant`;
}

// Check 2.6: Return type validation
if (
  !ensureVariantCode.includes(`return {`) ||
  !ensureVariantCode.includes(`${componentType}States:`)
) {
  ISSUE_DETECTED = "INCORRECT_ENSUREVARIANT_RETURN";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Fix return: { ${componentType}States: { ...state.${componentType}States, [variantId]: data } }`;
}

// AI: Report all detected issues from Layer 2
REPORT_LAYER_2_RESULTS();
```

---

## 🔍 DIAGNOSTIC LAYER 3: STRUCTURE FILE VALIDATION

### STRUCTURE DEFINITION VALIDATION

```typescript
// AI TASK: Validate componentsStructure/{componentType}.ts

REQUIRED_STRUCTURE = {
  componentType: string,  // Must match component type name
  variants: VariantDefinition[]
}

VARIANT_DEFINITION = {
  id: string,             // e.g., "pricing1"
  name: string,           // Display name
  fields: FieldDefinition[],
  simpleFields?: FieldDefinition[]
}

FIELD_TYPES = [
  "text", "textarea", "number", "boolean",
  "color", "image", "select", "array", "object"
]

// VALIDATION STEPS:

1. Check file imports ComponentStructure type
   EXPECTED: "import { ComponentStructure } from './types'"

2. Check export statement
   EXPECTED: "export const {componentType}Structure: ComponentStructure = {...}"

3. Validate componentType property
   CRITICAL: Must match the component type name exactly
   EXAMPLE: For "pricing", componentType MUST be "pricing"

4. Validate variants array
   CHECKS:
     ✓ Contains at least one variant
     ✓ Each variant has unique id
     ✓ Variant id follows pattern: {componentType}1, {componentType}2, etc.

5. Validate fields array
   CHECKS:
     ✓ Contains "visible" boolean field at minimum
     ✓ All field keys match default data structure
     ✓ Nested objects use type: "object" with fields: []
     ✓ Arrays use type: "array" with of: []
     ✓ All required fields have proper types

6. Validate field structure matches default data
   CRITICAL_CHECK:
     - Extract all keys from getDefault{ComponentType}Data()
     - Compare with fields in structure
     - ISSUE if fields reference non-existent keys
     - ISSUE if important keys missing from fields

7. Check simpleFields array (optional but recommended)
   EXPECTED: Subset of main fields for simple editing mode
```

### EXECUTION CODE:

```typescript
// AI: Execute structure validation

const structureFile = readFile(`componentsStructure/${componentType}.ts`);

// Check 3.1: Import statement
if (!structureFile.includes("import { ComponentStructure } from './types'")) {
  ISSUE_DETECTED = "MISSING_STRUCTURE_IMPORT";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add: import { ComponentStructure } from './types'";
}

// Check 3.2: Export statement
const structureName = `${componentType}Structure`;
if (!structureFile.includes(`export const ${structureName}`)) {
  ISSUE_DETECTED = "MISSING_STRUCTURE_EXPORT";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add: export const ${structureName}: ComponentStructure = {...}`;
}

// Check 3.3: Parse structure object
const structure = parseStructureFromFile(structureFile);

if (structure.componentType !== componentType) {
  ISSUE_DETECTED = "INCORRECT_COMPONENT_TYPE";
  SEVERITY = "CRITICAL";
  EXPECTED = componentType;
  ACTUAL = structure.componentType;
  FIX_ACTION = `Change componentType to "${componentType}"`;
}

// Check 3.4: Variants validation
if (!structure.variants || structure.variants.length === 0) {
  ISSUE_DETECTED = "NO_VARIANTS_DEFINED";
  SEVERITY = "CRITICAL";
  FIX_ACTION = "Add at least one variant definition";
}

for (const variant of structure.variants) {
  // Check variant id format
  if (!variant.id.startsWith(componentType)) {
    ISSUE_DETECTED = "INCORRECT_VARIANT_ID";
    VARIANT = variant.id;
    SEVERITY = "HIGH";
    FIX_ACTION = `Variant id should start with "${componentType}"`;
  }

  // Check fields array
  if (!variant.fields || variant.fields.length === 0) {
    ISSUE_DETECTED = "NO_FIELDS_DEFINED";
    VARIANT = variant.id;
    SEVERITY = "CRITICAL";
    FIX_ACTION = "Add fields array with at least 'visible' field";
  }

  // Check visible field exists
  const hasVisibleField = variant.fields.some((f) => f.key === "visible");
  if (!hasVisibleField) {
    ISSUE_DETECTED = "MISSING_VISIBLE_FIELD";
    VARIANT = variant.id;
    SEVERITY = "HIGH";
    FIX_ACTION = "Add: { key: 'visible', label: 'Visible', type: 'boolean' }";
  }
}

// Check 3.5: Fields match default data structure
const defaultData = getDefaultDataFromFunctionsFile(componentType);
const fieldsKeys = extractFieldKeys(structure.variants[0].fields);
const defaultDataKeys = extractAllKeys(defaultData);

const missingInStructure = defaultDataKeys.filter(
  (k) => !fieldsKeys.includes(k),
);
if (missingInStructure.length > 0) {
  ISSUE_DETECTED = "FIELDS_MISSING_IN_STRUCTURE";
  SEVERITY = "MEDIUM";
  MISSING_KEYS = missingInStructure;
  FIX_ACTION = `Add fields for keys: ${missingInStructure.join(", ")}`;
}

const extraInStructure = fieldsKeys.filter((k) => !defaultDataKeys.includes(k));
if (extraInStructure.length > 0) {
  ISSUE_DETECTED = "EXTRA_FIELDS_IN_STRUCTURE";
  SEVERITY = "LOW";
  EXTRA_KEYS = extraInStructure;
  WARNING = `These fields don't exist in default data: ${extraInStructure.join(", ")}`;
}

// AI: Report all detected issues from Layer 3
REPORT_LAYER_3_RESULTS();
```

---

## 🔍 DIAGNOSTIC LAYER 4: EDITORSTORE INTEGRATION VALIDATION

### STORE INTEGRATION CHECKS

```typescript
// AI TASK: Validate editorStore.ts integration

REQUIRED_IN_EDITORSTORE = [
  "1. Import statement",
  "2. Interface state property",
  "3. Interface function signatures",
  "4. State initialization",
  "5. Switch case in ensureComponentVariant",
  "6. Switch case in getComponentData",
  "7. Switch case in setComponentData",
  "8. Switch case in updateComponentByPath",
  "9. Specific component functions"
]

// VALIDATION STEPS:

1. Check import statement
   LOCATION: Top of file (~line 46-68)
   EXPECTED: "import { {componentType}Functions } from './editorStoreFunctions/{componentType}Functions'"

2. Check interface state property
   LOCATION: EditorStore interface (~line 82-447)
   EXPECTED:
```

{componentType}States: Record<string, ComponentData>;
ensure{ComponentTypeCamel}Variant: (variantId: string, initial?: ComponentData) => void;
get{ComponentTypeCamel}Data: (variantId: string) => ComponentData;
set{ComponentTypeCamel}Data: (variantId: string, data: ComponentData) => void;
update{ComponentTypeCamel}ByPath: (variantId: string, path: string, value: any) => void;

```

3. Check state initialization
LOCATION: Inside create() function (~line 449-498)
EXPECTED: "{componentType}States: {},"

4. Check switch case in ensureComponentVariant
LOCATION: ensureComponentVariant function (~line 843-940)
EXPECTED:
```

case "{componentType}":
return {componentType}Functions.ensureVariant(state, variantId, initial);

```

5. Check switch case in getComponentData
LOCATION: getComponentData function (~line 942-994)
EXPECTED:
```

case "{componentType}":
return {componentType}Functions.getData(state, variantId);

```

6. Check switch case in setComponentData
LOCATION: setComponentData function (~line 996-1106)
EXPECTED:
```

case "{componentType}":
newState = {componentType}Functions.setData(state, variantId, data);
break;

```

7. Check switch case in updateComponentByPath
LOCATION: updateComponentByPath function (~line 1108-1339)
EXPECTED:
```

case "{componentType}":
newState = {componentType}Functions.updateByPath(state, variantId, path, value);
break;

```

8. Check specific component functions
LOCATION: After generic functions (~line 1341+)
EXPECTED:
```

ensure{ComponentTypeCamel}Variant: (variantId, initial) =>
set((state) => {componentType}Functions.ensureVariant(state, variantId, initial)),

get{ComponentTypeCamel}Data: (variantId) => {
const state = get();
return {componentType}Functions.getData(state, variantId);
},

set{ComponentTypeCamel}Data: (variantId, data) =>
set((state) => {componentType}Functions.setData(state, variantId, data)),

update{ComponentTypeCamel}ByPath: (variantId, path, value) =>
set((state) => {componentType}Functions.updateByPath(state, variantId, path, value)),

```

9. Check loadFromDatabase function integration
LOCATION: loadFromDatabase function (~line 1629-1895)
EXPECTED: Case for {componentType} in switch statement
```

case "{componentType}":
newState.{componentType}States = {componentType}Functions.setData(
newState,
comp.id,
comp.data
).{componentType}States;
break;

```

```

### EXECUTION CODE:

```typescript
// AI: Execute editorStore validation

const editorStoreFile = readFile("context-liveeditor/editorStore.ts");

// Check 4.1: Import
const expectedImport = `import { ${componentType}Functions } from "./editorStoreFunctions/${componentType}Functions"`;
if (!editorStoreFile.includes(`${componentType}Functions`)) {
  ISSUE_DETECTED = "MISSING_EDITORSTORE_IMPORT";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add import: ${expectedImport}`;
  INSERT_AT = "After other function imports (~line 46-68)";
}

// Check 4.2: Interface property
const statePropertyName = `${componentType}States: Record<string, ComponentData>`;
if (!editorStoreFile.includes(statePropertyName)) {
  ISSUE_DETECTED = "MISSING_INTERFACE_STATE_PROPERTY";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add to EditorStore interface: ${statePropertyName}`;
  INSERT_AT = "In interface EditorStore (~line 82-447)";
}

// Check 4.3: State initialization
const stateInit = `${componentType}States: {}`;
if (!editorStoreFile.includes(stateInit)) {
  ISSUE_DETECTED = "MISSING_STATE_INITIALIZATION";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add in create(): ${stateInit}`;
  INSERT_AT = "In state initialization (~line 480-498)";
}

// Check 4.4: Switch case in ensureComponentVariant
const ensureCase = `case "${componentType}":`;
const ensureFunctionSection = extractFunctionCode(
  editorStoreFile,
  "ensureComponentVariant",
);
if (!ensureFunctionSection.includes(ensureCase)) {
  ISSUE_DETECTED = "MISSING_ENSURE_SWITCH_CASE";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add case "${componentType}": return ${componentType}Functions.ensureVariant(state, variantId, initial);`;
  INSERT_AT = "In ensureComponentVariant switch (~line 843-940)";
}

// Check 4.5: Switch case in getComponentData
const getFunctionSection = extractFunctionCode(
  editorStoreFile,
  "getComponentData",
);
if (!getFunctionSection.includes(ensureCase)) {
  ISSUE_DETECTED = "MISSING_GET_SWITCH_CASE";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add case "${componentType}": return ${componentType}Functions.getData(state, variantId);`;
  INSERT_AT = "In getComponentData switch (~line 942-994)";
}

// Check 4.6: Switch case in setComponentData
const setFunctionSection = extractFunctionCode(
  editorStoreFile,
  "setComponentData",
);
if (!setFunctionSection.includes(ensureCase)) {
  ISSUE_DETECTED = "MISSING_SET_SWITCH_CASE";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add case "${componentType}": newState = ${componentType}Functions.setData(state, variantId, data); break;`;
  INSERT_AT = "In setComponentData switch (~line 996-1106)";
}

// Check 4.7: Switch case in updateComponentByPath
const updateFunctionSection = extractFunctionCode(
  editorStoreFile,
  "updateComponentByPath",
);
if (!updateFunctionSection.includes(ensureCase)) {
  ISSUE_DETECTED = "MISSING_UPDATE_SWITCH_CASE";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add case "${componentType}": newState = ${componentType}Functions.updateByPath(state, variantId, path, value); break;`;
  INSERT_AT = "In updateComponentByPath switch (~line 1108-1339)";
}

// Check 4.8: Specific functions
const ComponentTypeCamel = capitalize(componentType);
const specificFunctions = [
  `ensure${ComponentTypeCamel}Variant`,
  `get${ComponentTypeCamel}Data`,
  `set${ComponentTypeCamel}Data`,
  `update${ComponentTypeCamel}ByPath`,
];

for (const funcName of specificFunctions) {
  if (!editorStoreFile.includes(`${funcName}:`)) {
    ISSUE_DETECTED = `MISSING_SPECIFIC_FUNCTION_${funcName}`;
    SEVERITY = "HIGH";
    FIX_ACTION = `Add specific function: ${funcName}`;
    INSERT_AT = "After generic functions (~line 1341+)";
  }
}

// Check 4.9: loadFromDatabase integration
const loadFromDbSection = extractFunctionCode(
  editorStoreFile,
  "loadFromDatabase",
);
if (!loadFromDbSection.includes(`case "${componentType}":`)) {
  ISSUE_DETECTED = "MISSING_LOADFROMDATABASE_CASE";
  SEVERITY = "HIGH";
  FIX_ACTION = `Add case in loadFromDatabase for "${componentType}":
    case "${componentType}":
      newState.${componentType}States = ${componentType}Functions.setData(
        newState,
        comp.id,  // ✅ CRITICAL: Use comp.id (UUID), NOT comp.componentName
        comp.data,
      ).${componentType}States;
      break;`;
  INSERT_AT = "In loadFromDatabase switch (~line 1797-2042)";
  REFERENCE =
    "See @docs/important/liveEditor/DATABASE_DATA_LOADING.md for details";
}

// AI: Report all detected issues from Layer 4
REPORT_LAYER_4_RESULTS();
```

---

## 🔍 DIAGNOSTIC LAYER 5: COMPONENTSLIST INTEGRATION VALIDATION

### REGISTRY VALIDATION

```typescript
// AI TASK: Validate ComponentsList.tsx integration

REQUIRED_IN_COMPONENTSLIST = [
  "1. Import structure",
  "2. Entry in getComponents function",
  "3. Entry in COMPONENTS constant",
  "4. Section components array reference"
]

// VALIDATION STEPS:

1. Check import statement
   LOCATION: Top of file (~line 24-43)
   EXPECTED: "import { {componentType}Structure } from '@/componentsStructure/{componentType}'"

2. Check entry in getComponents function
   LOCATION: getComponents function (~line 70-352)
   EXPECTED:
```

{componentType}: {
id: "{componentType}",
name: "{componentType}",
displayName: t("components.{componentType}.display_name"),
description: t("components.{componentType}.description"),
category: "{category}",
section: "{section}",
subPath: "{componentType}",
variants: {componentType}Structure.variants.map((variant) => ({
...variant,
componentPath: `components/tenant/{componentType}/${variant.id}.tsx`,
})),
icon: "{icon}",
hasStore: true,
hasStructure: true,
defaultTheme: "{componentType}1",
...{componentType}Structure,
},

```

3. Check entry in COMPONENTS constant
LOCATION: COMPONENTS constant (~line 355-578)
EXPECTED: Similar structure as getComponents but without translations

4. Check section components array
LOCATION: getSections or SECTIONS constant (~line 74-103)
EXPECTED: "{componentType}" in components array of appropriate section
```

### EXECUTION CODE:

```typescript
// AI: Execute ComponentsList validation

const componentsListFile = readFile("lib-liveeditor/ComponentsList.tsx");

// Check 5.1: Import
const expectedImport = `import { ${componentType}Structure } from "@/componentsStructure/${componentType}"`;
if (!componentsListFile.includes(`${componentType}Structure`)) {
  ISSUE_DETECTED = "MISSING_COMPONENTSLIST_IMPORT";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add import: ${expectedImport}`;
  INSERT_AT = "In imports section (~line 24-43)";
}

// Check 5.2: Entry in getComponents
const getComponentsSection = extractFunctionCode(
  componentsListFile,
  "getComponents",
);
if (!getComponentsSection.includes(`${componentType}: {`)) {
  ISSUE_DETECTED = "MISSING_GETCOMPONENTS_ENTRY";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add entry for ${componentType} in getComponents function`;
  INSERT_AT = "In getComponents function (~line 70-352)";
}

// Validate entry structure
if (getComponentsSection.includes(`${componentType}: {`)) {
  const entry = extractComponentEntry(getComponentsSection, componentType);

  if (!entry.includes(`id: "${componentType}"`)) {
    ISSUE_DETECTED = "INCORRECT_COMPONENT_ID";
    SEVERITY = "HIGH";
    FIX_ACTION = `Set id to "${componentType}"`;
  }

  if (!entry.includes(`...${componentType}Structure`)) {
    ISSUE_DETECTED = "NOT_SPREADING_STRUCTURE";
    SEVERITY = "HIGH";
    FIX_ACTION = `Add: ...${componentType}Structure at the end of object`;
  }

  if (!entry.includes(`hasStore: true`)) {
    WARNING = "hasStore not set to true - component may not integrate properly";
  }
}

// Check 5.3: Entry in COMPONENTS constant
const componentsConstant = extractConstantCode(
  componentsListFile,
  "COMPONENTS",
);
if (!componentsConstant.includes(`${componentType}: {`)) {
  ISSUE_DETECTED = "MISSING_COMPONENTS_CONSTANT_ENTRY";
  SEVERITY = "HIGH";
  FIX_ACTION = `Add entry for ${componentType} in COMPONENTS constant`;
  INSERT_AT = "In COMPONENTS constant (~line 355-578)";
}

// Check 5.4: Section reference
const sectionsCode = extractSectionsCode(componentsListFile);
const componentSection = detectComponentSection(componentType); // e.g., "homepage", "content"

if (!sectionsCode.includes(`"${componentType}"`)) {
  ISSUE_DETECTED = "NOT_IN_SECTION_COMPONENTS";
  SEVERITY = "MEDIUM";
  FIX_ACTION = `Add "${componentType}" to components array in ${componentSection} section`;
}

// AI: Report all detected issues from Layer 5
REPORT_LAYER_5_RESULTS();
```

---

## 🔍 DIAGNOSTIC LAYER 6: REACT COMPONENT VALIDATION

### COMPONENT FILE VALIDATION

```typescript
// AI TASK: Validate components/tenant/{componentType}/{componentType}1.tsx

THE_7_STEP_PATTERN = [
  "Step 1: Extract unique ID",
  "Step 2: Connect to stores",
  "Step 3: Initialize in store (useEffect)",
  "Step 4: Retrieve data from store",
  "Step 5: Merge data (priority order)",
  "Step 6: Early return if not visible",
  "Step 7: Render component"
]

// VALIDATION STEPS:

1. Check file is "use client"
   EXPECTED: First line is '"use client";'

2. Check imports
   REQUIRED_IMPORTS = [
     "useEffect from 'react'",
     "useEditorStore from '@/context-liveeditor/editorStore'",
     "useTenantStore from '@/context-liveeditor/tenantStore'",
     "getDefault{ComponentType}Data from functions file"
   ]

3. Check props interface
   CRITICAL_PROPS = [
     "variant?: string",
     "useStore?: boolean",
     "id?: string"
   ]
   SHOULD_HAVE: All component-specific props matching default data structure

4. Validate Step 1: Extract unique ID
   EXPECTED_CODE:
```

const variantId = props.variant || "{componentType}1";
const uniqueId = props.id || variantId;

```

5. Validate Step 2: Connect to stores
EXPECTED_SUBSCRIPTIONS:
```

const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);
const getComponentData = useEditorStore(s => s.getComponentData);
const {componentType}States = useEditorStore(s => s.{componentType}States);
const tenantData = useTenantStore(s => s.tenantData);

```

6. Validate Step 3: Initialize in store
EXPECTED_USEEFFECT:
```

useEffect(() => {
if (props.useStore) {
const initialData = {
...getDefault{ComponentType}Data(),
...props
};
ensureComponentVariant("{componentType}", uniqueId, initialData);
}
}, [uniqueId, props.useStore]);

```

7. Validate Step 4: Retrieve data
EXPECTED:
```

const storeData = {componentType}States[uniqueId];
const currentStoreData = getComponentData("{componentType}", uniqueId);

```

8. Validate Step 5: Merge data
EXPECTED_MERGE_ORDER:
```

const mergedData = {
...getDefault{ComponentType}Data(), // Lowest priority
...storeData,
...currentStoreData,
...props // Highest priority
};

```
CRITICAL: Must use mergedData for all rendering, NOT props directly

9. Validate Step 6: Early return
EXPECTED:
```

if (!mergedData.visible) {
return null;
}

```

10. Validate Step 7: Render
 CRITICAL_CHECK: All rendered values use mergedData, not props
 EXAMPLE:
   ✅ {mergedData.content?.title}
   ❌ {props.content?.title}
```

### EXECUTION CODE:

```typescript
// AI: Execute React component validation

const componentFile = readFile(
  `components/tenant/${componentType}/${componentType}1.tsx`,
);

// Check 6.1: "use client"
if (!componentFile.startsWith('"use client"')) {
  ISSUE_DETECTED = "MISSING_USE_CLIENT_DIRECTIVE";
  SEVERITY = "HIGH";
  FIX_ACTION = 'Add "use client"; as first line';
}

// Check 6.2: Imports
const requiredImports = [
  "useEffect",
  "useEditorStore",
  "useTenantStore",
  `getDefault${capitalize(componentType)}Data`,
];

for (const imp of requiredImports) {
  if (!componentFile.includes(imp)) {
    ISSUE_DETECTED = `MISSING_IMPORT_${imp.toUpperCase()}`;
    SEVERITY = "HIGH";
    FIX_ACTION = `Add import for ${imp}`;
  }
}

// Check 6.3: Props interface
if (!componentFile.includes("variant?: string")) {
  ISSUE_DETECTED = "MISSING_VARIANT_PROP";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add variant?: string to props interface";
}

if (!componentFile.includes("useStore?: boolean")) {
  ISSUE_DETECTED = "MISSING_USESTORE_PROP";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add useStore?: boolean to props interface";
}

if (!componentFile.includes("id?: string")) {
  ISSUE_DETECTED = "MISSING_ID_PROP";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add id?: string to props interface";
}

// Check 6.4: Step 1 - Extract unique ID
if (!componentFile.includes("const variantId = props.variant ||")) {
  ISSUE_DETECTED = "MISSING_VARIANTID_EXTRACTION";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add: const variantId = props.variant || "${componentType}1";`;
}

if (!componentFile.includes("const uniqueId = props.id || variantId")) {
  ISSUE_DETECTED = "MISSING_UNIQUEID_EXTRACTION";
  SEVERITY = "CRITICAL";
  FIX_ACTION = "Add: const uniqueId = props.id || variantId;";
}

// Check 6.5: Step 2 - Connect to stores
if (!componentFile.includes("useEditorStore(s => s.ensureComponentVariant)")) {
  ISSUE_DETECTED = "MISSING_ENSURE_SUBSCRIPTION";
  SEVERITY = "CRITICAL";
  FIX_ACTION =
    "Add: const ensureComponentVariant = useEditorStore(s => s.ensureComponentVariant);";
}

if (!componentFile.includes(`${componentType}States`)) {
  ISSUE_DETECTED = "MISSING_STATES_SUBSCRIPTION";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add: const ${componentType}States = useEditorStore(s => s.${componentType}States);`;
}

// Check 6.6: Step 3 - Initialize useEffect
const hasUseEffect = componentFile.includes("useEffect(");
const hasEnsureCall = componentFile.includes(
  `ensureComponentVariant("${componentType}"`,
);

if (!hasUseEffect || !hasEnsureCall) {
  ISSUE_DETECTED = "MISSING_INITIALIZATION_USEEFFECT";
  SEVERITY = "CRITICAL";
  FIX_ACTION = "Add useEffect with ensureComponentVariant call";
}

// Check 6.6.1: Database data loading in useEffect
const useEffectCode = extractFunctionCode(componentFile, "useEffect", true);
const hasTenantDataCheck =
  componentFile.includes("getTenantComponentData") ||
  componentFile.includes("tenantComponentData");
const hasTenantDataInDeps =
  useEffectCode &&
  (useEffectCode.includes("tenantComponentData") ||
    useEffectCode.includes("tenantData"));

if (!hasTenantDataCheck && hasUseEffect) {
  ISSUE_DETECTED = "MISSING_DATABASE_DATA_LOADING";
  SEVERITY = "HIGH";
  FIX_ACTION = `Add database data loading:
    1. Create getTenantComponentData() function BEFORE useEffect
    2. Extract tenantComponentData from tenantData
    3. Use tenantComponentData in initialData
    4. Add tenantComponentData to useEffect dependencies
    Reference: @docs/important/liveEditor/DATABASE_DATA_LOADING.md`;
}

if (hasTenantDataCheck && !hasTenantDataInDeps) {
  ISSUE_DETECTED = "MISSING_TENANT_DATA_DEPENDENCY";
  SEVERITY = "HIGH";
  FIX_ACTION = "Add tenantComponentData to useEffect dependencies array";
}

// Check 6.7: Step 4 - Retrieve data
if (!componentFile.includes(`${componentType}States[uniqueId]`)) {
  ISSUE_DETECTED = "NOT_RETRIEVING_STORE_DATA";
  SEVERITY = "CRITICAL";
  FIX_ACTION = `Add: const storeData = ${componentType}States[uniqueId];`;
}

// Check 6.8: Step 5 - Merge data
if (!componentFile.includes("const mergedData = {")) {
  ISSUE_DETECTED = "MISSING_MERGED_DATA";
  SEVERITY = "CRITICAL";
  FIX_ACTION = "Add mergedData object merging defaults, store, and props";
}

const hasMergedData = componentFile.includes("const mergedData");
if (hasMergedData) {
  const mergedDataCode = extractVariableCode(componentFile, "mergedData");

  if (
    !mergedDataCode.includes(`getDefault${capitalize(componentType)}Data()`)
  ) {
    ISSUE_DETECTED = "MERGEDDATA_NOT_USING_DEFAULTS";
    SEVERITY = "HIGH";
    FIX_ACTION = `Start mergedData with ...getDefault${capitalize(componentType)}Data()`;
  }

  if (!mergedDataCode.includes("...props")) {
    ISSUE_DETECTED = "MERGEDDATA_NOT_SPREADING_PROPS";
    SEVERITY = "MEDIUM";
    FIX_ACTION = "Add ...props as last spread in mergedData";
  }
}

// Check 6.9: Step 6 - Early return
if (
  !componentFile.includes("if (!mergedData.visible)") &&
  !componentFile.includes("if (mergedData.visible === false)")
) {
  ISSUE_DETECTED = "MISSING_VISIBILITY_CHECK";
  SEVERITY = "MEDIUM";
  FIX_ACTION = "Add: if (!mergedData.visible) return null;";
}

// Check 6.10: Step 7 - Using mergedData in render
const renderSection = extractRenderCode(componentFile);

// Count usage of props vs mergedData in render
const propsUsage = countOccurrences(renderSection, "props.");
const mergedDataUsage = countOccurrences(renderSection, "mergedData.");

if (propsUsage > mergedDataUsage) {
  ISSUE_DETECTED = "USING_PROPS_INSTEAD_OF_MERGEDDATA";
  SEVERITY = "CRITICAL";
  PROPS_COUNT = propsUsage;
  MERGEDDATA_COUNT = mergedDataUsage;
  FIX_ACTION = "Replace all props.* with mergedData.* in render section";
}

// Specific check for common mistakes
if (
  renderSection.includes("props.content") ||
  renderSection.includes("props.styling") ||
  renderSection.includes("props.layout")
) {
  ISSUE_DETECTED = "DIRECT_PROPS_USAGE_IN_RENDER";
  SEVERITY = "CRITICAL";
  FIX_ACTION =
    "MUST use mergedData.content, mergedData.styling, etc. NOT props.*";
}

// AI: Report all detected issues from Layer 6
REPORT_LAYER_6_RESULTS();
```

---

## 🔍 DIAGNOSTIC LAYER 7: INDEX FILES AND EXPORTS VALIDATION

### EXPORT VALIDATIONS

```typescript
// AI TASK: Validate all index/export files

EXPORT_FILES_TO_CHECK = [
  "componentsStructure/index.ts",
  "context-liveeditor/editorStoreFunctions/index.ts"
]

// VALIDATION STEPS:

1. Check componentsStructure/index.ts
   EXPECTED: "export { {componentType}Structure } from './{componentType}'"
   LOCATION: Add alphabetically with other exports

2. Check editorStoreFunctions/index.ts
   EXPECTED: "export * from './{componentType}Functions'"
   LOCATION: Add alphabetically with other exports

3. Verify no duplicate exports
   CHECK: No export appears twice

4. Verify export order (alphabetical recommended)
   RECOMMENDATION: Keep alphabetical for maintainability
```

### EXECUTION CODE:

```typescript
// AI: Execute exports validation

// Check 7.1: componentsStructure/index.ts
const structureIndexFile = readFile("componentsStructure/index.ts");

const expectedStructureExport = `export { ${componentType}Structure } from "./${componentType}"`;
if (!structureIndexFile.includes(`${componentType}Structure`)) {
  ISSUE_DETECTED = "MISSING_STRUCTURE_INDEX_EXPORT";
  SEVERITY = "HIGH";
  FIX_ACTION = `Add to componentsStructure/index.ts: ${expectedStructureExport}`;
  SORT_ALPHABETICALLY = true;
}

// Check 7.2: editorStoreFunctions/index.ts
const functionsIndexFile = readFile(
  "context-liveeditor/editorStoreFunctions/index.ts",
);

const expectedFunctionsExport = `export * from "./${componentType}Functions"`;
if (!functionsIndexFile.includes(`${componentType}Functions"`)) {
  ISSUE_DETECTED = "MISSING_FUNCTIONS_INDEX_EXPORT";
  SEVERITY = "HIGH";
  FIX_ACTION = `Add to editorStoreFunctions/index.ts: ${expectedFunctionsExport}`;
  SORT_ALPHABETICALLY = true;
}

// Check 7.3: Check for duplicates
const allExports = extractAllExports(structureIndexFile);
const duplicates = findDuplicates(allExports);
if (duplicates.length > 0) {
  WARNING = `Duplicate exports found: ${duplicates.join(", ")}`;
  FIX_ACTION = "Remove duplicate export statements";
}

// AI: Report all detected issues from Layer 7
REPORT_LAYER_7_RESULTS();
```

---

## 🔧 REPAIR EXECUTION PROTOCOL

### SYSTEMATIC REPAIR PROCESS

````typescript
// AI: Execute repairs in this exact order

REPAIR_PRIORITY_ORDER = [
  "CRITICAL - MISSING_FILES",
  "CRITICAL - FUNCTION_LOGIC_ERRORS",
  "CRITICAL - INTEGRATION_MISSING",
  "HIGH - INCORRECT_STRUCTURE",
  "HIGH - MISSING_EXPORTS",
  "MEDIUM - INCONSISTENCIES",
  "LOW - OPTIMIZATIONS"
]

// EXECUTION PATTERN:

FOR EACH DETECTED ISSUE IN PRIORITY ORDER:

  1. LOG ISSUE
     console.log(`[FIX] ${ISSUE_DETECTED}`);
     console.log(`[SEVERITY] ${SEVERITY}`);
     console.log(`[ACTION] ${FIX_ACTION}`);

  2. EXECUTE FIX
     APPLY FIX ACCORDING TO FIX_ACTION

  3. VERIFY FIX
     RE-RUN SPECIFIC DIAGNOSTIC CHECK
     IF STILL FAILING:
       LOG: "Fix failed, manual intervention required"
       CONTINUE TO NEXT ISSUE
     ELSE:
       LOG: "✓ Fix successful"

  4. TRACK FIXES
     FIXES_APPLIED.push({
       issue: ISSUE_DETECTED,
       severity: SEVERITY,
       action: FIX_ACTION,
       status: "SUCCESS" | "FAILED"
     });

AFTER ALL FIXES APPLIED:

  1. RE-RUN ALL 7 DIAGNOSTIC LAYERS

  2. GENERATE REPORT:
     ```
     COMPONENT REPAIR REPORT: {componentType}
     ================================

     TOTAL ISSUES FOUND: {totalIssues}
     CRITICAL: {criticalCount}
     HIGH: {highCount}
     MEDIUM: {mediumCount}
     LOW: {lowCount}

     FIXES APPLIED: {fixesApplied}
     SUCCESSFUL: {successCount}
     FAILED: {failedCount}

     REMAINING ISSUES: {remainingIssues}

     DETAILED FIXES:
     {list each fix with before/after}

     RECOMMENDATIONS:
     {any additional recommendations}
     ```

  3. IF ALL CRITICAL/HIGH ISSUES FIXED:
     STATUS = "COMPONENT REPAIRED AND FUNCTIONAL"

  4. IF CRITICAL ISSUES REMAIN:
     STATUS = "COMPONENT REQUIRES MANUAL REVIEW"
     LIST REMAINING CRITICAL ISSUES
````

---

## 📋 USAGE EXAMPLES FOR AI

### Example 1: Fix Complete Component

```
USER: Fix the "testimonials" component

AI EXECUTES:
1. SET componentType = "testimonials"
2. RUN DIAGNOSTIC LAYER 1
3. RUN DIAGNOSTIC LAYER 2
4. RUN DIAGNOSTIC LAYER 3
5. RUN DIAGNOSTIC LAYER 4
6. RUN DIAGNOSTIC LAYER 5
7. RUN DIAGNOSTIC LAYER 6
8. RUN DIAGNOSTIC LAYER 7
9. COLLECT ALL ISSUES
10. EXECUTE REPAIRS IN PRIORITY ORDER
11. RE-VERIFY ALL LAYERS
12. GENERATE REPORT
```

### Example 2: Fix Specific Issue

```
USER: The "pricing" component doesn't update when I edit it in EditorSidebar

AI ANALYSIS:
- Issue likely in: Layer 4 (editorStore integration) or Layer 6 (React component)
- Primary suspects:
  1. Missing switch case in updateComponentByPath
  2. Component not subscribing to store updates
  3. Component using props instead of mergedData

AI EXECUTES:
1. SET componentType = "pricing"
2. RUN DIAGNOSTIC LAYER 4 (focus on updateComponentByPath)
3. RUN DIAGNOSTIC LAYER 6 (focus on store subscriptions)
4. IDENTIFY SPECIFIC ISSUE
5. APPLY TARGETED FIX
6. VERIFY FIX WORKS
```

### Example 3: Component Not Appearing

```
USER: I can't find the "gallery" component in the editor

AI ANALYSIS:
- Issue likely in: Layer 5 (ComponentsList integration)
- Primary check: Component registered in COMPONENTS constant

AI EXECUTES:
1. SET componentType = "gallery"
2. RUN DIAGNOSTIC LAYER 1 (verify files exist)
3. RUN DIAGNOSTIC LAYER 5 (verify ComponentsList integration)
4. IF MISSING: Add component to ComponentsList
5. VERIFY component appears in editor
```

---

## 🎯 ADVANCED DIAGNOSTICS

### Common Issue Patterns

```typescript
// AI: Use these patterns to identify common problems quickly

PATTERN_1: Component renders but doesn't update
  SYMPTOMS:
    - Component displays initial data
    - EditorSidebar opens
    - Changes in EditorSidebar don't reflect in component
  LIKELY_CAUSE:
    - Missing updateComponentByPath switch case
    - Component not subscribed to {componentType}States
    - Using props instead of mergedData in render
  DIAGNOSTIC:
    - Check Layer 4: updateComponentByPath switch
    - Check Layer 6: Store subscriptions and mergedData usage

PATTERN_2: Component doesn't appear in editor
  SYMPTOMS:
    - Component files exist
    - Can't find in component list
  LIKELY_CAUSE:
    - Not registered in ComponentsList.tsx
    - Missing in section components array
  DIAGNOSTIC:
    - Check Layer 5: ComponentsList integration

PATTERN_3: Component breaks on page load
  SYMPTOMS:
    - TypeError or crash when loading page
    - Console errors about undefined data
  LIKELY_CAUSE:
    - Missing default data function
    - ensureVariant not initializing properly
    - Wrong data structure in default data
  DIAGNOSTIC:
    - Check Layer 2: Functions file validation
    - Verify default data structure matches component expectations

PATTERN_4: Multiple instances interfere with each other
  SYMPTOMS:
    - Editing one instance affects another
    - Data gets mixed between instances
  LIKELY_CAUSE:
    - Using variantId instead of uniqueId (props.id)
    - Not using UUID for component instances
  DIAGNOSTIC:
    - Check Layer 6: Verify uniqueId usage
    - Ensure all store operations use uniqueId not variantId

PATTERN_5: Component doesn't save to database
  SYMPTOMS:
    - Changes work in editor
    - After refresh, changes are lost
  LIKELY_CAUSE:
    - Missing loadFromDatabase case
    - pageComponentsByPage not updating
  DIAGNOSTIC:
    - Check Layer 4: loadFromDatabase integration
    - Verify setData and updateByPath update pageComponentsByPage
```

---

## ⚡ QUICK FIX COMMANDS

### Pre-defined Fix Commands

```typescript
// AI: Use these shortcuts for common fixes

COMMAND: FIX_MISSING_INTEGRATION
  EXECUTES:
    - Add all missing editorStore integrations
    - Add all missing ComponentsList entries
    - Add all missing exports
  USE_WHEN: Component files exist but not integrated

COMMAND: FIX_COMPONENT_PATTERN
  EXECUTES:
    - Rewrite React component to follow 7-step pattern
    - Fix all props → mergedData issues
    - Add missing store subscriptions
  USE_WHEN: Component exists but doesn't follow standard pattern

COMMAND: FIX_FUNCTIONS_FILE
  EXECUTES:
    - Validate all 4 functions exist
    - Fix function signatures
    - Fix return types
    - Add missing imports
  USE_WHEN: Functions file has logic errors

COMMAND: FIX_STRUCTURE_MISMATCH
  EXECUTES:
    - Compare default data with structure fields
    - Add missing fields to structure
    - Remove non-existent fields
    - Fix field types
  USE_WHEN: Structure doesn't match default data

COMMAND: COMPLETE_REPAIR
  EXECUTES:
    - Run all 7 diagnostic layers
    - Apply all detected fixes
    - Verify all fixes
    - Generate comprehensive report
  USE_WHEN: Unknown issues or complete component audit needed
```

---

## 📊 VALIDATION CHECKLIST

### Post-Repair Verification

```
AI: Execute this checklist after repairs

□ Layer 1: All required files exist
□ Layer 2: Functions file has correct structure
  □ getDefault{ComponentType}Data exists and returns ComponentData
  □ {componentType}Functions object exists
  □ ensureVariant function logic correct
  □ getData function logic correct
  □ setData function logic correct
  □ updateByPath function logic correct

□ Layer 3: Structure file valid
  □ ComponentStructure imported
  □ {componentType}Structure exported
  □ componentType property matches
  □ At least one variant defined
  □ Fields array exists
  □ visible field present
  □ Fields match default data structure

□ Layer 4: editorStore integration complete
  □ Functions imported
  □ State property in interface
  □ Function signatures in interface
  □ State initialized
  □ ensureComponentVariant switch case
  □ getComponentData switch case
  □ setComponentData switch case
  □ updateComponentByPath switch case
  □ Specific component functions exist
  □ loadFromDatabase case exists

□ Layer 5: ComponentsList integration complete
  □ Structure imported
  □ Entry in getComponents
  □ Entry in COMPONENTS
  □ In section components array

□ Layer 6: React component follows pattern
  □ "use client" directive
  □ All required imports
  □ Props interface complete
  □ Step 1: uniqueId extraction
  □ Step 2: Store subscriptions
  □ Step 3: useEffect initialization
  □ Step 4: Data retrieval
  □ Step 5: mergedData creation
  □ Step 6: Visibility check
  □ Step 7: Render uses mergedData

□ Layer 7: Exports complete
  □ Structure exported from index
  □ Functions exported from index

□ Component appears in editor
□ Component can be added to page
□ Component renders correctly
□ EditorSidebar opens for component
□ Editing updates component
□ Changes persist after save/reload
□ Multiple instances work independently

FINAL_STATUS = ALL_CHECKS_PASSED ? "✅ COMPONENT FULLY FUNCTIONAL" : "⚠️ ISSUES REMAIN"
```

---

## 🚨 ERROR HANDLING

### When Repairs Fail

````typescript
// AI: Follow this protocol when a fix doesn't work

IF FIX_FAILS:

  1. LOG DETAILED ERROR:
     ```
     ERROR: Failed to fix {ISSUE_DETECTED}
     ATTEMPTED: {FIX_ACTION}
     REASON: {error message or reason}
     FILE: {affected file}
     LINE: {if applicable}
     ```

  2. TRY ALTERNATIVE FIX:
     - Check for variations of the issue
     - Try related fixes
     - Look for dependencies

  3. IF STILL FAILING:
     ESCALATE:
     ```
     MANUAL INTERVENTION REQUIRED

     Component: {componentType}
     Issue: {ISSUE_DETECTED}
     Severity: {SEVERITY}

     Attempted Fixes:
     1. {first attempt}
     2. {second attempt}

     Current State:
     {describe what works and what doesn't}

     Recommendations:
     {specific recommendations for manual fix}

     Related Files:
     {list all files that may need manual review}
     ```

  4. MARK ISSUE AS REQUIRES_MANUAL_REVIEW

  5. CONTINUE WITH OTHER FIXES
````

---

## 📝 FINAL REPORT TEMPLATE

```
╔════════════════════════════════════════════════════════════╗
║          COMPONENT DIAGNOSTIC AND REPAIR REPORT            ║
╚════════════════════════════════════════════════════════════╝

Component Type: {componentType}
Execution Time: {timestamp}
Total Checks: {totalChecks}
Status: {PASS/FAIL/PARTIAL}

═══════════════════════════════════════════════════════════════
DIAGNOSTIC RESULTS
═══════════════════════════════════════════════════════════════

Layer 1 - Files Existence: {PASS/FAIL}
  Issues Found: {count}
  {list issues if any}

Layer 2 - Functions Validation: {PASS/FAIL}
  Issues Found: {count}
  {list issues if any}

Layer 3 - Structure Validation: {PASS/FAIL}
  Issues Found: {count}
  {list issues if any}

Layer 4 - EditorStore Integration: {PASS/FAIL}
  Issues Found: {count}
  {list issues if any}

Layer 5 - ComponentsList Integration: {PASS/FAIL}
  Issues Found: {count}
  {list issues if any}

Layer 6 - React Component Pattern: {PASS/FAIL}
  Issues Found: {count}
  {list issues if any}

Layer 7 - Exports Validation: {PASS/FAIL}
  Issues Found: {count}
  {list issues if any}

═══════════════════════════════════════════════════════════════
ISSUES SUMMARY
═══════════════════════════════════════════════════════════════

Total Issues Found: {total}
├─ Critical: {criticalCount}
├─ High: {highCount}
├─ Medium: {mediumCount}
└─ Low: {lowCount}

═══════════════════════════════════════════════════════════════
REPAIRS APPLIED
═══════════════════════════════════════════════════════════════

Total Fixes Attempted: {totalFixes}
├─ Successful: {successCount} ✓
├─ Failed: {failedCount} ✗
└─ Skipped: {skippedCount} ⊘

Detailed Fixes:
{for each fix}
[{STATUS}] {ISSUE_DETECTED}
  Action: {FIX_ACTION}
  File: {file}
  Result: {result}
{end for}

═══════════════════════════════════════════════════════════════
POST-REPAIR VERIFICATION
═══════════════════════════════════════════════════════════════

Re-verification Results:
{checklist results}

Component Functionality:
□ Appears in editor: {YES/NO}
□ Renders correctly: {YES/NO}
□ EditorSidebar works: {YES/NO}
□ Updates in real-time: {YES/NO}
□ Saves to database: {YES/NO}
□ Loads from database: {YES/NO}
□ Multiple instances: {YES/NO}

═══════════════════════════════════════════════════════════════
REMAINING ISSUES
═══════════════════════════════════════════════════════════════

{if any issues remain}
{list each remaining issue with details}
{else}
✓ No remaining issues - Component fully functional
{end if}

═══════════════════════════════════════════════════════════════
RECOMMENDATIONS
═══════════════════════════════════════════════════════════════

{any recommendations for improvements or optimizations}

═══════════════════════════════════════════════════════════════
NEXT STEPS
═══════════════════════════════════════════════════════════════

{if all passed}
✓ Component is ready for use
✓ Run tests if available
✓ Test in production-like environment

{if issues remain}
⚠️ Manual review required for:
{list remaining critical/high issues}

Files requiring attention:
{list files}

{end if}

╚════════════════════════════════════════════════════════════╝
END OF REPORT
```

---

## 🎓 AI LEARNING PATTERNS

### Pattern Recognition

```typescript
// AI: Learn from these patterns to improve diagnosis

PATTERN_DATABASE = {
  component_not_updating: {
    symptoms: [
      "renders but doesn't update",
      "editorsidebar changes don't reflect",
      "store updates but component doesn't rerender",
    ],
    common_causes: [
      "missing store subscription",
      "using props instead of mergedData",
      "missing updateByPath switch case",
    ],
    fix_sequence: [
      "check store subscriptions in component",
      "verify mergedData usage in render",
      "check updateComponentByPath switch case",
    ],
  },

  typescript_errors: {
    symptoms: ["type errors in component", "interface errors", "import errors"],
    common_causes: [
      "missing imports",
      "incorrect types in props interface",
      "wrong function signatures",
    ],
    fix_sequence: [
      "check all imports present",
      "verify props interface matches default data",
      "check function signatures match editorStore interface",
    ],
  },

  data_persistence_issues: {
    symptoms: [
      "changes don't save",
      "data lost after refresh",
      "component resets to defaults",
    ],
    common_causes: [
      "missing loadFromDatabase case",
      "pageComponentsByPage not updating",
      "wrong component ID usage",
    ],
    fix_sequence: [
      "add loadFromDatabase case",
      "ensure setData updates pageComponentsByPage",
      "verify using uniqueId (props.id) not variantId",
    ],
  },

  // More patterns...
};

// AI: When encountering issue, match against patterns first for faster diagnosis
```

---

## 🔚 EXECUTION COMPLETION

### Final Checklist for AI

```
BEFORE COMPLETING REPAIR TASK:

✓ All 7 diagnostic layers executed
✓ All detected issues logged
✓ Fixes applied in priority order
✓ Post-repair verification completed
✓ Final report generated
✓ Remaining issues (if any) documented
✓ Next steps provided
✓ User informed of results

RESPONSE TO USER SHOULD INCLUDE:

1. Executive Summary (2-3 sentences)
2. Issues Found Count by Severity
3. Fixes Applied Count
4. Current Component Status
5. Remaining Issues (if any)
6. Recommendations
7. Offer to show detailed report if requested

EXAMPLE RESPONSE:

"I've completed a comprehensive diagnostic and repair of the '{componentType}' component.
Found and fixed {criticalCount} critical issues and {highCount} high-priority issues.
The component is now {FUNCTIONAL/PARTIALLY_FUNCTIONAL/REQUIRES_MANUAL_REVIEW}.

Summary:
- ✓ Functions file: {status}
- ✓ Structure file: {status}
- ✓ EditorStore integration: {status}
- ✓ React component: {status}
- ✓ ComponentsList registration: {status}

{if remaining issues}
Remaining issues require manual review:
{list critical remaining issues}
{end if}

Would you like to see the detailed repair report?"
```

---

**END OF COMPONENT REPAIR PROTOCOL**

**AI NOTE**: This is a comprehensive diagnostic and repair system. Execute all checks systematically and apply fixes in priority order. Always verify fixes work before marking as complete. Generate detailed reports for user review.
