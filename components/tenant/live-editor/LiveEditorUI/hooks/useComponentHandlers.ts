// ============================================================================
// Hook for component event handlers
// ============================================================================

import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { createDefaultData } from "../../EditorSidebar/utils";
import { useEditorStore } from "@/context/editorStore";
import {
  positionTracker,
  PositionDebugInfo,
  validateComponentPositions,
} from "@/services-liveeditor/live-editor/dragDrop/enhanced-position-tracker";

interface UseComponentHandlersProps {
  pageComponents: any[];
  state: any;
  selectedComponentId: string | null;
  setDebugInfo: (info: PositionDebugInfo | null) => void;
  setPositionValidation: (validation: any) => void;
  setWasComponentsSidebarManuallyClosed: (value: boolean) => void;
}

export function useComponentHandlers({
  pageComponents,
  state,
  selectedComponentId,
  setDebugInfo,
  setPositionValidation,
  setWasComponentsSidebarManuallyClosed,
}: UseComponentHandlersProps) {
  // دالة بسيطة لإضافة رقم 1 لكل مكون
  const getComponentNameWithOne = useCallback(
    (componentType: string): string => {
      // إذا كان المكون يحتوي بالفعل على رقم، لا نضيف رقم آخر
      if (componentType.match(/\d+$/)) {
        return componentType;
      }
      return `${componentType}1`;
    },
    [],
  );

  // دالة إضافة مكون جديد - محسنة لتعمل مع النظام الجديد
  const handleAddComponent = useCallback(
    (componentData: {
      type: string;
      zone: string;
      index: number;
      data?: any;
      variant?: string;
      sourceData?: any;
    }) => {
      // تحويل componentType إلى camelCase
      const normalizedComponentType = componentData.type
        .replace(/\s+/g, "")
        .replace(/^\w/, (c) => c.toLowerCase());

      // استخدام variant من sourceData إذا كان موجوداً، وإلا استخدم getComponentNameWithOne
      const componentName =
        componentData.variant ||
        getComponentNameWithOne(normalizedComponentType);

      const newComponent = {
        id: uuidv4(),
        type: normalizedComponentType,
        name:
          componentData.type.charAt(0).toUpperCase() +
          componentData.type.slice(1),
        componentName,
        data: createDefaultData(normalizedComponentType),
        layout: {
          row: pageComponents.length,
          col: 0,
          span: 2,
        },
      };

      // إضافة المكون في الموضع المحدد مع تحديث محسن
      const updatedComponents = [...pageComponents];
      const targetIndex = Math.min(
        componentData.index,
        updatedComponents.length,
      );
      updatedComponents.splice(targetIndex, 0, newComponent);

      // تحديث الحالة مع تنشيط الحدث
      state.setPageComponents(updatedComponents);

      // تحديد المكون الجديد تلقائياً
      setTimeout(() => {
        state.setSelectedComponentId?.(newComponent.id);
      }, 100);

      // إعادة تعيين علامة الإغلاق اليدوي عند إضافة مكون جديد
      setWasComponentsSidebarManuallyClosed(false);
    },
    [
      pageComponents,
      state,
      getComponentNameWithOne,
      setWasComponentsSidebarManuallyClosed,
    ],
  );

  // دالة نقل مكون محسنة - تستقبل النتيجة المعالجة مسبقاً
  const handleMoveComponent = useCallback(
    (
      sourceIndex: number,
      sourceZone: string,
      finalIndex: number,
      destinationZone: string,
      updatedComponents?: any[],
      debugInfo?: PositionDebugInfo,
    ) => {
      // إذا كانت البيانات المحدثة متوفرة، استخدمها مباشرة
      if (updatedComponents && debugInfo) {
        // تحديث الحالة بالمكونات المحدثة
        state.setPageComponents(updatedComponents);

        // Update pageComponentsByPage in the store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(currentPage, updatedComponents);
        }, 0);

        // حفظ معلومات التصحيح
        setDebugInfo(debugInfo);

        // إبقاء المكون محدداً بعد النقل
        const movedComponent = updatedComponents[finalIndex];
        if (selectedComponentId === movedComponent?.id) {
          setTimeout(() => {
            state.setSelectedComponentId?.(movedComponent.id);
          }, 100);
        }

        // التحقق من صحة الحالة بعد النقل
        const validation = validateComponentPositions(updatedComponents);
        setPositionValidation(validation);

        // تحديث position tracker
        positionTracker.recordState(updatedComponents, "enhanced-move");

        return;
      }

      // Fallback: المعالجة التقليدية إذا لم تكن البيانات متوفرة

      // تحديث position properties لجميع المكونات قبل النقل
      const componentsWithPositions = pageComponents.map(
        (comp: any, index: number) => ({
          ...comp,
          position: index,
          layout: {
            ...comp.layout,
            row: index,
          },
        }),
      );

      // استخدام position tracker المحسن
      const result = positionTracker.trackComponentMove(
        componentsWithPositions,
        sourceIndex,
        sourceZone,
        finalIndex,
        destinationZone,
      );

      if (result.success) {
        state.setPageComponents(result.updatedComponents);
        setDebugInfo(result.debugInfo);

        // Update pageComponentsByPage in the store
        setTimeout(() => {
          const store = useEditorStore.getState();
          const currentPage = store.currentPage;
          store.forceUpdatePageComponents(
            currentPage,
            result.updatedComponents,
          );
        }, 0);

        const validation = validateComponentPositions(result.updatedComponents);
        setPositionValidation(validation);

        // تحديث position tracker
        positionTracker.recordState(result.updatedComponents, "fallback-move");
      } else {
        setDebugInfo(result.debugInfo);
      }
    },
    [
      pageComponents,
      state,
      selectedComponentId,
      setDebugInfo,
      setPositionValidation,
    ],
  );

  // دالة معالجة معلومات التصحيح
  const handlePositionDebug = useCallback(
    (debugInfo: PositionDebugInfo) => {
      setDebugInfo(debugInfo);
    },
    [setDebugInfo],
  );

  // دالة تنظيف وإعادة تعيين المواضع
  const handleResetPositions = useCallback(() => {
    const resetComponents = pageComponents.map((comp: any, index: number) => ({
      ...comp,
      position: index,
      layout: {
        ...comp.layout,
        row: index,
      },
    }));

    state.setPageComponents(resetComponents);
    positionTracker.recordState(resetComponents, "manual-reset");

    // Update pageComponentsByPage in the store
    setTimeout(() => {
      const store = useEditorStore.getState();
      const currentPage = store.currentPage;
      store.forceUpdatePageComponents(currentPage, resetComponents);
    }, 0);

    const validation = validateComponentPositions(resetComponents);
    setPositionValidation(validation);
  }, [pageComponents, state, setPositionValidation]);

  return {
    handleAddComponent,
    handleMoveComponent,
    handlePositionDebug,
    handleResetPositions,
    getComponentNameWithOne,
  };
}
