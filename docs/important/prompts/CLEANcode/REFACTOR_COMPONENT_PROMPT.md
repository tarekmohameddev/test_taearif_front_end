# Component Refactoring Prompt for Cursor AI

## Task: Refactor and Organize a Large Component

I need you to refactor and reorganize a large React/TypeScript component file into a clean, modular structure. **DO NOT modify any business logic, functionality, or UI behavior** - only reorganize the code structure.

## Component Path
```
[PASTE_COMPONENT_PATH_HERE]
```

## Requirements

### 1. **Structure Organization**
Split the component into a well-organized folder structure following this pattern:

```
component-name/
├── page.tsx (or index.tsx)          # Main component entry point
├── components/                       # UI sub-components
│   ├── Component1.tsx
│   ├── Component2.tsx
│   └── index.ts                      # Export all components
├── hooks/                           # Custom hooks
│   ├── useHook1.ts
│   ├── useHook2.ts
│   └── index.ts                     # Export all hooks
├── services/                        # API calls and external services
│   └── api.ts (or service.ts)
├── utils/                           # Helper functions and utilities
│   ├── helpers.ts
│   └── constants.ts
├── types/                           # TypeScript types and interfaces
│   └── types.ts
└── store/                           # State management (if applicable)
    └── store.ts
```

### 2. **File Size Limit**
- **Each file must NOT exceed 200 lines of code**
- If a file is larger, split it into smaller logical units
- Keep related functionality together

### 3. **What to Extract**

#### Extract to `components/`:
- Standalone UI components (dialogs, modals, cards, forms, etc.)
- Reusable UI elements
- Complex nested components

#### Extract to `hooks/`:
- Custom React hooks
- State management logic
- Side effects (useEffect, data fetching patterns)
- Event handlers grouped by functionality

#### Extract to `services/`:
- API calls (fetch, axios, etc.)
- External service integrations
- Data transformation functions related to API

#### Extract to `utils/`:
- Pure utility functions (no React dependencies)
- Helper functions
- Formatters, validators, constants
- Translation/formatting utilities

#### Extract to `types/`:
- TypeScript interfaces
- Type definitions
- Enums

### 4. **What NOT to Change**

❌ **DO NOT modify:**
- Business logic
- Component behavior
- UI/UX appearance
- Functionality
- State management logic (only reorganize)
- API endpoints or request/response handling
- Validation rules
- Error handling logic
- Any calculations or data processing

✅ **ONLY reorganize:**
- File structure
- Code organization
- Import/export statements
- File naming

### 5. **Naming Conventions**
- Use PascalCase for components: `ComponentName.tsx`
- Use camelCase for hooks: `useHookName.ts`
- Use camelCase for utilities: `helperFunction.ts`
- Use descriptive names that reflect functionality

### 6. **Import/Export Strategy**
- Create `index.ts` files in each folder for clean imports
- Use named exports
- Maintain backward compatibility with the original export

### 7. **Main Component File**
The main component file should:
- Import from organized sub-folders
- Contain only the main component logic
- Be clean and readable (ideally under 200 lines)
- Maintain the same props interface
- Keep the same component name

### 8. **Example Structure**

**Before:**
```typescript
// LargeComponent.tsx (2000+ lines)
export function LargeComponent() {
  // All code in one file
}
```

**After:**
```typescript
// LargeComponent/page.tsx
import { Component1, Component2 } from './components';
import { useHook1, useHook2 } from './hooks';
import { fetchData } from './services/api';
import { helperFunction } from './utils/helpers';
import type { ComponentProps } from './types';

export function LargeComponent(props: ComponentProps) {
  const hook1 = useHook1();
  const hook2 = useHook2();
  // Clean, organized main component
}
```

### 9. **Quality Checklist**

Before completing, ensure:
- [ ] All files are under 200 lines
- [ ] No business logic was changed
- [ ] All imports are correct
- [ ] Component exports are maintained
- [ ] TypeScript types are properly defined
- [ ] No console errors or linter errors
- [ ] Original functionality is preserved
- [ ] Code is more maintainable and readable

### 10. **Output**
After refactoring:
1. Show the new folder structure
2. List all created files with line counts
3. Confirm no logic changes were made
4. Verify the component still works the same way

---

## Instructions for Cursor AI

1. Read the component file at the provided path
2. Analyze its structure and identify logical groupings
3. Create the folder structure as specified
4. Extract code into appropriate files (components, hooks, services, utils, types)
5. Update imports in the main component
6. Ensure all files are under 200 lines
7. Maintain exact same functionality and behavior
8. Test that exports are correct

**Remember: This is a REFACTORING task, not a REWRITE. Preserve all logic and behavior exactly as it is.**
