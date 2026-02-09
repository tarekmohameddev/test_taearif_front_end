# Component Repair - Quick Start for AI

## 🚀 INSTANT REPAIR COMMAND

**Copy-paste this to AI with component name:**

```
EXECUTE COMPONENT REPAIR PROTOCOL

Component: {COMPONENT_NAME}
Reference: @FIX_COMPONENT_PROMPT.md
Context: @docs/important/components/ADD_NEW_COMPONENT.md

TASK: Run complete diagnostic (all 7 layers) and repair all detected issues.

REQUIRED ACTIONS:
1. Read and execute FIX_COMPONENT_PROMPT.md protocol
2. Run all diagnostic layers sequentially
3. Fix issues in priority order (Critical → High → Medium → Low)
4. Verify all fixes applied successfully
5. Generate final report

COMPONENT_TYPE = "{COMPONENT_NAME}" // e.g., "pricing", "testimonials", "gallery"

BEGIN EXECUTION NOW.
```

---

## 📋 COMMON REPAIR SCENARIOS

### Scenario 1: Component Not Updating

```
AI: Fix component "{NAME}" - it renders but doesn't update when edited

EXECUTE:
@FIX_COMPONENT_PROMPT.md
Focus: Layer 4 (editorStore) + Layer 6 (React component)
Check: updateByPath switch case, store subscriptions, mergedData usage
```

### Scenario 2: Component Not Appearing

```
AI: Fix component "{NAME}" - can't find it in editor

EXECUTE:
@FIX_COMPONENT_PROMPT.md
Focus: Layer 5 (ComponentsList)
Check: COMPONENTS registration, section array inclusion
```

### Scenario 3: Component Breaks on Load

```
AI: Fix component "{NAME}" - crashes when page loads

EXECUTE:
@FIX_COMPONENT_PROMPT.md
Focus: Layer 2 (Functions) + Layer 6 (React)
Check: default data function, ensureVariant logic, data structure
```

### Scenario 4: Changes Don't Save

```
AI: Fix component "{NAME}" - changes lost after refresh

EXECUTE:
@FIX_COMPONENT_PROMPT.md
Focus: Layer 4 (editorStore)
Check: loadFromDatabase case, pageComponentsByPage updates
```

### Scenario 5: Changes Don't Save

```
AI: Fix component "{NAME}" - changes lost after refresh

EXECUTE:
@FIX_COMPONENT_PROMPT.md
Focus: Layer 4 (editorStore)
Check: loadFromDatabase case, pageComponentsByPage updates
```

### Scenario 6: Component Shows Default Data Instead of Database Data

```
AI: Fix component "{NAME}" - shows default data in Live Editor, not database data

EXECUTE:
@FIX_COMPONENT_PROMPT.md
Focus: Layer 4 (loadFromDatabase) + Layer 6 (useEffect initialization)
Check:
1. loadFromDatabase switch case exists
2. Component useEffect uses tenantComponentData
3. getTenantComponentData called before useEffect
4. tenantComponentData in useEffect dependencies

Reference: @docs/important/liveEditor/DATABASE_DATA_LOADING.md
```

### Scenario 7: TypeScript Errors

```
AI: Fix component "{NAME}" - has TypeScript/lint errors

EXECUTE:
@FIX_COMPONENT_PROMPT.md
Focus: All layers
Check: imports, types, interfaces, function signatures
```

---

## ⚡ ULTRA-QUICK FIX COMMANDS

### Command 1: Complete Audit & Repair

```
AI: Run COMPLETE_REPAIR on component "{NAME}"
Reference: @FIX_COMPONENT_PROMPT.md
```

### Command 2: Fix Integration Only

```
AI: Run FIX_MISSING_INTEGRATION on component "{NAME}"
Reference: @FIX_COMPONENT_PROMPT.md
```

### Command 3: Fix Component Pattern

```
AI: Run FIX_COMPONENT_PATTERN on component "{NAME}"
Reference: @FIX_COMPONENT_PROMPT.md
```

### Command 4: Fix Functions File

```
AI: Run FIX_FUNCTIONS_FILE on component "{NAME}"
Reference: @FIX_COMPONENT_PROMPT.md
```

### Command 5: Fix Structure Mismatch

```
AI: Run FIX_STRUCTURE_MISMATCH on component "{NAME}"
Reference: @FIX_COMPONENT_PROMPT.md
```

---

## 🎯 DIAGNOSTIC-ONLY MODE

**Just check without fixing:**

```
AI: Run diagnostics on component "{NAME}" - DO NOT FIX yet

Execute all 7 diagnostic layers from @FIX_COMPONENT_PROMPT.md
Report all issues found
Organize by severity
Suggest fixes but don't apply them
```

---

## 📊 THE 7 DIAGNOSTIC LAYERS (Quick Reference)

```
Layer 1: Files Existence Check
└─ Verify all required files exist

Layer 2: Functions File Validation
└─ Check 4 functions + default data

Layer 3: Structure File Validation
└─ Validate fields and componentType

Layer 4: EditorStore Integration
└─ Check 9 integration points

Layer 5: ComponentsList Integration
└─ Verify registration and exports

Layer 6: React Component Pattern
└─ Validate 7-step pattern

Layer 7: Index/Exports Validation
└─ Check all exports present
```

---

## 🔍 ISSUE SEVERITY GUIDE

**CRITICAL** - Component won't work at all

- Missing files
- Missing function logic
- Missing store integration
- Component doesn't follow pattern

**HIGH** - Component partially broken

- Missing imports
- Incorrect structure
- Missing exports
- Wrong prop usage

**MEDIUM** - Component works but has issues

- Inconsistent naming
- Missing simpleFields
- Optimization opportunities

**LOW** - Minor improvements

- Code style
- Comments
- Organization

---

## 📝 EXPECTED AI RESPONSE FORMAT

```
COMPONENT REPAIR SUMMARY: {componentType}
═══════════════════════════════════════════

STATUS: ✅ REPAIRED / ⚠️ PARTIAL / ❌ FAILED

ISSUES FOUND:
├─ Critical: {count}
├─ High: {count}
├─ Medium: {count}
└─ Low: {count}

FIXES APPLIED:
├─ Successful: {count} ✓
├─ Failed: {count} ✗
└─ Manual Review: {count} ⚠️

COMPONENT FUNCTIONALITY:
✓ Appears in editor
✓ Renders correctly
✓ EditorSidebar works
✓ Updates in real-time
✓ Saves to database
✓ Multiple instances work

{if issues remain}
REMAINING ISSUES:
- {issue 1}
- {issue 2}
{end}

NEXT STEPS:
{recommendations}

[View Detailed Report? Y/N]
```

---

## 🚨 WHEN TO USE MANUAL REVIEW

AI should request manual review if:

- ❌ Multiple CRITICAL fixes failed
- ❌ Component logic is completely wrong
- ❌ Database schema changes needed
- ❌ Breaking changes required
- ❌ Custom business logic involved

---

## 💡 PRO TIPS FOR AI

1. **Always start with Layer 1** - no point checking logic if files don't exist
2. **Fix CRITICAL issues first** - they block everything else
3. **Verify each fix immediately** - don't stack unverified fixes
4. **Re-run diagnostics after repairs** - confirm nothing broke
5. **Generate detailed report** - user needs to know what changed

---

## 🔗 RELATED DOCUMENTS

- `FIX_COMPONENT_PROMPT.md` - Full repair protocol (this is the main guide)
- `ADD_NEW_COMPONENT.md` - Reference for correct structure
- `ADD_NEW_COMPONENT_PROMPT.md` - Templates for creating components
- `../liveEditor/DATABASE_DATA_LOADING.md` - Database data loading guide

---

## ⚙️ CUSTOMIZATION

### For Specific Component Types

**Global Components (Header/Footer):**

```
AI: Fix global component "{NAME}"
SPECIAL: Check globalComponentsData integration
Reference: @FIX_COMPONENT_PROMPT.md Pattern 3
```

**Multi-Variant Components:**

```
AI: Fix multi-variant component "{NAME}"
SPECIAL: Check all variant default data functions
Reference: @FIX_COMPONENT_PROMPT.md Pattern 1
```

**Form Components:**

```
AI: Fix form component "{NAME}"
SPECIAL: Check validation logic and submit handlers
Reference: @FIX_COMPONENT_PROMPT.md Pattern 2
```

---

**END OF QUICK START GUIDE**

Use this for fast component repairs. For detailed protocol, see `FIX_COMPONENT_PROMPT.md`.
