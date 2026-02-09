/**
 * @deprecated This file is kept for backward compatibility.
 * Please use the organized structure from context/editorStore/store/index.ts
 * 
 * This file now re-exports useEditorStore from the new organized structure.
 * All functionality has been moved to:
 * - context/editorStore/store/index.ts - Main store
 * - context/editorStore/store/actions/ - Action creators
 * - context/editorStore/store/initialState.ts - Initial state
 * - context/editorStore/types/types.ts - Type definitions
 * - context/editorStore/utils/deepMerge.ts - Utility functions
 */

// Re-export useEditorStore from the organized structure
export { useEditorStore } from "./editorStore/store/index";
